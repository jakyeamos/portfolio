export type ProjectAxis = 'impact' | 'difficulty' | 'ambition' | 'creativity';

export interface CurrentProject {
  slug: string;
  title: string;
  shortCode: string;
  summary: string;
  trackerComment: string;
  trackerStatus: 'on_track' | 'needs_attention' | 'stalled' | 'shipped';
  trackerScore: number;
  lastUpdated: string;
  tags: readonly string[];
  grades: Record<ProjectAxis, number>;
  scoutTake: string;
}

export const PROJECT_AXIS_META: Record<
  ProjectAxis,
  { label: string; deck: string; tone: string }
> = {
  impact: {
    label: 'Impact',
    deck: 'Distance from the rim tracks how much real-world swing the project can create if it ships clean.',
    tone: 'text-[color:var(--color-primary)]',
  },
  difficulty: {
    label: 'Difficulty',
    deck: 'Distance from the rim tracks technical complexity, moving parts, and operational drag.',
    tone: 'text-[color:var(--color-secondary)]',
  },
  ambition: {
    label: 'Ambition',
    deck: 'Distance from the rim tracks scope, ceiling, and how much court the project is trying to cover.',
    tone: 'text-[color:var(--color-gold)]',
  },
  creativity: {
    label: 'Creativity',
    deck: 'Distance from the rim tracks originality of the concept, framing, or product wedge.',
    tone: 'text-[color:var(--color-primary)]',
  },
} as const;

