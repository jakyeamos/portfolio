#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const args = new Set(process.argv.slice(2));
const allowNonMain =
  args.has('--allow-non-main') || process.env.PORTFOLIO_ALLOW_NON_MAIN_REFRESH === '1';
const expectedBranch = process.env.PORTFOLIO_MAIN_BRANCH ?? 'main';
const deployWaitSeconds = process.env.NETLIFY_DEPLOY_WAIT_SECONDS ?? '300';

const currentBranch = runCapture('git', ['branch', '--show-current']);
if (!allowNonMain && currentBranch !== expectedBranch) {
  console.error(
    `Refusing weekly main refresh from branch ${currentBranch || '(detached)'}; expected ${expectedBranch}.`,
  );
  console.error('Use --allow-non-main only for local dry-run validation.');
  process.exit(1);
}

run('pnpm', ['sync']);
run('pnpm', ['lint']);
run('pnpm', ['build']);
ensureCleanRefresh();

const expectedCommit = runCapture('git', ['rev-parse', 'HEAD']);
run('node', [resolve(ROOT, 'scripts/netlify-deploy-status.mjs')], {
  NETLIFY_EXPECTED_COMMIT: expectedCommit,
  NETLIFY_PRODUCTION_BRANCH: expectedBranch,
  NETLIFY_DEPLOY_WAIT_SECONDS: deployWaitSeconds,
});

function run(command, args, env = {}) {
  const result = spawnSync(command, args, {
    cwd: ROOT,
    env: { ...process.env, ...env },
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function runCapture(command, args) {
  const result = spawnSync(command, args, {
    cwd: ROOT,
    env: process.env,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }

  return result.stdout.trim();
}

function ensureCleanRefresh() {
  const status = runCapture('git', ['status', '--porcelain']);
  if (!status) {
    return;
  }

  console.error('Weekly tracker refresh left uncommitted changes.');
  console.error('Commit and push the refreshed tracker state before verifying Netlify production.');
  console.error(status);
  process.exit(1);
}
