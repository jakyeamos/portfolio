#!/usr/bin/env node
import { readFileSync as readSourceFileSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import ts from 'typescript';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');
const origin = (process.env.VITE_SITE_URL ?? 'https://jakyeamos.com').replace(/\/$/, '');

function loadTypeScriptModule(sourcePath) {
  const source = ts.transpileModule(readSourceFile(sourcePath), {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
  });
  const moduleUrl = `data:text/javascript;base64,${Buffer.from(source.outputText).toString('base64')}`;
  return import(moduleUrl);
}

function readSourceFile(path) {
  return readSourceFileSync(path, 'utf8');
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function statusLabel(status) {
  if (status === 'on_track') return 'Active';
  if (status === 'needs_attention') return 'In development';
  if (status === 'stalled') return 'On deck';
  return 'Shipped';
}

function replaceOrAdd(html, pattern, tag) {
  if (pattern.test(html)) return html.replace(pattern, () => tag);
  return html.replace('</head>', `${tag}\n</head>`);
}

function renderProjectBody(project, repositoryUrl) {
  const tags = project.tags
    .map((tag) => `<span class="stat-chip">${escapeHtml(tag)}</span>`)
    .join('');
  const grades = Object.entries(project.grades)
    .map(
      ([axis, grade]) =>
        `<div><dt>${escapeHtml(axis)}</dt><dd>${escapeHtml(String(grade))}/10</dd></div>`,
    )
    .join('');

  return `<main class="page-wrap py-6 md:py-8">
  <nav aria-label="Project breadcrumb"><a class="report-link" href="/projects">← Project roster</a></nav>
  <article class="mt-8 max-w-4xl border border-[color:var(--color-line-strong)] bg-[color:var(--color-surface-raised)]">
    <header class="border-b border-[color:var(--color-line)] p-5 md:p-6">
      <div class="section-kicker">${escapeHtml(statusLabel(project.trackerStatus))} · Updated ${escapeHtml(project.lastUpdated)}</div>
      <h1 class="mt-3 text-5xl font-black uppercase leading-none tracking-[-0.02em] text-[color:var(--color-ink)] md:text-7xl">${escapeHtml(project.title)}</h1>
    </header>
    <div class="p-5 md:p-6">
      <p class="text-lg leading-relaxed text-[color:var(--color-ink)]">${escapeHtml(project.summary)}</p>
      <section class="mt-6 border-t border-[color:var(--color-line)] pt-5"><div class="section-kicker">Portfolio update</div><p class="mt-3 text-sm leading-relaxed text-[color:var(--color-ink)]">${escapeHtml(project.portfolioUpdate)}</p></section>
      <section class="mt-6 border-t border-[color:var(--color-line)] pt-5"><div class="section-kicker">Engineering read</div><p class="mt-3 text-sm leading-relaxed text-[color:var(--color-ink)]">${escapeHtml(project.scoutTake)}</p></section>
      <dl class="mt-6 grid gap-x-6 gap-y-4 border-t border-[color:var(--color-line)] pt-5 sm:grid-cols-2"><div><dt>Tracker health</dt><dd>${escapeHtml(String(project.trackerScore))}/100</dd></div>${grades}</dl>
      <div class="mt-6 flex flex-wrap gap-2" aria-label="${escapeHtml(project.title)} tags">${tags}</div>
      <nav class="mt-6 flex flex-wrap gap-x-6 gap-y-3 border-t border-[color:var(--color-line)] pt-5" aria-label="${escapeHtml(project.title)} links">
        <a class="report-link" href="/projects/${escapeHtml(project.slug)}">Open crawlable page ↗</a>
        <a class="report-link" href="${escapeHtml(repositoryUrl)}" target="_blank" rel="noreferrer">Source repository ↗</a>
      </nav>
    </div>
  </article>
</main>`;
}

function renderPage(baseHtml, project, metadata, repositoryUrl) {
  let html = baseHtml
    .replace(/<title[^>]*>[\s\S]*?<\/title>\s*/i, '')
    .replace(/<script[^>]+id=["']portfolio-project-jsonld["'][\s\S]*?<\/script>\s*/i, '')
    .replace(/<link\s+[^>]*rel=["']canonical["'][^>]*>\s*/gi, '');
  html = replaceOrAdd(
    html,
    /<title[^>]*>[\s\S]*?<\/title>/i,
    `<title>${escapeHtml(metadata.title)}</title>`,
  );
  html = replaceOrAdd(
    html,
    /<meta\s+(?=[^>]*\bname=["']description["'])[^>]*>/i,
    `<meta name="description" content="${escapeHtml(metadata.description)}" />`,
  );
  html = replaceOrAdd(
    html,
    /<meta\s+(?=[^>]*\bproperty=["']og:title["'])[^>]*>/i,
    `<meta property="og:title" content="${escapeHtml(metadata.title)}" />`,
  );
  html = replaceOrAdd(
    html,
    /<meta\s+(?=[^>]*\bproperty=["']og:description["'])[^>]*>/i,
    `<meta property="og:description" content="${escapeHtml(metadata.description)}" />`,
  );
  html = replaceOrAdd(
    html,
    /<meta\s+(?=[^>]*\bproperty=["']og:url["'])[^>]*>/i,
    `<meta property="og:url" content="${escapeHtml(metadata.canonical)}" />`,
  );
  html = replaceOrAdd(
    html,
    /<meta\s+(?=[^>]*\bname=["']twitter:title["'])[^>]*>/i,
    `<meta name="twitter:title" content="${escapeHtml(metadata.title)}" />`,
  );
  html = replaceOrAdd(
    html,
    /<meta\s+(?=[^>]*\bname=["']twitter:description["'])[^>]*>/i,
    `<meta name="twitter:description" content="${escapeHtml(metadata.description)}" />`,
  );
  html = html.replace(
    '</head>',
    `<link rel="canonical" href="${escapeHtml(metadata.canonical)}" />\n<script id="portfolio-project-jsonld" type="application/ld+json">${JSON.stringify(metadata.jsonLd).replaceAll('<', '\\u003c')}</script>\n</head>`,
  );
  return html.replace(
    '<div id="root"></div>',
    `<div id="root">${renderProjectBody(project, repositoryUrl)}</div>`,
  );
}

const [{ CURRENT_PROJECTS }, { MARKETING_PROJECT_REPOSITORIES }, { buildProjectMetadata }] =
  await Promise.all([
    loadTypeScriptModule(resolve(root, 'src/content/currentProjects.ts')),
    loadTypeScriptModule(resolve(root, 'src/content/marketingProjects.ts')),
    loadTypeScriptModule(resolve(root, 'src/lib/marketingMetadata.ts')),
  ]);
const baseHtml = await readFile(join(dist, 'index.html'), 'utf8');
const projectSlugs = ['soundscape', 'bballedu', 'book', 'pronto'];

for (const slug of projectSlugs) {
  const project = CURRENT_PROJECTS.find((item) => item.slug === slug);
  if (!project) throw new Error(`Missing marketing project source: ${slug}`);
  const repositoryUrl = MARKETING_PROJECT_REPOSITORIES[slug];
  const metadata = buildProjectMetadata(project, origin);
  const outputDirectory = join(dist, 'projects', slug);
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(
    join(outputDirectory, 'index.html'),
    renderPage(baseHtml, project, metadata, repositoryUrl),
    'utf8',
  );
}

const sitemapEntries = [
  { path: '/', lastmod: null },
  { path: '/projects', lastmod: null },
  ...projectSlugs.map((slug) => ({
    path: `/projects/${slug}`,
    lastmod: CURRENT_PROJECTS.find((item) => item.slug === slug)?.lastUpdated ?? null,
  })),
  { path: '/scouting-report', lastmod: null },
  { path: '/film-room', lastmod: null },
  { path: '/blog', lastmod: null },
  { path: '/player-comps', lastmod: null },
  { path: '/impact-report', lastmod: null },
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries
  .map(
    ({ path, lastmod }) =>
      `  <url><loc>${origin}${path}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`,
  )
  .join('\n')}\n</urlset>\n`;
await writeFile(join(dist, 'sitemap.xml'), sitemap, 'utf8');
await writeFile(
  join(dist, 'robots.txt'),
  `User-agent: *\nAllow: /\nDisallow: /blog/write\nSitemap: ${origin}/sitemap.xml\n`,
  'utf8',
);
console.log(`[PASS] generated ${projectSlugs.length} project pages, sitemap.xml, and robots.txt`);
