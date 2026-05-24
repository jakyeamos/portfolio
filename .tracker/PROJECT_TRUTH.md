---
schemaVersion: 1
projectName: portfolio
summary: Personal portfolio site has tracker-sync wired against 14 local project truth sources and pnpm used consistently for local, CI, and deploy workflows.
healthScore: 82
statusLabel: on_track
nextStep: Add a RemodelVision tracker truth file or explicit mapping if that project should join the automated current-project ingestion.
blockers: []
lastUpdated: 2026-05-24
tags: [portfolio, personal-site, react, vite, tailwind]
areas: [home, scouting-report, film-room, player-comps, impact-report]
goals:
  - Ship a professional portfolio site that accurately represents current work
  - Deploy and keep live
repoType: app
sourceOfTruth: inferred
primaryLanguage: TypeScript
activeBranch: codex/truth-sync-migration
lastCommitDate: "2026-05-24"
quality:
  lint: pass
  types: pass
  tests: unknown
  deadCode: unknown
  structure: pass
canonicalCommands:
  install: pnpm install
  dev: pnpm dev
  lint: pnpm lint
  typecheck: pnpm lint
  test: unknown
  deadcode: unknown
agentExpectationsVersion: 1
---

## Current State

The portfolio is on branch `codex/truth-sync-migration` with tracker-sync infrastructure in place. The React/Vite/Tailwind SPA is the live app shape: `index.html` is the Vite entrypoint, `src/` contains the page/application code, and `netlify.toml` is present for deployment configuration. The ESPN-style sports-journalism design direction remains intact.

The current-project tracker now resolves 14 local project truth sources through `.tracker/truth-map.json` plus discovery, including AIOS, Soundscape, Terrace, Amos SaaS, Taski, Fantasy, Bballedu, Dispatches, Book, the GitHub issue-resolution modeling repo, Signal Lab, Cap-Fit Builder, CLFE, and RTE. `remodelvision` is the only current-project card still without a discoverable local truth source, so sync leaves its existing tracker fields intact. The sync script is scoped to `CURRENT_PROJECTS` so `CLOSED_PROJECTS` entries do not get overwritten by active repo truth snapshots.

The repo uses pnpm as the single package-manager workflow: `package.json` declares `pnpm@10.26.0`, lifecycle hooks call `pnpm sync`, CI installs with `pnpm install --frozen-lockfile`, Netlify builds with `pnpm build`, and `pnpm-lock.yaml` is the lockfile.

## Why This Matters / Intended Outcome

This is the primary public-facing artifact for career opportunities. It needs to stay live, accurate, and easy to maintain from `main`.

## Recent Progress

- April 7: Replaced placeholder projects and rewrote bio content to reflect current work
- April 8-10: Landed the React SPA, planning scaffolding, and cleanup needed to merge the refresh branch back to `main`
- April 10: Restored a passing TypeScript/build baseline and removed GitNexus from the active-project list
- Deployment config (`netlify.toml`) and ignored artifact handling are in place
- April 23: Replaced stale tracker sync logic with auto-discovery + override mapping and wired sync to run automatically before `dev`, `build`, and `lint`
- May 1: Added Book to the current-project catalog and mapped `book` to the Book repo's project truth file
- May 24: Replaced remaining npm workflow references with pnpm across package scripts, CI, Netlify, README, lockfile, and project truth metadata
- May 24: Expanded the current-project truth map to 14 local sources, synced current health/status/next-step/date fields, and scoped sync to current projects only
- May 24: Updated the AIOS architecture check script to run as ESM under the repo's module configuration

## Open Problems

- `remodelvision` still does not have a discoverable `PROJECT_TRUTH.md` source, so `pnpm sync` skips that one current-project entry
- Ignored draft and binary assets still live beside the source tree; repo hygiene is acceptable, but long-term placement should be clarified
- No automated test suite is configured, so regression confidence still depends on type/build checks and manual verification

## Next Concrete Steps

1. Add a RemodelVision tracker truth file or explicit mapping if that project should sync automatically
2. Decide whether the ignored draft/binary assets should stay colocated with the repo or move to a non-repo archive location
3. Verify the deployed site still matches the current `main` build
4. Add lightweight smoke coverage or a documented manual verification checklist if the site is changing frequently

## Risks / Blockers

- No active blockers
- Lack of tests means regressions can still slip through despite a clean type/build baseline
- Keeping ignored draft/binary artifacts next to the repo can still create maintenance ambiguity even though they are no longer polluting git status

## Quality Ladder Notes

- **Lint:** `pnpm lint` (`tsc --noEmit`) — PASS on 2026-05-24
- **Types:** `pnpm lint` (`tsc --noEmit`) — PASS on 2026-05-24
- **Build:** `pnpm build` — PASS on 2026-05-24
- **Architecture check:** `node scripts/aios-architecture-check.mjs` — PASS on 2026-05-24
- **Tests:** no test script or test files found — unknown
- **Dead code:** not configured
- **Structure:** SPA structure is clean (pages, components, content, hooks separation) — PASS

## Agent Notes

- The `src/` SPA is the authoritative application state; the root `index.html` is the Vite entrypoint, not a leftover static site
- `package.json` name is `front-office-amos` — consistent with the sports-front-office portfolio metaphor
- `.planning/` exists and can drive future content/release phase work
- Global canonical command references should be translated to this repo's actual scripts: `pnpm lint` and `pnpm build`
