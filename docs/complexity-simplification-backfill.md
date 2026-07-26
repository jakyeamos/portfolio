# Complexity + Simplification Backfill: portfolio

Date of audit: 2026-06-23

Gate source: [portfolio quality contract](../.agents/context/done.md) and [coding conventions](../.agents/context/conventions.md)

## Scope Reviewed

- `package.json`
- `src/pages/CurrentProjects.tsx`
- `src/content/currentProjects.ts`
- `src/content/portfolioContent.ts`
- `src/pages/Home.tsx`
- `src/pages/ImpactReport.tsx`
- `src/pages/FilmRoom.tsx`
- `src/pages/BlogWrite.tsx`
- `src/pages/ScoutingReport.tsx`
- `src/components/EditorialPoster.tsx`

## Commands Attempted

- Historical baseline: `pnpm lint` passed when it still invoked the old tracker sync. The current workflow keeps tracker refresh explicit so linting never writes source files.
- `pnpm test`: unavailable - no test script configured.
- `pnpm build`: not run for this audit slice; this backfill is documentation-only and `pnpm lint` covered TypeScript correctness.

## Complexity Hotspots

### P1: Oversized interactive project page

- File: `src/pages/CurrentProjects.tsx`
- Evidence: `wc -l` reports 1,981 lines. The file contains historic shot data near the top, layout math around `buildCourtLayout`, state and effects in the page component, and the rendered shot chart/sidebar/detail UI.
- Pattern: Large mixed-responsibility component.
- Risk: Future changes to data, layout math, media embeds, or rendering all land in one file, increasing review cost and regression risk.
- Suggested direction: Extract stable shot metadata, court geometry helpers, and presentational subcomponents before adding more project-page features.

### P2: Pairwise marker collision layout should stay bounded

- File: `src/pages/CurrentProjects.tsx`
- Evidence: `buildCourtLayout` runs 24 passes over every pair of project points before returning CSS positions.
- Pattern: Nested-loop layout pass.
- Risk: Current portfolio size is small, so this is acceptable now. If the page starts rendering many more active/closed projects, chart layout cost grows quadratically.
- Suggested direction: Keep the current approach until the project count grows materially, then cap displayed markers, memoize precomputed layouts, or switch to a bounded placement strategy.

## Simplification Hotspots

### P1: Data constants live beside rendering logic

- File: `src/pages/CurrentProjects.tsx`
- Evidence: `HISTORIC_SHOT_POOLS` and related embed quality metadata occupy a large opening section before the page helpers and component.
- Pattern: Static content mixed with interactive page code.
- Risk: Content verification and UI behavior changes are hard to review independently.
- Suggested direction: Move historic shot pools and embed helpers into a content or feature module with typed exports.

## Test Gaps Blocking Safe Cleanup

- No automated test script is configured in `package.json`.
- Before splitting `CurrentProjects.tsx`, add at least one narrow test or scripted check around `buildCourtLayout` and historic shot selection so extraction can preserve behavior.

## Suggested Remediation Order

- P1: Extract static shot metadata from `src/pages/CurrentProjects.tsx`.
- P1: Extract pure court geometry helpers and cover them with a small test.
- P2: Split the rendered shot chart, roster, closed-project list, and selected-project detail into focused components only after helper extraction.

## Definition of Done

- Every extracted helper has the same externally visible behavior as the current page.
- `pnpm lint` passes after each cleanup slice.
- Any new test script uses `pnpm` and is recorded in `package.json`.
- No always-loaded agent instruction is expanded for this cleanup; detailed guidance remains in the repository context packets.
