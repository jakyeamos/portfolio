export interface BlogPost {
  slug: string;
  title: string;
  deck: string;
  status: string;
  date: string;
  tags: readonly string[];
  thesis: string;
  sections: readonly {
    heading: string;
    body: string;
  }[];
}

type BlogPostFrontmatter = Omit<BlogPost, 'slug' | 'sections'>;

const rawBlogPosts = import.meta.glob('./blog/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

function parseFrontmatter(markdown: string): { frontmatter: Record<string, string>; body: string } {
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(markdown);
  if (!match) {
    throw new Error('Blog post is missing frontmatter.');
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

function parseString(value: string | undefined, field: string): string {
  if (!value) {
    throw new Error(`Blog post is missing ${field}.`);
  }

  return value.replace(/^"|"$/g, '').replace(/\\"/g, '"');
}

function parseTags(value: string | undefined): readonly string[] {
  if (!value) {
    return [];
  }

  return value
    .replace(/^\[|\]$/g, '')
    .split(',')
    .map((tag) => tag.trim().replace(/^"|"$/g, ''))
    .filter(Boolean);
}

function parseSections(body: string): BlogPost['sections'] {
  return body
    .split(/^## /m)
    .filter(Boolean)
    .map((section) => {
      const [heading = '', ...bodyLines] = section.split('\n');

      return {
        heading: heading.trim(),
        body: bodyLines.join('\n').trim(),
      };
    })
    .filter((section) => section.heading && section.body);
}

function postFromMarkdown(path: string, markdown: string): BlogPost {
  const { frontmatter, body } = parseFrontmatter(markdown);
  const metadata: BlogPostFrontmatter = {
    title: parseString(frontmatter.title, 'title'),
    deck: parseString(frontmatter.deck, 'deck'),
    status: parseString(frontmatter.status, 'status'),
    date: parseString(frontmatter.date, 'date'),
    tags: parseTags(frontmatter.tags),
    thesis: parseString(frontmatter.thesis, 'thesis'),
  };

  return {
    ...metadata,
    slug: path.split('/').pop()?.replace(/\.md$/, '') ?? metadata.title,
    sections: parseSections(body),
  };
}

export const BLOG_POSTS: readonly BlogPost[] = [...Object.entries(rawBlogPosts)]
  .map(([path, markdown]) => postFromMarkdown(path, markdown))
  .sort((a: BlogPost, b: BlogPost) => b.date.localeCompare(a.date));
