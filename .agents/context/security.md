# Security and data boundaries

- `.env*` files are ignored except `.env.example`; never commit real keys,
  deploy tokens, cookies, or provider credentials.
- `VITE_ENABLE_BLOG_WRITER` enables a local/private authoring surface only. It
  is not authentication and must not be treated as a publication permission.
- `pnpm secret:scan` and `pnpm dependency:security` are required checks before a
  release. A registry skip is evidence of unavailable verification, not proof
  of safety.
- The React Router advisory `1124282` is currently recorded as not applicable:
  this is a Vite SPA and does not use React Router RSC, framework, or server
  mode. If the routing architecture adds any of those modes, remove the
  exception and require a patched React Router release before shipping.
- Public content must not contain prompts, code, diffs, transcripts, local
  paths, credentials, internal next steps, or private project identifiers.
- `.tracker/public-project-allowlist.json` constrains reviewed sibling paths;
  do not broaden it casually or read arbitrary directories from a build.
- `pnpm tracker:sync` may read only declared evidence-map sources and writes
  only public-safe fields. Publishing and deployment remain human-approved.
- Netlify credentials belong in the environment or local secret store, never in
  repository files or generated output.
