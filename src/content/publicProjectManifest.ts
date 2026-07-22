export interface PublicProjectManifestEntry {
  slug: string;
  reviewedAt: string;
  reviewNote: string;
}

export const PUBLIC_PROJECT_MANIFEST: readonly PublicProjectManifestEntry[] = [
  {
    slug: 'soundscape',
    reviewedAt: '2026-07-21',
    reviewNote: 'Active product work with a public-safe portfolio summary.',
  },
  {
    slug: 'aios',
    reviewedAt: '2026-07-21',
    reviewNote: 'Public migration boundary with a public-safe portfolio summary.',
  },
  {
    slug: 'terrace',
    reviewedAt: '2026-07-21',
    reviewNote: 'Published developer-tool project with a public package surface.',
  },
  {
    slug: 'bidcamp',
    reviewedAt: '2026-07-21',
    reviewNote: 'Shipped product surface with public-safe product copy.',
  },
  {
    slug: 'fantasy',
    reviewedAt: '2026-07-21',
    reviewNote: 'Active product work with a public-safe portfolio summary.',
  },
  {
    slug: 'remodelvision',
    reviewedAt: '2026-07-21',
    reviewNote: 'Launch-hardening product work with public-safe product copy.',
  },
  {
    slug: 'bballedu',
    reviewedAt: '2026-07-21',
    reviewNote: 'Public BBDSE/CourtIQ product lane with a stable project slug.',
  },
  {
    slug: 'dispatches',
    reviewedAt: '2026-07-21',
    reviewNote: 'Active product work with a public-safe portfolio summary.',
  },
  {
    slug: 'book',
    reviewedAt: '2026-07-21',
    reviewNote: 'Active creative product work with public-safe editorial copy.',
  },
  {
    slug: 'signal-lab',
    reviewedAt: '2026-07-21',
    reviewNote: 'Public basketball research surface inside the BBDSE lane.',
  },
  {
    slug: 'cap-fit-builder',
    reviewedAt: '2026-07-21',
    reviewNote: 'Public basketball analytics surface inside the BBDSE lane.',
  },
  {
    slug: 'clfe',
    reviewedAt: '2026-07-21',
    reviewNote: 'Public basketball analytics surface inside the BBDSE lane.',
  },
  {
    slug: 'rte',
    reviewedAt: '2026-07-21',
    reviewNote: 'Public basketball analytics surface inside the BBDSE lane.',
  },
  {
    slug: 'quality-runner',
    reviewedAt: '2026-07-21',
    reviewNote: 'Shipped package with public distribution proof.',
  },
  {
    slug: 'eslint-plugin-anti-slop',
    reviewedAt: '2026-07-21',
    reviewNote: 'Shipped package with public distribution proof.',
  },
  {
    slug: 'agent-eval-contract',
    reviewedAt: '2026-07-21',
    reviewNote: 'Shipped package with public distribution proof.',
  },
  {
    slug: 'research-domain-writing',
    reviewedAt: '2026-07-21',
    reviewNote: 'Shipped package with public distribution proof.',
  },
  {
    slug: 'tmcp',
    reviewedAt: '2026-07-21',
    reviewNote: 'Shipped package with public distribution proof.',
  },
  {
    slug: 'pre-cr-suite',
    reviewedAt: '2026-07-21',
    reviewNote: 'Shipped package with public distribution proof.',
  },
] as const;

export const PUBLIC_PROJECT_SLUGS: readonly string[] = PUBLIC_PROJECT_MANIFEST.map(
  (entry) => entry.slug,
);
