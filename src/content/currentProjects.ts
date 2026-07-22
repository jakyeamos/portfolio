export type ProjectAxis = 'impact' | 'difficulty' | 'ambition' | 'creativity';

export interface CurrentProject {
  slug: string;
  title: string;
  shortCode: string;
  summary: string;
  portfolioUpdate: string;
  trackerStatus: 'on_track' | 'needs_attention' | 'stalled' | 'shipped';
  trackerScore: number;
  lastUpdated: string;
  tags: readonly string[];
  grades: Record<ProjectAxis, number>;
  scoutTake: string;
}

export const PROJECT_AXIS_META: Record<ProjectAxis, { label: string; deck: string; tone: string }> =
  {
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
    portfolioUpdate: 'Active beta hardening across the shared web and mobile product surfaces.',
    trackerStatus: 'needs_attention',
    trackerScore: 78,
    lastUpdated: '2026-07-19',
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
      'Read-only migration shell for the former personal AI operating system; its portfolio evidence and active workflows now live in independent runtimes.',
    portfolioUpdate: 'AIOS is archived as a migration boundary while leverage, context, evaluation, and quality runtimes own active operations.',
    trackerStatus: 'stalled',
    trackerScore: 0,
    lastUpdated: '2026-07-21',
    tags: ['Python', 'shell', 'SQLite', 'automation', 'AI-tooling'],
    grades: { impact: 8, difficulty: 7, ambition: 9, creativity: 9 },
    scoutTake:
      'A useful architectural artifact, now intentionally retired as a monolith so its strongest capabilities can compound independently across the portfolio.',
  },
  {
    slug: 'terrace',
    title: 'Terrace',
    shortCode: 'TR',
    summary:
      'Published spec-driven AI development CLI that governs structured, test-validated builds — live on npm as @jakyeamos33/terrace with the 0.2.0 line staged in-repo for the next distribution pass.',
    portfolioUpdate: 'Public npm package with release-readiness checks and a staged next version.',
    trackerStatus: 'on_track',
    trackerScore: 100,
    lastUpdated: '2026-07-19',
    tags: ['framework', 'npm', 'AI-tooling', 'validation'],
    grades: { impact: 8, difficulty: 8, ambition: 9, creativity: 8 },
    scoutTake:
      'The concept now has a public package surface. The next test is whether the distribution path stays boring as the framework grows.',
  },
  {
    slug: 'bidcamp',
    title: 'Bidcamp',
    shortCode: 'BC',
    summary:
      'Government-contracting platform with v1.0 shipped — full-stack Next.js app built on Supabase and Stripe with active work toward v1.1 feature expansion.',
    portfolioUpdate: 'v1.0 is shipped; the next product expansion is in active development.',
    trackerStatus: 'needs_attention',
    trackerScore: 78,
    lastUpdated: '2026-07-04',
    tags: ['GovCon', 'Next.js', 'Supabase', 'Stripe', 'government'],
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
    portfolioUpdate: 'Local-first desktop workbench with the core service and data layers in place.',
    trackerStatus: 'needs_attention',
    trackerScore: 78,
    lastUpdated: '2026-06-29',
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
    portfolioUpdate: 'Trade-engine and multi-team scoring systems remain in active development.',
    trackerStatus: 'on_track',
    trackerScore: 78,
    lastUpdated: '2026-07-03',
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
    portfolioUpdate: 'Core product is complete and moving through launch hardening.',
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
    title: 'BBDSE CourtIQ',
    shortCode: 'BB',
    summary:
      'Merged BBDSE CourtIQ lane: the Court Vision/Bballedu draft, lobby, waiting-room, and recap runtime now lives inside the BBDSE product suite, with the old standalone repo preserved as an archive/fallback boundary.',
    portfolioUpdate: 'CourtIQ and the BBDSE runtime now share one unified product lane.',
    trackerStatus: 'on_track',
    trackerScore: 86,
    lastUpdated: '2026-07-21',
    tags: ['basketball', 'CourtIQ', 'BBDSE', 'Next.js', 'draft-sim'],
    grades: { impact: 7, difficulty: 7, ambition: 8, creativity: 8 },
    scoutTake:
      'The merge makes the basketball product story cleaner: CourtIQ becomes the user-facing simulator surface while BBDSE owns the analytics and product-suite runtime behind it.',
  },
  {
    slug: 'dispatches',
    title: 'Dispatches',
    shortCode: 'DS',
    summary:
      'Full-stack blog platform with API routes, Postgres and Clerk integration, content-management flows, and cross-posting features — actively developed across a monorepo package structure.',
    portfolioUpdate: 'Blogging and cross-posting platform with its core architecture shipped.',
    trackerStatus: 'on_track',
    trackerScore: 70,
    lastUpdated: '2026-07-03',
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
    portfolioUpdate: 'Interactive reader and editorial tooling are under active refinement.',
    trackerStatus: 'on_track',
    trackerScore: 76,
    lastUpdated: '2026-07-14',
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
    portfolioUpdate: 'Reproducible analysis pipeline and triage surface are ready for release.',
    trackerStatus: 'on_track',
    trackerScore: 84,
    lastUpdated: '2026-07-10',
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
    portfolioUpdate: 'Research diagnostics frame the evidence behind the basketball product suite.',
    trackerStatus: 'on_track',
    trackerScore: 88,
    lastUpdated: '2026-06-30',
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
      "Contextual roster-fit analysis tool that identifies which players solve a specific team's real problems — accounting for cap constraints, role fit, playoff durability, and developmental upside.",
    portfolioUpdate: 'Team-context modeling work remains in development.',
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
    portfolioUpdate: 'Lineup-context modeling work remains in development.',
    trackerStatus: 'needs_attention',
    trackerScore: 62,
    lastUpdated: '2026-06-30',
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
    portfolioUpdate: 'Role-translation modeling is moving through its next release.',
    trackerStatus: 'on_track',
    trackerScore: 75,
    lastUpdated: '2026-07-04',
    tags: ['basketball', 'analytics', 'Python'],
    grades: { impact: 7, difficulty: 8, ambition: 8, creativity: 7 },
    scoutTake:
      'Draft analysis that actually asks the hard question. Role fit projection is more actionable than talent ranking — and substantially harder to model.',
  },
] as const;

