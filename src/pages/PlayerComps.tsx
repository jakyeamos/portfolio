import { type ReactElement, useState } from 'react';
import { Blend } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BREAKING_TICKER, PLAYER_COMPS, type PlayerComp } from '@/content/portfolioContent';
import { useEasterEggs } from '@/features/easter-eggs/EasterEggProvider';

function PlayerCompMedia({ comp }: { comp: PlayerComp }): ReactElement {
  const [imageFailed, setImageFailed] = useState(false);
  const initials = comp.player
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2);

  return (
    <div className="relative h-[360px] overflow-hidden border-b border-[color:var(--color-line)] bg-[linear-gradient(180deg,#fff8ed_0%,#f5eee2_100%)] md:h-[420px] md:border-b-0 md:border-r">
      <div className="absolute inset-x-0 top-0 h-20 bg-[linear-gradient(180deg,rgba(181,13,13,0.1)_0%,rgba(181,13,13,0)_100%)]" />
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        role={imageFailed || !comp.media.imageSrc ? 'img' : undefined}
        aria-hidden={imageFailed || !comp.media.imageSrc ? undefined : true}
        aria-label={
          imageFailed || !comp.media.imageSrc ? `${comp.player} headshot fallback` : undefined
        }
      >
        <div className="flex size-28 items-center justify-center rounded-full border border-[color:var(--color-line-strong)] bg-white text-5xl font-black uppercase leading-none text-[color:var(--color-primary)]">
          {initials}
        </div>
        <div className="mt-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-ink-soft)]">
          Comp portrait
        </div>
      </div>
      {!imageFailed && comp.media.imageSrc ? (
        <img
          src={comp.media.imageSrc}
          alt={comp.media.alt}
          className="absolute inset-0 h-full w-full object-contain px-4 pt-6"
          onError={() => setImageFailed(true)}
          style={
            comp.media.objectPosition ? { objectPosition: comp.media.objectPosition } : undefined
          }
        />
      ) : null}
      <div className="absolute bottom-0 left-0 right-0 border-t border-[color:var(--color-line)] bg-[rgba(16,28,44,0.88)] px-4 py-3 text-white">
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-gold)]">
          {comp.team}
        </div>
        <p className="mt-1 text-sm font-bold uppercase tracking-[0.1em]">{comp.role}</p>
      </div>
    </div>
  );
}

export default function PlayerComps(): ReactElement {
  const { openEgg } = useEasterEggs();

  return (
    <div>
      <main className="page-wrap py-6 md:py-8">
        <section className="ticker-shell">
          <div className="ticker-label">Comp Watch</div>
          <div className="ticker-window">
            <p className="ticker-track">{BREAKING_TICKER[0]}</p>
          </div>
        </section>

        <section className="mt-6 editorial-card p-6 md:p-8">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_320px]">
            <div>
              <div className="section-kicker">Player Comps</div>
              <h1 className="mt-4 text-5xl font-black uppercase leading-[0.88] tracking-tight text-[color:var(--color-ink)] md:text-7xl">
                Player comps for how the engineering actually looks.
              </h1>
            </div>

            <div className="grid gap-4"></div>
          </div>
        </section>

        <section className="mt-8 grid items-start gap-6 xl:grid-cols-2">
          {PLAYER_COMPS.map((comp) => (
            <article key={comp.player} className="editorial-card overflow-hidden">
              <div className="grid md:grid-cols-[220px_minmax(0,1fr)] md:items-start">
                <PlayerCompMedia comp={comp} />

                <div className="p-6 md:p-7">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="section-kicker">{comp.badge}</div>
                    {comp.overlap.map((item) => (
                      <span key={item} className="stat-chip">
                        {item}
                      </span>
                    ))}
                  </div>

                  <h2 className="mt-5 text-4xl font-black uppercase leading-none tracking-tight text-[color:var(--color-ink)]">
                    {comp.player}
                  </h2>
                  <p className="mt-4 text-lg leading-relaxed text-[color:var(--color-ink)]">
                    {comp.scoutingHook}
                  </p>

                  <div className="mt-6 grid gap-4">
                    <article className="border border-[color:var(--color-line)] bg-[color:var(--color-surface-muted)] p-4">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-secondary)]">
                        Translation to engineering
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-ink)]">
                        {comp.translation}
                      </p>
                    </article>

                    <article className="border border-[color:var(--color-line)] bg-white p-4">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-primary)]">
                        Why the comp works
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-ink)]">
                        {comp.whyItFits}
                      </p>
                    </article>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <article className="editorial-card p-6 md:p-8">
            <div className="flex items-center gap-3">
              <Blend size={18} className="text-[color:var(--color-primary)]" />
              <div className="section-kicker">Hybrid Read</div>
            </div>
            <h2 className="mt-4 text-4xl font-black uppercase leading-none tracking-tight text-[color:var(--color-ink)]">
              Put it together and the read is pretty clear.
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-[color:var(--color-ink-soft)]">
              The Haliburton side explains the tempo and connective playmaking. The Ausar side
              explains the low-ego utility and willingness to handle the possession work. Together,
              that is a strong picture of a builder who can organize offense and still make the
              grimy winning plays that most teams quietly need.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                className="after-hours-inline-hotspot"
                aria-label="Open Player Comp Mixer"
                data-easter-egg="player-comp-mixer"
                onClick={(event) => openEgg('player-comp-mixer', event.currentTarget)}
              >
                Mix the read
              </button>
              <Link className="btn-primary" to="/scouting-report">
                Back to scouting report
              </Link>
              <Link className="btn-secondary" to="/film-room">
                Watch the film room
              </Link>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
