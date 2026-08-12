import { type KeyboardEvent, type ReactElement, useId, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CLIENT_WORK, FILM_ROOM_PROJECTS } from '@/content/portfolioContent';
import { useEasterEggs } from '@/features/easter-eggs/EasterEggProvider';

const BREAKDOWN_LABELS = [
  { label: 'Situation', key: 'situation' },
  { label: 'Challenge', key: 'challenge' },
  { label: 'What I built', key: 'built' },
  { label: 'Result', key: 'result' },
] as const;

export default function FilmRoom(): ReactElement {
  const { openEgg } = useEasterEggs();
  const [activeProjectTitle, setActiveProjectTitle] = useState(FILM_ROOM_PROJECTS[0].title);
  const tabListId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeIndex = Math.max(
    0,
    FILM_ROOM_PROJECTS.findIndex((project) => project.title === activeProjectTitle),
  );
  const activeProject = FILM_ROOM_PROJECTS[activeIndex];

  function selectProject(index: number): void {
    setActiveProjectTitle(FILM_ROOM_PROJECTS[index].title);
  }

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number): void {
    const direction = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (direction === 0 && event.key !== 'Home' && event.key !== 'End') return;

    event.preventDefault();
    const nextIndex =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? FILM_ROOM_PROJECTS.length - 1
          : (index + direction + FILM_ROOM_PROJECTS.length) % FILM_ROOM_PROJECTS.length;

    selectProject(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  }

  const evidenceIsApproved = activeProject.evidence.reviewStatus === 'approved';

  return (
    <main
      className="page-wrap py-6 md:py-8"
      data-mac-control-id="portfolio.film-room.surface"
      data-task-state="film_room_ready"
    >
      <section className="max-w-4xl">
        <div className="section-kicker">Film Room</div>
        <h1 className="mt-4 text-5xl font-black uppercase leading-[0.9] tracking-[-0.03em] text-[color:var(--color-ink)] md:text-7xl">
          Three case studies that show how the work gets done.
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[color:var(--color-ink-soft)] md:text-xl">
          Each breakdown leads with the engineering problem, the implementation, and the evidence a
          hiring manager can verify. The sports language stays in the margins; the work stays clear.
        </p>
      </section>

      <section className="mt-10 border-y border-[color:var(--color-line-strong)] py-1">
        <div role="tablist" aria-label="Selected case studies" className="grid md:grid-cols-3">
          {FILM_ROOM_PROJECTS.map((project, index) => {
            const isActive = index === activeIndex;
            const tabId = `${tabListId}-tab-${index}`;

            return (
              <button
                key={project.title}
                ref={(element) => {
                  tabRefs.current[index] = element;
                }}
                id={tabId}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`${tabListId}-panel`}
                tabIndex={isActive ? 0 : -1}
                className={`border-b px-1 py-5 text-left md:border-b-0 md:px-5 md:first:pl-1 ${
                  isActive
                    ? 'border-[color:var(--color-primary)] text-[color:var(--color-primary)]'
                    : 'border-[color:var(--color-line)] text-[color:var(--color-ink)] hover:text-[color:var(--color-primary)]'
                }`}
                onClick={() => selectProject(index)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
              >
                <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-primary)]">
                  {project.kicker}
                </span>
                <span className="mt-2 block text-2xl font-black uppercase leading-none tracking-[-0.02em]">
                  {project.title}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <div
        id={`${tabListId}-panel`}
        role="tabpanel"
        aria-labelledby={`${tabListId}-tab-${activeIndex}`}
        className="mt-10 grid gap-10 xl:grid-cols-[minmax(0,1fr)_300px]"
      >
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="section-kicker">Selected case study</span>
            <span className="stat-chip">{activeProject.badge}</span>
          </div>
          <h2 className="mt-4 text-5xl font-black uppercase leading-[0.9] tracking-[-0.03em] text-[color:var(--color-ink)]">
            {activeProject.title}
          </h2>
          <p className="mt-5 max-w-3xl text-xl leading-relaxed text-[color:var(--color-ink-soft)]">
            {activeProject.deck}
          </p>
          <button
            type="button"
            className="after-hours-inline-hotspot mt-5"
            aria-label={`Open Director's Cut for ${activeProject.title}`}
            data-easter-egg="directors-cut"
            onClick={(event) =>
              openEgg('directors-cut', event.currentTarget, { caseStudy: activeProject })
            }
          >
            Open Director&apos;s Cut
          </button>

          <div
            className="mt-6 flex flex-wrap gap-2"
            aria-label={`${activeProject.title} technology stack`}
          >
            {activeProject.stack.map((item) => (
              <span key={item} className="stat-chip">
                {item}
              </span>
            ))}
          </div>

          <dl className="mt-10 border-t border-[color:var(--color-line-strong)]">
            {BREAKDOWN_LABELS.map((item) => (
              <div
                key={item.key}
                className="grid gap-3 border-b border-[color:var(--color-line)] py-6 md:grid-cols-[180px_minmax(0,1fr)]"
              >
                <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-[color:var(--color-secondary)]">
                  {item.label}
                </dt>
                <dd className="text-base leading-relaxed text-[color:var(--color-ink)]">
                  {activeProject[item.key]}
                </dd>
              </div>
            ))}
          </dl>

          <section className="mt-8 border-t-2 border-[color:var(--color-primary)] pt-5">
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[color:var(--color-primary)]">
              Engineering read
            </div>
            <p className="mt-3 text-lg leading-relaxed text-[color:var(--color-ink)]">
              {activeProject.engineeringRead}
            </p>
          </section>
        </div>

        <aside className="h-fit border-t-2 border-[color:var(--color-navy)] pt-5">
          <div className="section-kicker">Evidence</div>
          <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-ink-soft)]">
            {activeProject.whyItMatters}
          </p>
          <a
            href={activeProject.evidence.href}
            target="_blank"
            rel="noreferrer"
            className="report-link mt-6"
          >
            {activeProject.evidence.label}
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ink-soft)]">
            Source: {activeProject.evidence.sourceLabel}
          </p>

          {evidenceIsApproved && activeProject.evidence.image ? (
            <figure className="mt-6 border border-[color:var(--color-line)]">
              <img
                src={activeProject.evidence.image.src}
                alt={activeProject.evidence.image.alt}
                width={activeProject.evidence.image.width}
                height={activeProject.evidence.image.height}
                loading="lazy"
                className="h-auto w-full"
              />
              <figcaption className="border-t border-[color:var(--color-line)] px-4 py-3 text-xs leading-relaxed text-[color:var(--color-ink-soft)]">
                {activeProject.evidence.image.provenance}
              </figcaption>
            </figure>
          ) : null}

          {activeProject.evidence.reviewStatus === 'pending-rights-attestation' ? (
            <div className="mt-6 border border-[color:var(--color-line-strong)] bg-[color:var(--color-surface-muted)] p-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-gold)]">
                Visual evidence withheld
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-ink)]">
                {activeProject.evidence.reviewNote}
              </p>
            </div>
          ) : null}
        </aside>
      </div>

      <section
        className="mt-14 border-t border-[color:var(--color-line-strong)] pt-6 md:pt-8"
        aria-labelledby="client-work-heading"
      >
        <div className="max-w-4xl">
          <div className="section-kicker">Client & applied systems</div>
          <h2
            id="client-work-heading"
            className="mt-4 text-4xl font-black uppercase leading-[0.95] tracking-[-0.03em] text-[color:var(--color-ink)] md:text-5xl"
          >
            The work beyond the public repo shelf.
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-[color:var(--color-ink-soft)]">
            These systems show the client, domain, and product side of the engineering profile.
            Private-beta and client-facing work is described at a public-safe level without private
            source links or user data.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {CLIENT_WORK.map((project) => (
            <article
              key={project.title}
              className="border border-[color:var(--color-line)] bg-[color:var(--color-surface-muted)] p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-primary)]">
                  {project.kicker}
                </span>
                <span className="stat-chip">{project.status}</span>
              </div>
              <h3 className="mt-4 text-3xl font-black uppercase leading-none tracking-[-0.02em] text-[color:var(--color-ink)]">
                {project.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-[color:var(--color-ink-soft)]">
                {project.deck}
              </p>
              <div
                className="mt-4 flex flex-wrap gap-2"
                aria-label={`${project.title} technology stack`}
              >
                {project.stack.map((item) => (
                  <span key={item} className="stat-chip">
                    {item}
                  </span>
                ))}
              </div>
              <p className="mt-4 border-t border-[color:var(--color-line)] pt-4 text-xs leading-relaxed text-[color:var(--color-ink-soft)]">
                {project.detail}
              </p>
            </article>
          ))}
        </div>
      </section>

      <nav
        className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-[color:var(--color-line)] pt-6"
        aria-label="Related dossier pages"
      >
        <Link className="report-link" to="/projects">
          Browse the project roster
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <Link className="report-link" to="/impact-report">
          Review impact evidence
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </nav>
    </main>
  );
}
