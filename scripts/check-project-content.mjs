#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';

const root = resolve(import.meta.dirname, '..');
const sourcePath = resolve(root, 'src/content/currentProjects.ts');
const compiled = ts.transpileModule(readFileSync(sourcePath, 'utf8'), {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
  },
});

const moduleUrl = `data:text/javascript;base64,${Buffer.from(compiled.outputText).toString('base64')}`;
const { CURRENT_PROJECTS, CLOSED_PROJECTS, PROJECT_AXIS_META } = await import(moduleUrl);

const statuses = new Set(['on_track', 'needs_attention', 'stalled', 'shipped']);
const axes = Object.keys(PROJECT_AXIS_META);

function fail(message) {
  console.error(`[FAIL] ${message}`);
  process.exitCode = 1;
}

function validateProject(project, collectionName, index) {
  const label = `${collectionName}[${index}]`;

  for (const field of [
    'slug',
    'title',
    'shortCode',
    'summary',
    'trackerComment',
    'trackerStatus',
    'lastUpdated',
    'scoutTake',
  ]) {
    if (typeof project[field] !== 'string' || project[field].trim().length === 0) {
      fail(`${label}.${field} must be a non-empty string`);
    }
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug)) {
    fail(`${label}.slug must be kebab-case`);
  }

  if (!/^[A-Z0-9]{2,4}$/.test(project.shortCode)) {
    fail(`${label}.shortCode must be 2-4 uppercase letters/numbers`);
  }

  if (!statuses.has(project.trackerStatus)) {
    fail(`${label}.trackerStatus must be one of ${Array.from(statuses).join(', ')}`);
  }

  if (
    !Number.isInteger(project.trackerScore) ||
    project.trackerScore < 0 ||
    project.trackerScore > 100
  ) {
    fail(`${label}.trackerScore must be an integer from 0 to 100`);
  }

  if (Number.isNaN(Date.parse(project.lastUpdated))) {
    fail(`${label}.lastUpdated must be a parseable date`);
  }

  if (!Array.isArray(project.tags) || project.tags.length === 0) {
    fail(`${label}.tags must contain at least one tag`);
  }

  for (const axis of axes) {
    const grade = project.grades?.[axis];
    if (!Number.isInteger(grade) || grade < 1 || grade > 10) {
      fail(`${label}.grades.${axis} must be an integer from 1 to 10`);
    }
  }
}

function validateCollection(name, projects) {
  if (!Array.isArray(projects) || projects.length === 0) {
    fail(`${name} must contain at least one project`);
    return;
  }

  const slugs = new Set();
  const shortCodes = new Set();

  projects.forEach((project, index) => {
    validateProject(project, name, index);

    if (slugs.has(project.slug)) {
      fail(`${name} contains duplicate slug ${project.slug}`);
    }
    slugs.add(project.slug);

    if (shortCodes.has(project.shortCode)) {
      fail(`${name} contains duplicate shortCode ${project.shortCode}`);
    }
    shortCodes.add(project.shortCode);
  });
}

validateCollection('CURRENT_PROJECTS', CURRENT_PROJECTS);
validateCollection('CLOSED_PROJECTS', CLOSED_PROJECTS);

if (!process.exitCode) {
  console.log(
    `[PASS] project content integrity (${CURRENT_PROJECTS.length} current, ${CLOSED_PROJECTS.length} closed)`,
  );
}
