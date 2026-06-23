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
    deck: 'Vertical position uses a tougher curve: only elite real-world swing clears the three-point arc.',
    tone: 'text-[color:var(--color-primary)]',
  },
  difficulty: {
    label: 'Difficulty',
    deck: 'Vertical position uses a tougher curve: only unusually complex builds clear the three-point arc.',
    tone: 'text-[color:var(--color-secondary)]',
  },
  ambition: {
    label: 'Ambition',
    deck: 'Vertical position uses a tougher curve: only true ceiling bets clear the three-point arc.',
    tone: 'text-[color:var(--color-gold)]',
  },
  creativity: {
    label: 'Creativity',
    deck: 'Vertical position uses a tougher curve: only the most original project wedges clear the three-point arc.',
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
      'Run `pnpm clerk:doctor` again after `clerk auth login` and `clerk link`, then close the polymorphic `ExternalId` persistence gap and rerun the repo-level quality ladder.',
    trackerStatus: 'needs_attention',
    trackerScore: 79,
    lastUpdated: '2026-06-12',
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
      'Triage the 15 full-suite Python test failures and stale repo-wide Ruff/BasedPyright baselines before claiming repo-level quality green.',
    trackerStatus: 'needs_attention',
    trackerScore: 66,
    lastUpdated: '2026-06-22',
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
      'Run a fresh corpus sample after the planning refresh command, then decide whether dead-code scanning belongs in the release gate.',
    trackerStatus: 'on_track',
    trackerScore: 100,
    lastUpdated: '2026-05-19',
    tags: ['framework', 'governance', 'AI-tooling', 'validation'],
    grades: { impact: 8, difficulty: 8, ambition: 9, creativity: 8 },
    scoutTake:
      'The concept has real ceiling. The current gap is execution tempo, not lack of upside.',
  },
  {
    slug: 'bidcamp',
    title: 'BidCamp',
    shortCode: 'BC',
    summary:
      'Government-contracting SaaS platform with v1.0 shipped — full-stack Next.js app built on Supabase and Stripe with active work toward v1.1 feature expansion.',
    trackerComment:
      'Push chore/pre-cr-aios-hooks for review, then merge after branch review.',
    trackerStatus: 'on_track',
    trackerScore: 82,
    lastUpdated: '2026-06-23',
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
      'Launch the desktop app in dev mode and verify the responsive project board and detail pane behave correctly at half-width and full-width window sizes.',
    trackerStatus: 'needs_attention',
    trackerScore: 74,
    lastUpdated: '2026-04-19',
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
      'Plan the next trade-engine phase around multi-team trade scoring while keeping the Phase 21 opportunity feed and restored counterparty player picker stable.',
    trackerStatus: 'on_track',
    trackerScore: 78,
    lastUpdated: '2026-06-13',
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
      'Finish launch hardening: production room workflow UX, persisted session history, itemized estimate display, external-service retry states, and demo/UAT smoke coverage.',
    trackerStatus: 'needs_attention',
    trackerScore: 73,
    lastUpdated: '2026-06-22',
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
      'Add sign-and-trade/base-year/minimum-salary special cases, generated/consumed trade exception accounting, swap conveyance validation, and rollback-safe execution.',
    trackerStatus: 'on_track',
    trackerScore: 84,
    lastUpdated: '2026-06-12',
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
      'Run `pnpm clerk:doctor` again after `clerk auth login` and `clerk link`, then sync `.planning/STATE.md` with the newer comment and crosspost work.',
    trackerStatus: 'on_track',
    trackerScore: 72,
    lastUpdated: '2026-06-12',
    tags: ['blog', 'Vite', 'Postgres', 'Clerk', 'monorepo'],
    grades: { impact: 5, difficulty: 6, ambition: 6, creativity: 7 },
    scoutTake:
      'A technically complete blogging platform with real architecture behind it. Not flashy but it ships — and the crosspost layer adds reach.',
  },
  {
    slug: 'book',
    title: 'Book',
    shortCode: 'BK',
    summary:
      'Interactive digital book reader with chapter-specific visuals, music, ambient effects, particles, and a growing admin CMS layer for nontechnical chapter editing and soundtrack cue management.',
    trackerComment:
      'Deploy the Render blueprint with production `ADMIN_EMAIL` and `ADMIN_PASSWORD`, point the live domain at the Node service, and run `BOOK_SMOKE_BASE_URL=... pnpm run platform:fullstack-smoke` against the deployed service.',
    trackerStatus: 'on_track',
    trackerScore: 88,
    lastUpdated: '2026-06-13',
    tags: ['interactive-book', 'admin-CMS', 'audio', 'TypeScript', 'publishing'],
    grades: { impact: 6, difficulty: 7, ambition: 7, creativity: 9 },
    scoutTake:
      'A creative product with real atmosphere. The current leap is turning a hand-tuned reading experience into something an editor can run without touching code.',
  },
  {
    slug: 'github-issue-resolution-modeling',
    title: 'GitHub Issue Resolution Modeling',
    shortCode: 'GI',
    summary:
      'Survival-analysis pipeline and Next.js triage dashboard for predicting issue resolution time across major open-source repos, with reproducible stages, fixture-backed UI tests, and CI covering both the pipeline and dashboard.',
    trackerComment:
      'Run `make ingest` through `make export` with a real GITHUB_TOKEN, then start Phase 10 academic writeup work.',
    trackerStatus: 'on_track',
    trackerScore: 74,
    lastUpdated: '2026-05-18',
    tags: ['Python', 'Next.js', 'survival-analysis', 'GitHub', 'dashboard'],
    grades: { impact: 8, difficulty: 8, ambition: 7, creativity: 7 },
    scoutTake:
      'Strong evidence of real data-science depth paired with product instincts. The value is not just the model — it is the full loop from ingestion and feature work to a usable decision surface.',
  },
  {
    slug: 'signal-lab',
    title: 'Signal Lab',
    shortCode: 'SL',
    summary:
      'Basketball analytics platform built to separate real signal from noise — identifying which stats stabilize quickly, which remain unreliable, and how sample requirements shift by role and competition level.',
    trackerComment:
      'Downstream projects may consume the current Signal Lab report contracts for research MVP work; keep publishable claims framed as diagnostics because validation still has known caveats.',
    trackerStatus: 'on_track',
    trackerScore: 88,
    lastUpdated: '2026-05-20',
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
      'Populate salary/acquisition data and replace neutral CLFE portability once CLFE has stint-level outputs.',
    trackerStatus: 'needs_attention',
    trackerScore: 52,
    lastUpdated: '2026-05-20',
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
      'Execute CLFE Phase 1 plan 01-02: reconcile the schema contract, lock the first player family, and map feature lanes before archetype work.',
    trackerStatus: 'needs_attention',
    trackerScore: 60,
    lastUpdated: '2026-06-23',
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
      'Plan and implement RTE Phase 5: draft-slot-relative transferable-signal modeling and a 2026 translation-adjusted big board.',
    trackerStatus: 'on_track',
    trackerScore: 72,
    lastUpdated: '2026-06-05',
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
