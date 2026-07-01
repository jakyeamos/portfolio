# Phase 1 Plan: Candidate Repo Inventory and Scoring Matrix

## Goal

Create the source-of-truth inventory for product repos, BBDSE subprojects, and
Quality Runner so later cleanup work is scoped by evidence instead of memory.

## Target Repos

Product/source candidates:
- `/Users/jakyeamos/projects/Hoopscout`
- `/Users/jakyeamos/projects/soundscape-app`
- `/Users/jakyeamos/projects/Bballedu`
- `/Users/jakyeamos/projects/Fantasy`
- `/Users/jakyeamos/projects/Book`
- `/Users/jakyeamos/projects/tm`
- `/Users/jakyeamos/projects/video-pipeline`
- `/Users/jakyeamos/quality-runner`

BBDSE candidates:
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

Case-study-first sensitive products:
- `/Users/jakyeamos/projects/BidCamp`
- `/Users/jakyeamos/projects/Crimclock`

## Deliverables

- `.planning/interview-surface/candidate-inventory.md`
- `.planning/interview-surface/candidate-scoring-matrix.md`
- Updated `.planning/STATE.md` with Phase 1 outcome.

## Execution Steps

- [ ] Gather git and visibility facts.
  - For each target repo, record local path, current branch, `git status --short`, remote URL, GitHub repo name, and visibility.
  - Use `gh repo view <owner>/<repo> --json name,visibility,isPrivate,description,url,repositoryTopics,homepageUrl` when network/CLI access is available.
  - If GitHub lookup fails, record `visibility unknown` and do not infer.

- [ ] Gather project metadata.
  - Read each `README.md` opening section.
  - For JS/TS repos, read `package.json` name, `private`, description, license, and scripts.
  - For Python repos, read `pyproject.toml` name, description, license, and configured tools.
  - Record whether the repo has `.tracker/PROJECT_TRUTH.md`.

- [ ] Gather risk signals.
  - Search for tracked/untracked env/provider artifacts: `.env*`, `.vercel`, `*.pem`, `*.key`, secret/token named files.
  - For BBDSE, record CSV/parquet/db/report artifacts that need source/license review.
  - Record media/screenshot availability with counts, not detailed visual review.

- [ ] Score each candidate.
  - Maturity: `0-3` for empty/planning/prototype/shippable.
  - Code quality confidence: `0-3` based on available commands and current cleanliness.
  - Public risk: `0-3` where higher means more risk from secrets, data, legal, or private product context.
  - Presentation readiness: `0-3` based on README, screenshots/visuals, metadata, and reviewer path.
  - Interview value: `0-3` based on product depth, technical signal, and ownership clarity.

- [ ] Assign initial classification.
  - `publish now`: low risk, meaningful code, credible docs, and likely quality gates.
  - `publish after cleanup`: valuable but blocked by quality, docs, data, or branch hygiene.
  - `case-study only`: sensitive, collaborator/client/business repo, or source-public value is lower than presentation value.
  - `defer`: empty, duplicate, stale, or not helpful for hiring reviewers.

- [ ] Verify Phase 1.
  - Confirm both inventory artifacts exist.
  - Confirm every target repo above appears exactly once.
  - Confirm no candidate repo source files were edited.

## Publish / No-Publish Rules

Phase 1 classifications are preliminary. No repo visibility can change until
Phase 2 defines the gate and a later repo-specific phase applies it.

## Commit Strategy

- Commit only portfolio planning files.
- Suggested commit: `docs: inventory interview-surface repo candidates`
