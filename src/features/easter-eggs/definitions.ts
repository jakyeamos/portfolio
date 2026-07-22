import type { ApprovedCandidNote, EasterEggDefinition } from './types';

export const EASTER_EGG_DEFINITIONS: readonly EasterEggDefinition[] = [
  {
    id: 'build-ship',
    label: 'Build Ship',
    surface: 'draft-desk',
    description: 'A local build-operations arcade run.',
    enabled: true,
  },
  {
    id: 'draft-lottery',
    label: 'Draft Lottery',
    surface: 'prospect-poster',
    description: 'A playful projection from the public project board.',
    enabled: true,
  },
  {
    id: 'chalkboard-play',
    label: 'Chalkboard Play',
    surface: 'project-court',
    description: 'A short path through project nodes.',
    enabled: true,
  },
  {
    id: 'player-comp-mixer',
    label: 'Player Comp Mixer',
    surface: 'hybrid-read',
    description: 'A deterministic blend of the two public comp reads.',
    enabled: true,
  },
  {
    id: 'directors-cut',
    label: "Director's Cut",
    surface: 'film-room-case',
    description: 'A user-started case-study sequence.',
    enabled: true,
  },
  {
    id: 'box-score-footnotes',
    label: 'Box Score Footnotes',
    surface: 'home-proof',
    description: 'Context notes for the existing proof points.',
    enabled: true,
  },
  {
    id: 'night-shift',
    label: 'Night Shift',
    surface: 'footer-final-buzzer',
    description: 'A temporary after-hours palette for this session.',
    enabled: true,
  },
  {
    id: 'notebook-margin',
    label: 'Notebook Margin',
    surface: 'blog-notebook',
    description: 'Reserved for an approved candid note.',
    enabled: false,
  },
  {
    id: 'locker-room-note',
    label: 'Locker Room Note',
    surface: 'scouting-notes',
    description: 'Reserved for an approved candid note.',
    enabled: false,
  },
  {
    id: 'off-the-board',
    label: 'Off the Board',
    surface: 'unknown-route',
    description: 'A useful fallback for routes outside the dossier.',
    enabled: true,
  },
] as const;

export const APPROVED_CANDID_NOTES: readonly ApprovedCandidNote[] = [
  { slot: 'notebook-margin', status: 'empty' },
  { slot: 'locker-room-note', status: 'empty' },
] as const;

export function getEasterEggDefinition(id: string): EasterEggDefinition | undefined {
  return EASTER_EGG_DEFINITIONS.find((definition) => definition.id === id);
}
