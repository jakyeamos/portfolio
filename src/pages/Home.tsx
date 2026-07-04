import type { ReactElement } from 'react';
import { ArrowRight, ArrowUpRight, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';
import EditorialPoster from '@/components/EditorialPoster';
import { PORTFOLIO_ASSETS } from '@/content/portfolioAssets';
import { CURRENT_PROJECTS, type CurrentProject } from '@/content/currentProjects';
import {
  BREAKING_TICKER,
  FEATURE_REPORTS,
  HERO_ACTIONS,
  HERO_PROOF,
  HIRING_MANAGER_READ,
  IMPACT_METRICS,
  SITE_META,
  TOP_HEADLINES,
  WEBSITE_LAUNCHES,
} from '@/content/portfolioContent';

const NOW_PLAYING_PROJECTS = [...CURRENT_PROJECTS]
  .sort((first, second) => second.lastUpdated.localeCompare(first.lastUpdated))
  .slice(0, 4);

function getProjectStatusLabel(status: CurrentProject['trackerStatus']): string {
  if (status === 'on_track') return 'Active';
  if (status === 'needs_attention') return 'In development';
  if (status === 'stalled') return 'On deck';
  return 'Shipped';
}

function getProjectStatusClass(status: CurrentProject['trackerStatus']): string {
  if (status === 'on_track') return 'text-[color:var(--color-secondary)]';
  if (status === 'needs_attention') return 'text-[color:var(--color-gold)]';
  return 'text-[color:var(--color-primary)]';
}

function HomeAction({
  href,
  label,
  kind,
  variant,
  download = false,
  downloadFileName,
}: {
  href: string;
  label: string;
  kind: 'route' | 'external';
  variant: 'primary' | 'secondary' | 'ghost';
  download?: boolean;
  downloadFileName?: string;
}): ReactElement {
  const className =
    variant === 'primary' ? 'btn-primary' : variant === 'secondary' ? 'btn-secondary' : 'btn-ghost';

  if (kind === 'route') {
    return (
      <Link className={className} to={href}>
        {label}
      </Link>
    );
  }

  return (
    <a
      className={className}
      href={href}
      download={download ? (downloadFileName ?? true) : undefined}
    >
      {label}
    </a>
  );
}

export default function Home(): ReactElement {
  return (
    <main className="page-wrap py-6 md:py-8">
      <section className="ticker-shell animate-rise">
        <div className="ticker-label">Breaking</div>
        <div className="ticker-window">
          <div className="ticker-track">
            {[...BREAKING_TICKER, ...BREAKING_TICKER].map((item, index) => (
              <span key={`${item}-${index}`} className="ticker-item">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.85fr)_340px]">
        <section className="editorial-card animate-rise-delayed p-6 md:p-8">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.08fr)_330px]">
            <div>
              <div className="section-kicker">Cover Story</div>
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-[color:var(--color-secondary)]">
                Full-stack | Data + AI | Early Career | Open to opportunities
              </p>
              <h1 className="mt-4 max-w-4xl text-5xl font-black uppercase leading-[0.88] tracking-tight text-[color:var(--color-ink)] md:text-7xl">
                Full-stack engineer with Amazon reps, startup pace, and source-backed results.
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[color:var(--color-ink-soft)] md:text-xl">
                {SITE_META.name} builds across product, backend, data, and AI workflow systems, with
                a track record that reads quickly: Amazon from 2023 through 2025, a Cleveland Clinic
                MVP shipped in 2 weeks, public developer-tool packages across PyPI and npm, and an
                architecture-firm productivity build that drove 400% output growth.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="stat-chip">{SITE_META.location}</span>
                <span className="stat-chip">{SITE_META.school}</span>
                <span className="stat-chip">{SITE_META.graduation}</span>
                <span className="stat-chip">Amazon 2023-2025</span>
                <span className="stat-chip">PyPI + npm releases</span>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {HERO_ACTIONS.map((action) => (
                  <HomeAction
                    key={action.label}
                    href={action.href}
                    kind={action.kind}
                    label={action.label}
                    variant={action.variant}
                    download={action.download}
                    downloadFileName={action.downloadFileName}
                  />
                ))}
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {HERO_PROOF.map((proof) => (
                  <article
                    key={proof.label}
                    className="border border-[color:var(--color-line)] bg-white px-5 py-5"
                  >
                    <div className="text-3xl font-black uppercase leading-none text-[color:var(--color-primary)] md:text-4xl">
                      {proof.value}
                    </div>
                    <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-secondary)]">
                      {proof.label}
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-ink)]">
                      {proof.detail}
                    </p>
                  </article>
                ))}
              </div>

              <section className="mt-8 border-t border-[color:var(--color-line)] pt-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="section-kicker">Hiring Manager Read</div>
                    <h2 className="mt-2 text-3xl font-black uppercase leading-none tracking-tight text-[color:var(--color-ink)]">
                      What to do with the tape.
                    </h2>
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
                    Resume | Projects | Scouting report | Email
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {HIRING_MANAGER_READ.map((note) => (
                    <article
                      key={note.label}
                      className="border border-[color:var(--color-line)] bg-[color:var(--color-surface-muted)] p-4"
                    >
                      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-secondary)]">
                        {note.label}
                      </div>
                      <h3 className="mt-2 text-xl font-black uppercase leading-tight text-[color:var(--color-ink)]">
                        {note.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-ink)]">
                        {note.copy}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            <EditorialPoster
              kicker="Prospect Poster"
              badge="Cover Story"
              title="Scout the file"
              media={PORTFOLIO_ASSETS.home.broadcastLead}
              stat="#JA"
              tone="red"
            />
          </div>
        </section>

        <aside className="grid gap-6">
          <section className="editorial-card bg-white/70 p-5">
            <div className="section-kicker">Latest Signals</div>
            <div className="mt-4 grid gap-4">
              {TOP_HEADLINES.slice(0, 3).map((headline) => (
                <Link
                  key={headline.title}
                  to={headline.href}
                  className="group border-b border-[color:var(--color-line)] pb-4 last:border-none last:pb-0"
                >
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-primary)]">
                    {headline.category}
                  </div>
                  <h2 className="mt-2 text-lg font-black uppercase leading-tight tracking-tight text-[color:var(--color-ink)] transition group-hover:text-[color:var(--color-primary)]">
                    {headline.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-ink-soft)]">
                    {headline.meta}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </aside>
      </div>

      <section className="mt-8 editorial-card p-6 md:p-8">
        <div className="flex flex-col gap-5 border-b border-[color:var(--color-line)] pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="section-kicker">Live Launches</div>
            <h2 className="mt-3 max-w-4xl text-4xl font-black uppercase leading-[0.92] tracking-tight text-[color:var(--color-ink)] md:text-5xl">
              New sites that should not be buried in the notebook.
            </h2>
          </div>
          <Link className="report-link shrink-0" to="/film-room">
            Open film room
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {WEBSITE_LAUNCHES.map((site) => (
            <a
              key={site.href}
              href={site.href}
              target="_blank"
              rel="noreferrer"
              className="group flex min-h-48 flex-col justify-between border border-[color:var(--color-line-strong)] bg-white p-6 hover:-translate-y-1 hover:border-[color:var(--color-primary)] hover:shadow-[0_18px_36px_rgba(16,28,44,0.08)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-primary)]">
                  {site.label}
                </div>
                <span className="flex size-10 shrink-0 items-center justify-center border border-[color:var(--color-primary)] text-[color:var(--color-primary)] group-hover:bg-[color:var(--color-primary)] group-hover:text-white">
                  <ArrowUpRight size={18} />
                </span>
              </div>
              <div>
                <h3 className="mt-6 text-4xl font-black uppercase leading-none tracking-tight text-[color:var(--color-ink)] transition group-hover:text-[color:var(--color-primary)] md:text-5xl">
                  {site.title}
                </h3>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-[color:var(--color-ink-soft)]">
                  {site.copy}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-8 editorial-card p-6 md:p-8">
        <div className="flex flex-col gap-5 border-b border-[color:var(--color-line)] pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="section-kicker">Now Playing</div>
            <h2 className="mt-3 max-w-4xl text-4xl font-black uppercase leading-[0.92] tracking-tight text-[color:var(--color-ink)] md:text-5xl">
              The current board maps tracker health on X and the selected project axis on Y.
            </h2>
          </div>
          <Link className="report-link shrink-0" to="/projects">
            Open court matrix
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-4">
          {NOW_PLAYING_PROJECTS.map((project) => (
            <Link
              key={project.slug}
              to="/projects"
              className="group flex min-h-[280px] flex-col border border-[color:var(--color-line)] bg-white p-5 hover:-translate-y-1 hover:border-[color:var(--color-primary)] hover:shadow-[0_18px_36px_rgba(16,28,44,0.08)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-[color:var(--color-navy)] text-xl font-black uppercase text-white">
                  {project.shortCode}
                </div>
                <div className="text-right">
                  <div
                    className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${getProjectStatusClass(project.trackerStatus)}`}
                  >
                    {getProjectStatusLabel(project.trackerStatus)}
                  </div>
                  <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
                    {project.lastUpdated}
                  </div>
                </div>
              </div>

              <h3 className="mt-5 text-3xl font-black uppercase leading-none tracking-tight text-[color:var(--color-ink)] transition group-hover:text-[color:var(--color-primary)]">
                {project.title}
              </h3>
              <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-[color:var(--color-ink-soft)]">
                {project.summary}
              </p>

              <div className="mt-auto pt-5">
                <div className="flex flex-col gap-4 border-t border-[color:var(--color-line)] pt-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
                      Tracker health
                    </div>
                    <div className="mt-1 text-4xl font-black uppercase leading-none text-[color:var(--color-primary)]">
                      {project.trackerScore}
                    </div>
                  </div>
                  <div className="text-sm font-semibold leading-snug text-[color:var(--color-ink)] sm:max-w-[150px] sm:text-right sm:text-xs">
                    {project.scoutTake}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        {FEATURE_REPORTS.map((report) => (
          <article key={report.title} className="editorial-card p-6">
            <div className="section-kicker">{report.kicker}</div>
            <h2 className="mt-4 text-3xl font-black uppercase leading-none tracking-tight text-[color:var(--color-ink)]">
              {report.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[color:var(--color-ink-soft)]">
              {report.copy}
            </p>
            <Link className="report-link mt-6" to={report.href}>
              {report.cta}
              <ArrowRight size={16} />
            </Link>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
        <article className="editorial-card p-6 md:p-8">
          <div className="section-kicker">Scoreboard</div>
          <h2 className="mt-4 text-4xl font-black uppercase leading-[0.92] tracking-tight text-[color:var(--color-ink)] md:text-5xl">
            Real swings from the source file, translated like a game broadcast.
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-[color:var(--color-ink-soft)]">
            The numbers below stay tied to the local CV. If a project only has a qualitative result
            on record, the site keeps it qualitative instead of padding the box score.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {IMPACT_METRICS.map((metric) => (
              <div
                key={metric.label}
                className="border border-[color:var(--color-line)] bg-white px-5 py-6"
              >
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-ink-soft)]">
                  {metric.label}
                </div>
                <div className="mt-3 whitespace-nowrap text-[clamp(2.5rem,4vw,4rem)] font-black uppercase leading-none text-[color:var(--color-primary)]">
                  {metric.value}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-ink)]">
                  {metric.detail}
                </p>
              </div>
            ))}
          </div>
        </article>

        <div className="grid gap-6">
          <article className="border border-[color:var(--color-line-strong)] bg-[color:var(--color-navy)] p-6 text-white">
            <div className="section-kicker text-[color:var(--color-gold)]">Scout Translation</div>
            <p className="mt-3 text-2xl font-black uppercase leading-tight">
              Push tempo. Clean the possession. Leave the unit better organized than you found it.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/78">
              That is still the cleanest read on the profile, and it does not need a second giant
              poster block to land.
            </p>
            <Link
              className="btn-secondary mt-6 !border-white !text-white hover:!bg-white hover:!text-[color:var(--color-navy)]"
              to="/impact-report"
            >
              Open impact report
            </Link>
          </article>

          <article className="editorial-card p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="section-kicker">Broadcast Package</div>
                <h2 className="mt-3 text-3xl font-black uppercase leading-none tracking-tight text-[color:var(--color-ink)]">
                  Optional, compact, and no longer stretching the page.
                </h2>
              </div>
              <Link className="report-link" to="/film-room">
                Open film room
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="mt-6 border border-[color:var(--color-line)] bg-[color:var(--color-surface-muted)] p-5">
              <div className="flex items-center gap-3 text-[color:var(--color-primary)]">
                <Radio size={18} />
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em]">
                  Analyst script shell
                </span>
              </div>
              <p className="mt-4 text-lg font-semibold leading-relaxed text-[color:var(--color-ink)]">
                "Jakye Amos enters this class as a high-feel full-stack prospect with Amazon reps,
                startup pace, and a tape full of connective winning plays."
              </p>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
