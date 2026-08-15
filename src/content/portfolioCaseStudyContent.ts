import { PORTFOLIO_ASSETS, PROJECT_EVIDENCE } from '@/content/portfolioAssets';
import type {
  ConceptNote,
  FilmRoomProject,
  PlayerComp,
  WebsiteLaunch,
} from '@/content/portfolioContent';

export const FILM_ROOM_PROJECTS: readonly FilmRoomProject[] = [
  {
    kicker: 'Release Tape',
    title: 'Quality Runner',
    deck: 'A PyPI package and MCP server that turns repo-quality checks into machine-readable evidence instead of one-off local ritual.',
    badge: 'Public package',
    tone: 'red',
    evidence: PROJECT_EVIDENCE.qualityRunner,
    stack: ['Python', 'PyPI', 'MCP', 'Quality gates'],
    situation:
      'AI-assisted engineering keeps producing work that looks done before the repo has proof that it is actually ready.',
    challenge:
      'Make verification reusable across projects without burying the evidence in terminal scrollback or project-specific scripts.',
    built:
      'Packaged a CLI and MCP server that can run quality checks, preserve evidence, and expose the results in a format agents and humans can both consume.',
    result:
      'Quality Runner is now live on PyPI as quality-runner v0.6.0, with the v0.6.0 repository tag verified against the promoted dev truth.',
    whyItMatters:
      'This is the clearest public proof of the current thesis: agent work needs specs, checks, and artifacts that survive beyond the chat window.',
    engineeringRead:
      'Jakye is turning personal engineering discipline into reusable infrastructure instead of leaving it as private taste.',
  },
  {
    kicker: 'Workflow Tape',
    title: 'Pre-CR Suite',
    deck: 'A released npm package surface for changed-line coverage checks and reusable pre-review diagnostics before the pull request opens.',
    badge: 'Glue-guy project',
    tone: 'blue',
    evidence: PROJECT_EVIDENCE.preCrSuite,
    stack: ['TypeScript', 'npm packages', 'LSP tooling', 'Developer experience'],
    situation:
      'Code review quality often depends on memory, manual ritual, and whichever editor somebody happens to be using that day.',
    challenge:
      'Make the workflow portable across VS Code, Neovim, and other LSP-compatible editors instead of tying the solution to one preferred setup.',
    built:
      'Designed a reusable suite that validates changed-line coverage, runs smart pre-review checks, and exposes the core/server package layer for automation.',
    result:
      '@pre-cr/core and @pre-cr/server are now live on npm at v0.1.0, turning the review-prep system into a real package surface.',
    whyItMatters:
      'This is winning-plays tape. It addresses the work that helps teams win cleaner possessions even when nobody is handing out points for it.',
    engineeringRead:
      'Jakye notices where process breaks down in the real world and builds the tool where the pain actually lives.',
  },
  {
    kicker: 'Product Tape',
    title: 'Soundscape',
    deck: 'A full-rotation product build with web, mobile, shared logic, discovery systems, market surfaces, clubs, sets, and admin tooling all living in the same offense.',
    badge: 'Lead creation reps',
    tone: 'gold',
    evidence: PROJECT_EVIDENCE.soundscape,
    stack: ['Next.js 14', 'tRPC', 'Prisma', 'Expo', 'Monorepo'],
    situation:
      'Build a music product broad enough to support discovery, ratings, feeds, market and portfolio features, clubs, artist briefs, and shared web/mobile logic without letting the system sprawl.',
    challenge:
      'Keep a large feature set coherent across a Next.js web app, services and API layer, shared platform logic, Prisma data model, shared UI, and an Expo mobile client.',
    built:
      'Structured the product as a real monorepo and shipped across feed, search, market, portfolio, ratings, profiles, compare, sets, charity, support, wrapped, onboarding, settings, admin tooling, feature flags, telemetry, and SEO.',
    result:
      'The end result is a deep roster build, not a one-screen demo. It shows comfort handling product ambition and system structure at the same time.',
    whyItMatters:
      'This is the tape for lead-ball-handler upside: seeing the whole floor, keeping the offense organized, and making multiple surfaces feel like one product.',
    engineeringRead:
      'Jakye looks comfortable running a lot of action without losing the shared contracts and product discipline that keep the possession alive.',
  },
] as const;

