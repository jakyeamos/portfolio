# Commands and quality gates

Run commands from the repository root with Node 22.14+ and the pinned pnpm
version.

| Command                    | Purpose                                        | Writes                           |
| -------------------------- | ---------------------------------------------- | -------------------------------- |
| `pnpm format:check`        | Prettier verification                          | no                               |
| `pnpm architecture:check`  | import and boundary verification               | no                               |
| `pnpm environment:check`   | context, workflow, and contract verification   | no                               |
| `pnpm typecheck`           | strict TypeScript check                        | no                               |
| `pnpm test`                | deterministic content, media, and route checks | generated/cache only             |
| `pnpm secret:scan`         | high-confidence secret scan                    | no                               |
| `pnpm dependency:security` | high/critical dependency advisory check        | cache only                       |
| `pnpm build`               | validate the production bundle and pages       | `dist/`                          |
| `pnpm tracker:check`       | detect public projection drift                 | no                               |
| `pnpm tracker:sync`        | apply reviewed public projection fields        | `src/content/currentProjects.ts` |
| `pnpm precr:check`         | run the local integration gate                 | generated/cache only             |

The normal verification sequence is format, architecture, environment,
typecheck, test, secret scan, and build. `pnpm dependency:security` may report a
non-blocking skip when the registry is unavailable; that uncertainty must stay
visible in the report. `pnpm tracker:sync` is the only routine command here that
intentionally edits public source data.
