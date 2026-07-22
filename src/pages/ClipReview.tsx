import { Check, ExternalLink, Eye, TriangleAlert } from 'lucide-react';
import { type ReactElement, useMemo, useState } from 'react';
import { PROJECT_SHOT_CLIPS } from '@/content/shotClips';
import { getPublicProject } from '@/content/publicProjects';

function buildReviewUrl(videoId: string, start: number, end: number): string {
  const params = new URLSearchParams({
    autoplay: '1',
    controls: '1',
    end: String(end),
    enablejsapi: '1',
    mute: '1',
    modestbranding: '1',
    playsinline: '1',
    rel: '0',
    start: String(start),
  });

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

export default function ClipReview(): ReactElement {
  const [selectedClipId, setSelectedClipId] = useState(PROJECT_SHOT_CLIPS[0]?.clipId ?? '');
  const [reviewedClipIds, setReviewedClipIds] = useState<ReadonlySet<string>>(new Set());
  const selectedClip = PROJECT_SHOT_CLIPS.find((clip) => clip.clipId === selectedClipId);
  const selectedProject = selectedClip ? getPublicProject(selectedClip.projectSlug) : undefined;
  const reviewedCount = reviewedClipIds.size;
  const reviewProgress = useMemo(
    () => `${reviewedCount}/${PROJECT_SHOT_CLIPS.length} clips reviewed in this session`,
    [reviewedCount],
  );

  function markReviewed(): void {
    if (!selectedClip) return;
    setReviewedClipIds((current) => new Set(current).add(selectedClip.clipId));
  }

  return (
    <main className="page-wrap py-6 md:py-8" data-clip-review-local="true">
      <header className="max-w-4xl">
        <div className="section-kicker">Local QA · clip review</div>
        <h1 className="mt-4 text-5xl font-black uppercase leading-[0.9] tracking-[-0.03em] text-[color:var(--color-ink)] md:text-7xl">
          Review the window, not the label.
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[color:var(--color-ink-soft)]">
          This development-only surface loads one official source at a time. Check that the window
          starts on the live possession, excludes intro cards and broad footage, and stops before
          commentary runoff.
        </p>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
        <aside
          className="border border-[color:var(--color-line-strong)] bg-[color:var(--color-surface-raised)] p-4 sm:p-5"
          aria-labelledby="clip-review-list"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="section-kicker">Review queue</div>
              <h2 id="clip-review-list" className="mt-2 text-2xl font-black uppercase leading-none">
                {reviewProgress}
              </h2>
            </div>
            <Eye size={20} className="text-[color:var(--color-primary)]" aria-hidden="true" />
          </div>

          <div className="mt-5 grid max-h-[680px] gap-2 overflow-y-auto pr-1">
            {PROJECT_SHOT_CLIPS.map((clip) => {
              const project = getPublicProject(clip.projectSlug);
              const isSelected = clip.clipId === selectedClipId;
              const isReviewed = reviewedClipIds.has(clip.clipId);

              return (
                <button
                  key={clip.clipId}
                  type="button"
                  className={`grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border p-3 text-left ${isSelected ? 'border-[color:var(--color-primary)] bg-[color:var(--color-surface-muted)]' : 'border-[color:var(--color-line)] bg-white hover:border-[color:var(--color-primary)]'}`}
                  onClick={() => setSelectedClipId(clip.clipId)}
                  aria-pressed={isSelected}
                >
                  <span className="font-mono text-[10px] text-[color:var(--color-ink-soft)]">
                    {isReviewed ? <Check size={14} aria-label="Reviewed" /> : '·'}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-black uppercase tracking-[0.08em] text-[color:var(--color-ink)]">
                      {project?.title ?? clip.projectSlug}
                    </span>
                    <span className="mt-1 block truncate text-[10px] font-semibold uppercase tracking-[0.1em] text-[color:var(--color-ink-soft)]">
                      {clip.player} · {clip.moment}
                    </span>
                  </span>
                  <span className="font-mono text-[10px] text-[color:var(--color-ink-soft)]">
                    {clip.start}–{clip.end}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {selectedClip && selectedProject ? (
          <section
            className="border border-[color:var(--color-line-strong)] bg-[color:var(--color-surface-raised)] p-4 sm:p-5"
            aria-labelledby="selected-clip-heading"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="section-kicker">
                  {selectedProject.title} · {selectedClip.source}
                </div>
                <h2
                  id="selected-clip-heading"
                  className="mt-2 text-3xl font-black uppercase leading-none"
                >
                  {selectedClip.player}: {selectedClip.moment}
                </h2>
              </div>
              <a
                href={selectedClip.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="report-link"
              >
                Open source
                <ExternalLink size={15} aria-hidden="true" />
              </a>
            </div>

            <div className="mt-5 overflow-hidden border border-[color:var(--color-line-strong)] bg-[color:var(--color-navy)]">
              <div className="aspect-video">
                <iframe
                  key={selectedClip.clipId}
                  title={`Review ${selectedClip.player}: ${selectedClip.moment}`}
                  src={buildReviewUrl(selectedClip.videoId, selectedClip.start, selectedClip.end)}
                  className="h-full w-full border-0"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  data-review-start={selectedClip.start}
                  data-review-end={selectedClip.end}
                />
              </div>
            </div>

            <dl className="mt-5 grid gap-4 border-y border-[color:var(--color-line)] py-4 sm:grid-cols-3">
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-[color:var(--color-ink-soft)]">
                  Start
                </dt>
                <dd className="mt-1 text-2xl font-black text-[color:var(--color-ink)]">
                  {selectedClip.start}s
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-[color:var(--color-ink-soft)]">
                  End
                </dt>
                <dd className="mt-1 text-2xl font-black text-[color:var(--color-ink)]">
                  {selectedClip.end}s
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-[color:var(--color-ink-soft)]">
                  Window
                </dt>
                <dd className="mt-1 text-2xl font-black text-[color:var(--color-primary)]">
                  {selectedClip.end - selectedClip.start}s
                </dd>
              </div>
            </dl>

            <div className="mt-5 grid gap-3">
              <div className="flex items-start gap-3 border border-[color:var(--color-line)] bg-white p-3 text-sm leading-relaxed text-[color:var(--color-ink)]">
                <TriangleAlert
                  size={17}
                  className="mt-0.5 shrink-0 text-[color:var(--color-primary)]"
                  aria-hidden="true"
                />
                <span>
                  Watch for intro cards, wrong game segments, broad highlight packages, and
                  commentary that continues after the reviewed moment.
                </span>
              </div>
              <p className="text-xs leading-relaxed text-[color:var(--color-ink-soft)]">
                {selectedClip.verificationNote}
              </p>
              <button type="button" className="btn-secondary w-fit" onClick={markReviewed}>
                <Check size={15} aria-hidden="true" />
                Mark reviewed in this session
              </button>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
