# front-office-amos

Vite/React portfolio app for the Front Office Amos project. It combines the main React entry, public assets, tracker synchronization script, and docs/planning material for the portfolio surface.

## Scope

This is the top-level portfolio application workspace.

The package is marked private in `package.json`, so it is intended for local workspace use rather than package publishing.

## Repository Layout

- `.claude/` - project directory.
- `.env.example` - project file.
- `.github/` - project directory.
- `.gitignore` - project file.
- `.planning/` - project planning state.
- `.tracker/` - project truth/status metadata.
- `Draft_Refresh/` - project directory.
- `Jakye_Amos_Comprehensive_CV.docx` - project file.
- `Redesign Basketball Project Dashboard/` - project directory.
- `docs/` - supporting documentation.
- `index.html` - project file.
- `jakyeamos_masterresumereference 8_15_25.docx (5).pdf` - project file.
- `metadata.json` - project file.
- `netlify.toml` - project file.
- `package.json` - package metadata and scripts.
- `public/` - static assets.
- `scripts/` - automation and sync scripts.
- `src/` - source code and React app internals.
- `tsconfig.json` - TypeScript configuration.
- `vite.config.ts` - Vite configuration.

## Common Commands

- `pnpm dev` - `vite --port=3000 --host=0.0.0.0`
- `pnpm build` - `vite build`
- `pnpm preview` - `vite preview`
- `pnpm lint` - `tsc --noEmit`
- `pnpm predev` - `pnpm sync`
- `pnpm prebuild` - `pnpm sync`
- `pnpm prelint` - `pnpm sync`
- `pnpm sync` - `node scripts/sync-tracker.mjs`
- `pnpm tracker:weekly` - run the main-branch tracker refresh gates, then confirm the Netlify production deploy is on the refreshed commit
- `pnpm shot-inventory` - list assigned and same-zone backup Historic Shot Clip IDs by scouting axis
- `pnpm deploy:status` - check the latest Netlify deploy through the Netlify API
- `pnpm netlify:status` - run `netlify status` through the repo-local CLI wrapper
- `pnpm netlify:cli -- <args>` - run the pinned local Netlify CLI with sandbox-safe config paths

## Development Notes

Key runtime dependencies include `lucide-react`, `motion`, `react`, `react-dom`, `react-router-dom`.
Use `pnpm` from this directory or the containing workspace to install dependencies and run scripts.

`pnpm sync` reads `.tracker/truth-map.json` and local sibling `.tracker/PROJECT_TRUTH.md` files to refresh current-project health scores, statuses, next steps, and dates in `src/content/currentProjects.ts`.

Blog posts live as Markdown files in `src/content/blog/*.md`. The public `/blog` page loads those files at build time, so publishing a portfolio post is a normal repo change: add Markdown, commit, and deploy.

The local owner writer is available at `/blog/write` during `pnpm dev`, or in an explicit private build with `VITE_ENABLE_BLOG_WRITER="true"`. It does not publish directly; it emits canonical Markdown plus a BIP handoff payload with portfolio and FRMWRK repo targets so BIP can own draft hosting, review, and cross-repo pushes.

Use the repo-local Netlify CLI through `pnpm netlify:cli -- ...` or the shortcut `pnpm netlify:status`; avoid the older globally installed `netlify` binary for automation. The wrapper redirects Netlify config/cache writes into temporary directories so local status checks do not fail on macOS preference/config-store permissions. To verify production deploys without depending on CLI login/config state, set `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID`, then run `pnpm deploy:status`. Set `NETLIFY_EXPECTED_COMMIT=<sha>` when you need the check to fail unless the latest ready production deploy matches a specific commit.

`pnpm tracker:weekly` is the production refresh entry point for the weekly tracker workflow. It runs only from `main` by default, performs `pnpm sync`, `pnpm lint`, and `pnpm build`, requires the refreshed state to be committed, then checks the latest Netlify production deploy for `main` against the current `HEAD` commit. It waits up to `NETLIFY_DEPLOY_WAIT_SECONDS` seconds, defaulting to 300 for this workflow, so the deploy can finish after the refreshed commit is pushed.

## Verification

Run the available lint or typecheck script before changing app behavior.
