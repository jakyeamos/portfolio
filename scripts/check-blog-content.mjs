#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import ts from 'typescript';

const root = resolve(import.meta.dirname, '..');
const sourcePath = resolve(root, 'src/content/blogSorting.ts');
const compiled = ts.transpileModule(readFileSync(sourcePath, 'utf8'), {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
  },
});

const moduleUrl = `data:text/javascript;base64,${Buffer.from(compiled.outputText).toString('base64')}`;
const { sortBlogPosts } = await import(moduleUrl);

function fail(message) {
  console.error(`[FAIL] ${message}`);
  process.exitCode = 1;
}

const posts = [
  { slug: 'newer-unpinned', date: '2026-03-01', pinned: false },
  { slug: 'older-pinned', date: '2026-01-01', pinned: true },
  { slug: 'older-unpinned', date: '2026-01-15', pinned: false },
  { slug: 'newer-pinned', date: '2026-02-01', pinned: true },
];

const originalOrder = posts.map((post) => post.slug).join(',');
const sortedSlugs = sortBlogPosts(posts).map((post) => post.slug);
const expectedSlugs = ['newer-pinned', 'older-pinned', 'newer-unpinned', 'older-unpinned'];

if (posts.map((post) => post.slug).join(',') !== originalOrder) {
  fail('sortBlogPosts must not mutate the source post list');
}

if (sortedSlugs.join(',') !== expectedSlugs.join(',')) {
  fail(`pinned blog ordering expected ${expectedSlugs.join(',')}, received ${sortedSlugs.join(',')}`);
}

if (!process.exitCode) {
  console.log('[PASS] blog content ordering');
}
