#!/usr/bin/env node
import { readdirSync, readFileSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const featureDirectory = resolve(root, 'src/features/easter-eggs');
const definitionsPath = resolve(featureDirectory, 'definitions.ts');
const typesPath = resolve(featureDirectory, 'types.ts');
const definitionsSource = readFileSync(definitionsPath, 'utf8');
const typesSource = readFileSync(typesPath, 'utf8');

const expectedIds = [
  'build-ship',
  'draft-lottery',
  'chalkboard-play',
  'player-comp-mixer',
  'directors-cut',
  'box-score-footnotes',
  'night-shift',
  'notebook-margin',
  'locker-room-note',
  'off-the-board',
];
const validSurfaces = [
  'draft-desk',
  'prospect-poster',
  'project-court',
  'hybrid-read',
  'film-room-case',
  'home-proof',
  'footer-final-buzzer',
  'blog-notebook',
  'scouting-notes',
  'unknown-route',
];

function fail(message) {
  console.error(`[FAIL] ${message}`);
  process.exitCode = 1;
}

const definitionBlock = definitionsSource.match(
  /EASTER_EGG_DEFINITIONS[^=]*=([\s\S]*?)as const satisfies|EASTER_EGG_DEFINITIONS[^=]*=([\s\S]*?)as const;/,
);
const parsedDefinitions = definitionBlock?.[1] ?? definitionBlock?.[2] ?? '';
const ids = Array.from(parsedDefinitions.matchAll(/\bid:\s*'([^']+)'/g), (match) => match[1]);
const surfaces = Array.from(
  parsedDefinitions.matchAll(/\bsurface:\s*'([^']+)'/g),
  (match) => match[1],
);

if (ids.length !== expectedIds.length)
  fail(`expected ${expectedIds.length} egg definitions, found ${ids.length}`);
if (new Set(ids).size !== ids.length) fail('egg IDs must be unique');
for (const id of expectedIds) {
  if (!ids.includes(id)) fail(`missing egg ID: ${id}`);
}
for (const surface of surfaces) {
  if (!validSurfaces.includes(surface)) fail(`invalid egg surface: ${surface}`);
}

for (const id of ['notebook-margin', 'locker-room-note']) {
  const definition = parsedDefinitions.match(
    new RegExp(`id:\\s*'${id}'[\\s\\S]*?enabled:\\s*(true|false)`),
  );
  if (definition?.[1] !== 'false') fail(`candid egg must remain disabled: ${id}`);
}

const candidSlots = Array.from(
  definitionsSource.matchAll(/\{\s*slot:\s*'([^']+)',\s*status:\s*'([^']+)'([^}]*)\}/g),
  (match) => ({ slot: match[1], status: match[2], rest: match[3] }),
);
for (const slot of ['notebook-margin', 'locker-room-note']) {
  const note = candidSlots.find((candidate) => candidate.slot === slot);
  if (!note) {
    fail(`missing candid slot: ${slot}`);
  } else if (note.status !== 'empty' || /\bcopy\s*:/.test(note.rest)) {
    fail(`candid slot must remain an empty, copy-free slot: ${slot}`);
  }
}

if (!typesSource.includes("'empty' | 'approved'")) {
  fail('ApprovedCandidNote must expose empty and approved statuses');
}

function readFeatureFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return readFeatureFiles(path);
    return entry.isFile() && ['.ts', '.tsx'].includes(extname(entry.name)) ? [path] : [];
  });
}

const prohibitedPattern = /soundscape|album|waitlist|trackEvent|fetch\s*\(|https?:\/\//i;
for (const filePath of readFeatureFiles(featureDirectory)) {
  const source = readFileSync(filePath, 'utf8');
  if (prohibitedPattern.test(source)) {
    fail(`${relative(root, filePath)} contains a prohibited external/media dependency`);
  }
}

if (!process.exitCode) {
  console.log(
    `[PASS] easter-egg content (${ids.length} unique IDs, ${surfaces.length} valid surfaces)`,
  );
}
