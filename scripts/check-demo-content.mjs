#!/usr/bin/env node
import { existsSync, readFileSync, statSync } from 'node:fs';
import { normalize, resolve, sep } from 'node:path';
import ts from 'typescript';

const root = resolve(import.meta.dirname, '..');
const publicRoot = resolve(root, 'public');
const errors = [];

function fail(message) {
  errors.push(message);
}

async function importTypescriptModule(relativePath) {
  const sourceText = readFileSync(resolve(root, relativePath), 'utf8');
  const compiled = ts.transpileModule(sourceText, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
  });
  const moduleUrl = `data:text/javascript;base64,${Buffer.from(compiled.outputText).toString('base64')}`;
  return import(moduleUrl);
}

function localPublicPath(path, label) {
  if (typeof path !== 'string' || !path.startsWith('/media/demos/')) {
    fail(`${label} must be a local /media/demos/ path`);
    return null;
  }

  const normalized = normalize(path.slice(1));
  if (normalized === '..' || normalized.startsWith(`..${sep}`)) {
    fail(`${label} must stay inside public media`);
    return null;
  }

  return resolve(publicRoot, normalized);
}

const { DEMO_VIDEOS } = await importTypescriptModule('src/content/demoVideos.ts');
const { CURRENT_PROJECTS, CLOSED_PROJECTS } = await importTypescriptModule(
  'src/content/currentProjects.ts',
);
const { PUBLIC_PROJECT_MANIFEST } = await importTypescriptModule(
  'src/content/publicProjectManifest.ts',
);

const projectSlugs = new Set(
  [...CURRENT_PROJECTS, ...CLOSED_PROJECTS].map((project) => project.slug),
);
const publicProjectSlugs = new Set(PUBLIC_PROJECT_MANIFEST.map((project) => project.slug));

if (!Array.isArray(DEMO_VIDEOS) || DEMO_VIDEOS.length === 0) {
  fail('DEMO_VIDEOS must contain at least one local screen recording');
}

const demoSlugs = new Set();
const demoProjectSlugs = new Set();

for (const [index, demo] of (DEMO_VIDEOS ?? []).entries()) {
  const label = `DEMO_VIDEOS[${index}]`;
  if (!demo || typeof demo !== 'object') {
    fail(`${label} must be an object`);
    continue;
  }

  for (const field of [
    'slug',
    'projectSlug',
    'title',
    'deck',
    'broadcastLabel',
    'videoSrc',
    'posterSrc',
    'captionsSrc',
  ]) {
    if (typeof demo[field] !== 'string' || demo[field].trim().length === 0) {
      fail(`${label}.${field} must be a non-empty string`);
    }
  }

  if (demoSlugs.has(demo.slug)) fail(`${label}.slug duplicates ${demo.slug}`);
  demoSlugs.add(demo.slug);
  if (demoProjectSlugs.has(demo.projectSlug)) {
    fail(`${label}.projectSlug duplicates ${demo.projectSlug}`);
  }
  demoProjectSlugs.add(demo.projectSlug);

  if (demo.mediaType !== 'screen-recording') {
    fail(`${label}.mediaType must be screen-recording`);
  }
  if (!projectSlugs.has(demo.projectSlug)) {
    fail(`${label}.projectSlug references missing project ${demo.projectSlug}`);
  }
  if (!publicProjectSlugs.has(demo.projectSlug)) {
    fail(`${label}.projectSlug references an unpublished project ${demo.projectSlug}`);
  }

  for (const field of ['videoSrc', 'posterSrc', 'captionsSrc']) {
    const filePath = localPublicPath(demo[field], `${label}.${field}`);
    if (filePath && (!existsSync(filePath) || !statSync(filePath).isFile())) {
      fail(`${label}.${field} is missing from public media: ${filePath}`);
    }
  }

  const captionsPath = localPublicPath(demo.captionsSrc, `${label}.captionsSrc`);
  if (captionsPath && existsSync(captionsPath)) {
    const captions = readFileSync(captionsPath, 'utf8');
    if (!/^WEBVTT(?:\s|$)/.test(captions)) fail(`${label}.captionsSrc must be WebVTT`);
  }

  if (!Array.isArray(demo.transcript) || demo.transcript.length === 0) {
    fail(`${label}.transcript must contain at least one line`);
  } else {
    let previousEnd = 0;
    for (const [lineIndex, line] of demo.transcript.entries()) {
      const lineLabel = `${label}.transcript[${lineIndex}]`;
      if (!Number.isFinite(line.start) || !Number.isFinite(line.end) || line.end <= line.start) {
        fail(`${lineLabel} must have an ordered time range`);
      }
      if (line.start < previousEnd) fail(`${lineLabel} overlaps the previous transcript line`);
      if (typeof line.text !== 'string' || line.text.trim().length === 0) {
        fail(`${lineLabel}.text must be non-empty`);
      }
      previousEnd = line.end;
    }
  }

  if (!Array.isArray(demo.chapters) || demo.chapters.length === 0) {
    fail(`${label}.chapters must contain at least one chapter`);
  } else {
    let previousStart = -1;
    const chapterIds = new Set();
    for (const [chapterIndex, chapter] of demo.chapters.entries()) {
      const chapterLabel = `${label}.chapters[${chapterIndex}]`;
      if (chapterIds.has(chapter.id)) fail(`${chapterLabel}.id duplicates ${chapter.id}`);
      chapterIds.add(chapter.id);
      if (!Number.isFinite(chapter.start) || chapter.start < 0) {
        fail(`${chapterLabel}.start must be a non-negative number`);
      }
      if (chapter.start < previousStart) fail(`${chapterLabel} is out of order`);
      previousStart = chapter.start;
      for (const field of ['id', 'title', 'summary']) {
        if (typeof chapter[field] !== 'string' || chapter[field].trim().length === 0) {
          fail(`${chapterLabel}.${field} must be non-empty`);
        }
      }
    }
  }
}

if (errors.length > 0) {
  for (const error of errors) console.error(`[FAIL] ${error}`);
  process.exitCode = 1;
} else {
  console.log(
    `[PASS] demo content integrity (${DEMO_VIDEOS.length} local screen recording${DEMO_VIDEOS.length === 1 ? '' : 's'})`,
  );
}
