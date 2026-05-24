#!/usr/bin/env node
/**
 * scripts/sync-tracker.mjs
 *
 * Syncs dynamic tracker fields from project truth files into
 * src/content/currentProjects.ts.
 *
 * Fields synced (source frontmatter -> TS field):
 *   healthScore   -> trackerScore
 *   statusLabel   -> trackerStatus
 *   nextStep      -> trackerComment
 *   lastUpdated   -> lastUpdated
 *
 * Tracker source resolution order (first match wins):
 *   1. Optional overrides in .tracker/truth-map.json (slug/title -> path)
 *   2. Legacy inline trackerPath on a project object (if present)
 *   3. Auto-discovery of .tracker/PROJECT_TRUTH.md under search roots
 *
 * Optional env vars:
 *   PORTFOLIO_TRUTH_ROOTS      Comma-separated discovery roots
 *   PORTFOLIO_TRUTH_MAX_DEPTH  Max folder depth for discovery (default: 3)
 *
 * Run:
 *   node scripts/sync-tracker.mjs
 */

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { basename, dirname, isAbsolute, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DATA_FILE = resolve(ROOT, 'src/content/currentProjects.ts');
const MAP_FILE = resolve(ROOT, '.tracker/truth-map.json');

const DEFAULT_DISCOVERY_ROOTS = [resolve(ROOT, '..')];
const DISCOVERY_ROOTS = parseDiscoveryRoots(process.env.PORTFOLIO_TRUTH_ROOTS);
const DISCOVERY_MAX_DEPTH = parseDepth(process.env.PORTFOLIO_TRUTH_MAX_DEPTH, 3);

const VALID_STATUSES = new Set(['on_track', 'needs_attention', 'stalled']);
const IGNORED_DIRS = new Set([
  '.git',
  'node_modules',
  '.next',
  '.turbo',
  'dist',
  'build',
  'coverage',
  '.venv',
  'venv',
]);

function parseDiscoveryRoots(raw) {
  if (!raw || raw.trim().length === 0) {
    return DEFAULT_DISCOVERY_ROOTS;
  }

  return raw
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .map(expandAndResolvePath);
}

function parseDepth(raw, fallback) {
  const parsed = Number.parseInt(raw ?? '', 10);
  if (Number.isNaN(parsed) || parsed < 1) {
    return fallback;
  }
  return parsed;
}

function expandAndResolvePath(pathValue) {
  let value = pathValue;
  if (value.startsWith('~/')) {
    value = resolve(homedir(), value.slice(2));
  }
  if (isAbsolute(value)) {
    return value;
  }
  return resolve(ROOT, value);
}

/** Parse YAML frontmatter (simple key: scalar only — no arrays/objects). */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const result = {};
  for (const line of match[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.+)$/);
    if (!kv) continue;

    // Strip surrounding single or double quotes
    result[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '');
  }
  return result;
}

/** Derive statusLabel from healthScore when field is absent. */
function deriveStatus(score) {
  if (score >= 70) return 'on_track';
  if (score >= 50) return 'needs_attention';
  return 'stalled';
}

function normalizeKey(value) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function parseQuotedField(block, fieldName) {
  const escaped = fieldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`\\b${escaped}:\\s*'((?:\\\\.|[^'\\\\])*)'`);
  const match = block.match(re);
  if (!match) return null;
  return match[1].replace(/\\\\/g, '\\').replace(/\\'/g, "'");
}

/** Apply field updates to a single project object block (string). */
function patchBlock(block, { trackerScore, trackerStatus, trackerComment, lastUpdated }) {
  let b = block;
  const quoted = String.raw`'(?:\\.|[^'\\])*'`;

  b = b.replace(/\btrackerScore:\s*\d+/, `trackerScore: ${trackerScore}`);
  b = b.replace(new RegExp(`\\btrackerStatus:\\s*${quoted}`), `trackerStatus: '${trackerStatus}'`);
  b = b.replace(
    new RegExp(`\\btrackerComment:\\s*\\n?\\s*${quoted}`),
    `trackerComment:\n      '${trackerComment}'`,
  );
  b = b.replace(new RegExp(`\\blastUpdated:\\s*${quoted}`), `lastUpdated: '${lastUpdated}'`);

  return b;
}

