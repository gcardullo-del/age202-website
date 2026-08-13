import type {
  TournamentHistoryDataset,
  TournamentHistoryPlayerRef,
} from "../../tournament-history/types";

const player = (...slugCandidates: string[]): TournamentHistoryPlayerRef => ({
  slugCandidates,
});

const dataset = {
  tournamentSlug: "rotterdam",

  tournament: {
    name: "ABN AMRO Open",
    shortName: "Rotterdam",
    category: "ATP_500",
    surface: "INDOOR_HARD",
    city: "Rotterdam",
    country: "Netherlands",
    countryCode: "NED",
    venue: "Rotterdam Ahoy",
    foundedYear: 1974,
    description:
      "Rotterdam combines elite indoor hard-court tennis with one of the most recognisable tournament identities in Europe.",
    history:
      "First staged in 1974, the ABN AMRO Open has grown into one of Europe's leading indoor tournaments. Rotterdam Ahoy has welcomed champions from Arthur Ashe and Jimmy Connors to Roger Federer, Jannik Sinner and Carlos Alcaraz, while the event's long-running partnership with ABN AMRO has helped define its modern identity.",
    active: true,
    metaTitle:
      "Rotterdam ATP 500 | History, Legends & Recent Finals | AGE202",
    metaDescription:
      "Explore the ABN AMRO Open in Rotterdam: tournament history, iconic moments, legends and the five most recent ATP 500 finals.",
  },

  iconicMoments: [
    {
      year: 1974,
      title: "A Dutch beginning",
      subtitle: "Tom Okker wins the inaugural edition",
      description:
        "The first Rotterdam tournament ends with home success as Tom Okker defeats Tom Gorman and becomes the event's inaugural singles champion.",
      sortOrder: 10,
    },
    {
      year: 1995,
      title: "Krajicek brings the title home",
      subtitle: "A Dutch champion after 21 years",
      description:
        "Richard Krajicek ends a 21-year wait for another Dutch singles champion, beginning a special relationship with the tournament he would later direct.",
      featured: true,
      sortOrder: 20,
    },
    {
      year: 2018,
      title: "Federer's record third crown",
      subtitle: "Rotterdam belongs to the Swiss master",
      description:
        "Roger Federer wins his third Rotterdam title, becoming the tournament's outright singles record holder during a week in which he also returned to World No. 1.",
      featured: true,
      sortOrder: 30,
    },
    {
      year: 2024,
      title: "Sinner continues his rise",
      subtitle: "An undefeated start to the season",
      description:
        "Jannik Sinner defeats Alex de Minaur to win Rotterdam, extending the momentum of his Australian Open breakthrough.",
      sortOrder: 40,
    },
    {
      year: 2026,
      title: "De Minaur finally lifts the trophy",
      subtitle: "Third consecutive final, first Rotterdam title",
      description:
        "After finishing runner-up in 2024 and 2025, Alex de Minaur defeats Felix Auger-Aliassime to win the 2026 title at his third consecutive Rotterdam final.",
      featured: true,
      sortOrder: 50,
    },
  ],

  legends: [
    {
      player: player("roger-federer", "federer"),
      name: "Roger Federer",
      country: "Switzerland",
      countryCode: "SUI",
      recordLabel: "Record three-time champion",
      quote:
        "Federer's titles in 2005, 2012 and 2018 made him the most successful singles champion in Rotterdam history.",
      legend: true,
      featured: true,
      sortOrder: 10,
    },
    {
      name: "Richard Krajicek",
      country: "Netherlands",
      countryCode: "NED",
      recordLabel: "Dutch champion and tournament director",
      quote:
        "Krajicek won Rotterdam in 1995 and 1997 before becoming one of the central figures in the tournament's modern development.",
      legend: true,
      featured: true,
      sortOrder: 20,
    },
    {
      name: "Arthur Ashe",
      country: "United States",
      countryCode: "USA",
      recordLabel: "Back-to-back champion",
      quote:
        "Ashe won consecutive Rotterdam titles in 1975 and 1976, becoming one of the tournament's first international icons.",
      legend: true,
      featured: false,
      sortOrder: 30,
    },
    {
      name: "Jimmy Connors",
      country: "United States",
      countryCode: "USA",
      recordLabel: "Two-time champion",
      quote:
        "Connors captured Rotterdam in 1978 and 1981, adding the Dutch indoor title to his extraordinary fast-court résumé.",
      legend: true,
      featured: false,
      sortOrder: 40,
    },
    {
      name: "Stefan Edberg",
      country: "Sweden",
      countryCode: "SWE",
      recordLabel: "Back-to-back champion",
      quote:
        "Edberg's consecutive victories in 1987 and 1988 made his attacking indoor game part of Rotterdam's championship history.",
      legend: true,
      featured: false,
      sortOrder: 50,
    },
    {
      player: player("jannik-sinner", "sinner"),
      name: "Jannik Sinner",
      country: "Italy",
      countryCode: "ITA",
      recordLabel: "2024 champion",
      quote:
        "Sinner's 2024 title came immediately after his first Australian Open crown and marked another step in his rise to the top of men's tennis.",
      legend: true,
      featured: false,
      sortOrder: 60,
    },
  ],

  editions: [

    {
      year: 1974,
      championName: "Tom Okker",
      championCountryCode: "NED",
    },
    {
      year: 1975,
      championName: "Arthur Ashe",
      championCountryCode: "USA",
    },
    {
      year: 1976,
      championName: "Arthur Ashe",
      championCountryCode: "USA",
    },
    {
      year: 1977,
      championName: "Dick Stockton",
      championCountryCode: "USA",
    },
    {
      year: 1978,
      championName: "Jimmy Connors",
      championCountryCode: "USA",
    },
    {
      year: 1979,
      championName: "Bjorn Borg",
      championCountryCode: "SWE",
    },
    {
      year: 1980,
      championName: "Heinz Gunthardt",
      championCountryCode: "SUI",
    },
    {
      year: 1981,
      championName: "Jimmy Connors",
      championCountryCode: "USA",
    },
    {
      year: 1982,
      championName: "Guillermo Vilas",
      championCountryCode: "ARG",
    },
    {
      year: 1983,
      championName: "Gene Mayer",
      championCountryCode: "USA",
    },
    {
      year: 1984,
      cancelled: true,
    },
    {
      year: 1985,
      championName: "Miloslav Mecir",
      championCountryCode: "TCH",
    },
    {
      year: 1986,
      championName: "Joakim Nystrom",
      championCountryCode: "SWE",
    },
    {
      year: 1987,
      championName: "Stefan Edberg",
      championCountryCode: "SWE",
    },
    {
      year: 1988,
      championName: "Stefan Edberg",
      championCountryCode: "SWE",
    },
    {
      year: 1989,
      championName: "Jakob Hlasek",
      championCountryCode: "SUI",
    },
    {
      year: 1990,
      championName: "Brad Gilbert",
      championCountryCode: "USA",
    },
    {
      year: 1991,
      championName: "Omar Camporese",
      championCountryCode: "ITA",
    },
    {
      year: 1992,
      championName: "Boris Becker",
      championCountryCode: "GER",
    },
    {
      year: 1993,
      championName: "Anders Jarryd",
      championCountryCode: "SWE",
    },
    {
      year: 1994,
      championName: "Michael Stich",
      championCountryCode: "GER",
    },
    {
      year: 1995,
      championName: "Richard Krajicek",
      championCountryCode: "NED",
    },
    {
      year: 1996,
      championName: "Goran Ivanisevic",
      championCountryCode: "CRO",
    },
    {
      year: 1997,
      championName: "Richard Krajicek",
      championCountryCode: "NED",
    },
    {
      year: 1998,
      championName: "Jan Siemerink",
      championCountryCode: "NED",
    },
    {
      year: 1999,
      championName: "Yevgeny Kafelnikov",
      championCountryCode: "RUS",
    },
    {
      year: 2000,
      championName: "Cedric Pioline",
      championCountryCode: "FRA",
    },
    {
      year: 2001,
      championName: "Nicolas Escude",
      championCountryCode: "FRA",
    },
    {
      year: 2002,
      championName: "Nicolas Escude",
      championCountryCode: "FRA",
    },
    {
      year: 2003,
      championName: "Max Mirnyi",
      championCountryCode: "BLR",
    },
    {
      year: 2004,
      championName: "Lleyton Hewitt",
      championCountryCode: "AUS",
    },
    {
      year: 2005,
      championName: "Roger Federer",
      championCountryCode: "SUI",
      championPlayer: player("roger-federer", "federer"),
    },
    {
      year: 2006,
      championName: "Radek Stepanek",
      championCountryCode: "CZE",
    },
    {
      year: 2007,
      championName: "Mikhail Youzhny",
      championCountryCode: "RUS",
    },
    {
      year: 2008,
      championName: "Michael Llodra",
      championCountryCode: "FRA",
    },
    {
      year: 2009,
      championName: "Andy Murray",
      championCountryCode: "GBR",
      championPlayer: player("andy-murray", "murray"),
    },
    {
      year: 2010,
      championName: "Robin Soderling",
      championCountryCode: "SWE",
    },
    {
      year: 2011,
      championName: "Robin Soderling",
      championCountryCode: "SWE",
    },
    {
      year: 2012,
      championName: "Roger Federer",
      championCountryCode: "SUI",
      championPlayer: player("roger-federer", "federer"),
    },
    {
      year: 2013,
      championName: "Juan Martin del Potro",
      championCountryCode: "ARG",
    },
    {
      year: 2014,
      championName: "Tomas Berdych",
      championCountryCode: "CZE",
    },
    {
      year: 2015,
      championName: "Stan Wawrinka",
      championCountryCode: "SUI",
      championPlayer: player("stan-wawrinka", "wawrinka"),
    },
    {
      year: 2016,
      championName: "Martin Klizan",
      championCountryCode: "SVK",
    },
    {
      year: 2017,
      championName: "Jo-Wilfried Tsonga",
      championCountryCode: "FRA",
    },
    {
      year: 2018,
      championName: "Roger Federer",
      championCountryCode: "SUI",
      championPlayer: player("roger-federer", "federer"),
    },
    {
      year: 2019,
      championName: "Gael Monfils",
      championCountryCode: "FRA",
    },
    {
      year: 2020,
      championName: "Gael Monfils",
      championCountryCode: "FRA",
    },
    {
      year: 2021,
      championName: "Andrey Rublev",
      championCountryCode: "RUS",
      championPlayer: player("andrey-rublev", "rublev"),
    },
    {
      year: 2022,
      championName: "Felix Auger-Aliassime",
      championCountryCode: "CAN",
      championPlayer: player("felix-auger-aliassime", "auger-aliassime"),
      runnerUpName: "Stefanos Tsitsipas",
      runnerUpCountryCode: "GRE",
      runnerUpPlayer: player("stefanos-tsitsipas", "tsitsipas"),
      score: "6-4, 6-2",
    },
    {
      year: 2023,
      championName: "Daniil Medvedev",
      championCountryCode: "RUS",
      championPlayer: player("daniil-medvedev", "medvedev"),
      runnerUpName: "Jannik Sinner",
      runnerUpCountryCode: "ITA",
      runnerUpPlayer: player("jannik-sinner", "sinner"),
      score: "5-7, 6-2, 6-2",
    },
    {
      year: 2024,
      championName: "Jannik Sinner",
      championCountryCode: "ITA",
      championPlayer: player("jannik-sinner", "sinner"),
      runnerUpName: "Alex de Minaur",
      runnerUpCountryCode: "AUS",
      runnerUpPlayer: player("alex-de-minaur", "de-minaur"),
      score: "7-5, 6-4",
    },
    {
      year: 2025,
      championName: "Carlos Alcaraz",
      championCountryCode: "ESP",
      championPlayer: player("carlos-alcaraz", "alcaraz"),
      runnerUpName: "Alex de Minaur",
      runnerUpCountryCode: "AUS",
      runnerUpPlayer: player("alex-de-minaur", "de-minaur"),
      score: "6-4, 3-6, 6-2",
    },
    {
      year: 2026,
      championName: "Alex de Minaur",
      championCountryCode: "AUS",
      championPlayer: player("alex-de-minaur", "de-minaur"),
      runnerUpName: "Felix Auger-Aliassime",
      runnerUpCountryCode: "CAN",
      runnerUpPlayer: player("felix-auger-aliassime", "auger-aliassime"),
      score: "6-3, 6-2",
    },
  ],
} satisfies TournamentHistoryDataset;

export default dataset;