export const CLOSED_PROJECTS: readonly CurrentProject[] = [
  {
    slug: 'quality-runner',
    title: 'Quality Runner',
    shortCode: 'QR',
    summary:
      'Released PyPI package and MCP server for running repository quality checks, collecting evidence, and turning local verification into a machine-readable proof artifact.',
    portfolioUpdate: 'Published to PyPI as quality-runner v0.3.1 on 2026-07-04.',
    trackerStatus: 'shipped',
    trackerScore: 100,
    lastUpdated: '2026-07-04',
    tags: ['Python', 'PyPI', 'MCP', 'quality-gates'],
    grades: { impact: 8, difficulty: 7, ambition: 8, creativity: 8 },
    scoutTake:
      'Strong public proof because it packages the quality-gate obsession into something other repos can actually run.',
  },
  {
    slug: 'eslint-plugin-anti-slop',
    title: 'ESLint Anti-Slop',
    shortCode: 'AS',
    summary:
      'Released ESLint plugin that catches low-signal AI/code-review patterns before they land, giving TypeScript repos a targeted guardrail against vague or sloppy generated code.',
    portfolioUpdate: 'Published to npm as eslint-plugin-anti-slop v0.2.0 on 2026-07-04.',
    trackerStatus: 'shipped',
    trackerScore: 100,
    lastUpdated: '2026-07-04',
    tags: ['TypeScript', 'npm', 'ESLint', 'static-analysis'],
    grades: { impact: 7, difficulty: 6, ambition: 6, creativity: 8 },
    scoutTake:
      'A clean small-package release: narrow scope, obvious workflow fit, and easy adoption for teams already living in lint.',
  },
  {
    slug: 'agent-eval-contract',
    title: 'Agent Eval Contract',
    shortCode: 'AE',
    summary:
      'Released PyPI package with typed contracts for agent evaluations: cases, rubrics, evidence, run metadata, and result payloads that stay consistent across evaluators.',
    portfolioUpdate: 'Published to PyPI as agent-eval-contract v0.2.0 on 2026-07-04.',
    trackerStatus: 'shipped',
    trackerScore: 100,
    lastUpdated: '2026-07-04',
    tags: ['Python', 'PyPI', 'Pydantic', 'agent-evals'],
    grades: { impact: 8, difficulty: 7, ambition: 7, creativity: 7 },
    scoutTake:
      'Useful because it attacks the boring part of agent evals: getting every run to speak the same evidence language.',
  },
  {
    slug: 'research-domain-writing',
    title: 'Research Domain Writing',
    shortCode: 'RD',
    summary:
      'Released PyPI package for research-grounded writing workflows that preserve source evidence, domain framing, and claim discipline from research through draft output.',
    portfolioUpdate: 'Published to PyPI as research-domain-writing v0.1.0 on 2026-07-04.',
    trackerStatus: 'shipped',
    trackerScore: 100,
    lastUpdated: '2026-07-04',
    tags: ['Python', 'PyPI', 'research', 'writing-systems'],
    grades: { impact: 7, difficulty: 7, ambition: 7, creativity: 8 },
    scoutTake:
      'A good bridge between engineering systems and public communication: source-backed writing instead of hand-wavy positioning.',
  },
  {
    slug: 'tmcp',
    title: 'TMCP',
    shortCode: 'TM',
    summary:
      'Released Claude + Codex marketplace-tested MCP/plugin distribution for composable skill-packet workflows including expert audits, release readiness, UI rubrics, routing policies, and agent handoffs.',
    portfolioUpdate:
      'The v0.3.2 release is verified across marketplace install flows and public package integrity checks.',
    trackerStatus: 'shipped',
    trackerScore: 100,
    lastUpdated: '2026-07-04',
    tags: ['Python', 'MCP', 'Claude', 'Codex', 'agent-workflows'],
    grades: { impact: 8, difficulty: 8, ambition: 9, creativity: 9 },
    scoutTake:
      'The proof got stronger because the release was verified across real install paths and public distribution checks instead of stopping at a tag.',
  },
  {
    slug: 'pre-cr-suite',
    title: 'Pre-CR Suite',
    shortCode: 'PC',
    summary:
      'Released npm package surface for coverage-first pre-PR readiness: @pre-cr/core and @pre-cr/server expose changed-line coverage checks and reusable review diagnostics before a pull request opens.',
    portfolioUpdate:
      'Published to npm as @pre-cr/core v0.1.0 and @pre-cr/server v0.1.0 on 2026-07-04.',
    trackerStatus: 'shipped',
    trackerScore: 100,
    lastUpdated: '2026-07-04',
    tags: ['TypeScript', 'npm', 'coverage', 'developer-experience'],
    grades: { impact: 7, difficulty: 7, ambition: 6, creativity: 8 },
    scoutTake:
      'Winning-plays tape. Built where the process actually breaks down, not where the spotlight is.',
  },
] as const;
