import { type PointerEvent, type ReactElement, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Flame, RotateCcw, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { playAudioCue } from './audio';
import {
  createBuildShipState,
  createSeededRandom,
  fireBuildShip,
  getBuildShipBounds,
  moveBuildShipPlayer,
  resizeBuildShip,
  stepBuildShip,
  type RandomSource,
  type BuildShipState,
} from './buildShipEngine';
import { readBuildShipHighScore, updateHighScore, writeBuildShipHighScore } from './storage';

interface BuildShipGameProps {
  soundEnabled: boolean;
  onClose: () => void;
  randomSource?: RandomSource;
}

interface GameSnapshot {
  score: number;
  level: number;
  lives: number;
  highScore: number;
  gameOver: boolean;
}

interface ControlState {
  left: boolean;
  right: boolean;
}

function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = (): void => setReducedMotion(mediaQuery.matches);
    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  return reducedMotion;
}

function drawThreat(context: CanvasRenderingContext2D, state: BuildShipState): void {
  for (const threat of state.threats) {
    const left = threat.x - threat.width / 2;
    const top = threat.y - threat.height / 2;
    context.save();
    context.translate(threat.x, threat.y);
    context.fillStyle = threat.definition.color;
    context.strokeStyle = '#f7f2e8';
    context.lineWidth = 1;

    if (threat.definition.kind === 'bug') {
      context.beginPath();
      context.arc(0, 0, threat.height * 0.45, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      context.fillStyle = '#07111f';
      context.fillRect(-8, -3, 4, 4);
      context.fillRect(4, -3, 4, 4);
      context.strokeStyle = threat.definition.color;
      context.beginPath();
      context.moveTo(-12, 9);
      context.lineTo(-17, 14);
      context.moveTo(12, 9);
      context.lineTo(17, 14);
      context.stroke();
    } else if (threat.definition.kind === 'incident') {
      context.beginPath();
      context.moveTo(0, -threat.height / 2);
      context.lineTo(threat.width / 2, 0);
      context.lineTo(0, threat.height / 2);
      context.lineTo(-threat.width / 2, 0);
      context.closePath();
      context.fill();
      context.stroke();
      context.fillStyle = '#07111f';
      context.font = '800 9px Inter Tight, sans-serif';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText('!', 0, 1);
    } else {
      context.fillRect(left - threat.x, top - threat.y, threat.width, threat.height);
      context.strokeRect(left - threat.x, top - threat.y, threat.width, threat.height);
      context.fillStyle = '#07111f';
      context.fillRect(-10, -5, 20, 3);
      context.fillRect(-6, 3, 12, 3);
    }

    context.restore();
    context.fillStyle = 'rgba(247,242,232,0.74)';
    context.font = '700 8px Inter Tight, sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'top';
    context.fillText(threat.definition.code, threat.x, threat.y + threat.height / 2 + 5);
  }
}

function drawBuildShipScene(
  context: CanvasRenderingContext2D,
  state: BuildShipState,
  reducedMotion: boolean,
): void {
  const { width, height } = state;
  context.clearRect(0, 0, width, height);
  context.fillStyle = '#07111f';
  context.fillRect(0, 0, width, height);

  context.strokeStyle = 'rgba(97,166,255,0.12)';
  context.lineWidth = 1;
  for (let x = 16; x < width; x += 48) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);
    context.stroke();
  }
  for (let y = 18; y < height; y += 48) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }

  for (let index = 0; index < 28; index += 1) {
    const x = (index * 83 + state.level * 17) % width;
    const baseY = (index * 47 + 22) % height;
    const drift = reducedMotion ? 0 : (state.elapsedMs / 80) * (index % 3);
    const y = (baseY + drift) % height;
    context.fillStyle = index % 4 === 0 ? 'rgba(242,193,78,0.7)' : 'rgba(247,242,232,0.4)';
    context.fillRect(x, y, index % 3 === 0 ? 2 : 1, index % 3 === 0 ? 2 : 1);
  }

  if (state.pressureLane) {
    const lane = state.pressureLane;
    const isWarning = lane.warningMs > 0;
    context.fillStyle = isWarning ? 'rgba(242,193,78,0.1)' : 'rgba(255,107,94,0.18)';
    context.fillRect(lane.x - lane.width / 2, 0, lane.width, height);
    context.strokeStyle = isWarning ? '#f2c14e' : '#ff6b5e';
    context.setLineDash(isWarning ? [6, 6] : []);
    context.lineWidth = isWarning ? 1 : 3;
    context.beginPath();
    context.moveTo(lane.x, 0);
    context.lineTo(lane.x, height);
    context.stroke();
    context.setLineDash([]);
  }

  for (const laser of state.lasers) {
    context.fillStyle = 'rgba(255,107,94,0.86)';
    context.fillRect(laser.x - laser.width / 2, 0, laser.width, height);
    context.fillStyle = 'rgba(255,255,255,0.8)';
    context.fillRect(laser.x - 1, 0, 2, height);
  }

  context.fillStyle = '#f2c14e';
  for (const bullet of state.playerBullets) {
    context.fillRect(
      bullet.x - bullet.width / 2,
      bullet.y - bullet.height / 2,
      bullet.width,
      bullet.height,
    );
  }
  context.fillStyle = '#ff6b5e';
  for (const shot of state.enemyShots) {
    context.fillRect(shot.x - shot.width / 2, shot.y - shot.height / 2, shot.width, shot.height);
  }

  drawThreat(context, state);

  const player = state.player;
  const invulnerable = state.elapsedMs < player.invulnerableUntil;
  context.save();
  context.translate(player.x, player.y);
  if (invulnerable && !reducedMotion) {
    context.globalAlpha = 0.55 + (Math.sin(state.elapsedMs / 45) + 1) * 0.2;
  } else if (invulnerable) {
    context.globalAlpha = 0.65;
  }
  context.fillStyle = '#f7f2e8';
  context.strokeStyle = '#61a6ff';
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(0, -player.height / 2);
  context.lineTo(player.width / 2, player.height / 2);
  context.lineTo(0, player.height / 4);
  context.lineTo(-player.width / 2, player.height / 2);
  context.closePath();
  context.fill();
  context.stroke();
  context.fillStyle = '#b50d0d';
  context.fillRect(-3, 1, 6, 8);
  context.restore();

  context.fillStyle = 'rgba(247,242,232,0.55)';
  context.font = '700 9px Inter Tight, sans-serif';
  context.textAlign = 'left';
  context.textBaseline = 'top';
  context.fillText('BUILD OPERATIONS // LOCAL RUN', 16, 16);
}

