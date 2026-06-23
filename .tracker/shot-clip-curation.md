# Historic Shot Clip Curation

Target: `45/45` quality-gated provider clips.

Run `pnpm shot-embeds` to see current coverage. Run `pnpm shot-embeds:target` to enforce the full `45/45` target; it should fail until every shot below has a verified clip.

## Quality Gate

A clip counts only when all of these are true:

- It shows the exact named shot or the full game segment containing that shot.
- It is stable enough for a public portfolio: official YouTube/NBA sources first, then Vimeo or external pages only when the clip is clearly playable and not low-quality filler.
- It matches the court-zone intent closely enough that the project dot does not feel mislabeled.
- It has a provider entry in `src/pages/CurrentProjects.tsx`.
- It has `quality.level: 'verified-game-clip'`, a `reviewedAt` date, and a short note explaining what was verified.

## Manual Queue

### Deep Left

- `lillard-rockets-2014` — Damian Lillard, 2014 series clincher vs Houston
- `luka-clippers-2020` — Luka Doncic, 2020 bubble winner vs LA Clippers

### Deep Top

- `trae-knicks-2021` — Trae Young, 2021 playoff silencer at Madison Square Garden
- `curry-france-2024` — Stephen Curry, 2024 gold-medal dagger vs France

### Right Corner

- `kerr-jazz-1997` — Steve Kerr, 1997 Finals Game 6 winner
- `horry-kings-2002` — Robert Horry, 2002 Western Finals Game 4 winner

### Left Baseline / Wing

- `fisher-spurs-2004` — Derek Fisher, 2004 0.4-second winner vs San Antonio
- `booker-clippers-2020` — Devin Booker, 2020 bubble winner vs LA Clippers

### Above The Break

- `kyrie-warriors-2016` — Kyrie Irving, 2016 Finals Game 7 go-ahead three
- `durant-cavs-2017` — Kevin Durant, 2017 Finals Game 3 pull-up
- `tatum-sixers-2023` — Jayson Tatum, 2023 Game 6 late three vs Philadelphia
- `murray-lakers-2024` — Jamal Murray, 2024 playoff winner vs Lakers
- `haliburton-knicks-2025` — Tyrese Haliburton, 2025 playoff four-point play vs New York
- `wade-warriors-2019` — Dwyane Wade, 2019 one-legged bank winner vs Golden State
- `morant-wolves-2022` — Ja Morant, 2022 Game 5 winner vs Minnesota
- `reggie-knicks-1995` — Reggie Miller, 1995 eight-points-in-nine-seconds three
- `paul-spurs-2015` — Chris Paul, 2015 Game 7 winner vs San Antonio
- `luka-celtics-2025` — Luka Doncic, late-clock stepback from the high slot
- `fox-warriors-2023` — De'Aaron Fox, 2023 playoff pull-up pressure three
- `mitchell-nuggets-2020` — Donovan Mitchell, 2020 bubble scoring-run pull-up
- `booker-suns-2021` — Devin Booker, 2021 playoff pull-up dagger
- `butler-bucks-2023` — Jimmy Butler, 2023 playoff late-game bailout vs Milwaukee
- `edwards-nuggets-2024` — Anthony Edwards, 2024 playoff pull-up pressure shot vs Denver

### Midrange

- `jordan-cavs-1989` — Michael Jordan, 1989 series winner vs Cleveland
- `kobe-suns-2006` — Kobe Bryant, 2006 playoff winner vs Phoenix
- `dirk-heat-2011` — Dirk Nowitzki, 2011 Finals lefty finish vs Miami
- `pierce-hawks-2015` — Paul Pierce, 2015 banked winner vs Atlanta
- `garnett-kings-2004` — Kevin Garnett, 2004 Game 7 turnaround vs Sacramento
- `durant-bucks-2021` — Kevin Durant, 2021 Game 7 toe-on-line jumper vs Milwaukee
- `derozan-raptors-2018` — DeMar DeRozan, late-game footwork jumper from the elbow
- `anthony-knicks-2012` — Carmelo Anthony, Easter double-overtime jumper vs Chicago
- `booker-clippers-2021` — Devin Booker, 2021 playoff midrange heater vs LA Clippers
- `paul-bucks-2021` — Chris Paul, 2021 Finals snake-dribble jumper
- `shai-nuggets-2025` — Shai Gilgeous-Alexander, playoff stop-and-rise midrange jumper
- `brunson-sixers-2024` — Jalen Brunson, 2024 playoff pull-up run vs Philadelphia
- `leonard-mavs-2021` — Kawhi Leonard, 2021 elimination-game midrange run vs Dallas
- `wade-mavericks-2006` — Dwyane Wade, 2006 Finals pressure pull-up vs Dallas
- `parker-heat-2013` — Tony Parker, 2013 Finals Game 1 falling jumper
- `rose-cavs-2015` — Derrick Rose, 2015 banked winner vs Cleveland
