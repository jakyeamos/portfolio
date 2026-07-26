# Coding conventions

- TypeScript is strict; keep `noImplicitAny` behavior intact and do not add
  `any` to production code.
- Use the configured `@/*` alias for imports from `src/`.
- Keep React route composition in `src/pages/` and reusable behavior in the
  nearest existing feature/component module.
- Prefer typed content records and pure validation scripts over implicit string
  conventions. Preserve the existing `CurrentProject` and manifest types.
- Keep public copy factual and concise. A status or score must have a reviewed
  evidence source or an explicit manual owner.
- Use `pnpm` for dependency installation and scripts. Do not introduce npm or
  yarn commands into documentation or automation.
- Use the repository’s declared Node engine (`>=22.13.0`) for local and CI
  verification.
- Keep generated pages, bundles, and local caches out of source changes.

Good patterns are the typed public manifest in
`src/content/publicProjectManifest.ts`, the pure status mapping in
`src/features/projects/projectStatus.ts`, and the validation scripts in
`scripts/check-project-content.mjs` and `scripts/check-shot-clips.mjs`.
