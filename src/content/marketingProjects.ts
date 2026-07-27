export const MARKETING_PROJECT_SLUGS = ['soundscape', 'bballedu', 'book', 'pronto'] as const;

export type MarketingProjectSlug = (typeof MARKETING_PROJECT_SLUGS)[number];

export const MARKETING_PROJECT_REPOSITORIES: Readonly<Record<MarketingProjectSlug, string>> = {
  soundscape: 'https://github.com/jakyeamos/soundscape-app',
  bballedu: 'https://github.com/jakyeamos/BBDSE',
  book: 'https://github.com/jakyeamos/Book',
  pronto: 'https://github.com/jakyeamos/pronto',
};

export function isMarketingProjectSlug(value: string): value is MarketingProjectSlug {
  return (MARKETING_PROJECT_SLUGS as readonly string[]).includes(value);
}
