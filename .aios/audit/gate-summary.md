# Gate Audit Summary

## Current run outcome

- Outcome: blocked

## Gate decisions

- Pre-CR force_iteration [error]: Pre-CR blocked commit: Pre-CR changed-line coverage failed: 0% < threshold 80%. (.pre-cr.json)
- AIOS block [error]: AIOS blocked commit: pre_cr failed: pre-cr run --json --workspace /Users/jakyeamos/projects/portfolio failed: { (.aios-quality-gate.json)
- Pre-CR force_iteration [error]: Pre-CR forced iteration: 3.8% changed-line coverage below 80% or unsupported surfaces were present. (.aios-quality-gate.json, .aios-quality-gate.json, .aios-quality-gate.json, .aios-quality-gate.json, .aios-quality-gate.json, .aios-quality-gate.json, .aios-quality-gate.json, .aios-quality-gate.json, .aios-quality-gate.json, .aios-quality-gate.json)
- Pre-CR force_iteration [error]: Pre-CR forced iteration: 3.8% changed-line coverage below 80% or unsupported surfaces were present. (.aios-quality-gate.json, .aios-quality-gate.json, .aios-quality-gate.json, .aios-quality-gate.json, .aios-quality-gate.json, .aios-quality-gate.json, .aios-quality-gate.json, .aios-quality-gate.json, .aios-quality-gate.json, .aios-quality-gate.json)
- Pre-CR force_iteration [error]: Pre-CR blocked commit: Pre-CR changed-line coverage failed: 3.8% < threshold 80%. (.pre-cr.json)
- AIOS block [error]: AIOS blocked commit: pre_cr failed: pre-cr run --json --workspace /Users/jakyeamos/projects/portfolio failed: { (.aios-quality-gate.json)
- Pre-CR force_iteration [error]: Pre-CR forced iteration: 46.8% changed-line coverage below 80% or unsupported surfaces were present. (.aios-quality-gate.json, .aios-quality-gate.json, .aios-quality-gate.json, .aios-quality-gate.json, .aios-quality-gate.json, .aios-quality-gate.json, .aios-quality-gate.json, .aios-quality-gate.json, .aios-quality-gate.json, .aios-quality-gate.json)
- Pre-CR force_iteration [error]: Pre-CR forced iteration: 46.8% changed-line coverage below 80% or unsupported surfaces were present. (.aios-quality-gate.json, .aios-quality-gate.json, .aios-quality-gate.json, .aios-quality-gate.json, .aios-quality-gate.json, .aios-quality-gate.json, .aios-quality-gate.json, .aios-quality-gate.json, .aios-quality-gate.json, .aios-quality-gate.json)
- Pre-CR force_iteration [error]: Pre-CR blocked commit: Pre-CR changed-line coverage failed: 46.8% < threshold 80%. (.pre-cr.json)
- AIOS block [error]: AIOS blocked commit: pre_cr failed: pre-cr run --json --workspace /Users/jakyeamos/projects/portfolio failed: { (.aios-quality-gate.json)

## Repeated failure patterns

- changed lines lacked coverage (4 event(s), Pre-CR, test, fingerprint `2b7bfbb9a52b01ab86b93298`)
- Pre-CR changed-line readiness failed (5 event(s), Pre-CR, test, fingerprint `ed355812a5d3090f14a93b51`)
- AIOS allowlisted quality gate failed (5 event(s), AIOS, unknown, fingerprint `329665034bc1b054c6daed99`)
- changed lines lacked coverage (6 event(s), Pre-CR, test, fingerprint `9efacdc63685a4f44760861c`)

## Agent learning lessons

- Run focused tests with coverage before Pre-CR; changed lines must be covered or intentionally classified.
- Run focused tests with coverage before committing changed source lines.
- Run the AIOS allowlisted quality gate locally before committing.
- Verify Pre-CR setup before relying on the readiness result.

## Commit-readiness status

- not ready to commit
