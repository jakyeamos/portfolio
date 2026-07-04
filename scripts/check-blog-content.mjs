#!/usr/bin/env node
import { readdirSync, readFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import ts from 'typescript';

const root = resolve(import.meta.dirname, '..');
const blogDirectory = resolve(root, 'src/content/blog');

async function importTypescriptModule(relativePath) {
  const sourcePath = resolve(root, relativePath);
  const compiled = ts.transpileModule(readFileSync(sourcePath, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
  });

  const moduleUrl = `data:text/javascript;base64,${Buffer.from(compiled.outputText).toString('base64')}`;
  return import(moduleUrl);
}

const { sortBlogPosts } = await importTypescriptModule('src/content/blogSorting.ts');
const { parseBlogMarkdown } = await importTypescriptModule('src/content/blogMarkdown.ts');

function fail(message) {
  console.error(`[FAIL] ${message}`);
  process.exitCode = 1;
}

const markdownFiles = readdirSync(blogDirectory, { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
  .map((entry) => entry.name)
  .sort((a, b) => a.localeCompare(b));

if (markdownFiles.length === 0) {
  fail('src/content/blog must contain at least one Markdown post');
}

const parsedPosts = [];

for (const filename of markdownFiles) {
  const filePath = resolve(blogDirectory, filename);

  try {
    const parsedPost = parseBlogMarkdown(readFileSync(filePath, 'utf8'));
    parsedPosts.push({
      ...parsedPost.frontmatter,
      slug: basename(filename, '.md'),
      sections: parsedPost.sections,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    fail(`${filename}: ${message}`);
  }
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
  fail(
    `pinned blog ordering expected ${expectedSlugs.join(',')}, received ${sortedSlugs.join(',')}`,
  );
}

for (const post of parsedPosts) {
  if (post.sections.length === 0) {
    fail(`${post.slug}.md parsed without sections`);
  }
}

if (!process.exitCode) {
  console.log(`[PASS] blog content integrity (${parsedPosts.length} Markdown posts) and ordering`);
}
