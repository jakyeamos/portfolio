import { type CSSProperties, type ReactElement, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  CircleDot,
  HelpCircle,
  MapPin,
  Sparkles,
  Sun,
  Target,
  X,
  Zap,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  CLOSED_PROJECTS,
  CURRENT_PROJECTS,
  PROJECT_AXIS_META,
  type CurrentProject,
  type ProjectAxis,
} from '@/content/currentProjects';

const AXES: readonly ProjectAxis[] = ['impact', 'difficulty', 'ambition', 'creativity'] as const;

type CourtPoint = {
  left: number;
  top: number;
};

type ProjectCourtLayout = {
  project: CurrentProject;
  markerSize: number;
  position: CSSProperties;
};

function toStatusLabel(status: CurrentProject['trackerStatus']): string {
  if (status === 'on_track') return 'Active';
  if (status === 'needs_attention') return 'In Development';
  if (status === 'stalled') return 'On Deck';
  return 'Shipped';
}

function getStatusTone(status: CurrentProject['trackerStatus']): string {
  if (status === 'on_track') return 'text-[color:var(--color-secondary)]';
  if (status === 'needs_attention') return 'text-[color:var(--color-gold)]';
  return 'text-[color:var(--color-primary)]';
}

function getStatusRgb(status: CurrentProject['trackerStatus']): string {
  if (status === 'on_track') return '20,77,184';
  if (status === 'needs_attention') return '186,139,25';
  return '181,13,13';
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function getShotCoordinates(project: CurrentProject, axis: ProjectAxis): CourtPoint {
  const health = project.trackerScore / 100;
  const axisGrade = project.grades[axis];
  const eliteLift = Math.max(0, axisGrade - 8) ** 1.35;
  const baselineGrade = Math.min(axisGrade, 8);
  const verticalScore = (baselineGrade - 5) * 7.2 + eliteLift * 13;
  const difficultyPressure = (project.grades.difficulty - 5.5) / 10;
  const creativeSpread = (project.grades.creativity - project.grades.impact) / 10;
  const statusDrag =
    project.trackerStatus === 'on_track' ? 0.03 : project.trackerStatus === 'stalled' ? -0.06 : -0.02;

  const left = clamp(14 + health * 72 + creativeSpread * 7 + statusDrag * 100, 8, 92);
  const top = clamp(72 - verticalScore + difficultyPressure * 4, 8, 90);

  return { left, top };
}

function markerSizeForProject(project: CurrentProject): number {
  return 14 + project.grades.ambition;
}

function buildCourtLayout(projects: readonly CurrentProject[], axis: ProjectAxis): ProjectCourtLayout[] {
  const points = projects.map((project) => ({
    project,
    markerSize: markerSizeForProject(project),
    ...getShotCoordinates(project, axis),
  }));

  for (let pass = 0; pass < 24; pass += 1) {
    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        const a = points[i];
        const b = points[j];
        const dx = b.left - a.left;
        const dy = b.top - a.top;
        const distance = Math.hypot(dx, dy) || 0.01;
        const minDistance = 8 + (a.markerSize + b.markerSize) / 32;

        if (distance >= minDistance) continue;

        const push = (minDistance - distance) / 2;
        const nx = dx / distance;
        const ny = dy / distance;

        a.left = clamp(a.left - nx * push, 7, 93);
        a.top = clamp(a.top - ny * push, 7, 91);
        b.left = clamp(b.left + nx * push, 7, 93);
        b.top = clamp(b.top + ny * push, 7, 91);
      }
    }
  }

  return points.map(({ project, markerSize, left, top }) => ({
    project,
    markerSize,
    position: {
      left: `${left}%`,
      top: `${top}%`,
      transform: 'translate(-50%, -50%)',
    },
  }));
}

// ─── Court SVG ───────────────────────────────────────────────────────────────
const COURT_STROKE = 'rgba(21,24,32,0.32)';
const COURT_STROKE_MED = 'rgba(21,24,32,0.22)';

