import { type ChangeEvent, type ReactElement, useMemo, useState } from 'react';
import { CheckSquare, ClipboardList, Github, PenLine, Send, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

type DestinationId = 'portfolio' | 'frmwrk' | 'twitter' | 'bip';

type Destination = {
  id: DestinationId;
  label: string;
  detail: string;
  status: string;
};

const DESTINATIONS: readonly Destination[] = [
  {
    id: 'portfolio',
    label: 'Portfolio blog',
    detail: 'Add the post to this portfolio blog data source.',
    status: 'Needs repository commit',
  },
  {
    id: 'frmwrk',
    label: 'FRMWRK Labs',
    detail: 'Create a matching markdown post for frmwrklabs/_posts and rebuild the static blog.',
    status: 'Needs GitHub push',
  },
  {
    id: 'twitter',
    label: 'Twitter',
    detail: 'Prepare a short social version for the BIP/social posting lane.',
    status: 'Needs BIP integration',
  },
  {
    id: 'bip',
    label: 'BIP queue',
    detail: 'Hand the post payload to BIP for automation, review, or distribution.',
    status: 'Integration target',
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

export default function BlogWrite(): ReactElement {
  const [title, setTitle] = useState('TMCP: a protocol idea for durable AI workflow context');
  const [excerpt, setExcerpt] = useState(
    'A working note on how context, constraints, and handoffs should move across AI-assisted work.',
  );
  const [body, setBody] = useState(
    'TMCP needs a fuller definition before it belongs on the scored project board. The useful shape is a protocol-style layer for carrying context, constraints, and workflow state across agents, tools, and sessions.',
  );
  const [selectedDestinations, setSelectedDestinations] = useState<Set<DestinationId>>(
    () => new Set<DestinationId>(['portfolio']),
  );

  const slug = useMemo(() => slugify(title) || 'untitled-post', [title]);
  const today = useMemo(() => toIsoDate(new Date()), []);
  const selectedDestinationList = DESTINATIONS.filter((destination) =>
    selectedDestinations.has(destination.id),
  );
  const markdown = useMemo(
    () => `---
title: "${title.replaceAll('"', '\\"')}"
date: "${today}"
slug: "${slug}"
excerpt: "${excerpt.replaceAll('"', '\\"')}"
destinations: [${selectedDestinationList.map((destination) => destination.id).join(', ')}]
---

${body}
`,
    [body, excerpt, selectedDestinationList, slug, title, today],
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
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div>
              <div className="section-kicker">Writer Desk</div>
              <h1 className="mt-4 text-5xl font-black uppercase leading-[0.88] tracking-tight text-[color:var(--color-ink)] md:text-7xl">
                Draft a post, then choose where it should publish.
              </h1>
              <p className="mt-5 max-w-4xl text-lg leading-relaxed text-[color:var(--color-ink-soft)] md:text-xl">
                This is the owner-side control surface. The checkboxes define intent; GitHub pushes,
                FRMWRK static-blog writes, and Twitter/BIP distribution still need a server-side
                handoff before they can run automatically.
              </p>
            </div>

            <aside className="border border-[color:var(--color-line-strong)] bg-[color:var(--color-navy)] p-5 text-white">
              <div className="flex items-center gap-3">
                <ClipboardList size={18} className="text-[color:var(--color-gold)]" />
                <div className="section-kicker text-[color:var(--color-gold)]">
                  Publishing Model
                </div>
              </div>
              <p className="mt-3 text-2xl font-black uppercase leading-tight">
                Checkboxes create a publish plan. They do not silently post anywhere.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/78">
                Automatic crossposting should be handled by a trusted backend, BIP, or a GitHub
                workflow that receives this payload.
              </p>
            </aside>
          </div>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
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
                Excerpt
              </span>
              <textarea
                className="mt-2 min-h-24 w-full border border-[color:var(--color-line)] bg-white px-4 py-3 text-base leading-relaxed text-[color:var(--color-ink)]"
                value={excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
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
                <div className="section-kicker">Destinations</div>
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
                      <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--color-secondary)]">
                        {destination.status}
                      </span>
                      <span className="mt-2 block text-sm leading-relaxed text-[color:var(--color-ink-soft)]">
                        {destination.detail}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </section>

            <section className="border border-[color:var(--color-line-strong)] bg-[color:var(--color-navy)] p-6 text-white">
              <div className="section-kicker text-[color:var(--color-gold)]">Publish Plan</div>
              <div className="mt-4 grid gap-3">
                <div className="border border-white/15 bg-white/5 p-4">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
                    Slug
                  </div>
                  <div className="mt-1 break-words font-mono text-sm text-white">{slug}</div>
                </div>
                {selectedDestinationList.map((destination) => (
                  <div key={destination.id} className="flex items-start gap-3 text-sm text-white/80">
                    {destination.id === 'twitter' ? <Twitter size={16} /> : <Github size={16} />}
                    <span>{destination.detail}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="editorial-card p-6">
              <div className="section-kicker">Generated Markdown</div>
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
