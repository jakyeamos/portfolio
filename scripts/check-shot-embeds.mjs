import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = readFileSync(new URL('../src/pages/CurrentProjects.tsx', import.meta.url), 'utf8');
const { CURRENT_PROJECTS, CLOSED_PROJECTS } = await importTypescriptModule(
  '../src/content/currentProjects.ts',
);
const currentProjects = CURRENT_PROJECTS.map(toShotProject);
const closedProjects = CLOSED_PROJECTS.map(toShotProject);
const allProjects = [...currentProjects, ...closedProjects];
const strictTarget = process.argv.some((arg) => arg.startsWith('--target='));
const showInventory = process.argv.includes('--inventory');
const youtubeIdPattern = /^[\w-]{11}$/;
const vimeoIdPattern = /^\d+$/;
const maxYouTubeWindowSeconds = 38;
const axes = ['impact', 'difficulty', 'ambition', 'creativity'];
const providers = new Map();
const shots = readHistoricShotPools(source);

async function importTypescriptModule(relativePath) {
  const sourceText = readFileSync(new URL(relativePath, import.meta.url), 'utf8');
  const compiled = ts.transpileModule(sourceText, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
  });
  const moduleUrl = `data:text/javascript;base64,${Buffer.from(compiled.outputText).toString('base64')}`;
  return import(moduleUrl);
}

function toShotProject(project) {
  return {
    slug: project.slug,
    trackerScore: project.trackerScore,
    trackerStatus: project.trackerStatus,
    grades: project.grades,
  };
}