/** Slice out the JS object block that contains `needle`. */
function findObjectBlock(source, needle) {
  const idx = source.indexOf(needle);
  if (idx === -1) return null;

  let start = idx;
  while (start > 0 && source[start] !== '{') start--;

  let depth = 1;
  let end = start + 1;
  while (end < source.length && depth > 0) {
    if (source[end] === '{') depth++;
    else if (source[end] === '}') depth--;
    end++;
  }

  return { start, end, block: source.slice(start, end) };
}

function readProjectCatalog(source) {
  const currentProjectsStart = source.indexOf('export const CURRENT_PROJECTS');
  const closedProjectsStart = source.indexOf('export const CLOSED_PROJECTS');
  const catalogSource =
    currentProjectsStart >= 0 && closedProjectsStart > currentProjectsStart
      ? source.slice(currentProjectsStart, closedProjectsStart)
      : source;
  const projects = [];
  const seen = new Set();

  for (const match of catalogSource.matchAll(/slug:\s*'([^']+)'/g)) {
    const slug = match[1];
    if (seen.has(slug)) continue;
    seen.add(slug);

    const loc = findObjectBlock(source, `slug: '${slug}'`);
    if (!loc) continue;

    const title = parseQuotedField(loc.block, 'title') ?? slug;
    const shortCode = parseQuotedField(loc.block, 'shortCode') ?? '';
    const trackerPath = parseQuotedField(loc.block, 'trackerPath');

    projects.push({ slug, title, shortCode, trackerPath });
  }

  return projects;
}

function loadExplicitMap() {
  if (!existsSync(MAP_FILE)) {
    return new Map();
  }

  let parsed;
  try {
    parsed = JSON.parse(readFileSync(MAP_FILE, 'utf8'));
  } catch (error) {
    console.warn(`Could not parse ${MAP_FILE}: ${String(error)}`);
    return new Map();
  }

  const map = new Map();
  for (const [rawKey, rawValue] of Object.entries(parsed)) {
    if (typeof rawKey !== 'string' || typeof rawValue !== 'string') continue;
    map.set(normalizeKey(rawKey), expandAndResolvePath(rawValue));
  }

  return map;
}

function walkForTruthFiles(dirPath, depth, out) {
  if (depth > DISCOVERY_MAX_DEPTH) return;

  let entries;
  try {
    entries = readdirSync(dirPath, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    if (entry.isSymbolicLink()) continue;

    const fullPath = resolve(dirPath, entry.name);

    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name)) continue;

      if (entry.name === '.tracker') {
        const truthPath = resolve(fullPath, 'PROJECT_TRUTH.md');
        if (existsSync(truthPath)) {
          out.push(truthPath);
        }
        continue;
      }

      walkForTruthFiles(fullPath, depth + 1, out);
    }
  }
}

function discoverTruthFiles() {
  const files = [];
  for (const rootPath of DISCOVERY_ROOTS) {
    walkForTruthFiles(rootPath, 0, files);
  }
  return files;
}

function buildDiscoveryIndex(truthFiles) {
  const index = new Map();

  for (const truthPath of truthFiles) {
    let content;
    try {
      content = readFileSync(truthPath, 'utf8');
    } catch {
      continue;
    }

    const fm = parseFrontmatter(content);
    if (!fm || !fm.projectName) continue;

    const repoName = basename(dirname(dirname(truthPath)));
    const candidates = new Set([normalizeKey(fm.projectName), normalizeKey(repoName)]);
    const date = fm.lastUpdated ?? '';

    for (const key of candidates) {
      if (!key) continue;

      const existing = index.get(key);
      if (!existing || date > existing.lastUpdated) {
        index.set(key, { truthPath, lastUpdated: date });
      }
    }
  }

  return index;
}

