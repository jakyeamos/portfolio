export type BuildThreatKind = 'bug' | 'incident' | 'regression';
export type BuildThreatFlight = 'formation' | 'diving' | 'returning';

export interface BuildThreatDefinition {
  code: string;
  label: string;
  kind: BuildThreatKind;
  color: string;
}

export const BUILD_THREATS: readonly BuildThreatDefinition[] = [
  { code: 'BG', label: 'BUG', kind: 'bug', color: '#ff6b5e' },
  { code: 'IN', label: 'INCIDENT', kind: 'incident', color: '#f2c14e' },
  { code: 'RG', label: 'REGRESSION', kind: 'regression', color: '#61a6ff' },
];

export type RandomSource = () => number;

export interface BuildShipPlayer {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  cooldownMs: number;
  invulnerableUntil: number;
}

export interface BuildThreatState {
  id: number;
  definition: BuildThreatDefinition;
  x: number;
  y: number;
  homeX: number;
  homeY: number;
  width: number;
  height: number;
  flight: BuildThreatFlight;
  vx: number;
  vy: number;
}

export interface BuildShipBullet {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  velocityY: number;
}

export interface BuildShipEnemyShot {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  velocityY: number;
}

export interface BuildShipLaser {
  id: number;
  x: number;
  width: number;
  remainingMs: number;
}

export interface BuildPressureLane {
  x: number;
  width: number;
  warningMs: number;
  activeMs: number;
  fired: boolean;
}

export interface BuildShipState {
  width: number;
  height: number;
  level: number;
  score: number;
  lives: number;
  highScore: number;
  elapsedMs: number;
  gameOver: boolean;
  player: BuildShipPlayer;
  threats: BuildThreatState[];
  playerBullets: BuildShipBullet[];
  enemyShots: BuildShipEnemyShot[];
  lasers: BuildShipLaser[];
  pressureLane: BuildPressureLane | null;
  nextId: number;
  waveOffset: number;
  waveDirection: -1 | 1;
  waveSpeed: number;
  diveTimerMs: number;
  enemyFireTimerMs: number;
  pressureTimerMs: number;
}

export interface BuildShipStepEvents {
  playerHit: boolean;
  enemyHit: boolean;
  waveCleared: boolean;
  levelUp: boolean;
  gameOver: boolean;
}

export interface BuildShipStateOptions {
  width: number;
  height: number;
  level?: number;
  highScore?: number;
  random?: RandomSource;
}

const PLAYER_WIDTH = 34;
const PLAYER_HEIGHT = 24;
const PLAYER_BOTTOM_GAP = 54;
const THREAT_WIDTH = 32;
const THREAT_HEIGHT = 22;
const PLAYER_BULLET_SPEED = 560;
const ENEMY_SHOT_SPEED = 210;
const LASER_WIDTH = 26;
const INVULNERABILITY_MS = 1600;

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum);
}

function normalizedRandom(random: RandomSource): number {
  return clamp(random(), 0, 0.999999);
}

function nextIdentifier(state: Pick<BuildShipState, 'nextId'>): number {
  const identifier = state.nextId;
  state.nextId += 1;
  return identifier;
}

function createWave(
  state: Pick<BuildShipState, 'width' | 'level' | 'nextId'>,
  random: RandomSource,
): BuildThreatState[] {
  const columns = clamp(Math.floor((state.width - 40) / 46), 5, 9);
  const rows = Math.min(5, 3 + Math.floor((state.level - 1) / 2));
  const gap = columns > 1 ? Math.min(46, (state.width - 46) / (columns - 1)) : 0;
  const formationWidth = gap * (columns - 1);
  const startX = (state.width - formationWidth) / 2;
  const threats: BuildThreatState[] = [];

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const definition =
        BUILD_THREATS[
          (row +
            column +
            state.level +
            Math.floor(normalizedRandom(random) * BUILD_THREATS.length)) %
            BUILD_THREATS.length
        ];
      const homeX = startX + column * gap;
      const homeY = 62 + row * 32;

      threats.push({
        id: nextIdentifier(state),
        definition,
        x: homeX,
        y: homeY,
        homeX,
        homeY,
        width: THREAT_WIDTH,
        height: THREAT_HEIGHT,
        flight: 'formation',
        vx: 0,
        vy: 0,
      });
    }
  }

  return threats;
}

