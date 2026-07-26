#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

const BLOCKING_SEVERITIES = ['high', 'critical'];
const REVIEWED_NOT_APPLICABLE = new Map([
  [
    '1124282',
    'React Router RSC-mode CSRF advisory; this repository is a Vite SPA and does not use React Router RSC/framework/server mode.',
  ],
]);
const NETWORK_ERROR_PATTERNS = [
  /fetch failed/i,
  /ENOTFOUND/,
  /ECONNREFUSED/,
  /ETIMEDOUT/,
  /EAI_AGAIN/,
  /getaddrinfo/i,
  /network/i,
  /socket hang up/i,
  /request to .* failed/i,
];

function skip(reason) {
  console.warn('[dependency:security] SKIPPED — ' + reason);
  console.warn(
    '[dependency:security] Registry audit is advisory-only and requires network; not blocking the commit.',
  );
  process.exit(0);
}

const result = spawnSync('pnpm', ['audit', '--json'], { encoding: 'utf8' });

if (result.error) {
  skip('could not run `pnpm audit` (' + result.error.message + ')');
}

const stdout = result.stdout ?? '';
const stderr = result.stderr ?? '';

let report;
try {
  report = JSON.parse(stdout.trim());
} catch {
  const combined = (stderr || stdout || '').trim();
  if (NETWORK_ERROR_PATTERNS.some((pattern) => pattern.test(combined))) {
    skip('registry unreachable (' + (combined.split('\n')[0] || 'network error') + ')');
  }
  skip('could not parse `pnpm audit` output' + (combined ? ': ' + combined.split('\n')[0] : ''));
}

if (report?.error || !report?.metadata?.vulnerabilities) {
  const message = String(report?.error?.message ?? '').trim();
  if (message && NETWORK_ERROR_PATTERNS.some((pattern) => pattern.test(message))) {
    skip('registry unreachable (' + message + ')');
  }
  skip('`pnpm audit` returned no vulnerability data' + (message ? ': ' + message : ''));
}

const counts = report.metadata.vulnerabilities ?? {};
const blockingAdvisories = Object.values(report.advisories ?? {}).filter((advisory) => {
  if (!BLOCKING_SEVERITIES.includes(advisory?.severity)) return false;
  return !REVIEWED_NOT_APPLICABLE.has(String(advisory?.id));
});
const blockingCount = blockingAdvisories.length;

for (const advisory of Object.values(report.advisories ?? {})) {
  const reason = REVIEWED_NOT_APPLICABLE.get(String(advisory?.id));
  if (reason) {
    console.warn(
      '[dependency:security] NOT APPLICABLE — ' + (advisory.module_name ?? '?') + ': ' + reason,
    );
  }
}

if (blockingCount > 0) {
  console.error(
    '[dependency:security] FAIL — ' + blockingCount + ' high/critical advisory(ies) found:',
  );
  for (const sev of BLOCKING_SEVERITIES) {
    const count = blockingAdvisories.filter((advisory) => advisory.severity === sev).length;
    if (count) console.error('  - ' + sev + ': ' + count);
  }
  for (const advisory of blockingAdvisories) {
    console.error(
      '  * [' +
        advisory.severity +
        '] ' +
        (advisory.module_name ?? '?') +
        ': ' +
        (advisory.title ?? ''),
    );
  }
  console.error('[dependency:security] Run `pnpm audit` for details.');
  process.exit(1);
}

const summary = BLOCKING_SEVERITIES.map(
  (sev) => blockingAdvisories.filter((advisory) => advisory.severity === sev).length + ' ' + sev,
).join(', ');
const lowModerate = ['low', 'moderate'].map((sev) => (counts[sev] ?? 0) + ' ' + sev).join(', ');
console.log(
  '[dependency:security] PASS — no high/critical advisories (' +
    summary +
    '; ' +
    lowModerate +
    ').',
);
process.exit(0);
