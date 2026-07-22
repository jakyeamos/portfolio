#!/usr/bin/env node
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, isAbsolute, normalize, relative, resolve, sep } from 'node:path';
import ts from 'typescript';

const root = resolve(import.meta.dirname, '..');
const allowlistPath = resolve(root, '.tracker/public-project-allowlist.json');
const allowlist = JSON.parse(readFileSync(allowlistPath, 'utf8'));
const manifest = await importTypescriptModule('../src/content/publicProjectManifest.ts');
const clipsModule = await importTypescriptModule('../src/content/shotClips.ts');
const projectsModule = await importTypescriptModule('../src/content/currentProjects.ts');
const { PUBLIC_PROJECT_MANIFEST, PUBLIC_PROJECT_SLUGS } = manifest;
const { PROJECT_SHOT_CLIPS } = clipsModule;
const { CURRENT_PROJECTS, CLOSED_PROJECTS } = projectsModule;
const errors = [];
const officialSources = new Set(['NBA on YouTube', 'ESPN on YouTube', 'Indiana Pacers on YouTube']);
const youtubeIdPattern = /^[A-Za-z0-9_-]{11}$/;
const maxClipWindowSeconds = 38;

function fail(message) {
  errors.push(message);
}

async function importTypescriptModule(relativePath) {
  const sourceText = readFileSync(new URL(relativePath, import.meta.url), 'utf8');
  const compiled = ts.transpileModule(sourceText, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
  });
  const moduleUrl = `data:text/javascript;base64,${Buffer.from(compiled.outputText).toString('base64')}`;
  return import(moduleUrl);
}

function validateAllowlist() {
  if (!allowlist || allowlist.version !== 1 || typeof allowlist.projectsRoot !== 'string') {
    fail('public-project-allowlist.json must declare version 1 and a projectsRoot');
    return;
  }

  if (!Array.isArray(allowlist.projects) || allowlist.projects.length === 0) {
    fail('public-project-allowlist.json must contain at least one reviewed project');
    return;
  }

  const projectsRoot = resolve(root, allowlist.projectsRoot);
  if (!existsSync(projectsRoot) || !statSync(projectsRoot).isDirectory()) {
    fail(`reviewed projects root is missing: ${projectsRoot}`);
  }

  const allowlistSlugs = new Set();
  for (const [index, entry] of allowlist.projects.entries()) {
    const label = `allowlist.projects[${index}]`;
    if (!entry || typeof entry.slug !== 'string' || typeof entry.sourcePath !== 'string') {
      fail(`${label} requires slug and sourcePath`);
      continue;
    }
    if (allowlistSlugs.has(entry.slug)) fail(`${label} duplicates ${entry.slug}`);
    allowlistSlugs.add(entry.slug);

    const normalizedSourcePath = normalize(entry.sourcePath);
    if (
      isAbsolute(entry.sourcePath) ||
      normalizedSourcePath === '..' ||
      normalizedSourcePath.startsWith(`..${sep}`)
    ) {
      fail(`${label}.sourcePath must stay inside the reviewed projects root`);
      continue;
    }

    const candidatePath = resolve(projectsRoot, normalizedSourcePath);
    if (!existsSync(candidatePath) || !statSync(candidatePath).isDirectory()) {
      fail(`${label}.sourcePath does not resolve to a project directory: ${candidatePath}`);
    }
  }

  const manifestSlugs = PUBLIC_PROJECT_MANIFEST.map((entry) => entry.slug);
  if (new Set(manifestSlugs).size !== manifestSlugs.length) {
    fail('PUBLIC_PROJECT_MANIFEST contains duplicate slugs');
  }
  if (manifestSlugs.length !== allowlistSlugs.size) {
    fail(
      `public project manifest count ${manifestSlugs.length} does not match allowlist count ${allowlistSlugs.size}`,
    );
  }
  for (const slug of allowlistSlugs) {
    if (!manifestSlugs.includes(slug)) fail(`PUBLIC_PROJECT_MANIFEST is missing ${slug}`);
  }
  for (const slug of manifestSlugs) {
    if (!allowlistSlugs.has(slug)) fail(`PUBLIC_PROJECT_MANIFEST publishes unallowlisted ${slug}`);
  }
  if (
    PUBLIC_PROJECT_SLUGS.length !== manifestSlugs.length ||
    PUBLIC_PROJECT_SLUGS.some((slug, index) => slug !== manifestSlugs[index])
  ) {
    fail('PUBLIC_PROJECT_SLUGS must be the ordered slugs from PUBLIC_PROJECT_MANIFEST');
  }

  return allowlistSlugs;
}

function validateProjects(allowlistSlugs) {
  const allProjects = [...CURRENT_PROJECTS, ...CLOSED_PROJECTS];
  const projectBySlug = new Map(allProjects.map((project) => [project.slug, project]));

  for (const slug of allowlistSlugs) {
    if (!projectBySlug.has(slug)) fail(`allowlist publishes missing project data for ${slug}`);
  }
  if (projectBySlug.size !== new Set(allProjects.map((project) => project.slug)).size) {
    fail('current and closed project collections contain duplicate slugs');
  }

  return projectBySlug;
}