export function createBuildShipState(options: BuildShipStateOptions): BuildShipState {
  const width = Math.max(280, options.width);
  const height = Math.max(420, options.height);
  const level = Math.max(1, Math.floor(options.level ?? 1));
  const state: BuildShipState = {
    width,
    height,
    level,
    score: 0,
    lives: 3,
    highScore: Math.max(0, Math.floor(options.highScore ?? 0)),
    elapsedMs: 0,
    gameOver: false,
    player: {
      x: width / 2,
      y: height - PLAYER_BOTTOM_GAP,
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
      speed: 340,
      cooldownMs: 0,
      invulnerableUntil: 0,
    },
    threats: [],
    playerBullets: [],
    enemyShots: [],
    lasers: [],
    pressureLane: null,
    nextId: 1,
    waveOffset: 0,
    waveDirection: 1,
    waveSpeed: 32 + level * 5,
    diveTimerMs: 1350,
    enemyFireTimerMs: 900,
    pressureTimerMs: 2100,
  };

  state.threats = createWave(state, options.random ?? Math.random);
  return state;
}

export function resizeBuildShip(state: BuildShipState, width: number, height: number): void {
  state.width = Math.max(280, width);
  state.height = Math.max(420, height);
  state.player.x = clamp(
    state.player.x,
    state.player.width / 2,
    state.width - state.player.width / 2,
  );
  state.player.y = state.height - PLAYER_BOTTOM_GAP;
}

export function moveBuildShipPlayer(
  state: BuildShipState,
  direction: -1 | 0 | 1,
  deltaMs: number,
): void {
  if (state.gameOver || direction === 0) return;

  const distance = state.player.speed * (Math.max(0, deltaMs) / 1000);
  state.player.x = clamp(
    state.player.x + direction * distance,
    state.player.width / 2,
    state.width - state.player.width / 2,
  );
}

export function fireBuildShip(state: BuildShipState): boolean {
  if (state.gameOver || state.player.cooldownMs > 0) return false;

  state.playerBullets.push({
    id: nextIdentifier(state),
    x: state.player.x,
    y: state.player.y - state.player.height / 2,
    width: 3,
    height: 12,
    velocityY: PLAYER_BULLET_SPEED,
  });
  state.player.cooldownMs = 230;
  return true;
}

function overlaps(
  first: { x: number; y: number; width: number; height: number },
  second: { x: number; y: number; width: number; height: number },
): boolean {
  return (
    Math.abs(first.x - second.x) * 2 < first.width + second.width &&
    Math.abs(first.y - second.y) * 2 < first.height + second.height
  );
}

function addScore(state: BuildShipState, points: number): void {
  state.score += points;
  state.highScore = Math.max(state.highScore, state.score);
}

function loseLife(state: BuildShipState): boolean {
  if (state.elapsedMs < state.player.invulnerableUntil || state.gameOver) return false;

  state.lives -= 1;
  state.player.invulnerableUntil = state.elapsedMs + INVULNERABILITY_MS;
  state.player.x = state.width / 2;
  state.enemyShots = [];

  if (state.lives <= 0) {
    state.gameOver = true;
  }

  return true;
}

function updateFormation(state: BuildShipState, deltaSeconds: number): void {
  const formationThreats = state.threats.filter((threat) => threat.flight === 'formation');
  if (formationThreats.length === 0) return;

  const nextOffset = state.waveOffset + state.waveDirection * state.waveSpeed * deltaSeconds;
  const leftEdge = Math.min(
    ...formationThreats.map((threat) => threat.homeX + nextOffset - threat.width / 2),
  );
  const rightEdge = Math.max(
    ...formationThreats.map((threat) => threat.homeX + nextOffset + threat.width / 2),
  );

  if (leftEdge < 20 || rightEdge > state.width - 20) {
    state.waveDirection = state.waveDirection === 1 ? -1 : 1;
    state.waveOffset = clamp(
      nextOffset,
      20 - Math.min(...formationThreats.map((threat) => threat.homeX - threat.width / 2)),
      state.width -
        20 -
        Math.max(...formationThreats.map((threat) => threat.homeX + threat.width / 2)),
    );
    for (const threat of formationThreats) {
      threat.homeY += 11;
    }
  } else {
    state.waveOffset = nextOffset;
  }

  for (const threat of formationThreats) {
    threat.x = threat.homeX + state.waveOffset;
    threat.y = threat.homeY;
  }
}

