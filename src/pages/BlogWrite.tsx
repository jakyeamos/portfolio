import { type ChangeEvent, type ReactElement, useMemo, useState } from 'react';
import { CheckSquare, ClipboardList, FileCode2, Github, PenLine, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

type DestinationId = 'portfolio' | 'frmwrk';

type Destination = {
  id: DestinationId;
  label: string;
  repo: string;
  pathPattern: string;
  writingProfilePath?: string;
};

const DESTINATIONS: readonly Destination[] = [
  {
    id: 'portfolio',
    label: 'Portfolio blog',
    repo: 'jakyeamos/portfolio',
    pathPattern: 'src/content/blog/{slug}.md',
  },
  {
    id: 'frmwrk',
    label: 'FRMWRK Labs',
    repo: 'jakyeamos/frmwrklabs',
    pathPattern: '_posts/{date}-{slug}.md',
    writingProfilePath: '/Users/jakyeamos/projects/frmwrklabs/WRITING_PROFILE.md',
  },
] as const;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toIsoDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function quoteYaml(value: string): string {
  return `"${value.replaceAll('"', '\\"')}"`;
}

function destinationPath(destination: Destination, slug: string, date: string): string {
  return destination.pathPattern.replace('{slug}', slug).replace('{date}', date);
}

export default function BlogWrite(): ReactElement {
  const [title, setTitle] = useState('TMCP: a protocol idea for durable AI workflow context');
  const [deck, setDeck] = useState(
    'A working note on how context, constraints, and handoffs should move across AI-assisted work.',
  );
  const [thesis, setThesis] = useState(
    'TMCP is useful if it treats context as structured infrastructure instead of temporary chat history.',
  );
  const [body, setBody] = useState(
    '## Working note\n\nDraft the argument here. Keep headings as Markdown sections so the portfolio renderer and FRMWRK static blog can both consume the same post body.',
  );
  const [selectedDestinations, setSelectedDestinations] = useState<Set<DestinationId>>(
    () => new Set<DestinationId>(['portfolio', 'frmwrk']),
  );

  const slug = useMemo(() => slugify(title) || 'untitled-post', [title]);
  const today = useMemo(() => toIsoDate(new Date()), []);
  const selectedDestinationList = DESTINATIONS.filter((destination) =>
    selectedDestinations.has(destination.id),
  );
  const markdown = useMemo(
    () => `---
title: ${quoteYaml(title)}
deck: ${quoteYaml(deck)}
status: "Draft"
date: ${quoteYaml(today)}
tags: []
thesis: ${quoteYaml(thesis)}
---

${body}
`,
    [body, deck, thesis, title, today],
  );
  const bipPayload = useMemo(
    () =>
      JSON.stringify(
        {
          source: 'portfolio-local-writer',
          kind: 'blog-crosspost-draft',
          slug,
          title,
          date: today,
          canonicalMarkdown: markdown,
          targets: selectedDestinationList.map((destination) => ({
            id: destination.id,
            label: destination.label,
            repo: destination.repo,
            path: destinationPath(destination, slug, today),
            writingProfilePath: destination.writingProfilePath,
          })),
        },
        null,
        2,
      ),
    [markdown, selectedDestinationList, slug, title, today],
  );

  function updateDestination(event: ChangeEvent<HTMLInputElement>, id: DestinationId): void {
    setSelectedDestinations((current) => {
      const next = new Set(current);
      if (event.target.checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }

  return (
    <div className="lg:ml-72">
      <main className="page-wrap py-6 md:py-8">
        <section className="editorial-card animate-rise p-6 md:p-8">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <div className="section-kicker">Local Writer</div>
              <h1 className="mt-4 text-5xl font-black uppercase leading-[0.88] tracking-tight text-[color:var(--color-ink)] md:text-7xl">
                Draft once, hand BIP the repo targets.
              </h1>
              <p className="mt-5 max-w-4xl text-lg leading-relaxed text-[color:var(--color-ink-soft)] md:text-xl">
                This local-only surface emits one Markdown post and a BIP crosspost payload. BIP can
                own draft hosting, review, and pushing the same content into both repos.
              </p>
            </div>

            <aside className="border border-[color:var(--color-line-strong)] bg-[color:var(--color-navy)] p-5 text-white">
              <div className="flex items-center gap-3">
                <ClipboardList size={18} className="text-[color:var(--color-gold)]" />
                <div className="section-kicker text-[color:var(--color-gold)]">Publishing Model</div>
              </div>
              <p className="mt-3 text-2xl font-black uppercase leading-tight">
                Portfolio and FRMWRK consume Markdown. BIP coordinates the write.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/78">
                The deployed portfolio should stay read-only until BIP or another trusted backend
                handles authenticated repository writes.
              </p>
            </aside>
          </div>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <form className="editorial-card p-6 md:p-8">
            <div className="flex items-center gap-3">
              <PenLine size={18} className="text-[color:var(--color-primary)]" />
              <div className="section-kicker">Draft</div>
            </div>

            <label className="mt-6 block">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-primary)]">
                Title
              </span>
              <input
                className="mt-2 w-full border border-[color:var(--color-line)] bg-white px-4 py-3 text-lg font-semibold text-[color:var(--color-ink)]"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </label>

            <label className="mt-5 block">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-primary)]">
                Deck
              </span>
              <textarea
                className="mt-2 min-h-24 w-full border border-[color:var(--color-line)] bg-white px-4 py-3 text-base leading-relaxed text-[color:var(--color-ink)]"
                value={deck}
                onChange={(event) => setDeck(event.target.value)}
              />
            </label>

            <label className="mt-5 block">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-primary)]">
                Thesis
              </span>
              <textarea
                className="mt-2 min-h-24 w-full border border-[color:var(--color-line)] bg-white px-4 py-3 text-base leading-relaxed text-[color:var(--color-ink)]"
                value={thesis}
                onChange={(event) => setThesis(event.target.value)}
              />
            </label>

            <label className="mt-5 block">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-primary)]">
                Body
              </span>
              <textarea
                className="mt-2 min-h-72 w-full border border-[color:var(--color-line)] bg-white px-4 py-3 font-mono text-sm leading-relaxed text-[color:var(--color-ink)]"
                value={body}
                onChange={(event) => setBody(event.target.value)}
              />
            </label>
          </form>

          <aside className="grid gap-6">
            <section className="editorial-card p-6">
              <div className="flex items-center gap-3">
                <CheckSquare size={18} className="text-[color:var(--color-primary)]" />
                <div className="section-kicker">Repo Targets</div>
              </div>
              <div className="mt-5 grid gap-3">
                {DESTINATIONS.map((destination) => (
                  <label
                    key={destination.id}
                    className="flex cursor-pointer gap-3 border border-[color:var(--color-line)] bg-white p-4"
                  >
                    <input
                      className="mt-1 h-4 w-4 accent-[color:var(--color-primary)]"
                      type="checkbox"
                      checked={selectedDestinations.has(destination.id)}
                      onChange={(event) => updateDestination(event, destination.id)}
                    />
                    <span>
                      <span className="block text-sm font-black uppercase tracking-[0.12em] text-[color:var(--color-ink)]">
                        {destination.label}
                      </span>
                      <span className="mt-1 block font-mono text-xs text-[color:var(--color-secondary)]">
                        {destination.repo}
                      </span>
                      <span className="mt-2 block break-words font-mono text-xs text-[color:var(--color-ink-soft)]">
                        {destinationPath(destination, slug, today)}
                      </span>
                      {destination.writingProfilePath ? (
                        <span className="mt-2 block break-words text-xs font-semibold leading-relaxed text-[color:var(--color-primary)]">
                          Writing profile: {destination.writingProfilePath}
                        </span>
                      ) : null}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            <section className="border border-[color:var(--color-line-strong)] bg-[color:var(--color-navy)] p-6 text-white">
              <div className="flex items-center gap-3">
                <FileCode2 size={18} className="text-[color:var(--color-gold)]" />
                <div className="section-kicker text-[color:var(--color-gold)]">BIP Payload</div>
              </div>
              <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap border border-white/15 bg-white/5 p-4 text-xs leading-relaxed text-white/85">
                {bipPayload}
              </pre>
            </section>

            <section className="editorial-card p-6">
              <div className="section-kicker">Canonical Markdown</div>
              <pre className="mt-4 max-h-96 overflow-auto whitespace-pre-wrap border border-[color:var(--color-line)] bg-white p-4 text-xs leading-relaxed text-[color:var(--color-ink)]">
                {markdown}
              </pre>
              <Link className="report-link mt-5" to="/blog">
                Back to blog
                <Send size={16} />
              </Link>
            </section>
          </aside>
        </section>
      </main>
    </div>
  );
}
