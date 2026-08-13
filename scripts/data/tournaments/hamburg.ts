import type {
  TournamentHistoryDataset,
  TournamentHistoryPlayerRef,
} from "../../tournament-history/types";

const player = (...slugCandidates: string[]): TournamentHistoryPlayerRef => ({
  slugCandidates,
});

const dataset = {
  tournamentSlug: "hamburg",

  tournament: {
    name: "Hamburg Open",
    shortName: "Hamburg",
    category: "ATP_500",
    surface: "CLAY",
    city: "Hamburg",
    country: "Germany",
    countryCode: "GER",
    venue: "Am Rothenbaum",
    foundedYear: 1892,
    description:
      "Hamburg is one of tennis's historic clay-court institutions, linking a nineteenth-century championship tradition with the modern ATP 500 Tour.",
    history:
      "The Hamburg tournament traces its roots to 1892 and has developed through several eras of international tennis at Am Rothenbaum. In the modern professional period it became one of the Tour's elite clay-court events, including a long spell in the Masters-level category before becoming an ATP 500. Its Open Era champions include Ivan Lendl, Stefan Edberg, Gustavo Kuerten, Roger Federer, Rafael Nadal, Alexander Zverev and a new generation of winners.",
    active: true,
    metaTitle:
      "Hamburg ATP 500 | History, Legends & Recent Finals | AGE202",
    metaDescription:
      "Explore the Hamburg Open at Am Rothenbaum: tournament history, iconic moments, legends and the five most recent ATP 500 finals.",
  },

  iconicMoments: [
    {
      year: 1892,
      title: "A championship tradition begins",
      subtitle: "Hamburg enters tennis history",
      description:
        "The tournament's roots reach back to 1892, giving Hamburg one of the deepest historical identities on the modern ATP calendar.",
      sortOrder: 10,
    },
    {
      year: 2002,
      title: "Federer's Hamburg reign begins",
      subtitle: "The first of four Open Era record titles",
      description:
        "Roger Federer wins Hamburg for the first time and begins a run that will make him the tournament's leading Open Era singles champion.",
      featured: true,
      sortOrder: 20,
    },
    {
      year: 2007,
      title: "Federer ends Nadal's clay streak",
      subtitle: "An 81-match run comes to an end",
      description:
        "Federer defeats Rafael Nadal in the final, ending Nadal's extraordinary 81-match winning streak on clay.",
      featured: true,
      sortOrder: 30,
    },
    {
      year: 2008,
      title: "Nadal answers in the final Masters chapter",
      subtitle: "A rivalry classic at Am Rothenbaum",
      description:
        "Rafael Nadal defeats Federer in the 2008 final, winning Hamburg in the tournament's last season as a Masters-level event.",
      featured: true,
      sortOrder: 40,
    },
    {
      year: 2026,
      title: "Buse's breakthrough",
      subtitle: "A qualifier becomes champion",
      description:
        "Ignacio Buse defeats Tommy Paul in three sets to win his first ATP Tour title and become the first Peruvian tour-level champion since 2007.",
      sortOrder: 50,
    },
  ],

  legends: [
    {
      player: player("roger-federer", "federer"),
      name: "Roger Federer",
      country: "Switzerland",
      countryCode: "SUI",
      recordLabel: "Open Era record four-time champion",
      quote:
        "Federer won Hamburg in 2002, 2004, 2005 and 2007, establishing the leading Open Era singles title record at Am Rothenbaum.",
      legend: true,
      featured: true,
      sortOrder: 10,
    },
    {
      name: "Andrei Medvedev",
      country: "Ukraine",
      countryCode: "UKR",
      recordLabel: "Three-time champion",
      quote:
        "Medvedev won Hamburg in 1994, 1995 and 1997 and became one of the defining champions of the tournament's 1990s elite era.",
      legend: true,
      featured: true,
      sortOrder: 20,
    },
    {
      name: "Eddie Dibbs",
      country: "United States",
      countryCode: "USA",
      recordLabel: "Three consecutive titles",
      quote:
        "Dibbs captured three straight Hamburg titles from 1973 through 1975, one of the strongest championship runs of the Open Era.",
      legend: true,
      featured: false,
      sortOrder: 30,
    },
    {
      name: "Ivan Lendl",
      country: "Czechoslovakia",
      countryCode: "TCH",
      recordLabel: "Two-time champion",
      quote:
        "Lendl won Hamburg in 1987 and 1989, adding the German clay title to one of the great baseline careers of his generation.",
      legend: true,
      featured: false,
      sortOrder: 40,
    },
    {
      player: player("rafael-nadal", "nadal"),
      name: "Rafael Nadal",
      country: "Spain",
      countryCode: "ESP",
      recordLabel: "Two-time champion",
      quote:
        "Nadal won Hamburg in 2008 and returned seven years later to capture a second title in 2015.",
      legend: true,
      featured: true,
      sortOrder: 50,
    },
    {
      name: "Nikoloz Basilashvili",
      country: "Georgia",
      countryCode: "GEO",
      recordLabel: "Back-to-back champion",
      quote:
        "Basilashvili won consecutive Hamburg titles in 2018 and 2019, becoming one of the tournament's defining champions of the modern ATP 500 era.",
      legend: true,
      featured: false,
      sortOrder: 60,
    },
  ],

  editions: [

    {
      year: 1968,
      championName: "John Newcombe",
      championCountryCode: "AUS",
    },
    {
      year: 1969,
      championName: "Tony Roche",
      championCountryCode: "AUS",
    },
    {
      year: 1970,
      championName: "Ilie Nastase",
      championCountryCode: "ROU",
    },
    {
      year: 1971,
      championName: "Andres Gimeno",
      championCountryCode: "ESP",
    },
    {
      year: 1972,
      championName: "Manuel Orantes",
      championCountryCode: "ESP",
    },
    {
      year: 1973,
      championName: "Eddie Dibbs",
      championCountryCode: "USA",
    },
    {
      year: 1974,
      championName: "Eddie Dibbs",
      championCountryCode: "USA",
    },
    {
      year: 1975,
      championName: "Eddie Dibbs",
      championCountryCode: "USA",
    },
    {
      year: 1976,
      championName: "Manuel Orantes",
      championCountryCode: "ESP",
    },
    {
      year: 1977,
      championName: "Paolo Bertolucci",
      championCountryCode: "ITA",
    },
    {
      year: 1978,
      championName: "Guillermo Vilas",
      championCountryCode: "ARG",
    },
    {
      year: 1979,
      championName: "Jose Higueras",
      championCountryCode: "ESP",
    },
    {
      year: 1980,
      championName: "Harold Solomon",
      championCountryCode: "USA",
    },
    {
      year: 1981,
      championName: "Peter McNamara",
      championCountryCode: "AUS",
    },
    {
      year: 1982,
      championName: "Jose Higueras",
      championCountryCode: "ESP",
    },
    {
      year: 1983,
      championName: "Yannick Noah",
      championCountryCode: "FRA",
    },
    {
      year: 1984,
      championName: "Juan Aguilera",
      championCountryCode: "ESP",
    },
    {
      year: 1985,
      championName: "Miloslav Mecir",
      championCountryCode: "TCH",
    },
    {
      year: 1986,
      championName: "Henri Leconte",
      championCountryCode: "FRA",
    },
    {
      year: 1987,
      championName: "Ivan Lendl",
      championCountryCode: "TCH",
    },
    {
      year: 1988,
      championName: "Kent Carlsson",
      championCountryCode: "SWE",
    },
    {
      year: 1989,
      championName: "Ivan Lendl",
      championCountryCode: "TCH",
    },
    {
      year: 1990,
      championName: "Juan Aguilera",
      championCountryCode: "ESP",
    },
    {
      year: 1991,
      championName: "Karel Novacek",
      championCountryCode: "CZE",
    },
    {
      year: 1992,
      championName: "Stefan Edberg",
      championCountryCode: "SWE",
    },
    {
      year: 1993,
      championName: "Michael Stich",
      championCountryCode: "GER",
    },
    {
      year: 1994,
      championName: "Andrei Medvedev",
      championCountryCode: "UKR",
    },
    {
      year: 1995,
      championName: "Andrei Medvedev",
      championCountryCode: "UKR",
    },
    {
      year: 1996,
      championName: "Roberto Carretero",
      championCountryCode: "ESP",
    },
    {
      year: 1997,
      championName: "Andrei Medvedev",
      championCountryCode: "UKR",
    },
    {
      year: 1998,
      championName: "Albert Costa",
      championCountryCode: "ESP",
    },
    {
      year: 1999,
      championName: "Marcelo Rios",
      championCountryCode: "CHI",
    },
    {
      year: 2000,
      championName: "Gustavo Kuerten",
      championCountryCode: "BRA",
    },
    {
      year: 2001,
      championName: "Albert Portas",
      championCountryCode: "ESP",
    },
    {
      year: 2002,
      championName: "Roger Federer",
      championCountryCode: "SUI",
      championPlayer: player("roger-federer", "federer"),
    },
    {
      year: 2003,
      championName: "Guillermo Coria",
      championCountryCode: "ARG",
    },
    {
      year: 2004,
      championName: "Roger Federer",
      championCountryCode: "SUI",
      championPlayer: player("roger-federer", "federer"),
    },
    {
      year: 2005,
      championName: "Roger Federer",
      championCountryCode: "SUI",
      championPlayer: player("roger-federer", "federer"),
    },
    {
      year: 2006,
      championName: "Tommy Robredo",
      championCountryCode: "ESP",
    },
    {
      year: 2007,
      championName: "Roger Federer",
      championCountryCode: "SUI",
      championPlayer: player("roger-federer", "federer"),
    },
    {
      year: 2008,
      championName: "Rafael Nadal",
      championCountryCode: "ESP",
      championPlayer: player("rafael-nadal", "nadal"),
    },
    {
      year: 2009,
      championName: "Nikolay Davydenko",
      championCountryCode: "RUS",
    },
    {
      year: 2010,
      championName: "Andrey Golubev",
      championCountryCode: "KAZ",
    },
    {
      year: 2011,
      championName: "Gilles Simon",
      championCountryCode: "FRA",
    },
    {
      year: 2012,
      championName: "Juan Monaco",
      championCountryCode: "ARG",
    },
    {
      year: 2013,
      championName: "Fabio Fognini",
      championCountryCode: "ITA",
    },
    {
      year: 2014,
      championName: "Leonardo Mayer",
      championCountryCode: "ARG",
    },
    {
      year: 2015,
      championName: "Rafael Nadal",
      championCountryCode: "ESP",
      championPlayer: player("rafael-nadal", "nadal"),
    },
    {
      year: 2016,
      championName: "Martin Klizan",
      championCountryCode: "SVK",
    },
    {
      year: 2017,
      championName: "Leonardo Mayer",
      championCountryCode: "ARG",
    },
    {
      year: 2018,
      championName: "Nikoloz Basilashvili",
      championCountryCode: "GEO",
    },
    {
      year: 2019,
      championName: "Nikoloz Basilashvili",
      championCountryCode: "GEO",
    },
    {
      year: 2020,
      championName: "Andrey Rublev",
      championCountryCode: "RUS",
      championPlayer: player("andrey-rublev", "rublev"),
    },
    {
      year: 2021,
      championName: "Pablo Carreno Busta",
      championCountryCode: "ESP",
    },
    {
      year: 2022,
      championName: "Lorenzo Musetti",
      championCountryCode: "ITA",
      runnerUpName: "Carlos Alcaraz",
      runnerUpCountryCode: "ESP",
      runnerUpPlayer: player("carlos-alcaraz", "alcaraz"),
      score: "6-4, 6-7(6), 6-4",
    },
    {
      year: 2023,
      championName: "Alexander Zverev",
      championCountryCode: "GER",
      championPlayer: player("alexander-zverev", "zverev"),
      runnerUpName: "Laslo Djere",
      runnerUpCountryCode: "SRB",
      score: "7-5, 6-3",
    },
    {
      year: 2024,
      championName: "Arthur Fils",
      championCountryCode: "FRA",
      runnerUpName: "Alexander Zverev",
      runnerUpCountryCode: "GER",
      runnerUpPlayer: player("alexander-zverev", "zverev"),
      score: "6-3, 3-6, 7-6(1)",
    },
    {
      year: 2025,
      championName: "Flavio Cobolli",
      championCountryCode: "ITA",
      runnerUpName: "Andrey Rublev",
      runnerUpCountryCode: "RUS",
      runnerUpPlayer: player("andrey-rublev", "rublev"),
      score: "6-2, 6-4",
    },
    {
      year: 2026,
      championName: "Ignacio Buse",
      championCountryCode: "PER",
      runnerUpName: "Tommy Paul",
      runnerUpCountryCode: "USA",
      score: "7-6(6), 4-6, 6-3",
    },
  ],
} satisfies TournamentHistoryDataset;

export default dataset;