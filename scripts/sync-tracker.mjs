#!/usr/bin/env node

/**
 * Refreshes the three public-safe tracker fields in currentProjects.ts.
 *
 * The public portfolio deliberately owns `portfolioUpdate` copy. This script
 * never reads or publishes a sibling project's operational next step.
 *
 * Safe by default: without --write the script only reports drift.
 */

import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DATA_FILE = resolve(ROOT, 'src/content/currentProjects.ts');
const MAP_FILE = resolve(ROOT, '.tracker/evidence-map.json');
const VALID_STATUSES = new Set(['on_track', 'needs_attention', 'stalled', 'shipped']);
const STRING_LITERAL_PATTERN = String.raw`(["'])((?:\\.|(?!\1)[\s\S])*)\1`;
const args = new Set(process.argv.slice(2));
const writeMode = args.has('--write');

if (writeMode && args.has('--check')) {
  console.error('Use either --write or --check, not both.');
  process.exit(1);
}

function expandAndResolvePath(pathValue) {
  return isAbsolute(pathValue) ? pathValue : resolve(ROOT, pathValue);
}

function normalizeKey(value) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function unescapeStringLiteral(rawValue) {
  return rawValue.replace(/\\(["'\\])/g, '$1');
}

function toSingleQuotedStringLiteral(value) {
  return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const result = {};
  for (const line of match[1].split('\n')) {
    const keyValue = line.match(/^(\w+):\s*(.+)$/);
    if (!keyValue) continue;
    result[keyValue[1]] = keyValue[2].trim().replace(/^["']|["']$/g, '');
  }
  return result;
}

function deriveStatus(score) {
  if (score >= 70) return 'on_track';
  if (score >= 50) return 'needs_attention';
  return 'stalled';
}

function findObjectBlockAt(source, index) {
  let start = index;
  while (start > 0 && source[start] !== '{') start -= 1;

  let depth = 1;
  let end = start + 1;
  while (end < source.length && depth > 0) {
    if (source[end] === '{') depth += 1;
    if (source[end] === '}') depth -= 1;
    end += 1;
  }

  return { start, end, block: source.slice(start, end) };
}

function findProjectObjectBlock(source, slug) {
  const escapedSlug = slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = source.match(new RegExp(`\\bslug:\\s*(["'])${escapedSlug}\\1`));
  return match?.index === undefined ? null : findObjectBlockAt(source, match.index);
}

function readCurrentProjectSlugs(source) {
  const currentProjectsStart = source.indexOf('export const CURRENT_PROJECTS');
  const closedProjectsStart = source.indexOf('export const CLOSED_PROJECTS');
  const catalog = source.slice(currentProjectsStart, closedProjectsStart);
  const slugs = [];

  for (const match of catalog.matchAll(new RegExp(`\\bslug:\\s*${STRING_LITERAL_PATTERN}`, 'g'))) {
    slugs.push(unescapeStringLiteral(match[2]));
  }

  return slugs;
}

function loadTrackerMap() {
  if (!existsSync(MAP_FILE)) {
    throw new Error(`Missing tracker map: ${MAP_FILE}`);
  }

  const parsed = JSON.parse(readFileSync(MAP_FILE, 'utf8'));
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Tracker map must be an object.');
  }

  const sourceEntries = Object.entries(parsed.sources ?? {});
  const manualEntries = Array.isArray(parsed.manual) ? parsed.manual : [];
  const sources = new Map();

  for (const [rawSlug, rawSource] of sourceEntries) {
    if (typeof rawSource === 'string') {
      sources.set(normalizeKey(rawSlug), {
        type: 'frontmatter',
        path: expandAndResolvePath(rawSource),
      });
      continue;
    }
    if (!rawSource || typeof rawSource !== 'object' || Array.isArray(rawSource)) {
      throw new Error(`Tracker source for ${rawSlug} must be a path or typed source.`);
    }
    const type = rawSource.type;
    const pathValue = rawSource.path;
    if (type !== 'leverage-public-projection' || typeof pathValue !== 'string') {
      throw new Error(`Unsupported tracker source for ${rawSlug}.`);
    }
    const project = rawSource.project;
    if (project !== undefined && typeof project !== 'string') {
      throw new Error(`Tracker projection name for ${rawSlug} must be a string.`);
    }
    sources.set(normalizeKey(rawSlug), {
      type,
      path: expandAndResolvePath(pathValue),
      project: project ?? rawSlug,
    });
  }

  const manual = new Set();
  for (const rawSlug of manualEntries) {
    if (typeof rawSlug !== 'string') {
      throw new Error('Manual tracker entries must be strings.');
    }
    manual.add(normalizeKey(rawSlug));
  }

  return { sources, manual };
}

function validateTrackerMap(slugs, trackerMap) {
  const known = new Set([...trackerMap.sources.keys(), ...trackerMap.manual]);
  const duplicates = [...trackerMap.sources.keys()].filter((slug) => trackerMap.manual.has(slug));
  const missing = slugs.filter((slug) => !known.has(normalizeKey(slug)));
  const unused = [...known].filter(
    (slug) => !slugs.some((projectSlug) => normalizeKey(projectSlug) === slug),
  );

  if (duplicates.length > 0 || missing.length > 0 || unused.length > 0) {
    const details = [
      duplicates.length > 0 ? `duplicated: ${duplicates.join(', ')}` : null,
      missing.length > 0 ? `missing: ${missing.join(', ')}` : null,
      unused.length > 0 ? `unused: ${unused.join(', ')}` : null,
    ]
      .filter(Boolean)
      .join('; ');
    throw new Error(`Invalid tracker map (${details}).`);
  }
}

function patchTrackerFields(block, { trackerScore, trackerStatus, lastUpdated }) {
  return block
    .replace(/\btrackerScore:\s*\d+/, `trackerScore: ${trackerScore}`)
    .replace(
      new RegExp(`\\btrackerStatus:\\s*${STRING_LITERAL_PATTERN}`),
      `trackerStatus: ${toSingleQuotedStringLiteral(trackerStatus)}`,
    )
    .replace(
      new RegExp(`\\blastUpdated:\\s*${STRING_LITERAL_PATTERN}`),
      `lastUpdated: ${toSingleQuotedStringLiteral(lastUpdated)}`,
    );
}

function readLeverageProjection(source, fallbackProject) {
  if (!existsSync(source.path)) {
    throw new Error(`Missing leverage projection directory: ${source.path}`);
  }

  const candidates = readdirSync(source.path)
    .filter((name) => name.startsWith('portfolio-humanized-') && name.endsWith('.json'))
    .map((name) => ({
      name,
      path: resolve(source.path, name),
      modified: statSync(resolve(source.path, name)).mtimeMs,
    }))
    .sort((left, right) => right.modified - left.modified || right.name.localeCompare(left.name));

  for (const candidate of candidates) {
    const payload = JSON.parse(readFileSync(candidate.path, 'utf8'));
    validateLeverageProjection(payload, candidate.path);
    const projectName = source.project ?? fallbackProject;
    const project = payload.projects.find(
      (entry) => normalizeKey(entry.project_name) === normalizeKey(projectName),
    );
    if (!project) continue;
    if (
      !VALID_STATUSES.has(project.tracker_status) ||
      !Number.isInteger(project.tracker_score) ||
      project.tracker_score < 0 ||
      project.tracker_score > 100 ||
      typeof project.last_updated !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}(?:$|T)/.test(project.last_updated)
    ) {
      throw new Error(`Projection has no complete tracker fields for ${projectName}.`);
    }
    return {
      trackerScore: project.tracker_score,
      trackerStatus: project.tracker_status,
      lastUpdated: project.last_updated,
    };
  }

  throw new Error(`Projection does not contain ${source.project ?? fallbackProject}.`);
}

function validateLeverageProjection(payload, sourcePath) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new Error(`Leverage projection must be an object: ${sourcePath}`);
  }
  if (payload.schema_version !== 'leverage-portfolio-public/v1') {
    throw new Error(`Unsupported leverage projection schema: ${sourcePath}`);
  }
  if (
    payload.publication_status !== 'pending_manual_publish' ||
    payload.manual_review_required !== true
  ) {
    throw new Error(`Leverage projection is not review-gated: ${sourcePath}`);
  }
  if (!Array.isArray(payload.projects)) {
    throw new Error(`Leverage projection has no project list: ${sourcePath}`);
  }
  assertProjectionSafe(payload, 'root');
  for (const project of payload.projects) {
    if (!project || typeof project !== 'object' || Array.isArray(project)) {
      throw new Error(`Leverage projection contains an invalid project: ${sourcePath}`);
    }
    if (
      typeof project.project_name !== 'string' ||
      (project.tracker_status !== null && !VALID_STATUSES.has(project.tracker_status)) ||
      (project.tracker_score !== null &&
        (!Number.isInteger(project.tracker_score) ||
          project.tracker_score < 0 ||
          project.tracker_score > 100)) ||
      (project.last_updated !== null &&
        (typeof project.last_updated !== 'string' ||
          !/^\d{4}-\d{2}-\d{2}(?:$|T)/.test(project.last_updated)))
    ) {
      throw new Error(`Leverage projection has invalid tracker fields: ${sourcePath}`);
    }
  }
}

function assertProjectionSafe(value, location) {
  const forbiddenKeys = [
    'prompt',
    'code',
    'diff',
    'transcript',
    'path',
    'credential',
    'secret',
    'token',
    'sha',
    'branch',
    'command',
    'executable',
    'model',
    'worktree',
    'rollback',
  ];
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertProjectionSafe(item, `${location}[${index}]`));
    return;
  }
  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      if (forbiddenKeys.some((term) => key.toLowerCase().includes(term))) {
        throw new Error(`Forbidden leverage projection key at ${location}.${key}`);
      }
      assertProjectionSafe(child, `${location}.${key}`);
    }
    return;
  }
  if (typeof value === 'string') {
    const lowered = value.toLowerCase();
    if (
      ['/users/', '\\users\\', 'api_key', 'bearer ', '-----begin'].some((term) =>
        lowered.includes(term),
      )
    ) {
      throw new Error(`Sensitive-looking leverage projection value at ${location}`);
    }
  }
}

