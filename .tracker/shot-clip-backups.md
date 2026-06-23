# Historic Shot Clip Backup Inventory

The active registry in `src/pages/CurrentProjects.tsx` intentionally has more verified clips than the UI currently shows on any one axis. Those unused clips are the backup inventory for future projects.

Run:

```bash
pnpm shot-inventory
```

The command prints, for each scouting axis and court zone:

- assigned clips currently visible on that axis
- backup clip IDs still available in the same zone
- current-project and shipped-project assignment scopes

Rules for using backups:

- Keep replacements zone-compatible. Do not move a midrange project to an above-break clip just to avoid reuse.
- Prefer unused backups from the same axis and same court zone.
- If a zone has no backups left, add new verified clips to that zone before adding more projects there.
- Every new clip still needs explicit `start` and `end` seconds and must pass `pnpm shot-embeds:target`.

Current baseline as of June 23, 2026:

- Registry: `45/45` quality-gated YouTube clips.
- Visible assignment audit: `0` same-axis duplicate clips.
- Window audit: no missing timing and no YouTube window over `38` seconds.

