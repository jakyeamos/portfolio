# Phase 6 Plan: Tiered Release Schedule

## Goal

Convert the inventory, gates, repo-specific plans, and reviewer-surface plan into
an execution schedule that can be run in future sessions without re-planning the
whole public-readiness program.

## Target Repos

All candidates from Phases 3-5, grouped by classification:
- BBDSE parent and subprojects.
- Non-BBDSE product/source candidates.
- Case-study-first private/sensitive products.
- Portfolio and GitHub profile repos.

## Deliverables

- `.planning/interview-surface/tiered-release-schedule.md`
- `.planning/interview-surface/release-decision-log.md`
- Updated `.planning/STATE.md` with Phase 6 outcome.

## Execution Steps

- [ ] Read Phase 3, Phase 4, and Phase 5 outputs.
  - Do not classify a repo without its gate evidence or blocker list.
  - If a phase output is missing, stop and finish that phase first.

- [ ] Create final classification groups.
  - `publish now`: passed gate; low risk; clear README/metadata path; no unresolved blocker.
  - `publish after cleanup`: valuable but requires planned code/docs/data/security work.
  - `case-study only`: source-public exposure is risky, not approved, or not the best interview signal.
  - `defer`: not mature or not relevant enough for this interview surface.

- [ ] Order execution.
  - Start with high-signal, low-risk repos.
  - Keep BBDSE data-heavy repos behind data provenance review.
  - Keep private products behind case-study work unless separately approved.
  - Reserve source-public visibility changes for the end of each repo-specific cleanup sprint.

- [ ] Define per-sprint protocol.
  - Start from a clean branch/worktree.
  - Apply the repo's public-readiness plan.
  - Run Quality Runner and repo-native gates.
  - Update README/metadata/visuals.
  - Update `.tracker/PROJECT_TRUTH.md` when present.
  - Commit and push the completed slice.
  - Request explicit approval before changing repo visibility.

- [ ] Define stop conditions.
  - Stop if secrets, private data, unclear licensing, broken quality gates, or unrelated dirty work prevent safe progress.
  - Stop if repo ownership or collaborator approval is unclear.
  - Stop if Quality Runner or native gates produce findings that cannot be triaged in the current sprint.

- [ ] Verify Phase 6.
  - Confirm every candidate repo has exactly one final classification.
  - Confirm each `publish now` item has evidence, not just optimism.
  - Confirm every visibility change is represented as a future approval step.

## Publish / No-Publish Rules

This phase schedules publication but does not execute it. A future repo-specific
session must pass the gate and receive explicit approval before any visibility
change.

## Commit Strategy

- Commit only portfolio planning files.
- Suggested commit: `docs: schedule tiered interview-surface release`
