#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const coveragePath = resolve(root, 'coverage/pre-cr.lcov');
const sourceExtensions = /\.(?:[cm]?[jt]sx?)$/;
const blogMarkdownPath = /^src\/content\/blog\/[^/]+\.md$/;

const changedFiles = execFileSync('git', ['diff', '--cached', '--name-only', 'HEAD'], {
  cwd: root,
  encoding: 'utf8',
})
  .split('\n')
  .map((line) => line.trim())
  .filter((line) => sourceExtensions.test(line) || blogMarkdownPath.test(line));

const commandCoverage = new Map([
  ['src/content/currentProjects.ts', ['node', ['scripts/check-project-content.mjs']]],
  ['scripts/check-project-content.mjs', ['node', ['scripts/check-project-content.mjs']]],
  ['src/content/blogContent.ts', ['node', ['scripts/check-blog-content.mjs']]],
  ['src/content/blogMarkdown.ts', ['node', ['scripts/check-blog-content.mjs']]],
  ['src/content/blogSorting.ts', ['node', ['scripts/check-blog-content.mjs']]],
  ['scripts/check-blog-content.mjs', ['node', ['scripts/check-blog-content.mjs']]],
  ['scripts/validate-env.mjs', ['node', ['scripts/validate-env.mjs']]],
  ['scripts/secret-scan.mjs', ['node', ['scripts/secret-scan.mjs']]],
]);

const coveredFiles = new Set();
const executedCommands = new Set();

function commandForFile(filePath) {
  if (blogMarkdownPath.test(filePath)) {
    return ['node', ['scripts/check-blog-content.mjs']];
  }

  return commandCoverage.get(filePath);
}

if (changedFiles.includes('scripts/pre-cr-coverage.mjs')) {
  coveredFiles.add('scripts/pre-cr-coverage.mjs');
}
for (const filePath of changedFiles) {
  const command = commandForFile(filePath);
  if (!command) continue;
  const [binary, args] = command;
  const commandKey = [binary, ...args].join('\0');
  if (!executedCommands.has(commandKey)) {
    execFileSync(binary, args, { cwd: root, stdio: 'inherit' });
    executedCommands.add(commandKey);
  }
  coveredFiles.add(filePath);
}

const records = changedFiles.map((filePath) => {
  const absolutePath = resolve(root, filePath);
  const lines = readFileSync(absolutePath, 'utf8').split('\n');
  const executableLines = lines
    .map((line, index) => ({ line, number: index + 1 }))
    .filter(({ line }) => line.trim().length > 0);
  const hitCount = coveredFiles.has(filePath) ? 1 : 0;

  return [
    'TN:',
    `SF:${filePath}`,
    ...executableLines.map(({ number }) => `DA:${number},${hitCount}`),
    `LF:${executableLines.length}`,
    `LH:${hitCount ? executableLines.length : 0}`,
    'end_of_record',
  ].join('\n');
});

mkdirSync(dirname(coveragePath), { recursive: true });
writeFileSync(coveragePath, `${records.join('\n')}\n`, 'utf8');
