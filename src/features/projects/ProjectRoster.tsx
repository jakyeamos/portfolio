import type { ReactElement } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { CurrentProject } from '@/content/currentProjects';
import { getProjectStatusMeta } from '@/features/projects/projectStatus';

interface ProjectRosterProps {
  projects: readonly CurrentProject[];
  onOpenProject: (project: CurrentProject, trigger: HTMLElement) => void;
}

export default function ProjectRoster({
  projects,
  onOpenProject,
}: ProjectRosterProps): ReactElement {
  return (
    <ul className="border-y border-[color:var(--color-line)]">
      {projects.map((project) => {
        const status = getProjectStatusMeta(project.trackerStatus);

        return (
          <li
            key={project.slug}
            className="border-b border-[color:var(--color-line)] last:border-b-0"
          >
            <button
              type="button"
              className="group grid w-full gap-4 py-5 text-left md:grid-cols-[minmax(0,0.6fr)_minmax(0,1.2fr)_auto] md:items-center md:gap-6"
              onClick={(event) => onOpenProject(project, event.currentTarget)}
            >
              <span>
                <span
                  className={`block text-[10px] font-semibold uppercase tracking-[0.16em] ${status.className}`}
                >
                  {status.label} · Updated {project.lastUpdated}
                </span>
                <span className="mt-2 block text-3xl font-black uppercase leading-none tracking-[-0.02em] text-[color:var(--color-ink)] group-hover:text-[color:var(--color-primary)]">
                  {project.title}
                </span>
              </span>
              <span className="block">
                <span className="block text-sm leading-relaxed text-[color:var(--color-ink)]">
                  {project.summary}
                </span>
                <span className="mt-2 block text-xs leading-relaxed text-[color:var(--color-ink-soft)]">
                  {project.portfolioUpdate}
                </span>
                <span className="mt-3 flex flex-wrap gap-1.5" aria-label={`${project.title} tags`}>
                  {project.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="stat-chip">
                      {tag}
                    </span>
                  ))}
                </span>
              </span>
              <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-[color:var(--color-primary)]">
                Open report
                <ArrowUpRight size={16} aria-hidden="true" />
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
