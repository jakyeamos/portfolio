#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import ts from 'typescript';

const root = resolve(import.meta.dirname, '..');
const sourcePath = resolve(root, 'src/content/currentProjects.ts');
const evidenceSourcePath = resolve(root, 'src/content/portfolioAssets.ts');
const currentProjectSource = readFileSync(sourcePath, 'utf8');
const evidenceSource = readFileSync(evidenceSourcePath, 'utf8');

function compileModule(source) {
  return ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
  });
}

const compiled = compileModule(currentProjectSource);
const compiledEvidence = compileModule(evidenceSource);
const moduleUrl = `data:text/javascript;base64,${Buffer.from(compiled.outputText).toString('base64')}`;
const evidenceModuleUrl = `data:text/javascript;base64,${Buffer.from(compiledEvidence.outputText).toString('base64')}`;
const { CURRENT_PROJECTS, CLOSED_PROJECTS, PROJECT_AXIS_META } = await import(moduleUrl);
const { PROJECT_EVIDENCE } = await import(evidenceModuleUrl);

const statuses = new Set(['on_track', 'needs_attention', 'stalled', 'shipped']);
const evidenceStatuses = new Set(['source-reviewed', 'pending-rights-attestation', 'approved']);
const expectedCaseStudies = new Set(['quality-runner', 'pre-cr-suite', 'soundscape']);
const axes = Object.keys(PROJECT_AXIS_META);

function fail(message) {
  console.error(`[FAIL] ${message}`);
  process.exitCode = 1;
}

function validateEvidence() {
  const entries = Object.values(PROJECT_EVIDENCE);
  const projects = new Set();

  if (entries.length !== expectedCaseStudies.size) {
    fail(`PROJECT_EVIDENCE must contain ${expectedCaseStudies.size} case-study entries`);
  }

  for (const [index, evidence] of entries.entries()) {
    const label = `PROJECT_EVIDENCE[${index}]`;

    for (const field of ['project', 'label', 'href', 'sourceLabel', 'reviewStatus']) {
      if (typeof evidence[field] !== 'string' || evidence[field].trim().length === 0) {
        fail(`${label}.${field} must be a non-empty string`);
      }
    }

    if (!expectedCaseStudies.has(evidence.project)) {
      fail(`${label}.project must identify an approved Film Room case study`);
    }
    if (projects.has(evidence.project)) {
      fail(`${label}.project duplicates ${evidence.project}`);
    }
    projects.add(evidence.project);

    if (!evidenceStatuses.has(evidence.reviewStatus)) {
      fail(`${label}.reviewStatus is invalid`);
    }

    try {
      const sourceUrl = new URL(evidence.href);
      if (sourceUrl.protocol !== 'https:') fail(`${label}.href must use HTTPS`);
    } catch {
      fail(`${label}.href must be a valid source URL`);
    }

    if (evidence.reviewStatus === 'approved' && !evidence.image) {
      fail(`${label} approved media requires image metadata`);
    }
    if (evidence.reviewStatus !== 'approved' && evidence.image) {
      fail(`${label} unapproved media must not be published`);
    }

    if (evidence.image) {
      if (typeof evidence.image.alt !== 'string' || evidence.image.alt.trim().length === 0) {
        fail(`${label}.image.alt must be a useful non-empty description`);
      }
      if (!Number.isInteger(evidence.image.width) || evidence.image.width <= 0) {
        fail(`${label}.image.width must be a positive integer`);
      }
      if (!Number.isInteger(evidence.image.height) || evidence.image.height <= 0) {
        fail(`${label}.image.height must be a positive integer`);
      }
      if (
        typeof evidence.image.provenance !== 'string' ||
        evidence.image.provenance.trim().length === 0
      ) {
        fail(`${label}.image.provenance must document the reviewed source`);
      }
      if (!evidence.image.src.startsWith('/media/')) {
        fail(`${label}.image.src must be a local public media path`);
      }
    }
  }

  for (const caseStudy of expectedCaseStudies) {
    if (!projects.has(caseStudy)) fail(`PROJECT_EVIDENCE is missing ${caseStudy}`);
  }
}

validateEvidence();

for (const [name, source] of [
  ['current project content', currentProjectSource],
  ['evidence manifest', evidenceSource],
]) {
  for (const forbiddenPattern of [
    /\btrackerComment\b/,
    /\bnextStep\b/,
    /\/Users\//,
    /\.tracker\//,
  ]) {
    if (forbiddenPattern.test(source)) {
      fail(`${name} contains forbidden source text: ${forbiddenPattern}`);
    }
  }
}

function validateProject(project, collectionName, index) {
  const label = `${collectionName}[${index}]`;

  for (const field of [
    'slug',
    'title',
    'shortCode',
    'summary',
    'portfolioUpdate',
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
    `[PASS] project content integrity (${CURRENT_PROJECTS.length} current, ${CLOSED_PROJECTS.length} closed; ${Object.keys(PROJECT_EVIDENCE).length} evidence records)`,
  );
}
