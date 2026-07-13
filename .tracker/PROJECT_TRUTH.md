---
schemaVersion: 1
projectName: portfolio
summary: Personal portfolio site now has a dedicated Quality Runner security-tuning branch with ten committed source-backed packs and improved UI/architecture/security precision, plus the July 2026 public package release run, hiring-manager read, route-link regression coverage, durable player-comp image fallbacks, and verified tracker sync infrastructure.
healthScore: 95
statusLabel: on_track
nextStep: Review the remaining low-confidence Quality Runner observations and credential fallback coverage, select the packs that earn a shared rollout, then separately merge verified tracker changes to the production deploy branch when needed.
blockers: []
lastUpdated: 2026-07-12
tags: [portfolio, personal-site, react, vite, tailwind]
areas: [home, scouting-report, film-room, blog, player-comps, impact-report]
goals:
  - Ship a professional portfolio site that accurately represents current work
  - Deploy and keep live
repoType: app
sourceOfTruth: mixed
primaryLanguage: TypeScript
activeBranch: codex/quality-runner-security-tune-portfolio
lastCommitDate: '2026-07-12'
quality:
  lint: pass
  types: pass
  tests: pass
  deadCode: pass
  structure: pass
canonicalCommands:
  install: pnpm install
  dev: pnpm dev
  lint: pnpm lint
  typecheck: pnpm lint
  test: pnpm test
  deadcode: pnpm audit:dead-code
agentExpectationsVersion: 1
---

## Current State

The portfolio is on dedicated branch `codex/quality-runner-security-tune-portfolio` with tracker-sync infrastructure in place and ten committed Quality Runner skill packs under `.quality-runner/skills/`. UI, architecture, and security fallback heuristics have been dogfooded against this source tree; the React/Vite/Tailwind SPA remains the live app shape: `index.html` is the Vite entrypoint, `src/` contains the page/application code, and `netlify.toml` is present for deployment configuration. The ESPN-style sports-journalism design direction remains intact.

_(3 older entries trimmed)_

The current-project tracker now resolves 15 local project truth sources through `.tracker/truth-map.json` plus discovery, including AIOS, Soundscape, Terrace, BidCamp, Taski, Fantasy, RemodelVision, BBDSE CourtIQ through the Bballedu lineage key, Dispatches, Book, the GitHub issue-resolution modeling repo, Signal Lab, Cap-Fit Builder, CLFE, and RTE. RemodelVision uses a portfolio-local truth source at `.tracker/remodelvision/PROJECT_TRUTH.md` because this automation sandbox cannot write into the sibling RemodelVision checkout. The sync script is scoped to `CURRENT_PROJECTS` so `CLOSED_PROJECTS` entries do not get overwritten by active repo truth snapshots.

The repo uses pnpm as the single package-manager workflow: `package.json` declares `pnpm@10.26.0`, lifecycle hooks call `pnpm sync`, CI installs with `pnpm install --frozen-lockfile`, Netlify builds with `pnpm build`, and `pnpm-lock.yaml` is the lockfile.

The weekly portfolio tracker ingestion automation now has a production refresh entry point: `pnpm tracker:weekly` runs only from `main` by default, performs `pnpm sync`, `pnpm lint`, and `pnpm build`, requires the refreshed tracker state to already be committed, then verifies the latest Netlify production deploy for `main` is on the current `HEAD` commit. Deploy status checks avoid the unstable global Netlify CLI by using a pinned repo-local `netlify-cli`, a temp-config wrapper, and a direct Netlify API script that filters production deploys before comparing commits.

The June 29 weekly tracker ingestion was run from `codex/pin-blog-posts`, not the production deploy branch `main`. The generated tracker data was verified and committed on that branch, but the public web UI should only rebuild from this push if Netlify is configured to deploy `codex/pin-blog-posts` or after the branch is merged to `main`.

