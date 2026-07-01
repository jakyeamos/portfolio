# portfolio

## What This Is

Personal portfolio site and cross-repo control plane for the public interview surface.
The site remains the reviewer-facing map, while this planning workspace coordinates
repo-by-repo public-readiness work across product repos, BBDSE subprojects, and
Quality Runner.

## Current Milestone

**Interview Surface Public Readiness**

Make mature work safe, explainable, and credible as an interview surface. Every
source-public repo should pass a repeatable public-readiness gate before being
promoted, and every private or sensitive product should be represented through a
case study rather than exposed by default.

## Core Value

Hiring reviewers should be able to move from the portfolio to GitHub and quickly
see strong product judgment, clean code, quality evidence, safe data handling,
and honest ownership claims.

## Active Requirements

- Create GSD-style phase plans before repo hardening begins.
- Use Quality Runner as an audit aid and as a candidate project in the release train.
- Treat BBDSE as a multi-repo release train with independent subproject gates.
- Use a tiered release model: `publish now`, `publish after cleanup`, or `case-study only`.
- Preserve existing dirty worktrees and feature branches in candidate repos.

## Out of Scope

- Changing repository visibility during the planning milestone.
- Editing candidate product repos before their phase plan is reviewed.
- Treating Quality Runner as the only gate; manual review remains required.
- Publishing private business-sensitive products such as BidCamp or CrimClock without a separate approval.

## Context

Candidate public-source work spans product apps, tooling, research packages, and
data-heavy BBDSE subprojects. Some repos are already public but under-merchandised;
others are private and need code, data, secret, and README review before exposure.
Several candidate repos are on active feature branches or have dirty generated
state, so release work must be isolated and committed in coherent units.

Quality Runner is a pre-release local-first audit-and-plan tool. It can inspect a
target repo, detect quality capabilities, write `.quality-runner/` artifacts, and
produce audit/remediation outputs without editing source files. It should be used
as a standard input to public-readiness decisions where supported, but its current
v1 boundary means human review still owns secrets, data provenance, claims, and
publish decisions.

## Key Decisions

| Decision | Rationale | Outcome |
| --- | --- | --- |
| Use the portfolio repo as the control plane | The portfolio is the reviewer-facing map and already has planning/tracker state | Cross-repo public-readiness plans live here first |
| Start with GSD-style phase plans | The release train is too large for one execution run | Phase plans are the first deliverable |
| Use Quality Runner as a bar, not the whole bar | It provides repeatable audit artifacts but cannot replace judgment on secrets, data, and claims | Public-readiness gates combine Quality Runner and manual checks |
| Treat BBDSE as a release train | BBDSE contains independent nested repos with different maturity/data risk | Each subproject gets its own classification and blocker list |
| Use tiered release | Visible progress matters, but only passed repos should be promoted | Repos classify as `publish now`, `publish after cleanup`, or `case-study only` |

---
*Last updated: 2026-07-01 for the Interview Surface Public Readiness milestone*
