import { type KeyboardEvent, type ReactElement, useId, useMemo, useRef } from 'react';
import type { CurrentProject, ProjectAxis } from '@/content/currentProjects';
import { PROJECT_AXIS_META } from '@/content/currentProjects';
import { buildCourtLayout, PROJECT_AXES } from '@/features/projects/courtLayout';

interface ProjectCourtProps {
  activeAxis: ProjectAxis;
  onAxisChange: (axis: ProjectAxis) => void;
  onOpenProject: (project: CurrentProject, trigger: HTMLElement) => void;
  projects: readonly CurrentProject[];
}

function CourtSvg(): ReactElement {
  return (
    <svg viewBox="0 0 100 105" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <rect
        x="1"
        y="1"
        width="98"
        height="103"
        fill="none"
        stroke="rgba(21,24,32,0.3)"
        strokeWidth="0.5"
      />
      <path
        d="M 7 103 L 7 77 A 43 43 0 0 1 93 77 L 93 103"
        fill="none"
        stroke="rgba(21,24,32,0.3)"
        strokeWidth="0.7"
      />
      <rect
        x="38"
        y="62"
        width="24"
        height="34"
        fill="none"
        stroke="rgba(21,24,32,0.3)"
        strokeWidth="0.6"
      />
      <path
        d="M 38 62 A 12 12 0 0 1 62 62"
        fill="none"
        stroke="rgba(21,24,32,0.3)"
        strokeWidth="0.6"
      />
      <path
        d="M 38 62 A 12 12 0 0 0 62 62"
        fill="none"
        stroke="rgba(21,24,32,0.2)"
        strokeWidth="0.6"
        strokeDasharray="2,2"
      />
      <line x1="41" y1="98" x2="59" y2="98" stroke="rgba(181,13,13,0.8)" strokeWidth="1.2" />
      <circle
        cx="50"
        cy="96"
        r="3"
        fill="rgba(181,13,13,0.12)"
        stroke="rgba(181,13,13,0.9)"
        strokeWidth="0.9"
      />
    </svg>
  );
}

export default function ProjectCourt({
  activeAxis,
  onAxisChange,
  onOpenProject,
  projects,
}: ProjectCourtProps): ReactElement {
  const tabListId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const layout = useMemo(() => buildCourtLayout(projects, activeAxis), [activeAxis, projects]);
  const axisMeta = PROJECT_AXIS_META[activeAxis];

  function handleAxisKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number): void {
    const direction = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (direction === 0 && event.key !== 'Home' && event.key !== 'End') return;

    event.preventDefault();
    const nextIndex =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? PROJECT_AXES.length - 1
          : (index + direction + PROJECT_AXES.length) % PROJECT_AXES.length;
    const nextAxis = PROJECT_AXES[nextIndex];
    onAxisChange(nextAxis);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <details className="mt-10 border-y border-[color:var(--color-line-strong)] py-5">
      <summary className="cursor-pointer text-lg font-black uppercase tracking-[-0.02em] text-[color:var(--color-ink)] marker:text-[color:var(--color-primary)]">
        Open the optional court view
      </summary>
      <div className="mt-6">
        <p className="max-w-3xl text-sm leading-relaxed text-[color:var(--color-ink-soft)]">
          The visual view maps public tracker health from left to right and the selected project
          lens from bottom to top. The roster remains the primary way to read and open each project.
        </p>
        <div className="mt-6" role="tablist" aria-label="Project court axis">
          <div className="flex flex-wrap gap-2">
            {PROJECT_AXES.map((axis, index) => {
              const isActive = axis === activeAxis;
              const tabId = `${tabListId}-tab-${axis}`;

              return (
                <button
                  key={axis}
                  ref={(element) => {
                    tabRefs.current[index] = element;
                  }}
                  id={tabId}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`${tabListId}-panel`}
                  tabIndex={isActive ? 0 : -1}
                  className={`border px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] ${
                    isActive
                      ? 'border-[color:var(--color-primary)] bg-[color:var(--color-surface-muted)] text-[color:var(--color-primary)]'
                      : 'border-[color:var(--color-line-strong)] bg-white text-[color:var(--color-ink)] hover:border-[color:var(--color-primary)]'
                  }`}
                  onClick={() => onAxisChange(axis)}
                  onKeyDown={(event) => handleAxisKeyDown(event, index)}
                >
                  {PROJECT_AXIS_META[axis].label}
                </button>
              );
            })}
          </div>
        </div>
        <div
          id={`${tabListId}-panel`}
          role="tabpanel"
          aria-labelledby={`${tabListId}-tab-${activeAxis}`}
          className="mt-6"
        >
          <p className="text-sm font-semibold leading-relaxed text-[color:var(--color-ink)]">
            {axisMeta.deck}
          </p>
          <div className="relative mt-5 aspect-[20/21] min-h-[440px] border border-[color:var(--color-line-strong)] bg-[color:var(--color-surface-muted)] sm:min-h-[540px]">
            <CourtSvg />
            {layout.map(({ project, point }) => (
              <button
                key={project.slug}
                type="button"
                className="group absolute flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[color:var(--color-primary)] text-[10px] font-black text-white shadow-[0_2px_0_rgba(16,28,44,0.24)] hover:bg-[color:var(--color-primary-deep)] focus:z-10"
                style={{ left: `${point.left}%`, top: `${point.top}%` }}
                aria-label={`Open ${project.title}: ${project.trackerScore} tracker health and ${project.grades[activeAxis]} out of 10 ${axisMeta.label.toLowerCase()}`}
                onClick={(event) => onOpenProject(project, event.currentTarget)}
              >
                {project.shortCode}
                <span className="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-10 hidden w-44 -translate-x-1/2 border border-[color:var(--color-line-strong)] bg-white px-3 py-2 text-left text-xs font-semibold leading-snug text-[color:var(--color-ink)] group-hover:block group-focus:block">
                  {project.title}: {project.grades[activeAxis]}/10 {axisMeta.label.toLowerCase()}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </details>
  );
}