The July 6 weekly tracker ingestion was run from `dev`, not the production deploy branch `main`. `pnpm sync` found all generated tracker fields already up to date with local truth and committed the existing generated `src/content/currentProjects.ts` refresh as `dbd94ff`; the public web UI should only rebuild from this push if Netlify deploys `dev` or after the branch is merged to `main`.

Pre-CR is now calibrated for this repo's content-heavy shape: it runs `pnpm precr:check`, which validates project catalog integrity, validates every blog Markdown file's required frontmatter and parsed sections, typechecks through `pnpm lint`, and runs the production build. Changed-line coverage is non-blocking because static catalog/config edits are better protected by schema/content validation than deep line coverage. The changed-file coverage helper now routes blog Markdown, blog parser, blog sorting, and blog checker edits through `node scripts/check-blog-content.mjs`.

The current-project court UI now uses a meaningful matrix rather than a decorative half-arc: x-position represents tracker health/readiness, y-position represents the selected project axis on a tough elite-threshold curve, and a deterministic spacing pass prevents dense project clusters from overlapping on desktop and mobile. The displayed board now normalizes against the projects currently shown so each active axis uses more of the court. The court itself stays visually neutral, and project markers are now small red dots without embedded letter labels so detail discovery happens through hover, sidebar, and modal interactions. Clearing the three-point arc is intentionally selective rather than the default for every strong project. Clicking a current-project dot or shipped-project card opens the detail modal with a compact "Historic Shot Clip" module that maps the displayed court location to a nearby famous NBA shot through mutually exclusive court zones. The clip selector is now provider-aware and quality-gated, so it can choose from YouTube, Vimeo, NBA, or external clip sources only when they are marked as verified game clips before falling back to reference-only entries.

The homepage now promotes the latest active project work before the feature-report grid through a "Now Playing" strip sourced from `CURRENT_PROJECTS`, sorted by `lastUpdated`, and linked to the current-project court matrix. The homepage and project page both describe the matrix as tracker health on X and the selected project axis on Y. A Live Launches section now surfaces recent external site launches directly on the homepage and blog, including BBDSE. This gives recent AI/workflow/product builds and shipped sites first-page presence without duplicating tracker content by hand.

The homepage now includes a compact "Hiring Manager Read" inside the cover-story area so the sports-desk concept still lands, but rushed hiring readers get direct guidance on best-fit teams, proof, and next steps. The old first-viewport headline rail has been reduced to a smaller "Latest Signals" rail with three items, preserving the editorial feel without competing as hard with the hero.

Internal React Router links now have a content-gate regression check through `scripts/check-internal-routes.mjs`, wired into `pnpm test:content`. This protects against broken route links like the former Impact Report `/current-projects` CTA, which now points to the registered `/projects` route. Player Comps keeps the remote ESPN headshots, but each comp card now has an initials-based fallback that appears if the remote image fails without duplicating accessible image labels when the image succeeds.

The Film Room now has a small "New Signals" surface for released tooling and recent website launches. TMCP is presented as a marketplace-smoked Claude/Codex plugin distribution rather than only a concept-watch item, and recent website launches for Chiron's Forge and FRMWRK Labs are linked from the page. Chiron's Forge is described from its live site; FRMWRK Labs is intentionally link-forward only until the site is reachable for source-backed copy.

The Film Room poster now omits the old decorative play badge because it looked interactive but had no playback behavior. The `EditorialPoster` API no longer carries a `showPlay` prop.

The portfolio now includes `/blog` as a first-class writing surface for concepts that need more room than project cards. Blog posts are repo-backed Markdown files under `src/content/blog/*.md`, with the initial TMCP concept note migrated out of hardcoded TypeScript content. The owner-facing writer is available only during local development or an explicit private `VITE_ENABLE_BLOG_WRITER=true` build; it emits canonical Markdown plus a BIP handoff payload with portfolio and FRMWRK repo targets so BIP can own draft hosting, review, and cross-repo pushes without exposing public unauthenticated publishing. The FRMWRK target carries `/Users/jakyeamos/projects/frmwrklabs/WRITING_PROFILE.md` as a site-specific style contract because FRMWRK Labs should not use the same voice as the personal portfolio.

