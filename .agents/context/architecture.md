# Architecture and boundaries

## Runtime

- Vite builds a static React application from `src/main.tsx` and `src/App.tsx`.
- `src/pages/` owns route-level composition; `src/features/` owns reusable
  product behavior; `src/components/` owns shared presentation.
- `src/content/` is the public-safe content boundary. It contains curated copy,
  reviewed media metadata, project status projections, and no private transcripts,
  prompts, credentials, or internal next steps.
- `public/` contains deployable static media and documents. `dist/` is generated
  output and is never a source surface.

## Evidence boundary

- `.tracker/evidence-map.json` declares the only non-manual sources used by the
  public status projection.
- Manual projects remain explicitly manual; their public fields are edited in
  `src/content/currentProjects.ts` and validated by `pnpm tracker:check`.
- Leverage exports are accepted only when they use the review-gated public
  projection schema. The portfolio does not read private ledger rows directly.

## Ownership boundary

- Portfolio owns public narrative, presentation, media curation, and the final
  publication decision.
- Leverage owns private shipping evidence and public-safe aggregate projections.
- Quality, eval, and context runtimes remain independent. This repository does
  not import AIOS modules or use an AIOS database.
