import { ExternalLink, Volume2, VolumeX } from 'lucide-react';
import { type ReactElement, useEffect, useRef, useState } from 'react';
import type { ProjectShotClip } from '@/content/shotClips';

interface ProjectShotClipPlayerProps {
  clip: ProjectShotClip;
}

function formatSeconds(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${String(remainder).padStart(2, '0')}`;
}

function buildEmbedUrl(clip: ProjectShotClip): string {
  const params = new URLSearchParams({
    autoplay: '1',
    controls: '1',
    end: String(clip.end),
    enablejsapi: '1',
    fs: '1',
    modestbranding: '1',
    mute: '1',
    playsinline: '1',
    rel: '0',
    start: String(clip.start),
  });

  return `https://www.youtube.com/embed/${clip.videoId}?${params.toString()}`;
}

function sendPlayerCommand(player: HTMLIFrameElement | null, command: string): void {
  if (!player?.contentWindow) return;

  player.contentWindow.postMessage(
    JSON.stringify({ event: 'command', func: command, args: [] }),
    'https://www.youtube.com',
  );
}

export default function ProjectShotClipPlayer({ clip }: ProjectShotClipPlayerProps): ReactElement {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const stopTimerRef = useRef<number | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    function handlePlayerMessage(event: MessageEvent): void {
      if (event.origin !== 'https://www.youtube.com' || typeof event.data !== 'string') return;

      try {
        const payload: unknown = JSON.parse(event.data);
        if (
          typeof payload !== 'object' ||
          payload === null ||
          !('event' in payload) ||
          payload.event !== 'infoDelivery' ||
          !('info' in payload) ||
          typeof payload.info !== 'object' ||
          payload.info === null ||
          !('currentTime' in payload.info) ||
          typeof payload.info.currentTime !== 'number'
        ) {
          return;
        }

        if (payload.info.currentTime >= clip.end) {
          sendPlayerCommand(iframeRef.current, 'pauseVideo');
        }
      } catch {
        return;
      }
    }

    window.addEventListener('message', handlePlayerMessage);
    return () => {
      if (stopTimerRef.current !== null) window.clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
      window.removeEventListener('message', handlePlayerMessage);
    };
  }, [clip.end, clip.start, stopTimerRef]);

  function handlePlayerLoad(): void {
    if (stopTimerRef.current !== null) window.clearTimeout(stopTimerRef.current);
    stopTimerRef.current = window.setTimeout(
      () => {
        sendPlayerCommand(iframeRef.current, 'pauseVideo');
      },
      Math.max(0, clip.end - clip.start) * 1000 + 750,
    );
  }

  function handleUnmute(): void {
    sendPlayerCommand(iframeRef.current, 'unMute');
    setIsMuted(false);
  }

  return (
    <section
      className="mt-6 border border-[color:var(--color-line)] bg-white p-4"
      aria-label={`${clip.player} verified shot clip`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="section-kicker">Verified game clip</div>
          <h3 className="mt-2 text-2xl font-black uppercase leading-none text-[color:var(--color-ink)]">
            {clip.player} · {clip.moment}
          </h3>
        </div>
        <span className="stat-chip">{clip.source}</span>
      </div>

      <div className="mt-4 overflow-hidden border border-[color:var(--color-line-strong)] bg-[color:var(--color-navy)]">
        <div className="aspect-video">
          <iframe
            ref={iframeRef}
            title={`${clip.player}: ${clip.moment}`}
            src={buildEmbedUrl(clip)}
            onLoad={handlePlayerLoad}
            className="h-full w-full border-0"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            data-clip-id={clip.clipId}
            data-clip-start={clip.start}
            data-clip-end={clip.end}
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[color:var(--color-ink-soft)]">
          {clip.zone} · {formatSeconds(clip.start)}–{formatSeconds(clip.end)} · reviewed{' '}
          {clip.reviewedAt}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 border border-[color:var(--color-line-strong)] bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[color:var(--color-ink)] hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
            aria-pressed={!isMuted}
            onClick={handleUnmute}
          >
            {isMuted ? (
              <Volume2 size={14} aria-hidden="true" />
            ) : (
              <VolumeX size={14} aria-hidden="true" />
            )}
            {isMuted ? 'Unmute clip' : 'Sound on'}
          </button>
          <a
            href={clip.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 border border-[color:var(--color-line-strong)] bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[color:var(--color-ink)] hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
          >
            Source
            <ExternalLink size={14} aria-hidden="true" />
          </a>
        </div>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-[color:var(--color-ink-soft)]">
        {clip.verificationNote}
      </p>
    </section>
  );
}