Blog Markdown now supports `pinned: true` frontmatter. Pinned posts sort ahead of unpinned posts while preserving newest-first order inside each group, the public blog marks pinned entries with a pin badge, and the local/private writer can include pinned metadata in both canonical Markdown and the BIP handoff payload. `pnpm test:content` includes a blog integrity check backed by the same parser the app uses at build time, so every `src/content/blog/*.md` file must carry title, deck, status, date, pinned, tags, thesis, and at least one non-empty `##` section.

## Why This Matters / Intended Outcome

This is the primary public-facing artifact for career opportunities. It needs to stay live, accurate, and easy to maintain from `main`.

## Recent Progress
- July 4: Added the hiring-manager read to the homepage hero, reduced Top Headlines into a smaller Latest Signals rail, fixed the Impact Report current-projects CTA to `/projects`, added route-link regression coverage to `pnpm test:content`, improved static hiring metadata, and added accessible fallback visuals for Player Comps remote headshots.
- July 10: Added a TypeScript 7 upgrade audit documenting the Vite/TypeScript 5.8 baseline, `baseUrl` migration risk, and why implementation was deferred until dependency verification can run in a network-enabled environment.
- July 6: Ran weekly portfolio tracker ingestion from `dev`; `pnpm sync` reported no new writes after confirming the generated tracker file matched local truth, `pnpm lint` and `pnpm build` passed, `signal-lab` and `cap-fit-builder` were skipped because their mapped truth files were missing, and `src/content/currentProjects.ts` was committed as `dbd94ff`.
- July 6: Tracker data now reflects updated Soundscape, AIOS, Terrace, BidCamp, Fantasy, Bballedu, Dispatches, Book, GitHub issue-resolution modeling, RTE, and TMCP closed-project tracker copy/date/score fields already present before the sync run.
- July 4: Updated the public-facing portfolio copy around the confirmed PyPI/npm/MCP release run; added shipped project entries for Quality Runner, ESLint Anti-Slop, Agent Eval Contract, Research Domain Writing, TMCP, and Pre-CR Suite; added a Prettier config; formatted the repo; hardened tracker, blog, and shot-check parsers so formatter quote-style changes do not break gates; and restored a passing formatter/lint/test/dead-code/build/smoke/security baseline.
- July 4: Tightened TMCP release proof language after Claude marketplace add/install, Codex marketplace add/upgrade, launcher smokes, MCP Registry draft validation, and public release tarball SHA-256 smoke all passed for v0.3.2.
- July 4: Updated the public portfolio language to reflect the BBDSE/CourtIQ merge: Court Vision/Bballedu normal draft-room flows now live in the BBDSE product suite, and the old standalone repo is framed as archive/fallback lineage rather than a separate active product.
- July 4: Committed the generated tracker sync that refreshed Terrace's portfolio `lastUpdated` field to 2026-07-04 after the content-gate prehooks ran.
- July 1: Replaced the stale April portfolio bootstrap planning state with the Interview Surface Public Readiness milestone. Added 21 numbered GSD-style plan files across Quality Runner readiness, candidate inventory, public-readiness gate design, BBDSE release-train planning, product repo hardening plans, reviewer-surface planning, and tiered release scheduling. No candidate repo source files or visibility settings were changed.
- July 3: Ran Quality Runner triage with runner 0.2.1 on branch `qr/triage-parallel-20260702T200935Z`. Added repo-owned formatter, dead-code, and runtime-smoke gate commands plus Prettier/pnpm gate configuration. Final QR capability discovery has no missing capabilities; `pnpm smoke` passes, while the new formatter/dead-code gates expose existing broad formatting drift and unused imports that should be handled separately.
- June 30: Removed the stale inactive active-project-list note from the portfolio truth snapshot.
- April 7: Replaced placeholder projects and rewrote bio content to reflect current work
- April 8-10: Landed the React SPA, planning scaffolding, and cleanup needed to merge the refresh branch back to `main`
- April 10: Restored a passing TypeScript/build baseline and removed stale inactive entries from the active-project list
- Deployment config (`netlify.toml`) and ignored artifact handling are in place
- April 23: Replaced stale tracker sync logic with auto-discovery + override mapping and wired sync to run automatically before `dev`, `build`, and `lint`

