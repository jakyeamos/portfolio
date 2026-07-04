#!/usr/bin/env node
import { readdirSync, readFileSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const srcDirectory = resolve(root, 'src');
const appSource = readFileSync(resolve(root, 'src/App.tsx'), 'utf8');

const routePaths = new Set(
  Array.from(appSource.matchAll(/<Route\s+path="([^"*][^"]*)"/g), (match) => match[1]),
);

function fail(message) {
  console.error(`[FAIL] ${message}`);
  process.exitCode = 1;
}

function readSourceFiles(directory) {
  const entries = readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...readSourceFiles(path));
      continue;
    }

    if (entry.isFile() && ['.tsx', '.ts'].includes(extname(entry.name))) {
      files.push(path);
    }
  }

  return files;
}

for (const filePath of readSourceFiles(srcDirectory)) {
  const source = readFileSync(filePath, 'utf8');
  const routeLinks = Array.from(source.matchAll(/\bto="(\/[^"#?]*)"/g));

  for (const match of routeLinks) {
    const linkPath = match[1];

    if (!routePaths.has(linkPath)) {
      fail(`${relative(root, filePath)} links to ${linkPath}, but App.tsx does not register it`);
    }
  }
}

if (!process.exitCode) {
  console.log(`[PASS] internal route links (${routePaths.size} registered routes)`);
}
