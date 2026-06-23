import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/pages/CurrentProjects.tsx', import.meta.url), 'utf8');
const strictTarget = process.argv.includes('--target=45');
const youtubeIdPattern = /^[\w-]{11}$/;
const vimeoIdPattern = /^\d+$/;
const providers = new Map();
const shots = [];
let currentZone = null;
let currentShot = null;

for (const line of source.split('\n')) {
  const zoneMatch = line.match(/^  ([a-zA-Z]+): \[$/);
  if (zoneMatch) {
    currentZone = zoneMatch[1];
    continue;
  }

  const shotMatch = line.match(/^      id: '([^']+)',/);
  if (shotMatch && currentZone) {
    currentShot = {
      id: shotMatch[1],
      zone: currentZone,
      segment: '',
    };
    shots.push(currentShot);
    continue;
  }

  if (!currentShot) continue;

  currentShot.segment += `${line}\n`;

  if (line === '    },') currentShot = null;
}

const missing = [];
const unverified = [];
const invalid = [];
const zonesWithoutEmbeds = new Set(shots.map((shot) => shot.zone));

for (const shot of shots) {
  const provider = shot.segment.match(/provider: '([^']+)'/)?.[1];
  const id = shot.segment.match(/^\s+id: '([^']+)',/m)?.[1];
  const url = shot.segment.match(/url: '([^']+)'/)?.[1];
  const quality = shot.segment.match(/level: '([^']+)'/)?.[1];
  const reviewedAt = shot.segment.match(/reviewedAt: '([^']+)'/)?.[1];

  if (!provider) {
    missing.push(`${shot.zone}/${shot.id}`);
    continue;
  }

  if (quality !== 'verified-game-clip' || !reviewedAt) {
    unverified.push(`${shot.zone}/${shot.id}`);
    continue;
  }

  providers.set(provider, (providers.get(provider) ?? 0) + 1);
  zonesWithoutEmbeds.delete(shot.zone);

  if (provider === 'youtube' && (!id || !youtubeIdPattern.test(id))) {
    invalid.push(`${shot.zone}/${shot.id}: invalid YouTube id ${id ?? '(missing)'}`);
  }

  if (provider === 'vimeo' && (!id || !vimeoIdPattern.test(id))) {
    invalid.push(`${shot.zone}/${shot.id}: invalid Vimeo id ${id ?? '(missing)'}`);
  }

  if ((provider === 'nba' || provider === 'external') && (!url || !URL.canParse(url))) {
    invalid.push(`${shot.zone}/${shot.id}: invalid ${provider} url ${url ?? '(missing)'}`);
  }
}

const verified = shots.length - missing.length - unverified.length;
const providerSummary = [...providers.entries()]
  .sort(([left], [right]) => left.localeCompare(right))
  .map(([provider, count]) => `${provider}=${count}`)
  .join(' ');

console.log(`Historic shots: ${verified}/${shots.length} have quality-gated provider clips.`);
console.log(`Providers: ${providerSummary || 'none'}`);

if (missing.length > 0) {
  console.log(`Reference-only shots: ${missing.length}`);
  for (const item of missing) console.log(`- ${item}`);
}

if (unverified.length > 0) {
  console.log(`Provider clips missing quality review: ${unverified.length}`);
  for (const item of unverified) console.log(`- ${item}`);
}

if (invalid.length > 0) {
  console.error(`Invalid clip references: ${invalid.length}`);
  for (const item of invalid) console.error(`- ${item}`);
}

if (zonesWithoutEmbeds.size > 0) {
  console.error(`Zones without any clip source: ${[...zonesWithoutEmbeds].join(', ')}`);
}

if (strictTarget && verified !== shots.length) {
  console.error(`Target gate failed: ${verified}/${shots.length} quality-gated clips.`);
}

if (invalid.length > 0 || zonesWithoutEmbeds.size > 0 || (strictTarget && verified !== shots.length)) process.exit(1);
