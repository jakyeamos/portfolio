---
schemaVersion: 1
projectName: portfolio
summary: Personal portfolio site has tracker-sync wired and now includes Book as a current project backed by an explicit project truth mapping.
healthScore: 74
statusLabel: on_track
nextStep: Review the remaining current-project entries without discoverable truth files and add explicit mappings where those repos should sync into the portfolio.
blockers: []
lastUpdated: 2026-05-01
tags: [portfolio, personal-site, react, vite, tailwind]
areas: [home, scouting-report, film-room, player-comps, impact-report]
goals:
  - Ship a professional portfolio site that accurately represents current work
  - Deploy and keep live
repoType: app
sourceOfTruth: inferred
primaryLanguage: TypeScript
activeBranch: codex/truth-sync-migration
lastCommitDate: "2026-04-29"
quality:
  lint: pass
  types: pass
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

The portfolio is on branch `codex/truth-sync-migration` with tracker-sync infrastructure in place. The React/Vite/Tailwind SPA is the live app shape: `index.html` is the Vite entrypoint, `src/` contains the page/application code, and `netlify.toml` is present for deployment configuration. The ESPN-style sports-journalism design direction remains intact.

The current-project tracker now includes `Book` with an explicit `.tracker/truth-map.json` entry pointing at `/Users/jakyeamos/projects/Book/.tracker/PROJECT_TRUTH.md`. The sync script resolves Book and reports it up to date. There are pre-existing untracked files in `.github/`, `docs/`, and `scripts/` that were not part of the Book tracking change.

## Why This Matters / Intended Outcome

This is the primary public-facing artifact for career opportunities. It needs to stay live, accurate, and easy to maintain from `main`.

## Recent Progress

- April 7: Replaced placeholder projects and rewrote bio content to reflect current work
- April 8-10: Landed the React SPA, planning scaffolding, and cleanup needed to merge the refresh branch back to `main`
- April 10: Restored a passing TypeScript/build baseline and removed GitNexus from the active-project list
- Deployment config (`netlify.toml`) and ignored artifact handling are in place
- April 23: Replaced stale tracker sync logic with auto-discovery + override mapping and wired sync to run automatically before `dev`, `build`, and `lint`
- May 1: Added Book to the current-project catalog and mapped `book` to the Book repo's project truth file

## Open Problems

- Most project entries still do not have discoverable `PROJECT_TRUTH.md` sources, so `npm run sync` skips them
- `README.md` is empty, so the repo still lacks project-specific onboarding and maintenance notes
- Ignored draft and binary assets still live beside the source tree; repo hygiene is acceptable, but long-term placement should be clarified
- No automated test suite is configured, so regression confidence still depends on type/build checks and manual verification

## Next Concrete Steps

1. Add explicit tracker mappings for remaining current-project entries that should sync from external repos
2. Replace the empty README with a short project-specific overview and maintenance commands
3. Decide whether the ignored draft/binary assets should stay colocated with the repo or move to a non-repo archive location
4. Verify the deployed site still matches the current `main` build
5. Add lightweight smoke coverage or a documented manual verification checklist if the site is changing frequently

## Risks / Blockers

- No active blockers
- Lack of tests means regressions can still slip through despite a clean type/build baseline
- Keeping ignored draft/binary artifacts next to the repo can still create maintenance ambiguity even though they are no longer polluting git status

## Quality Ladder Notes

- **Lint:** `npm run lint` (`tsc --noEmit`) — PASS on 2026-05-01
- **Types:** `npm run lint` (`tsc --noEmit`) — PASS on 2026-05-01
- **Build:** `npm run build` — PASS on 2026-04-10
- **Tests:** no test script or test files found — unknown
- **Dead code:** not configured
- **Structure:** SPA structure is clean (pages, components, content, hooks separation) — PASS

## Agent Notes

- The `src/` SPA is the authoritative application state; the root `index.html` is the Vite entrypoint, not a leftover static site
- `package.json` name is `front-office-amos` — consistent with the sports-front-office portfolio metaphor
- `.planning/` exists and can drive future content/release phase work
- Global canonical command references should be translated to this repo's actual scripts: `npm run lint` and `npm run build`
