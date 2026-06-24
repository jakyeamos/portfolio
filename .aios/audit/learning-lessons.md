# Gate Learning Lessons

## Active repeated failure patterns

### Pattern: changed lines lacked coverage
- Seen: 4 times
- Gates: Pre-CR
- Category: test
- Common cause: Implementation changed covered behavior before focused tests covered the changed lines.
- Avoid by: Run focused tests with coverage before Pre-CR; changed lines must be covered or intentionally classified.
- Example fix: Add or update focused tests and coverage configuration for the changed lines.

### Pattern: Pre-CR changed-line readiness failed
- Seen: 5 times
- Gates: Pre-CR
- Category: test
- Common cause: The change reached commit readiness before Pre-CR coverage/setup requirements were satisfied.
- Avoid by: Run focused tests with coverage before committing changed source lines.
- Example fix: Pre-CR changed-line coverage failed: 0% < threshold 80%.

### Pattern: AIOS allowlisted quality gate failed
- Seen: 5 times
- Gates: AIOS
- Category: unknown
- Common cause: An AIOS-controlled project quality command failed during the commit gate.
- Avoid by: Run the AIOS allowlisted quality gate locally before committing.
- Example fix: test_quality failed: pnpm dependency:security failed: > front-office-amos@0.0.0 dependency:security /Users/jakyeamos/projects/portfolio. test_quality fixes must preserve or improve behavior coverage; delete tests only when they are proven obsolete, redundant with stronger coverage, or pure noise.

### Pattern: changed lines lacked coverage
- Seen: 6 times
- Gates: Pre-CR
- Category: test
- Common cause: Implementation changed covered behavior before focused tests covered the changed lines.
- Avoid by: Run focused tests with coverage before Pre-CR; changed lines must be covered or intentionally classified.
- Example fix: Add or update focused tests and coverage configuration for the changed lines.

## Current repo-specific rules learned from gate history

- Run focused tests with coverage before Pre-CR; changed lines must be covered or intentionally classified.
- Run focused tests with coverage before committing changed source lines.
- Run the AIOS allowlisted quality gate locally before committing.
- Verify Pre-CR setup before relying on the readiness result.

## High-priority agent reminders

- Run the AIOS allowlisted quality gate locally before committing.
- Run focused tests with coverage before Pre-CR; changed lines must be covered or intentionally classified.
- Run focused tests with coverage before committing changed source lines.