## Open Problems

- RemodelVision's tracker truth source is portfolio-local rather than stored in the sibling RemodelVision repo because this automation environment can only write inside the portfolio workspace
- Ignored draft and binary assets still live beside the source tree; repo hygiene is acceptable, but long-term placement should be clarified
- Historic Shot Clip has 50/50 quality-gated clips, a live same-zone backup inventory, visually audited timing, and no active replacement watchlist as of June 23, 2026
- Browser interaction regressions still depend on targeted smoke checks when UI behavior changes

## Next Concrete Steps

1. Execute `.planning/phases/phase-0-quality-runner-readiness/00-01-PLAN.md` and write the Quality Runner capability inventory.
2. Execute `.planning/phases/phase-0-quality-runner-readiness/00-02-PLAN.md` and `.planning/phases/phase-0-quality-runner-readiness/00-03-PLAN.md` before using Quality Runner as a repo-readiness bar.
3. Execute the Phase 1 `01-01` through `01-03` plans to create the repo inventory and scoring matrix.
4. Continue weekly tracker ingestion from main separately so production portfolio deploy verification remains healthy.

## Risks / Blockers

- No active blockers
- Weekly tracker ingestion on July 6 skipped `signal-lab` and `cap-fit-builder` because `.tracker/truth-map.json` points to missing local truth files under `/Users/jakyeamos/projects/BBDSE/Signal Lab/.tracker/PROJECT_TRUTH.md` and `/Users/jakyeamos/projects/BBDSE/Cap-Fit Builder/.tracker/PROJECT_TRUTH.md`
- Quality Runner is pre-release, so Phase 0 must define which findings are reliable before using it as a hard public-readiness bar
- BBDSE public release planning has data provenance risk because several subprojects include CSV/parquet/report artifacts that need source/license review
- Content/catalog regressions are covered by `pnpm test:content`; browser interaction regressions still need targeted smoke checks when UI behavior changes
- Keeping ignored draft/binary artifacts next to the repo can still create maintenance ambiguity even though they are no longer polluting git status

## Quality Ladder Notes

