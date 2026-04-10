# Roadmap: portfolio

## Overview

Bootstrap roadmap for taking this brownfield repo from current-state discovery to a clean, plan-ready execution baseline.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Correct Public Content** - Align the visible portfolio content with the current set of owned active projects.
- [ ] **Phase 2: Establish Release Baseline** - Verify the SPA is the authoritative implementation and get it ready for a clean merge.
- [ ] **Phase 3: Prepare Publish Path** - Document and close the final steps needed to publish from a clean branch.

## Phase Details

### Phase 1: Correct Public Content
**Goal**: Align the visible portfolio content with the current set of owned active projects.
**Depends on**: Nothing (first phase)
**Requirements**: [PORT-01]
**Success Criteria** (what must be TRUE):
  1. Active projects reflect the current owned set.
  2. Moved or non-owned projects are no longer presented as current work.
  3. The public-facing story is internally consistent.
**Plans**: 2 plans

Plans:
- [ ] 01-01: Audit and correct project content
- [ ] 01-02: Capture follow-up content decisions

### Phase 2: Establish Release Baseline
**Goal**: Verify the SPA is the authoritative implementation and get it ready for a clean merge.
**Depends on**: Phase 1
**Requirements**: [PORT-02, PORT-03]
**Success Criteria** (what must be TRUE):
  1. Build validation is green.
  2. The authoritative implementation is clear.
  3. The remaining release blockers are explicit instead of implicit.
**Plans**: 2 plans

Plans:
- [ ] 02-01: Run build and type baseline
- [ ] 02-02: Resolve release-surface ambiguities

### Phase 3: Prepare Publish Path
**Goal**: Document and close the final steps needed to publish from a clean branch.
**Depends on**: Phase 2
**Requirements**: [PORT-04]
**Success Criteria** (what must be TRUE):
  1. The repo has an explicit publish path.
  2. Outstanding deployment questions are captured for execution.
  3. The next GSD plan can focus on shipping rather than discovery.
**Plans**: 2 plans

Plans:
- [ ] 03-01: Document publish path
- [ ] 03-02: Queue deployment and cleanup work

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Correct Public Content | 0/2 | Not started | - |
| 2. Establish Release Baseline | 0/2 | Not started | - |
| 3. Prepare Publish Path | 0/2 | Not started | - |
