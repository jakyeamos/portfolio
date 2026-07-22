export interface DemoChapter {
  id: string;
  title: string;
  start: number;
  summary: string;
}

export interface DemoTranscriptLine {
  start: number;
  end: number;
  text: string;
}

export interface DemoVideo {
  slug: string;
  projectSlug: string;
  title: string;
  deck: string;
  broadcastLabel: string;
  mediaType: 'screen-recording';
  videoSrc: string;
  posterSrc: string;
  captionsSrc: string;
  transcript: readonly DemoTranscriptLine[];
  chapters: readonly DemoChapter[];
}

export const DEMO_VIDEOS: readonly DemoVideo[] = [
  {
    slug: 'bbdse-courtiq',
    projectSlug: 'bballedu',
    title: 'BBDSE CourtIQ',
    deck: 'A screen-recorded pass through the draft, lobby, and recap surfaces of the basketball product suite.',
    broadcastLabel: 'Feature presentation · Demo 001',
    mediaType: 'screen-recording',
    videoSrc: '/media/demos/bbdse-courtiq.webm',
    posterSrc: '/media/demos/bbdse-courtiq-poster.svg',
    captionsSrc: '/media/demos/bbdse-courtiq.vtt',
    transcript: [
      {
        start: 0,
        end: 7,
        text: 'CourtIQ opens with the public-facing basketball intelligence suite.',
      },
      {
        start: 7,
        end: 16,
        text: 'The draft room turns roster decisions into a teaching surface with context beside the pick.',
      },
      {
        start: 16,
        end: 25,
        text: 'The recap closes the loop with team construction, fit, and the next decision to make.',
      },
    ],
    chapters: [
      {
        id: 'opening-board',
        title: 'Opening board',
        start: 0,
        summary: 'The product suite and the decision loop in one frame.',
      },
      {
        id: 'draft-room',
        title: 'Draft room',
        start: 7,
        summary: 'A live pick with teaching context and roster fit alongside it.',
      },
      {
        id: 'recap',
        title: 'Recap',
        start: 16,
        summary: 'Post-draft analysis that explains what the build means.',
      },
    ],
  },
] as const;

export function getDemoVideo(slug: string): DemoVideo | undefined {
  return DEMO_VIDEOS.find((video) => video.slug === slug);
}