function updateDivingThreats(state: BuildShipState, deltaSeconds: number): void {
  for (const threat of state.threats) {
    if (threat.flight === 'diving') {
      threat.x += threat.vx * deltaSeconds;
      threat.y += threat.vy * deltaSeconds;
      if (threat.y > state.height * 0.54) {
        threat.flight = 'returning';
      }
      continue;
    }

    if (threat.flight !== 'returning') continue;

    const targetX = threat.homeX + state.waveOffset;
    const targetY = threat.homeY;
    threat.x += (targetX - threat.x) * Math.min(1, deltaSeconds * 4);
    threat.y += (targetY - threat.y) * Math.min(1, deltaSeconds * 4);
    if (Math.abs(targetX - threat.x) < 2 && Math.abs(targetY - threat.y) < 2) {
      threat.x = targetX;
      threat.y = targetY;
      threat.flight = 'formation';
    }
  }
}

function updatePressureLane(state: BuildShipState, deltaMs: number, random: RandomSource): void {
  state.pressureTimerMs -= deltaMs;

  if (!state.pressureLane && state.pressureTimerMs <= 0) {
    const laneCount = Math.max(3, Math.floor(state.width / 72));
    const lane = Math.floor(normalizedRandom(random) * laneCount);
    const laneWidth = state.width / laneCount;
    state.pressureLane = {
      x: lane * laneWidth + laneWidth / 2,
      width: LASER_WIDTH,
      warningMs: 700,
      activeMs: 460,
      fired: false,
    };
    state.pressureTimerMs = Math.max(1400, 2600 - state.level * 90);
  }

  const lane = state.pressureLane;
  if (!lane) return;

  const previousWarning = lane.warningMs;
  lane.warningMs -= deltaMs;
  if (!lane.fired && previousWarning > 0 && lane.warningMs <= 0) {
    lane.fired = true;
    state.lasers.push({
      id: nextIdentifier(state),
      x: lane.x,
      width: lane.width,
      remainingMs: lane.activeMs,
    });
  }

  if (lane.warningMs <= 0) lane.activeMs -= deltaMs;
  if (lane.activeMs <= 0) state.pressureLane = null;
}

function updateEnemyShots(state: BuildShipState, deltaMs: number, random: RandomSource): void {
  state.enemyFireTimerMs -= deltaMs;
  if (state.enemyFireTimerMs <= 0) {
    const shooters = state.threats.filter((threat) => threat.flight !== 'returning');
    if (shooters.length > 0) {
      const shooter = shooters[Math.floor(normalizedRandom(random) * shooters.length)];
      state.enemyShots.push({
        id: nextIdentifier(state),
        x: shooter.x,
        y: shooter.y + shooter.height / 2,
        width: 5,
        height: 14,
        velocityY: ENEMY_SHOT_SPEED + state.level * 16,
      });
    }
    state.enemyFireTimerMs = Math.max(480, 1120 - state.level * 55);
  }

  const deltaSeconds = deltaMs / 1000;
  for (const shot of state.enemyShots) {
    shot.y += shot.velocityY * deltaSeconds;
  }
  state.enemyShots = state.enemyShots.filter((shot) => shot.y < state.height + 30);
}

function updateLasers(state: BuildShipState, deltaMs: number): void {
  for (const laser of state.lasers) laser.remainingMs -= deltaMs;
  state.lasers = state.lasers.filter((laser) => laser.remainingMs > 0);
}

