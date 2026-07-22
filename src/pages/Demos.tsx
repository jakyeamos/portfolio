import { type ReactElement, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DEMO_VIDEOS } from '@/content/demoVideos';
import { getPublicProject } from '@/content/publicProjects';
import DemoVideoPlayer from '@/features/demos/DemoVideoPlayer';

export default function Demos(): ReactElement {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const selectedVideo = useMemo(
    () => DEMO_VIDEOS.find((video) => video.slug === selectedSlug),
    [selectedSlug],
  );
  const selectedProject = selectedVideo ? getPublicProject(selectedVideo.projectSlug) : undefined;

  return (
    <main className="page-wrap py-6 md:py-8" data-demo-selected={selectedSlug ?? ''}>
      <nav aria-label="Demos breadcrumb">
        <Link className="report-link" to="/projects">
          <ArrowLeft size={16} aria-hidden="true" />
          Project roster
        </Link>
      </nav>

      <section className="editorial-card mt-8 p-6 md:p-8">
        <div className="section-kicker">Demos</div>
        <h1 className="mt-4 max-w-4xl text-5xl font-black uppercase leading-[0.9] tracking-[-0.03em] text-[color:var(--color-ink)] md:text-7xl">
          The work, in motion.
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[color:var(--color-ink-soft)] md:text-xl">
          Short, captioned product walkthroughs for the projects where a screen explains the build
          faster than a paragraph can.
        </p>
      </section>

      <section className="mt-8" aria-labelledby="demo-project-rail-heading">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="section-kicker">Project rail</div>
            <h2
              id="demo-project-rail-heading"
              className="mt-3 text-4xl font-black uppercase leading-none tracking-[-0.02em] text-[color:var(--color-ink)]"
            >
              Select a file to go on air.
            </h2>
          </div>
          <span className="stat-chip">Local project recordings · no game footage</span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {DEMO_VIDEOS.map((video, index) => {
            const project = getPublicProject(video.projectSlug);
            const isSelected = video.slug === selectedSlug;

            return (
              <button
                key={video.slug}
                type="button"
                className={`group relative overflow-hidden border p-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-primary)] ${isSelected ? 'demos-marker-selected border-[color:var(--color-primary)] bg-[color:var(--color-navy)] text-white' : 'border-[color:var(--color-line-strong)] bg-[color:var(--color-surface-raised)] text-[color:var(--color-ink)] hover:border-[color:var(--color-primary)]'}`}
                aria-pressed={isSelected}
                data-demo-project={video.projectSlug}
                data-demo-video={video.slug}
                onClick={() => setSelectedSlug(video.slug)}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] opacity-65">
                    Marker {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] opacity-65">
                    {isSelected ? 'On air' : 'Ready'}
                  </span>
                </span>
                <span className="mt-8 block text-2xl font-black uppercase leading-none">
                  {project?.title ?? video.title}
                </span>
                <span className="mt-2 block text-xs leading-relaxed opacity-70">{video.title}</span>
                <span
                  className={`mt-5 block h-1 w-1/2 ${isSelected ? 'bg-[color:var(--color-primary)]' : 'bg-[color:var(--color-line-strong)] group-hover:bg-[color:var(--color-primary)]'}`}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-10 grid gap-8" aria-labelledby="demo-reel-heading">
        <div>
          <div className="section-kicker">Feature presentation</div>
          <h2
            id="demo-reel-heading"
            className="mt-3 text-4xl font-black uppercase leading-none tracking-[-0.02em] text-[color:var(--color-ink)]"
          >
            A concise reel, with the receipts beside it.
          </h2>
        </div>

        {selectedVideo && selectedProject ? (
          <article
            className="border border-[color:var(--color-line-strong)] bg-[color:var(--color-surface-raised)] p-4 md:p-6"
            data-demo-selected-video={selectedVideo.slug}
          >
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
              <DemoVideoPlayer video={selectedVideo} />
              <aside className="border-t-2 border-[color:var(--color-navy)] pt-4 xl:border-t-0 xl:border-l-2 xl:pl-5">
                <div className="section-kicker">Marker focus · {selectedProject.title}</div>
                <h3 className="mt-3 text-3xl font-black uppercase leading-none text-[color:var(--color-ink)]">
                  {selectedVideo.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-ink-soft)]">
                  {selectedVideo.deck}
                </p>
                <div className="mt-5 border-l-2 border-[color:var(--color-primary)] pl-3 text-xs font-semibold uppercase leading-relaxed tracking-[0.1em] text-[color:var(--color-ink-soft)]">
                  Selection starts muted. Use the timeline, chapter cards, or transcript to move
                  through the recording.
                </div>
                <Link className="report-link mt-6" to={`/projects/${selectedVideo.projectSlug}`}>
                  Open project report
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </aside>
            </div>
          </article>
        ) : (
          <div
            className="grid min-h-64 place-items-center border border-dashed border-[color:var(--color-line-strong)] bg-[color:var(--color-surface-muted)] p-8 text-center"
            data-demo-empty="true"
          >
            <div>
              <div className="section-kicker">No file selected</div>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-[color:var(--color-ink-soft)]">
                Choose a project marker above. The selected local recording will load here and begin
                muted.
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