export const CURRENT_PROJECTS: readonly CurrentProject[] = [
  {
    slug: 'soundscape',
    title: 'Soundscape',
    shortCode: 'SC',
    summary:
      'Full-stack music social platform in active development — covering discovery, ratings, feeds, market surfaces, clubs, and a shared web/mobile codebase in a TypeScript monorepo.',
    trackerComment:
      'Finalizing TypeScript quality standards across the monorepo ahead of public beta.',
    trackerStatus: 'on_track',
    trackerScore: 75,
    lastUpdated: '2026-04-09',
    tags: ['music', 'social', 'monorepo', 'tRPC', 'Prisma'],
    grades: { impact: 9, difficulty: 9, ambition: 10, creativity: 8 },
    scoutTake:
      'Big-floor product bet with real launch complexity. This is the highest-ambition possession on the board.',
  },
  {
    slug: 'aios',
    title: 'AIOS',
    shortCode: 'AI',
    summary:
      'Personal AI operating system built around session hooks, workflow orchestration, pattern extraction, and layered knowledge retrieval — actively used as the backbone of daily engineering operations.',
    trackerComment:
      'Expanding pattern extraction and memory systems to deepen cross-session context retention.',
    trackerStatus: 'on_track',
    trackerScore: 78,
    lastUpdated: '2026-04-09',
    tags: ['Python', 'shell', 'SQLite', 'automation', 'AI-tooling'],
    grades: { impact: 8, difficulty: 7, ambition: 9, creativity: 9 },
    scoutTake:
      'The most personal project on the board — meta-engineering that compounds with every other project. Hard to explain but impossible to ignore once you understand it.',
  },
  {
    slug: 'terrace',
    title: 'Terrace',
    shortCode: 'TR',
    summary:
      'Spec-driven AI development framework that governs structured, test-validated builds — designed to bring discipline and repeatability to AI-assisted engineering workflows.',
    trackerComment:
      'Proving the governance loop end-to-end on real repos to unlock the framework\'s core value proposition.',
    trackerStatus: 'needs_attention',
    trackerScore: 62,
    lastUpdated: '2026-04-09',
    tags: ['framework', 'governance', 'AI-tooling', 'validation'],
    grades: { impact: 8, difficulty: 8, ambition: 9, creativity: 8 },
    scoutTake:
      'The concept has real ceiling. The current gap is execution tempo, not lack of upside.',
  },
  {
    slug: 'amos-saas',
    title: 'Amos SaaS',
    shortCode: 'AS',
    summary:
      'Government-contracting SaaS platform with v1.0 shipped — full-stack Next.js app built on Supabase and Stripe with active work toward v1.1 feature expansion.',
    trackerComment:
      'Building out in-app notification infrastructure as the next milestone toward a feature-complete v1.1.',
    trackerStatus: 'needs_attention',
    trackerScore: 62,
    lastUpdated: '2026-04-09',
    tags: ['SaaS', 'Next.js', 'Supabase', 'Stripe', 'government'],
    grades: { impact: 8, difficulty: 7, ambition: 8, creativity: 7 },
    scoutTake:
      'A real business-shaped build. Less flashy than some others, but the practical value is obvious.',
  },
  {
    slug: 'taski',
    title: 'Taski',
    shortCode: 'TK',
    summary:
      'Electron + React + SQLite local-first task tracker with a full service layer and data architecture in place, currently being wired up for its first development run.',
    trackerComment:
      'Wiring the Electron entry point and validating the service layer to get the app running in dev mode.',
    trackerStatus: 'stalled',
    trackerScore: 48,
    lastUpdated: '2026-04-09',
    tags: ['Electron', 'React', 'SQLite', 'local-first', 'tracker'],
    grades: { impact: 7, difficulty: 8, ambition: 8, creativity: 8 },
    scoutTake:
      'Meta project with strong usefulness if it lands, but right now it is still trying to get on the floor.',
  },

  {
    slug: 'fantasy',
    title: 'Fantasy',
    shortCode: 'FT',
    summary:
      'Local-first dynasty fantasy football intelligence app featuring a working trade engine, FastAPI backend, React/Vite frontend, and DuckDB persistence — with multi-team scoring in active development.',
    trackerComment:
      'Extending the trade engine with multi-team scoring and counterparty player selection.',
    trackerStatus: 'on_track',
    trackerScore: 78,
    lastUpdated: '2026-04-09',
    tags: ['fantasy-football', 'FastAPI', 'React', 'DuckDB', 'dynasty'],
    grades: { impact: 6, difficulty: 7, ambition: 7, creativity: 8 },
    scoutTake:
      'A narrow domain executed with serious engineering depth. The trade-engine problem is genuinely hard to model — most people do not try.',
  },
  {
    slug: 'remodelvision',
    title: 'RemodelVision',
    shortCode: 'RV',
    summary:
      'AI-powered remodeling cost platform where homeowners upload a room photo and receive a generated renovation visualization alongside a line-item cost estimate. Core implementation complete and in final launch hardening.',
    trackerComment:
      'Finalizing observability, test coverage, and user acceptance checks before release.',
    trackerStatus: 'on_track',
    trackerScore: 79,
    lastUpdated: '2026-04-09',
    tags: ['Next.js', 'AI', 'Supabase', 'Clerk', 'remodeling'],
    grades: { impact: 8, difficulty: 7, ambition: 8, creativity: 8 },
    scoutTake:
      'A real product in a crowded space with a specific enough wedge to cut through. The generative visualization layer is the hook.',
  },
  {
    slug: 'bballedu',
    title: 'Bballedu',
    shortCode: 'BB',
    summary:
      'Court Vision — a web-first basketball IQ training platform featuring real-time multiplayer draft simulation, Monte Carlo modeling, and an Express/Socket.io backend.',
    trackerComment:
      'Closing out recent feature work and preparing the next wave of platform development.',
    trackerStatus: 'on_track',
    trackerScore: 72,
    lastUpdated: '2026-04-09',
    tags: ['basketball', 'education', 'React', 'Express', 'Socket.io'],
    grades: { impact: 7, difficulty: 7, ambition: 8, creativity: 8 },
    scoutTake:
      'Basketball × education × software is a tight niche with a real ceiling. Platform has depth if the content pipeline fills in behind it.',
  },
  {
    slug: 'dispatches',
    title: 'Dispatches',
    shortCode: 'DS',
    summary:
      'Full-stack blog platform with API routes, Postgres and Clerk integration, content-management flows, and cross-posting features — actively developed across a monorepo package structure.',
    trackerComment:
      'Planning the next content-management features as active development continues.',
    trackerStatus: 'on_track',
    trackerScore: 72,
    lastUpdated: '2026-04-09',
    tags: ['blog', 'Vite', 'Postgres', 'Clerk', 'monorepo'],
    grades: { impact: 5, difficulty: 6, ambition: 6, creativity: 7 },
    scoutTake:
      'A technically complete blogging platform with real architecture behind it. Not flashy but it ships — and the crosspost layer adds reach.',
  },
  {
    slug: 'signal-lab',
    title: 'Signal Lab',
    shortCode: 'SL',
    summary:
      'Basketball analytics platform built to separate real signal from noise — identifying which stats stabilize quickly, which remain unreliable, and how sample requirements shift by role and competition level.',
    trackerComment:
      'Building out the next analytical layer on top of the imported baseline and dashboard code.',
    trackerStatus: 'needs_attention',
    trackerScore: 64,
    lastUpdated: '2026-04-10',
    tags: ['basketball', 'analytics', 'Python', 'Streamlit'],
    grades: { impact: 7, difficulty: 6, ambition: 6, creativity: 7 },
    scoutTake:
      'The foundational layer for the whole BBDS suite. Gets the epistemics right before the downstream models have to rely on them.',
  },
  {
    slug: 'cap-fit-builder',
    title: 'Cap-Fit Builder',
    shortCode: 'CF',
    summary:
      'Contextual roster-fit analysis tool that identifies which players solve a specific team\'s real problems — accounting for cap constraints, role fit, playoff durability, and developmental upside.',
    trackerComment:
      'Locking MVP scope around the team-context wedge before beginning implementation.',
    trackerStatus: 'stalled',
    trackerScore: 34,
    lastUpdated: '2026-04-10',
    tags: ['basketball', 'analytics', 'Python'],
    grades: { impact: 7, difficulty: 7, ambition: 8, creativity: 8 },
    scoutTake:
      'The right question for team building: not "is this player good?" but "does this player solve our specific problems?" Most public tools do not ask it.',
  },
  {
    slug: 'clfe',
    title: 'CLFE',
    shortCode: 'CL',
    summary:
      'Contextual Lineup Fit Engine — models why a player elevates some lineups and drags down others, moving beyond raw on/off to explain conditional impact by roster context.',
    trackerComment:
      'Planning the first narrow analytical slice around conditional lineup impact.',
    trackerStatus: 'stalled',
    trackerScore: 34,
    lastUpdated: '2026-04-10',
    tags: ['basketball', 'analytics', 'Python'],
    grades: { impact: 7, difficulty: 8, ambition: 8, creativity: 8 },
    scoutTake:
      'Harder question than most lineup tools try to answer. The conditional framing is the whole value — strip that out and it is just another net rating tool.',
  },
  {
    slug: 'rte',
    title: 'RTE',
    shortCode: 'RT',
    summary:
      'Role Translation Engine — projects which NBA roles prospects can realistically succeed in by modeling context dependence, competition inflation, and role downshifting rather than ranking raw talent.',
    trackerComment:
      'Building the wings-first MVP to prove the role-translation model before expanding to other player families.',
    trackerStatus: 'stalled',
    trackerScore: 34,
    lastUpdated: '2026-04-10',
    tags: ['basketball', 'analytics', 'Python'],
    grades: { impact: 7, difficulty: 8, ambition: 8, creativity: 7 },
    scoutTake:
      'Draft analysis that actually asks the hard question. Role fit projection is more actionable than talent ranking — and substantially harder to model.',
  },
] as const;

export const CLOSED_PROJECTS: readonly CurrentProject[] = [
  {
    slug: 'pre-cr-suite',
    title: 'Pre-CR Suite',
    shortCode: 'PC',
    summary:
      'Cross-editor review-prep suite that validates changed-line test coverage, runs smart pre-review diagnostics, and generates documentation before a pull request opens — portable across VS Code, Neovim, and any LSP-compatible editor.',
    trackerComment:
      'Shipped as a reusable quality system for any LSP-compatible editor workflow.',
    trackerStatus: 'shipped',
    trackerScore: 100,
    lastUpdated: '2025-10-15',
    tags: ['TypeScript', 'LSP', 'developer-experience', 'VS Code', 'Neovim'],
    grades: { impact: 7, difficulty: 7, ambition: 6, creativity: 8 },
    scoutTake:
      'Winning-plays tape. Built where the process actually breaks down, not where the spotlight is.',
  },
] as const;
