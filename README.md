# front-office-amos

Vite/React portfolio app for the Front Office Amos project. It combines the main React entry, public assets, evidence-backed status projection, and docs/planning material for the portfolio surface.

## Scope

This is the top-level portfolio application workspace.

The package is marked private in `package.json`, so it is intended for local workspace use rather than package publishing.

## Repository Layout

- `.claude/` - project directory.
- `.env.example` - project file.
- `.github/` - project directory.
- `.gitignore` - project file.
- `.planning/` - project planning state.
- `.tracker/` - public evidence map, reviewed-project allowlist, and media curation metadata.
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
- `pnpm test:e2e` - browser coverage at desktop, laptop, tablet, and mobile viewports
- `pnpm format:check` - verify Prettier formatting
- `pnpm architecture:check` - verify source-boundary rules
- `pnpm lint` / `pnpm typecheck` - strict TypeScript verification
- `pnpm test` - run all deterministic content and route checks
- `pnpm environment:check` - verify the repository’s context and control surfaces
- `pnpm secret:scan` - scan tracked source-like files for high-confidence secrets
- `pnpm dependency:security` - run the advisory dependency check; registry outages are reported as non-blocking skips
- `pnpm tracker:sync` - explicitly refresh public-safe status, score, and date fields from approved evidence sources
- `pnpm tracker:check` - report evidence-projection drift without writing source files
- `pnpm tracker:weekly` - run the main-branch tracker refresh gates, then confirm the Netlify production deploy is on the refreshed commit
- `pnpm deploy:status` - check the latest Netlify deploy through the Netlify API
- `pnpm netlify:status` - run `netlify status` through the repo-local CLI wrapper
- `pnpm netlify:cli -- <args>` - run the pinned local Netlify CLI with sandbox-safe config paths

## Development Notes

Key runtime dependencies include `lucide-react`, `react`, `react-dom`, and `react-router-dom`.
Use `pnpm` from this directory or the containing workspace to install dependencies and run scripts.

`pnpm tracker:sync` reads the explicitly mapped sibling evidence sources in `.tracker/evidence-map.json` to refresh only public-safe health scores, statuses, and dates in `src/content/currentProjects.ts`. Curated `portfolioUpdate` copy stays in this repository; internal next steps are never published. Normal development, linting, and builds do not run a tracker sync.

Blog posts live as Markdown files in `src/content/blog/*.md`. The public `/blog` page loads those files at build time, so publishing a portfolio post is a normal repo change: add Markdown, commit, and deploy.

The local owner writer is available at `/blog/write` only during `pnpm dev`; it is not included in production builds. It does not publish directly and emits canonical Markdown for the author’s private handoff workflow.

Use the repo-local Netlify CLI through `pnpm netlify:cli -- ...` or the shortcut `pnpm netlify:status`; avoid the older globally installed `netlify` binary for automation. The wrapper redirects Netlify config/cache writes into temporary directories so local status checks do not fail on macOS preference/config-store permissions. To verify production deploys without depending on CLI login/config state, set `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID`, then run `pnpm deploy:status`. Set `NETLIFY_EXPECTED_COMMIT=<sha>` when you need the check to fail unless the latest ready production deploy matches a specific commit.

`pnpm tracker:weekly` is the production refresh entry point for the weekly status workflow. It runs only from `main` by default, performs the explicit evidence sync, content checks, linting, and a build, requires the refreshed state to be committed, then checks the latest Netlify production deploy for `main` against the current `HEAD` commit. It waits up to `NETLIFY_DEPLOY_WAIT_SECONDS` seconds, defaulting to 300 for this workflow, so the deploy can finish after the refreshed commit is pushed.

## Verification

Run the available lint or typecheck script before changing app behavior.