function resolveTrackerPath(project, explicitMap, discoveryIndex) {
  const explicitCandidates = [project.slug, project.title].map(normalizeKey);
  for (const candidate of explicitCandidates) {
    const mapped = explicitMap.get(candidate);
    if (mapped) {
      return mapped;
    }
  }

  if (project.trackerPath) {
    return expandAndResolvePath(project.trackerPath);
  }

  const discoveryCandidates = [project.slug, project.title].map(normalizeKey);
  for (const candidate of discoveryCandidates) {
    const discovered = discoveryIndex.get(candidate);
    if (discovered) {
      return discovered.truthPath;
    }
  }

  return null;
}

// --- Main -------------------------------------------------------------------

let source = readFileSync(DATA_FILE, 'utf8');
const projects = readProjectCatalog(source);

if (projects.length === 0) {
  console.error('No projects found in', DATA_FILE);
  process.exit(1);
}

const explicitMap = loadExplicitMap();
const discoveredTruthFiles = discoverTruthFiles();
const discoveryIndex = buildDiscoveryIndex(discoveredTruthFiles);

const truthCache = new Map();
let changed = 0;
let skipped = 0;
let missingSource = 0;

console.log(`Loaded ${projects.length} project entries from ${DATA_FILE}`);
console.log(
  `Tracker sources: explicit-map=${explicitMap.size} discovered-files=${discoveredTruthFiles.length}`,
);

for (const project of projects) {
  const trackerPath = resolveTrackerPath(project, explicitMap, discoveryIndex);

  if (!trackerPath) {
    console.warn(`  skip  ${project.slug}  (no PROJECT_TRUTH source found)`);
    missingSource++;
    continue;
  }

  let fm = truthCache.get(trackerPath);
  if (!fm) {
    let raw;
    try {
      raw = readFileSync(trackerPath, 'utf8');
    } catch {
      console.warn(`  skip  ${project.slug}  (file not found: ${trackerPath})`);
      skipped++;
      continue;
    }

    fm = parseFrontmatter(raw);
    if (!fm) {
      console.warn(`  skip  ${project.slug}  (no frontmatter: ${trackerPath})`);
      skipped++;
      continue;
    }

    truthCache.set(trackerPath, fm);
  }

  const trackerScore = Number.parseInt(fm.healthScore, 10);
  const trackerStatus = VALID_STATUSES.has(fm.statusLabel)
    ? fm.statusLabel
    : deriveStatus(trackerScore);
  const trackerComment = fm.nextStep;
  const lastUpdated = fm.lastUpdated;

  if (Number.isNaN(trackerScore) || !trackerComment || !lastUpdated) {
    console.warn(
      `  skip  ${project.slug}  (incomplete frontmatter — ` +
        `score=${fm.healthScore} nextStep=${Boolean(fm.nextStep)} date=${fm.lastUpdated})`,
    );
    skipped++;
    continue;
  }

  const loc = findObjectBlock(source, `slug: '${project.slug}'`);
  if (!loc) {
    console.warn(`  skip  ${project.slug}  (project block not found in source)`);
    skipped++;
    continue;
  }

  // Escape single quotes and backslashes inside single-quoted TS string literals.
  const safeComment = trackerComment.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  const newBlock = patchBlock(loc.block, {
    trackerScore,
    trackerStatus,
    trackerComment: safeComment,
    lastUpdated,
  });

  if (newBlock === loc.block) {
    console.log(`  --    ${project.slug}  (up to date)`);
  } else {
    source = source.slice(0, loc.start) + newBlock + source.slice(loc.end);
    changed++;
    console.log(`  ok    ${project.slug}  score=${trackerScore} status=${trackerStatus} date=${lastUpdated}`);
  }
}

if (changed > 0) {
  writeFileSync(DATA_FILE, source);
  console.log(`\nWrote ${changed} update(s) -> ${DATA_FILE}`);
} else {
  console.log('\nNo updates written.');
}

if (missingSource > 0) {
  console.log(`${missingSource} project(s) had no discoverable truth source.`);
}
if (skipped > 0) {
  console.log(`${skipped} project(s) skipped due to read/parse/validation issues.`);
}
