# Deployment and rollback

Netlify is configured by `netlify.toml`: the build command is `pnpm build`, the
publish directory is `dist`, and the SPA fallback routes all paths to
`index.html`.

The weekly production path is `pnpm tracker:weekly`. It is main-branch-bound by
default, refreshes only approved public evidence fields, runs content/type/build
checks, requires a clean commit, and verifies the latest production deploy
against that commit through `scripts/netlify-deploy-status.mjs`.

Before release:

- run `pnpm precr:check`;
- inspect the public content and generated page diff;
- keep `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` outside the repository;
- run `pnpm deploy:status` with `NETLIFY_EXPECTED_COMMIT` set to the intended
  commit when live verification is required.

Rollback is human-approved. Prefer reverting the faulty source commit with a
new commit and redeploying, or selecting the last known-good Netlify deploy in
the provider UI. Do not rewrite history or claim rollback completion without
fresh deploy evidence.
