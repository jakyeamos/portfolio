---
schemaVersion: 1
projectName: portfolio
summary: Static Vite portfolio is a recruiter-first dossier with source-backed public cases, public-safe client/applied systems, canonical ATS/evidence resume downloads, and a leverage-owned aggregate tracker projection.
healthScore: 97
statusLabel: on_track
nextStep: Verify the marketed project routes against the live portfolio origin before any production publication decision.
blockers:
  - Soundscape case-study media requires owner rights attestation before it can ship.
lastUpdated: 2026-07-22
tags: [portfolio, personal-site, react, vite, tailwind, accessibility]
areas: [home, navigation, film-room, projects, publishing, accessibility]
goals:
  - Ship a professional portfolio site that accurately represents current work
  - Keep publishing deterministic, accessible, and static
repoType: app
sourceOfTruth: mixed
primaryLanguage: TypeScript
activeBranch: codex/career-materials-refresh
lastCommitDate: '2026-07-22'
quality:
  lint: pass
  types: pass
  tests: pass
  e2e: pass
  accessibility: pass
  tracker: pass (2 manual entries remain explicitly review-owned)
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
- `a0bf1ac` adds crawlable `/projects/soundscape`, `/projects/bballedu`, and `/projects/book` routes from the existing project renderer, static prerender output, route metadata/canonical/JSON-LD, sitemap/robots generation, and privacy-first Plausible event hooks.
- The recruiter-facing quick links now include the personal X profile at `https://x.com/soundscapeweb`; the existing portfolio writer remains the canonical Markdown handoff for the portfolio and FRMWRK Labs.
- AIOS tracker fields now come from the review-gated public projection emitted by `ai-workflow-leverage`; the portfolio no longer reads AIOS's legacy truth map.

## Recent Progress

- July 15: Added FRMWRK Labs, Chiron's Forge, and BBDSE/CourtIQ to recruiter-facing links and evidence; corrected the retired BBDSE deployment URL and regenerated both evidence documents.
- July 15: Added the client/applied systems surface and refreshed role, availability, education, recruiter copy, and resume downloads; source checks, typecheck, dead-code check, and production build passed.
- July 15: Added the personal X profile to the portfolio distribution surface; typecheck, content checks, dead-code check, and production build passed.
- July 21: Replaced the AIOS truth-map tracker source with the leverage public projection, refreshed evidence-backed tracker fields, and passed `pnpm tracker:check` with only the two manual entries excluded from automation.
- July 22: Added three statically generated marketing project pages, route-level metadata/structured data, sitemap/robots output, and focused browser coverage; typecheck, content checks, dead-code check, build, secret scan, and desktop smoke passed.
- July 13: Committed the recruiter-dossier implementation (`cb03925`), deleting duplicate navigation, the autoplaying clip subsystem, obsolete motion dependency, and unused media paths.
- July 13: Added Playwright/Axe coverage for direct public routes at 390px, 768px, 1024px, and desktop; keyboard tabs, dialog focus restore/Escape, compact navigation, reduced motion, overflow, and console errors passed.
- July 13: Route splitting reduced the production initial JavaScript chunk from 520.55 kB / 155.58 kB gzip to 265.64 kB / 85.07 kB gzip. The headshot is now an optimized 210 KB local derivative.
- July 13: The Soundscape waitlist capture passed privacy, identity, and accuracy review, but awaits hero-image rights attestation; Film Room remains intentionally text-first.

## Next Concrete Steps

1. Verify the live origin, route status, canonical tags, sitemap, robots policy, and deploy ref before treating route output as published.
2. Obtain a rights attestation before adding the reviewed Soundscape visual; otherwise retain the approved text-first case study.
3. Obtain separate authorization before changing Netlify production settings or deploying this branch.
4. Complete the independent leverage pilot thresholds before making stronger portfolio claims; keep public exports manually reviewed.

## Risks / Blockers

- No production deployment is authorized from this branch.
- Soundscape media remains blocked on ownership/license attestation for its canonical diver image.
- The reviewed Soundscape capture must not be copied or rendered before rights attestation.
- The leverage projection is aggregate-only and pending manual publication; it must not become a public claim without evidence review.
- The portfolio origin is still unverified in the marketing profile; static output uses the configured `VITE_SITE_URL` or the existing `jakyeamos.com` assumption until a live probe confirms it.

## Quality Ladder Notes

- **Publishing boundary:** `pnpm tracker:check`, `pnpm test:content`, and `pnpm typecheck` — PASS on 2026-07-13.
- **Accessibility and interaction:** `pnpm test:e2e` — PASS on 2026-07-13 (11 assertions passed, 13 scoped duplicates skipped); Axe found no violations on Home, Film Room, or Projects.
- **Static build:** `pnpm build` — PASS on 2026-07-13; route splitting ships a 265.64 kB / 85.07 kB gzip initial JavaScript chunk.
- **Security and safety:** secret scan and dependency-security check passed; source content rejects private tracker text and only approved evidence media can render.
- **Career-material refresh:** changed-file Prettier check, `pnpm typecheck`, `pnpm test`, `pnpm audit:dead-code`, and `pnpm build` passed on 2026-07-15. The commit hook reported a pre-existing dependency-security failure; no dependency changes were made here.
- **Tracker projection:** `pnpm tracker:check` passed on 2026-07-21 with all 13 automated projects current and `signal-lab`/`cap-fit-builder` remaining manual.
- **Marketing routes:** changed-file formatting, `pnpm typecheck`, `pnpm test:content`, `pnpm audit:dead-code`, `pnpm build`, `pnpm secret:scan`, and `pnpm e2e:smoke` passed on 2026-07-22; repository-wide formatting still reports pre-existing files outside this slice.
