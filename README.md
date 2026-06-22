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
- `pnpm deploy:status` - check the latest Netlify deploy through the Netlify API
- `pnpm netlify:status` - run `netlify status` through the repo-local CLI wrapper
- `pnpm netlify:cli -- <args>` - run the pinned local Netlify CLI with sandbox-safe config paths

## Development Notes

Key runtime dependencies include `lucide-react`, `motion`, `react`, `react-dom`, `react-router-dom`.
Use `pnpm` from this directory or the containing workspace to install dependencies and run scripts.

`pnpm sync` reads `.tracker/truth-map.json` and local sibling `.tracker/PROJECT_TRUTH.md` files to refresh current-project health scores, statuses, next steps, and dates in `src/content/currentProjects.ts`.

Use the repo-local Netlify CLI through `pnpm netlify:cli -- ...` or the shortcut `pnpm netlify:status`; avoid the older globally installed `netlify` binary for automation. The wrapper redirects Netlify config/cache writes into temporary directories so local status checks do not fail on macOS preference/config-store permissions. To verify production deploys without depending on CLI login/config state, set `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID`, then run `pnpm deploy:status`. Set `NETLIFY_EXPECTED_COMMIT=<sha>` when you need the check to fail unless the latest ready deploy matches a specific commit.

## Verification

Run the available lint or typecheck script before changing app behavior.
