export interface PosterMediaAsset {
  imageSrc?: string;
  alt: string;
  objectPosition?: string;
  width?: number;
  height?: number;
}

export interface EvidenceImageAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
  provenance: string;
}

export type CaseStudyProject = 'quality-runner' | 'pre-cr-suite' | 'soundscape';

export interface ProjectEvidence {
  project: CaseStudyProject;
  label: string;
  href: string;
  sourceLabel: string;
  reviewStatus: 'source-reviewed' | 'pending-rights-attestation' | 'approved';
  reviewNote?: string;
  image?: EvidenceImageAsset;
}

export const PORTFOLIO_ASSETS = {
  home: {
    broadcastLead: {
      imageSrc: '/media/headshots/jakye-main-1200.jpg',
      alt: 'Jakye Amos headshot',
      objectPosition: 'center 18%',
      width: 960,
      height: 1200,
    },
  },
  scouting: {
    portrait: {
      imageSrc: '/media/headshots/jakye-main-1200.jpg',
      alt: 'Jakye Amos portrait headshot',
      objectPosition: 'center 16%',
      width: 960,
      height: 1200,
    },
  },
  playerComps: {
    haliburton: {
      imageSrc: 'https://a.espncdn.com/i/headshots/nba/players/full/4396993.png',
      alt: 'Tyrese Haliburton headshot',
      objectPosition: 'center top',
    },
    ausar: {
      imageSrc: 'https://a.espncdn.com/i/headshots/nba/players/full/4684742.png',
      alt: 'Ausar Thompson headshot',
      objectPosition: 'center top',
    },
  },
} as const;

export const PROJECT_EVIDENCE = {
  qualityRunner: {
    project: 'quality-runner',
    label: 'View Quality Runner source',
    href: 'https://github.com/jakyeamos/quality-runner',
    sourceLabel: 'GitHub repository',
    reviewStatus: 'source-reviewed',
  },
  preCrSuite: {
    project: 'pre-cr-suite',
    label: 'View Pre-CR Suite source',
    href: 'https://github.com/jakyeamos/pre-cr-suite',
    sourceLabel: 'GitHub repository',
    reviewStatus: 'source-reviewed',
  },
  soundscape: {
    project: 'soundscape',
    label: 'View Soundscape source',
    href: 'https://github.com/jakyeamos/soundscape-app',
    sourceLabel: 'GitHub repository',
    reviewStatus: 'pending-rights-attestation',
    reviewNote:
      'A real Soundscape landing capture was reviewed for privacy and accuracy, but its canonical hero-image rights are not yet attested. The portfolio intentionally remains text-first until that review is complete.',
  },
} as const satisfies Record<string, ProjectEvidence>;