let source = readFileSync(DATA_FILE, 'utf8');
const projectSlugs = readCurrentProjectSlugs(source);

if (projectSlugs.length === 0) {
  console.error(`No current projects found in ${DATA_FILE}`);
  process.exit(1);
}

let trackerMap;
try {
  trackerMap = loadTrackerMap();
  validateTrackerMap(projectSlugs, trackerMap);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

let changed = 0;
let manual = 0;

console.log(`Loaded ${projectSlugs.length} current projects from ${DATA_FILE}`);

for (const slug of projectSlugs) {
  const key = normalizeKey(slug);
  if (trackerMap.manual.has(key)) {
    manual += 1;
    console.log(`  manual ${slug}`);
    continue;
  }

  const trackerSource = trackerMap.sources.get(key);
  if (!trackerSource || !existsSync(trackerSource.path)) {
    console.error(`  missing ${slug} source`);
    process.exitCode = 1;
    continue;
  }

  let trackerScore;
  let trackerStatus;
  let lastUpdated;
  if (trackerSource.type === 'leverage-public-projection') {
    try {
      ({ trackerScore, trackerStatus, lastUpdated } = readLeverageProjection(trackerSource, slug));
    } catch (error) {
      console.error(
        `  invalid ${slug} leverage projection: ${error instanceof Error ? error.message : String(error)}`,
      );
      process.exitCode = 1;
      continue;
    }
  } else {
    const frontmatter = parseFrontmatter(readFileSync(trackerSource.path, 'utf8'));
    trackerScore = Number.parseInt(frontmatter?.healthScore ?? '', 10);
    trackerStatus = VALID_STATUSES.has(frontmatter?.statusLabel)
      ? frontmatter.statusLabel
      : deriveStatus(trackerScore);
    lastUpdated = frontmatter?.lastUpdated;
  }

  if (Number.isNaN(trackerScore) || !lastUpdated) {
    console.error(`  invalid ${slug} public tracker fields`);
    process.exitCode = 1;
    continue;
  }

  const location = findProjectObjectBlock(source, slug);
  if (!location) {
    console.error(`  missing ${slug} project record`);
    process.exitCode = 1;
    continue;
  }

  const updatedBlock = patchTrackerFields(location.block, {
    trackerScore,
    trackerStatus,
    lastUpdated,
  });

  if (updatedBlock === location.block) {
    console.log(`  clean  ${slug}`);
    continue;
  }

  source = source.slice(0, location.start) + updatedBlock + source.slice(location.end);
  changed += 1;
  console.log(`  drift  ${slug}`);
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

if (changed === 0) {
  console.log(`Tracker public fields are current (${manual} manual entries).`);
  process.exit(0);
}

if (!writeMode) {
  console.error(
    `Tracker drift detected in ${changed} project(s). Run pnpm tracker:sync to apply it.`,
  );
  process.exit(1);
}

writeFileSync(DATA_FILE, source);
console.log(`Wrote ${changed} public-safe tracker update(s) to ${DATA_FILE}.`);
