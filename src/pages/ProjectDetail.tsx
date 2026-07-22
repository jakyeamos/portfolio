import { type ReactElement, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { CURRENT_PROJECTS } from '@/content/currentProjects';
import { isMarketingProjectSlug } from '@/content/marketingProjects';
import ProjectDetailContent from '@/features/projects/ProjectDetailContent';
import { getProjectStatusMeta } from '@/features/projects/projectStatus';
import {
  applyProjectMetadata,
  buildProjectMetadata,
  restoreDefaultMetadata,
} from '@/lib/marketingMetadata';
import { trackMarketingEvent } from '@/lib/marketingAnalytics';

const PORTFOLIO_ORIGIN = import.meta.env.VITE_SITE_URL ?? 'https://jakyeamos.com';

export default function ProjectDetail(): ReactElement {
  const { slug } = useParams<{ slug: string }>();
  const project =
    slug && isMarketingProjectSlug(slug)
      ? CURRENT_PROJECTS.find((item) => item.slug === slug)
      : undefined;

  useEffect(() => {
    if (!project) return undefined;

    applyProjectMetadata(buildProjectMetadata(project, PORTFOLIO_ORIGIN));
    trackMarketingEvent('project_detail_view', { project_slug: project.slug });

    return () => restoreDefaultMetadata(PORTFOLIO_ORIGIN);
  }, [project]);

  if (!project) {
    return (
      <main className="page-wrap py-6 md:py-8">
        <div className="section-kicker">Project desk</div>
        <h1 className="mt-4 text-5xl font-black uppercase leading-none text-[color:var(--color-ink)]">
          Report not found.
        </h1>
        <Link className="report-link mt-8" to="/projects">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to projects
        </Link>
      </main>
    );
  }

  const status = getProjectStatusMeta(project.trackerStatus);

  return (
    <main className="page-wrap py-6 md:py-8">
      <nav aria-label="Project breadcrumb">
        <Link className="report-link" to="/projects">
          <ArrowLeft size={16} aria-hidden="true" />
          Project roster
        </Link>
      </nav>

      <article className="mt-8 max-w-4xl border border-[color:var(--color-line-strong)] bg-[color:var(--color-surface-raised)]">
        <header className="border-b border-[color:var(--color-line)] p-5 md:p-6">
          <div
            className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${status.className}`}
          >
            {status.label} · Updated {project.lastUpdated}
          </div>
          <h1 className="mt-3 text-5xl font-black uppercase leading-none tracking-[-0.02em] text-[color:var(--color-ink)] md:text-7xl">
            {project.title}
          </h1>
        </header>
        <ProjectDetailContent project={project} />
      </article>
    </main>
  );
}
