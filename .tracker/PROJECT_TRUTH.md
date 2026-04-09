---
schemaVersion: 1
projectName: portfolio
summary: Personal portfolio site rebuilt as a React/Vite/Tailwind SPA with an ESPN-style design language — substantial content and structure exist on a feature branch, not yet merged to main.
healthScore: 55
statusLabel: needs_attention
nextStep: Merge codex/espn-portfolio-refresh to main after resolving the large untracked files and verifying the build.
blockers: []
lastUpdated: 2026-04-09
tags: [portfolio, personal-site, react, vite, tailwind]
areas: [home, scouting-report, film-room, player-comps, impact-report]
goals:
  - Ship a professional portfolio site that accurately represents current work
  - Deploy and keep live
repoType: app
sourceOfTruth: inferred
primaryLanguage: TypeScript
activeBranch: codex/espn-portfolio-refresh
lastCommitDate: "2026-04-07"
quality:
  lint: unknown
  types: unknown
  tests: unknown
  deadCode: unknown
  structure: pass
canonicalCommands:
  install: npm install
  dev: vite --port=3000 --host=0.0.0.0
  lint: tsc --noEmit
  typecheck: tsc --noEmit
  test: unknown
  deadcode: unknown
agentExpectationsVersion: 1
---

## Current State

The portfolio has been substantially redesigned on `codex/espn-portfolio-refresh`. The original `index.html` (legacy static site) still exists but is modified with content updates. In parallel, a full React/Vite/Tailwind/React Router SPA has been built in `src/` with five pages: Home, ScoutingReport, FilmRoom, PlayerComps, ImpactReport. Content is driven from `src/content/portfolioContent.ts` and `portfolioAssets.ts`. A built `dist/` is present. The site uses an ESPN-style sports-journalism design metaphor.

The branch has never been merged to main. The README is a boilerplate AI Studio template — not project-specific. Large untracked binary files (CV .docx, resume .pdf) and a `Draft_Refresh/` directory are sitting loose in the working tree.

The `eslint-plugin-anti-slop` is referenced as a dev dependency via file path (`../eslint-plugin-anti-slop`) — same fragile sibling dependency as Terrace.

## Why This Matters / Intended Outcome

This is the primary public-facing artifact for career opportunities. It needs to be live, accurate, and merged to a deployable main branch.

## Recent Progress

- April 7: Replaced placeholder projects, rewrote bio — content now reflects real work
- April 8 (untracked): Added full React SPA scaffold with ESPN design language, routing, Tailwind, Motion animations
- Content architecture is complete: structured data objects drive all five pages
- Build (`dist/`) present, implying at least one successful Vite build

## Open Problems

- Active branch is not main — the SPA is not deployable from main
- `index.html` at root is the old static site with diverged content from the new SPA — two parallel portfolios exist
- README is AI Studio boilerplate, not meaningful project documentation
- Large binary files (CV, resume PDF) are untracked — should be gitignored or moved out of repo
- `Draft_Refresh/` directory is untracked — unclear if needed
- No deployment config visible (Netlify/Vercel toml, etc.) outside `public/_redirects`
- Canonical `pnpm lint` from CLAUDE.md doesn't match; this project uses `npm`

## Next Concrete Steps

1. Gitignore or remove binary files (CV .docx, resume PDF) and `Draft_Refresh/`
2. Decide fate of root `index.html` — remove if SPA supersedes it
3. Update README to reflect the actual project
4. Run `tsc --noEmit` and fix any type errors
5. Commit all SPA files and merge branch to main
6. Confirm deployment target and verify `dist/` is deploying correctly

## Risks / Blockers

- Two portfolios exist simultaneously (old static HTML + new SPA) — confusing and risky if wrong one deploys
- Binary files in repo inflate clone size and muddy git history
- Sibling `eslint-plugin-anti-slop` dependency creates environment coupling

## Quality Ladder Notes

- **Lint:** script maps to `tsc --noEmit` — not run, result unknown
- **Types:** same as lint (`tsc --noEmit`) — not run, result unknown
- **Tests:** no test script or test files found — unknown
- **Dead code:** not configured
- **Structure:** SPA structure is clean (pages, components, content, hooks separation) — PASS

## Agent Notes

- The `src/` SPA is the authoritative future state; the root `index.html` is legacy and should be treated as dead once the branch merges
- `package.json` name is `front-office-amos` — consistent with ESPN-style sports-front-office metaphor
- No `.planning/` directory; this is a content/design project, not a GSD-tracked one
- Global CLAUDE.md lists canonical lint as `pnpm lint` — this project uses `npm run lint` which resolves to `tsc --noEmit`