function readHistoricShotPools(sourceText) {
  const sourceFile = ts.createSourceFile(
    'CurrentProjects.tsx',
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  let initializer = null;

  function visit(node) {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === 'HISTORIC_SHOT_POOLS'
    ) {
      initializer = unwrapExpression(node.initializer);
      return;
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  if (!initializer || !ts.isObjectLiteralExpression(initializer)) {
    throw new Error('Could not parse HISTORIC_SHOT_POOLS from CurrentProjects.tsx');
  }

  const parsedShots = [];

  for (const zoneProperty of initializer.properties) {
    if (!ts.isPropertyAssignment(zoneProperty)) continue;

    const zone = propertyNameToString(zoneProperty.name);
    const zoneInitializer = unwrapExpression(zoneProperty.initializer);
    if (!zone || !zoneInitializer || !ts.isArrayLiteralExpression(zoneInitializer)) continue;

    for (const element of zoneInitializer.elements) {
      const shotObject = unwrapExpression(element);
      if (!shotObject || !ts.isObjectLiteralExpression(shotObject)) continue;

      const id = readStringProperty(shotObject, 'id');
      if (!id) continue;

      parsedShots.push({
        id,
        zone,
        embed: readEmbed(shotObject),
        quality: readQuality(shotObject),
      });
    }
  }

  return parsedShots;
}

function unwrapExpression(expression) {
  if (!expression) return null;
  if (ts.isAsExpression(expression) || ts.isSatisfiesExpression(expression)) {
    return unwrapExpression(expression.expression);
  }
  return expression;
}

function propertyNameToString(name) {
  if (ts.isIdentifier(name)) return name.text;
  if (ts.isStringLiteral(name) || ts.isNumericLiteral(name)) return name.text;
  return null;
}

function findProperty(objectLiteral, fieldName) {
  return objectLiteral.properties.find(
    (property) =>
      ts.isPropertyAssignment(property) && propertyNameToString(property.name) === fieldName,
  );
}

function readStringProperty(objectLiteral, fieldName) {
  const initializer = unwrapExpression(findProperty(objectLiteral, fieldName)?.initializer);
  if (!initializer) return undefined;
  if (ts.isStringLiteral(initializer) || ts.isNoSubstitutionTemplateLiteral(initializer)) {
    return initializer.text;
  }
  return undefined;
}

function readNumberProperty(objectLiteral, fieldName) {
  const initializer = unwrapExpression(findProperty(objectLiteral, fieldName)?.initializer);
  if (!initializer || !ts.isNumericLiteral(initializer)) return undefined;
  return Number(initializer.text);
}

function readObjectProperty(objectLiteral, fieldName) {
  const initializer = unwrapExpression(findProperty(objectLiteral, fieldName)?.initializer);
  if (!initializer || !ts.isObjectLiteralExpression(initializer)) return undefined;
  return initializer;
}

function readEmbed(shotObject) {
  const embedObject = readObjectProperty(shotObject, 'embed');
  if (!embedObject) return undefined;

  return {
    provider: readStringProperty(embedObject, 'provider'),
    id: readStringProperty(embedObject, 'id'),
    url: readStringProperty(embedObject, 'url'),
    start: readNumberProperty(embedObject, 'start'),
    end: readNumberProperty(embedObject, 'end'),
  };
}

function readQuality(shotObject) {
  const qualityObject = readObjectProperty(shotObject, 'quality');
  if (!qualityObject) return undefined;

  return {
    level: readStringProperty(qualityObject, 'level'),
    reviewedAt: readStringProperty(qualityObject, 'reviewedAt'),
  };
}

const missing = [];
const unverified = [];
const invalid = [];
const zonesWithoutEmbeds = new Set(shots.map((shot) => shot.zone));

for (const shot of shots) {
  const provider = shot.embed?.provider;
  const id = shot.embed?.id;
  const url = shot.embed?.url;
  const start = shot.embed?.start ?? 0;
  const end = shot.embed?.end ?? 0;
  const quality = shot.quality?.level;
  const reviewedAt = shot.quality?.reviewedAt;

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

  if (
    provider === 'youtube' &&
    (shot.embed?.start === undefined || shot.embed?.end === undefined)
  ) {
    invalid.push(`${shot.zone}/${shot.id}: missing explicit YouTube start/end window`);
  }

  if (provider === 'youtube' && end <= start) {
    invalid.push(`${shot.zone}/${shot.id}: invalid YouTube window ${start}-${end}`);
  }

  if (provider === 'youtube' && end - start > maxYouTubeWindowSeconds) {
    invalid.push(
      `${shot.zone}/${shot.id}: YouTube window ${end - start}s exceeds ${maxYouTubeWindowSeconds}s compact clip limit`,
    );
  }

  if (provider === 'vimeo' && (!id || !vimeoIdPattern.test(id))) {
    invalid.push(`${shot.zone}/${shot.id}: invalid Vimeo id ${id ?? '(missing)'}`);
  }

  if ((provider === 'nba' || provider === 'external') && (!url || !URL.canParse(url))) {
    invalid.push(`${shot.zone}/${shot.id}: invalid ${provider} url ${url ?? '(missing)'}`);
  }
}

const verified = shots.length - missing.length - unverified.length;
const shotIdsByZone = Map.groupBy(shots, (shot) => shot.zone);
const assignmentDuplicates = findAssignmentDuplicates();
const rimRangeMismatches = findRimRangeMismatches();
const requiredAssignmentMismatches = findRequiredAssignmentMismatches();
const providerSummary = [...providers.entries()]
  .sort(([left], [right]) => left.localeCompare(right))
  .map(([provider, count]) => `${provider}=${count}`)
  .join(' ');

console.log(`Historic shots: ${verified}/${shots.length} have quality-gated provider clips.`);
console.log(`Providers: ${providerSummary || 'none'}`);
console.log(`Assignment duplicates: ${assignmentDuplicates.length}`);
console.log(`Rim-range zone mismatches: ${rimRangeMismatches.length}`);
console.log(`Required assignment mismatches: ${requiredAssignmentMismatches.length}`);

if (showInventory) printAssignmentInventory();

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

if (assignmentDuplicates.length > 0) {
  console.error(`Reused visible clip assignments: ${assignmentDuplicates.length}`);
  for (const item of assignmentDuplicates) console.error(`- ${item}`);
}

if (rimRangeMismatches.length > 0) {
  console.error(`Rim-range assignment mismatches: ${rimRangeMismatches.length}`);
  for (const item of rimRangeMismatches) console.error(`- ${item}`);
}

if (requiredAssignmentMismatches.length > 0) {
  console.error(`Required shot assignment mismatches: ${requiredAssignmentMismatches.length}`);
  for (const item of requiredAssignmentMismatches) console.error(`- ${item}`);
}

if (zonesWithoutEmbeds.size > 0) {
  console.error(`Zones without any clip source: ${[...zonesWithoutEmbeds].join(', ')}`);
}

if (strictTarget && verified !== shots.length) {
  console.error(`Target gate failed: ${verified}/${shots.length} quality-gated clips.`);
}

if (
  invalid.length > 0 ||
  assignmentDuplicates.length > 0 ||
  rimRangeMismatches.length > 0 ||
  requiredAssignmentMismatches.length > 0 ||
  zonesWithoutEmbeds.size > 0 ||
  (strictTarget && verified !== shots.length)
)
  process.exit(1);

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getShotCoordinates(project, axis) {
  const health = project.trackerScore / 100;
  const axisGrade = project.grades[axis];
  const eliteLift = Math.max(0, axisGrade - 8) ** 1.35;
  const baselineGrade = Math.min(axisGrade, 8);
  const verticalScore = (baselineGrade - 5) * 7.2 + eliteLift * 13;
  const difficultyPressure = (project.grades.difficulty - 5.5) / 10;
  const creativeSpread = (project.grades.creativity - project.grades.impact) / 10;
  const statusDrag =
    project.trackerStatus === 'on_track'
      ? 0.03
      : project.trackerStatus === 'stalled'
        ? -0.06
        : -0.02;

  return {
    left: clamp(14 + health * 72 + creativeSpread * 7 + statusDrag * 100, 8, 92),
    top: clamp(72 - verticalScore + difficultyPressure * 4, 8, 90),
  };
}

function normalizeCourtPoints(points) {
  const leftValues = points.map((point) => point.left);
  const topValues = points.map((point) => point.top);
  const minLeft = Math.min(...leftValues);
  const maxLeft = Math.max(...leftValues);
  const minTop = Math.min(...topValues);
  const maxTop = Math.max(...topValues);
  const leftRange = maxLeft - minLeft;
  const topRange = maxTop - minTop;

  return points.map((point) => ({
    left: leftRange < 1 ? 50 : 10 + ((point.left - minLeft) / leftRange) * 80,
    top: topRange < 1 ? 48 : 8 + ((point.top - minTop) / topRange) * 80,
  }));
}

function markerSizeForProject(project) {
  return 14 + project.grades.ambition;
}

function buildCourtLayout(projects, axis) {
  const normalizedPoints = normalizeCourtPoints(
    projects.map((project) => getShotCoordinates(project, axis)),
  );
  const points = projects.map((project, index) => ({
    project,
    markerSize: markerSizeForProject(project),
    ...normalizedPoints[index],
  }));

  for (let pass = 0; pass < 24; pass += 1) {
    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        const a = points[i];
        const b = points[j];
        const dx = b.left - a.left;
        const dy = b.top - a.top;
        const distance = Math.hypot(dx, dy) || 0.01;
        const minDistance = 8 + (a.markerSize + b.markerSize) / 32;

        if (distance >= minDistance) continue;

        const push = (minDistance - distance) / 2;
        const nx = dx / distance;
        const ny = dy / distance;

        a.left = clamp(a.left - nx * push, 7, 93);
        a.top = clamp(a.top - ny * push, 7, 91);
        b.left = clamp(b.left + nx * push, 7, 93);
        b.top = clamp(b.top + ny * push, 7, 91);
      }
    }
  }

  return points.map(({ project, left, top }) => ({ project, point: { left, top } }));
}