export const BENCH_PROJECTS = [
  {
    kicker: 'Portfolio command center',
    title: 'Pronto',
    copy: 'Public v1 local-first desktop surface for repository discovery, quality evidence, CI-readiness signals, GitHub snapshots, and read-only preparation previews.',
  },
  {
    kicker: 'Lint guardrail',
    title: 'ESLint Anti-Slop',
    copy: 'npm-released ESLint plugin that catches low-signal AI/code-review patterns before they land in TypeScript codebases.',
  },
  {
    kicker: 'Eval contract',
    title: 'Agent Eval Contract',
    copy: 'PyPI-released package for consistent agent-eval cases, rubrics, evidence payloads, run metadata, and results.',
  },
  {
    kicker: 'MCP workflows',
    title: 'TMCP',
    copy: 'Current v0.5.8 GitHub release for Claude/Codex MCP/plugin distribution; marketplace smokes, MCP Registry validation, and public tarball proof remain the distribution evidence surface.',
  },
  {
    kicker: 'Portable agent workflows',
    title: 'Portable Agentic Workbench',
    copy: 'Public vendor-neutral workbench for context management, workflow routing, safety, evaluation, and durable handoffs with explicit dry-run/apply boundaries.',
  },
  {
    kicker: 'Contract surface',
    title: 'Context Compiler Contract',
    copy: 'Public repository of portable ESM validators for context-compiler results and routing manifests; runtime selection and compilation remain owned by AIOS.',
  },
] as const;

export const CONCEPT_NOTES: readonly ConceptNote[] = [
  {
    label: 'Concept watch',
    title: 'Quality Evidence Contract',
    copy: 'Still below the fold until the registry and repo proof match the idea, but it is the obvious adjacent lane after Quality Runner and Agent Eval Contract.',
  },
] as const;

export const WEBSITE_LAUNCHES: readonly WebsiteLaunch[] = [
  {
    label: 'Live product',
    title: "Chiron's Forge",
    href: 'https://www.chironsforge.com/',
    copy: 'Multi-AI research pipeline that turns raw intent into expert AI skills, research reports, and Cursor rules, with an independent judge/refinement loop before delivery.',
  },
  {
    label: 'Live website',
    title: 'FRMWRK Labs',
    href: 'https://www.frmwrklabs.com/',
    copy: 'Software research lab building standalone reasoning engines: Concordia, Continuum, and Praxis, with production and development status stated on the live site.',
  },
  {
    label: 'Public repo / deployment paused',
    title: 'BBDSE',
    href: 'https://github.com/jakyeamos/BBDSE',
    copy: 'Basketball analytics and decision-support suite that owns the merged CourtIQ/Court Vision product lane; the public Vercel deployment is currently paused.',
  },
] as const;

export const MISSING_PROJECT_PACKETS = [
  {
    title: 'Career Dashboard',
    copy: 'Still needs a local project brief, screenshots, or source notes before it should get real minutes on the live site.',
  },
] as const;

export const PLAYER_COMPS: readonly PlayerComp[] = [
  {
    player: 'Tyrese Haliburton',
    team: 'Indiana Pacers',
    role: 'High-pace playmaker',
    badge: 'Tempo comp',
    scoutingHook:
      'Pushes the game forward, sees the next read early, and makes everybody else easier to play with.',
    translation:
      'This maps to the way Jakye moves through engineering work: quick reads across product and platform, clean handoffs, and a habit of turning scattered pieces into one organized possession.',
    whyItFits:
      'The local record shows range across Amazon systems, analytics, workflow tooling, consulting builds, and product work. The throughline is connective playmaking more than narrow specialization.',
    overlap: [
      'Fast processor',
      'Connective builder',
      'Raises team rhythm',
      'Makes the next action cleaner',
    ],
    media: PORTFOLIO_ASSETS.playerComps.haliburton,
  },
  {
    player: 'Ausar Thompson',
    team: 'Detroit Pistons',
    role: 'Dirty-work winner',
    badge: 'Winning-plays comp',
    scoutingHook:
      'Covers ground, fills gaps, takes the hard assignment, and impacts winning even when the box score is not screaming for attention.',
    translation:
      'This shows up in the workflow-tooling side of the portfolio: review systems, automation, coverage visibility, dashboards, and the kind of engineering work that keeps whole teams cleaner.',
    whyItFits:
      'A lot of Jakye’s strongest source-backed value is not just shiny shipping. It is the possession work that helps everyone else execute faster and with more confidence.',
    overlap: ['Low-ego impact', 'Workflow cleanup', 'Possession saver', 'Does the extra work'],
    media: PORTFOLIO_ASSETS.playerComps.ausar,
  },
] as const;

export const PLAYER_COMP_NOTES = [
  'These are style comps, not ceiling comps.',
  'The Haliburton side is about pace, processing, and connective orchestration.',
  'The Ausar side is about utility, defensive-minded problem solving, and doing the work that helps teams win possessions.',
] as const;

