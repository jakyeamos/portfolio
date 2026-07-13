import {
  PORTFOLIO_ASSETS,
  PROJECT_EVIDENCE,
  type PosterMediaAsset,
  type ProjectEvidence,
} from '@/content/portfolioAssets';

export interface QuickLink {
  label: string;
  href: string;
  detail: string;
  download?: boolean;
  downloadFileName?: string;
}

export interface Headline {
  category: string;
  title: string;
  meta: string;
  href: string;
}

export interface FilmRoomProject {
  kicker: string;
  title: string;
  deck: string;
  badge: string;
  detail?: string;
  tone: 'red' | 'blue' | 'gold';
  evidence: ProjectEvidence;
  stack: readonly string[];
  situation: string;
  challenge: string;
  built: string;
  result: string;
  whyItMatters: string;
  engineeringRead: string;
}

export interface HeroAction {
  label: string;
  href: string;
  kind: 'route' | 'external';
  variant: 'primary' | 'secondary' | 'ghost';
  download?: boolean;
  downloadFileName?: string;
}

export interface HeroProof {
  value: string;
  label: string;
  detail: string;
}

export interface HiringManagerRead {
  label: string;
  title: string;
  copy: string;
}

export interface PlayerComp {
  player: string;
  team: string;
  role: string;
  badge: string;
  scoutingHook: string;
  translation: string;
  whyItFits: string;
  overlap: readonly string[];
  media: PosterMediaAsset;
}

export interface WebsiteLaunch {
  title: string;
  href: string;
  label: string;
  copy: string;
}

export interface ConceptNote {
  title: string;
  label: string;
  copy: string;
}

export const SITE_META = {
  name: 'Jakye Amos',
  brand: 'Front Office // Amos',
  role: 'Full-Stack Software Engineer',
  location: 'US / Remote',
  school: 'Case Western Reserve University',
  graduation: 'Expected May 2026',
  opportunityStatus: 'Open to opportunities',
} as const;

export const PAGE_LINKS = [
  { label: 'Front Page', shortLabel: 'Front', path: '/' },
  {
    label: 'Scouting Report',
    shortLabel: 'Scouting',
    path: '/scouting-report',
  },
  { label: 'Film Room', shortLabel: 'Film', path: '/film-room' },
  { label: 'Blog', path: '/blog' },
  { label: 'Projects', path: '/projects' },
  { label: 'Player Comps', shortLabel: 'Comps', path: '/player-comps' },
  { label: 'Impact Report', shortLabel: 'Impact', path: '/impact-report' },
] as const;

export const QUICK_LINKS: readonly QuickLink[] = [
  {
    label: 'Download Resume',
    href: '/docs/Jakye_Amos_Comprehensive_CV.docx',
    detail: 'DOCX',
    download: true,
    downloadFileName: 'Jakye_Amos_Resume.docx',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/jakyeamos',
    detail: 'Open',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/jakyeamos',
    detail: 'Open',
  },
  {
    label: 'Email',
    href: 'mailto:Jakyejobs@gmail.com',
    detail: 'Contact',
  },
] as const;

export const HERO_ACTIONS: readonly HeroAction[] = [
  {
    label: 'Download resume',
    href: '/docs/Jakye_Amos_Comprehensive_CV.docx',
    kind: 'external',
    variant: 'primary',
    download: true,
    downloadFileName: 'Jakye_Amos_Resume.docx',
  },
  {
    label: 'Read scouting report',
    href: '/scouting-report',
    kind: 'route',
    variant: 'secondary',
  },
  {
    label: 'Open projects',
    href: '/projects',
    kind: 'route',
    variant: 'ghost',
  },
  {
    label: 'Email',
    href: 'mailto:Jakyejobs@gmail.com',
    kind: 'external',
    variant: 'ghost',
  },
] as const;

export const HERO_PROOF: readonly HeroProof[] = [
  {
    value: 'PyPI/npm',
    label: 'Release proof',
    detail:
      'Public packages now live across Quality Runner, Anti-Slop, Agent Eval Contract, Research Domain Writing, Pre-CR, and Terrace.',
  },
  {
    value: 'Amazon',
    label: 'Enterprise reps',
    detail: 'Internship work across Ads and FinTech from 2023 through 2025.',
  },
  {
    value: '400%',
    label: 'Output gain',
    detail: 'Architecture-firm productivity software lifted team output in under 5 weeks.',
  },
] as const;

