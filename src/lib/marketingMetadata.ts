import type { CurrentProject } from '@/content/currentProjects';

export interface ProjectMetadata {
  title: string;
  description: string;
  canonical: string;
  jsonLd: Readonly<Record<string, unknown>>;
}

const DEFAULT_TITLE = 'Jakye Amos | Full-Stack Software Engineer';
const DEFAULT_DESCRIPTION =
  'Jakye Amos is a full-stack software engineer focused on product, data, AI workflow systems, and source-backed engineering results.';

function normalizedOrigin(origin: string): string {
  return origin.replace(/\/$/, '');
}

function metaDescription(project: CurrentProject): string {
  const description = `${project.summary} ${project.portfolioUpdate}`.replace(/\s+/g, ' ').trim();
  return description.length > 160 ? `${description.slice(0, 157).trimEnd()}...` : description;
}

export function buildProjectMetadata(project: CurrentProject, origin: string): ProjectMetadata {
  const siteOrigin = normalizedOrigin(origin);
  const canonical = `${siteOrigin}/projects/${project.slug}`;
  const description = metaDescription(project);
  const fullDescription = `${project.summary} ${project.portfolioUpdate}`
    .replace(/\s+/g, ' ')
    .trim();

  return {
    title: `${project.title} | Jakye Amos Portfolio`,
    description,
    canonical,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.title,
      description: fullDescription,
      url: canonical,
      dateModified: project.lastUpdated,
      keywords: project.tags,
      author: {
        '@type': 'Person',
        name: 'Jakye Amos',
        url: siteOrigin,
      },
    },
  };
}

function upsertMeta(attribute: 'name' | 'property', key: string, content: string): void {
  const selector = `meta[${attribute}="${key}"]`;
  let element = document.head.querySelector(selector);
  if (!(element instanceof HTMLMetaElement)) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.append(element);
  }
  element.setAttribute('content', content);
}

function upsertCanonical(url: string): void {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.append(element);
  }
  element.href = url;
}

export function applyProjectMetadata(metadata: ProjectMetadata): void {
  document.title = metadata.title;
  upsertMeta('name', 'description', metadata.description);
  upsertMeta('property', 'og:title', metadata.title);
  upsertMeta('property', 'og:description', metadata.description);
  upsertMeta('property', 'og:url', metadata.canonical);
  upsertMeta('name', 'twitter:title', metadata.title);
  upsertMeta('name', 'twitter:description', metadata.description);
  upsertCanonical(metadata.canonical);

  document.getElementById('portfolio-project-jsonld')?.remove();
  const jsonLd = document.createElement('script');
  jsonLd.id = 'portfolio-project-jsonld';
  jsonLd.type = 'application/ld+json';
  jsonLd.textContent = JSON.stringify(metadata.jsonLd);
  document.head.append(jsonLd);
}

export function restoreDefaultMetadata(origin: string): void {
  document.title = DEFAULT_TITLE;
  upsertMeta('name', 'description', DEFAULT_DESCRIPTION);
  upsertMeta('property', 'og:title', DEFAULT_TITLE);
  upsertMeta('property', 'og:description', DEFAULT_DESCRIPTION);
  upsertMeta('property', 'og:url', `${normalizedOrigin(origin)}/`);
  upsertMeta('name', 'twitter:title', DEFAULT_TITLE);
  upsertMeta('name', 'twitter:description', DEFAULT_DESCRIPTION);
  upsertCanonical(`${normalizedOrigin(origin)}/`);
  document.getElementById('portfolio-project-jsonld')?.remove();
}
