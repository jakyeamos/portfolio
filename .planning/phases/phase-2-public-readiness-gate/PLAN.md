# Phase 2 Plan: Public-Readiness Gate Template

## Goal

Create the repeatable gate used to decide whether a repo is interview-ready,
blocked, or better represented as a case study.

## Target Repos

- `/Users/jakyeamos/projects/portfolio` - owns the gate template.
- Candidate repos from Phase 1 are examples only; do not edit them in this phase.

## Deliverables

- `.planning/interview-surface/public-readiness-gate.md`
- `.planning/interview-surface/repo-audit-template.md`
- Updated `.planning/STATE.md` with Phase 2 outcome.

## Execution Steps

- [ ] Define gate result vocabulary.
  - `pass`: evidence supports public promotion.
  - `blocker`: issue must be fixed before source-public release or promotion.
  - `warning`: acceptable with explanation or follow-up.
  - `not applicable`: check does not apply to this repo shape.

- [ ] Define Quality Runner section.
  - Standard command: `quality-runner run <repo> --profile jakyeamos --json`
  - Required artifacts when available: repo scan, standards, capability matrix, quality audit, remediation plan, and handoff.
  - Interpretation: advisory evidence unless the finding maps to a manual blocker.

- [ ] Define manual security and secret checks.
  - Required search patterns: `.env*`, `.vercel`, provider config, `*.pem`, `*.key`, token/secret named files.
  - Required review: tracked status, `.gitignore` coverage, example env safety, and accidental local data.
  - Blocker examples: real credentials, production provider env files, private endpoints, or personal data.

- [ ] Define data provenance checks.
  - Required for BBDSE and analytics repos.
  - Document source URL/vendor, license/terms, generated-vs-raw status, redistribution permission, and reproducibility path.
  - Blocker examples: redistributing data without clear permission, private/manual scouting data without clearance, or unlabeled generated data.

- [ ] Define quality-code checks.
  - JS/TS: `pnpm lint`, `pnpm typecheck` if separate, `pnpm test`, `pnpm build`, `pnpm audit:dead-code` or `pnpm knip` where configured, `pnpm secret:scan`, `pnpm dependency:security`.
  - Python: `ruff check .`, `ruff format --check .`, `pytest`, type checker if configured, `vulture . --min-confidence 70`.
  - Repo-specific commands take precedence over generic commands.

- [ ] Define documentation and presentation checks.
  - README must include pitch, status, architecture, setup/evaluation path, commands, screenshots/visuals when useful, limitations, and ownership.
  - GitHub metadata must include description, topics, homepage/case-study URL when available, license/status, and pinned suitability.
  - Case-study-only repos must have a portfolio plan instead of public source claims.

- [ ] Define branch and commit checks.
  - Record branch, dirty worktree, untracked files, active feature branch context, and remote push status.
  - Do not mix public-readiness edits with unrelated user work.
  - Each repo cleanup phase must end in an atomic commit and truth-file update when a truth file exists.

- [ ] Verify Phase 2.
  - Confirm gate and template contain all required sections.
  - Confirm the template can be applied to JS/TS apps, Python packages, data repos, and case-study-only products.
  - Confirm no candidate repo source files were edited.

## Publish / No-Publish Rules

Phase 2 defines rules only. A repo becomes publishable only after a later phase
applies this gate and records evidence.

## Commit Strategy

- Commit only portfolio planning files.
- Suggested commit: `docs: define interview-surface readiness gate`