function getThreePointArcTop(left) {
  const arcX = clamp(left, 7, 93);
  const dx = arcX - 50;
  return 96 - Math.sqrt(Math.max(0, 43 ** 2 - dx ** 2));
}

function getHistoricShotZone(point) {
  const isOutsideArc =
    point.left <= 7 || point.left >= 93
      ? point.top <= 77
      : point.top <= getThreePointArcTop(point.left);
  const isDeep = point.top <= 30;
  const isCornerDepth = point.top >= 62;
  const isRimRange = point.top >= 82 && point.left >= 34 && point.left <= 66;

  if (isRimRange) return 'rim';
  if (!isOutsideArc) return 'midrange';
  if (isCornerDepth && point.left >= 84) return 'rightCorner';
  if (isCornerDepth && point.left <= 16) return 'leftBaselineWing';
  if (isDeep && point.left < 42) return 'deepLeft';
  if (isDeep && point.left >= 42 && point.left <= 58) return 'deepTop';

  return 'aboveBreak';
}

function assignShot(project, point, layout, usedShotIds = new Set()) {
  const zone = getHistoricShotZone(point);
  const pool = (shotIdsByZone.get(zone) ?? []).map((shot) => shot.id);
  const zoneRank = layout
    .filter((candidate) => getHistoricShotZone(candidate.point) === zone)
    .findIndex((candidate) => candidate.project.slug === project.slug);
  const instanceIndex = Math.max(0, zoneRank);

  for (let offset = 0; offset < pool.length; offset += 1) {
    const shotId = pool[(instanceIndex + offset) % pool.length];
    if (!usedShotIds.has(shotId)) return { zone, shotId };
  }

  return { zone, shotId: pool[instanceIndex % pool.length] };
}

