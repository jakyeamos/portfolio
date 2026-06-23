# Historic Shot Clip Curation

Target: `45/45` quality-gated provider clips.

Run `pnpm shot-embeds` to see current coverage. Run `pnpm shot-embeds:target` to enforce the full `45/45` target.

Current score: `45/45` quality-gated YouTube clips as of June 23, 2026. Every provider ID also passed a live YouTube oEmbed check in this environment.

The portfolio modal autoplays clips muted when a project opens. YouTube clips default to a 45-second window from the configured `start` time so broad highlight or full-game sources do not continue as full videos.

June 23 timing pass: direct YouTube navigation in the in-app Browser remains blocked by Browser policy, so timing was tuned from YouTube search metadata, live oEmbed checks, shorter replacement sources, and local `/projects` iframe-parameter smoke tests. Several broad or full-game sources were replaced with shorter exact-shot clips; remaining broad sources now carry explicit `start` and `end` windows where a better short source was not available.

June 23 Terrace Impact fix: `lebron-pacers-2018` now starts at `112` and ends at `154` so the Terrace impact-axis modal opens on the game-winning shot possession instead of the preceding block.

June 23 full timing scan: live YouTube duration metadata flagged long clips without explicit timing decisions. Replaced broad sources for Trae Young, Robert Horry, Kevin Durant 2017, Ja Morant, Donovan Mitchell, Devin Booker 2021, Kevin Durant 2021, Kawhi Leonard 2021, and Tony Parker with shorter oEmbed-valid clips. Added explicit `start: 0` plus `end` windows where the shot intentionally starts at the beginning of a longer replay package.

## Quality Gate

A clip counts only when all of these are true:

- It shows the exact named shot or the full game segment containing that shot.
- It is stable enough for a public portfolio: official YouTube/NBA sources first, then Vimeo or external pages only when the clip is clearly playable and not low-quality filler.
- It matches the court-zone intent closely enough that the project dot does not feel mislabeled.
- It has a provider entry in `src/pages/CurrentProjects.tsx`.
- It has `quality.level: 'verified-game-clip'`, a `reviewedAt` date, and a short note explaining what was verified.

## Replacement Watchlist

These clips are playable and quality-gated, but they are broader highlight, full-game, or nonofficial YouTube sources. Replace them later if a cleaner official single-shot clip is found:

- `kobe-suns-2006`
- `garnett-kings-2004`
- `anthony-knicks-2012`
- `paul-bucks-2021`
- `wade-mavericks-2006`