function validateClips(allowlistSlugs, projectBySlug) {
  if (!Array.isArray(PROJECT_SHOT_CLIPS) || PROJECT_SHOT_CLIPS.length === 0) {
    fail('PROJECT_SHOT_CLIPS must contain at least one clip');
    return;
  }

  const clipsByProject = new Map();
  const clipIds = new Set();
  const windows = new Set();

  for (const [index, clip] of PROJECT_SHOT_CLIPS.entries()) {
    const label = `PROJECT_SHOT_CLIPS[${index}]`;
    if (!clip || typeof clip.projectSlug !== 'string') {
      fail(`${label}.projectSlug must be a string`);
      continue;
    }
    if (!allowlistSlugs.has(clip.projectSlug)) {
      fail(`${label} references unallowlisted project ${clip.projectSlug}`);
    }
    if (!projectBySlug.has(clip.projectSlug)) {
      fail(`${label} references missing project ${clip.projectSlug}`);
    }
    if (clipsByProject.has(clip.projectSlug)) {
      fail(`${label} duplicates the project clip for ${clip.projectSlug}`);
    }
    clipsByProject.set(clip.projectSlug, clip);

    for (const field of [
      'clipId',
      'videoId',
      'player',
      'moment',
      'zone',
      'note',
      'source',
      'sourceUrl',
      'verificationNote',
    ]) {
      if (typeof clip[field] !== 'string' || clip[field].trim().length === 0) {
        fail(`${label}.${field} must be a non-empty string`);
      }
    }

    if (clipIds.has(clip.clipId)) fail(`${label} duplicates clipId ${clip.clipId}`);
    clipIds.add(clip.clipId);

    if (!youtubeIdPattern.test(clip.videoId)) {
      fail(`${label}.videoId is not a valid YouTube id`);
    }
    if (!Number.isInteger(clip.start) || clip.start < 0) {
      fail(`${label}.start must be an explicit non-negative integer`);
    }
    if (!Number.isInteger(clip.end) || clip.end <= clip.start) {
      fail(`${label}.end must be an explicit integer after start`);
    }
    if (
      Number.isInteger(clip.start) &&
      Number.isInteger(clip.end) &&
      clip.end - clip.start > maxClipWindowSeconds
    ) {
      fail(`${label} window exceeds ${maxClipWindowSeconds} seconds`);
    }

    const windowKey = `${clip.videoId}:${clip.start}:${clip.end}`;
    if (windows.has(windowKey)) fail(`${label} duplicates clip window ${windowKey}`);
    windows.add(windowKey);

    if (clip.reviewStatus !== 'verified') fail(`${label} is not verified`);
    if (typeof clip.reviewedAt !== 'string' || Number.isNaN(Date.parse(clip.reviewedAt))) {
      fail(`${label}.reviewedAt must be a parseable review date`);
    }
    if (!officialSources.has(clip.source)) {
      fail(`${label}.source is not an approved official provenance label`);
    }

    try {
      const sourceUrl = new URL(clip.sourceUrl);
      if (sourceUrl.protocol !== 'https:' || sourceUrl.hostname !== 'www.youtube.com') {
        fail(`${label}.sourceUrl must be an HTTPS YouTube URL`);
      }
      if (sourceUrl.pathname !== '/watch' || sourceUrl.searchParams.get('v') !== clip.videoId) {
        fail(`${label}.sourceUrl must identify the same videoId`);
      }
    } catch {
      fail(`${label}.sourceUrl must be a valid URL`);
    }
  }

  for (const slug of allowlistSlugs) {
    const clip = clipsByProject.get(slug);
    if (!clip) fail(`published project ${slug} has no verified shot clip`);
  }
  for (const slug of clipsByProject.keys()) {
    if (!allowlistSlugs.has(slug)) fail(`clip registry has unpublished project ${slug}`);
  }
  if (clipsByProject.size !== allowlistSlugs.size) {
    fail(
      `clip coverage ${clipsByProject.size}/${allowlistSlugs.size} is not exactly one clip per published project`,
    );
  }

  return { clipsByProject, windows };
}

const allowlistSlugs = validateAllowlist();
if (allowlistSlugs) {
  const projectBySlug = validateProjects(allowlistSlugs);
  validateClips(allowlistSlugs, projectBySlug);
}

if (errors.length > 0) {
  console.error(
    `\n[FAIL] shot clip validation (${errors.length} issue${errors.length === 1 ? '' : 's'})`,
  );
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const projectsRoot = resolve(root, allowlist.projectsRoot);
console.log(
  `[PASS] shot clip validation (${PUBLIC_PROJECT_MANIFEST.length} public projects, ${PROJECT_SHOT_CLIPS.length} verified windows; candidates checked under ${relative(dirname(root), projectsRoot) || '.'})`,
);
