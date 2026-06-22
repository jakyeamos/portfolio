#!/usr/bin/env node

const token = process.env.NETLIFY_AUTH_TOKEN;
const siteId = process.env.NETLIFY_SITE_ID;
const expectedCommit = process.env.NETLIFY_EXPECTED_COMMIT;

if (!token || !siteId) {
  console.error('Missing NETLIFY_AUTH_TOKEN or NETLIFY_SITE_ID.');
  console.error('Set both env vars to check the latest Netlify deploy without using the Netlify CLI.');
  process.exit(2);
}

const url = new URL(`https://api.netlify.com/api/v1/sites/${siteId}/deploys`);
url.searchParams.set('per_page', '1');

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

const [deploy] = await response.json();

if (!deploy) {
  console.error(`No deploys found for Netlify site ${siteId}.`);
  process.exit(1);
}

const commitRef = deploy.commit_ref ?? deploy.commit_sha ?? null;
const summary = {
  id: deploy.id,
  state: deploy.state,
  branch: deploy.branch,
  commitRef,
  deployUrl: deploy.deploy_url,
  sslUrl: deploy.ssl_url,
  createdAt: deploy.created_at,
  publishedAt: deploy.published_at,
};

console.log(JSON.stringify(summary, null, 2));

if (expectedCommit && commitRef && !commitRef.startsWith(expectedCommit)) {
  console.error(`Latest deploy commit ${commitRef} does not match expected ${expectedCommit}.`);
  process.exit(1);
}

if (deploy.state !== 'ready') {
  console.error(`Latest deploy is not ready: ${deploy.state}.`);
  process.exit(1);
}
