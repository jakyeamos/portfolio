#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const roots = ['src', 'app', 'pages', 'packages']
  .map((entry) => path.join(root, entry))
  .filter((entry) => fs.existsSync(entry));
const sourceExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);
const ignored = new Set(['node_modules', '.next', 'dist', 'build', 'coverage', '.turbo', '.git']);
const violations = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    if (entry.isFile() && sourceExtensions.has(path.extname(entry.name))) inspectFile(full);
  }
}

function inspectFile(file) {
  const rel = path.relative(root, file);
  const text = fs.readFileSync(file, 'utf8');
  const importPattern =
    /(?:import|export)\s+(?:[^'"]*?from\s+)?['"]([^'"]+)['"]|require\(['"]([^'"]+)['"]\)/g;
  let match;
  while ((match = importPattern.exec(text))) {
    const specifier = match[1] || match[2];
    if (!specifier || specifier.startsWith('node:')) continue;
    if (specifier.includes('/src/') && !specifier.startsWith('@/')) {
      violations.push({ rel, specifier, rule: 'no package-internal /src imports' });
    }
    if (specifier.startsWith('../../../') || specifier.startsWith('../../../../')) {
      violations.push({ rel, specifier, rule: 'no deep parent traversal imports' });
    }
    if (rel.startsWith('packages/web/') && /@[^/]+\/(api|db)\/src/.test(specifier)) {
      violations.push({ rel, specifier, rule: 'web must not import api/db src internals' });
    }
  }
}

for (const sourceRoot of roots) walk(sourceRoot);

if (violations.length > 0) {
  console.error('AIOS architecture check failed:');
  for (const violation of violations.slice(0, 50)) {
    console.error(`- ${violation.rel}: ${violation.rule} (${violation.specifier})`);
  }
  if (violations.length > 50) console.error(`...and ${violations.length - 50} more`);
  process.exit(1);
}

console.log('AIOS architecture check passed.');