export const HIRING_MANAGER_READ: readonly HiringManagerRead[] = [
  {
    label: 'Best fit',
    title: 'Product-heavy engineering teams',
    copy: 'Strongest fit is full-stack product work where backend, frontend, data, and AI workflow logic have to connect quickly.',
  },
  {
    label: 'Proof',
    title: 'Enterprise reps plus public releases',
    copy: 'Amazon Ads/FinTech internships, Cleveland Clinic and operations builds, and public PyPI/npm package surfaces anchor the read.',
  },
  {
    label: 'Next step',
    title: 'Review projects, then contact',
    copy: 'Use the projects board for shipped proof, the scouting report for role fit, and the resume or email links for the hiring loop.',
  },
] as const;

export const BREAKING_TICKER = [
  'QUALITY RUNNER, AGENT EVAL CONTRACT, AND RESEARCH DOMAIN WRITING ARE LIVE ON PYPI',
  'ANTI-SLOP AND PRE-CR PACKAGE SURFACES ARE LIVE ON NPM',
  'TMCP V0.3.2 CLAUDE AND CODEX MARKETPLACE SMOKES PASSED; MCP REGISTRY DRAFT VALIDATES',
  'AMAZON SDE INTERN ACROSS ADS AND FINTECH SYSTEMS FROM 2023 THROUGH 2025',
  'CLEVELAND CLINIC CLINICAL COACHING MVP SHIPPED IN 2 WEEKS',
  'ARCHITECTURE FIRM PRODUCTIVITY SOFTWARE DROVE 400% OUTPUT GROWTH IN UNDER 5 WEEKS',
  'A16Z STARTUP TOOLING CUT PRODUCTION TIMELINES 90% AND HELPED GENERATE 1.5M ORGANIC VIEWS',
  'DEEPR TOOLING DROVE SUBSTANTIAL MARKETING VIEWERSHIP GROWTH WITHOUT INVENTED METRICS',
  'AIDC VICE PRESIDENT | FULL-STACK, DATA, AI, AND WORKFLOW TOOLING PROSPECT | OPEN TO US AND REMOTE ROLES',
] as const;

export const TOP_HEADLINES: readonly Headline[] = [
  {
    category: 'Release run',
    title: 'Developer-tool packages are now public across PyPI, npm, and MCP',
    meta: 'Quality Runner, Anti-Slop, Agent Eval Contract, Research Domain Writing, Pre-CR, marketplace-smoked TMCP',
    href: '/projects',
  },
  {
    category: 'Draft stock',
    title: 'Multi-stop Amazon rep still anchors the enterprise systems tape',
    meta: '2023-2025 | Ads, FinTech, analytics, testing, process efficiency',
    href: '/scouting-report',
  },
  {
    category: 'Winning plays',
    title: 'Workflow tooling now has registry-backed proof instead of just local demos',
    meta: 'Quality gates, lint rules, changed-line coverage, eval contracts, research workflows',
    href: '/film-room',
  },
  {
    category: 'Tracker feed',
    title: 'Projects board separates shipped package proof from active product bets',
    meta: 'Released tools, active systems, and product work no longer blur together',
    href: '/projects',
  },
  {
    category: 'Box score',
    title: 'The impact file has real swings on the board, from 2 weeks to 400 percent',
    meta: 'Healthcare, operations, content automation, workflow systems',
    href: '/impact-report',
  },
] as const;

export const HOME_FRONT_OFFICE_NOTES = [
  {
    label: 'Release note',
    copy: 'The strongest new signal is not another concept: it is a run of public packages across PyPI, npm, and MCP/plugin distribution surfaces.',
  },
  {
    label: 'Winning plays',
    copy: 'A lot of the strongest evidence is low-glamour engineering work that helps the whole team function better: quality gates, review tooling, lint rules, contracts, and automation.',
  },
  {
    label: 'Best lineup',
    copy: 'Best deployed on product teams that want one player to connect frontend, backend, data, and AI workflow logic in the same possession.',
  },
] as const;

export const FEATURE_REPORTS = [
  {
    kicker: 'Scouting Report',
    title: 'Full draft profile',
    copy: 'Role projection, strengths, development lanes, front-office notes, and the core prospect read.',
    href: '/scouting-report',
    cta: 'Open the dossier',
  },
  {
    kicker: 'Film Room',
    title: 'Possession-by-possession tape',
    copy: 'Three featured builds, one active breakdown at a time, with the fluff stripped out and the engineering reads left in.',
    href: '/film-room',
    cta: 'Roll the tape',
  },
  {
    kicker: 'Player Comps',
    title: 'Style translation',
    copy: 'Basketball comps for how the engineering game actually looks: pace, connective reads, and dirty-work winning plays.',
    href: '/player-comps',
    cta: 'See the comps',
  },
  {
    kicker: 'Projects',
    title: 'Live court matrix',
    copy: 'Tracker-backed project health on the X-axis, with impact, difficulty, ambition, or creativity selected on the Y-axis.',
    href: '/projects',
    cta: 'Open the board',
  },
  {
    kicker: 'Impact Report',
    title: 'On-off splits',
    copy: 'Source-backed before/after swings translated like a broadcast package instead of a resume bullet dump.',
    href: '/impact-report',
    cta: 'Check the board',
  },
] as const;

