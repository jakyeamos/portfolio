import type { PosterMediaAsset, ProjectEvidence } from '@/content/portfolioAssets';

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

export interface ClientWork {
  kicker: string;
  title: string;
  status: string;
  deck: string;
  stack: readonly string[];
  detail: string;
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
  role: 'Backend, AI & Product Software Engineer',
  location: 'US / Remote',
  school: 'Case Western Reserve University',
  graduation: 'Computer Science',
  opportunityStatus: 'Available full-time',
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
  { label: 'Demos', shortLabel: 'Demos', path: '/demos' },
  { label: 'Player Comps', shortLabel: 'Comps', path: '/player-comps' },
  { label: 'Impact Report', shortLabel: 'Impact', path: '/impact-report' },
] as const;

export const QUICK_LINKS: readonly QuickLink[] = [
  {
    label: 'Download ATS Resume',
    href: '/docs/Jakye_Amos_Canonical_Base_Resume.pdf',
    detail: 'PDF',
    download: true,
    downloadFileName: 'Jakye_Amos_Canonical_Base_Resume.pdf',
  },
  {
    label: 'Download Evidence Master',
    href: '/docs/Jakye_Amos_Comprehensive_CV.docx',
    detail: 'DOCX',
    download: true,
    downloadFileName: 'Jakye_Amos_Evidence_Master.docx',
  },
  {
    label: 'Download Evidence Master PDF',
    href: '/docs/Jakye_Amos_Comprehensive_CV.pdf',
    detail: 'PDF',
    download: true,
    downloadFileName: 'Jakye_Amos_Evidence_Master.pdf',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/jakyeamos',
    detail: 'Open',
  },
  {
    label: 'FRMWRK Labs',
    href: 'https://www.frmwrklabs.com/',
    detail: 'Live',
  },
  {
    label: "Chiron's Forge",
    href: 'https://www.chironsforge.com/',
    detail: 'Live',
  },
  {
    label: 'BBDSE GitHub',
    href: 'https://github.com/jakyeamos/BBDSE',
    detail: 'Public repo',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/jakyeamos',
    detail: 'Open',
  },
  {
    label: 'X',
    href: 'https://x.com/soundscapeweb',
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
    label: 'Download ATS resume',
    href: '/docs/Jakye_Amos_Canonical_Base_Resume.pdf',
    kind: 'external',
    variant: 'primary',
    download: true,
    downloadFileName: 'Jakye_Amos_Canonical_Base_Resume.pdf',
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
      'Public package evidence is verified across PyPI, npm, and MCP/plugin surfaces; candidate versions stay labeled staged until registry and release parity closes.',
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

export const CLIENT_WORK: readonly ClientWork[] = [
  {
    kicker: 'Venture / AI platform',
    title: 'Tenure',
    status: 'LaunchNY cohort',
    deck: 'Pilot-ready organizational intelligence platform that turns specialist-led knowledge capture into reviewed SOPs, permissioned institutional memory, cited Q&A, and process intelligence.',
    stack: ['Next.js', 'TypeScript', 'Supabase/Postgres', 'RLS', 'LLM retrieval'],
    detail:
      'v1.1 shipped; pre-pilot hardening is underway. Public-facing copy intentionally omits private source links and planned-pilot details.',
  },
  {
    kicker: 'Client product / GovCon SaaS',
    title: 'BidCamp',
    status: 'Live closed beta',
    deck: 'Multi-tenant platform for MBE/MWBE firms with Claude-powered RFP analysis, procurement intelligence, CRM workflows, compliance tracking, and human-reviewed digests.',
    stack: ['Next.js', 'Supabase/Postgres', 'RLS', 'Claude', 'Stripe'],
    detail:
      'Live at usebidcamp.com in closed beta; no private customer or tenant data is exposed here.',
  },
  {
    kicker: 'Applied data / legal product',
    title: 'CrimClock',
    status: 'Product build / reviewer preview',
    deck: 'Neutral legal time-intelligence platform for procedural timing, sentencing, parole eligibility, custody impact, risk indicators, and plain-language explanations.',
    stack: ['Next.js', 'FastAPI', 'Python', 'PostgreSQL', 'Docker'],
    detail:
      'Built as decision-support infrastructure with explainable calculations and explicit disclaimer boundaries, not legal advice.',
  },
  {
    kicker: 'Client product / recruiting intelligence',
    title: 'Hoopscout',
    status: 'Private beta',
    deck: 'Coach-facing basketball recruiting workflow with verified search, athlete profile review, coach-specific fit weighting, ranked school-fit signals, messaging, transcript controls, and trust operations.',
    stack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Moderation ops'],
    detail:
      'Private-beta product surface; public copy does not expose user data or imply a public user base.',
  },
  {
    kicker: 'Applied AI / product build',
    title: 'RemodelVision',
    status: 'Working product build',
    deck: 'Photo-to-visualization and rough-cost-estimation workflow using Claude vision and fal.ai image transformation services.',
    stack: ['Next.js', 'TypeScript', 'Supabase', 'Prisma', 'Claude vision'],
    detail:
      'Core analysis and visualization paths work; full persistence flow and additional specialist agents remain in progress.',
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
    copy: 'Amazon Ads/FinTech internships, CTO-level client delivery, Tenure LaunchNY cohort work, and public PyPI/npm package surfaces anchor the read.',
  },
  {
    label: 'Next step',
    title: 'Review projects, then contact',
    copy: 'Use the projects board for shipped proof, the scouting report for role fit, and the resume or email links for the hiring loop.',
  },
] as const;

export const BREAKING_TICKER = [
  'PRONTO PUBLIC V1 IS LIVE AS A READ-ONLY LOCAL-FIRST PORTFOLIO COMMAND CENTER FOR GIT REPOSITORIES',
  'QUALITY RUNNER V0.6.0 IS LIVE ON PYPI; AGENT EVAL CONTRACT V0.3.0 IS STAGED AHEAD OF PYPI; RESEARCH DOMAIN WRITING V0.3.0 REMAINS STAGED ON DEV',
  'ANTI-SLOP V0.5.0 AND PRE-CR PACKAGE SURFACES V0.1.0 ARE LIVE ON NPM',
  'TMCP V0.5.8 GITHUB RELEASE IS CURRENT; MARKETPLACE AND MCP REGISTRY EVIDENCE REMAIN THE DISTRIBUTION PROOF SURFACE',
  'TERRACE V0.1.1 REMAINS LIVE ON NPM; V0.2.0 IS STAGED FOR THE NEXT DISTRIBUTION PASS',
  'AMAZON SDE INTERN ACROSS ADS AND FINTECH SYSTEMS FROM 2023 THROUGH 2025',
  'CLEVELAND CLINIC CLINICAL COACHING MVP SHIPPED IN 2 WEEKS',
  'ARCHITECTURE FIRM PRODUCTIVITY SOFTWARE DROVE 400% OUTPUT GROWTH IN UNDER 5 WEEKS',
  'A16Z STARTUP TOOLING CUT PRODUCTION TIMELINES 90% AND HELPED GENERATE 1.5M ORGANIC VIEWS',
  'DEEPR TOOLING DROVE SUBSTANTIAL MARKETING VIEWERSHIP GROWTH WITHOUT INVENTED METRICS',
  'AIDC VICE PRESIDENT | FULL-STACK, DATA, AI, AND WORKFLOW TOOLING PROSPECT | OPEN TO US AND REMOTE ROLES',
] as const;

export const TOP_HEADLINES: readonly Headline[] = [
  {
    category: 'Systems tape',
    title: 'Pronto turns portfolio state into inspectable evidence',
    meta: 'Public v1 | Tauri + React + Rust + SQLite | read-only refresh and preparation previews',
    href: '/projects/pronto',
  },
  {
    category: 'Release run',
    title: 'Developer-tool packages are now public across PyPI, npm, and MCP',
    meta: 'Quality Runner 0.6.0, Anti-Slop 0.5.0, Pre-CR 0.1.0, TMCP 0.5.8; AEC and RDW candidates remain staged',
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
    copy: 'The strongest new signal is a public systems layer alongside the package run: Pronto makes repository quality and release-readiness evidence inspectable without crossing into execution.',
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
  { label: 'Education', value: 'CWRU, Computer Science' },
  { label: 'Leadership', value: 'AIDC Vice President' },
  { label: 'Availability', value: 'Available full-time' },
] as const;

export const SCOUTING_OVERVIEW = [
  'Jakye Amos enters the 2026 recruiting cycle as a multi-positional engineering prospect with enterprise reps at Amazon, CTO-level client delivery, a LaunchNY cohort venture, and public developer-tool releases across PyPI, npm, and MCP/plugin surfaces.',
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
    copy: 'Recent work leans into Tenure, BidCamp, RemodelVision, AI-assisted systems, marketing automation, and operating-system-style tooling where the value has to show up in real workflow improvement.',
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

export * from '@/content/portfolioCaseStudyContent';
