# portfolio

## What This Is

Personal portfolio site built as a React/Vite/Tailwind SPA with an editorial sports framing. The redesign already exists, but the project still needs release discipline so the live portfolio matches current work and excludes projects that are not actually yours.

## Core Value

The live portfolio should accurately represent current owned work and stay deployable from main.

## Requirements

### Validated

- ✓ A substantial redesign already exists in the repo as a React SPA.
- ✓ The site already covers multiple pages and content-driven sections.

### Active

- [ ] Keep the current-project list limited to work that belongs in the portfolio.
- [ ] Verify the redesign builds cleanly and is ready to merge to main.
- [ ] Resolve remaining release and deployment gaps so the public site is trustworthy.

### Out of Scope

- Showcasing projects that are not owned work - That creates portfolio drift and weakens trust.
- Parallel maintenance of two different portfolio implementations - The SPA should become the authoritative product.

## Context

- The repo still contains legacy static-site residue alongside the SPA.
- There are loose binary artifacts and draft directories that muddy the release baseline.
- The current-projects list needed cleanup after moving some repos out of the active set.

## Constraints

- **Accuracy**: All featured work should be current and owned - The portfolio is a public-facing credibility surface.
- **Deployment**: main should be deployable without relying on branch-only state - The site should be easy to publish and maintain.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Bootstrap GSD planning in an existing brownfield repo | The repo needed planning state before phase work could be managed coherently | - Pending |

---
*Last updated: 2026-04-10 after initial GSD bootstrap*
