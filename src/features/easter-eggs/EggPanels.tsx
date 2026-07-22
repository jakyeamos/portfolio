import { type ReactElement, type ReactNode, useState } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { playAudioCue } from './audio';
import { CURRENT_PROJECTS } from '@/content/currentProjects';
import {
  FILM_ROOM_PROJECTS,
  HERO_PROOF,
  PLAYER_COMPS,
  type FilmRoomProject,
} from '@/content/portfolioContent';
import type { EasterEggId, EasterEggOpenPayload } from './types';

interface EggPanelsProps {
  id: EasterEggId;
  payload?: EasterEggOpenPayload;
  soundEnabled: boolean;
  onClose: () => void;
}

interface PanelProps {
  eyebrow: string;
  title: string;
  children: ReactNode;
}

function Panel({ eyebrow, title, children }: PanelProps): ReactElement {
  return (
    <section className="after-hours-panel" data-easter-panel="true">
      <div className="after-hours-kicker">{eyebrow}</div>
      <h3 className="after-hours-panel-title">{title}</h3>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function DraftLottery({ soundEnabled }: { soundEnabled: boolean }): ReactElement {
  const [projectionRound, setProjectionRound] = useState(0);
  const picks = CURRENT_PROJECTS.slice(0, 3).map((_, index) => {
    return CURRENT_PROJECTS[(index + projectionRound) % CURRENT_PROJECTS.length];
  });

  function runProjection(): void {
    setProjectionRound((current) => current + 1);
    playAudioCue('tap', soundEnabled);
  }

  return (
    <Panel eyebrow="Local projection" title="The board breaks your way.">
      <p className="after-hours-copy">
        A playful draft projection built from the public project roster and the existing proof file.
        It does not alter the canonical dossier or pretend to be a hiring forecast.
      </p>
      <div className="after-hours-list">
        {picks.map((project, index) => (
          <div key={project.slug} className="after-hours-list-row">
            <span className="after-hours-list-index">0{index + 1}</span>
            <div>
              <div className="after-hours-list-label">Round {index + 1} projection</div>
              <div className="after-hours-list-value">{project.title}</div>
              <p className="after-hours-list-copy">{project.portfolioUpdate}</p>
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="after-hours-secondary-button" onClick={runProjection}>
        Run the local board again
        <RotateCcw size={15} aria-hidden="true" />
      </button>
    </Panel>
  );
}

const CHALKBOARD_POSITIONS = [
  { left: 16, top: 72 },
  { left: 38, top: 35 },
  { left: 64, top: 62 },
  { left: 84, top: 25 },
] as const;

function ChalkboardPlay({ soundEnabled }: { soundEnabled: boolean }): ReactElement {
  const nodes = CURRENT_PROJECTS.slice(0, CHALKBOARD_POSITIONS.length);
  const [path, setPath] = useState<number[]>([]);

  function selectNode(index: number): void {
    const expectedIndex = path.length;
    if (index === expectedIndex) {
      setPath((current) => [...current, index]);
      playAudioCue('tap', soundEnabled);
      return;
    }

    setPath([index]);
    playAudioCue('hit', soundEnabled);
  }

  const complete = path.length === nodes.length;

  return (
    <Panel eyebrow="Optional court view" title="Draw the possession.">
      <p className="after-hours-copy">
        Tap the project nodes in order. The board is a tiny interaction, not a new project map.
      </p>
      <div className="chalkboard" aria-label="Project node path board">
        <svg className="chalkboard-lines" viewBox="0 0 100 100" aria-hidden="true">
          {path.slice(1).map((nodeIndex, index) => {
            const from = CHALKBOARD_POSITIONS[path[index]];
            const to = CHALKBOARD_POSITIONS[nodeIndex];
            return (
              <line
                key={`${path[index]}-${nodeIndex}`}
                x1={from.left}
                y1={100 - from.top}
                x2={to.left}
                y2={100 - to.top}
                className="chalkboard-line"
              />
            );
          })}
        </svg>
        {nodes.map((project, index) => {
          const position = CHALKBOARD_POSITIONS[index];
          const selected = path.includes(index);

          return (
            <button
              key={project.slug}
              type="button"
              className={`chalkboard-node ${selected ? 'chalkboard-node-selected' : ''}`}
              style={{ left: `${position.left}%`, top: `${position.top}%` }}
              aria-label={`${selected ? 'Selected' : 'Select'} ${project.title} project node`}
              aria-pressed={selected}
              onClick={() => selectNode(index)}
            >
              {project.shortCode}
            </button>
          );
        })}
        <div className="chalkboard-caption">
          {complete ? 'PATH COMPLETE' : 'SELECT THE NEXT NODE'}
        </div>
      </div>
      {complete ? (
        <div className="after-hours-reveal" role="status">
          SPEC → BUILD → VERIFY → SHIP
        </div>
      ) : null}
    </Panel>
  );
}

function PlayerCompMixer({ soundEnabled }: { soundEnabled: boolean }): ReactElement {
  const [first, second] = PLAYER_COMPS;

  return (
    <Panel eyebrow="Hybrid read" title="Two public comps. One blended file.">
      <p className="after-hours-copy">
        This read combines the two existing public comp cards. It does not introduce a new claim or
        a third player comparison.
      </p>
      <div className="after-hours-mixer-grid">
        <div className="after-hours-mixer-card">
          <div className="after-hours-list-label">Tempo / connective</div>
          <div className="after-hours-list-value">{first.player}</div>
          <p className="after-hours-list-copy">{first.translation}</p>
        </div>
        <div className="after-hours-mixer-card">
          <div className="after-hours-list-label">Utility / winning plays</div>
          <div className="after-hours-list-value">{second.player}</div>
          <p className="after-hours-list-copy">{second.translation}</p>
        </div>
      </div>
      <div className="after-hours-reveal" role="status">
        <div className="after-hours-list-label">Deterministic blend</div>
        <p className="mt-2">Connective pace with low-ego utility.</p>
      </div>
      <button
        type="button"
        className="after-hours-secondary-button"
        onClick={() => playAudioCue('level', soundEnabled)}
      >
        Lock the hybrid read
        <ArrowRight size={15} aria-hidden="true" />
      </button>
    </Panel>
  );
}

const PROOF_FOOTNOTES: Readonly<Record<string, { source: string; context: string }>> = {
  'PyPI/npm': {
    source: 'Public package surfaces',
    context:
      'The dossier names the released package lanes rather than implying private adoption data.',
  },
  Amazon: {
    source: 'Resume and public scouting file',
    context:
      'The enterprise read is internship experience across Ads and FinTech from 2023 through 2025.',
  },
  '400%': {
    source: 'Source-backed impact file',
    context:
      'The output figure belongs to architecture-firm productivity software delivered in under five weeks.',
  },
};

function BoxScoreFootnotes({ soundEnabled }: { soundEnabled: boolean }): ReactElement {
  return (
    <Panel eyebrow="Existing proof points" title="Read the footnotes.">
      <p className="after-hours-copy">
        The values stay exactly where they are on the home page. This file adds authored context for
        curious readers without changing the canonical content.
      </p>
      <div className="after-hours-list">
        {HERO_PROOF.map((proof) => {
          const footnote = PROOF_FOOTNOTES[proof.value];
          return (
            <div key={proof.value} className="after-hours-list-row">
              <span className="after-hours-list-index">{proof.value}</span>
              <div>
                <div className="after-hours-list-label">{footnote.source}</div>
                <p className="after-hours-list-copy">{footnote.context}</p>
              </div>
            </div>
          );
        })}
      </div>
      <button
        type="button"
        className="after-hours-secondary-button"
        onClick={() => playAudioCue('tap', soundEnabled)}
      >
        File noted
        <ArrowRight size={15} aria-hidden="true" />
      </button>
    </Panel>
  );
}

function DirectorsCut({
  project,
  soundEnabled,
}: {
  project: FilmRoomProject;
  soundEnabled: boolean;
}): ReactElement {
  const sequence = [
    ['Situation', project.situation],
    ['Challenge', project.challenge],
    ['Build', project.built],
    ['Result', project.result],
  ] as const;

  return (
    <Panel eyebrow={`Active case · ${project.title}`} title="Roll the short cut.">
      <p className="after-hours-copy">
        A user-started sequence pulled directly from the selected case study. The long-form case
        remains the source of record.
      </p>
      <div className="after-hours-sequence">
        {sequence.map(([label, copy], index) => (
          <article key={label} className="after-hours-sequence-step">
            <span className="after-hours-list-index">0{index + 1}</span>
            <div>
              <div className="after-hours-list-label">{label}</div>
              <p className="after-hours-list-copy">{copy}</p>
            </div>
          </article>
        ))}
      </div>
      <button
        type="button"
        className="after-hours-secondary-button"
        onClick={() => playAudioCue('level', soundEnabled)}
      >
        Mark the cut
        <ArrowRight size={15} aria-hidden="true" />
      </button>
    </Panel>
  );
}

export default function EggPanels({
  id,
  payload,
  soundEnabled,
  onClose,
}: EggPanelsProps): ReactElement {
  if (id === 'draft-lottery') return <DraftLottery soundEnabled={soundEnabled} />;
  if (id === 'chalkboard-play') return <ChalkboardPlay soundEnabled={soundEnabled} />;
  if (id === 'player-comp-mixer') return <PlayerCompMixer soundEnabled={soundEnabled} />;
  if (id === 'box-score-footnotes') return <BoxScoreFootnotes soundEnabled={soundEnabled} />;
  if (id === 'directors-cut') {
    return (
      <DirectorsCut
        project={payload?.caseStudy ?? FILM_ROOM_PROJECTS[0]}
        soundEnabled={soundEnabled}
      />
    );
  }

  return (
    <Panel eyebrow="Dossier utility" title="Back to the board.">
      <p className="after-hours-copy">This file lives in the margins of the public dossier.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" className="after-hours-primary-button" onClick={onClose}>
          Close file
        </button>
        <Link className="after-hours-secondary-button" to="/">
          Front page
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </Panel>
  );
}
