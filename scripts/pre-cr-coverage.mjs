#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const coveragePath = resolve(root, 'coverage/pre-cr.lcov');
const sourceExtensions = /\.(?:[cm]?[jt]sx?)$/;

const changedFiles = execFileSync('git', ['diff', '--name-only', 'HEAD'], {
  cwd: root,
  encoding: 'utf8',
})
  .split('\n')
  .map((line) => line.trim())
  .filter((line) => sourceExtensions.test(line));

const records = changedFiles.map((filePath) => {
  const absolutePath = resolve(root, filePath);
  const lines = readFileSync(absolutePath, 'utf8').split('\n');
  const executableLines = lines
    .map((line, index) => ({ line, number: index + 1 }))
    .filter(({ line }) => line.trim().length > 0);

  return [
    'TN:',
    `SF:${filePath}`,
    ...executableLines.map(({ number }) => `DA:${number},0`),
    `LF:${executableLines.length}`,
    'LH:0',
    'end_of_record',
  ].join('\n');
});

mkdirSync(dirname(coveragePath), { recursive: true });
writeFileSync(coveragePath, `${records.join('\n')}\n`, 'utf8');
