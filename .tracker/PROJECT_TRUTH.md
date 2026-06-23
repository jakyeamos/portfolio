---
schemaVersion: 1
projectName: portfolio
summary: Personal portfolio site has tracker-sync wired against all 15 current-project truth sources, a meaningfully positioned current-project court matrix, weekly ingestion commits verified tracker changes, and pnpm is used consistently for local, CI, and deploy workflows.
healthScore: 87
statusLabel: on_track
nextStep: Keep the weekly tracker ingestion running from main so current-project progress rebuilds the public portfolio UI after each verified sync.
blockers: []
lastUpdated: 2026-06-22
tags: [portfolio, personal-site, react, vite, tailwind]
areas: [home, scouting-report, film-room, player-comps, impact-report]
goals:
  - Ship a professional portfolio site that accurately represents current work
  - Deploy and keep live
repoType: app
sourceOfTruth: inferred
primaryLanguage: TypeScript
activeBranch: codex/truth-sync-migration
lastCommitDate: "2026-06-22"
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

The portfolio is on branch `main` with tracker-sync infrastructure in place. The React/Vite/Tailwind SPA is the live app shape: `index.html` is the Vite entrypoint, `src/` contains the page/application code, and `netlify.toml` is present for deployment configuration. The ESPN-style sports-journalism design direction remains intact.

The current-project tracker now resolves 15 local project truth sources through `.tracker/truth-map.json` plus discovery, including AIOS, Soundscape, Terrace, Amos SaaS, Taski, Fantasy, RemodelVision, Bballedu, Dispatches, Book, the GitHub issue-resolution modeling repo, Signal Lab, Cap-Fit Builder, CLFE, and RTE. RemodelVision uses a portfolio-local truth source at `.tracker/remodelvision/PROJECT_TRUTH.md` because this automation sandbox cannot write into the sibling RemodelVision checkout. The sync script is scoped to `CURRENT_PROJECTS` so `CLOSED_PROJECTS` entries do not get overwritten by active repo truth snapshots.

The repo uses pnpm as the single package-manager workflow: `package.json` declares `pnpm@10.26.0`, lifecycle hooks call `pnpm sync`, CI installs with `pnpm install --frozen-lockfile`, Netlify builds with `pnpm build`, and `pnpm-lock.yaml` is the lockfile.

The weekly portfolio tracker ingestion automation now commits verified generated tracker updates and pushes the current branch after `pnpm sync`, `pnpm lint`, and `pnpm build` pass. This makes the portfolio-progress loop publishable, but the public UI only updates automatically when the pushed branch is the Netlify production deploy branch or is merged into it. Deploy status checks now avoid the unstable global Netlify CLI by using a pinned repo-local `netlify-cli`, a temp-config wrapper, and a direct Netlify API script.

The current-project court UI now uses a meaningful matrix rather than a decorative half-arc: x-position represents tracker health/readiness, y-position represents the selected scout axis on a tough elite-threshold curve, marker size reflects ambition, marker color reflects status, and a deterministic spacing pass prevents dense project clusters from overlapping on desktop and mobile. The displayed board now normalizes against the projects currently shown so each active axis uses more of the court. The court itself stays visually neutral so the project dots and labels carry the meaning. Clearing the three-point arc is intentionally selective rather than the default for every strong project. Clicking a current-project dot or shipped-project card opens the detail modal with a compact "Historic Shot Clip" module that maps the displayed court location to a nearby famous NBA shot through mutually exclusive court zones. The clip selector is now embed-aware, so it chooses from zone shots with explicit YouTube embed IDs before falling back to reference-only entries.

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
- June 22: Updated the weekly portfolio tracker ingestion automation so successful runs commit generated tracker changes, update project truth, and push the current branch for Netlify rebuild eligibility
- June 22: Committed the weekly tracker refresh, including Soundscape, AIOS, Fantasy, Bballedu, Dispatches, Book, CLFE, and RTE tracker fields; RemodelVision remains skipped with no truth source
- June 22: Added repo-local Pre-CR configuration so source commits satisfy the global commit quality gate while continuing to use `pnpm lint` as the enforced local check
- June 22: Added a portfolio-local RemodelVision project truth file, mapped it in `.tracker/truth-map.json`, and synced its tracker fields into the current-project UI data
- June 22: Reworked the current-project court from arbitrary half-arc placement into a tracker-health × scout-axis matrix with quadrant labels, status colors, ambition-sized markers, and Browser-verified overlap prevention
- June 22: Recalibrated the court Y-axis so the three-point arc is an elite threshold; Browser QA confirmed Ambition desktop minimum marker gap 25.46px and mobile minimum marker gap 3.31px with no overlaps
- June 22: Simplified the project court styling by removing the radial wash, colored quadrant fills, dashed guide lines, and tinted paint while preserving the meaningful coordinates, labels, and marker behavior
- June 22: Added a compact Historic Shot Echo module to the project detail modal so selected court dots show a nearby famous NBA shot reference from the same general floor zone
- June 22: Upgraded the Historic Shot module to attempt official YouTube embeds, keep a 200px-tall side-rail player, and let closed-project cards open the same detail modal so current and shipped projects share the feature
- June 22: Synced the AIOS tracker comment from local truth, updating the full-suite Python failure count from 10 to 15 in the portfolio UI data
- June 22: Stabilized Netlify deploy checks by pinning `netlify-cli@26.1.0`, adding a temp-config `pnpm netlify:cli` wrapper, and adding `pnpm deploy:status` for Netlify API checks via `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID`
- June 22: Tightened Historic Shot Clip zone mapping so corner clips require real corner-depth coordinates; targeted math check confirmed the Ray Allen corner clip no longer appears for above-the-break project dots
- June 22: Expanded Historic Shot Clip assignment from one shot per zone to a larger zone-specific pool with active-axis zone-rank assignment; targeted uniqueness check confirmed 16 unique shot references across current plus closed projects for Impact, Difficulty, Ambition, and Creativity
- June 22: Normalized current-project court coordinates against the projects displayed on each active axis and switched shot-zone assignment to the displayed post-spacing point, preventing inside-the-arc dots from receiving three-point shot references
- June 23: Made Historic Shot Clip selection embed-aware and added `pnpm shot-embeds` to report YouTube embed ID coverage by shot zone

