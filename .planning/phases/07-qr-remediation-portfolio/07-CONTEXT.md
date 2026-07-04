# Phase 7: QR remediation: portfolio - Context

**Gathered:** 2026-07-04
**Status:** Ready for planning
**Source:** PRD Express Path (/Users/jakyeamos/.local/state/quality-runner/fleet/per-repo-summaries-20260704/portfolio.md)

<domain>
## Phase Boundary

Plan the remediation work for portfolio from Quality Runner run qr-fleet-continue-20260704-portfolio.
This phase is planning-only until execute-phase runs. Quality Runner remains advisory-only: it identifies findings, remediation clusters, and verification suggestions, but all source changes happen in /Users/jakyeamos/projects/portfolio.

Findings: 13
Severity: `observation` 7, `warning` 6
Categories: `structural:deduplicate` 1, `structural:harden` 1, `structural:ponytail` 3, `structural:simplify` 3, `structural:speed` 1, `structural:ui_structural` 4
Fleet phase candidate: Phase 3 - Mixed Medium Repos
Requirement: QR-PORTFOLIO

</domain>

<decisions>
## Implementation Decisions

### D-01 - QR summary is the planning source
- Use /Users/jakyeamos/.local/state/quality-runner/fleet/per-repo-summaries-20260704/portfolio.md and the artifacts under /Users/jakyeamos/projects/portfolio/.quality-runner/runs/qr-fleet-continue-20260704-portfolio as the source of truth for this remediation phase.

### D-02 - Cluster-oriented remediation
- Plan and execute coherent remediation batches by QR cluster, not one isolated edit per finding row.

### D-03 - Behavior preservation
- Prefer behavior-preserving refactors, hardening, and simplification. Do not change product behavior unless a QR hardening cluster explicitly requires safer behavior.

### D-04 - Existing project conventions first
- Read the target files and local manifests before editing. Follow existing package-manager, formatter, test, and architecture conventions. Use pnpm for JavaScript package scripts.

### D-05 - Evidence-backed closure
- A cluster is done only when focused repo verification passes and a post-remediation QR run shows the fingerprints cleared or are dispositioned with evidence.

### Claude's Discretion
- Choose exact helper extraction boundaries, naming, and task order when the QR document identifies the finding but not the implementation shape.
- If a cluster turns out to require product, API, or design decisions, stop that cluster and capture the question instead of guessing.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Quality Runner Inputs
- `/Users/jakyeamos/.local/state/quality-runner/fleet/per-repo-summaries-20260704/portfolio.md` - Per-repo QR summary used as this phase PRD.
- `/Users/jakyeamos/projects/portfolio/.quality-runner/runs/qr-fleet-continue-20260704-portfolio/quality-audit.json` - Quality audit report.
- `/Users/jakyeamos/projects/portfolio/.quality-runner/runs/qr-fleet-continue-20260704-portfolio/remediation-plan.json` - QR remediation plan.
- `/Users/jakyeamos/projects/portfolio/.quality-runner/runs/qr-fleet-continue-20260704-portfolio/code-quality-scan.json` - Code-quality scan fingerprints.
- `/Users/jakyeamos/projects/portfolio/.quality-runner/runs/qr-fleet-continue-20260704-portfolio/resolution-ledger.md` - Resolution ledger for closure evidence.
- `/Users/jakyeamos/projects/portfolio/.quality-runner/runs/qr-fleet-continue-20260704-portfolio/agent-handoff.md` - QR agent handoff.

</canonical_refs>

<specifics>
## Top Findings