function CourtSVG(): ReactElement {
  return (
    <svg
      viewBox="0 0 100 105"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      {/* Outer boundary */}
      <rect x="1" y="1" width="98" height="103" fill="none" stroke={COURT_STROKE} strokeWidth="0.5" />

      {/* Baseline */}
      <line x1="1" y1="103" x2="99" y2="103" stroke={COURT_STROKE} strokeWidth="0.8" />

      {/* Three-point arc (straight corners + arc) */}
      <path
        d="M 7 103 L 7 77 A 43 43 0 0 1 93 77 L 93 103"
        fill="none"
        stroke={COURT_STROKE}
        strokeWidth="0.7"
      />

      {/* Key / Paint */}
      <rect
        x="38"
        y="62"
        width="24"
        height="34"
        fill="none"
        stroke={COURT_STROKE}
        strokeWidth="0.6"
      />

      {/* Free-throw circle top half (solid) */}
      <path
        d="M 38 62 A 12 12 0 0 1 62 62"
        fill="none"
        stroke={COURT_STROKE}
        strokeWidth="0.6"
      />

      {/* Free-throw circle bottom half (dashed) */}
      <path
        d="M 38 62 A 12 12 0 0 0 62 62"
        fill="none"
        stroke={COURT_STROKE_MED}
        strokeWidth="0.6"
        strokeDasharray="2,2"
      />

      {/* Restricted area arc */}
      <path
        d="M 42.5 93 A 7.5 7.5 0 0 1 57.5 93"
        fill="none"
        stroke="rgba(181,13,13,0.45)"
        strokeWidth="0.7"
      />
      <line x1="42.5" y1="93" x2="42.5" y2="96" stroke="rgba(181,13,13,0.45)" strokeWidth="0.7" />
      <line x1="57.5" y1="93" x2="57.5" y2="96" stroke="rgba(181,13,13,0.45)" strokeWidth="0.7" />

      {/* Backboard */}
      <line x1="41" y1="98" x2="59" y2="98" stroke="rgba(181,13,13,0.8)" strokeWidth="1.2" />

      {/* Hoop */}
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

// ─── Help Panel ───────────────────────────────────────────────────────────────
function HelpPanel({ onClose }: { onClose: () => void }): ReactElement {
  return (
    <div className="mt-4 border border-[color:var(--color-line-strong)] bg-white p-5 shadow-[0_8px_32px_rgba(16,28,44,0.10)]">
      <div className="flex items-start justify-between gap-4">
        <div className="section-kicker">How to read this chart</div>
        <button
          type="button"
          aria-label="Close help"
          className="text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)]"
          onClick={onClose}
        >
          <X size={15} />
        </button>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="flex gap-3">
          <MapPin size={15} className="mt-0.5 shrink-0 text-[color:var(--color-primary)]" />
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink)]">Position</div>
            <p className="mt-1 text-xs leading-relaxed text-[color:var(--color-ink-soft)]">
              Left-to-right is tracker health. Bottom-to-top is the selected scouting axis grade.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Sun size={15} className="mt-0.5 shrink-0 text-[color:var(--color-gold)]" />
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink)]">Brightness</div>
            <p className="mt-1 text-xs leading-relaxed text-[color:var(--color-ink-soft)]">
              Marker fill opacity tracks the tracker health score (0–100). Brighter = healthier.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Target size={15} className="mt-0.5 shrink-0 text-[color:var(--color-secondary)]" />
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink)]">Click a marker</div>
            <p className="mt-1 text-xs leading-relaxed text-[color:var(--color-ink-soft)]">
              Opens the full project breakdown: summary, scout grades, tracker comment, and status.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <CircleDot size={15} className="mt-0.5 shrink-0 text-[color:var(--color-ink-soft)]" />
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink)]">Court zones</div>
            <p className="mt-1 text-xs leading-relaxed text-[color:var(--color-ink-soft)]">
              Top-right = strong and healthy. Top-left = high-upside work that needs attention.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CurrentProjects(): ReactElement {
  const [activeAxis, setActiveAxis] = useState<ProjectAxis>('impact');
  const [selectedProject, setSelectedProject] = useState<CurrentProject | null>(null);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [showAllRoster, setShowAllRoster] = useState(false);

  useEffect(() => {
    if (!selectedProject) return undefined;
    function onKeyDown(e: KeyboardEvent): void {
      if (e.key === 'Escape') setSelectedProject(null);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedProject]);

  const axisMeta = PROJECT_AXIS_META[activeAxis];

  const rosterScore = (p: CurrentProject): number =>
    Math.round(p.grades[activeAxis] * 7 + p.trackerScore * 0.3);

  const orderedProjects = useMemo(
    () => [...CURRENT_PROJECTS].sort((a, b) => rosterScore(b) - rosterScore(a)),
    [activeAxis],
  );

  const courtLayout = useMemo(
    () => buildCourtLayout(orderedProjects, activeAxis),
    [orderedProjects, activeAxis],
  );

  useEffect(() => { setShowAllRoster(false); }, [activeAxis]);

  // ── Summary stats ──
  const totalProjects = CURRENT_PROJECTS.length;
  const avgHealth = Math.round(
    CURRENT_PROJECTS.reduce((s, p) => s + p.trackerScore, 0) / totalProjects,
  );
  const onTrackCount = CURRENT_PROJECTS.filter((p) => p.trackerStatus === 'on_track').length;
  const actionCount = CURRENT_PROJECTS.filter(
    (p) => p.trackerStatus === 'needs_attention' || p.trackerStatus === 'stalled',
  ).length;

  const SUMMARY_STATS = [
    { label: 'On the Board', value: String(totalProjects), icon: CircleDot, tone: 'text-[color:var(--color-ink)]' },
    { label: 'Avg Health Score', value: String(avgHealth), icon: Activity, tone: 'text-[color:var(--color-secondary)]' },
    { label: 'On Track', value: String(onTrackCount), icon: Target, tone: 'text-[color:var(--color-secondary)]' },
    { label: 'Building', value: String(actionCount), icon: Zap, tone: 'text-[color:var(--color-gold)]' },
  ];

  return (
    <div className="lg:ml-72">
      <main className="page-wrap py-6 md:py-8">

        {/* ── Hero ── */}
        <section className="editorial-card animate-rise p-6 md:p-8">
          <div className="max-w-5xl">
            <div className="section-kicker">Projects</div>
            <h1 className="mt-4 max-w-[16ch] text-5xl font-black uppercase leading-[0.88] tracking-tight text-[color:var(--color-ink)] md:text-7xl">
              Live board. Tracker-backed. Scout grades on the floor.
            </h1>
            <p className="mt-5 max-w-4xl text-lg leading-relaxed text-[color:var(--color-ink-soft)] md:text-xl">
              Active tracker scores, status reads, and forward-looking notes on every project in the
              portfolio. Basketball grades are editorial scouting reads that place each project on
              the court. Shipped projects are catalogued below.
            </p>
          </div>

          {/* ── Stat cards ── */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {SUMMARY_STATS.map(({ label, value, icon: Icon, tone }) => (
              <div
                key={label}
                className="border border-[color:var(--color-line)] bg-white px-5 py-6"
              >
                <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
                  <Icon size={13} className={tone} />
                  {label}
                </div>
                <div className="mt-3 text-[clamp(2.5rem,3vw,4rem)] font-black uppercase leading-none text-[color:var(--color-primary)]">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Shot Chart ── */}
        <section className="mt-8 editorial-card p-6 md:p-8">

          {/* Header row */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="section-kicker">Shot Chart</div>
                <button
                  type="button"
                  aria-expanded={showHelp}
                  aria-label="How to read this chart"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--color-line-strong)] bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ink-soft)] transition hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
                  onClick={() => setShowHelp((v) => !v)}
                >
                  <HelpCircle size={12} />
                  How to read
                </button>
              </div>
              <h2 className="mt-3 text-4xl font-black uppercase leading-none tracking-tight text-[color:var(--color-ink)]">
                {axisMeta.label} board
              </h2>
              <p className={`mt-3 max-w-3xl text-base leading-relaxed ${axisMeta.tone}`}>
                {axisMeta.deck}
              </p>
            </div>
            <Link className="report-link" to="/impact-report">
              Open impact report
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Help panel */}
          {showHelp && <HelpPanel onClose={() => setShowHelp(false)} />}

          {/* Axis selector */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {AXES.map((axis) => (
              <button
                key={axis}
                type="button"
                className={`board-tab ${activeAxis === axis ? 'board-tab-active' : ''}`}
                onClick={() => setActiveAxis(axis)}
              >
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-primary)]">
                  Scouting axis
                </div>
                <div className="mt-2 text-2xl font-black uppercase leading-none tracking-tight text-[color:var(--color-ink)]">
                  {PROJECT_AXIS_META[axis].label}
                </div>
              </button>
            ))}
          </div>

          {/* Court + Sidebar */}
          <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">

            {/* Court */}
            <div className="border border-[color:var(--color-line-strong)] bg-[color:var(--color-surface-raised)] p-4 md:p-6">
              <div className="mx-auto w-full max-w-[700px]">
                {/* Court title */}
                <div className="mb-4 text-center">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-ink-soft)]">
                    Live tracker feed × scout-grade shot chart
                  </div>
                  <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)] opacity-60">
                    X: tracker health · Y: {axisMeta.label}
                  </div>
                </div>

                {/* Court container */}
                <div className="relative mx-auto aspect-[1/1.05] w-full">
                  <CourtSVG />

                  <div className="pointer-events-none absolute left-4 top-4 border border-[color:var(--color-line)] bg-white/80 px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-primary)]">
                    High {axisMeta.label}
                  </div>
                  <div className="pointer-events-none absolute right-4 top-4 border border-[color:var(--color-line)] bg-white/80 px-2.5 py-1.5 text-right text-[9px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-secondary)]">
                    Healthy ceiling
                  </div>
                  <div className="pointer-events-none absolute bottom-4 left-4 border border-[color:var(--color-line)] bg-white/80 px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ink-soft)]">
                    Rebuild lane
                  </div>
                  <div className="pointer-events-none absolute bottom-4 right-4 border border-[color:var(--color-line)] bg-white/80 px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-secondary)]">
                    Higher health
                  </div>

                  {/* Shot markers */}
                  {courtLayout.map(({ project, markerSize, position }) => {
                    const alpha = 0.38 + (project.trackerScore / 100) * 0.52;
                    const markerRgb = getStatusRgb(project.trackerStatus);
                    const isSelected = selectedProject?.slug === project.slug;
                    const isHovered = hoveredSlug === project.slug;

                    return (
                      <div
                        key={`${project.slug}-${activeAxis}`}
                        className="absolute"
                        style={{ ...position, zIndex: isSelected ? 20 : isHovered ? 15 : undefined }}
                      >

                        {/* Pulse ring — selected only */}
                        {isSelected && (
                          <motion.div
                            className="pointer-events-none absolute rounded-full border border-[rgba(181,13,13,0.6)]"
                            style={{ inset: '-10px' }}
                            animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                          />
                        )}

                        {/* Hover tooltip */}
                        {isHovered && !isSelected && (
                          <div
                            className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 -translate-x-1/2 whitespace-nowrap border border-[color:var(--color-line-strong)] bg-[color:var(--color-navy)] px-3 py-2 shadow-[0_4px_16px_rgba(16,28,44,0.22)]"
                            role="tooltip"
                          >
                            <div className="text-[10px] font-black uppercase leading-none tracking-wide text-white">
                              {project.title}
                            </div>
                            <div className="mt-1 flex items-center gap-2">
                              <span className={`text-[9px] font-semibold uppercase tracking-[0.14em] ${getStatusTone(project.trackerStatus)} brightness-150`}>
                                {toStatusLabel(project.trackerStatus)}
                              </span>
                              <span className="text-[9px] text-white/50">·</span>
                              <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/70">
                                Health {project.trackerScore}
                              </span>
                              <span className="text-[9px] text-white/50">·</span>
                              <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-gold)]">
                                {axisMeta.label} {project.grades[activeAxis]}/10
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Dot */}
                        <motion.button
                          type="button"
                          aria-label={`${project.title} — click for details`}
                          className="flex items-center justify-center rounded-full border border-white/80 text-[7px] font-black uppercase leading-none text-white"
                          style={{
                            height: `${markerSize}px`,
                            width: `${markerSize}px`,
                            backgroundColor: `rgba(${markerRgb},${alpha})`,
                            boxShadow: isSelected
                              ? `0 0 0 2px rgba(${markerRgb},0.55), 0 4px 12px rgba(16,28,44,0.22)`
                              : '0 2px 8px rgba(16,28,44,0.18)',
                          }}
                          animate={{ scale: isSelected ? 1.25 : 1 }}
                          whileHover={{ scale: 1.5 }}
                          transition={{ duration: 0.15 }}
                          onClick={() => setSelectedProject(project)}
                          onMouseEnter={() => setHoveredSlug(project.slug)}
                          onMouseLeave={() => setHoveredSlug(null)}
                        >
                          {project.shortCode}
                        </motion.button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="grid gap-4 self-start">

              {/* Project roster */}
              <section className="border border-[color:var(--color-line)] bg-white p-5">
                <div className="flex items-center gap-3">
                  <Target size={16} className="text-[color:var(--color-primary)]" />
                  <div className="section-kicker">Roster</div>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[color:var(--color-ink-soft)]">
                  Sorted by {axisMeta.label.toLowerCase()} grade. Click to open.
                </p>
                <div className="mt-4 grid gap-2">
                  {(showAllRoster ? orderedProjects : orderedProjects.slice(0, 5)).map((project) => {
                    const alpha = 0.34 + (project.trackerScore / 100) * 0.56;
                    const markerRgb = getStatusRgb(project.trackerStatus);
                    const isSelected = selectedProject?.slug === project.slug;
                    return (
                      <button
                        key={project.slug}
                        type="button"
                        className={`flex items-center justify-between gap-3 border px-4 py-3 text-left transition hover:border-[color:var(--color-primary)] ${
                          isSelected
                            ? 'border-[color:var(--color-primary)] bg-[color:var(--color-surface-muted)]'
                            : 'border-[color:var(--color-line)] bg-[color:var(--color-surface-raised)]'
                        }`}
                        onClick={() => setSelectedProject(isSelected ? null : project)}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[9px] font-black uppercase text-white"
                            style={{ backgroundColor: `rgba(${markerRgb},${alpha})` }}
                          >
                            {project.shortCode}
                          </span>
                          <div>
                            <div className="text-sm font-black uppercase leading-none text-[color:var(--color-ink)]">
                              {project.title}
                            </div>
                            <div className={`mt-1 text-[9px] font-semibold uppercase tracking-[0.18em] ${getStatusTone(project.trackerStatus)}`}>
                              {toStatusLabel(project.trackerStatus)}
                            </div>
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <div className="text-base font-black uppercase text-[color:var(--color-primary)]">
                            {rosterScore(project)}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                  {orderedProjects.length > 5 && (
                    <button
                      type="button"
                      className="mt-1 w-full border border-dashed border-[color:var(--color-line-strong)] py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)] transition hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
                      onClick={() => setShowAllRoster((v) => !v)}
                    >
                      {showAllRoster
                        ? 'Show less'
                        : `+${orderedProjects.length - 5} more`}
                    </button>
                  )}
                </div>
              </section>

              {/* Source note */}
              <section className="border border-[color:var(--color-line)] bg-[color:var(--color-navy)] p-5 text-white">
                <div className="flex items-center gap-3">
                  <Activity size={16} className="text-[color:var(--color-gold)]" />
                  <div className="section-kicker text-[color:var(--color-gold)]">Source Note</div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/80">
                  Scores and status reflect current project health from the active tracker. Axis
                  grades are editorial scout reads for the portfolio treatment.
                </p>
              </section>
            </aside>
          </div>
        </section>
        {/* ── Shipped Projects ── */}
        <section className="mt-8 editorial-card p-6 md:p-8">
          <div className="section-kicker">Shipped</div>
          <h2 className="mt-4 text-4xl font-black uppercase leading-none tracking-tight text-[color:var(--color-ink)]">
            Closed Projects
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-[color:var(--color-ink-soft)]">
            Projects that have shipped or reached completion.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {CLOSED_PROJECTS.map((project) => (
              <div
                key={project.slug}
                className="border border-[color:var(--color-line)] bg-white p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--color-secondary)] text-[9px] font-black uppercase text-white">
                    {project.shortCode}
                  </span>
                  <span className="stat-chip">Shipped</span>
                </div>
                <div className="mt-4 text-lg font-black uppercase leading-none text-[color:var(--color-ink)]">
                  {project.title}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-ink-soft)]">
                  {project.summary}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="stat-chip">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ── Detail Modal ── */}
      {selectedProject ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(16,28,44,0.60)] p-4"
          role="presentation"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-4xl overflow-y-auto border border-[color:var(--color-line-strong)] bg-[color:var(--color-surface-raised)] shadow-[0_32px_96px_rgba(16,28,44,0.30)]"
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedProject.title} project details`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="sticky top-0 flex items-center justify-between border-b border-[color:var(--color-line)] bg-[rgba(252,248,241,0.97)] px-6 py-4 backdrop-blur">
              <div className="flex items-center gap-4">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[11px] font-black uppercase text-white"
                  style={{
                    backgroundColor: `rgba(${getStatusRgb(selectedProject.trackerStatus)},${0.34 + (selectedProject.trackerScore / 100) * 0.56})`,
                  }}
                >
                  {selectedProject.shortCode}
                </span>
                <div>
                  <div className="section-kicker">Project Report</div>
                  <div className="mt-0.5 text-3xl font-black uppercase leading-none text-[color:var(--color-ink)]">
                    {selectedProject.title}
                  </div>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close project details"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--color-line-strong)] bg-white text-[color:var(--color-ink)] hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
                onClick={() => setSelectedProject(null)}
              >
                <X size={22} />
              </button>
            </div>

            <div className="grid gap-6 p-6 md:p-8 xl:grid-cols-[minmax(0,1.1fr)_300px]">
              {/* Left column */}
              <div>
                {/* Chips */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="stat-chip">Health {selectedProject.trackerScore}</span>
                  <span className="stat-chip">{toStatusLabel(selectedProject.trackerStatus)}</span>
                  <span className="stat-chip">Updated {selectedProject.lastUpdated}</span>
                </div>

                {/* Health bar */}
                <div className="mt-4">
                  <div className="mb-1.5 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
                    <span>Tracker Health</span>
                    <span className="text-[color:var(--color-primary)]">{selectedProject.trackerScore}/100</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-[color:var(--color-surface-muted)]">
                    <div
                      className="h-full rounded-full bg-[color:var(--color-primary)] transition-all"
                      style={{ width: `${selectedProject.trackerScore}%` }}
                    />
                  </div>
                </div>

                {/* Summary */}
                <p className="mt-5 text-lg leading-relaxed text-[color:var(--color-ink)]">
                  {selectedProject.summary}
                </p>

                {/* Tracker comment → Next Play */}
                <div className="mt-6 border border-[color:var(--color-line)] bg-white p-5">
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-[color:var(--color-primary)]" />
                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-primary)]">
                      Next Play
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-ink)]">
                    {selectedProject.trackerComment}
                  </p>
                </div>

                {/* Scout take */}
                <div className="mt-4 border border-[color:var(--color-line)] bg-[color:var(--color-surface-muted)] p-5">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
                    Scout Take
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-ink)]">
                    {selectedProject.scoutTake}
                  </p>
                </div>

                {/* Scout grades */}
                <div className="mt-5 border border-[color:var(--color-line)] bg-white p-5">
                  <div className="flex items-center gap-3">
                    <CircleDot size={16} className="text-[color:var(--color-primary)]" />
                    <div className="section-kicker">Scout Grades</div>
                  </div>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {AXES.map((axis) => (
                      <div key={axis}>
                        <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-ink-soft)]">
                          <span>{PROJECT_AXIS_META[axis].label}</span>
                          <span className={axis === activeAxis ? 'text-[color:var(--color-primary)]' : ''}>
                            {selectedProject.grades[axis]}/10
                          </span>
                        </div>
                        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[color:var(--color-surface-muted)]">
                          <div
                            className={`h-full rounded-full transition-all ${
                              axis === activeAxis
                                ? 'bg-[color:var(--color-primary)]'
                                : 'bg-[color:var(--color-ink-soft)] opacity-40'
                            }`}
                            style={{ width: `${selectedProject.grades[axis] * 10}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right column */}
              <aside className="grid gap-4 self-start">

                {/* Status card */}
                <section className="border border-[color:var(--color-line)] bg-[color:var(--color-navy)] p-5 text-white">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-gold)]">
                    Status Read
                  </div>
                  <p className="mt-3 text-2xl font-black uppercase leading-none">
                    {toStatusLabel(selectedProject.trackerStatus)}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-white/80">
                    Tracker health score: {selectedProject.trackerScore}. Brightness on the court
                    mirrors completion and current state.
                  </p>
                </section>

                {/* Tags */}
                <section className="border border-[color:var(--color-line)] bg-white p-5">
                  <div className="flex items-center gap-3">
                    <Sparkles size={16} className="text-[color:var(--color-primary)]" />
                    <div className="section-kicker">Tags</div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag) => (
                      <span key={tag} className="stat-chip">{tag}</span>
                    ))}
                  </div>
                </section>

              </aside>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
