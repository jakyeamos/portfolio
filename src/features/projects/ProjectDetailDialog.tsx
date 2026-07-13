import {
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactElement,
  type RefObject,
  useEffect,
  useId,
  useRef,
} from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { PROJECT_AXIS_META, type CurrentProject } from '@/content/currentProjects';
import { PROJECT_AXES } from '@/features/projects/courtLayout';
import { getProjectStatusMeta } from '@/features/projects/projectStatus';

interface ProjectDetailDialogProps {
  project: CurrentProject | null;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLElement | null>;
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  );
}

export default function ProjectDetailDialog({
  project,
  onClose,
  returnFocusRef,
}: ProjectDetailDialogProps): ReactElement | null {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!project) return undefined;

    const appRoot = document.getElementById('root');
    const previousOverflow = document.body.style.overflow;
    appRoot?.setAttribute('inert', '');
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    function onWindowKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') onClose();
    }

    window.addEventListener('keydown', onWindowKeyDown);
    return () => {
      appRoot?.removeAttribute('inert');
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onWindowKeyDown);
      returnFocusRef.current?.focus();
    };
  }, [onClose, project, returnFocusRef]);

  if (!project) return null;

  const status = getProjectStatusMeta(project.trackerStatus);

  function handleKeyDown(event: ReactKeyboardEvent<HTMLElement>): void {
    if (event.key !== 'Tab' || !dialogRef.current) return;

    const focusableElements = getFocusableElements(dialogRef.current);
    const first = focusableElements[0];
    const last = focusableElements.at(-1);

    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-[rgba(16,28,44,0.64)] p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="max-h-[calc(100vh-2rem)] w-full max-w-3xl overflow-y-auto border border-[color:var(--color-line-strong)] bg-[color:var(--color-surface-raised)]"
        onKeyDown={handleKeyDown}
      >
        <header className="flex items-start justify-between gap-5 border-b border-[color:var(--color-line)] p-5 md:p-6">
          <div>
            <div
              className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${status.className}`}
            >
              {status.label} · Updated {project.lastUpdated}
            </div>
            <h2
              id={titleId}
              className="mt-2 text-4xl font-black uppercase leading-none tracking-[-0.02em] text-[color:var(--color-ink)]"
            >
              {project.title}
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label={`Close ${project.title} report`}
            className="inline-flex size-10 shrink-0 items-center justify-center border border-[color:var(--color-line-strong)] bg-white text-[color:var(--color-ink)] hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
            onClick={onClose}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

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
        </div>
      </section>
    </div>,
    document.body,
  );
}
