import type { Masters1000Slug } from "@/lib/data/masters-1000";

export type ChampionNation = {
  code: string;
  name: string;
  flag: string;
};

export type Masters1000Final = {
  year: number;
  champion: string;
  championSlug?: string;
  championNation: ChampionNation;
  runnerUp: string;
  runnerUpSlug?: string;
  runnerUpNation: ChampionNation;
  score: string;
  note?: string;
};

export type Masters1000TitleLeader = {
  player: string;
  playerSlug?: string;
  nation: ChampionNation;
  titles: number;
  years: number[];
};

export type Masters1000ChampionsArchive = {
  slug: Masters1000Slug;
  tournamentName: string;
  archiveFrom: number;
  archiveTo: number;
  editionsPlayed: number;
  uniqueChampions: number;
  latestChampion: string;
  latestChampionSlug?: string;
  latestChampionNation: ChampionNation;
  recordTitles: number;
  recordHolders: string[];
  recentFinals: Masters1000Final[];
  titleLeaders: Masters1000TitleLeader[];
};

const nations = {
  australia: { code: "AUS", name: "Australia", flag: "🇦🇺" },
  britain: { code: "GBR", name: "Great Britain", flag: "🇬🇧" },
  spain: { code: "ESP", name: "Spain", flag: "🇪🇸" },
  unitedStates: { code: "USA", name: "United States", flag: "🇺🇸" },
  russia: { code: "RUS", name: "Russia", flag: "🇷🇺" },
  italy: { code: "ITA", name: "Italy", flag: "🇮🇹" },
  georgia: { code: "GEO", name: "Georgia", flag: "🇬🇪" },
  serbia: { code: "SRB", name: "Serbia", flag: "🇷🇸" },
  switzerland: { code: "SUI", name: "Switzerland", flag: "🇨🇭" },
  germany: { code: "GER", name: "Germany", flag: "🇩🇪" },
} satisfies Record<string, ChampionNation>;

const indianWellsArchive: Masters1000ChampionsArchive = {
  slug: "indian-wells",
  tournamentName: "Indian Wells",
  archiveFrom: 1974,
  archiveTo: 2026,
  editionsPlayed: 51,
  uniqueChampions: 31,
  latestChampion: "Jannik Sinner",
  latestChampionSlug: "jannik-sinner",
  latestChampionNation: nations.italy,
  recordTitles: 5,
  recordHolders: ["Roger Federer", "Novak Djokovic"],
  recentFinals: [
    {
      year: 2026,
      champion: "Jannik Sinner",
      championSlug: "jannik-sinner",
      championNation: nations.italy,
      runnerUp: "Daniil Medvedev",
      runnerUpSlug: "daniil-medvedev",
      runnerUpNation: nations.russia,
      score: "7–6(6), 7–6(4)",
      note: "First Indian Wells title",
    },
    {
      year: 2025,
      champion: "Jack Draper",
      championSlug: "jack-draper",
      championNation: nations.britain,
      runnerUp: "Holger Rune",
      runnerUpSlug: "holger-rune",
      runnerUpNation: { code: "DEN", name: "Denmark", flag: "🇩🇰" },
      score: "6–2, 6–2",
      note: "First ATP Masters 1000 title",
    },
    {
      year: 2024,
      champion: "Carlos Alcaraz",
      championSlug: "carlos-alcaraz",
      championNation: nations.spain,
      runnerUp: "Daniil Medvedev",
      runnerUpSlug: "daniil-medvedev",
      runnerUpNation: nations.russia,
      score: "7–6(5), 6–1",
      note: "Second consecutive title",
    },
    {
      year: 2023,
      champion: "Carlos Alcaraz",
      championSlug: "carlos-alcaraz",
      championNation: nations.spain,
      runnerUp: "Daniil Medvedev",
      runnerUpSlug: "daniil-medvedev",
      runnerUpNation: nations.russia,
      score: "6–3, 6–2",
      note: "First Indian Wells title",
    },
    {
      year: 2022,
      champion: "Taylor Fritz",
      championSlug: "taylor-fritz",
      championNation: nations.unitedStates,
      runnerUp: "Rafael Nadal",
      runnerUpSlug: "rafael-nadal",
      runnerUpNation: nations.spain,
      score: "6–3, 7–6(5)",
      note: "First American champion since 2001",
    },
    {
      year: 2021,
      champion: "Cameron Norrie",
      championSlug: "cameron-norrie",
      championNation: nations.britain,
      runnerUp: "Nikoloz Basilashvili",
      runnerUpSlug: "nikoloz-basilashvili",
      runnerUpNation: nations.georgia,
      score: "3–6, 6–4, 6–1",
      note: "Tournament returned after the 2020 cancellation",
    },
  ],
  titleLeaders: [
    {
      player: "Roger Federer",
      playerSlug: "roger-federer",
      nation: nations.switzerland,
      titles: 5,
      years: [2004, 2005, 2006, 2012, 2017],
    },
    {
      player: "Novak Djokovic",
      playerSlug: "novak-djokovic",
      nation: nations.serbia,
      titles: 5,
      years: [2008, 2011, 2014, 2015, 2016],
    },
    {
      player: "Jimmy Connors",
      nation: nations.unitedStates,
      titles: 3,
      years: [1976, 1981, 1984],
    },
    {
      player: "Michael Chang",
      nation: nations.unitedStates,
      titles: 3,
      years: [1992, 1996, 1997],
    },
    {
      player: "Rafael Nadal",
      playerSlug: "rafael-nadal",
      nation: nations.spain,
      titles: 3,
      years: [2007, 2009, 2013],
    },
    {
      player: "Carlos Alcaraz",
      playerSlug: "carlos-alcaraz",
      nation: nations.spain,
      titles: 2,
      years: [2023, 2024],
    },
  ],
};

const masters1000ChampionsArchives: Partial<
  Record<Masters1000Slug, Masters1000ChampionsArchive>
> = {
  "indian-wells": indianWellsArchive,
};

export function getMasters1000ChampionsArchive(
  slug: Masters1000Slug,
): Masters1000ChampionsArchive | undefined {
  return masters1000ChampionsArchives[slug];
}