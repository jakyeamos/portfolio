# Phase 0 Plan: Quality Runner Readiness Baseline

## Goal

Confirm what `/Users/jakyeamos/quality-runner` can reliably contribute to the
interview-surface public-readiness process today, then define how later phases
should use its output without overstating it.

## Target Repos

- `/Users/jakyeamos/quality-runner` - audit harness and source-public candidate.
- `/Users/jakyeamos/projects/portfolio` - control-plane repo that stores the baseline artifact.

## Deliverables

- `.planning/interview-surface/quality-runner-baseline.md`
- Optional generated Quality Runner artifacts under a fixture or self-audit run, if the tool can run locally without dependency work.
- Updated `.planning/STATE.md` with Phase 0 outcome.

## Execution Steps

- [ ] Inspect Quality Runner current state.
  - Run: `git -C /Users/jakyeamos/quality-runner status --short`
  - Run: `sed -n '1,220p' /Users/jakyeamos/quality-runner/README.md`
  - Run: `sed -n '1,220p' /Users/jakyeamos/quality-runner/pyproject.toml`
  - Record CLI commands, v1 safety boundary, supported artifact names, and declared development ladder.

- [ ] Confirm the installed command path.
  - Run: `command -v quality-runner`
  - If installed, run: `quality-runner --version` and `quality-runner doctor --json`.
  - If not installed, do not install dependencies in this phase. Record `not installed` and use repository README/CLI code as the baseline.

- [ ] Test a low-risk inspection path if available.
  - Preferred command: `quality-runner inspect /Users/jakyeamos/projects/portfolio --profile jakyeamos --json`
  - Fallback command from the repo if installed command is absent: `uv run quality-runner inspect /Users/jakyeamos/projects/portfolio --profile jakyeamos --json`
  - If dependency/network setup blocks the command, record the blocker and do not force installation.

- [ ] Write the baseline artifact.
  - Create `.planning/interview-surface/quality-runner-baseline.md`.
  - Include: reliable capabilities, generated artifacts, unsupported checks, false-positive/false-negative risks, command requirements, and interpretation policy.
  - State that Quality Runner output is advisory unless the public-readiness gate marks a finding as blocking.

- [ ] Define later-phase usage rules.
  - Standard command: `quality-runner run <repo> --profile jakyeamos --json`
  - Required interpretation: Quality Runner findings feed the repo gate, but manual review owns secrets, data provenance, ownership claims, licensing, screenshots, and publish approval.
  - Failure policy: missing Quality Runner support is a warning, not an automatic repo blocker, unless no other quality evidence exists.

- [ ] Verify Phase 0.
  - Confirm the baseline file exists and contains no placeholders.
  - Confirm `.planning/ROADMAP.md` still points Phase 0 to this plan.
  - Confirm no candidate repo source files were edited.

## Publish / No-Publish Rules

Phase 0 does not publish anything. Quality Runner itself can only be marked as a
future public-source candidate after Phase 4 applies the full public-readiness gate.

## Commit Strategy

- Commit only portfolio planning files.
- Suggested commit: `docs: add quality runner public-readiness baseline plan`
- Do not commit generated `.quality-runner/` artifacts unless the Phase 0 reviewer explicitly decides they are useful planning evidence.
