import type { ReactElement } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PROJECT_AXIS_META, type CurrentProject } from '@/content/currentProjects';
import {
  MARKETING_PROJECT_REPOSITORIES,
  isMarketingProjectSlug,
} from '@/content/marketingProjects';
import { getProjectShotClip } from '@/content/shotClips';
import { PROJECT_AXES } from '@/features/projects/courtLayout';
import ProjectShotClipPlayer from '@/features/projects/ProjectShotClipPlayer';
import { trackMarketingEvent } from '@/lib/marketingAnalytics';

interface ProjectDetailContentProps {
  project: CurrentProject;
  descriptionId?: string;
  showShotClip?: boolean;
}

export default function ProjectDetailContent({
  project,
  descriptionId,
  showShotClip = false,
}: ProjectDetailContentProps): ReactElement {
  const repositoryUrl = isMarketingProjectSlug(project.slug)
    ? MARKETING_PROJECT_REPOSITORIES[project.slug]
    : null;
  const shotClip = showShotClip ? getProjectShotClip(project.slug) : undefined;

  return (
    <div className="p-5 md:p-6">
      <p id={descriptionId} className="text-lg leading-relaxed text-[color:var(--color-ink)]">
        {project.summary}
      </p>

      <section className="mt-6 border-t border-[color:var(--color-line)] pt-5">
        <div className="section-kicker">Portfolio update</div>
        <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-ink)]">
          {project.portfolioUpdate}
        </p>
      </section>

      <section className="mt-6 border-t border-[color:var(--color-line)] pt-5">
        <div className="section-kicker">Engineering read</div>
        <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-ink)]">
          {project.scoutTake}
        </p>
      </section>

      {showShotClip && shotClip ? <ProjectShotClipPlayer clip={shotClip} /> : null}

      <dl className="mt-6 grid gap-x-6 gap-y-4 border-t border-[color:var(--color-line)] pt-5 sm:grid-cols-2">
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ink-soft)]">
            Tracker health
          </dt>
          <dd className="mt-1 text-3xl font-black leading-none text-[color:var(--color-primary)]">
            {project.trackerScore}/100
          </dd>
        </div>
        {PROJECT_AXES.map((axis) => (
          <div key={axis}>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ink-soft)]">
              {PROJECT_AXIS_META[axis].label}
            </dt>
            <dd className="mt-1 text-3xl font-black leading-none text-[color:var(--color-ink)]">
              {project.grades[axis]}/10
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 flex flex-wrap gap-2" aria-label={`${project.title} tags`}>
        {project.tags.map((tag) => (
          <span key={tag} className="stat-chip">
            {tag}
          </span>
        ))}
      </div>

      {isMarketingProjectSlug(project.slug) ? (
        <nav
          className="mt-6 flex flex-wrap gap-x-6 gap-y-3 border-t border-[color:var(--color-line)] pt-5"
          aria-label={`${project.title} links`}
        >
          <Link className="report-link" to={`/projects/${project.slug}`}>
            Open crawlable page
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
          <a
            className="report-link"
            href={repositoryUrl ?? undefined}
            target="_blank"
            rel="noreferrer"
            onClick={() =>
              trackMarketingEvent('source_repository_click', { project_slug: project.slug })
            }
          >
            Source repository
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </nav>
      ) : null}
    </div>
  );
}
