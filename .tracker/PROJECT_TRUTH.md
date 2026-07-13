---
schemaVersion: 1
projectName: portfolio
summary: Static Vite portfolio is a recruiter-first dossier that preserves its sports-editorial visual identity, static publishing model, and public route map.
healthScore: 98
statusLabel: on_track
nextStep: Keep Soundscape text-first until its hero-image rights are attested, then seek separate authorization for any production deployment.
blockers:
  - Soundscape case-study media requires owner rights attestation before it can ship.
lastUpdated: 2026-07-13
tags: [portfolio, personal-site, react, vite, tailwind, accessibility]
areas: [home, navigation, film-room, projects, publishing, accessibility]
goals:
  - Ship a professional portfolio site that accurately represents current work
  - Keep publishing deterministic, accessible, and static
repoType: app
sourceOfTruth: mixed
primaryLanguage: TypeScript
activeBranch: codex/portfolio-recruiter-dossier
lastCommitDate: '2026-07-13'
quality:
  lint: pass
  types: pass
  tests: pass
  e2e: pass
  accessibility: pass
  tracker: pass
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

- `cb03925` turns the portfolio into a recruiter dossier: one navigation system, a concise headshot-led homepage, source-backed Film Room cases, and an accessible project roster with an optional court.
- The site remains a React/Vite static SPA with Netlify fallback routes. The modernization branch adds typed evidence review, route splitting, browser coverage, WCAG 2.2 AA safeguards, and no production deploy.

## Recent Progress

- July 13: Committed the recruiter-dossier implementation (`cb03925`), deleting duplicate navigation, the autoplaying clip subsystem, obsolete motion dependency, and unused media paths.
- July 13: Added Playwright/Axe coverage for direct public routes at 390px, 768px, 1024px, and desktop; keyboard tabs, dialog focus restore/Escape, compact navigation, reduced motion, overflow, and console errors passed.
- July 13: Route splitting reduced the production initial JavaScript chunk from 520.55 kB / 155.58 kB gzip to 265.64 kB / 85.07 kB gzip. The headshot is now an optimized 210 KB local derivative.
- July 13: The Soundscape waitlist capture passed privacy, identity, and accuracy review, but awaits hero-image rights attestation; Film Room remains intentionally text-first.

## Next Concrete Steps

1. Obtain a rights attestation before adding the reviewed Soundscape visual; otherwise retain the approved text-first case study.
2. Obtain separate authorization before changing Netlify production settings or deploying this branch.
3. Keep public tracker updates explicit with `pnpm tracker:sync`, then validate with `pnpm tracker:check` and content checks.

## Risks / Blockers

- No production deployment is authorized from this branch.
- Soundscape media remains blocked on ownership/license attestation for its canonical diver image.
- The reviewed Soundscape capture must not be copied or rendered before rights attestation.

## Quality Ladder Notes

- **Publishing boundary:** `pnpm tracker:check`, `pnpm test:content`, and `pnpm typecheck` — PASS on 2026-07-13.
- **Accessibility and interaction:** `pnpm test:e2e` — PASS on 2026-07-13 (11 assertions passed, 13 scoped duplicates skipped); Axe found no violations on Home, Film Room, or Projects.
- **Static build:** `pnpm build` — PASS on 2026-07-13; route splitting ships a 265.64 kB / 85.07 kB gzip initial JavaScript chunk.
- **Security and safety:** secret scan and dependency-security check passed; source content rejects private tracker text and only approved evidence media can render.
