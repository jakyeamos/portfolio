# Roadmap: Interview Surface Public Readiness

## Overview

Planning-first release train for making mature work public-ready as an interview
surface. This milestone creates execution-ready GSD-style plans; later sessions
can run one numbered plan at a time without re-deciding scope.

## Phases

**Phase Numbering:**
- Phase 0 establishes the audit harness baseline.
- Phases 1-6 create the inventory, gate, repo-specific plans, reviewer surface plan, and release schedule.
- Each phase contains multiple numbered plans using the `NN-XX-PLAN.md` convention.
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
**Plans**: 3 plans

Plans:
- [ ] 00-01: `.planning/phases/phase-0-quality-runner-readiness/00-01-PLAN.md` - Capability inventory
- [ ] 00-02: `.planning/phases/phase-0-quality-runner-readiness/00-02-PLAN.md` - Smoke baseline
- [ ] 00-03: `.planning/phases/phase-0-quality-runner-readiness/00-03-PLAN.md` - Interpretation policy

### Phase 1: Candidate Repo Inventory and Scoring Matrix
**Goal**: Produce a source-of-truth inventory for all candidate repos.
**Depends on**: Phase 0.
**Requirements**: [ISR-01, ISR-02, ISR-05, ISR-07, ISR-08]
**Success Criteria**:
  1. Product repos, BBDSE subprojects, and Quality Runner are listed with path, remote, visibility, branch, and worktree state.
  2. Each repo has initial maturity, risk, available-gate, and presentation scores.
  3. Existing dirty worktrees and active branches are called out before cleanup planning.
**Plans**: 3 plans

Plans:
- [ ] 01-01: `.planning/phases/phase-1-candidate-inventory/01-01-PLAN.md` - Candidate repo fact inventory
- [ ] 01-02: `.planning/phases/phase-1-candidate-inventory/01-02-PLAN.md` - Candidate risk and asset scan
- [ ] 01-03: `.planning/phases/phase-1-candidate-inventory/01-03-PLAN.md` - Candidate scoring matrix

### Phase 2: Public-Readiness Gate Template
**Goal**: Define the reusable gate every repo must pass before promotion.
**Depends on**: Phase 1.
**Requirements**: [ISR-01, ISR-02, ISR-06, ISR-10, ISR-12]
**Success Criteria**:
  1. The gate includes Quality Runner, manual security/data review, README/visual review, metadata review, and local quality commands.
  2. The gate distinguishes `pass`, `blocker`, `warning`, and `not applicable`.
  3. The gate can be applied to TypeScript apps, Python packages, data projects, and case-study-only products.
**Plans**: 3 plans

Plans:
- [ ] 02-01: `.planning/phases/phase-2-public-readiness-gate/02-01-PLAN.md` - Gate result model and audit template
- [ ] 02-02: `.planning/phases/phase-2-public-readiness-gate/02-02-PLAN.md` - Quality command matrix
- [ ] 02-03: `.planning/phases/phase-2-public-readiness-gate/02-03-PLAN.md` - Manual review and publish rules

### Phase 3: BBDSE Release-Train Plans
**Goal**: Create independent release plans for BBDSE parent and nested subprojects.
**Depends on**: Phase 2.
**Requirements**: [ISR-01, ISR-02, ISR-08, ISR-11, ISR-12]
**Success Criteria**:
  1. Each BBDSE subproject has a release classification and blocker list.
  2. CSV/parquet/report artifacts have explicit data provenance review tasks.
  3. Planning-first subprojects are framed honestly if they remain public candidates.
**Plans**: 3 plans

Plans:
- [ ] 03-01: `.planning/phases/phase-3-bbdse-release-train/03-01-PLAN.md` - BBDSE structure and repo state audit
- [ ] 03-02: `.planning/phases/phase-3-bbdse-release-train/03-02-PLAN.md` - BBDSE data provenance review plan
- [ ] 03-03: `.planning/phases/phase-3-bbdse-release-train/03-03-PLAN.md` - BBDSE subproject release plans

