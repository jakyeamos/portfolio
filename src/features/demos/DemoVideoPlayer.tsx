import { Maximize2, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import {
  type ChangeEvent,
  type KeyboardEvent,
  type ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { DemoVideo } from '@/content/demoVideos';

interface DemoVideoPlayerProps {
  video: DemoVideo;
}

function formatTime(seconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  return `${minutes}:${String(remainder).padStart(2, '0')}`;
}

export default function DemoVideoPlayer({ video }: DemoVideoPlayerProps): ReactElement {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(25);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    setDuration(25);
    setCurrentTime(0);
    setIsPlaying(false);
    setIsMuted(true);
  }, [video.slug]);

  useEffect(() => {
    const player = videoRef.current;
    if (!player) return undefined;

    function updateTime(): void {
      setCurrentTime(player?.currentTime ?? 0);
      setIsPlaying(Boolean(player && !player.paused));
    }

    const interval = window.setInterval(updateTime, 250);
    return () => window.clearInterval(interval);
  }, [video.slug]);

  function handleLoadedMetadata(event: React.SyntheticEvent<HTMLVideoElement>): void {
    const player = event.currentTarget;
    if (Number.isFinite(player.duration) && player.duration > 0) setDuration(player.duration);
    player.muted = true;
    setIsMuted(true);
    void player.play().then(
      () => setIsPlaying(true),
      () => setIsPlaying(false),
    );
  }

  function seekTo(seconds: number, pauseAfterSeek = false): void {
    const player = videoRef.current;
    const nextTime = Math.min(Math.max(seconds, 0), duration);
    if (player) {
      player.currentTime = nextTime;
      if (pauseAfterSeek) {
        player.pause();
        setIsPlaying(false);
      }
    }
    setCurrentTime(nextTime);
  }

  function handleScrub(event: ChangeEvent<HTMLInputElement>): void {
    seekTo(Number(event.currentTarget.value));
  }

  function handleScrubberKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    const jump = event.shiftKey ? 15 : 5;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      seekTo(currentTime - jump);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      seekTo(currentTime + jump);
    } else if (event.key === 'Home') {
      event.preventDefault();
      seekTo(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      seekTo(duration);
    }
  }

  function togglePlayback(): void {
    const player = videoRef.current;
    if (!player) return;

    if (player.paused) {
      void player.play().then(
        () => setIsPlaying(true),
        () => setIsPlaying(false),
      );
    } else {
      player.pause();
      setIsPlaying(false);
    }
  }

  function toggleMute(): void {
    const player = videoRef.current;
    if (!player) return;

    player.muted = !player.muted;
    setIsMuted(player.muted);
  }

  function handleFullscreen(): void {
    const player = videoRef.current;
    if (!player) return;
    void player.requestFullscreen?.();
  }

  return (
    <section
      className="border border-[color:var(--color-line-strong)] bg-[color:var(--color-navy)] text-white"
      aria-label={`${video.title} video player`}
    >
      <div className="relative aspect-video overflow-hidden bg-black">
        <video
          ref={videoRef}
          key={video.slug}
          className="h-full w-full object-contain"
          src={video.videoSrc}
          poster={video.posterSrc}
          autoPlay
          muted
          playsInline
          preload="metadata"
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            setIsPlaying(false);
            setCurrentTime(duration);
          }}
          data-demo-video={video.slug}
          data-demo-autoplay="selected"
        >
          <track kind="captions" srcLang="en" label="English" src={video.captionsSrc} default />
        </video>
        <div className="pointer-events-none absolute left-3 top-3 border border-white/35 bg-[rgba(16,28,44,0.85)] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em]">
          On air · muted start
        </div>
      </div>

      <div className="border-t border-white/15 p-4 sm:p-5">
        <div className="relative">
          <div className="pointer-events-none absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 bg-white/20" />
          {video.chapters.map((chapter) => {
            const left = duration > 0 ? (chapter.start / duration) * 100 : 0;
            return (
              <span
                key={chapter.id}
                className="pointer-events-none absolute top-1/2 z-10 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--color-primary)] ring-2 ring-[color:var(--color-navy)]"
                style={{ left: `${Math.min(100, Math.max(0, left))}%` }}
                aria-hidden="true"
              />
            );
          })}
          <input
            type="range"
            min="0"
            max={duration}
            step="0.1"
            value={Math.min(currentTime, duration)}
            onChange={handleScrub}
            onKeyDown={handleScrubberKeyDown}
            className="relative z-20 block h-5 w-full cursor-pointer accent-[color:var(--color-primary)]"
            aria-label={`Seek ${video.title}`}
            aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
          />
        </div>

        <div className="mt-1 flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white/65">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 border border-white/45 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[color:var(--color-navy)] hover:border-white hover:bg-[color:var(--color-surface-muted)]"
            onClick={togglePlayback}
            aria-label={isPlaying ? `Pause ${video.title}` : `Play ${video.title}`}
          >
            {isPlaying ? (
              <Pause size={14} aria-hidden="true" />
            ) : (
              <Play size={14} aria-hidden="true" />
            )}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 border border-white/35 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white hover:border-white"
            onClick={toggleMute}
            aria-pressed={!isMuted}
          >
            {isMuted ? (
              <Volume2 size={14} aria-hidden="true" />
            ) : (
              <VolumeX size={14} aria-hidden="true" />
            )}
            {isMuted ? 'Unmute' : 'Sound on'}
          </button>
          <button
            type="button"
            className="ml-auto inline-flex items-center gap-2 border border-white/35 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white hover:border-white"
            onClick={handleFullscreen}
          >
            <Maximize2 size={14} aria-hidden="true" />
            Fullscreen
          </button>
        </div>

        <div className="mt-5 grid gap-5 border-t border-white/15 pt-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <section aria-labelledby="demo-chapters-heading">
            <div
              id="demo-chapters-heading"
              className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/55"
            >
              Chapters
            </div>
            <div className="mt-3 grid gap-2">
              {video.chapters.map((chapter) => (
                <button
                  key={chapter.id}
                  type="button"
                  className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 border border-white/15 px-3 py-2 text-left hover:border-white/60"
                  onClick={() => seekTo(chapter.start, true)}
                >
                  <span className="font-mono text-[10px] text-white/55">
                    {formatTime(chapter.start)}
                  </span>
                  <span>
                    <span className="block text-xs font-bold uppercase tracking-[0.1em]">
                      {chapter.title}
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-white/65">
                      {chapter.summary}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section aria-labelledby="demo-transcript-heading">
            <div
              id="demo-transcript-heading"
              className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/55"
            >
              Transcript
            </div>
            <ol className="mt-3 grid gap-2" aria-live="polite">
              {video.transcript.map((line) => {
                const isCurrent = currentTime >= line.start && currentTime < line.end;
                return (
                  <li
                    key={`${line.start}-${line.end}`}
                    className={`border-l-2 pl-3 text-sm leading-relaxed ${isCurrent ? 'border-[color:var(--color-primary)] text-white' : 'border-white/15 text-white/60'}`}
                  >
                    <button type="button" className="text-left" onClick={() => seekTo(line.start)}>
                      <span className="mr-2 font-mono text-[10px] text-white/45">
                        {formatTime(line.start)}
                      </span>
                      {line.text}
                    </button>
                  </li>
                );
              })}
            </ol>
          </section>
        </div>
      </div>
    </section>
  );
}
