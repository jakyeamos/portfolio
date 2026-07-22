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
  statAction?: {
    label: string;
    onClick: () => void;
  };
}

const TONE_CLASSES: Record<PosterTone, string> = {
  red: 'bg-[#f8e8e4]',
  blue: 'bg-[#e8eff8]',
  gold: 'bg-[#f3ecd8]',
};

const BADGE_CLASSES: Record<PosterTone, string> = {
  red: 'bg-[color:var(--color-primary)] text-white',
  blue: 'bg-[color:var(--color-secondary)] text-white',
  gold: 'bg-[color:var(--color-gold)] text-white',
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
  statAction,
}: EditorialPosterProps): ReactElement {
  const hasImage = Boolean(media?.imageSrc);
  const mediaStyle: CSSProperties | undefined = media?.objectPosition
    ? { objectPosition: media.objectPosition }
    : undefined;

  return (
    <section
      className={`relative min-h-[360px] overflow-hidden border border-[color:var(--color-line-strong)] p-6 md:min-h-[420px] ${TONE_CLASSES[tone]}`}
    >
      {hasImage ? (
        <div className="absolute inset-0">
          <img
            src={media?.imageSrc}
            alt={media?.alt ?? ''}
            width={media?.width}
            height={media?.height}
            className="h-full w-full object-cover"
            style={mediaStyle}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,28,44,0.04)_0%,rgba(16,28,44,0.76)_100%)]" />
        </div>
      ) : null}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-[color:var(--color-primary)]" />

      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div
              className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${
                hasImage ? 'text-white/80' : 'text-[color:var(--color-ink-soft)]'
              }`}
            >
              {kicker}
            </div>
            <div
              className={`mt-3 inline-flex px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${BADGE_CLASSES[tone]}`}
            >
              {badge}
            </div>
          </div>
          {stat ? (
            <div
              className={`text-right ${hasImage ? 'text-white' : 'text-[color:var(--color-ink)]'}`}
            >
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] opacity-75">
                File
              </div>
              {statAction ? (
                <button
                  type="button"
                  className="after-hours-poster-stat mt-2 text-3xl font-black uppercase leading-none"
                  aria-label={statAction.label}
                  data-easter-egg="draft-lottery"
                  onClick={statAction.onClick}
                >
                  {stat}
                </button>
              ) : (
                <div className="mt-2 text-3xl font-black uppercase leading-none">{stat}</div>
              )}
            </div>
          ) : null}
        </div>

        <div className="mt-auto pt-16">
          <h2
            className={`max-w-[14ch] text-5xl font-black uppercase leading-[0.9] tracking-[-0.03em] ${
              hasImage ? 'text-white' : 'text-[color:var(--color-ink)]'
            }`}
          >
            {title}
          </h2>
          {subtitle ? (
            <p
              className={`mt-4 max-w-[30ch] text-base leading-relaxed ${
                hasImage ? 'text-white/85' : 'text-[color:var(--color-ink-soft)]'
              }`}
            >
              {subtitle}
            </p>
          ) : null}
          {detail ? (
            <p
              className={`mt-8 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                hasImage ? 'text-white/80' : 'text-[color:var(--color-ink-soft)]'
              }`}
            >
              {detail}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
