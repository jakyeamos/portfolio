export interface SortableBlogPost {
  date: string;
  pinned: boolean;
}

export function sortBlogPosts<T extends SortableBlogPost>(posts: readonly T[]): T[] {
  return [...posts].sort((a, b) => {
    const pinnedComparison = Number(b.pinned) - Number(a.pinned);

    if (pinnedComparison !== 0) {
      return pinnedComparison;
    }

    return b.date.localeCompare(a.date);
  });
}
