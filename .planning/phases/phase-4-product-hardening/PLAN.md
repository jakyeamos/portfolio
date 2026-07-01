# Phase 4 Plan: Product Repo Hardening Plans

## Goal

Create per-repo hardening plans for the non-BBDSE source-public candidates,
including Quality Runner as both candidate and audit harness.

## Target Repos

- `/Users/jakyeamos/projects/Hoopscout`
- `/Users/jakyeamos/projects/soundscape-app`
- `/Users/jakyeamos/projects/Bballedu`
- `/Users/jakyeamos/projects/Fantasy`
- `/Users/jakyeamos/projects/Book`
- `/Users/jakyeamos/projects/tm`
- `/Users/jakyeamos/projects/video-pipeline`
- `/Users/jakyeamos/quality-runner`

## Deliverables

- `.planning/interview-surface/product-hardening-plans.md`
- One section per target repo with gate evidence, cleanup tasks, verification commands, branch strategy, and release classification.
- Updated `.planning/STATE.md` with Phase 4 outcome.

## Execution Steps

- [ ] Read Phase 1 inventory and Phase 2 gate.
  - Carry forward visibility, branch, dirty-state, script, and metadata facts.
  - Do not flatten all repos into one generic checklist; each repo needs its own plan.

- [ ] Apply Quality Runner where supported.
  - Standard command: `quality-runner run <repo> --profile jakyeamos --json`
  - If Quality Runner cannot run, record why and use repo-native gates as the temporary evidence source.

- [ ] Define repo-native quality ladder.
  - Use existing scripts from each repo before generic commands.
  - JS/TS repos must use `pnpm`.
  - Python repos use the repo's configured toolchain first, then generic `ruff`/`pytest`/type/dead-code checks only where reasonable.

- [ ] Define README and presentation work.
  - Each repo plan must state needed README sections, screenshots/visuals, architecture notes, limitations, and reviewer call-to-action.
  - For private products or products with sensitive internals, route to Phase 5 case-study presentation instead of source-public work.

- [ ] Define branch and commit strategy.
  - Preserve existing feature branches and dirty worktrees.
  - If a repo is dirty before work starts, classify existing changes as user/in-flight and avoid mixing public-readiness edits.
  - Each future cleanup slice should end in an atomic commit and `.tracker/PROJECT_TRUTH.md` update when present.

- [ ] Classify each repo.
  - `publish now`: gate is already satisfied or needs only metadata/presentation edits.
  - `publish after cleanup`: valuable but blocked by code quality, docs, branch hygiene, or security/data review.
  - `case-study only`: source exposure is less useful or riskier than a portfolio case study.
  - `defer`: not mature enough for the interview surface.

- [ ] Verify Phase 4.
  - Confirm every target repo has a concrete section.
  - Confirm every section includes commands, cleanup criteria, verification gates, and release classification.
  - Confirm no product repo source files were edited.

## Publish / No-Publish Rules

Phase 4 does not publish repos. It produces hardening plans that must be executed
in later sessions before any source-public promotion.

## Commit Strategy

- Commit only portfolio planning files.
- Suggested commit: `docs: plan product repo public-readiness hardening`
