import type { ReactElement } from 'react';
import { BadgeCheck, BriefcaseBusiness, GraduationCap, Radar } from 'lucide-react';
import EditorialPoster from '@/components/EditorialPoster';
import { PORTFOLIO_ASSETS } from '@/content/portfolioAssets';
import {
  BREAKING_TICKER,
  SCOUTING_FACTS,
  SCOUTING_FOCUS,
  SCOUTING_NOTES,
  SCOUTING_OVERVIEW,
  SCOUTING_STRENGTHS,
  SITE_META,
  SKILL_PACKAGE,
} from '@/content/portfolioContent';

export default function ScoutingReport(): ReactElement {
  return (
    <div className="lg:ml-72">
      <main className="page-wrap py-6 md:py-8">
        <section className="ticker-shell animate-rise">
          <div className="ticker-label">Live Desk</div>
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

        <section className="mt-6 grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <EditorialPoster
            kicker="Prospect Poster"
            title="Jakye Amos"
            badge="Scouting File"
            media={PORTFOLIO_ASSETS.scouting.portrait}
            tone="gold"
            stat="#JA"
          />

          <div className="editorial-card animate-rise-delayed p-6 md:p-8">
            <div className="section-kicker">Scouting Report</div>
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-secondary)]">
              Draft file 2026-JA | Source-verified through local CV
            </p>
            <h1 className="mt-4 text-5xl font-black uppercase leading-[0.88] tracking-tight text-[color:var(--color-ink)] md:text-7xl">
              {SITE_META.name}
            </h1>
            <p className="mt-4 max-w-4xl text-lg leading-relaxed text-[color:var(--color-ink-soft)] md:text-xl">
              Connective full-stack prospect with real reps across product engineering, workflow
              tooling, analytics, and AI-enabled systems. Early-career profile. Open to
              opportunities in the US or remote.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {SCOUTING_FACTS.map((fact) => (
                <div
                  key={fact.label}
                  className="border border-[color:var(--color-line)] bg-white px-4 py-5"
                >
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
                    {fact.label}
                  </div>
                  <div className="mt-3 text-lg font-black uppercase leading-tight text-[color:var(--color-ink)]">
                    {fact.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
          <article className="grid gap-8">
            <section className="editorial-card p-6 md:p-8">
              <div className="section-kicker">Prospect Overview</div>
              <div className="mt-5 grid gap-5 text-lg leading-relaxed text-[color:var(--color-ink)]">
                {SCOUTING_OVERVIEW.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section className="editorial-card p-6 md:p-8">
              <div className="section-kicker">Strengths</div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {SCOUTING_STRENGTHS.map((strength, index) => (
                  <article
                    key={strength.title}
                    className="border border-[color:var(--color-line)] bg-[color:var(--color-surface-muted)] p-5"
                  >
                    <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-primary)]">
                      0{index + 1}
                    </div>
                    <h2 className="mt-3 text-2xl font-black uppercase leading-none tracking-tight text-[color:var(--color-ink)]">
                      {strength.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-ink-soft)]">
                      {strength.copy}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section className="editorial-card p-6 md:p-8">
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <div className="section-kicker">Current Focus Areas</div>
                  <div className="mt-5 grid gap-4">
                    {SCOUTING_FOCUS.map((focus) => (
                      <article
                        key={focus.title}
                        className="border border-[color:var(--color-line)] bg-white p-5"
                      >
                        <h2 className="text-xl font-black uppercase leading-tight text-[color:var(--color-ink)]">
                          {focus.title}
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-ink-soft)]">
                          {focus.copy}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4">
                  <article className="border border-[color:var(--color-line-strong)] bg-[color:var(--color-primary)] p-5 text-white">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/75">
                      Role Projection
                    </div>
                    <p className="mt-3 text-3xl font-black uppercase leading-none">
                      Initiating full-stack wing
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-white/80">
                      Best deployed where product execution, systems thinking, and hands-on shipping
                      all matter in the same possession.
                    </p>
                  </article>

                  <article className="border border-[color:var(--color-line-strong)] bg-[color:var(--color-navy)] p-5 text-white">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-gold)]">
                      Best Fit
                    </div>
                    <p className="mt-3 text-3xl font-black uppercase leading-none">
                      Early-stage, tooling-heavy, data-rich teams
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-white/80">
                      Especially strong where speed, structure, and cross-stack feel all need to
                      show up together.
                    </p>
                  </article>
                </div>
              </div>
            </section>
          </article>

          <aside className="grid gap-6">
            <section className="editorial-card p-6">
              <div className="flex items-center gap-3">
                <Radar size={18} className="text-[color:var(--color-primary)]" />
                <div className="section-kicker">Front Office Notes</div>
              </div>
              <div className="mt-5 grid gap-4">
                {SCOUTING_NOTES.map((note) => (
                  <article
                    key={note.label}
                    className="border border-[color:var(--color-line)] bg-[color:var(--color-surface-muted)] p-4"
                  >
                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-secondary)]">
                      {note.label}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-ink)]">
                      {note.copy}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section className="editorial-card p-6">
              <div className="flex items-center gap-3">
                <BadgeCheck size={18} className="text-[color:var(--color-primary)]" />
                <div className="section-kicker">Skill Package</div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {SKILL_PACKAGE.map((skill) => (
                  <span key={skill} className="stat-chip">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            <section className="editorial-card p-6">
              <div className="grid gap-5">
                <div>
                  <div className="flex items-center gap-3">
                    <GraduationCap size={18} className="text-[color:var(--color-primary)]" />
                    <div className="section-kicker">Education</div>
                  </div>
                  <p className="mt-4 text-lg font-black uppercase leading-tight text-[color:var(--color-ink)]">
                    Case Western Reserve University
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-ink-soft)]">
                    B.A. in Computer Science with minors in Artificial Intelligence, Applied Data
                    Science, and Statistics. Expected May 2026.
                  </p>
                </div>

                <div className="border-t border-[color:var(--color-line)] pt-5">
                  <div className="flex items-center gap-3">
                    <BriefcaseBusiness size={18} className="text-[color:var(--color-primary)]" />
                    <div className="section-kicker">Leadership</div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-[color:var(--color-ink-soft)]">
                    Vice President of App Developers and Innovators Club, founder of the CWRU Flea
                    Market, and active in sports analytics, community, and Amazon affinity groups.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