- **Quality Runner security dogfood:** The runner change at `72af5b5` reduced portfolio security candidates from 9 to 7, secret-fallback candidates from 2 to 0, and audit findings from 31 to 29 while preserving secret-log and secret-env-var findings. No source files were changed.
- **TypeScript 7 audit doc:** `git diff --check -- TYPESCRIPT_7_UPGRADE_AUDIT.md` — PASS on 2026-07-10; local commit quality gate passed. No package/config changes were made.
- **Hiring-clarity remediation QA:** `node scripts/check-internal-routes.mjs`, `pnpm lint`, `pnpm test:content`, `pnpm test`, and `pnpm build` — PASS on 2026-07-04. `pnpm build` still reports the existing Vite large chunk warning, now about a 522 kB minified JS chunk. In-app Browser QA on `http://localhost:3001/` verified the desktop homepage title and Hiring Manager Read, mobile homepage `scrollWidth` stayed at 390px with no document-level horizontal overflow, the Impact Report "Open current projects" CTA navigated to `/projects`, normal Player Comps headshots loaded, and blocked ESPN headshots exposed the initials fallback with no console warnings/errors.
- **Weekly tracker ingestion:** `pnpm sync`, `pnpm lint`, and `pnpm build` — PASS on 2026-07-06 from `dev`. Sync loaded 15 project entries, found 15 explicit truth-map sources and 36 discovered truth files, wrote no new updates because `src/content/currentProjects.ts` already matched local truth, and skipped `signal-lab` plus `cap-fit-builder` due to missing mapped truth files. Build completed with the existing Vite large chunk warning for a 522.01 kB minified JS chunk. The generated tracker sync was committed as `dbd94ff`; production deploy impact depends on whether Netlify deploys `dev` or the commits are merged to `main`.
- **July 4 full quality ladder:** `pnpm format`, `pnpm lint`, `pnpm audit:dead-code`, `pnpm test`, `pnpm build`, `pnpm smoke`, `pnpm env:check`, and `pnpm secret:scan` — PASS. `pnpm dependency:security` exits cleanly at the configured high-severity threshold while reporting 2 low and 1 moderate advisory. `pnpm build` still reports the existing Vite chunk-size warning for a ~520 kB JS chunk.
- **Quality Runner triage:** `/Users/jakyeamos/projects/quality-runner/.venv/bin/quality-runner --version` — PASS on 2026-07-03 with 0.2.1. Final `quality-runner run --run-id triage-20260702-portfolio /Users/jakyeamos/projects/portfolio --json` — PASS on 2026-07-03; capability matrix now lists formatter, dead_code, and runtime_smoke as available with no missing capabilities, and quality audit reports 17 non-blocking structural findings. `pnpm smoke` — PASS on 2026-07-03. `pnpm format` and `pnpm audit:dead-code` are configured but fail on existing broad formatting drift and unused imports, so cleanup is intentionally deferred outside this triage.
- **Interview Surface planning docs:** placeholder scan and phase-plan existence checks — PASS on 2026-07-01; confirmed all 21 numbered phase plan files exist, ROADMAP links to them, and no placeholder markers remain in the new planning files. This was a documentation/planning-only change, so UI/browser checks were not required.
- **Content integrity:** direct checks PASS on 2026-06-26: `node scripts/check-project-content.mjs` and `node scripts/check-blog-content.mjs`. Project validation covers current and closed project catalog shape, unique slugs/short codes, valid statuses, score bounds, date parseability, tags, and grade ranges. Blog validation now walks every `src/content/blog/*.md` file through the shared parser, requiring title, deck, status, date, pinned, tags, thesis, and at least one non-empty `##` section. `pnpm test:content` remains blocked before script execution by the existing pnpm ignored-build approval prompt.
- **Film Room poster cleanup:** `pnpm typecheck` — PASS on 2026-06-25; the decorative play badge and stale `showPlay` prop/data path are removed without TypeScript fallout.
- **Live launches and court marker cleanup:** local direct checks passed on 2026-06-25: `node scripts/check-project-content.mjs`, `node node_modules/typescript/bin/tsc --noEmit`, and `node node_modules/vite/bin/vite.js build` with the existing large chunk warning. `pnpm test:content` and `pnpm typecheck` are blocked before script execution by existing pnpm ignored-build approval prompts for dependencies.
- **Pre-CR check:** `pnpm precr:check` — PASS on 2026-06-24; runs content integrity, typecheck, and production build. Changed-line coverage is intentionally non-blocking for static catalog/config changes. On 2026-06-26, `scripts/pre-cr-coverage.mjs` was extended so changed blog Markdown files and blog parser/checker files are covered by `node scripts/check-blog-content.mjs`; full `pnpm precr:check` remains blocked before script execution by the existing pnpm ignored-build approval prompt.
- **Lint:** `pnpm lint` (`tsc --noEmit`) — PASS on 2026-06-24
- **Types:** `pnpm lint` (`tsc --noEmit`) — PASS on 2026-06-24
- **Build:** `pnpm build` — PASS on 2026-06-24 with the existing Vite large chunk warning.
- **Homepage Now Playing QA:** `pnpm lint`, `pnpm build`, and in-app Browser smoke on `/` — PASS on 2026-06-23; the new homepage section rendered, showed current-project cards from synced tracker data, had no console warnings/errors or framework overlay, avoided mobile horizontal overflow at 390px width, and the "Open live board" link navigated to `/projects`
- **Film Room New Signals QA:** `pnpm lint`, `pnpm build`, and in-app Browser smoke on `/film-room` — PASS on 2026-06-23; TMCP, Chiron's Forge, and FRMWRK Labs rendered, the two website links were present with external URLs, there were no console warnings/errors or framework overlay, and the new section avoided mobile horizontal overflow at 390px width
- **Blog QA:** `pnpm lint`, `pnpm build`, and in-app Browser smoke on `/blog` — PASS on 2026-06-23; route rendered, Blog nav appeared active, the TMCP thesis and article sections were visible, desktop header had no horizontal overflow after compact top-nav labels, and mobile avoided horizontal overflow at 390px width
- **Blog writer/BIP handoff QA:** `pnpm lint`, `pnpm build`, and in-app Browser smoke — PASS on 2026-06-25; production preview `/blog` renders the Markdown-backed TMCP post without writer CTAs, production preview `/blog/write` does not render the writer, and local dev `/blog/write` renders canonical Markdown plus a BIP payload whose selected repo targets update from checkbox state. FRMWRK payload targets include `/Users/jakyeamos/projects/frmwrklabs/WRITING_PROFILE.md`.
- **Pinned blog post QA:** direct content checks, typecheck, production build, and in-app Browser smoke — PASS on 2026-06-26; `node scripts/check-blog-content.mjs`, `node scripts/check-project-content.mjs`, `node node_modules/typescript/bin/tsc --noEmit`, and `node node_modules/vite/bin/vite.js build` passed with the existing Vite large-chunk warning. Browser smoke on local dev verified `/blog` shows the pinned TMCP post with no horizontal overflow and `/blog/write` toggles pinned output into Markdown plus the BIP payload with no horizontal overflow or console warnings. `pnpm test:content` remains blocked before script execution by the existing pnpm ignored-build approval prompt.
- **Shot-zone math:** targeted coordinate classification and uniqueness checks — PASS on 2026-06-22; Ray Allen `rightCorner` assignment appears only for `pre-cr-suite` on Ambition at `(84.7, 65.4)` and not for above-the-break positions, and each active axis assigns 16 unique shot references across current plus closed projects
- **Displayed court geometry:** targeted spread/arc check — PASS on 2026-06-22; each active axis spans roughly 80% of the court, shot pools have no overflow, and inside-the-arc displayed dots have zero three-point-zone mismatches
- **Shot embed coverage:** `pnpm shot-embeds` — PASS on 2026-06-23; all 50 Historic Shot Clip entries have quality-gated YouTube provider data and explicit compact clip windows
- **50/50 shot target:** `pnpm shot-embeds:target` — PASS on 2026-06-23; current score is 50/50 quality-gated clips with no missing YouTube timing, no YouTube window longer than 38 seconds, zero same-axis visible assignment duplicates, zero rim-range zone mismatches, and zero required assignment mismatches
- **Dispatches Impact modal QA:** in-app Browser on `/projects` — PASS on 2026-06-23; opening Dispatches from the Impact board rendered `Rim poster`, `Anthony Edwards`, `2024 poster dunk over John Collins`, and YouTube iframe `H7Wz8GnQYPs` while the Impact grade stayed selected
- **Shot backup inventory:** `pnpm shot-inventory` — PASS on 2026-06-23; command prints assigned and backup clip IDs by scouting axis and court zone from the live registry, including the new rim pool
- **YouTube oEmbed validation:** live YouTube oEmbed check for all 45 registered IDs — PASS on 2026-06-23; dead legacy IDs and several broad sources were replaced with oEmbed-accessible shorter clips
- **Historic Shot Clip autoplay/timing:** local Browser smoke on `/projects` — PASS on 2026-06-23; opening the Soundscape marker produced a YouTube iframe with `autoplay=1`, `mute=1`, and iframe autoplay permission; all YouTube clips now resolve from explicit compact `start` and `end` windows
- **Terrace Impact clip timing:** parameter verification — PASS on 2026-06-23; the LeBron iframe `JYmejM38vKs` is now configured with absolute YouTube seconds `start=26` and `end=48`, matching the compact shot-and-replay methodology
- **Full shot timing scan:** live YouTube duration metadata scan for all 45 clips — PASS on 2026-06-23; no long clips remain without explicit start/end timing decisions
- **Shot visual timing audit:** `/shot-review.html` browser pass for all 45 clips — PASS with follow-ups on 2026-06-23; six same-source timing windows were corrected, then remaining broad/restricted sources were handled in the replacement pass
- **Shot replacement pass:** `/shot-review.html` browser verification — PASS on 2026-06-23; remaining broad, intro-card, studio-package, and iframe-restricted watchlist entries were replaced with tighter verified embeds
- **Historic Shot Clip sound request:** parameter verification — PASS on 2026-06-23; muted clips include `mute=1`, while sound-enabled clips omit the mute param after the user toggles shot sound
- **Local browser smoke:** `/projects` in the in-app Browser — PASS on 2026-06-23; opening the Soundscape court marker showed the Historic Shot Clip module with one provider-generated YouTube iframe URL
- **Weekly tracker deploy verification:** `node --check scripts/weekly-tracker-main-refresh.mjs`, `node --check scripts/netlify-deploy-status.mjs`, `node scripts/netlify-deploy-status.mjs` missing-env behavior, `node scripts/weekly-tracker-main-refresh.mjs` branch guard, direct `tsc --noEmit`, and direct Vite production build — PASS on 2026-06-25; live deploy lookup still requires `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID`
- **Weekly tracker ingestion:** project-script sync, lint, and production build — PASS on 2026-06-29 from `codex/pin-blog-posts`; all 15 explicit truth-map sources were up to date with no skipped projects. The first bare `pnpm sync` attempt used pnpm 11.7.0 and hit the existing ignored-builds approval gate, so verification used cached pnpm 10.12.4 with package-manager self-management disabled to run the repo scripts and prehooks.
- **Deploy tooling:** `pnpm netlify:cli -- --version`, `pnpm netlify:status`, and `pnpm deploy:status` missing-env behavior — PASS on 2026-06-22; live deploy lookup still requires `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID`
- **Browser QA:** `/projects` in the in-app Browser — PASS on 2026-06-22 before the neutral-court styling cleanup; recalibrated Ambition desktop minimum marker gap 25.46px, mobile minimum marker gap 3.31px, no marker overlaps, no horizontal overflow, no console warnings/errors, Soundscape marker opened the detail modal. Browser verification for the neutral-court cleanup and Historic Shot modal work was blocked by the local in-app Browser policy for `127.0.0.1:3000`; shell network access also could not resolve `youtube.com`, so embed IDs still need live browser/deploy validation. `pnpm lint` and `pnpm build` passed after both changes.
- **Architecture check:** `node scripts/aios-architecture-check.mjs` — PASS on 2026-05-24
- **Tests:** `pnpm test` now runs content integrity plus shot inventory checks and passes as of 2026-07-04.
- **Dead code:** `pnpm audit:dead-code` passes as of 2026-07-04.
- **Structure:** SPA structure is clean (pages, components, content, hooks separation) — PASS

## Agent Notes

- The `src/` SPA is the authoritative application state; the root `index.html` is the Vite entrypoint, not a leftover static site
- `package.json` name is `front-office-amos` — consistent with the sports-front-office portfolio metaphor
- `.planning/` exists and can drive future content/release phase work
- Global canonical command references should be translated to this repo's actual scripts: `pnpm lint` and `pnpm build`

## QR Remediation Planning

- 2026-07-04: Added GSD Phase 7 for QR remediation from qr-fleet-continue-20260704-portfolio; 2 plan(s) created from portfolio.md. Execution has not started.
