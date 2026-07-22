export type AudioCue = 'shot' | 'hit' | 'level' | 'game-over' | 'tap';

interface WindowWithWebkitAudio extends Window {
  webkitAudioContext?: typeof AudioContext;
}

const CUE_SETTINGS: Record<
  AudioCue,
  { frequency: number; duration: number; type: OscillatorType }
> = {
  shot: { frequency: 180, duration: 0.06, type: 'square' },
  hit: { frequency: 460, duration: 0.09, type: 'triangle' },
  level: { frequency: 620, duration: 0.16, type: 'sine' },
  'game-over': { frequency: 90, duration: 0.26, type: 'sawtooth' },
  tap: { frequency: 320, duration: 0.05, type: 'sine' },
};

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (audioContext) return audioContext;

  const audioWindow = window as WindowWithWebkitAudio;
  const AudioContextConstructor = window.AudioContext ?? audioWindow.webkitAudioContext;
  if (!AudioContextConstructor) return null;

  try {
    audioContext = new AudioContextConstructor();
  } catch {
    return null;
  }

  return audioContext;
}

export function playAudioCue(cue: AudioCue, enabled: boolean): void {
  if (!enabled) return;

  const context = getAudioContext();
  if (!context) return;

  const settings = CUE_SETTINGS[cue];
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const start = context.currentTime;
  const end = start + settings.duration;

  oscillator.type = settings.type;
  oscillator.frequency.setValueAtTime(settings.frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.06, start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, end);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(end);

  if (context.state === 'suspended') {
    void context.resume().catch(() => undefined);
  }
}
