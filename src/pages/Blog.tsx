import type { ReactElement } from 'react';
import { ArrowRight, FileText, NotebookText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS, WEBSITE_LAUNCHES } from '@/content/portfolioContent';

export default function Blog(): ReactElement {
  const featuredPost = BLOG_POSTS[0];

  return (
    <div className="lg:ml-72">
      <main className="page-wrap py-6 md:py-8">
        <section className="editorial-card animate-rise p-6 md:p-8">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div>
              <div className="section-kicker">Blog</div>
              <h1 className="mt-4 text-5xl font-black uppercase leading-[0.88] tracking-tight text-[color:var(--color-ink)] md:text-7xl">
                Longer reads for ideas that need more than a scouting-card blurb.
              </h1>
              <p className="mt-5 max-w-4xl text-lg leading-relaxed text-[color:var(--color-ink-soft)] md:text-xl">
                Project cards are good for proof. Some ideas need argument, definitions, tradeoffs,
                and a place to mature before they become scored work.
              </p>
            </div>

            <aside className="border border-[color:var(--color-line-strong)] bg-[color:var(--color-navy)] p-5 text-white">
              <div className="section-kicker text-[color:var(--color-gold)]">Editor Note</div>
              <p className="mt-3 text-2xl font-black uppercase leading-tight">
                Keep concepts visible without pretending they are shipped products.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/78">
                TMCP gets more room here because the current one-card mention was too thin to
                explain why the idea is interesting.
              </p>
            </aside>
          </div>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <article className="editorial-card p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <NotebookText size={18} className="text-[color:var(--color-primary)]" />
              <div className="section-kicker">{featuredPost.status}</div>
              <span className="stat-chip">{featuredPost.date}</span>
            </div>

            <h2 className="mt-5 text-4xl font-black uppercase leading-[0.95] tracking-tight text-[color:var(--color-ink)] md:text-6xl">
              {featuredPost.title}
            </h2>
            <p className="mt-5 text-xl leading-relaxed text-[color:var(--color-ink-soft)]">
              {featuredPost.deck}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {featuredPost.tags.map((tag) => (
                <span key={tag} className="stat-chip">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-8 border-l-4 border-[color:var(--color-primary)] bg-white px-5 py-5">
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-primary)]">
                Working thesis
              </div>
              <p className="mt-3 text-lg font-semibold leading-relaxed text-[color:var(--color-ink)]">
                {featuredPost.thesis}
              </p>
            </div>

            <div className="mt-8 grid gap-5">
              {featuredPost.sections.map((section) => (
                <section
                  key={section.heading}
                  className="border-t border-[color:var(--color-line)] pt-5"
                >
                  <h3 className="text-3xl font-black uppercase leading-none tracking-tight text-[color:var(--color-ink)]">
                    {section.heading}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-[color:var(--color-ink-soft)]">
                    {section.body}
                  </p>
                </section>
              ))}
            </div>
          </article>

          <aside className="grid gap-6">
            <section className="editorial-card p-6">
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-[color:var(--color-primary)]" />
                <div className="section-kicker">Notebook</div>
              </div>
              <div className="mt-5 grid gap-4">
                {BLOG_POSTS.map((post) => (
                  <article
                    key={post.slug}
                    className="border border-[color:var(--color-line)] bg-white p-5"
                  >
                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-secondary)]">
                      {post.status}
                    </div>
                    <h3 className="mt-3 text-2xl font-black uppercase leading-none tracking-tight text-[color:var(--color-ink)]">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-ink-soft)]">
                      {post.deck}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section className="border border-[color:var(--color-line-strong)] bg-[color:var(--color-surface-muted)] p-6">
              <div className="section-kicker">Related Launches</div>
              <div className="mt-5 grid gap-3">
                {WEBSITE_LAUNCHES.map((site) => (
                  <a
                    key={site.href}
                    href={site.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between gap-4 border border-[color:var(--color-line)] bg-white px-4 py-4 text-sm font-bold uppercase tracking-[0.14em] text-[color:var(--color-ink)] hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
                  >
                    {site.title}
                    <ArrowRight size={15} />
                  </a>
                ))}
              </div>
            </section>

            <section className="editorial-card p-6">
              <div className="section-kicker">Next Drafts</div>
              <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-ink-soft)]">
                Future posts can unpack Chiron&apos;s Forge architecture, FRMWRK Labs positioning,
                or the difference between protocol ideas and productized tools.
              </p>
              <Link className="report-link mt-5" to="/film-room">
                Back to film room
                <ArrowRight size={16} />
              </Link>
            </section>
          </aside>
        </section>
      </main>
    </div>
  );
}
