---
schemaVersion: 1
projectName: portfolio
summary: Static Vite portfolio is a recruiter-first dossier with source-backed public cases, public-safe client/applied systems, and canonical ATS/evidence resume downloads.
healthScore: 97
statusLabel: on_track
nextStep: Review the refreshed recruiter materials and resolve pre-existing tracker drift before the next portfolio release decision.
blockers:
  - Soundscape case-study media requires owner rights attestation before it can ship.
lastUpdated: 2026-07-15
tags: [portfolio, personal-site, react, vite, tailwind, accessibility]
areas: [home, navigation, film-room, projects, publishing, accessibility]
goals:
  - Ship a professional portfolio site that accurately represents current work
  - Keep publishing deterministic, accessible, and static
repoType: app
sourceOfTruth: mixed
primaryLanguage: TypeScript
activeBranch: codex/career-materials-refresh
lastCommitDate: '2026-07-15'
quality:
  lint: pass
  types: pass
  tests: pass
  e2e: pass
  accessibility: pass
  tracker: fail (pre-existing drift in soundscape, aios, and book)
  build: pass
canonicalCommands:
  install: pnpm install
  dev: pnpm dev
  lint: pnpm lint
  typecheck: pnpm typecheck
  test: pnpm test
  trackerCheck: pnpm tracker:check
agentExpectationsVersion: 1
---

## Current State

- `e984240` links FRMWRK Labs and Chiron's Forge as live public products and BBDSE as a public GitHub repo with deployment-paused status; the evidence-master downloads now carry the same public product proof.
- `6bdb95a` adds public-safe client/applied systems for Tenure, BidCamp, CrimClock, Hoopscout, and RemodelVision, plus ATS and evidence-master resume downloads.
- `cb03925` turns the portfolio into a recruiter dossier: one navigation system, a concise headshot-led homepage, source-backed Film Room cases, and an accessible project roster with an optional court.
- The site remains a React/Vite static SPA with Netlify fallback routes. The modernization branch adds typed evidence review, route splitting, browser coverage, WCAG 2.2 AA safeguards, and no production deploy.
- The recruiter-facing quick links now include the personal X profile at `https://x.com/soundscapeweb`; the existing portfolio writer remains the canonical Markdown handoff for the portfolio and FRMWRK Labs.

## Recent Progress

- July 15: Added FRMWRK Labs, Chiron's Forge, and BBDSE/CourtIQ to recruiter-facing links and evidence; corrected the retired BBDSE deployment URL and regenerated both evidence documents.
- July 15: Added the client/applied systems surface and refreshed role, availability, education, recruiter copy, and resume downloads; source checks, typecheck, dead-code check, and production build passed.
- July 15: Added the personal X profile to the portfolio distribution surface; typecheck, content checks, dead-code check, and production build passed.
- July 13: Committed the recruiter-dossier implementation (`cb03925`), deleting duplicate navigation, the autoplaying clip subsystem, obsolete motion dependency, and unused media paths.
- July 13: Added Playwright/Axe coverage for direct public routes at 390px, 768px, 1024px, and desktop; keyboard tabs, dialog focus restore/Escape, compact navigation, reduced motion, overflow, and console errors passed.
- July 13: Route splitting reduced the production initial JavaScript chunk from 520.55 kB / 155.58 kB gzip to 265.64 kB / 85.07 kB gzip. The headshot is now an optimized 210 KB local derivative.
- July 13: The Soundscape waitlist capture passed privacy, identity, and accuracy review, but awaits hero-image rights attestation; Film Room remains intentionally text-first.

## Next Concrete Steps

1. Obtain a rights attestation before adding the reviewed Soundscape visual; otherwise retain the approved text-first case study.
2. Obtain separate authorization before changing Netlify production settings or deploying this branch.
3. Resolve the pre-existing `soundscape`, `aios`, and `book` tracker drift with the project owner before the next release decision.

## Risks / Blockers

- No production deployment is authorized from this branch.
- Soundscape media remains blocked on ownership/license attestation for its canonical diver image.
- The reviewed Soundscape capture must not be copied or rendered before rights attestation.

## Quality Ladder Notes

- **Publishing boundary:** `pnpm tracker:check`, `pnpm test:content`, and `pnpm typecheck` — PASS on 2026-07-13.
- **Accessibility and interaction:** `pnpm test:e2e` — PASS on 2026-07-13 (11 assertions passed, 13 scoped duplicates skipped); Axe found no violations on Home, Film Room, or Projects.
- **Static build:** `pnpm build` — PASS on 2026-07-13; route splitting ships a 265.64 kB / 85.07 kB gzip initial JavaScript chunk.
- **Security and safety:** secret scan and dependency-security check passed; source content rejects private tracker text and only approved evidence media can render.
- **Career-material refresh:** changed-file Prettier check, `pnpm typecheck`, `pnpm test`, `pnpm audit:dead-code`, and `pnpm build` passed on 2026-07-15. `pnpm tracker:check` still reports pre-existing drift in `soundscape`, `aios`, and `book`; no tracker sync was run because those project changes are outside this task.
