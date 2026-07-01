# Phase 5 Plan: Portfolio and GitHub Profile Reviewer Surface

## Goal

Plan the reviewer-facing map that connects the portfolio, GitHub profile, pinned
repos, case studies, screenshots/mock visuals, quality evidence, and ownership
claims.

## Target Repos

- `/Users/jakyeamos/projects/portfolio`
- `/Users/jakyeamos/projects/jakyeamos-profile`
- Case-study-first sources: `/Users/jakyeamos/projects/BidCamp`, `/Users/jakyeamos/projects/Crimclock`, and any repo classified `case-study only` in Phases 3-4.

## Deliverables

- `.planning/interview-surface/reviewer-surface-plan.md`
- `.planning/interview-surface/case-study-visual-plan.md`
- Updated `.planning/STATE.md` with Phase 5 outcome.

## Execution Steps

- [ ] Read Phase 1 inventory and preliminary classifications.
  - Use the repo inventory to avoid promoting stale, private, or weak projects.
  - Carry forward sensitive-product notes.

- [ ] Define reviewer journey.
  - First stop: portfolio homepage and projects/case-study pages.
  - Second stop: GitHub profile README and pinned repos.
  - Third stop: individual repo READMEs with quality evidence and evaluation paths.

- [ ] Plan pinned repo strategy.
  - Recommend 4-6 pinned repos maximum.
  - Balance product apps, data/research, local-first/tooling, and quality/process signal.
  - Do not pin repos that have unresolved blocker classifications.

- [ ] Plan portfolio case studies.
  - Private/sensitive products should show problem, role, architecture, product decisions, and safe mocked visuals.
  - Mocked visuals must be clearly presented as case-study visuals, not production screenshots.
  - Claims must be source-backed and avoid private customer/client details.

- [ ] Plan GitHub profile README updates.
  - Lead with the balanced builder narrative.
  - Separate source-public repos from private case studies.
  - Link to Quality Runner evidence where useful without making it look like the only quality bar.

- [ ] Define visual asset requirements.
  - For public apps, prefer real screenshots once safe demo data exists.
  - For private products, use mocked case-study visuals with no private data.
  - For CLI/data tools, use terminal snippets, architecture diagrams, or report-preview images instead of decorative screenshots.

- [ ] Verify Phase 5.
  - Confirm every promoted project has a planned public artifact.
  - Confirm private products have safe case-study treatment.
  - Confirm no portfolio UI or GitHub profile source files were edited during planning unless this phase is explicitly converted into implementation.

## Publish / No-Publish Rules

Phase 5 can recommend presentation changes, but implementation waits for a later
portfolio/profile execution plan. No claims should publish before repo-level
classifications are known.

## Commit Strategy

- Commit only portfolio planning files.
- Suggested commit: `docs: plan interview reviewer surface`
