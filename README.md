# front-office-amos

Vite/React portfolio app for the Front Office Amos project. It combines the main React entry, public assets, tracker synchronization script, and docs/planning material for the portfolio surface.

![Portfolio project board snapshot](docs/assets/readme-snapshot.png)

## Why This Matters

### Problem

A portfolio can go stale quickly when the work lives across many repos. Static project cards do not show current project health, recent progress, or the difference between polished shipped work and active engineering bets.

### Who It Helps

This site helps recruiters, hiring managers, collaborators, and future teammates understand what I am building without cloning several repos or reading raw planning files.

### What I Built

I built a React/Vite portfolio with project pages, a current-project board, writing/blog surfaces, Film Room content, deployment tooling, and tracker sync that pulls project status from local `.tracker/PROJECT_TRUTH.md` files.

### Technical Decisions

- Project status is generated from repo truth files so public content can stay aligned with active work.
- The portfolio uses a sports-front-office metaphor because it matches the basketball/data/product work I want to showcase.
- Content integrity, typecheck, and build gates are wired into the local workflow so static catalog edits still get useful verification.
- Netlify deploy checks use repo-local tooling instead of relying on unstable global CLI state.

### How To Run It

```bash
pnpm install
pnpm sync
pnpm dev
pnpm lint
pnpm build
```

### What I Would Improve Next

The next improvements are tighter browser smoke coverage for interactive project-board behavior, clearer handling for large ignored draft assets, and continued weekly tracker ingestion from the deploy branch.

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
- `pnpm shot-inventory` - list assigned and same-zone backup Historic Shot Clip IDs by scouting axis
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
