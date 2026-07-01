# Roadmap: Interview Surface Public Readiness

## Overview

Planning-first release train for making mature work public-ready as an interview
surface. The first milestone creates execution-ready phase plans; later sessions
can run one phase at a time without re-deciding scope.

## Phases

**Phase Numbering:**
- Phase 0 establishes the audit harness baseline.
- Phases 1-6 create the inventory, gate, repo-specific plans, reviewer surface plan, and release schedule.
- Candidate repo hardening and visibility changes are intentionally outside this planning milestone.

- [ ] **Phase 0: Quality Runner Readiness Baseline** - Document what Quality Runner can reliably audit today and how to interpret its findings.
- [ ] **Phase 1: Candidate Repo Inventory and Scoring Matrix** - Inventory product repos, BBDSE subprojects, and Quality Runner itself.
- [ ] **Phase 2: Public-Readiness Gate Template** - Define the repeatable gate that combines Quality Runner with manual review.
- [ ] **Phase 3: BBDSE Release-Train Plans** - Plan BBDSE parent and subproject release decisions independently.
- [ ] **Phase 4: Product Repo Hardening Plans** - Plan hardening for product repos and Quality Runner.
- [ ] **Phase 5: Portfolio and GitHub Profile Plan** - Plan the reviewer-facing map, pinned repos, case studies, and ownership claims.
- [ ] **Phase 6: Tiered Release Schedule** - Classify repos and define the execution order for future sessions.

## Phase Details

### Phase 0: Quality Runner Readiness Baseline
**Goal**: Establish Quality Runner's current audit boundary before using it as a standard bar.
**Depends on**: Nothing.
**Requirements**: [ISR-01, ISR-02, ISR-04]
**Success Criteria**:
  1. Quality Runner's reliable current capabilities are documented.
  2. Known Quality Runner gaps are separated from public-readiness gates.
  3. Future repo plans know when Quality Runner output is advisory versus blocking.
**Plan**: `.planning/phases/phase-0-quality-runner-readiness/PLAN.md`

### Phase 1: Candidate Repo Inventory and Scoring Matrix
**Goal**: Produce a source-of-truth inventory for all candidate repos.
**Depends on**: Phase 0.
**Requirements**: [ISR-01, ISR-02, ISR-05, ISR-07, ISR-08]
**Success Criteria**:
  1. Product repos, BBDSE subprojects, and Quality Runner are listed with path, remote, visibility, branch, and worktree state.
  2. Each repo has initial maturity, risk, available-gate, and presentation scores.
  3. Existing dirty worktrees and active branches are called out before cleanup planning.
**Plan**: `.planning/phases/phase-1-candidate-inventory/PLAN.md`

### Phase 2: Public-Readiness Gate Template
**Goal**: Define the reusable gate every repo must pass before promotion.
**Depends on**: Phase 1.
**Requirements**: [ISR-01, ISR-02, ISR-06, ISR-10, ISR-12]
**Success Criteria**:
  1. The gate includes Quality Runner, manual security/data review, README/visual review, metadata review, and local quality commands.
  2. The gate distinguishes `pass`, `blocker`, `warning`, and `not applicable`.
  3. The gate can be applied to TypeScript apps, Python packages, data projects, and case-study-only products.
**Plan**: `.planning/phases/phase-2-public-readiness-gate/PLAN.md`

### Phase 3: BBDSE Release-Train Plans
**Goal**: Create independent release plans for BBDSE parent and nested subprojects.
**Depends on**: Phase 2.
**Requirements**: [ISR-01, ISR-02, ISR-08, ISR-11, ISR-12]
**Success Criteria**:
  1. Each BBDSE subproject has a release classification and blocker list.
  2. CSV/parquet/report artifacts have explicit data provenance review tasks.
  3. Planning-first subprojects are framed honestly if they remain public candidates.
**Plan**: `.planning/phases/phase-3-bbdse-release-train/PLAN.md`

### Phase 4: Product Repo Hardening Plans
**Goal**: Create per-repo hardening plans for the non-BBDSE product/source candidates.
**Depends on**: Phase 2.
**Requirements**: [ISR-01, ISR-02, ISR-05, ISR-10, ISR-12]
**Success Criteria**:
  1. Each target repo has a specific audit and cleanup plan.
  2. Quality Runner is planned as both a candidate repo and an audit harness.
  3. Sensitive or dirty repo states are not flattened into generic work.
**Plan**: `.planning/phases/phase-4-product-hardening/PLAN.md`

### Phase 5: Portfolio and GitHub Profile Plan
**Goal**: Plan the reviewer-facing presentation layer.
**Depends on**: Phase 1.
**Requirements**: [ISR-01, ISR-02, ISR-09, ISR-13, ISR-14]
**Success Criteria**:
  1. Pinned repos, case studies, screenshots/mock visuals, and claims are mapped.
  2. Private products have case-study-safe presentation rules.
  3. GitHub profile and portfolio changes point reviewers to the strongest evidence.
**Plan**: `.planning/phases/phase-5-reviewer-surface/PLAN.md`

### Phase 6: Tiered Release Schedule
**Goal**: Produce the final release schedule for future execution sessions.
**Depends on**: Phases 3, 4, and 5.
**Requirements**: [ISR-01, ISR-02, ISR-03, ISR-09, ISR-12, ISR-15]
**Success Criteria**:
  1. Each candidate is classified as `publish now`, `publish after cleanup`, or `case-study only`.
  2. The schedule orders work by public impact, risk, and dependency.
  3. Future sessions can execute one repo or phase at a time with clear stop conditions.
**Plan**: `.planning/phases/phase-6-tiered-release-schedule/PLAN.md`

## Progress

**Execution Order:**
Phase 0 -> Phase 1 -> Phase 2 -> Phases 3/4/5 -> Phase 6

| Phase | Plan Status | Execution Status | Completed |
| --- | --- | --- | --- |
| 0. Quality Runner Readiness Baseline | Planned | Not started | - |
| 1. Candidate Repo Inventory and Scoring Matrix | Planned | Not started | - |
| 2. Public-Readiness Gate Template | Planned | Not started | - |
| 3. BBDSE Release-Train Plans | Planned | Not started | - |
| 4. Product Repo Hardening Plans | Planned | Not started | - |
| 5. Portfolio and GitHub Profile Plan | Planned | Not started | - |
| 6. Tiered Release Schedule | Planned | Not started | - |

---
*Roadmap updated: 2026-07-01*
