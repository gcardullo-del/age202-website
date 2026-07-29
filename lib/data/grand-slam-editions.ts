import type { TournamentEdition } from "@/components/results/TournamentEditions";

import {
  getGrandSlamChampions,
  GRAND_SLAM_CHAMPIONS_UPDATED_AT,
} from "@/lib/data/grand-slam-champions";

import type { GrandSlamSlug } from "@/lib/data/grand-slams";

export type GrandSlamEditionsData = {
  tournamentName: string;
  tournamentCode: string;
  updatedAt: string;
  editions: TournamentEdition[];
};

type TournamentEditionProfile = {
  venue: string;
  surface: string;
  drawSize: number;
};

const grandSlamEditionProfiles: Record<
  GrandSlamSlug,
  TournamentEditionProfile
> = {
  "australian-open": {
    venue: "Melbourne Park",
    surface: "Hard",
    drawSize: 128,
  },

  "roland-garros": {
    venue: "Stade Roland-Garros",
    surface: "Clay",
    drawSize: 128,
  },

  wimbledon: {
    venue: "All England Lawn Tennis and Croquet Club",
    surface: "Grass",
    drawSize: 128,
  },

  "us-open": {
    venue: "USTA Billie Jean King National Tennis Center",
    surface: "Hard",
    drawSize: 128,
  },
};

const editionSummaries: Partial<
  Record<GrandSlamSlug, Record<number, string>>
> = {
  "australian-open": {
    2026:
      "Carlos Alcaraz defeated Novak Djokovic to win his first Australian Open title and complete the career Grand Slam.",
    2025:
      "Jannik Sinner successfully defended his Melbourne title with a straight-sets victory over Alexander Zverev.",
    2024:
      "Jannik Sinner recovered from two sets down against Daniil Medvedev to claim his first Grand Slam title.",
    2023:
      "Novak Djokovic defeated Stefanos Tsitsipas to secure a record-extending tenth Australian Open crown.",
    2022:
      "Rafael Nadal completed a remarkable five-set comeback against Daniil Medvedev.",
  },

  "roland-garros": {
    2026:
      "Alexander Zverev defeated Flavio Cobolli in five sets to capture his first Grand Slam singles title.",
    2025:
      "Carlos Alcaraz overcame Jannik Sinner in a dramatic five-set championship match.",
    2024:
      "Carlos Alcaraz defeated Alexander Zverev to win his first Roland Garros crown.",
    2023:
      "Novak Djokovic defeated Casper Ruud to claim his third Roland Garros title.",
    2022:
      "Rafael Nadal defeated Casper Ruud to win a record-extending fourteenth Roland Garros title.",
  },

  wimbledon: {
    2026:
      "Jannik Sinner successfully defended his Wimbledon title by defeating Alexander Zverev.",
    2025:
      "Jannik Sinner defeated Carlos Alcaraz to become the first Italian man to win the Wimbledon singles title.",
    2024:
      "Carlos Alcaraz defeated Novak Djokovic in straight sets to retain the championship.",
    2023:
      "Carlos Alcaraz overcame Novak Djokovic in five sets to win his first Wimbledon title.",
    2022:
      "Novak Djokovic defeated Nick Kyrgios to capture his seventh Wimbledon singles crown.",
  },

  "us-open": {
    2025:
      "Carlos Alcaraz defeated Jannik Sinner to reclaim the US Open title and the world No. 1 ranking.",
    2024:
      "Jannik Sinner defeated Taylor Fritz to win his first US Open championship.",
    2023:
      "Novak Djokovic defeated Daniil Medvedev to capture his fourth US Open title.",
    2022:
      "Carlos Alcaraz defeated Casper Ruud to win his first Grand Slam title.",
    2021:
      "Daniil Medvedev defeated Novak Djokovic to claim his first major championship.",
  },
};

function getEditionSummary(
  slug: GrandSlamSlug,
  year: number,
): string | undefined {
  return editionSummaries[slug]?.[year];
}

function createTournamentEditions(
  slug: GrandSlamSlug,
): GrandSlamEditionsData {
  const championsData = getGrandSlamChampions(slug);
  const profile = grandSlamEditionProfiles[slug];

  if (!championsData) {
    return {
      tournamentName: "",
      tournamentCode: "",
      updatedAt: GRAND_SLAM_CHAMPIONS_UPDATED_AT,
      editions: [],
    };
  }

  const editions: TournamentEdition[] =
    championsData.entries.map((entry) => ({
      year: entry.year,

      champion: entry.champion,
      championCountry: entry.championCountry,
      championCountryCode: entry.championCountryCode,

      runnerUp: entry.runnerUp,
      runnerUpCountryCode: entry.runnerUpCountryCode,

      finalScore: entry.score,

      venue: profile.venue,
      surface: profile.surface,
      drawSize: profile.drawSize,

      summary: getEditionSummary(slug, entry.year),
      playerSlug: entry.playerSlug,

      status: "complete",
    }));

  return {
    tournamentName: championsData.tournamentName,
    tournamentCode: championsData.tournamentCode,
    updatedAt: championsData.updatedAt,
    editions,
  };
}

export const grandSlamEditions: Record<
  GrandSlamSlug,
  GrandSlamEditionsData
> = {
  "australian-open": createTournamentEditions(
    "australian-open",
  ),

  "roland-garros": createTournamentEditions("roland-garros"),

  wimbledon: createTournamentEditions("wimbledon"),

  "us-open": createTournamentEditions("us-open"),
};

export function getGrandSlamEditions(
  slug: string,
): GrandSlamEditionsData | null {
  if (!(slug in grandSlamEditions)) {
    return null;
  }

  return grandSlamEditions[slug as GrandSlamSlug];
}