export const IMPACT_METRICS = [
  {
    label: 'Biggest swing',
    value: '400%',
    detail:
      'Cleveland architecture firm productivity software increased operational output by 400 percent in under 5 weeks.',
  },
  {
    label: 'Shot-clock win',
    value: '2 weeks',
    detail: 'Cleveland Clinic clinical coaching MVP delivered on a 2-week clock.',
  },
  {
    label: 'Timeline cut',
    value: '90%',
    detail:
      'Proprietary AI marketing automation tools reduced production timelines by 90 percent for an A16z startup.',
  },
  {
    label: 'Run created',
    value: '1.5M',
    detail: 'That same A16z startup tooling helped generate 1.5 million organic views.',
  },
] as const;

export const IMPACT_CASES = [
  {
    kicker: 'Healthcare',
    title: 'Cleveland Clinic MVP',
    summary:
      'This is the short-shot-clock file: not just a prototype, but a usable clinical coaching MVP delivered fast enough to matter.',
    before: 'Need a clinical coaching MVP and no production-ready solution on the floor yet.',
    after: 'Full-stack architecture delivered on a 2-week clock in a regulated environment.',
    result: 'MVP shipped in 2 weeks',
  },
  {
    kicker: 'Operations',
    title: 'Architecture firm productivity software',
    summary:
      'A workflow-software engagement built to change the team’s operating pace, not just freshen up the surface layer.',
    before: 'Operational work moving slower than the firm needed.',
    after:
      'Custom productivity software deployed in under 5 weeks to tighten execution and remove drag.',
    result: 'Operational output increased 400%',
  },
  {
    kicker: 'Marketing automation',
    title: 'A16z startup content tooling',
    summary:
      'AI systems built to compress production timelines while still creating enough volume to move the audience scoreboard.',
    before: 'Production timelines too slow for the content pace the startup wanted to play with.',
    after:
      'Proprietary AI marketing automation tools accelerated the pipeline and unlocked much higher content throughput.',
    result: 'Production timelines reduced 90% and 1.5M organic views generated',
  },
  {
    kicker: 'Deepr',
    title: 'Carousel system and code review tooling',
    summary:
      'A mixed file where the qualitative read is strong, but the public-facing metric language has to stay disciplined.',
    before:
      'Need stronger marketing viewership growth and better coverage awareness inside review workflows.',
    after:
      'AI-powered photo carousel tooling plus an inline coverage-vector tool improved both outward content flow and inward developer feedback.',
    result: 'Substantial growth in marketing viewership',
  },
] as const;

export const IMPACT_COMPARISON_ROWS = [
  {
    engagement: 'Cleveland Clinic',
    baseline: 'MVP still needed',
    improved: 'Clinical coaching MVP delivered',
    result: '2-week ship window',
  },
  {
    engagement: 'Architecture firm',
    baseline: 'Operational work constrained by slower processes',
    improved: 'Productivity software installed in under 5 weeks',
    result: '400 percent output increase',
  },
  {
    engagement: 'A16z startup',
    baseline: 'Marketing production timelines too slow',
    improved: 'AI automation pipeline driving more output',
    result: '90 percent timeline reduction and 1.5M organic views',
  },
  {
    engagement: 'Deepr',
    baseline: 'Need higher-velocity marketing coverage and better review awareness',
    improved: 'AI carousel tooling and coverage-vector workflow support',
    result: 'Substantial viewership growth, qualitative only',
  },
] as const;

export const DEEPR_NOTE = {
  summary:
    'Deepr deserves real airtime, but the site still keeps the scouting report honest. The 400 percent output number belongs to a different engagement in the source CV.',
  documented:
    'Jakye engineered an AI-powered photo carousel system that drove substantial growth in marketing viewership and built an inline coverage-vector tool for real-time testing coverage awareness during code reviews.',
  todo: 'If there is a Deepr-specific metrics sheet, screenshot set, or case-study packet elsewhere, add it before pushing the section louder than this.',
} as const;

export const IMPACT_SUPPORTING_STATS = [
  {
    label: 'Legacy refactor',
    value: '11 days',
    copy: 'End-to-end refactor for STEM Playbook launched in 11 days for a major live event.',
  },
  {
    label: 'Campus scale',
    value: '600+',
    copy: 'CWRU Flea Market events averaged 600-plus attendees.',
  },
  {
    label: 'Event revenue',
    value: '~$7K',
    copy: 'The same campus events generated roughly $7K in revenue per event.',
  },
  {
    label: 'Internship window',
    value: '2023-2025',
    copy: 'Amazon internship work spans multiple terms across that window.',
  },
] as const;
