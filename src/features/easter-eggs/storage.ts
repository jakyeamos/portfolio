export const BUILD_SHIP_HIGH_SCORE_KEY = 'front-office:build-ship:high-score';
export const EASTER_EGG_SOUND_KEY = 'front-office:easter-eggs:sound';

function getStoredValue(key: string): string | null {
  if (typeof window === 'undefined') return null;

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function readBuildShipHighScore(): number {
  const value = Number.parseInt(getStoredValue(BUILD_SHIP_HIGH_SCORE_KEY) ?? '0', 10);
  return Number.isFinite(value) && value > 0 ? value : 0;
}

export function writeBuildShipHighScore(score: number): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(BUILD_SHIP_HIGH_SCORE_KEY, String(Math.max(0, Math.floor(score))));
  } catch {
    // Storage can be unavailable in privacy-restricted contexts.
  }
}

export function readSoundPreference(): boolean {
  return getStoredValue(EASTER_EGG_SOUND_KEY) === 'on';
}

export function writeSoundPreference(enabled: boolean): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(EASTER_EGG_SOUND_KEY, enabled ? 'on' : 'off');
  } catch {
    // Storage can be unavailable in privacy-restricted contexts.
  }
}

export function updateHighScore(score: number, highScore: number): number {
  return Math.max(Math.floor(score), Math.floor(highScore), 0);
}
