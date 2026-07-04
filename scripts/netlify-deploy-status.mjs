#!/usr/bin/env node

const token = process.env.NETLIFY_AUTH_TOKEN;
const siteId = process.env.NETLIFY_SITE_ID;
const options = parseOptions(process.argv.slice(2));
const expectedCommit = options.expectedCommit ?? process.env.NETLIFY_EXPECTED_COMMIT;
const productionBranch =
  options.productionBranch ?? process.env.NETLIFY_PRODUCTION_BRANCH ?? 'main';
const productionContext = options.context ?? process.env.NETLIFY_DEPLOY_CONTEXT ?? 'production';
const waitSeconds = parsePositiveInteger(
  options.waitSeconds ?? process.env.NETLIFY_DEPLOY_WAIT_SECONDS,
  0,
);
const pollIntervalSeconds = parsePositiveInteger(
  options.pollIntervalSeconds ?? process.env.NETLIFY_DEPLOY_POLL_INTERVAL_SECONDS,
  15,
);

if (!token || !siteId) {
  console.error('Missing NETLIFY_AUTH_TOKEN or NETLIFY_SITE_ID.');
  console.error(
    'Set both env vars to check the latest Netlify deploy without using the Netlify CLI.',
  );
  process.exit(2);
}

const deadline = Date.now() + waitSeconds * 1000;

while (true) {
  const { deploy, selectionReason } = await fetchLatestProductionDeploy();

  if (!deploy) {
    await failOrPoll(`No production deploys found for Netlify site ${siteId}.`);
    continue;
  }

  const commitRef = deploy.commit_ref ?? deploy.commit_sha ?? null;
  const summary = {
    id: deploy.id,
    state: deploy.state,
    context: deploy.context,
    branch: deploy.branch,
    productionBranch,
    commitRef,
    deployUrl: deploy.deploy_url,
    sslUrl: deploy.ssl_url,
    createdAt: deploy.created_at,
    publishedAt: deploy.published_at,
    selectionReason,
  };

  console.log(JSON.stringify(summary, null, 2));

  const validationError = getValidationError(deploy, commitRef);
  if (!validationError) {
    break;
  }

  await failOrPoll(validationError);
}

function parseOptions(args) {
  const parsed = {};

  for (const arg of args) {
    const [rawName, rawValue] = arg.split('=', 2);
    if (!rawName.startsWith('--')) continue;

    const name = rawName.slice(2);
    if (name === 'expected-commit') parsed.expectedCommit = rawValue;
    if (name === 'production-branch') parsed.productionBranch = rawValue;
    if (name === 'context') parsed.context = rawValue;
    if (name === 'wait-seconds') parsed.waitSeconds = rawValue;
    if (name === 'poll-interval-seconds') parsed.pollIntervalSeconds = rawValue;
  }

  return parsed;
}

function parsePositiveInteger(raw, fallback) {
  const parsed = Number.parseInt(raw ?? '', 10);
  if (Number.isNaN(parsed) || parsed < 0) {
    return fallback;
  }
  return parsed;
}

async function fetchLatestProductionDeploy() {
  const url = new URL(`https://api.netlify.com/api/v1/sites/${siteId}/deploys`);
  url.searchParams.set('per_page', '25');

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const body = await response.text();
    console.error(`Netlify deploy lookup failed: ${response.status} ${response.statusText}`);
    if (body) console.error(body.slice(0, 1000));
    process.exit(1);
  }

  const deploys = await response.json();
  const contextDeploy = deploys.find((deploy) => deploy.context === productionContext);
  if (contextDeploy) {
    return { deploy: contextDeploy, selectionReason: `context:${productionContext}` };
  }

  const branchDeploy = deploys.find((deploy) => deploy.branch === productionBranch);
  if (branchDeploy) {
    return { deploy: branchDeploy, selectionReason: `branch:${productionBranch}` };
  }

  return { deploy: null, selectionReason: null };
}

function getValidationError(deploy, commitRef) {
  if (deploy.branch && deploy.branch !== productionBranch) {
    return `Latest production deploy is for branch ${deploy.branch}, not ${productionBranch}.`;
  }

  if (deploy.state !== 'ready') {
    return `Latest production deploy is not ready: ${deploy.state}.`;
  }

  if (expectedCommit && !commitRef) {
    return `Latest production deploy has no commit ref; expected ${expectedCommit}.`;
  }

  if (expectedCommit && commitRef && !commitsMatch(commitRef, expectedCommit)) {
    return `Latest production deploy commit ${commitRef} does not match expected ${expectedCommit}.`;
  }

  return null;
}

function commitsMatch(actual, expected) {
  return actual.startsWith(expected) || expected.startsWith(actual);
}

async function failOrPoll(message) {
  if (Date.now() >= deadline) {
    console.error(message);
    process.exit(1);
  }

  console.error(`${message} Polling again in ${pollIntervalSeconds}s.`);
  await new Promise((resolve) => setTimeout(resolve, pollIntervalSeconds * 1000));
}
