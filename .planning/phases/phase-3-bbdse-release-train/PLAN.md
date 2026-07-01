# Phase 3 Plan: BBDSE Release-Train Plans

## Goal

Create independent public-readiness plans for BBDSE parent and subprojects,
with special attention to data provenance, research maturity, and honest framing.

## Target Repos

- `/Users/jakyeamos/projects/BBDSE`
- `/Users/jakyeamos/projects/BBDSE/BBDS-Analytics-Product-Suite`
- `/Users/jakyeamos/projects/BBDSE/CLFE`
- `/Users/jakyeamos/projects/BBDSE/Cap-Fit Builder`
- `/Users/jakyeamos/projects/BBDSE/Coach Value Over Expected`
- `/Users/jakyeamos/projects/BBDSE/LIS`
- `/Users/jakyeamos/projects/BBDSE/RTE`
- `/Users/jakyeamos/projects/BBDSE/RTE Transferable Signals`
- `/Users/jakyeamos/projects/BBDSE/SMWI`
- `/Users/jakyeamos/projects/BBDSE/Signal Lab`
- `/Users/jakyeamos/projects/BBDSE/Versatility Tax`
- `/Users/jakyeamos/projects/BBDSE/Womens Stats`

## Deliverables

- `.planning/interview-surface/bbdse-release-train.md`
- `.planning/interview-surface/bbdse-data-provenance-checklist.md`
- One section per BBDSE subproject with classification, blockers, audit commands, and cleanup plan.
- Updated `.planning/STATE.md` with Phase 3 outcome.

## Execution Steps

- [ ] Read Phase 1 inventory and Phase 2 gate.
  - Do not start BBDSE classification without both artifacts.
  - Carry forward branch/dirty-state notes from Phase 1.

- [ ] Audit BBDSE parent repo purpose.
  - Decide whether the parent should be public as an index, private as a workspace wrapper, or public after submodules are ready.
  - Record submodule status and whether nested repo pointers are clean, dirty, or ahead/behind.

- [ ] Apply the gate to each subproject.
  - Run Quality Runner where supported: `quality-runner run <subproject> --profile jakyeamos --json`.
  - Run repo-native checks only if already documented and safe to run without dependency installation.
  - If commands are missing or blocked, record a blocker instead of inventing commands.

- [ ] Review data artifacts.
  - For each CSV/parquet/report artifact, classify as raw public data, generated derivative, fixture, report output, or unknown.
  - Record source, license/terms, redistribution safety, and whether the file should stay tracked for public release.
  - Flag unlabeled or ambiguous data as blockers.

- [ ] Review research/product framing.
  - Planning-first projects must be labeled as planning/research work, not shipped systems.
  - Model outputs and rankings must include caveats when validation is incomplete.
  - README claims must not overstate predictive accuracy, production readiness, or official data partnerships.

- [ ] Write per-subproject release plans.
  - Include README/metadata edits needed.
  - Include data cleanup/provenance tasks.
  - Include quality-code commands and known blockers.
  - Include `publish now`, `publish after cleanup`, `case-study only`, or `defer`.

- [ ] Verify Phase 3.
  - Confirm every BBDSE target repo appears in the release-train artifact.
  - Confirm every data-heavy project has a provenance section.
  - Confirm no BBDSE source files were edited.

## Publish / No-Publish Rules

BBDSE repos can be made public only after their per-subproject gate passes and
the final release schedule in Phase 6 approves the order. Ambiguous data
provenance is a blocker.

## Commit Strategy

- Commit only portfolio planning files.
- Suggested commit: `docs: plan bbdse public-readiness release train`
