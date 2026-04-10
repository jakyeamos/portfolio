export interface PosterMediaAsset {
  imageSrc?: string;
  videoSrc?: string;
  posterSrc?: string;
  alt: string;
  objectPosition?: string;
}

export const PORTFOLIO_ASSETS = {
  home: {
    broadcastLead: {
      imageSrc: '/media/headshots/jakye-main.jpg',
      alt: 'Jakye Amos headshot',
      objectPosition: 'center 18%',
    },
    broadcastBooth: {
      imageSrc: '/media/headshots/jakye-main.jpg',
      alt: 'Jakye Amos headshot used as the broadcast poster image',
      objectPosition: 'center 20%',
    },
  },
  scouting: {
    portrait: {
      imageSrc: '/media/headshots/jakye-main.jpg',
      alt: 'Jakye Amos portrait headshot',
      objectPosition: 'center 16%',
    },
  },
  playerComps: {
    haliburton: {
      imageSrc: 'https://a.espncdn.com/i/headshots/nba/players/full/4396993.png',
      alt: 'Tyrese Haliburton headshot',
      objectPosition: 'center top',
    },
    ausar: {
      imageSrc: 'https://a.espncdn.com/i/headshots/nba/players/full/4684742.png',
      alt: 'Ausar Thompson headshot',
      objectPosition: 'center top',
    },
  },
  projects: {
    soundscape: {
      alt: 'Soundscape project screenshot',
      objectPosition: 'center top',
    },
    preCRSuite: {
      alt: 'Pre-CR Suite editor screenshot',
      objectPosition: 'center top',
    },
    deepr: {
      alt: 'Deepr carousel system screenshot',
      objectPosition: 'center top',
    },
  },
  broadcast: {
    introVideo: {
      posterSrc: '/media/intro/scouting-poster.jpg',
      videoSrc: '/media/intro/scouting-intro.mp4',
      alt: 'Jakye Amos scouting intro video poster',
      objectPosition: 'center 18%',
    },
    voiceoverSrc: '/media/intro/scouting-voiceover.mp3',
  },
} as const;
