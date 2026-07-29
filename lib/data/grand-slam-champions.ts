import type {
  HallOfChampionsEntry,
  HallOfChampionsLeader,
} from "@/components/results/HallOfChampions";

import type { GrandSlamSlug } from "@/lib/data/grand-slams";

export type GrandSlamChampionsData = {
  tournamentName: string;
  tournamentCode: string;
  eraLabel: string;
  updatedAt: string;
  entries: HallOfChampionsEntry[];
  leaders: HallOfChampionsLeader[];
};

export const GRAND_SLAM_CHAMPIONS_UPDATED_AT = "28 July 2026";

export const grandSlamChampions: Record<
  GrandSlamSlug,
  GrandSlamChampionsData
> = {
  "australian-open": {
    tournamentName: "Australian Open",
    tournamentCode: "AO",
    eraLabel: "Recent editions · 2020–2026",
    updatedAt: GRAND_SLAM_CHAMPIONS_UPDATED_AT,

    entries: [
      {
        year: 2026,
        champion: "Carlos Alcaraz",
        championCountryCode: "ESP",
        championCountry: "Spain",
        runnerUp: "Novak Djokovic",
        runnerUpCountryCode: "SRB",
        score: "2-6 6-2 6-3 7-5",
        playerSlug: "carlos-alcaraz",
      },
      {
        year: 2025,
        champion: "Jannik Sinner",
        championCountryCode: "ITA",
        championCountry: "Italy",
        runnerUp: "Alexander Zverev",
        runnerUpCountryCode: "GER",
        score: "6-3 7-6(4) 6-3",
        playerSlug: "jannik-sinner",
      },
      {
        year: 2024,
        champion: "Jannik Sinner",
        championCountryCode: "ITA",
        championCountry: "Italy",
        runnerUp: "Daniil Medvedev",
        runnerUpCountryCode: "RUS",
        score: "3-6 3-6 6-4 6-4 6-3",
        playerSlug: "jannik-sinner",
      },
      {
        year: 2023,
        champion: "Novak Djokovic",
        championCountryCode: "SRB",
        championCountry: "Serbia",
        runnerUp: "Stefanos Tsitsipas",
        runnerUpCountryCode: "GRE",
        score: "6-3 7-6(4) 7-6(5)",
        playerSlug: "novak-djokovic",
      },
      {
        year: 2022,
        champion: "Rafael Nadal",
        championCountryCode: "ESP",
        championCountry: "Spain",
        runnerUp: "Daniil Medvedev",
        runnerUpCountryCode: "RUS",
        score: "2-6 6-7(5) 6-4 6-4 7-5",
        playerSlug: "rafael-nadal",
      },
      {
        year: 2021,
        champion: "Novak Djokovic",
        championCountryCode: "SRB",
        championCountry: "Serbia",
        runnerUp: "Daniil Medvedev",
        runnerUpCountryCode: "RUS",
        score: "7-5 6-2 6-2",
        playerSlug: "novak-djokovic",
      },
      {
        year: 2020,
        champion: "Novak Djokovic",
        championCountryCode: "SRB",
        championCountry: "Serbia",
        runnerUp: "Dominic Thiem",
        runnerUpCountryCode: "AUT",
        score: "6-4 4-6 2-6 6-3 6-4",
        playerSlug: "novak-djokovic",
      },
    ],

    leaders: [
      {
        player: "Novak Djokovic",
        titles: 10,
        countryCode: "SRB",
        country: "Serbia",
        playerSlug: "novak-djokovic",
      },
      {
        player: "Roger Federer",
        titles: 6,
        countryCode: "SUI",
        country: "Switzerland",
        playerSlug: "roger-federer",
      },
      {
        player: "Andre Agassi",
        titles: 4,
        countryCode: "USA",
        country: "United States",
        playerSlug: "andre-agassi",
      },
      {
        player: "Mats Wilander",
        titles: 3,
        countryCode: "SWE",
        country: "Sweden",
        playerSlug: "mats-wilander",
      },
    ],
  },

  "roland-garros": {
    tournamentName: "Roland Garros",
    tournamentCode: "RG",
    eraLabel: "Recent editions · 2020–2026",
    updatedAt: GRAND_SLAM_CHAMPIONS_UPDATED_AT,

    entries: [
      {
        year: 2026,
        champion: "Alexander Zverev",
        championCountryCode: "GER",
        championCountry: "Germany",
        runnerUp: "Flavio Cobolli",
        runnerUpCountryCode: "ITA",
        score: "6-1 4-6 6-4 6-7(5) 6-1",
        playerSlug: "alexander-zverev",
      },
      {
        year: 2025,
        champion: "Carlos Alcaraz",
        championCountryCode: "ESP",
        championCountry: "Spain",
        runnerUp: "Jannik Sinner",
        runnerUpCountryCode: "ITA",
        score: "4-6 6-7(4) 6-4 7-6(3) 7-6[10-2]",
        playerSlug: "carlos-alcaraz",
      },
      {
        year: 2024,
        champion: "Carlos Alcaraz",
        championCountryCode: "ESP",
        championCountry: "Spain",
        runnerUp: "Alexander Zverev",
        runnerUpCountryCode: "GER",
        score: "6-3 2-6 5-7 6-1 6-2",
        playerSlug: "carlos-alcaraz",
      },
      {
        year: 2023,
        champion: "Novak Djokovic",
        championCountryCode: "SRB",
        championCountry: "Serbia",
        runnerUp: "Casper Ruud",
        runnerUpCountryCode: "NOR",
        score: "7-6(1) 6-3 7-5",
        playerSlug: "novak-djokovic",
      },
      {
        year: 2022,
        champion: "Rafael Nadal",
        championCountryCode: "ESP",
        championCountry: "Spain",
        runnerUp: "Casper Ruud",
        runnerUpCountryCode: "NOR",
        score: "6-3 6-3 6-0",
        playerSlug: "rafael-nadal",
      },
      {
        year: 2021,
        champion: "Novak Djokovic",
        championCountryCode: "SRB",
        championCountry: "Serbia",
        runnerUp: "Stefanos Tsitsipas",
        runnerUpCountryCode: "GRE",
        score: "6-7(6) 2-6 6-3 6-2 6-4",
        playerSlug: "novak-djokovic",
      },
      {
        year: 2020,
        champion: "Rafael Nadal",
        championCountryCode: "ESP",
        championCountry: "Spain",
        runnerUp: "Novak Djokovic",
        runnerUpCountryCode: "SRB",
        score: "6-0 6-2 7-5",
        playerSlug: "rafael-nadal",
      },
    ],

    leaders: [
      {
        player: "Rafael Nadal",
        titles: 14,
        countryCode: "ESP",
        country: "Spain",
        playerSlug: "rafael-nadal",
      },
      {
        player: "Bjorn Borg",
        titles: 6,
        countryCode: "SWE",
        country: "Sweden",
        playerSlug: "bjorn-borg",
      },
      {
        player: "Novak Djokovic",
        titles: 3,
        countryCode: "SRB",
        country: "Serbia",
        playerSlug: "novak-djokovic",
      },
      {
        player: "Gustavo Kuerten",
        titles: 3,
        countryCode: "BRA",
        country: "Brazil",
        playerSlug: "gustavo-kuerten",
      },
    ],
  },

  wimbledon: {
    tournamentName: "Wimbledon",
    tournamentCode: "W",
    eraLabel: "Recent editions · 2021–2026",
    updatedAt: GRAND_SLAM_CHAMPIONS_UPDATED_AT,

    entries: [
      {
        year: 2026,
        champion: "Jannik Sinner",
        championCountryCode: "ITA",
        championCountry: "Italy",
        runnerUp: "Alexander Zverev",
        runnerUpCountryCode: "GER",
        score: "6-7(7) 7-6(2) 6-3 6-4",
        playerSlug: "jannik-sinner",
      },
      {
        year: 2025,
        champion: "Jannik Sinner",
        championCountryCode: "ITA",
        championCountry: "Italy",
        runnerUp: "Carlos Alcaraz",
        runnerUpCountryCode: "ESP",
        score: "4-6 6-4 6-4 6-4",
        playerSlug: "jannik-sinner",
      },
      {
        year: 2024,
        champion: "Carlos Alcaraz",
        championCountryCode: "ESP",
        championCountry: "Spain",
        runnerUp: "Novak Djokovic",
        runnerUpCountryCode: "SRB",
        score: "6-2 6-2 7-6(4)",
        playerSlug: "carlos-alcaraz",
      },
      {
        year: 2023,
        champion: "Carlos Alcaraz",
        championCountryCode: "ESP",
        championCountry: "Spain",
        runnerUp: "Novak Djokovic",
        runnerUpCountryCode: "SRB",
        score: "1-6 7-6(6) 6-1 3-6 6-4",
        playerSlug: "carlos-alcaraz",
      },
      {
        year: 2022,
        champion: "Novak Djokovic",
        championCountryCode: "SRB",
        championCountry: "Serbia",
        runnerUp: "Nick Kyrgios",
        runnerUpCountryCode: "AUS",
        score: "4-6 6-3 6-4 7-6(3)",
        playerSlug: "novak-djokovic",
      },
      {
        year: 2021,
        champion: "Novak Djokovic",
        championCountryCode: "SRB",
        championCountry: "Serbia",
        runnerUp: "Matteo Berrettini",
        runnerUpCountryCode: "ITA",
        score: "6-7(4) 6-4 6-4 6-3",
        playerSlug: "novak-djokovic",
      },
    ],

    leaders: [
      {
        player: "Roger Federer",
        titles: 8,
        countryCode: "SUI",
        country: "Switzerland",
        playerSlug: "roger-federer",
      },
      {
        player: "Novak Djokovic",
        titles: 7,
        countryCode: "SRB",
        country: "Serbia",
        playerSlug: "novak-djokovic",
      },
      {
        player: "Pete Sampras",
        titles: 7,
        countryCode: "USA",
        country: "United States",
        playerSlug: "pete-sampras",
      },
      {
        player: "Bjorn Borg",
        titles: 5,
        countryCode: "SWE",
        country: "Sweden",
        playerSlug: "bjorn-borg",
      },
    ],
  },

  "us-open": {
    tournamentName: "US Open",
    tournamentCode: "US",
    eraLabel: "Recent editions · 2020–2025",
    updatedAt: GRAND_SLAM_CHAMPIONS_UPDATED_AT,

    entries: [
      {
        year: 2025,
        champion: "Carlos Alcaraz",
        championCountryCode: "ESP",
        championCountry: "Spain",
        runnerUp: "Jannik Sinner",
        runnerUpCountryCode: "ITA",
        score: "6-2 3-6 6-1 6-4",
        playerSlug: "carlos-alcaraz",
      },
      {
        year: 2024,
        champion: "Jannik Sinner",
        championCountryCode: "ITA",
        championCountry: "Italy",
        runnerUp: "Taylor Fritz",
        runnerUpCountryCode: "USA",
        score: "6-3 6-4 7-5",
        playerSlug: "jannik-sinner",
      },
      {
        year: 2023,
        champion: "Novak Djokovic",
        championCountryCode: "SRB",
        championCountry: "Serbia",
        runnerUp: "Daniil Medvedev",
        runnerUpCountryCode: "RUS",
        score: "6-3 7-6(5) 6-3",
        playerSlug: "novak-djokovic",
      },
      {
        year: 2022,
        champion: "Carlos Alcaraz",
        championCountryCode: "ESP",
        championCountry: "Spain",
        runnerUp: "Casper Ruud",
        runnerUpCountryCode: "NOR",
        score: "6-4 2-6 7-6(1) 6-3",
        playerSlug: "carlos-alcaraz",
      },
      {
        year: 2021,
        champion: "Daniil Medvedev",
        championCountryCode: "RUS",
        championCountry: "Russia",
        runnerUp: "Novak Djokovic",
        runnerUpCountryCode: "SRB",
        score: "6-4 6-4 6-4",
        playerSlug: "daniil-medvedev",
      },
      {
        year: 2020,
        champion: "Dominic Thiem",
        championCountryCode: "AUT",
        championCountry: "Austria",
        runnerUp: "Alexander Zverev",
        runnerUpCountryCode: "GER",
        score: "2-6 4-6 6-4 6-3 7-6(6)",
        playerSlug: "dominic-thiem",
      },
    ],

    leaders: [
      {
        player: "Jimmy Connors",
        titles: 5,
        countryCode: "USA",
        country: "United States",
        playerSlug: "jimmy-connors",
      },
      {
        player: "Pete Sampras",
        titles: 5,
        countryCode: "USA",
        country: "United States",
        playerSlug: "pete-sampras",
      },
      {
        player: "Roger Federer",
        titles: 5,
        countryCode: "SUI",
        country: "Switzerland",
        playerSlug: "roger-federer",
      },
      {
        player: "John McEnroe",
        titles: 4,
        countryCode: "USA",
        country: "United States",
        playerSlug: "john-mcenroe",
      },
    ],
  },
};

export function getGrandSlamChampions(
  slug: string,
): GrandSlamChampionsData | null {
  if (!(slug in grandSlamChampions)) {
    return null;
  }

  return grandSlamChampions[slug as GrandSlamSlug];
}