import type { CSSProperties, ReactElement } from 'react';
import type { PosterMediaAsset } from '@/content/portfolioAssets';

type PosterTone = 'red' | 'blue' | 'gold';

interface EditorialPosterProps {
  kicker: string;
  title: string;
  subtitle?: string;
  badge: string;
  detail?: string;
  tone: PosterTone;
  media?: PosterMediaAsset;
  stat?: string;
  showPlay?: boolean;
}

const TONE_CLASSES: Record<PosterTone, string> = {
  red: 'from-[#fff1eb] via-[#fffaf6] to-[#ffe2db]',
  blue: 'from-[#ecf4ff] via-[#fffdf8] to-[#dde9ff]',
  gold: 'from-[#fff8df] via-[#fffdf6] to-[#f9edb8]',
};

const BADGE_CLASSES: Record<PosterTone, string> = {
  red: 'bg-[color:var(--color-primary)] text-white',
  blue: 'bg-[color:var(--color-secondary)] text-white',
  gold: 'bg-[color:var(--color-gold)] text-[color:var(--color-ink)]',
};

export default function EditorialPoster({
  kicker,
  title,
  subtitle,
  badge,
  detail,
  tone,
  media,
  stat,
  showPlay = false,
}: EditorialPosterProps): ReactElement {
  const hasMedia = Boolean(media?.imageSrc || media?.videoSrc || media?.posterSrc);
  const mediaStyle: CSSProperties | undefined = media?.objectPosition
    ? { objectPosition: media.objectPosition }
    : undefined;

  return (
    <div
      className={`group relative min-h-[360px] overflow-hidden border border-[color:var(--color-line-strong)] bg-gradient-to-br ${TONE_CLASSES[tone]} p-6 md:min-h-[420px]`}
    >
      {hasMedia ? (
        <div className="absolute inset-0">
          {media?.videoSrc ? (
            <video
              className="h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              poster={media.posterSrc}
              style={mediaStyle}
            >
              <source src={media.videoSrc} />
            </video>
          ) : media?.imageSrc || media?.posterSrc ? (
            <img
              src={media.imageSrc ?? media.posterSrc}
              alt={media.alt}
              className="h-full w-full object-cover"
              style={mediaStyle}
            />
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,28,44,0.08)_0%,rgba(16,28,44,0.28)_40%,rgba(16,28,44,0.82)_100%)]" />
        </div>
      ) : null}
      <div
        className={`absolute inset-0 bg-[linear-gradient(90deg,transparent_0,transparent_calc(100%-1px),rgba(16,28,44,0.05)_calc(100%-1px),rgba(16,28,44,0.05)_100%)] bg-[length:26px_26px] ${
          hasMedia ? 'opacity-30' : 'opacity-70'
        }`}
      />
      <div className="absolute -right-12 top-6 h-40 w-40 rounded-full border-[18px] border-white/60" />
      <div className="absolute -left-10 bottom-8 h-32 w-32 rounded-full border-[12px] border-[color:rgba(20,77,184,0.14)]" />
      <div className="absolute bottom-0 left-0 right-0 h-3 bg-[color:var(--color-primary)]" />

      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div
              className={`text-[10px] font-semibold uppercase tracking-[0.24em] ${
                hasMedia ? 'text-white/75' : 'text-[color:var(--color-ink-soft)]'
              }`}
            >
              {kicker}
            </div>
            <div
              className={`mt-3 inline-flex px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${BADGE_CLASSES[tone]}`}
            >
              {badge}
            </div>
          </div>
          {stat ? (
            <div className="text-right">
              <div
                className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${
                  hasMedia ? 'text-white/75' : 'text-[color:var(--color-ink-soft)]'
                }`}
              >
                Status
              </div>
              <div
                className={`mt-2 text-3xl font-black uppercase leading-none ${
                  hasMedia ? 'text-white' : 'text-[color:var(--color-ink)]'
                }`}
              >
                {stat}
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-10 flex flex-1 flex-col justify-between">
          <div>
            <h2
              className={`max-w-[14ch] text-5xl font-black uppercase leading-[0.88] tracking-tight ${
                hasMedia ? 'text-white' : 'text-[color:var(--color-ink)]'
              }`}
            >
              {title}
            </h2>
            {subtitle ? (
              <p
                className={`mt-4 max-w-[30ch] text-base leading-relaxed ${
                  hasMedia ? 'text-white/82' : 'text-[color:var(--color-ink-soft)]'
                }`}
              >
                {subtitle}
              </p>
            ) : null}
          </div>

          <div className="mt-10 flex items-end justify-between gap-4">
            {detail ? (
              <p
                className={`max-w-[24ch] text-[11px] font-semibold uppercase tracking-[0.18em] ${
                  hasMedia ? 'text-white/78' : 'text-[color:var(--color-ink-soft)]'
                }`}
              >
                {detail}
              </p>
            ) : (
              <div />
            )}
            {showPlay ? (
              <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-2 border-[color:var(--color-primary)] bg-white text-[color:var(--color-primary)] shadow-[0_16px_30px_rgba(181,13,13,0.18)] transition group-hover:-translate-y-1">
                <div className="ml-1 h-0 w-0 border-b-[12px] border-l-[18px] border-b-transparent border-l-[color:var(--color-primary)] border-t-[12px] border-t-transparent" />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