function findAssignmentDuplicates() {
  const duplicates = [];

  for (const axis of axes) {
    const currentOrdered = [...currentProjects].sort(
      (left, right) =>
        Math.round(right.grades[axis] * 7 + right.trackerScore * 0.3) -
        Math.round(left.grades[axis] * 7 + left.trackerScore * 0.3),
    );
    const currentLayout = buildCourtLayout(currentOrdered, axis);
    const allLayout = buildCourtLayout(allProjects, axis);
    const rows = [];
    const currentShotIds = new Set();

    for (const item of currentLayout) {
      const assignment = assignShot(item.project, item.point, currentLayout);
      currentShotIds.add(assignment.shotId);
      rows.push({ axis, project: item.project.slug, scope: 'current', ...assignment });
    }

    for (const project of closedProjects) {
      const item = allLayout.find((candidate) => candidate.project.slug === project.slug);
      if (!item) continue;
      const assignment = assignShot(item.project, item.point, allLayout, currentShotIds);
      currentShotIds.add(assignment.shotId);
      rows.push({ axis, project: item.project.slug, scope: 'closed', ...assignment });
    }

    for (const [shotId, assignments] of Map.groupBy(rows, (row) => row.shotId)) {
      if (assignments.length <= 1) continue;
      duplicates.push(
        `${axis}/${shotId}: ${assignments.map((item) => `${item.project}/${item.scope}/${item.zone}`).join(', ')}`,
      );
    }
  }

  return duplicates;
}

function isRimRange(point) {
  return point.top >= 82 && point.left >= 34 && point.left <= 66;
}

function findRimRangeMismatches() {
  return axes.flatMap((axis) =>
    getAssignmentRows(axis)
      .filter((row) => isRimRange(row.point) && row.zone !== 'rim')
      .map(
        (row) =>
          `${axis}/${row.project} at ${row.point.left.toFixed(1)},${row.point.top.toFixed(1)} assigned ${row.zone}/${row.shotId}; expected rim`,
      ),
  );
}

function findRequiredAssignmentMismatches() {
  const requiredAssignments = [
    {
      axis: 'impact',
      project: 'dispatches',
      shotId: 'edwards-collins-2024',
      zone: 'rim',
    },
  ];

  return requiredAssignments.flatMap((required) => {
    const row = getAssignmentRows(required.axis).find(
      (candidate) => candidate.project === required.project,
    );

    if (!row) return [`${required.axis}/${required.project} missing from assignment inventory`];
    if (row.zone === required.zone && row.shotId === required.shotId) return [];

    return [
      `${required.axis}/${required.project} assigned ${row.zone}/${row.shotId} at ${row.point.left.toFixed(1)},${row.point.top.toFixed(1)}; expected ${required.zone}/${required.shotId}`,
    ];
  });
}

function getAssignmentRows(axis) {
  const currentOrdered = [...currentProjects].sort(
    (left, right) =>
      Math.round(right.grades[axis] * 7 + right.trackerScore * 0.3) -
      Math.round(left.grades[axis] * 7 + left.trackerScore * 0.3),
  );
  const currentLayout = buildCourtLayout(currentOrdered, axis);
  const allLayout = buildCourtLayout(allProjects, axis);
  const rows = [];
  const currentShotIds = new Set();

  for (const item of currentLayout) {
    const assignment = assignShot(item.project, item.point, currentLayout);
    currentShotIds.add(assignment.shotId);
    rows.push({
      axis,
      project: item.project.slug,
      scope: 'current',
      point: item.point,
      ...assignment,
    });
  }

  for (const project of closedProjects) {
    const item = allLayout.find((candidate) => candidate.project.slug === project.slug);
    if (!item) continue;
    const assignment = assignShot(item.project, item.point, allLayout, currentShotIds);
    currentShotIds.add(assignment.shotId);
    rows.push({
      axis,
      project: item.project.slug,
      scope: 'closed',
      point: item.point,
      ...assignment,
    });
  }

  return rows;
}

function printAssignmentInventory() {
  console.log('\nBackup inventory by axis and court zone:');

  for (const axis of axes) {
    const rows = getAssignmentRows(axis);
    const usedShotIds = new Set(rows.map((row) => row.shotId));
    console.log(`\n[${axis}] assigned=${rows.length} backups=${shots.length - usedShotIds.size}`);

    for (const [zone, zoneShots] of [...shotIdsByZone.entries()].sort(([left], [right]) =>
      left.localeCompare(right),
    )) {
      const assigned = rows
        .filter((row) => row.zone === zone)
        .map((row) => `${row.shotId}:${row.project}`);
      const backups = zoneShots.map((shot) => shot.id).filter((shotId) => !usedShotIds.has(shotId));

      console.log(`  ${zone}`);
      console.log(`    assigned (${assigned.length}): ${assigned.join(', ') || 'none'}`);
      console.log(`    backups (${backups.length}): ${backups.join(', ') || 'none'}`);
    }
  }
}
