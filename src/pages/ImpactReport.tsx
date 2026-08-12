import { type ReactElement, useState } from 'react';
import { ArrowRight, ClipboardPenLine, Gauge } from 'lucide-react';
import { Link } from 'react-router-dom';
import EditorialPoster from '@/components/EditorialPoster';
import {
  IMPACT_CASES,
  IMPACT_COMPARISON_ROWS,
  IMPACT_METRICS,
  IMPACT_SUPPORTING_STATS,
} from '@/content/portfolioContent';

function metricTone(kicker: string): 'red' | 'blue' | 'gold' {
  if (kicker === 'Healthcare') {
    return 'red';
  }

  if (kicker === 'Deepr') {
    return 'gold';
  }

  return 'blue';
}

export default function ImpactReport(): ReactElement {
  const [activeCaseTitle, setActiveCaseTitle] = useState<string>(IMPACT_CASES[0].title);
  const activeCase = IMPACT_CASES.find((item) => item.title === activeCaseTitle) ?? IMPACT_CASES[0];

  return (
    <div>
      <main
        className="page-wrap py-6 md:py-8"
        data-mac-control-id="portfolio.impact-report.surface"
        data-task-state="impact_report_ready"
      >
        <section className="editorial-card p-6 md:p-8">
          <div className="max-w-5xl">
            <div className="section-kicker">Impact Report</div>
            <h1 className="mt-4 max-w-[12ch] text-5xl font-black uppercase leading-[0.88] tracking-tight text-[color:var(--color-ink)] md:text-7xl">
              Winning plays on the record. No fake stat-padding.
            </h1>
            <p className="mt-5 max-w-4xl text-lg leading-relaxed text-[color:var(--color-ink-soft)] md:text-xl">
              The headline lives up top now and the board sits directly under it. Same source-backed
              outcomes, cleaner hierarchy, less dead air.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {IMPACT_METRICS.map((metric) => (
              <div
                key={metric.label}
                className="border border-[color:var(--color-line)] bg-white px-5 py-6"
              >
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
                  {metric.label}
                </div>
                <div className="mt-3 whitespace-nowrap text-[clamp(2.5rem,3vw,4rem)] font-black uppercase leading-none text-[color:var(--color-primary)]">
                  {metric.value}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-ink)]">
                  {metric.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 editorial-card p-6 md:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="section-kicker">Case Board</div>
              <h2 className="mt-3 text-4xl font-black uppercase leading-none tracking-tight text-[color:var(--color-ink)]">
                One engagement at a time.
              </h2>
            </div>
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
              Before / with Jakye / reported result
            </div>
          </div>

          <div className="mt-6 grid gap-3 lg:grid-cols-4">
            {IMPACT_CASES.map((item) => {
              const isActive = item.title === activeCase.title;

              return (
                <button
                  key={item.title}
                  type="button"
                  className={`board-tab ${isActive ? 'board-tab-active' : ''}`}
                  onClick={() => setActiveCaseTitle(item.title)}
                >
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-primary)]">
                    {item.kicker}
                  </div>
                  <div className="mt-2 text-2xl font-black uppercase leading-none tracking-tight text-[color:var(--color-ink)]">
                    {item.title}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-ink-soft)]">
                    {item.result}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-8 grid items-start gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
          <EditorialPoster
            kicker={activeCase.kicker}
            title={activeCase.title}
            subtitle={activeCase.summary}
            badge="Source-backed case"
            detail="Scoreboard stays tied to the local file."
            tone={metricTone(activeCase.kicker)}
          />

          <article className="editorial-card min-w-0 p-6 md:p-8">
            <div className="section-kicker">Active Case</div>
            <h2 className="mt-4 text-4xl font-black uppercase leading-none tracking-tight text-[color:var(--color-ink)]">
              {activeCase.title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-[color:var(--color-ink-soft)]">
              {activeCase.summary}
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="border border-[color:var(--color-line)] bg-[color:var(--color-surface-muted)] p-5">
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-ink-soft)]">
                  Before / baseline
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-ink)]">
                  {activeCase.before}
                </p>
              </div>
              <div className="border border-[color:var(--color-line)] bg-white p-5">
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-primary)]">
                  With Jakye
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-ink)]">
                  {activeCase.after}
                </p>
              </div>
            </div>

            <div className="mt-5 border-t border-[color:var(--color-line)] pt-5">
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-secondary)]">
                Reported result
              </div>
              <p className="mt-3 text-2xl font-black uppercase leading-tight text-[color:var(--color-primary)]">
                {activeCase.result}
              </p>
            </div>
          </article>
        </section>

        <section className="mt-8 grid items-start gap-6 xl:grid-cols-[minmax(0,1.05fr)_360px]">
          <article className="editorial-card min-w-0 p-6 md:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="section-kicker">On-Off Table</div>
                <h2 className="mt-3 text-4xl font-black uppercase leading-none tracking-tight text-[color:var(--color-ink)]">
                  Baseline to improved-state board.
                </h2>
              </div>
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
                Manual / automated | fragmented / structured
              </div>
            </div>

            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[color:var(--color-line-strong)] text-[10px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-ink-soft)]">
                    <th className="pb-4 pr-4">Engagement</th>
                    <th className="pb-4 pr-4">Baseline</th>
                    <th className="pb-4 pr-4">Improved state</th>
                    <th className="pb-4">Reported result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[color:var(--color-line)]">
                  {IMPACT_COMPARISON_ROWS.map((row) => (
                    <tr key={row.engagement}>
                      <td className="py-4 pr-4 text-sm font-black uppercase text-[color:var(--color-ink)]">
                        {row.engagement}
                      </td>
                      <td className="py-4 pr-4 text-sm leading-relaxed text-[color:var(--color-ink-soft)]">
                        {row.baseline}
                      </td>
                      <td className="py-4 pr-4 text-sm leading-relaxed text-[color:var(--color-ink-soft)]">
                        {row.improved}
                      </td>
                      <td className="py-4 text-sm font-semibold leading-relaxed text-[color:var(--color-primary)]">
                        {row.result}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <aside className="grid min-w-0 gap-6">
            <section className="editorial-card p-6">
              <div className="flex items-center gap-3">
                <Gauge size={18} className="text-[color:var(--color-primary)]" />
                <div className="section-kicker">Supporting Stats</div>
              </div>
              <div className="mt-5 grid gap-4">
                {IMPACT_SUPPORTING_STATS.map((stat) => (
                  <article
                    key={stat.label}
                    className="border border-[color:var(--color-line)] bg-white p-4"
                  >
                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
                      {stat.label}
                    </div>
                    <p className="mt-2 text-2xl font-black uppercase leading-none text-[color:var(--color-ink)]">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-ink-soft)]">
                      {stat.copy}
                    </p>
                  </article>
                ))}
              </div>
            </section>
            <section className="editorial-card p-6">
              <div className="flex items-center gap-3">
                <ClipboardPenLine size={18} className="text-[color:var(--color-primary)]" />
                <div className="section-kicker">Next Read</div>
              </div>
              <p className="mt-4 text-base leading-relaxed text-[color:var(--color-ink-soft)]">
                If the scoreboard is enough, go back to the scouting report. If you want the live
                tracker board, jump to current projects.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link className="btn-primary" to="/scouting-report">
                  Back to scouting report
                </Link>
                <Link className="btn-ghost" to="/projects">
                  Open current projects
                </Link>
              </div>
              <Link className="report-link mt-6" to="/film-room">
                Watch the tape
                <ArrowRight size={16} />
              </Link>
            </section>
          </aside>
        </section>
      </main>
    </div>
  );
}
