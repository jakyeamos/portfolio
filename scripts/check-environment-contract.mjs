#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const requiredFiles = [
  'README.md',
  'package.json',
  'pnpm-lock.yaml',
  'tsconfig.json',
  'netlify.toml',
  '.env.example',
  '.tracker/evidence-map.json',
  '.tracker/public-project-allowlist.json',
  '.agents/context/README.md',
  '.agents/context/architecture.md',
  '.agents/context/commands.md',
  '.agents/context/conventions.md',
  '.agents/context/security.md',
  '.agents/context/failure-modes.md',
  '.agents/context/examples.md',
  '.agents/context/done.md',
  '.agents/context/deployment.md',
];
const requiredScripts = [
  'format:check',
  'architecture:check',
  'environment:check',
  'typecheck',
  'test',
  'build',
  'secret:scan',
  'dependency:security',
  'tracker:check',
];
const errors = [];

function fail(message) {
  errors.push(message);
}

function read(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    fail(`missing required surface: ${relativePath}`);
    return '';
  }
  return fs.readFileSync(absolutePath, 'utf8');
}

const packageText = read('package.json');
let packageJson;
try {
  packageJson = JSON.parse(packageText);
} catch {
  fail('package.json is not valid JSON');
}

for (const relativePath of requiredFiles) read(relativePath);

if (packageJson) {
  for (const script of requiredScripts) {
    if (typeof packageJson.scripts?.[script] !== 'string') {
      fail(`package.json is missing the ${script} script`);
    }
  }
  if (packageJson.packageManager !== 'pnpm@11.7.0') {
    fail('package.json must pin pnpm@11.7.0');
  }
  if (packageJson.engines?.node !== '>=22.13.0') {
    fail('package.json must declare Node >=22.13.0');
  }
}

const contextIndexPath = path.join(root, '.agents/context/README.md');
if (fs.existsSync(contextIndexPath)) {
  const contextIndex = fs.readFileSync(contextIndexPath, 'utf8');
  const links = [...contextIndex.matchAll(/\[[^\]]+\]\(([^)#]+)(?:#[^)]+)?\)/g)].map(
    (match) => match[1],
  );
  for (const link of links) {
    if (/^(?:https?:|mailto:)/.test(link)) continue;
    const target = path.resolve(path.dirname(contextIndexPath), link);
    if (!fs.existsSync(target)) fail(`context link does not resolve: ${link}`);
  }
}

const gitignore = read('.gitignore');
if (!gitignore.includes('!.agents/context/**')) {
  fail('.gitignore must keep the routed context packets trackable');
}

const workflow = read('.github/workflows/portfolio-quality.yml');
if (workflow && /AIOS|aios-architecture|PROJECT_TRUTH|project-truth/.test(workflow)) {
  fail('portfolio quality workflow contains retired AIOS/project-truth ownership');
}

const envExample = read('.env.example');
if (envExample && !envExample.includes('MY_GEMINI_API_KEY')) {
  fail('.env.example must use an explicit placeholder for GEMINI_API_KEY');
}

if (errors.length > 0) {
  console.error('Environment contract failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Environment contract passed.');
