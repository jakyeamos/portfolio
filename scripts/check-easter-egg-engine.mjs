#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import ts from 'typescript';

const root = resolve(import.meta.dirname, '..');
const engineSource = readFileSync(
  resolve(root, 'src/features/easter-eggs/buildShipEngine.ts'),
  'utf8',
);
const storageSource = readFileSync(resolve(root, 'src/features/easter-eggs/storage.ts'), 'utf8');
const transpiled = ts.transpileModule(engineSource, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const transpiledStorage = ts.transpileModule(storageSource, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const engine = await import(
  `data:text/javascript;base64,${Buffer.from(transpiled).toString('base64')}`
);
const storage = await import(
  `data:text/javascript;base64,${Buffer.from(transpiledStorage).toString('base64')}`
);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const fixedRandom = () => 0.25;
const state = engine.createBuildShipState({ width: 640, height: 520, random: fixedRandom });
assert(state.threats.length === 27, 'wave creation should produce a deterministic first wave');

engine.moveBuildShipPlayer(state, -1, 10_000);
const bounds = engine.getBuildShipBounds(state);
assert(state.player.x === bounds.minimum, 'player movement must stop at the left bound');
engine.moveBuildShipPlayer(state, 1, 10_000);
assert(state.player.x === bounds.maximum, 'player movement must stop at the right bound');

assert(engine.fireBuildShip(state), 'the first shot should fire');
assert(!engine.fireBuildShip(state), 'shots should respect the firing cadence');
for (let index = 0; index < 5; index += 1) engine.stepBuildShip(state, 50, fixedRandom);
assert(engine.fireBuildShip(state), 'the firing cadence should reopen after cooldown');

const collisionState = engine.createBuildShipState({
  width: 640,
  height: 520,
  random: fixedRandom,
});
const target = collisionState.threats[0];
collisionState.playerBullets.push({
  id: 900,
  x: target.x,
  y: target.y,
  width: 3,
  height: 12,
  velocityY: 560,
});
const collisionEvents = engine.stepBuildShip(collisionState, 0, fixedRandom);
assert(collisionEvents.enemyHit, 'player bullets should resolve threat collisions');
assert(collisionState.score > 0, 'a resolved collision should add score');

const damageState = engine.createBuildShipState({ width: 640, height: 520, random: fixedRandom });
damageState.enemyShots.push({
  id: 901,
  x: damageState.player.x,
  y: damageState.player.y,
  width: 5,
  height: 14,
  velocityY: 0,
});
const firstDamage = engine.stepBuildShip(damageState, 0, fixedRandom);
assert(firstDamage.playerHit && damageState.lives === 2, 'a hit should remove one life');
damageState.enemyShots.push({
  id: 902,
  x: damageState.player.x,
  y: damageState.player.y,
  width: 5,
  height: 14,
  velocityY: 0,
});
const invulnerableDamage = engine.stepBuildShip(damageState, 0, fixedRandom);
assert(
  !invulnerableDamage.playerHit && damageState.lives === 2,
  'invulnerability should prevent chained life loss',
);

const levelState = engine.createBuildShipState({ width: 640, height: 520, random: fixedRandom });
levelState.threats = [];
const levelEvents = engine.stepBuildShip(levelState, 0, fixedRandom);
assert(levelEvents.levelUp && levelState.level === 2, 'clearing a wave should progress the level');

const laserState = engine.createBuildShipState({ width: 640, height: 520, random: fixedRandom });
laserState.pressureTimerMs = 0;
engine.stepBuildShip(laserState, 1, fixedRandom);
assert(laserState.pressureLane !== null, 'pressure lanes should enter a warning state');
for (let index = 0; index < 16; index += 1) engine.stepBuildShip(laserState, 50, fixedRandom);
assert(laserState.lasers.length > 0, 'pressure warnings should become laser lanes');

assert(storage.updateHighScore(1200, 900) === 1200, 'high score should keep the larger run');
assert(storage.updateHighScore(400, 900) === 900, 'high score should not regress');

console.log('[PASS] deterministic Build Ship engine checks');
