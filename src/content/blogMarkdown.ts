export interface BlogPostFrontmatter {
  title: string;
  deck: string;
  status: string;
  date: string;
  pinned: boolean;
  tags: readonly string[];
  thesis: string;
}

export interface BlogPostSection {
  heading: string;
  body: string;
}

export interface ParsedBlogMarkdown {
  frontmatter: BlogPostFrontmatter;
  sections: readonly BlogPostSection[];
}

type FrontmatterField = keyof BlogPostFrontmatter;

const REQUIRED_STRING_FIELDS = ['title', 'deck', 'status', 'date', 'thesis'] as const;

function parseRawFrontmatter(markdown: string): { frontmatter: Record<string, string>; body: string } {
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(markdown);
  if (!match) {
    throw new Error('missing frontmatter');
  }

  const frontmatter = Object.fromEntries(
    match[1].split('\n').flatMap((line) => {
      const separatorIndex = line.indexOf(':');
      if (separatorIndex === -1) return [];

      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim();
      return [[key, value]];
    }),
  );

  return {
    frontmatter,
    body: markdown.slice(match[0].length).trim(),
  };
}

function stripQuotes(value: string): string {
  return value.replace(/^"|"$/g, '').replace(/\\"/g, '"');
}

function parseRequiredString(
  frontmatter: Record<string, string>,
  field: Extract<FrontmatterField, (typeof REQUIRED_STRING_FIELDS)[number]>,
): string {
  const value = frontmatter[field];
  if (!value) {
    throw new Error(`missing ${field} frontmatter`);
  }

  return stripQuotes(value);
}

function parseRequiredBoolean(value: string | undefined, field: FrontmatterField): boolean {
  if (!value) {
    throw new Error(`missing ${field} frontmatter`);
  }

  const normalizedValue = stripQuotes(value).toLowerCase();
  if (normalizedValue !== 'true' && normalizedValue !== 'false') {
    throw new Error(`${field} frontmatter must be true or false`);
  }

  return normalizedValue === 'true';
}

function parseRequiredTags(value: string | undefined): readonly string[] {
  if (!value) {
    throw new Error('missing tags frontmatter');
  }

  if (!value.startsWith('[') || !value.endsWith(']')) {
    throw new Error('tags frontmatter must be an inline array');
  }

  return value
    .replace(/^\[|\]$/g, '')
    .split(',')
    .map((tag) => stripQuotes(tag.trim()))
    .filter(Boolean);
}

function parseRequiredDate(frontmatter: Record<string, string>): string {
  const date = parseRequiredString(frontmatter, 'date');
  const timestamp = Date.parse(`${date}T00:00:00Z`);
  const normalizedDate = Number.isNaN(timestamp) ? '' : new Date(timestamp).toISOString().slice(0, 10);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || normalizedDate !== date) {
    throw new Error('date frontmatter must be YYYY-MM-DD');
  }

  return date;
}

function parseSections(body: string): readonly BlogPostSection[] {
  if (!body) {
    throw new Error('body is empty');
  }

  const sections: BlogPostSection[] = [];
  let currentSection: { heading: string; bodyLines: string[] } | undefined;

  function flushSection(): void {
    if (!currentSection) {
      return;
    }

    const sectionBody = currentSection.bodyLines.join('\n').trim();
    if (!sectionBody) {
      throw new Error(`section "${currentSection.heading}" is missing body text`);
    }

    sections.push({
      heading: currentSection.heading,
      body: sectionBody,
    });
  }

  for (const line of body.split('\n')) {
    if (line.startsWith('## ')) {
      flushSection();

      const heading = line.slice(3).trim();
      if (!heading) {
        throw new Error('section heading is empty');
      }

      currentSection = { heading, bodyLines: [] };
      continue;
    }

    if (!currentSection) {
      if (line.trim()) {
        throw new Error('body must start with a level-two section heading');
      }

      continue;
    }

    currentSection.bodyLines.push(line);
  }

  flushSection();

  if (sections.length === 0) {
    throw new Error('body must contain at least one level-two section');
  }

  return sections;
}

export function parseBlogMarkdown(markdown: string): ParsedBlogMarkdown {
  const { frontmatter, body } = parseRawFrontmatter(markdown);

  return {
    frontmatter: {
      title: parseRequiredString(frontmatter, 'title'),
      deck: parseRequiredString(frontmatter, 'deck'),
      status: parseRequiredString(frontmatter, 'status'),
      date: parseRequiredDate(frontmatter),
      pinned: parseRequiredBoolean(frontmatter.pinned, 'pinned'),
      tags: parseRequiredTags(frontmatter.tags),
      thesis: parseRequiredString(frontmatter, 'thesis'),
    },
    sections: parseSections(body),
  };
}
