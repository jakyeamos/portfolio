export interface PublicProjectManifestEntry {
  slug: string;
  reviewedAt: string;
  reviewNote: string;
  courtEligible: boolean;
}

export const PUBLIC_PROJECT_MANIFEST: readonly PublicProjectManifestEntry[] = [
  {
    slug: 'soundscape',
    reviewedAt: '2026-07-21',
    reviewNote: 'Active product work with a public-safe portfolio summary.',
    courtEligible: true,
  },
  {
    slug: 'aios',
    reviewedAt: '2026-07-21',
    reviewNote: 'Public migration boundary with a public-safe portfolio summary.',
    courtEligible: true,
  },
  {
    slug: 'agent-eval-runtime',
    reviewedAt: '2026-07-22',
    reviewNote:
      'Standalone eval runtime split from AIOS with a public-safe portfolio summary; court media review remains pending.',
    courtEligible: false,
  },
  {
    slug: 'ai-context-runtime',
    reviewedAt: '2026-07-22',
    reviewNote:
      'Standalone context runtime split from AIOS with a public-safe portfolio summary; court media review remains pending.',
    courtEligible: false,
  },
  {
    slug: 'ai-workflow-leverage',
    reviewedAt: '2026-07-22',
    reviewNote:
      'Standalone workflow-leverage runtime with a public-safe portfolio summary; court media review remains pending.',
    courtEligible: false,
  },
  {
    slug: 'mac-control',
    reviewedAt: '2026-07-22',
    reviewNote:
      'Command-first macOS control plane with a public-safe portfolio summary; court media review remains pending.',
    courtEligible: false,
  },
  {
    slug: 'marketing-autoresearch',
    reviewedAt: '2026-07-22',
    reviewNote:
      'Evidence-bounded marketing research runtime with a public-safe portfolio summary; court media review remains pending.',
    courtEligible: false,
  },
  {
    slug: 'relay',
    reviewedAt: '2026-07-22',
    reviewNote:
      'Private local-first macOS workbench with a public-safe portfolio summary; court media review remains pending.',
    courtEligible: false,
  },
  {
    slug: 'terrace',
    reviewedAt: '2026-07-22',
    reviewNote:
      'Published developer-tool project with npm v0.1.1 verified; v0.2.0 remains a staged candidate.',
    courtEligible: true,
  },
  {
    slug: 'bidcamp',
    reviewedAt: '2026-07-21',
    reviewNote: 'Shipped product surface with public-safe product copy.',
    courtEligible: true,
  },
  {
    slug: 'fantasy',
    reviewedAt: '2026-07-21',
    reviewNote: 'Active product work with a public-safe portfolio summary.',
    courtEligible: true,
  },
  {
    slug: 'remodelvision',
    reviewedAt: '2026-07-21',
    reviewNote: 'Launch-hardening product work with public-safe product copy.',
    courtEligible: true,
  },
  {
    slug: 'bballedu',
    reviewedAt: '2026-07-21',
    reviewNote: 'Public BBDSE/CourtIQ product lane with a stable project slug.',
    courtEligible: true,
  },
  {
    slug: 'dispatches',
    reviewedAt: '2026-07-21',
    reviewNote: 'Active product work with a public-safe portfolio summary.',
    courtEligible: true,
  },
  {
    slug: 'book',
    reviewedAt: '2026-07-21',
    reviewNote: 'Active creative product work with public-safe editorial copy.',
    courtEligible: true,
  },
  {
    slug: 'signal-lab',
    reviewedAt: '2026-07-21',
    reviewNote: 'Public basketball research surface inside the BBDSE lane.',
    courtEligible: true,
  },
  {
    slug: 'cap-fit-builder',
    reviewedAt: '2026-07-21',
    reviewNote: 'Public basketball analytics surface inside the BBDSE lane.',
    courtEligible: true,
  },
  {
    slug: 'clfe',
    reviewedAt: '2026-07-21',
    reviewNote: 'Public basketball analytics surface inside the BBDSE lane.',
    courtEligible: true,
  },
  {
    slug: 'rte',
    reviewedAt: '2026-07-21',
    reviewNote: 'Public basketball analytics surface inside the BBDSE lane.',
    courtEligible: true,
  },
  {
    slug: 'quality-runner',
    reviewedAt: '2026-07-22',
    reviewNote: 'PyPI v0.6.0 and the matching repository tag are verified.',
    courtEligible: true,
  },
  {
    slug: 'eslint-plugin-anti-slop',
    reviewedAt: '2026-07-22',
    reviewNote: 'npm v0.5.0 and the matching GitHub release are verified.',
    courtEligible: true,
  },
  {
    slug: 'agent-eval-contract',
    reviewedAt: '2026-07-22',
    reviewNote: 'PyPI v0.2.0 is public; validated v0.3.0 remains a staged dev candidate.',
    courtEligible: true,
  },
  {
    slug: 'research-domain-writing',
    reviewedAt: '2026-07-22',
    reviewNote: 'PyPI v0.1.0 is public; validated v0.3.0 remains a staged dev candidate.',
    courtEligible: true,
  },
  {
    slug: 'tmcp',
    reviewedAt: '2026-07-22',
    reviewNote: 'v0.5.7 GitHub release and marketplace/package integrity evidence are verified.',
    courtEligible: true,
  },
  {
    slug: 'pre-cr-suite',
    reviewedAt: '2026-07-22',
    reviewNote: 'npm v0.1.0 packages and the release tag are verified after the dev fold.',
    courtEligible: true,
  },
] as const;

export const PUBLIC_PROJECT_SLUGS: readonly string[] = PUBLIC_PROJECT_MANIFEST.map(
  (entry) => entry.slug,
);

export const PUBLIC_COURT_PROJECT_SLUGS: readonly string[] = PUBLIC_PROJECT_MANIFEST.filter(
  (entry) => entry.courtEligible,
).map((entry) => entry.slug);