export const SCOUTING_FACTS = [
  { label: 'Archetype', value: 'Full-stack | Data + AI' },
  { label: 'Education', value: 'CWRU, May 2026' },
  { label: 'Leadership', value: 'AIDC Vice President' },
  { label: 'Availability', value: 'Open to opportunities' },
] as const;

export const SCOUTING_OVERVIEW = [
  'Jakye Amos enters the 2026 recruiting cycle as a multi-positional engineering prospect with enterprise reps at Amazon, consulting production minutes across healthcare and operations, and public developer-tool releases across PyPI, npm, and MCP/plugin surfaces.',
  'He is a player trusted in short-shot-clock situations. A Cleveland Clinic MVP shipped in 2 weeks, an architecture-firm productivity build landed in under 5 weeks, and a legacy refactor for a major live event was turned around in 11 days.',
  'The skill package looks less like a specialist and more like a connective guard-wing. Frontend product work, backend systems, analytics, workflow tooling, AI-assisted operations, and full-stack product structure all show up on the tape.',
] as const;

export const SCOUTING_STRENGTHS = [
  {
    title: 'Plays fast, not rushed',
    copy: 'The best source-backed work comes in compressed windows, which usually means clean prioritization, fast reads, and calm execution when the clock is moving.',
  },
  {
    title: 'Connective full-stack feel',
    copy: 'Frontend, backend, analytics, shared packages, infrastructure, and workflow systems all show up in the same body of work instead of living in isolated silos.',
  },
  {
    title: 'Does the possession work',
    copy: 'A lot of value comes from the unglamorous stuff that wins anyway: review tooling, automation, coverage visibility, workflow cleanup, and operational structure.',
  },
  {
    title: 'Translates across rooms',
    copy: 'Leadership, founder work, consulting, and enterprise internships all point to someone who can talk to operators, builders, and stakeholders without losing the technical thread.',
  },
] as const;

export const SCOUTING_FOCUS = [
  {
    title: 'AI product reps',
    copy: 'Recent work leans into AI-assisted systems, marketing automation, and operating-system-style tooling where the value has to show up in real workflow improvement.',
  },
  {
    title: 'Developer infrastructure reps',
    copy: 'Quality Runner, Anti-Slop, Pre-CR Suite, and Agent Eval Contract move the review/quality story from private workflow preference into public package surfaces.',
  },
  {
    title: 'Data-rich offense',
    copy: 'BBDSE/CourtIQ, Amazon analytics work, and dashboard-heavy thinking all point toward a strong fit with products that need data to be useful, not just present.',
  },
] as const;

export const SCOUTING_NOTES = [
  {
    label: 'Front office take',
    copy: 'This is a strong bet for teams that need someone to speed up the offense while still making the possession cleaner for everybody else.',
  },
  {
    label: 'Winning context',
    copy: 'The profile gets more valuable when the team cares about shipping and systems discipline at the same time. That combination is where the tape really pops.',
  },
  {
    label: 'Usage guidance',
    copy: 'Best used as a connective builder across product, platform, analytics, and AI workflow lanes instead of boxing the role into one narrow job family too early.',
  },
] as const;

export const SKILL_PACKAGE = [
  'TypeScript',
  'Next.js',
  'React',
  'Node.js',
  'Prisma',
  'tRPC',
  'PostgreSQL',
  'AWS',
  'Docker',
  'Python',
  'Go',
  'Real-time systems',
] as const;

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
      'Quality Runner is now live on PyPI as quality-runner v0.3.1, giving the quality-gate work a public install surface.',
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
    copy: 'v0.3.2 Claude/Codex marketplace-smoked MCP/plugin distribution with launcher smokes, MCP Registry draft validation, and public tarball SHA-256 proof.',
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
    label: 'Live website',
    title: "Chiron's Forge",
    href: 'https://www.chironsforge.com/',
    copy: 'Multi-AI research pipeline that turns raw intent into expert AI skills, research reports, and Cursor rules, with an independent judge/refinement loop before delivery.',
  },
  {
    label: 'Live website',
    title: 'FRMWRK Labs',
    href: 'https://www.frmwrklabs.com/',
    copy: 'New website launch in the portfolio orbit. The live site was unavailable during this edit, so the portfolio keeps the mention link-forward without adding unsupported product claims.',
  },
  {
    label: 'Live website',
    title: 'BBDSE',
    href: 'https://bbdse.vercel.app/',
    copy: 'Basketball decision-support and education site that now owns the merged CourtIQ/Court Vision runtime alongside the broader BBDSE analytics suite.',
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
