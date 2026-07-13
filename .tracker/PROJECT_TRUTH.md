---
schemaVersion: 1
projectName: portfolio
summary: Static Vite portfolio is being refined into a recruiter-first dossier while preserving its sports-editorial visual identity and all public routes.
healthScore: 95
statusLabel: on_track
nextStep: Complete the shared-shell, recruiter-dossier, and accessible-projects refinements on the modernization branch.
blockers:
  - Soundscape case-study media requires owner rights attestation before it can ship.
lastUpdated: 2026-07-13
tags: [portfolio, personal-site, react, vite, tailwind, accessibility]
areas: [home, navigation, film-room, projects, publishing]
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

- `c482ba6` removes lifecycle tracker writes, limits synchronization to public-safe score/status/date fields, and makes curated `portfolioUpdate` copy the only public project-status narrative.
- The site remains a React/Vite static SPA with Netlify fallback routes. The active modernization branch is refining the recruiter path, accessibility, and project-page structure; no production deploy has been requested.

## Recent Progress

- July 13: Committed deterministic tracker publishing (`c482ba6`); `pnpm tracker:check`, content checks, typecheck, and build passed without source mutations.
- July 13: Recorded a baseline build at 520.55 kB minified / 155.58 kB gzip for the eager main chunk; route splitting is the next performance milestone.
- July 13: Confirmed the Soundscape waitlist capture is free of visible PII/secrets, but its hero-image rights remain unverified, so no project screenshot is currently approved to ship.
- July 13: Weekly tracker ingestion from the prior branch refreshed Terrace's public date; the new tracker map marks unavailable Signal Lab and Cap-Fit sources as intentional manual entries.

## Next Concrete Steps

1. Simplify the shared shell and homepage into the recruiter-first path while keeping the current visual language.
2. Rebuild Film Room as an accessible case-study dossier with source links and conditional media evidence.
3. Replace the Projects page's autoplaying clip subsystem with an accessible roster, optional court, and focused dialog.
4. Run responsive, keyboard, reduced-motion, static-route, and build verification before review.

## Risks / Blockers

- No production deployment is authorized from this branch.
- Soundscape media remains blocked on ownership/license attestation for its canonical diver image.
- Browser interaction coverage must be added and run before the final branch review.

## Quality Ladder Notes

- **Publishing boundary:** `pnpm tracker:check`, `pnpm test:content`, and `pnpm typecheck` — PASS on 2026-07-13.
- **Static build:** `pnpm build` — PASS on 2026-07-13; the pre-refactor main chunk warning remains until route splitting lands.
- **Tracker safety:** normal `pnpm build` no longer invokes a source-writing tracker sync; CI confirms verification leaves no diff.