## Open Problems

- RemodelVision's tracker truth source is portfolio-local rather than stored in the sibling RemodelVision repo because this automation environment can only write inside the portfolio workspace
- Ignored draft and binary assets still live beside the source tree; repo hygiene is acceptable, but long-term placement should be clarified
- Historic Shot Clip still has 39 reference-only shot entries without verified YouTube embed IDs; the modal now avoids selecting those while each zone has at least one embedded clip
- No automated test suite is configured, so regression confidence still depends on type/build checks and manual verification

## Next Concrete Steps

1. Keep the weekly tracker ingestion running from main so weekly commits rebuild the public portfolio UI
2. Decide whether RemodelVision should eventually move its truth source into `/Users/jakyeamos/projects/remodelvision/.tracker/PROJECT_TRUTH.md`
3. Decide whether the ignored draft/binary assets should stay colocated with the repo or move to a non-repo archive location
4. Add lightweight smoke coverage or a documented manual verification checklist if the site is changing frequently

## Risks / Blockers

- No active blockers
- Lack of tests means regressions can still slip through despite a clean type/build baseline
- Keeping ignored draft/binary artifacts next to the repo can still create maintenance ambiguity even though they are no longer polluting git status

## Quality Ladder Notes

- **Lint:** `pnpm lint` (`tsc --noEmit`) — PASS on 2026-06-22
- **Types:** `pnpm lint` (`tsc --noEmit`) — PASS on 2026-06-22
- **Build:** `pnpm build` — PASS on 2026-06-22
- **Shot-zone math:** targeted coordinate classification and uniqueness checks — PASS on 2026-06-22; Ray Allen `rightCorner` assignment appears only for `pre-cr-suite` on Ambition at `(84.7, 65.4)` and not for above-the-break positions, and each active axis assigns 16 unique shot references across current plus closed projects
- **Displayed court geometry:** targeted spread/arc check — PASS on 2026-06-22; each active axis spans roughly 80% of the court, shot pools have no overflow, and inside-the-arc displayed dots have zero three-point-zone mismatches
- **Shot embed coverage:** `pnpm shot-embeds` — PASS on 2026-06-23; all court zones have at least one syntactically valid YouTube embed ID, with 6 embedded clips and 39 reference-only shot entries still awaiting verified IDs
- **Deploy tooling:** `pnpm netlify:cli -- --version`, `pnpm netlify:status`, and `pnpm deploy:status` missing-env behavior — PASS on 2026-06-22; live deploy lookup still requires `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID`
- **Browser QA:** `/projects` in the in-app Browser — PASS on 2026-06-22 before the neutral-court styling cleanup; recalibrated Ambition desktop minimum marker gap 25.46px, mobile minimum marker gap 3.31px, no marker overlaps, no horizontal overflow, no console warnings/errors, Soundscape marker opened the detail modal. Browser verification for the neutral-court cleanup and Historic Shot modal work was blocked by the local in-app Browser policy for `127.0.0.1:3000`; shell network access also could not resolve `youtube.com`, so embed IDs still need live browser/deploy validation. `pnpm lint` and `pnpm build` passed after both changes.
- **Architecture check:** `node scripts/aios-architecture-check.mjs` — PASS on 2026-05-24
- **Tests:** no test script or test files found — unknown
- **Dead code:** not configured
- **Structure:** SPA structure is clean (pages, components, content, hooks separation) — PASS

## Agent Notes

- The `src/` SPA is the authoritative application state; the root `index.html` is the Vite entrypoint, not a leftover static site
- `package.json` name is `front-office-amos` — consistent with the sports-front-office portfolio metaphor
- `.planning/` exists and can drive future content/release phase work
- Global canonical command references should be translated to this repo's actual scripts: `pnpm lint` and `pnpm build`
