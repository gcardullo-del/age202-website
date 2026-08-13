import type {
  TournamentHistoryDataset,
  TournamentHistoryPlayerRef,
} from "../../tournament-history/types";

const player = (...slugCandidates: string[]): TournamentHistoryPlayerRef => ({
  slugCandidates,
});

const dataset = {
  tournamentSlug: "barcelona",

  tournament: {
    name: "Barcelona Open Banc Sabadell",
    shortName: "Barcelona",
    category: "ATP_500",
    surface: "CLAY",
    city: "Barcelona",
    country: "Spain",
    countryCode: "ESP",
    venue: "Real Club de Tenis Barcelona",
    foundedYear: 1953,
    description:
      "Barcelona is one of the great clay-court institutions of the ATP Tour, combining the historic Trofeo Conde de Godo with more than seven decades of championship tennis.",
    history:
      "First staged in 1953 at the Real Club de Tenis Barcelona, the tournament has become one of the defining events of the European clay season. Its champions span generations, from Vic Seixas, Roy Emerson and Manuel Santana to Bjorn Borg, Ivan Lendl, Mats Wilander and Thomas Muster. Rafael Nadal transformed the record book with 12 singles titles, while Carlos Alcaraz carried the Spanish tradition into a new era.",
    active: true,
    metaTitle:
      "Barcelona ATP 500 | History, Legends & Recent Finals | AGE202",
    metaDescription:
      "Explore the Barcelona Open Banc Sabadell: history, iconic moments, legends and the five most recent ATP 500 finals.",
  },

  iconicMoments: [
    {
      year: 1953,
      title: "The Trofeo Conde de Godo begins",
      subtitle: "Vic Seixas becomes the inaugural champion",
      description:
        "Barcelona launches a tournament tradition that will grow into one of the most prestigious clay-court championships outside the Grand Slams.",
      sortOrder: 10,
    },
    {
      year: 1983,
      title: "Wilander completes the hat-trick",
      subtitle: "Three consecutive Barcelona crowns",
      description:
        "Mats Wilander wins his third straight title, completing one of the tournament's great pre-Nadal championship runs.",
      sortOrder: 20,
    },
    {
      year: 2005,
      title: "The Nadal era begins",
      subtitle: "The first of twelve titles",
      description:
        "Rafael Nadal wins Barcelona for the first time and begins an unprecedented reign over the tournament's record book.",
      featured: true,
      sortOrder: 30,
    },
    {
      year: 2017,
      title: "A court for Rafael Nadal",
      subtitle: "Barcelona honours its greatest champion",
      description:
        "The tournament's centre court is named Pista Rafa Nadal, permanently connecting its modern identity with its record champion.",
      featured: true,
      sortOrder: 40,
    },
    {
      year: 2026,
      title: "Fils writes a new chapter",
      subtitle: "A first Barcelona crown for France",
      description:
        "Arthur Fils defeats Andrey Rublev in straight sets to capture the 2026 Barcelona title after returning from a long injury absence.",
      sortOrder: 50,
    },
  ],

  legends: [
    {
      player: player("rafael-nadal", "nadal"),
      name: "Rafael Nadal",
      country: "Spain",
      countryCode: "ESP",
      recordLabel: "Record twelve-time champion",
      quote:
        "Nadal won Barcelona 12 times and compiled a tournament-record 67 singles match victories, creating one of tennis's defining relationships between player and event.",
      legend: true,
      featured: true,
      sortOrder: 10,
    },
    {
      name: "Mats Wilander",
      country: "Sweden",
      countryCode: "SWE",
      recordLabel: "Three-time champion",
      quote:
        "Wilander won three consecutive Barcelona titles from 1982 through 1984 and remains the tournament's youngest singles champion.",
      legend: true,
      featured: true,
      sortOrder: 20,
    },
    {
      name: "Roy Emerson",
      country: "Australia",
      countryCode: "AUS",
      recordLabel: "Three-time champion",
      quote:
        "Emerson won in 1961, 1963 and 1964, establishing one of the great championship records of Barcelona's early international era.",
      legend: true,
      featured: false,
      sortOrder: 30,
    },
    {
      name: "Manuel Orantes",
      country: "Spain",
      countryCode: "ESP",
      recordLabel: "Three-time champion",
      quote:
        "Orantes captured the title in 1969, 1971 and 1976 and became one of the central Spanish champions in tournament history.",
      legend: true,
      featured: false,
      sortOrder: 40,
    },
    {
      name: "Thomas Muster",
      country: "Austria",
      countryCode: "AUT",
      recordLabel: "Back-to-back champion",
      quote:
        "Muster won consecutive Barcelona crowns in 1995 and 1996 during one of the most dominant clay-court periods of his career.",
      legend: true,
      featured: false,
      sortOrder: 50,
    },
    {
      player: player("carlos-alcaraz", "alcaraz"),
      name: "Carlos Alcaraz",
      country: "Spain",
      countryCode: "ESP",
      recordLabel: "Back-to-back champion",
      quote:
        "Alcaraz won consecutive Barcelona titles in 2022 and 2023, extending the tournament's modern Spanish championship tradition.",
      legend: true,
      featured: true,
      sortOrder: 60,
    },
  ],

  editions: [

    {
      year: 1953,
      championName: "Vic Seixas",
      championCountryCode: "USA",
    },
    {
      year: 1954,
      championName: "Tony Trabert",
      championCountryCode: "USA",
    },
    {
      year: 1955,
      championName: "Art Larsen",
      championCountryCode: "USA",
    },
    {
      year: 1956,
      championName: "Herbert Flam",
      championCountryCode: "USA",
    },
    {
      year: 1957,
      championName: "Herbert Flam",
      championCountryCode: "USA",
    },
    {
      year: 1958,
      championName: "Sven Davidson",
      championCountryCode: "SWE",
    },
    {
      year: 1959,
      championName: "Neale Fraser",
      championCountryCode: "AUS",
    },
    {
      year: 1960,
      championName: "Andres Gimeno",
      championCountryCode: "ESP",
    },
    {
      year: 1961,
      championName: "Roy Emerson",
      championCountryCode: "AUS",
    },
    {
      year: 1962,
      championName: "Manuel Santana",
      championCountryCode: "ESP",
    },
    {
      year: 1963,
      championName: "Roy Emerson",
      championCountryCode: "AUS",
    },
    {
      year: 1964,
      championName: "Roy Emerson",
      championCountryCode: "AUS",
    },
    {
      year: 1965,
      championName: "Juan Gisbert",
      championCountryCode: "ESP",
    },
    {
      year: 1966,
      championName: "Manuel Santana",
      championCountryCode: "ESP",
    },
    {
      year: 1967,
      championName: "Martin Mulligan",
      championCountryCode: "AUS",
    },
    {
      year: 1968,
      championName: "Martin Mulligan",
      championCountryCode: "AUS",
    },
    {
      year: 1969,
      championName: "Manuel Orantes",
      championCountryCode: "ESP",
    },
    {
      year: 1970,
      championName: "Manuel Santana",
      championCountryCode: "ESP",
    },
    {
      year: 1971,
      championName: "Manuel Orantes",
      championCountryCode: "ESP",
    },
    {
      year: 1972,
      championName: "Jan Kodes",
      championCountryCode: "TCH",
    },
    {
      year: 1973,
      championName: "Ilie Nastase",
      championCountryCode: "ROU",
    },
    {
      year: 1974,
      championName: "Ilie Nastase",
      championCountryCode: "ROU",
    },
    {
      year: 1975,
      championName: "Bjorn Borg",
      championCountryCode: "SWE",
    },
    {
      year: 1976,
      championName: "Manuel Orantes",
      championCountryCode: "ESP",
    },
    {
      year: 1977,
      championName: "Bjorn Borg",
      championCountryCode: "SWE",
    },
    {
      year: 1978,
      championName: "Balazs Taroczy",
      championCountryCode: "HUN",
    },
    {
      year: 1979,
      championName: "Hans Gildemeister",
      championCountryCode: "CHI",
    },
    {
      year: 1980,
      championName: "Ivan Lendl",
      championCountryCode: "TCH",
    },
    {
      year: 1981,
      championName: "Ivan Lendl",
      championCountryCode: "TCH",
    },
    {
      year: 1982,
      championName: "Mats Wilander",
      championCountryCode: "SWE",
    },
    {
      year: 1983,
      championName: "Mats Wilander",
      championCountryCode: "SWE",
    },
    {
      year: 1984,
      championName: "Mats Wilander",
      championCountryCode: "SWE",
    },
    {
      year: 1985,
      championName: "Thierry Tulasne",
      championCountryCode: "FRA",
    },
    {
      year: 1986,
      championName: "Kent Carlsson",
      championCountryCode: "SWE",
    },
    {
      year: 1987,
      championName: "Martin Jaite",
      championCountryCode: "ARG",
    },
    {
      year: 1988,
      championName: "Kent Carlsson",
      championCountryCode: "SWE",
    },
    {
      year: 1989,
      championName: "Andres Gomez",
      championCountryCode: "ECU",
    },
    {
      year: 1990,
      championName: "Andres Gomez",
      championCountryCode: "ECU",
    },
    {
      year: 1991,
      championName: "Emilio Sanchez",
      championCountryCode: "ESP",
    },
    {
      year: 1992,
      championName: "Carlos Costa",
      championCountryCode: "ESP",
    },
    {
      year: 1993,
      championName: "Andrei Medvedev",
      championCountryCode: "UKR",
    },
    {
      year: 1994,
      championName: "Richard Krajicek",
      championCountryCode: "NED",
    },
    {
      year: 1995,
      championName: "Thomas Muster",
      championCountryCode: "AUT",
    },
    {
      year: 1996,
      championName: "Thomas Muster",
      championCountryCode: "AUT",
    },
    {
      year: 1997,
      championName: "Albert Costa",
      championCountryCode: "ESP",
    },
    {
      year: 1998,
      championName: "Todd Martin",
      championCountryCode: "USA",
    },
    {
      year: 1999,
      championName: "Felix Mantilla",
      championCountryCode: "ESP",
    },
    {
      year: 2000,
      championName: "Marat Safin",
      championCountryCode: "RUS",
    },
    {
      year: 2001,
      championName: "Juan Carlos Ferrero",
      championCountryCode: "ESP",
    },
    {
      year: 2002,
      championName: "Gaston Gaudio",
      championCountryCode: "ARG",
    },
    {
      year: 2003,
      championName: "Carlos Moya",
      championCountryCode: "ESP",
    },
    {
      year: 2004,
      championName: "Tommy Robredo",
      championCountryCode: "ESP",
    },
    {
      year: 2005,
      championName: "Rafael Nadal",
      championCountryCode: "ESP",
      championPlayer: player("rafael-nadal", "nadal"),
    },
    {
      year: 2006,
      championName: "Rafael Nadal",
      championCountryCode: "ESP",
      championPlayer: player("rafael-nadal", "nadal"),
    },
    {
      year: 2007,
      championName: "Rafael Nadal",
      championCountryCode: "ESP",
      championPlayer: player("rafael-nadal", "nadal"),
    },
    {
      year: 2008,
      championName: "Rafael Nadal",
      championCountryCode: "ESP",
      championPlayer: player("rafael-nadal", "nadal"),
    },
    {
      year: 2009,
      championName: "Rafael Nadal",
      championCountryCode: "ESP",
      championPlayer: player("rafael-nadal", "nadal"),
    },
    {
      year: 2010,
      championName: "Fernando Verdasco",
      championCountryCode: "ESP",
    },
    {
      year: 2011,
      championName: "Rafael Nadal",
      championCountryCode: "ESP",
      championPlayer: player("rafael-nadal", "nadal"),
    },
    {
      year: 2012,
      championName: "Rafael Nadal",
      championCountryCode: "ESP",
      championPlayer: player("rafael-nadal", "nadal"),
    },
    {
      year: 2013,
      championName: "Rafael Nadal",
      championCountryCode: "ESP",
      championPlayer: player("rafael-nadal", "nadal"),
    },
    {
      year: 2014,
      championName: "Kei Nishikori",
      championCountryCode: "JPN",
    },
    {
      year: 2015,
      championName: "Kei Nishikori",
      championCountryCode: "JPN",
    },
    {
      year: 2016,
      championName: "Rafael Nadal",
      championCountryCode: "ESP",
      championPlayer: player("rafael-nadal", "nadal"),
    },
    {
      year: 2017,
      championName: "Rafael Nadal",
      championCountryCode: "ESP",
      championPlayer: player("rafael-nadal", "nadal"),
    },
    {
      year: 2018,
      championName: "Rafael Nadal",
      championCountryCode: "ESP",
      championPlayer: player("rafael-nadal", "nadal"),
    },
    {
      year: 2019,
      championName: "Dominic Thiem",
      championCountryCode: "AUT",
    },
    {
      year: 2020,
      cancelled: true,
    },
    {
      year: 2021,
      championName: "Rafael Nadal",
      championCountryCode: "ESP",
      championPlayer: player("rafael-nadal", "nadal"),
    },
    {
      year: 2022,
      championName: "Carlos Alcaraz",
      championCountryCode: "ESP",
      championPlayer: player("carlos-alcaraz", "alcaraz"),
      runnerUpName: "Pablo Carreno Busta",
      runnerUpCountryCode: "ESP",
      score: "6-3, 6-2",
    },
    {
      year: 2023,
      championName: "Carlos Alcaraz",
      championCountryCode: "ESP",
      championPlayer: player("carlos-alcaraz", "alcaraz"),
      runnerUpName: "Stefanos Tsitsipas",
      runnerUpCountryCode: "GRE",
      runnerUpPlayer: player("stefanos-tsitsipas", "tsitsipas"),
      score: "6-3, 6-4",
    },
    {
      year: 2024,
      championName: "Casper Ruud",
      championCountryCode: "NOR",
      championPlayer: player("casper-ruud", "ruud"),
      runnerUpName: "Stefanos Tsitsipas",
      runnerUpCountryCode: "GRE",
      runnerUpPlayer: player("stefanos-tsitsipas", "tsitsipas"),
      score: "7-5, 6-3",
    },
    {
      year: 2025,
      championName: "Holger Rune",
      championCountryCode: "DEN",
      runnerUpName: "Carlos Alcaraz",
      runnerUpCountryCode: "ESP",
      runnerUpPlayer: player("carlos-alcaraz", "alcaraz"),
      score: "7-6(6), 6-2",
    },
    {
      year: 2026,
      championName: "Arthur Fils",
      championCountryCode: "FRA",
      runnerUpName: "Andrey Rublev",
      runnerUpCountryCode: "RUS",
      runnerUpPlayer: player("andrey-rublev", "rublev"),
      score: "6-2, 7-6(2)",
    },
  ],
} satisfies TournamentHistoryDataset;

export default dataset;