export default function BuildShipGame({
  soundEnabled,
  onClose,
  randomSource,
}: BuildShipGameProps): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<BuildShipState | null>(null);
  const controlsRef = useRef<ControlState>({ left: false, right: false });
  const soundEnabledRef = useRef(soundEnabled);
  const reducedMotion = useReducedMotion();
  const reducedMotionRef = useRef(reducedMotion);
  const [runKey, setRunKey] = useState(0);
  const [snapshot, setSnapshot] = useState<GameSnapshot>({
    score: 0,
    level: 1,
    lives: 3,
    highScore: 0,
    gameOver: false,
  });

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    reducedMotionRef.current = reducedMotion;
  }, [reducedMotion]);

  function fireFromInput(): void {
    const state = gameRef.current;
    if (!state || !fireBuildShip(state)) return;
    playAudioCue('shot', soundEnabledRef.current);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const initialRect = canvas.getBoundingClientRect();
    const width = initialRect.width || 760;
    const height = initialRect.height || 560;
    const random = randomSource ?? createSeededRandom(20260721);
    const state = createBuildShipState({
      width,
      height,
      highScore: readBuildShipHighScore(),
      random,
    });
    gameRef.current = state;
    setSnapshot({
      score: state.score,
      level: state.level,
      lives: state.lives,
      highScore: state.highScore,
      gameOver: false,
    });

    let animationFrame = 0;
    let lastTime = performance.now();
    const canvasElement = canvas;
    const context = canvasElement.getContext('2d');
    if (!context) return undefined;
    const renderingContext = context;

    function resizeCanvas(): void {
      const rect = canvasElement.getBoundingClientRect();
      const nextWidth = rect.width || 760;
      const nextHeight = rect.height || 560;
      const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvasElement.width = Math.floor(nextWidth * devicePixelRatio);
      canvasElement.height = Math.floor(nextHeight * devicePixelRatio);
      renderingContext.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      if (gameRef.current) resizeBuildShip(gameRef.current, nextWidth, nextHeight);
    }

    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(canvasElement);
    resizeCanvas();

    function frame(time: number): void {
      const currentState = gameRef.current;
      if (!currentState) return;

      const deltaMs = Math.min(50, Math.max(0, time - lastTime));
      lastTime = time;
      const direction: -1 | 0 | 1 = controlsRef.current.left
        ? -1
        : controlsRef.current.right
          ? 1
          : 0;
      moveBuildShipPlayer(currentState, direction, deltaMs);
      const events = stepBuildShip(currentState, deltaMs, random);
      if (events.enemyHit) playAudioCue('hit', soundEnabledRef.current);
      if (events.levelUp) playAudioCue('level', soundEnabledRef.current);
      if (events.gameOver) {
        playAudioCue('game-over', soundEnabledRef.current);
        writeBuildShipHighScore(updateHighScore(currentState.score, currentState.highScore));
      }

      drawBuildShipScene(renderingContext, currentState, reducedMotionRef.current);
      setSnapshot({
        score: currentState.score,
        level: currentState.level,
        lives: currentState.lives,
        highScore: currentState.highScore,
        gameOver: currentState.gameOver,
      });

      if (!currentState.gameOver) animationFrame = requestAnimationFrame(frame);
    }

    animationFrame = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
      gameRef.current = null;
    };
  }, [randomSource, runKey]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
        controlsRef.current.left = true;
        event.preventDefault();
      }
      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
        controlsRef.current.right = true;
        event.preventDefault();
      }
      if (event.code === 'Space') {
        fireFromInput();
        event.preventDefault();
      }
    }

    function onKeyUp(event: KeyboardEvent): void {
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a')
        controlsRef.current.left = false;
      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd')
        controlsRef.current.right = false;
    }

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [onClose]);

  function handleCanvasPointerMove(event: PointerEvent<HTMLCanvasElement>): void {
    const state = gameRef.current;
    const canvas = canvasRef.current;
    if (!state || !canvas || snapshot.gameOver) return;

    const bounds = canvas.getBoundingClientRect();
    const nextX = event.clientX - bounds.left;
    const playerBounds = getBuildShipBounds(state);
    state.player.x = Math.min(Math.max(nextX, playerBounds.minimum), playerBounds.maximum);
  }

  function setControl(direction: 'left' | 'right', pressed: boolean): void {
    controlsRef.current[direction] = pressed;
  }

  return (
    <div className="after-hours-game" data-build-ship-game="true">
      <div className="build-ship-hud" aria-label="Build Ship score board">
        <div>
          <span className="build-ship-hud-label">Score</span>
          <span className="build-ship-hud-value" aria-live="polite">
            {snapshot.score.toString().padStart(6, '0')}
          </span>
        </div>
        <div>
          <span className="build-ship-hud-label">Level</span>
          <span className="build-ship-hud-value">{snapshot.level}</span>
        </div>
        <div>
          <span className="build-ship-hud-label">Lives</span>
          <span className="build-ship-hud-value">{'●'.repeat(Math.max(0, snapshot.lives))}</span>
        </div>
        <div>
          <span className="build-ship-hud-label">Local best</span>
          <span className="build-ship-hud-value">
            {snapshot.highScore.toString().padStart(6, '0')}
          </span>
        </div>
      </div>

      <div className="build-ship-board-wrap">
        <canvas
          ref={canvasRef}
          className="build-ship-canvas"
          aria-label="Build Ship game board"
          role="application"
          tabIndex={0}
          onPointerMove={handleCanvasPointerMove}
          onPointerDown={(event) => {
            event.currentTarget.focus();
            fireFromInput();
          }}
        />
        {snapshot.gameOver ? (
          <div className="build-ship-game-over" role="status">
            <div className="after-hours-kicker">Run complete</div>
            <h3 className="build-ship-game-over-title">Ship it or patch it.</h3>
            <p className="build-ship-game-over-copy">
              Local run score <strong>{snapshot.score}</strong> · Level {snapshot.level}
            </p>
            <p className="build-ship-game-over-copy">
              Personal best only. This device keeps the score; there is no global leaderboard.
            </p>
            <div className="build-ship-game-over-actions">
              <button
                type="button"
                className="after-hours-primary-button"
                onClick={() => setRunKey((current) => current + 1)}
              >
                <RotateCcw size={15} aria-hidden="true" />
                Replay
              </button>
              <Link className="after-hours-secondary-button" to="/film-room" onClick={onClose}>
                Film Room
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
              <button type="button" className="after-hours-secondary-button" onClick={onClose}>
                Close
                <X size={15} aria-hidden="true" />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="build-ship-mobile-controls" aria-label="Touch controls">
        <button
          type="button"
          className="build-ship-control-button"
          aria-label="Move build ship left"
          onPointerDown={() => setControl('left', true)}
          onPointerUp={() => setControl('left', false)}
          onPointerLeave={() => setControl('left', false)}
          onPointerCancel={() => setControl('left', false)}
        >
          <ArrowLeft size={22} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="build-ship-control-button build-ship-fire-button"
          aria-label="Fire build ship patch"
          onPointerDown={fireFromInput}
        >
          <Flame size={20} aria-hidden="true" />
          <span>Fire</span>
        </button>
        <button
          type="button"
          className="build-ship-control-button"
          aria-label="Move build ship right"
          onPointerDown={() => setControl('right', true)}
          onPointerUp={() => setControl('right', false)}
          onPointerLeave={() => setControl('right', false)}
          onPointerCancel={() => setControl('right', false)}
        >
          <ArrowRight size={22} aria-hidden="true" />
        </button>
      </div>

      <div className="build-ship-guide">
        <span>
          Keyboard: A / D or arrows to move · Space to fire · pointer movement also steers.
        </span>
        <span>Touch: hold left or right · tap Fire.</span>
      </div>
    </div>
  );
}