function resolvePlayerBullets(state: BuildShipState, events: BuildShipStepEvents): void {
  const remainingBullets: BuildShipBullet[] = [];

  for (const bullet of state.playerBullets) {
    let hitThreat = false;
    for (const threat of state.threats) {
      if (!overlaps(bullet, threat)) continue;

      hitThreat = true;
      state.threats = state.threats.filter((candidate) => candidate.id !== threat.id);
      addScore(state, 100 + state.level * 25);
      events.enemyHit = true;
      break;
    }

    if (!hitThreat && bullet.y > -30) remainingBullets.push(bullet);
  }

  state.playerBullets = remainingBullets;
}

function resolvePlayerDamage(state: BuildShipState, events: BuildShipStepEvents): void {
  const playerHitbox = {
    x: state.player.x,
    y: state.player.y,
    width: state.player.width * 0.8,
    height: state.player.height * 0.8,
  };

  const enemyShotHit = state.enemyShots.some((shot) => overlaps(playerHitbox, shot));
  const divingThreatHit = state.threats.some(
    (threat) => threat.flight === 'diving' && overlaps(playerHitbox, threat),
  );
  const laserHit = state.lasers.some((laser) =>
    overlaps(playerHitbox, {
      x: laser.x,
      y: state.player.y,
      width: laser.width,
      height: state.height,
    }),
  );

  if (!enemyShotHit && !divingThreatHit && !laserHit) return;
  events.playerHit = loseLife(state);
}

function startNextLevel(state: BuildShipState, random: RandomSource): void {
  state.level += 1;
  addScore(state, 250 * state.level);
  state.threats = createWave(state, random);
  state.waveOffset = 0;
  state.waveDirection = 1;
  state.waveSpeed = 32 + state.level * 5;
  state.diveTimerMs = Math.max(650, 1350 - state.level * 45);
  state.enemyFireTimerMs = Math.max(450, 900 - state.level * 30);
  state.pressureLane = null;
  state.lasers = [];
}

export function stepBuildShip(
  state: BuildShipState,
  deltaMs: number,
  random: RandomSource = Math.random,
): BuildShipStepEvents {
  const events: BuildShipStepEvents = {
    playerHit: false,
    enemyHit: false,
    waveCleared: false,
    levelUp: false,
    gameOver: state.gameOver,
  };
  if (state.gameOver) return events;

  const safeDeltaMs = clamp(deltaMs, 0, 50);
  const deltaSeconds = safeDeltaMs / 1000;
  state.elapsedMs += safeDeltaMs;
  state.player.cooldownMs = Math.max(0, state.player.cooldownMs - safeDeltaMs);
  updateFormation(state, deltaSeconds);
  updateDivingThreats(state, deltaSeconds);

  state.diveTimerMs -= safeDeltaMs;
  if (state.diveTimerMs <= 0) {
    const availableThreats = state.threats.filter((threat) => threat.flight === 'formation');
    if (availableThreats.length > 0) {
      const threat =
        availableThreats[Math.floor(normalizedRandom(random) * availableThreats.length)];
      threat.flight = 'diving';
      threat.vx = (normalizedRandom(random) - 0.5) * 130;
      threat.vy = 132 + state.level * 12;
    }
    state.diveTimerMs = Math.max(650, 1550 - state.level * 80);
  }

  updatePressureLane(state, safeDeltaMs, random);
  updateEnemyShots(state, safeDeltaMs, random);
  updateLasers(state, safeDeltaMs);
  for (const bullet of state.playerBullets) bullet.y -= bullet.velocityY * deltaSeconds;
  resolvePlayerBullets(state, events);
  resolvePlayerDamage(state, events);

  if (state.threats.length === 0 && !state.gameOver) {
    events.waveCleared = true;
    events.levelUp = true;
    startNextLevel(state, random);
  }

  events.gameOver = state.gameOver;
  return events;
}

export function createSeededRandom(seed: number): RandomSource {
  let value = Math.max(1, Math.floor(seed)) >>> 0;

  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

export function getBuildShipBounds(state: BuildShipState): { minimum: number; maximum: number } {
  return {
    minimum: state.player.width / 2,
    maximum: state.width - state.player.width / 2,
  };
}
