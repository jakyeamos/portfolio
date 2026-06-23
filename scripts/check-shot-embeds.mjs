import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/pages/CurrentProjects.tsx', import.meta.url), 'utf8');
const zonePattern = /^  ([a-zA-Z]+): \[([\s\S]*?)^  \],/gm;
const objectPattern = /\{\n([\s\S]*?)\n    \}/g;
const fieldPattern = /^\s+([a-zA-Z]+): '([^']*)',/gm;
const youtubeIdPattern = /^[\w-]{11}$/;

let total = 0;
let embedded = 0;
const missing = [];
const invalid = [];
const zonesWithoutEmbeds = [];

for (const zoneMatch of source.matchAll(zonePattern)) {
  const [, zone, body] = zoneMatch;
  let zoneEmbedded = 0;

  for (const objectMatch of body.matchAll(objectPattern)) {
    const fields = Object.fromEntries(
      [...objectMatch[1].matchAll(fieldPattern)].map(([, key, value]) => [key, value]),
    );

    if (!fields.id) continue;

    total += 1;

    if (!fields.youtubeId) {
      missing.push(`${zone}/${fields.id}`);
      continue;
    }

    embedded += 1;
    zoneEmbedded += 1;

    if (!youtubeIdPattern.test(fields.youtubeId)) {
      invalid.push(`${zone}/${fields.id}: ${fields.youtubeId}`);
    }
  }

  if (zoneEmbedded === 0) zonesWithoutEmbeds.push(zone);
}

console.log(`Historic shots: ${embedded}/${total} have YouTube embed IDs.`);

if (missing.length > 0) {
  console.log(`Reference-only shots: ${missing.length}`);
  for (const item of missing) console.log(`- ${item}`);
}

if (invalid.length > 0) {
  console.error(`Invalid YouTube IDs: ${invalid.length}`);
  for (const item of invalid) console.error(`- ${item}`);
}

if (zonesWithoutEmbeds.length > 0) {
  console.error(`Zones without any embeddable shot: ${zonesWithoutEmbeds.join(', ')}`);
}

if (invalid.length > 0 || zonesWithoutEmbeds.length > 0) process.exit(1);