### Phase 4: Product Repo Hardening Plans
**Goal**: Create per-repo hardening plans for the non-BBDSE product/source candidates.
**Depends on**: Phase 2.
**Requirements**: [ISR-01, ISR-02, ISR-05, ISR-10, ISR-12]
**Success Criteria**:
  1. Each target repo has a specific audit and cleanup plan.
  2. Quality Runner is planned as both a candidate repo and an audit harness.
  3. Sensitive or dirty repo states are not flattened into generic work.
**Plans**: 3 plans

Plans:
- [ ] 04-01: `.planning/phases/phase-4-product-hardening/04-01-PLAN.md` - Product repo quality audit plans
- [ ] 04-02: `.planning/phases/phase-4-product-hardening/04-02-PLAN.md` - Product README, metadata, and visual plans
- [ ] 04-03: `.planning/phases/phase-4-product-hardening/04-03-PLAN.md` - Product repo branch and commit protocol

### Phase 5: Portfolio and GitHub Profile Plan
**Goal**: Plan the reviewer-facing presentation layer.
**Depends on**: Phase 1.
**Requirements**: [ISR-01, ISR-02, ISR-09, ISR-13, ISR-14]
**Success Criteria**:
  1. Pinned repos, case studies, screenshots/mock visuals, and claims are mapped.
  2. Private products have case-study-safe presentation rules.
  3. GitHub profile and portfolio changes point reviewers to the strongest evidence.
**Plans**: 3 plans

Plans:
- [ ] 05-01: `.planning/phases/phase-5-reviewer-surface/05-01-PLAN.md` - Portfolio reviewer journey
- [ ] 05-02: `.planning/phases/phase-5-reviewer-surface/05-02-PLAN.md` - GitHub profile and pinned repo strategy
- [ ] 05-03: `.planning/phases/phase-5-reviewer-surface/05-03-PLAN.md` - Case study visual and claim-safety plan

### Phase 6: Tiered Release Schedule
**Goal**: Produce the final release schedule for future execution sessions.
**Depends on**: Phases 3, 4, and 5.
**Requirements**: [ISR-01, ISR-02, ISR-03, ISR-09, ISR-12, ISR-15]
**Success Criteria**:
  1. Each candidate is classified as `publish now`, `publish after cleanup`, or `case-study only`.
  2. The schedule orders work by public impact, risk, and dependency.
  3. Future sessions can execute one repo or phase at a time with clear stop conditions.
**Plans**: 3 plans

Plans:
- [ ] 06-01: `.planning/phases/phase-6-tiered-release-schedule/06-01-PLAN.md` - Final repo classification
- [ ] 06-02: `.planning/phases/phase-6-tiered-release-schedule/06-02-PLAN.md` - Release sprint schedule
- [ ] 06-03: `.planning/phases/phase-6-tiered-release-schedule/06-03-PLAN.md` - Release decision log and approval checklist

## Progress

**Execution Order:**
Phase 0 plans -> Phase 1 plans -> Phase 2 plans -> Phase 3/4/5 plans -> Phase 6 plans

| Phase | Plans Complete | Status | Completed |
| --- | --- | --- | --- |
| 0. Quality Runner Readiness Baseline | 0/3 | Ready | - |
| 1. Candidate Repo Inventory and Scoring Matrix | 0/3 | Blocked on Phase 0 | - |
| 2. Public-Readiness Gate Template | 0/3 | Blocked on Phase 1 | - |
| 3. BBDSE Release-Train Plans | 0/3 | Blocked on Phase 2 | - |
| 4. Product Repo Hardening Plans | 0/3 | Blocked on Phase 2 | - |
| 5. Portfolio and GitHub Profile Plan | 0/3 | Blocked on Phase 1 | - |
| 6. Tiered Release Schedule | 0/3 | Blocked on Phases 3-5 | - |

---
*Roadmap updated: 2026-07-01*