- `structural-simplify-deep-nesting` warning structural:simplify: 32 deep-nesting structural findings in simplification and shrink pass. Fix: 32 findings, aggregate score 192: Flatten guard clauses, extract decision helpers, or split rendering branches. Evidence: scripts/check-shot-embeds.mjs:81: deep-nesting; scripts/check-shot-embeds.mjs:84: deep-nesting; scripts/check-shot-embeds.mjs:343: deep-nesting
- `structural-simplify-large-source-file` warning structural:simplify: 3 large-source-file structural findings in simplification and shrink pass. Fix: 3 findings, aggregate score 27: Split mixed responsibilities into focused modules. Evidence: scripts/check-shot-embeds.mjs:1: large-source-file; src/content/portfolioContent.ts:1: large-source-file; src/pages/CurrentProjects.tsx:1: large-source-file
- `structural-simplify-nested-ternary` warning structural:simplify: 3 nested-ternary structural findings in simplification and shrink pass. Fix: 3 findings, aggregate score 27: Replace nested ternaries with named branches or helpers. Evidence: src/content/currentProjects.ts:249: nested-ternary; src/pages/CurrentProjects.tsx:1828: nested-ternary; src/pages/Home.tsx:52: nested-ternary
- `structural-deduplicate-near-duplicate-function` warning structural:deduplicate: 2 near-duplicate-function structural findings in duplicate consolidation and helper extraction. Fix: 2 findings, aggregate score 12: Extract a shared helper only when the call sites share domain semantics. Evidence: scripts/check-blog-content.mjs:25: near-duplicate-function; src/pages/CurrentProjects.tsx:1062: near-duplicate-function
- `structural-speed-await-in-loop` warning structural:speed: 2 await-in-loop structural findings in performance and batching improvements. Fix: 2 findings, aggregate score 12: Batch independent work or document required sequencing. Evidence: scripts/netlify-deploy-status.mjs:30: await-in-loop; scripts/netlify-deploy-status.mjs:33: await-in-loop
- `structural-ui_structural-image-missing-dimensions` warning structural:ui_structural: 2 image-missing-dimensions structural findings in UI accessibility and structural quality. Fix: 2 findings, aggregate score 12: Set explicit image dimensions or a stable aspect-ratio. Evidence: src/components/EditorialPoster.tsx:63: image-missing-dimensions; src/pages/PlayerComps.tsx:37: image-missing-dimensions
- `structural-harden-console-output` observation structural:harden: 69 console-output structural findings in API hardening and logging. Fix: 69 findings, aggregate score 138: Use structured logging or remove runtime console output. Evidence: scripts/aios-architecture-check.mjs:46: console-output; scripts/aios-architecture-check.mjs:48: console-output; scripts/aios-architecture-check.mjs:50: console-output
- `structural-ponytail-undocumented-env-flag` observation structural:ponytail: 8 undocumented-env-flag structural findings in Ponytail debt: yagni. Fix: 8 findings, aggregate score 16: Document NETLIFY_PRODUCTION_BRANCH or remove the one-off configuration branch. Evidence: scripts/netlify-deploy-status.mjs:8: undocumented-env-flag; scripts/netlify-deploy-status.mjs:9: undocumented-env-flag; scripts/netlify-deploy-status.mjs:15: undocumented-env-flag

## Remediation Clusters

1. remediate-structural-scripts-sync-tracker-mjs (medium, score 146) - Remediate structural cluster in scripts/sync-tracker.mjs
2. remediate-structural-scripts-check-shot-embeds-mjs (medium, score 95) - Remediate structural cluster in scripts/check-shot-embeds.mjs
3. remediate-structural-src-pages-currentprojects-tsx (medium, score 44) - Remediate structural cluster in src/pages/CurrentProjects.tsx
4. remediate-structural-scripts-netlify-deploy-status-mjs (medium, score 34) - Remediate structural cluster in scripts/netlify-deploy-status.mjs
5. remediate-structural-scripts-secret-scan-mjs (medium, score 18) - Remediate structural cluster in scripts/secret-scan.mjs
6. remediate-structural-src-content-blogmarkdown-ts (medium, score 14) - Remediate structural cluster in src/content/blogMarkdown.ts

</specifics>

<deferred>
## Deferred Ideas

- Broad rewrites outside the QR clusters.
- Running Quality Runner as an executor or letting QR mutate source code.
- Remediating repos outside portfolio; each repo gets its own GSD phase.

</deferred>

---

*Phase: 7*
*Context gathered: 2026-07-04 via QR per-repo PRD*
