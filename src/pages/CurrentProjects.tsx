import { type ReactElement, useCallback, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CurrentProject, ProjectAxis } from '@/content/currentProjects';
import {
  PUBLIC_CLOSED_PROJECTS,
  PUBLIC_CURRENT_PROJECTS,
  PUBLIC_PROJECTS,
} from '@/content/publicProjects';
import ProjectCourt from '@/features/projects/ProjectCourt';
import ProjectDetailDialog from '@/features/projects/ProjectDetailDialog';
import ProjectRoster from '@/features/projects/ProjectRoster';

export default function CurrentProjects(): ReactElement {
  const [activeAxis, setActiveAxis] = useState<ProjectAxis>('impact');
  const [selectedProject, setSelectedProject] = useState<CurrentProject | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  function openProject(project: CurrentProject, trigger: HTMLElement): void {
    returnFocusRef.current = trigger;
    setSelectedProject(project);
  }

  const closeProject = useCallback((): void => {
    setSelectedProject(null);
  }, []);

  return (
    <main className="page-wrap py-6 md:py-8">
      <section className="max-w-4xl">
        <div className="section-kicker">Projects</div>
        <h1 className="mt-4 text-5xl font-black uppercase leading-[0.9] tracking-[-0.03em] text-[color:var(--color-ink)] md:text-7xl">
          A readable roster first. The court is optional context.
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[color:var(--color-ink-soft)] md:text-xl">
          This board keeps active product, research, and developer-tool work in one public roster.
          Open any report for the concise status, engineering read, and project grades.
        </p>
      </section>

      <section className="mt-10" aria-labelledby="active-project-roster">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="section-kicker">Active roster</div>
            <h2
              id="active-project-roster"
              className="mt-3 text-4xl font-black uppercase leading-none tracking-[-0.02em] text-[color:var(--color-ink)]"
            >
              Current work, explained without a scavenger hunt.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[color:var(--color-ink-soft)]">
            Status and dates are public-safe tracker fields; the portfolio update is authored here,
            not copied from private operational notes.
          </p>
        </div>
        <div className="mt-6">
          <ProjectRoster projects={PUBLIC_CURRENT_PROJECTS} onOpenProject={openProject} />
        </div>
      </section>

      <ProjectCourt
        activeAxis={activeAxis}
        onAxisChange={setActiveAxis}
        onOpenProject={openProject}
        projects={PUBLIC_PROJECTS}
      />

      <details className="mt-10 border-y border-[color:var(--color-line)] py-5">
        <summary className="cursor-pointer text-lg font-black uppercase tracking-[-0.02em] text-[color:var(--color-ink)] marker:text-[color:var(--color-primary)]">
          Shipped package releases ({PUBLIC_CLOSED_PROJECTS.length})
        </summary>
        <div className="mt-6">
          <ProjectRoster projects={PUBLIC_CLOSED_PROJECTS} onOpenProject={openProject} />
        </div>
      </details>

      <nav
        className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-[color:var(--color-line)] pt-6"
        aria-label="Related dossier pages"
      >
        <Link className="report-link" to="/film-room">
          Read selected case studies
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <Link className="report-link" to="/impact-report">
          Review impact evidence
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </nav>

      <ProjectDetailDialog
        project={selectedProject}
        onClose={closeProject}
        returnFocusRef={returnFocusRef}
      />
    </main>
  );
}
