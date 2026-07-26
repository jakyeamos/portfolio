# Good implementation examples

- `src/content/publicProjectManifest.ts` keeps publication eligibility and
  review notes in a typed, inspectable manifest.
- `src/content/portfolioAssets.ts` records source URLs, review status, and media
  provenance before an image can become public.
- `src/features/projects/projectStatus.ts` converts a constrained status enum to
  presentation metadata without mixing data loading and rendering.
- `scripts/check-project-content.mjs` validates public fields and rejects
  private-looking source text.
- `scripts/check-shot-clips.mjs` validates official provenance, URL identity,
  review status, and bounded clip windows.
- `scripts/sync-tracker.mjs` separates explicit evidence sync from normal
  linting, testing, and building.

When adding a new surface, follow the nearest existing pattern and add a
deterministic check for the invariant that would otherwise be easy to forget.
