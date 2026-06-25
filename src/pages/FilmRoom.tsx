import { type ReactElement, useState } from 'react';
import { ArrowRight, ArrowUpRight, ClipboardList, Eye, Sparkles, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import EditorialPoster from '@/components/EditorialPoster';
import {
  BENCH_PROJECTS,
  CONCEPT_NOTES,
  FILM_ROOM_PROJECTS,
  WEBSITE_LAUNCHES,
} from '@/content/portfolioContent';

const BREAKDOWN_LABELS = [
  { icon: ClipboardList, label: 'Situation', key: 'situation' },
  { icon: Eye, label: 'Challenge', key: 'challenge' },
  { icon: Wrench, label: 'What I built', key: 'built' },
  { icon: Sparkles, label: 'Result', key: 'result' },
] as const;

export default function FilmRoom(): ReactElement {
  const [activeProjectTitle, setActiveProjectTitle] = useState<string>(FILM_ROOM_PROJECTS[0].title);
  const activeProject =
    FILM_ROOM_PROJECTS.find((project) => project.title === activeProjectTitle) ??
    FILM_ROOM_PROJECTS[0];

  return (
    <div className="lg:ml-72">
      <main className="page-wrap py-6 md:py-8">
        <section className="editorial-card animate-rise p-6 md:p-8">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_320px]">
            <div>
              <div className="section-kicker">Film Room</div>
              <h1 className="mt-4 text-5xl font-black uppercase leading-[0.88] tracking-tight text-[color:var(--color-ink)] md:text-7xl">
                Three possessions that explain the scouting report.
              </h1>
              <p className="mt-5 max-w-4xl text-lg leading-relaxed text-[color:var(--color-ink-soft)] md:text-xl">
                This page now runs like a tape desk instead of one long article. Pick a project,
                read the breakdown, and move to the next possession when you want the next read.
              </p>
            </div>

            <div className="border border-[color:var(--color-line-strong)] bg-[color:var(--color-navy)] p-5 text-white">
              <div className="section-kicker text-[color:var(--color-gold)]">Scout Lens</div>
              <p className="mt-3 text-2xl font-black uppercase leading-tight">
                Look for pace, connective reads, and winning-work habits.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/78">
                The actual projects change, but the underlying profile stays consistent: organize
                the system, remove friction, and make the next action easier for the team.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 editorial-card p-6 md:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="section-kicker">Tape Selector</div>
              <h2 className="mt-3 text-4xl font-black uppercase leading-none tracking-tight text-[color:var(--color-ink)]">
                Choose the possession.
              </h2>
            </div>
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
              One active breakdown at a time
            </div>
          </div>

          <div className="mt-6 grid gap-3 lg:grid-cols-3">
            {FILM_ROOM_PROJECTS.map((project) => {
              const isActive = project.title === activeProject.title;

              return (
                <button
                  key={project.title}
                  type="button"
                  className={`board-tab ${isActive ? 'board-tab-active' : ''}`}
                  onClick={() => setActiveProjectTitle(project.title)}
                >
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-primary)]">
                    {project.kicker}
                  </div>
                  <div className="mt-2 text-2xl font-black uppercase leading-none tracking-tight text-[color:var(--color-ink)]">
                    {project.title}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-ink-soft)]">
                    {project.deck}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <EditorialPoster
            kicker={activeProject.kicker}
            title={activeProject.title}
            subtitle={activeProject.deck}
            badge={activeProject.badge}
            detail={activeProject.detail}
            media={activeProject.media}
            tone={activeProject.tone}
          />

          <article className="editorial-card p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <div className="section-kicker">Active Breakdown</div>
              {activeProject.stack.map((item) => (
                <span key={item} className="stat-chip">
                  {item}
                </span>
              ))}
            </div>

            <h2 className="mt-5 text-4xl font-black uppercase leading-none tracking-tight text-[color:var(--color-ink)]">
              {activeProject.title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-[color:var(--color-ink-soft)]">
              {activeProject.deck}
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {BREAKDOWN_LABELS.map((item) => (
                <article
                  key={item.label}
                  className="border border-[color:var(--color-line)] bg-[color:var(--color-surface-muted)] p-5"
                >
                  <div className="flex items-center gap-3 text-[color:var(--color-primary)]">
                    <item.icon size={16} />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">
                      {item.label}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-ink)]">
                    {activeProject[item.key]}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <article className="border border-[color:var(--color-line)] bg-white p-5">
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-secondary)]">
                  Why it matters
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-ink)]">
                  {activeProject.whyItMatters}
                </p>
              </article>

              <article className="border border-[color:var(--color-line)] bg-white p-5">
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-secondary)]">
                  Engineering read
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-ink)]">
                  {activeProject.engineeringRead}
                </p>
              </article>
            </div>
          </article>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_340px]">
          <article className="editorial-card p-6 md:p-8">
            <div className="section-kicker">Bench Depth</div>
            <h2 className="mt-4 text-4xl font-black uppercase leading-none tracking-tight text-[color:var(--color-ink)]">
              More projects already in the rotation.
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {BENCH_PROJECTS.map((project) => (
                <article
                  key={project.title}
                  className="border border-[color:var(--color-line)] bg-white p-5"
                >
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-primary)]">
                    {project.kicker}
                  </div>
                  <h3 className="mt-3 text-2xl font-black uppercase leading-none tracking-tight text-[color:var(--color-ink)]">
                    {project.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-ink-soft)]">
                    {project.copy}
                  </p>
                </article>
              ))}
            </div>
          </article>

          <aside className="grid gap-6">
            <article className="editorial-card p-6">
              <div className="section-kicker">Concept Watch</div>
              <h2 className="mt-4 text-3xl font-black uppercase leading-none tracking-tight text-[color:var(--color-ink)]">
                Cool ideas that are not tracker projects yet.
              </h2>
              <div className="mt-5 grid gap-4">
                {CONCEPT_NOTES.map((concept) => (
                  <article
                    key={concept.title}
                    className="border border-[color:var(--color-line)] bg-white p-5"
                  >
                    <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-primary)]">
                      {concept.label}
                    </div>
                    <h3 className="mt-3 text-2xl font-black uppercase leading-none tracking-tight text-[color:var(--color-ink)]">
                      {concept.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-ink-soft)]">
                      {concept.copy}
                    </p>
                  </article>
                ))}
              </div>
            </article>

            <article className="editorial-card p-6">
              <div className="section-kicker">New Websites</div>
              <div className="mt-5 grid gap-4">
                {WEBSITE_LAUNCHES.map((site) => (
                  <a
                    key={site.href}
                    href={site.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group block border border-[color:var(--color-line)] bg-white p-5 hover:-translate-y-1 hover:border-[color:var(--color-primary)] hover:shadow-[0_14px_30px_rgba(16,28,44,0.08)]"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-primary)]">
                        {site.label}
                      </div>
                      <ArrowUpRight
                        size={16}
                        className="shrink-0 text-[color:var(--color-ink-soft)] transition group-hover:text-[color:var(--color-primary)]"
                      />
                    </div>
                    <h3 className="mt-3 text-2xl font-black uppercase leading-none tracking-tight text-[color:var(--color-ink)] transition group-hover:text-[color:var(--color-primary)]">
                      {site.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-ink-soft)]">
                      {site.copy}
                    </p>
                  </a>
                ))}
              </div>
            </article>
          </aside>
        </section>
      </main>
    </div>
  );
}
