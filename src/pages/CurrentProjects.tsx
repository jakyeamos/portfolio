import { type CSSProperties, type ReactElement, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  CircleDot,
  ExternalLink,
  HelpCircle,
  MapPin,
  Play,
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
const ALL_PROJECTS: readonly CurrentProject[] = [...CURRENT_PROJECTS, ...CLOSED_PROJECTS] as const;

type CourtPoint = {
  left: number;
  top: number;
};

type ProjectCourtLayout = {
  project: CurrentProject;
  markerSize: number;
  point: CourtPoint;
  position: CSSProperties;
};

type ShotEmbed =
  | {
      provider: 'youtube';
      id: string;
      start: number;
      end: number;
      sourceUrl?: string;
    }
  | {
      provider: 'vimeo';
      id: string;
      sourceUrl?: string;
    }
  | {
      provider: 'nba' | 'external';
      url: string;
    };

type ShotClipQuality = {
  level: 'verified-game-clip';
  reviewedAt: string;
  note: string;
};

type HistoricShot = {
  id: string;
  player: string;
  moment: string;
  zone: string;
  note: string;
  embed?: ShotEmbed;
  quality?: ShotClipQuality;
  source: string;
};

type HistoricShotZone =
  | 'deepLeft'
  | 'deepTop'
  | 'rightCorner'
  | 'leftBaselineWing'
  | 'aboveBreak'
  | 'midrange';

const HISTORIC_SHOT_POOLS: Record<HistoricShotZone, readonly HistoricShot[]> = {
  deepLeft: [
    {
      id: 'lillard-okc-2019',
      player: 'Damian Lillard',
      moment: '2019 series clincher vs OKC',
      zone: 'Deep left wing',
      note: 'A long-range confidence shot from the same high-upside territory.',
      embed: {
        provider: 'youtube',
        id: 'HMm5NtXLVDY',
        start: 0,
        end: 32,
      },
      quality: {
        level: 'verified-game-clip',
        reviewedAt: '2026-06-23',
        note: 'NBA channel result titled for Lillard epic game-winner against OKC.',
      },
      source: 'NBA on YouTube',
    },
    {
      id: 'lillard-rockets-2014',
      player: 'Damian Lillard',
      moment: '2014 series clincher vs Houston',
      zone: 'Left wing three',
      note: 'A clean catch-and-fire ending from the left side of the floor.',
      embed: {
        provider: 'youtube',
        id: 'mejFtEY5faU',
        start: 0,
        end: 28,
      },
      quality: {
        level: 'verified-game-clip',
        reviewedAt: '2026-06-23',
        note: 'NBA channel result titled for Lillard game winner over Houston.',
      },
      source: 'NBA on YouTube',
    },
    {
      id: 'luka-clippers-2020',
      player: 'Luka Doncic',
      moment: '2020 bubble winner vs LA Clippers',
      zone: 'Left wing stepback',
      note: 'A left-wing creation shot under playoff pressure.',
      embed: {
        provider: 'youtube',
        id: 'Mz3TBKrBp5M',
        start: 0,
        end: 36,
      },
      quality: {
        level: 'verified-game-clip',
        reviewedAt: '2026-06-23',
        note: 'NBA channel every-angle result for Doncic Game 4 OT buzzer-beater.',
      },
      source: 'NBA on YouTube',
    },
  ],
  deepTop: [
    {
      id: 'curry-okc-2016',
      player: 'Stephen Curry',
      moment: '2016 overtime winner at OKC',
      zone: 'Deep top wing',
      note: 'A pull-up from range: early, confident, and hard to guard.',
      embed: {
        provider: 'youtube',
        id: 'GEMVGHoenXM',
        start: 0,
        end: 30,
      },
      quality: {
        level: 'verified-game-clip',
        reviewedAt: '2026-06-23',
        note: 'Direct clip source for Curry OKC 2016 shot.',
      },
      source: 'NBA on YouTube',
    },
    {
      id: 'trae-knicks-2021',
      player: 'Trae Young',
      moment: '2021 playoff silencer at Madison Square Garden',
      zone: 'High slot floater',
      note: 'A high-floor pressure shot with the whole arena leaning on it.',
      embed: {
        provider: 'youtube',
        id: 'CGLacgHgvTs',
        start: 0,
        end: 31,
      },
      quality: {
        level: 'verified-game-clip',
        reviewedAt: '2026-06-23',
        note: 'Short source titled for Trae Young game-winner and MSG quieting gesture.',
      },
      source: 'YouTube',
    },
    {
      id: 'curry-france-2024',
      player: 'Stephen Curry',
      moment: '2024 gold-medal dagger vs France',
      zone: 'Deep top pull-up',
      note: 'A late-clock distance shot that turned difficulty into separation.',
      embed: {
        provider: 'youtube',
        id: 'DPDUDPCttfc',
        start: 220,
        end: 255,
      },
      quality: {
        level: 'verified-game-clip',
        reviewedAt: '2026-06-23',
        note: 'Olympics all-threes source windowed to Curry Paris 2024 closing threes.',
      },
      source: 'Olympics on YouTube',
    },
  ],
  rightCorner: [
    {
      id: 'allen-spurs-2013',
      player: 'Ray Allen',
      moment: '2013 Finals Game 6 corner three',
      zone: 'Right corner',
      note: 'A precision reset shot: footwork, timing, and a clean release.',
      embed: {
        provider: 'youtube',
        id: 'ua_w5RxpFIQ',
        start: 780,
        end: 812,
      },
      quality: {
        level: 'verified-game-clip',
        reviewedAt: '2026-06-23',
        note: 'Full-game source positioned near Allen Spurs 2013 corner three.',
      },
      source: 'NBA on YouTube',
    },
    {
      id: 'kerr-jazz-1997',
      player: 'Steve Kerr',
      moment: '1997 Finals Game 6 winner',
      zone: 'Right slot release',
      note: 'A trust-the-system shot: small window, huge consequence.',
      embed: {
        provider: 'youtube',
        id: 'nJgPKeMOL-s',
        start: 0,
        end: 28,
      },
      quality: {
        level: 'verified-game-clip',
        reviewedAt: '2026-06-23',
        note: 'NBA channel result titled for Kerr game-winner against Utah in 1997.',
      },
      source: 'NBA on YouTube',
    },
    {
      id: 'horry-kings-2002',
      player: 'Robert Horry',
      moment: '2002 Western Finals Game 4 winner',
      zone: 'Right-side three',
      note: 'A scramble-possession three where spacing and readiness mattered.',
      embed: {
        provider: 'youtube',
        id: '4iEF6JXeZqI',
        start: 0,
        end: 35,
      },
      quality: {
        level: 'verified-game-clip',
        reviewedAt: '2026-06-23',
        note: 'Short source titled for Horry game-winning three against Sacramento.',
      },
      source: 'YouTube',
    },
  ],
  leftBaselineWing: [
    {
      id: 'kawhi-sixers-2019',
      player: 'Kawhi Leonard',
      moment: '2019 Game 7 winner vs Philadelphia',
      zone: 'Left baseline wing',
      note: 'A high-arc shot from a tight angle with real consequence.',
      embed: {
        provider: 'youtube',
        id: '75iExVNvrWw',
        start: 0,
        end: 36,
      },
      quality: {
        level: 'verified-game-clip',
        reviewedAt: '2026-06-23',
        note: 'NBA channel result titled for Kawhi winning the series at the buzzer.',
      },
      source: 'NBA on YouTube',
    },
    {
      id: 'fisher-spurs-2004',
      player: 'Derek Fisher',
      moment: '2004 0.4-second winner vs San Antonio',
      zone: 'Left baseline catch',
      note: 'A near-impossible release from the baseline side.',
      embed: {
        provider: 'youtube',
        id: 'p-u4pIQyjfE',
        start: 0,
        end: 24,
      },
      quality: {
        level: 'verified-game-clip',
        reviewedAt: '2026-06-23',
        note: 'NBA channel result titled for Fisher 0.4-second game winner.',
      },
      source: 'NBA on YouTube',
    },
    {
      id: 'booker-clippers-2020',
      player: 'Devin Booker',
      moment: '2020 bubble winner vs LA Clippers',
      zone: 'Left baseline fade',
      note: 'A contested baseline touch shot with no clean landing space.',
      embed: {
        provider: 'youtube',
        id: '0mU-bEOPujM',
        start: 0,
        end: 35,
      },
      quality: {
        level: 'verified-game-clip',
        reviewedAt: '2026-06-23',
        note: 'NBA channel every-angle result for Booker bubble buzzer-beater against the Clippers.',
      },
      source: 'NBA on YouTube',
    },
  ],
  aboveBreak: [
    {
      id: 'lebron-pacers-2018',
      player: 'LeBron James',
      moment: '2018 Game 5 winner vs Indiana',
      zone: 'Above-the-break three',
      note: 'A late-clock launch: direct, decisive, and built on pressure.',
      embed: {
        provider: 'youtube',
        id: 'JYmejM38vKs',
        start: 26,
        end: 48,
      },
      quality: {
        level: 'verified-game-clip',
        reviewedAt: '2026-06-23',
        note: 'ESPN full-sequence source windowed with absolute YouTube seconds for the shot setup, make, and first replay.',
      },
      source: 'ESPN on YouTube',
    },
    {
      id: 'kyrie-warriors-2016',
      player: 'Kyrie Irving',
      moment: '2016 Finals Game 7 go-ahead three',
      zone: 'Right wing above the break',
      note: 'A high-skill isolation three with the title hanging on the possession.',
      embed: {
        provider: 'youtube',
        id: 'fZ8yCJgsF_4',
        start: 0,
        end: 34,
      },
      quality: {
        level: 'verified-game-clip',
        reviewedAt: '2026-06-23',
        note: 'NBA channel result titled for Kyrie clutch three in Game 7 of the 2016 Finals.',
      },
      source: 'NBA on YouTube',
    },
    {
      id: 'durant-cavs-2017',
      player: 'Kevin Durant',
      moment: '2017 Finals Game 3 pull-up',
      zone: 'Left slot above the break',
      note: 'A transition pull-up that rewarded full-court ambition.',
      embed: {
        provider: 'youtube',
        id: '3t8w00NrDBE',
        start: 0,
        end: 32,
      },
      quality: {
        level: 'verified-game-clip',
        reviewedAt: '2026-06-23',
        note: 'Short source titled for Durant Game 3 dagger three.',
      },
      source: 'YouTube',
    },
    {
      id: 'tatum-sixers-2023',
      player: 'Jayson Tatum',
      moment: '2023 Game 6 late three vs Philadelphia',
      zone: 'Left wing above the break',
      note: 'A cold-stretch breaker that kept the whole series alive.',
      embed: {
        provider: 'youtube',
        id: 'NLOJvl98SwQ',
        start: 0,
        end: 34,
      },
      quality: {
        level: 'verified-game-clip',
        reviewedAt: '2026-06-23',
        note: 'NBA channel result covers Tatum fourth-quarter Game 6 run against Philadelphia.',
      },
      source: 'NBA on YouTube',
    },
    {
      id: 'murray-lakers-2024',
      player: 'Jamal Murray',
      moment: '2024 playoff winner vs Lakers',
      zone: 'Right wing pull-up',
      note: 'A rhythm pull-up from the wing after a full-game pressure build.',
      embed: {
        provider: 'youtube',
        id: 'T3xk9vay5tE',
        start: 0,
        end: 32,
      },
      quality: {
        level: 'verified-game-clip',
        reviewedAt: '2026-06-23',
        note: 'NBA channel result titled for Murray game-winner against the Lakers on April 29, 2024.',
      },
      source: 'NBA on YouTube',
    },
    {
      id: 'haliburton-knicks-2025',
      player: 'Tyrese Haliburton',
      moment: '2025 playoff four-point play vs New York',
      zone: 'Top-side pull-up',
      note: 'A modern shot-profile swing: space, nerve, and instant leverage.',
      embed: {
        provider: 'youtube',
        id: 'XxSr2nArxkA',
        start: 115,
        end: 148,
      },
      quality: {
        level: 'verified-game-clip',
        reviewedAt: '2026-06-23',
        note: 'NBA channel result covers the Pacers Game 1 comeback against New York.',
      },
      source: 'NBA on YouTube',
    },
    {
      id: 'wade-warriors-2019',
      player: 'Dwyane Wade',
      moment: '2019 one-legged bank winner vs Golden State',
      zone: 'High right wing',
      note: 'A broken-play heave that turned improvisation into a highlight.',
      embed: {
        provider: 'youtube',
        id: 'lm1wzEL8FZY',
        start: 0,
        end: 29,
      },
      quality: {
        level: 'verified-game-clip',
        reviewedAt: '2026-06-23',
        note: 'NBA channel result titled for Wade buzzer-beater against Golden State.',
      },
      source: 'NBA on YouTube',
    },
    {
      id: 'morant-wolves-2022',
      player: 'Ja Morant',
      moment: '2022 Game 5 winner vs Minnesota',
      zone: 'High lane attack',
      note: 'A downhill late-clock finish from above the break into the paint.',
      embed: {
        provider: 'youtube',
        id: '23GkX-ZeKx4',
        start: 0,
        end: 35,
      },
      quality: {
        level: 'verified-game-clip',
        reviewedAt: '2026-06-23',
        note: 'Short source titled for Morant game-winner after Edwards tied the game.',
      },
      source: 'YouTube',
    },
    {
      id: 'reggie-knicks-1995',
      player: 'Reggie Miller',
      moment: '1995 eight-points-in-nine-seconds three',
      zone: 'Above-the-break three',
      note: 'A pressure swing shot where momentum flipped instantly.',
      embed: {
        provider: 'youtube',
        id: 'MRLysMEHokI',
        start: 0,
        end: 38,
      },
      quality: {
        level: 'verified-game-clip',
        reviewedAt: '2026-06-23',
        note: 'Indiana Pacers result contains Miller complete eight-points-in-nine-seconds sequence.',
      },
      source: 'Indiana Pacers on YouTube',
    },
    {
      id: 'paul-spurs-2015',
      player: 'Chris Paul',
      moment: '2015 Game 7 winner vs San Antonio',
      zone: 'High right lane',
      note: 'A one-legged high-angle shot over elite defense.',
      embed: {
        provider: 'youtube',
        id: 'xb95YLw1bns',
        start: 0,
        end: 33,
      },
      quality: {
        level: 'verified-game-clip',
        reviewedAt: '2026-06-23',
        note: 'NBA channel result titled for Chris Paul heroics in Game 7 against San Antonio.',
      },
      source: 'NBA on YouTube',
    },
    {
      id: 'luka-celtics-2025',
      player: 'Luka Doncic',
      moment: 'Late-clock stepback from the high slot',
      zone: 'High slot stepback',
      note: 'A shot profile built on size, patience, and impossible timing.',
      embed: {
        provider: 'youtube',
        id: '1as8JsjQrF0',
        start: 0,
        end: 30,
      },
      quality: {
        level: 'verified-game-clip',
        reviewedAt: '2026-06-23',
        note: 'ESPN Signature Shots source for Doncic stepback shot profile.',
      },
      source: 'ESPN on YouTube',
    },
    {
      id: 'fox-warriors-2023',
      player: 'De Aaron Fox',
      moment: '2023 playoff pull-up pressure three',
      zone: 'High right slot',
      note: 'A pace-changing guard shot from the modern playoff map.',
      embed: {
        provider: 'youtube',
        id: 'B7wuI0dnK1M',
        start: 0,
        end: 35,
      },
      quality: {
        level: 'verified-game-clip',
        reviewedAt: '2026-06-23',
        note: 'NBA channel Game 4 guard-battle clip for Fox playoff shot-making against Golden State.',
      },
      source: 'NBA on YouTube',
    },
    {
      id: 'mitchell-nuggets-2020',
      player: 'Donovan Mitchell',
      moment: '2020 bubble scoring-run pull-up',
      zone: 'Top wing pull-up',
      note: 'A shot from the zone where scoring bursts start to feel inevitable.',
      embed: {
        provider: 'youtube',
        id: 'JgYnmcsUiHQ',
        start: 0,
        end: 35,
      },
      quality: {
        level: 'verified-game-clip',
        reviewedAt: '2026-06-23',
        note: 'Short source titled for Mitchell dagger three against Denver.',
      },
      source: 'YouTube',
    },
    {
      id: 'booker-suns-2021',
      player: 'Devin Booker',
      moment: '2021 playoff pull-up dagger',
      zone: 'Above-the-break pull-up',
      note: 'A clean scorer shot from the first layer above the arc.',
      embed: {
        provider: 'youtube',
        id: 'PuuDPaTZbmk',
        start: 0,
        end: 35,
      },
      quality: {
        level: 'verified-game-clip',
        reviewedAt: '2026-06-23',
        note: 'NBA playoff debut source for Booker playoff shot-making.',
      },
      source: 'NBA on YouTube',
    },
    {
      id: 'butler-bucks-2023',
      player: 'Jimmy Butler',
      moment: '2023 playoff late-game bailout vs Milwaukee',
      zone: 'High slot creation',
      note: 'A possession-saving shot built more on nerve than comfort.',
      embed: {
        provider: 'youtube',
        id: 'R0d-PK1iI8U',
        start: 170,
        end: 205,
      },
      quality: {
        level: 'verified-game-clip',
        reviewedAt: '2026-06-23',
        note: 'NBA channel uncut end-of-regulation clip for Butler Game 5 against Milwaukee.',
      },
      source: 'NBA on YouTube',
    },
    {
      id: 'edwards-nuggets-2024',
      player: 'Anthony Edwards',
      moment: '2024 playoff pull-up pressure shot vs Denver',
      zone: 'Above-the-break pull-up',
      note: 'A modern power-guard shot from the part of the floor where confidence shows first.',
      embed: {
        provider: 'youtube',
        id: 'y_EbaSvRh_U',
        start: 0,
        end: 35,
      },
      quality: {
        level: 'verified-game-clip',
        reviewedAt: '2026-06-23',
        note: 'NBA Game 1 Denver source for Edwards playoff pull-up scoring.',
      },
      source: 'NBA on YouTube',
    },
  ],
  midrange: [
    {
      id: 'jordan-jazz-1998',
      player: 'Michael Jordan',
      moment: '1998 Finals Game 6 title clincher',
      zone: 'Midrange wing',
      note: 'A controlled separation shot from the part of the floor where craft matters.',
      embed: {
        provider: 'youtube',
        id: 'iZlIE0cexwM',
        start: 0,
        end: 31,
      },
      quality: {
        level: 'verified-game-clip',
        reviewedAt: '2026-06-23',
        note: 'Short source titled for Jordan 1998 last shot.',
      },
      source: 'YouTube',
    },
    {
      id: 'jordan-cavs-1989',
      player: 'Michael Jordan',
      moment: '1989 series winner vs Cleveland',
      zone: 'Left elbow pull-up',
      note: 'The classic rise-and-hang playoff midrange shot.',
      embed: {
        provider: 'youtube',
        id: 'a0TKEofio7w',
        start: 0,
        end: 32,
      },
      quality: {
        level: 'verified-game-clip',
        reviewedAt: '2026-06-23',
        note: 'NBA channel result titled for Jordan iconic game-winner in Cleveland.',
      },
      source: 'NBA on YouTube',
    },
    {
      id: 'kobe-suns-2006',
      player: 'Kobe Bryant',
      moment: '2006 playoff winner vs Phoenix',
      zone: 'Right elbow pull-up',
      note: 'A two-dribble midrange shot from the league’s hardest comfort zone.',
      embed: {
        provider: 'youtube',
        id: '_jxHf7h6U58',
        start: 0,
        end: 36,
      },
      quality: {
        level: 'verified-game-clip',
        reviewedAt: '2026-06-23',
        note: 'Playable short source for Kobe 2006 buzzer-beater against Phoenix.',
      },
      source: 'YouTube',
    },
    {
      id: 'dirk-heat-2011',
      player: 'Dirk Nowitzki',
      moment: '2011 Finals lefty finish vs Miami',
      zone: 'Left lane touch',
      note: 'A high-leverage touch shot from a creator who lived between zones.',
      embed: {
        provider: 'youtube',
        id: '9k4Li-iT8QU',
        start: 0,
        end: 28,
      },
      quality: {
        level: 'verified-game-clip',
        reviewedAt: '2026-06-23',
        note: 'NBA channel result titled for Dirk game winner against Miami.',
      },
      source: 'NBA on YouTube',
    },
    {
      id: 'pierce-hawks-2015',
      player: 'Paul Pierce',
      moment: '2015 banked winner vs Atlanta',
      zone: 'Left elbow bank',
      note: 'A veteran midrange bank that turned timing into theater.',
      embed: {
        provider: 'youtube',
        id: 'KGnTSu0orgc',
        start: 0,
        end: 27,
      },
      quality: {
        level: 'verified-game-clip',
        reviewedAt: '2026-06-23',
        note: 'NBA channel result titled for Pierce banked Game 3 winner.',
      },
      source: 'NBA on YouTube',
    },
    {
      id: 'garnett-kings-2004',
      player: 'Kevin Garnett',
      moment: '2004 Game 7 turnaround vs Sacramento',
      zone: 'High-post fade',
      note: 'A big-wing shot from the high post under elimination pressure.',
      embed: {
        provider: 'youtube',
        id: 'OKp-mxqUels',
        start: 0,
        end: 35,
      },
      quality: {
        level: 'verified-game-clip',
        reviewedAt: '2026-06-23',
        note: 'Short source for Garnett greatest-game sequence against Sacramento.',
      },
      source: 'YouTube',
    },
    {
      id: 'durant-bucks-2021',
      player: 'Kevin Durant',
      moment: '2021 Game 7 toe-on-line jumper vs Milwaukee',
      zone: 'Left wing long two',
      note: 'A long two so close to three that the geometry became the story.',
      embed: {
        provider: 'youtube',
        id: '6rPRAjLymBc',
        start: 0,
        end: 12,
      },
      quality: {
        level: 'verified-game-clip',
        reviewedAt: '2026-06-23',
        note: 'Short source titled for Durant game-tying shot against Milwaukee.',
      },
      source: 'YouTube',
    },
    {
      id: 'derozan-raptors-2018',
      player: 'DeMar DeRozan',
      moment: 'Late-game footwork jumper from the elbow',
      zone: 'Elbow midrange',
      note: 'A footwork-and-balance shot from a pure midrange specialist.',
      embed: {
        provider: 'youtube',
        id: '1CIIvmr58sA',
        start: 0,
        end: 30,
      },
      quality: {
        level: 'verified-game-clip',
        reviewedAt: '2026-06-23',
        note: 'Toronto Raptors result titled for DeRozan clutch jumper.',
      },
      source: 'Toronto Raptors on YouTube',
    },
    {
      id: 'anthony-knicks-2012',
      player: 'Carmelo Anthony',
      moment: 'Easter double-overtime jumper vs Chicago',
      zone: 'Left wing midrange',
      note: 'A jab-step scorer shot from a wing who made this area dangerous.',
      embed: {
        provider: 'youtube',
        id: 'H9neM8by1SQ',
        start: 0,
        end: 36,
      },
      quality: {
        level: 'verified-game-clip',
        reviewedAt: '2026-06-23',
        note: 'Playable YouTube source for Carmelo clutch threes against Chicago on Easter.',
      },
      source: 'YouTube',
    },
    {
      id: 'booker-clippers-2021',
      player: 'Devin Booker',
      moment: '2021 playoff midrange heater vs LA Clippers',
      zone: 'Right elbow pull-up',
      note: 'A polished scorer shot from the pocket between math and craft.',
      embed: {
        provider: 'youtube',
        id: 'QjsuBaQVqnw',
        start: 0,
        end: 32,
      },
      quality: {
        level: 'verified-game-clip',
        reviewedAt: '2026-06-23',
        note: 'Short source titled for Booker signature midrange pull-up against the Clippers.',
      },
      source: 'YouTube',
    },
    {
      id: 'paul-bucks-2021',
      player: 'Chris Paul',
      moment: '2021 Finals snake-dribble jumper',
      zone: 'Free-throw-line pull-up',
      note: 'A controlled point-guard shot from the center of the floor.',
      embed: {
        provider: 'youtube',
        id: 'KhhhrUHMMU4',
        start: 0,
        end: 36,
      },
      quality: {
        level: 'verified-game-clip',
        reviewedAt: '2026-06-23',
        note: 'Playable YouTube source for Chris Paul midrange takeover sequence in the 2021 Finals.',
      },
      source: 'YouTube',
    },
    {
      id: 'shai-nuggets-2025',
      player: 'Shai Gilgeous-Alexander',
      moment: 'Playoff stop-and-rise midrange jumper',
      zone: 'Right lane pull-up',
      note: 'A modern pressure midrange shot built on pace and balance.',
      embed: {
        provider: 'youtube',
        id: 'ih2bjlg48YQ',
        start: 0,
        end: 35,
      },
      quality: {
        level: 'verified-game-clip',
        reviewedAt: '2026-06-23',
        note: 'NBA channel Game 4 clip for Gilgeous-Alexander playoff scoring against Denver.',
      },
      source: 'NBA on YouTube',
    },
    {
      id: 'brunson-sixers-2024',
      player: 'Jalen Brunson',
      moment: '2024 playoff pull-up run vs Philadelphia',
      zone: 'Left elbow pull-up',
      note: 'A compact guard shot from a playoff series built on counters.',
      embed: {
        provider: 'youtube',
        id: '782QfcAxH1Q',
        start: 0,
        end: 34,
      },
      quality: {
        level: 'verified-game-clip',
        reviewedAt: '2026-06-23',
        note: 'NBA channel game-winning sequence result featuring Brunson and DiVincenzo against Philadelphia.',
      },
      source: 'NBA on YouTube',
    },
    {
      id: 'leonard-mavs-2021',
      player: 'Kawhi Leonard',
      moment: '2021 elimination-game midrange run vs Dallas',
      zone: 'Right wing long two',
      note: 'A strength-and-balance shot from one of the best wing creators.',
      embed: {
        provider: 'youtube',
        id: 'KdND5Jvka20',
        start: 0,
        end: 32,
      },
      quality: {
        level: 'verified-game-clip',
        reviewedAt: '2026-06-23',
        note: 'Short source titled for Kawhi clutch dagger and Game 6 scoring against Dallas.',
      },
      source: 'YouTube',
    },
    {
      id: 'wade-mavericks-2006',
      player: 'Dwyane Wade',
      moment: '2006 Finals pressure pull-up vs Dallas',
      zone: 'Right lane pull-up',
      note: 'A downhill guard shot from the boundary between paint and midrange.',
      embed: {
        provider: 'youtube',
        id: 'S3G_XTLunKA',
        start: 250,
        end: 285,
      },
      quality: {
        level: 'verified-game-clip',
        reviewedAt: '2026-06-23',
        note: 'Playable YouTube source for Wade clutch Game 5 performance against Dallas.',
      },
      source: 'YouTube',
    },
    {
      id: 'parker-heat-2013',
      player: 'Tony Parker',
      moment: '2013 Finals Game 1 falling jumper',
      zone: 'High lane floater',
      note: 'A balance-breaking shot that used time, angle, and touch.',
      embed: {
        provider: 'youtube',
        id: 'oRFiKbI5CXc',
        start: 0,
        end: 34,
      },
      quality: {
        level: 'verified-game-clip',
        reviewedAt: '2026-06-23',
        note: 'NBA every-angle source for Parker Game 1 buzzer-beater against Miami.',
      },
      source: 'NBA on YouTube',
    },
    {
      id: 'rose-cavs-2015',
      player: 'Derrick Rose',
      moment: '2015 banked winner vs Cleveland',
      zone: 'Left wing bank',
      note: 'A sudden midrange-window shot that turned a broken possession into a roar.',
      embed: {
        provider: 'youtube',
        id: 'wd3mxCQlve4',
        start: 0,
        end: 34,
      },
      quality: {
        level: 'verified-game-clip',
        reviewedAt: '2026-06-23',
        note: 'NBA channel every-angle result for Rose game-winning buzzer-beater.',
      },
      source: 'NBA on YouTube',
    },
  ],
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

function normalizeCourtPoints(points: readonly CourtPoint[]): CourtPoint[] {
  const leftValues = points.map((point) => point.left);
  const topValues = points.map((point) => point.top);
  const minLeft = Math.min(...leftValues);
  const maxLeft = Math.max(...leftValues);
  const minTop = Math.min(...topValues);
  const maxTop = Math.max(...topValues);
  const leftRange = maxLeft - minLeft;
  const topRange = maxTop - minTop;

  return points.map((point) => ({
    left: leftRange < 1 ? 50 : 10 + ((point.left - minLeft) / leftRange) * 80,
    top: topRange < 1 ? 48 : 8 + ((point.top - minTop) / topRange) * 80,
  }));
}

function markerSizeForProject(project: CurrentProject): number {
  return 14 + project.grades.ambition;
}

function getThreePointArcTop(left: number): number {
  const arcX = clamp(left, 7, 93);
  const dx = arcX - 50;
  const radius = 43;

  return 96 - Math.sqrt(Math.max(0, radius ** 2 - dx ** 2));
}

function isOutsideThreePointLine(point: CourtPoint): boolean {
  if (point.left <= 7 || point.left >= 93) return point.top <= 77;

  return point.top <= getThreePointArcTop(point.left);
}

function getHistoricShotZone(point: CourtPoint): HistoricShotZone {
  const isOutsideArc = isOutsideThreePointLine(point);
  const isDeep = point.top <= 30;
  const isCornerDepth = point.top >= 62;

  if (!isOutsideArc) return 'midrange';
  if (isCornerDepth && point.left >= 84) return 'rightCorner';
  if (isCornerDepth && point.left <= 16) return 'leftBaselineWing';
  if (isDeep && point.left < 42) return 'deepLeft';
  if (isDeep && point.left >= 42 && point.left <= 58) return 'deepTop';

  return 'aboveBreak';
}

function getHistoricShot(
  project: CurrentProject,
  point: CourtPoint,
  layout: readonly ProjectCourtLayout[],
): HistoricShot {
  const zone = getHistoricShotZone(point);
  const pool = HISTORIC_SHOT_POOLS[zone];
  const embeddablePool = pool.filter((shot) => shot.embed && shot.quality?.level === 'verified-game-clip');
  const selectionPool = embeddablePool.length > 0 ? embeddablePool : pool;
  const zoneRank = layout
    .filter((candidate) => getHistoricShotZone(candidate.point) === zone)
    .findIndex((candidate) => candidate.project.slug === project.slug);
  const instanceIndex = Math.max(0, zoneRank);

  return selectionPool[instanceIndex % selectionPool.length];
}

function getShotEmbedUrl(embed: ShotEmbed): string | null {
  if (embed.provider === 'youtube') {
    const embedParams = new URLSearchParams({
      autoplay: '1',
      mute: '1',
      start: String(embed.start),
      end: String(embed.end),
      rel: '0',
      modestbranding: '1',
      playsinline: '1',
    });

    return `https://www.youtube.com/embed/${embed.id}?${embedParams.toString()}`;
  }

  if (embed.provider === 'vimeo') {
    const embedParams = new URLSearchParams({
      autoplay: '1',
      muted: '1',
    });

    return `https://player.vimeo.com/video/${embed.id}?${embedParams.toString()}`;
  }

  return null;
}

function getShotSourceUrl(embed: ShotEmbed): string | null {
  if (embed.provider === 'youtube') return embed.sourceUrl ?? `https://www.youtube.com/watch?v=${embed.id}`;
  if (embed.provider === 'vimeo') return embed.sourceUrl ?? `https://vimeo.com/${embed.id}`;

  return embed.url;
}

function buildCourtLayout(projects: readonly CurrentProject[], axis: ProjectAxis): ProjectCourtLayout[] {
  const rawPoints = projects.map((project) => getShotCoordinates(project, axis));
  const normalizedPoints = normalizeCourtPoints(rawPoints);
  const points = projects.map((project, index) => ({
    project,
    markerSize: markerSizeForProject(project),
    ...normalizedPoints[index],
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
    point: { left, top },
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

function HistoricShotPlayer({
  point,
  shot,
}: {
  point: CourtPoint;
  shot: HistoricShot;
}): ReactElement {
  const playerLeft = clamp(point.left, 8, 92);
  const playerTop = clamp(point.top * 0.57, 7, 50);
  const rimX = 50;
  const rimY = 54;
  const controlX = clamp((playerLeft + rimX) / 2, 14, 86);
  const controlY = clamp(Math.min(playerTop, rimY) - 18, 8, 82);
  const arcPath = `M ${playerLeft} ${playerTop} Q ${controlX} ${controlY} ${rimX} ${rimY}`;
  const embedUrl = shot.embed ? getShotEmbedUrl(shot.embed) : null;
  const sourceUrl = shot.embed ? getShotSourceUrl(shot.embed) : null;

  return (
    <section className="border border-[color:var(--color-line)] bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="section-kicker">Historic Shot Clip</div>
        <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-ink-soft)]">
          {shot.source}
        </span>
      </div>

      <div className="mt-3 overflow-hidden border border-[color:var(--color-line)] bg-[color:var(--color-surface-muted)]">
        <div className="relative h-[200px]">
          {embedUrl ? (
            <iframe
              title={`${shot.player} ${shot.moment}`}
              src={embedUrl}
              className="absolute inset-0 z-10 h-full w-full border-0"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : null}
          <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <rect x="1" y="1" width="98" height="58" fill="none" stroke="rgba(21,24,32,0.18)" strokeWidth="0.8" />
            <path
              d="M 7 58 L 7 43 A 43 27 0 0 1 93 43 L 93 58"
              fill="none"
              stroke="rgba(21,24,32,0.22)"
              strokeWidth="0.8"
            />
            <rect x="38" y="37" width="24" height="18" fill="none" stroke="rgba(21,24,32,0.18)" strokeWidth="0.8" />
            <line x1="42" y1="56" x2="58" y2="56" stroke="rgba(181,13,13,0.65)" strokeWidth="1.2" />
            <circle cx="50" cy="54" r="2.3" fill="rgba(181,13,13,0.12)" stroke="rgba(181,13,13,0.75)" strokeWidth="0.9" />
            <motion.path
              d={arcPath}
              fill="none"
              stroke="rgba(181,13,13,0.58)"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeDasharray="3 3"
              initial={{ pathLength: 0, opacity: 0.25 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
            />
            <g transform={`translate(${playerLeft} ${playerTop})`}>
              <circle cx="0" cy="-4.5" r="3" fill="rgba(21,24,32,0.86)" />
              <path d="M -4 1 Q 0 -1 4 1 L 3 9 L -3 9 Z" fill="rgba(21,24,32,0.86)" />
              <circle cx="5.5" cy="-8.5" r="2.3" fill="rgba(181,13,13,0.72)" />
              <line x1="2.5" y1="-2" x2="5.2" y2="-6.5" stroke="rgba(21,24,32,0.86)" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="-2.5" y1="-2" x2="-6" y2="2.5" stroke="rgba(21,24,32,0.86)" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          </svg>
          <div className="absolute bottom-2 left-2 flex items-center gap-2 bg-[rgba(252,248,241,0.92)] px-2 py-1">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[color:var(--color-primary)] text-[7px] font-black text-white">
              <Play size={9} fill="currentColor" />
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ink)]">
              {shot.zone}
            </span>
          </div>
          {!embedUrl && sourceUrl ? (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="absolute right-2 top-2 z-10 inline-flex items-center gap-1 bg-[color:var(--color-ink)] px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-white"
            >
              Open clip
              <ExternalLink size={10} />
            </a>
          ) : null}
        </div>
      </div>

      <div className="mt-3 text-sm font-black uppercase leading-tight text-[color:var(--color-ink)]">
        {shot.player}
      </div>
      <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-primary)]">
        {shot.moment}
      </div>
      <p className="mt-2 text-xs leading-relaxed text-[color:var(--color-ink-soft)]">
        {shot.note}
      </p>
    </section>
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
  const allProjectLayout = useMemo(
    () => buildCourtLayout(ALL_PROJECTS, activeAxis),
    [activeAxis],
  );
  const selectedCourtPoint = useMemo(
    () =>
      selectedProject
        ? courtLayout.find(({ project }) => project.slug === selectedProject.slug)?.point
          ?? allProjectLayout.find(({ project }) => project.slug === selectedProject.slug)?.point
          ?? null
        : null,
    [allProjectLayout, courtLayout, selectedProject],
  );
  const selectedHistoricShot = useMemo(
    () => {
      if (!selectedProject || !selectedCourtPoint) return null;

      const selectedLayout = courtLayout.some(({ project }) => project.slug === selectedProject.slug)
        ? courtLayout
        : allProjectLayout;

      return getHistoricShot(selectedProject, selectedCourtPoint, selectedLayout);
    },
    [allProjectLayout, courtLayout, selectedCourtPoint, selectedProject],
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
              <button
                type="button"
                key={project.slug}
                className="border border-[color:var(--color-line)] bg-white p-5 text-left transition hover:border-[color:var(--color-primary)] hover:shadow-[0_8px_24px_rgba(16,28,44,0.10)]"
                onClick={() => setSelectedProject(project)}
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
              </button>
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

                {selectedCourtPoint && selectedHistoricShot ? (
                  <HistoricShotPlayer point={selectedCourtPoint} shot={selectedHistoricShot} />
                ) : null}

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
