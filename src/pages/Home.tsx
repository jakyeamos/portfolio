import type { ReactElement } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import EditorialPoster from '@/components/EditorialPoster';
import { PORTFOLIO_ASSETS } from '@/content/portfolioAssets';
import {
  BREAKING_TICKER,
  CLIENT_WORK,
  FILM_ROOM_PROJECTS,
  HERO_PROOF,
  SITE_META,
} from '@/content/portfolioContent';

export default function Home(): ReactElement {
  return (
    <main className="page-wrap py-6 md:py-8">
      <section className="ticker-shell" aria-label="Latest signal">
        <div className="ticker-label">Latest signal</div>
        <div className="ticker-window">
          <p className="ticker-track">{BREAKING_TICKER[0]}</p>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_330px]">
        <div className="editorial-card p-6 md:p-8">
          <div className="section-kicker">Recruiting dossier</div>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-secondary)]">
            Backend engineering · product systems · data and AI workflows
          </p>
          <h1 className="mt-4 max-w-4xl text-5xl font-black uppercase leading-[0.9] tracking-[-0.03em] text-[color:var(--color-ink)] md:text-7xl">
            Software engineer who turns complicated workflows into working products.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[color:var(--color-ink-soft)] md:text-xl">
            {SITE_META.name} connects product, backend, data, and AI workflow systems. The short
            version: Amazon engineering experience, public developer-tool releases, and
            source-backed results from healthcare, operations, and product work.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              className="btn-primary"
              href="/docs/Jakye_Amos_Canonical_Base_Resume.pdf"
              download="Jakye_Amos_Canonical_Base_Resume.pdf"
            >
              Download resume
              <ArrowUpRight className="ml-2" size={16} aria-hidden="true" />
            </a>
            <Link className="btn-secondary" to="/film-room">
              View selected work
              <ArrowRight className="ml-2" size={16} aria-hidden="true" />
            </Link>
          </div>

          <ul
            className="mt-10 grid gap-x-6 gap-y-6 border-t border-[color:var(--color-line)] pt-6 md:grid-cols-3"
            aria-label="Selected proof points"
          >
            {HERO_PROOF.map((proof) => (
              <li key={proof.label}>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-secondary)]">
                  {proof.label}
                </span>
                <span className="mt-2 block text-3xl font-black uppercase leading-none text-[color:var(--color-primary)]">
                  {proof.value}
                </span>
                <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-ink-soft)]">
                  {proof.detail}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <EditorialPoster
          kicker="Prospect poster"
          badge={SITE_META.opportunityStatus}
          title="Jakye Amos"
          subtitle="Backend, AI & product software engineer"
          detail="US / Remote · Available full-time"
          media={PORTFOLIO_ASSETS.home.broadcastLead}
          stat="#JA"
          tone="red"
        />
      </section>

      <section className="mt-14 border-t border-[color:var(--color-line-strong)] pt-6 md:pt-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="section-kicker">Selected work</div>
            <h2 className="mt-3 text-4xl font-black uppercase leading-[0.95] tracking-[-0.03em] text-[color:var(--color-ink)] md:text-5xl">
              Three case studies, with the engineering read up front.
            </h2>
          </div>
          <Link className="report-link shrink-0" to="/film-room">
            Open Film Room
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-6 border-y border-[color:var(--color-line)]">
          {FILM_ROOM_PROJECTS.map((project, index) => (
            <Link
              key={project.title}
              to="/film-room"
              className="group grid gap-3 border-b border-[color:var(--color-line)] py-5 last:border-b-0 md:grid-cols-[minmax(0,0.72fr)_minmax(0,1.2fr)_auto] md:items-center md:gap-6"
              aria-label={`Read the ${project.title} case study`}
            >
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-primary)]">
                  {project.kicker}
                </div>
                <h3 className="mt-2 text-3xl font-black uppercase leading-none tracking-[-0.02em] text-[color:var(--color-ink)] group-hover:text-[color:var(--color-primary)]">
                  {project.title}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-[color:var(--color-ink-soft)]">
                {project.deck}
              </p>
              <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-[color:var(--color-primary)]">
                Read case {index + 1}
                <ArrowRight size={16} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14 border-t border-[color:var(--color-line-strong)] pt-6 md:pt-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="section-kicker">Client & applied systems</div>
            <h2 className="mt-3 text-4xl font-black uppercase leading-[0.95] tracking-[-0.03em] text-[color:var(--color-ink)] md:text-5xl">
              Product work that has to survive contact with real users.
            </h2>
          </div>
          <Link className="report-link shrink-0" to="/film-room">
            Read the work
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
            </article>
          ))}
        </div>
        <p className="mt-4 text-xs leading-relaxed text-[color:var(--color-ink-soft)]">
          Private-beta and client-facing systems are described at a public-safe level; private
          source links and user data are intentionally withheld.
        </p>
      </section>

      <nav
        className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-[color:var(--color-line)] pt-6"
        aria-label="Complete dossier"
      >
        <Link className="report-link" to="/scouting-report">
          Read the scouting report
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <Link className="report-link" to="/projects">
          Browse the project roster
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <Link className="report-link" to="/impact-report">
          Review source-backed impact
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </nav>
    </main>
  );
}
