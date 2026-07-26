# Portfolio repository context

last_reviewed: 2026-07-25

Load this index first, then follow only the packet needed for the task.

- [Architecture and boundaries](architecture.md)
- [Commands and quality gates](commands.md)
- [Coding conventions](conventions.md)
- [Security and data boundaries](security.md)
- [Common failure modes](failure-modes.md)
- [Good implementation examples](examples.md)
- [Definition of done](done.md)
- [Deployment and rollback](deployment.md)

This is a Vite/React static portfolio. Public content, media provenance, and
status projections live in `src/content/`; validation and release controls live
in `scripts/` and `.github/`. The `.tracker/` directory is an evidence and
allowlist surface, not a private operational database.

Do not load the whole repository into an agent context. Start with the relevant
packet, then inspect only the source files named by that packet and the task.

The environment contract validates this index, packet links, command surface,
secret placeholders, and workflow ownership. Run `pnpm environment:check` after
changing routing, commands, security boundaries, or release controls.

The local-only `market.md` packet is intentionally ignored and is not part of
the routed repository contract.
