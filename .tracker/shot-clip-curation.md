# Historic Shot Clip Curation

Target: `50/50` quality-gated provider clips.

Run `pnpm shot-embeds` to see current coverage. Run `pnpm shot-embeds:target` to enforce the full `50/50` target.
Run `pnpm shot-inventory` to list assigned clips and same-zone backup clips by scouting axis.

Current score: `50/50` quality-gated YouTube clips as of June 23, 2026. Every provider ID also passed a live YouTube oEmbed check in this environment before the rim-pool expansion, and the five new rim-pool IDs were visually sampled through `/shot-review.html`.

The portfolio modal autoplays clips muted when a project opens. Every YouTube clip must carry explicit `start` and `end` seconds; there is no default timing fallback for reviewed clips.

June 23 timing pass: direct YouTube navigation in the in-app Browser remains blocked by Browser policy, so timing was tuned from YouTube search metadata, live oEmbed checks, shorter replacement sources, user-observed playback offsets, and local `/projects` iframe-parameter smoke tests. Several broad or full-game sources were replaced with shorter exact-shot clips; remaining broad sources now carry explicit `start` and `end` windows where a better short source was not available.

June 23 Terrace Impact correction: `lebron-pacers-2018` uses absolute YouTube embed seconds and now starts at `26` and ends at `48`. The timing method is a compact shot-and-replay window: begin a few seconds before the relevant possession, include the make and first replay, then stop before broader aftermath or commentary.

June 23 compact-window scan: all 45 Historic Shot Clips were scanned for effective embed duration. Every YouTube clip now has explicit `start` and `end` seconds, long windows were reduced to `12-38` seconds depending on whether the named moment is a single shot or short sequence, and `pnpm shot-embeds:target` now fails any missing or overlong YouTube window.

June 23 full timing scan: live YouTube duration metadata flagged long clips without explicit timing decisions. Replaced broad sources for Trae Young, Robert Horry, Kevin Durant 2017, Ja Morant, Donovan Mitchell, Devin Booker 2021, Kevin Durant 2021, Kawhi Leonard 2021, and Tony Parker with shorter oEmbed-valid clips. Added explicit `start: 0` plus `end` windows where the shot intentionally starts at the beginning of a longer replay package.

June 23 backup inventory: `.tracker/shot-clip-backups.md` documents the workflow for using unused same-zone clips when new projects are added. `pnpm shot-inventory` prints the live backup pool from the actual registry and assignment logic.

June 23 browser visual audit: `/shot-review.html` was used to load all 45 configured clips through the real YouTube iframe and capture the visible start frame for each window. This caught issues the duration gate could not see: intro cards, studio packages, full-game timestamps, broad highlight reels, and iframe restrictions. Same-source timing was corrected for `lillard-rockets-2014`, `allen-spurs-2013`, `tatum-sixers-2023`, `paul-spurs-2015`, `butler-bucks-2023`, and `edwards-nuggets-2024`.

June 23 replacement pass: the browser review workflow replaced the remaining weak watchlist entries with verified tighter embeds. Replacements were applied for Kerr, Kobe, Booker 2021, Luka, Fox, Pierce, Garnett, Carmelo, Chris Paul 2021, Shai, and Wade. Some entries now use cleaner same-zone moments rather than preserving the old broad-package moment label.

June 23 rim-pool expansion: centered dunk-range dots now map to a dedicated `rim` zone instead of falling through to `midrange`. The new pool prioritizes poster and vertical-impact clips, led by Anthony Edwards over John Collins, with Vince Carter over Frederic Weis, Ja Morant vs Minnesota, Giannis' Finals alley-oop, and a LeBron alley-oop as same-zone inventory.

June 23 Impact/Dispatches guard: `pnpm shot-embeds:target` now fails unless Impact-axis Dispatches resolves to `rim/edwards-collins-2024`. This protects the specific dunk-range assignment from falling back to a midrange clip such as Paul Pierce.

## Quality Gate

A clip counts only when all of these are true:

- It shows the exact named shot or the full game segment containing that shot.
- It is stable enough for a public portfolio: official YouTube/NBA sources first, then Vimeo or external pages only when the clip is clearly playable and not low-quality filler.
- It matches the court-zone intent closely enough that the project dot does not feel mislabeled.
- It has a provider entry in `src/pages/CurrentProjects.tsx`.
- It has `quality.level: 'verified-game-clip'`, a `reviewedAt` date, and a short note explaining what was verified.

## Timing Review Method

The automated gate verifies that every YouTube clip has explicit timing, a compact duration, a valid provider ID, and no visible assignment reuse. It does not prove the shot starts on the right frame.

Manual timing review should use this process:

- Open the source video directly in YouTube.
- Find the first frame where the relevant possession or shot setup starts.
- Record that absolute YouTube timestamp as `start`.
- Set `end` after the make and first useful replay, before broader commentary or highlight runoff.
- Add the observed start time to `quality.note` for any clip corrected from playback.

Local review workflow:

- Run `pnpm dev`.
- Open `/shot-review.html?id=<youtubeId>&start=<seconds>&end=<seconds>`.
- Use the embedded player for fast start/end checks.
- Use the "Open watch page" link when YouTube serves preroll ads or when direct YouTube frame review is needed.

## Replacement Watchlist

No active replacement watchlist as of June 23, 2026. Future candidates should still prefer official NBA/team sources when an equally tight shot/replay embed is available.
