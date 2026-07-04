import { sortBlogPosts } from './blogSorting';
import { parseBlogMarkdown, type BlogPostFrontmatter, type BlogPostSection } from './blogMarkdown';

export interface BlogPost extends BlogPostFrontmatter {
  slug: string;
  sections: readonly BlogPostSection[];
}

const rawBlogPosts = import.meta.glob('./blog/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

function postFromMarkdown(path: string, markdown: string): BlogPost {
  const { frontmatter, sections } = parseBlogMarkdown(markdown);

  return {
    ...frontmatter,
    slug: path.split('/').pop()?.replace(/\.md$/, '') ?? frontmatter.title,
    sections,
  };
}

const parsedBlogPosts: readonly BlogPost[] = [...Object.entries(rawBlogPosts)].map(
  ([path, markdown]) => postFromMarkdown(path, markdown),
);

export const BLOG_POSTS: readonly BlogPost[] = sortBlogPosts(parsedBlogPosts);
