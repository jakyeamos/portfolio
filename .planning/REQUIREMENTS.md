# Requirements: Interview Surface Public Readiness

**Defined:** 2026-07-01
**Core Value:** Hiring reviewers should see a public surface backed by safe repos,
clean code, strong evidence, and honest project presentation.

## v1 Requirements

### Planning Control Plane

- [ ] **ISR-01**: The portfolio repo contains multiple numbered GSD-style plans per phase for the full public-readiness release train before candidate repo work begins.
- [ ] **ISR-02**: Each numbered plan names target repos, audit commands or planning inputs, Quality Runner usage where relevant, cleanup criteria, verification gates, commit strategy, and publish/no-publish decision rules where relevant.
- [ ] **ISR-03**: The planning state preserves a tiered release model: `publish now`, `publish after cleanup`, or `case-study only`.

### Quality Runner Baseline

- [ ] **ISR-04**: Quality Runner's current audit boundary is documented before it is used as a standard gate for other repos.
- [ ] **ISR-05**: Quality Runner is included as a candidate project in the public-readiness inventory.
- [ ] **ISR-06**: Public-readiness decisions combine Quality Runner output with manual checks for secrets, data provenance, claims, README quality, visuals, and GitHub metadata.

### Candidate Inventory

- [ ] **ISR-07**: Candidate product repos are inventoried with local path, remote, visibility, worktree state, maturity, risk, available gates, and public-readiness classification.
- [ ] **ISR-08**: BBDSE parent and nested subprojects are inventoried independently because each subproject has separate source, data, and maturity risk.
- [ ] **ISR-09**: Sensitive products are kept case-study-first unless a later explicit approval clears source-public release.

### Public-Readiness Gate

- [ ] **ISR-10**: Every source-public candidate has a gate covering secrets, provider artifacts, data provenance, README quality, visuals, GitHub metadata, license/status, quality commands, and branch hygiene.
- [ ] **ISR-11**: Data-heavy BBDSE subprojects require source/license manifests before public release.
- [ ] **ISR-12**: A repo cannot be promoted as interview-ready unless gate results are documented and blockers are explicit.

### Reviewer Surface

- [ ] **ISR-13**: The portfolio and GitHub profile plan explains how reviewers should navigate pinned repos, case studies, quality evidence, ownership claims, and repo status.
- [ ] **ISR-14**: Mocked case-study visuals are allowed for private products only when clearly presented as case-study visuals.
- [ ] **ISR-15**: The final release schedule orders work so passed repos can go public without waiting for blocked repos.

## Out of Scope

| Feature | Reason |
| --- | --- |
| Changing repo visibility during planning | Visibility changes require repo-specific gate evidence and explicit approval. |
| Editing candidate repo source during planning | Candidate hardening starts only after phase plans are reviewed. |
| Replacing manual review with Quality Runner alone | Quality Runner v1 cannot fully judge data licensing, claims, ownership, or product sensitivity. |
| Publishing private business-sensitive repos by default | BidCamp, CrimClock, and similar products need separate source-public approval. |

## Traceability

| Requirement | Phase | Status |
| --- | --- | --- |
| ISR-01 | Phase 0-6 | Pending |
| ISR-02 | Phase 0-6 | Pending |
| ISR-03 | Phase 6 | Pending |
| ISR-04 | Phase 0 | Pending |
| ISR-05 | Phase 1, Phase 4 | Pending |
| ISR-06 | Phase 2 | Pending |
| ISR-07 | Phase 1 | Pending |
| ISR-08 | Phase 1, Phase 3 | Pending |
| ISR-09 | Phase 5, Phase 6 | Pending |
| ISR-10 | Phase 2 | Pending |
| ISR-11 | Phase 3 | Pending |
| ISR-12 | Phase 6 | Pending |
| ISR-13 | Phase 5 | Pending |
| ISR-14 | Phase 5 | Pending |
| ISR-15 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 15 total
- Mapped to phases: 15
- Unmapped: 0

---
*Requirements defined: 2026-07-01*
