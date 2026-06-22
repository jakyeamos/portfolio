---
schemaVersion: 1
projectName: RemodelVision
summary: AI-powered renovation planning capstone where users upload room photos, generate remodel visuals, and receive cost estimates through a Next.js, Prisma, Clerk, Supabase, fal.ai, and Claude Vision stack.
healthScore: 73
statusLabel: needs_attention
nextStep: "Finish launch hardening: production room workflow UX, persisted session history, itemized estimate display, external-service retry states, and demo/UAT smoke coverage."
blockers:
  - "Full deterministic line-item estimates still depend on seeded base-cost and regional-multiplier data being wired into the UX."
  - "The main remodel studio does not yet complete a fully polished production save flow with itemized estimates and retry/error handling."
  - "Launch confidence still needs authenticated endpoint hardening, startup env validation, smoke coverage, and documented demo readiness."
lastUpdated: 2026-06-22
tags:
  - remodel
  - nextjs
  - prisma
  - clerk
  - fal-ai
  - claude-vision
areas:
  - room-upload
  - ai-visualization
  - cost-estimation
  - saved-projects
  - launch-hardening
goals:
  - Let homeowners upload a room photo and receive a realistic renovation visualization
  - Provide explainable renovation cost estimates for budgeting and contractor conversations
  - Ship a demo-ready senior capstone with honest prototype framing
repoType: app
sourceOfTruth: portfolio-local
primaryLanguage: TypeScript
activeBranch: unknown
lastCommitDate: "2026-04-20"
quality:
  lint: unknown
  types: pass
  tests: pass
  smoke: unknown
  deadCode: unknown
  structure: pass
canonicalCommands:
  install: pnpm install
  dev: pnpm dev
  lint: npx tsc --noEmit
  typecheck: npx tsc --noEmit
  test: npx vitest run
  deadcode: unknown
agentExpectationsVersion: 1
---

## Current State

RemodelVision is a functional prototype/capstone for AI-assisted renovation planning. The documented app includes a signed-out landing page, authenticated saved-remodel dashboard, read-only project detail pages, room image upload, before/after transformation through fal.ai, Claude Vision cost-impact analysis, and experimental agent routing.

The planning docs identify the most complete implementation branch as `codex/jakyeamos-dev` and describe the remaining critical path as production room workflow UX, estimate presentation/trust, rendering iteration, and launch hardening. Public framing should label the project as a strong prototype rather than a production-ready consumer product.

## Risks

The main risk is overclaiming the cost-estimation and production workflow maturity. The schema and backend pieces exist, but the README still calls out incomplete deterministic line-item estimates, incomplete full save flow polish, whole-home aggregation gaps, and launch hardening needs.

## Evidence

- `/Users/jakyeamos/projects/remodelvision/README.md`
- `/Users/jakyeamos/projects/remodelvision/.planning/PROJECT.md`
- `/Users/jakyeamos/projects/docs/project-packets/projects/remodelvision.md`
