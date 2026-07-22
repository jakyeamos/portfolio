import type { FilmRoomProject } from '@/content/portfolioContent';

export const EASTER_EGG_IDS = [
  'build-ship',
  'draft-lottery',
  'chalkboard-play',
  'player-comp-mixer',
  'directors-cut',
  'box-score-footnotes',
  'night-shift',
  'notebook-margin',
  'locker-room-note',
  'off-the-board',
] as const;

export type EasterEggId = (typeof EASTER_EGG_IDS)[number];

export const EASTER_EGG_SURFACES = [
  'draft-desk',
  'prospect-poster',
  'project-court',
  'hybrid-read',
  'film-room-case',
  'home-proof',
  'footer-final-buzzer',
  'blog-notebook',
  'scouting-notes',
  'unknown-route',
] as const;

export type EasterEggSurface = (typeof EASTER_EGG_SURFACES)[number];

export interface EasterEggDefinition {
  id: EasterEggId;
  label: string;
  surface: EasterEggSurface;
  description: string;
  enabled: boolean;
}

export interface ApprovedCandidNote {
  slot: string;
  status: 'empty' | 'approved';
  copy?: string;
}

export interface EasterEggOpenPayload {
  caseStudy?: FilmRoomProject;
}

export interface EasterEggOpenRequest {
  id: EasterEggId;
  payload?: EasterEggOpenPayload;
}
