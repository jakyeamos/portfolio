#!/usr/bin/env node
/**
 * scripts/sync-tracker.mjs
 *
 * Syncs dynamic tracker fields from each project's PROJECT_TRUTH.md into
 * src/content/currentProjects.ts.
 *
 * Fields synced (source frontmatter → TS field):
 *   healthScore   → trackerScore
 *   statusLabel   → trackerStatus
 *   nextStep      → trackerComment
 *   lastUpdated   → lastUpdated
 *
 * Static editorial fields (grades, scoutTake, summary, tags, shortCode) are
 * never touched by this script.
 *
 * Run:  node scripts/sync-tracker.mjs
 * Wire: pnpm sync  (see package.json)
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DATA_FILE = resolve(ROOT, 'src/content/currentProjects.ts');

const VALID_STATUSES = new Set(['on_track', 'needs_attention', 'stalled']);

/** Parse YAML frontmatter (simple key: scalar only — no arrays/objects). */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const result = {};
  for (const line of match[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.+)$/);
    if (kv) {
      // Strip surrounding single or double quotes
      result[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '');
    }
  }
  return result;
}

/** Derive statusLabel from healthScore when field is absent. */
function deriveStatus(score) {
  if (score >= 70) return 'on_track';
  if (score >= 50) return 'needs_attention';
  return 'stalled';
}

/** Apply field updates to a single project object block (string). */
function patchBlock(block, { trackerScore, trackerStatus, trackerComment, lastUpdated }) {
  let b = block;

  b = b.replace(/\btrackerScore:\s*\d+/, `trackerScore: ${trackerScore}`);
  b = b.replace(/\btrackerStatus:\s*'[^']+'/, `trackerStatus: '${trackerStatus}'`);
  // trackerComment may be on the same line or the next line
  b = b.replace(
    /\btrackerComment:\s*\n?\s*'[^']*'/,
    `trackerComment:\n      '${trackerComment}'`,
  );
  b = b.replace(/\blastUpdated:\s*'[^']+'/, `lastUpdated: '${lastUpdated}'`);

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

// ─── Main ────────────────────────────────────────────────────────────────────

let source = readFileSync(DATA_FILE, 'utf8');

// Collect every trackerPath value
const paths = [...source.matchAll(/trackerPath:\s*'([^']+)'/g)].map((m) => m[1]);

if (paths.length === 0) {
  console.error('No trackerPath entries found in', DATA_FILE);
  process.exit(1);
}

let changed = 0;
let skipped = 0;

for (const trackerPath of paths) {
  const shortName = trackerPath.split('/').slice(-4, -2).join('/');

  // Read tracker file
  let raw;
  try {
    raw = readFileSync(trackerPath, 'utf8');
  } catch {
    console.warn(`  skip  ${shortName}  (file not found: ${trackerPath})`);
    skipped++;
    continue;
  }

  const fm = parseFrontmatter(raw);
  if (!fm) {
    console.warn(`  skip  ${shortName}  (no frontmatter)`);
    skipped++;
    continue;
  }

  const trackerScore = parseInt(fm.healthScore, 10);
  const trackerStatus = VALID_STATUSES.has(fm.statusLabel)
    ? fm.statusLabel
    : deriveStatus(trackerScore);
  const trackerComment = fm.nextStep;
  const lastUpdated = fm.lastUpdated;

  if (isNaN(trackerScore) || !trackerComment || !lastUpdated) {
    console.warn(
      `  skip  ${shortName}  (incomplete frontmatter — ` +
        `score=${fm.healthScore} nextStep=${!!fm.nextStep} date=${fm.lastUpdated})`,
    );
    skipped++;
    continue;
  }

  // Escape single quotes inside the comment string
  const safeComment = trackerComment.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

  const loc = findObjectBlock(source, `trackerPath: '${trackerPath}'`);
  if (!loc) {
    console.warn(`  skip  ${shortName}  (block not found in source)`);
    skipped++;
    continue;
  }

  const newBlock = patchBlock(loc.block, {
    trackerScore,
    trackerStatus,
    trackerComment: safeComment,
    lastUpdated,
  });

  if (newBlock === loc.block) {
    console.log(`  ─     ${shortName}  (up to date)`);
  } else {
    source = source.slice(0, loc.start) + newBlock + source.slice(loc.end);
    changed++;
    console.log(`  ✓     ${shortName}  score=${trackerScore}  status=${trackerStatus}  date=${lastUpdated}`);
  }
}

if (changed > 0) {
  writeFileSync(DATA_FILE, source);
  console.log(`\nWrote ${changed} update(s) → ${DATA_FILE}`);
} else {
  console.log('\nAll projects already up to date.');
}

if (skipped > 0) {
  console.log(`${skipped} project(s) skipped — check warnings above.`);
}
