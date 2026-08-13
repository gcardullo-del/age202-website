import type {
  TournamentHistoryDataset,
  TournamentHistoryPlayerRef,
} from "../../tournament-history/types";

const player = (...slugCandidates: string[]): TournamentHistoryPlayerRef => ({
  slugCandidates,
});

const dataset = {
  tournamentSlug: "tokyo",

  tournament: {
    name: "Kinoshita Group Japan Open Tennis Championships",
    shortName: "Tokyo",
    category: "ATP_500",
    surface: "HARD",
    city: "Tokyo",
    country: "Japan",
    countryCode: "JPN",
    venue: "Ariake Colosseum",
    foundedYear: 1972,
    description:
      "Tokyo is Asia's longest-running ATP Tour tournament, combining a historic championship tradition with the distinctive hard courts and retractable-roof setting of Ariake.",
    history:
      "First held in 1972, the Japan Open has welcomed generations of leading champions to Tokyo. Stefan Edberg built the tournament record with four singles titles and 27 match wins, while Pete Sampras won three times. Roger Federer, Rafael Nadal, Andy Murray and Novak Djokovic later added their names to the trophy, and Kei Nishikori became a two-time home champion. The modern era has continued with winners including Daniil Medvedev, Taylor Fritz, Ben Shelton, Arthur Fils and Carlos Alcaraz.",
    active: true,
    metaTitle:
      "Tokyo ATP 500 | History, Legends & Recent Finals | AGE202",
    metaDescription:
      "Explore the Kinoshita Group Japan Open in Tokyo: history, iconic moments, legends and the five most recent completed ATP 500 finals.",
  },

  iconicMoments: [
    {
      year: 1972,
      title: "Asia's ATP tradition begins",
      subtitle: "The first Japan Open",
      description:
        "Tokyo stages the inaugural Japan Open, beginning what will become the longest-running ATP Tour tournament in Asia.",
      sortOrder: 10,
    },
    {
      year: 1991,
      title: "Edberg reaches four",
      subtitle: "A tournament record",
      description:
        "World No. 1 Stefan Edberg captures his fourth Tokyo singles crown, establishing the tournament record for titles.",
      featured: true,
      sortOrder: 20,
    },
    {
      year: 2012,
      title: "Nishikori makes home history",
      subtitle: "A Japanese champion in Tokyo",
      description:
        "Kei Nishikori wins his first Japan Open title, creating one of the defining home-crowd moments in tournament history.",
      featured: true,
      sortOrder: 30,
    },
    {
      year: 2019,
      title: "Djokovic conquers Tokyo",
      subtitle: "The World No. 1 adds Japan",
      description:
        "Novak Djokovic wins the title on his tournament debut, adding Tokyo to the championship collections of the era's great players.",
      featured: true,
      sortOrder: 40,
    },
    {
      year: 2025,
      title: "Alcaraz wins on debut",
      subtitle: "A new champion at Ariake",
      description:
        "Carlos Alcaraz defeats Taylor Fritz 6-4, 6-4 to win the Japan Open in his first appearance at the tournament.",
      featured: true,
      sortOrder: 50,
    },
  ],

  legends: [
    {
      name: "Stefan Edberg",
      country: "Sweden",
      countryCode: "SWE",
      recordLabel: "Record four-time champion",
      quote:
        "Edberg won Tokyo four times and compiled a tournament-record 27 singles match victories.",
      legend: true,
      featured: true,
      sortOrder: 10,
    },
    {
      name: "Pete Sampras",
      country: "United States",
      countryCode: "USA",
      recordLabel: "Three-time champion",
      quote:
        "Sampras captured Tokyo in 1993, 1994 and 1996, twice winning the tournament while ranked World No. 1.",
      legend: true,
      featured: true,
      sortOrder: 20,
    },
    {
      name: "Kei Nishikori",
      country: "Japan",
      countryCode: "JPN",
      recordLabel: "Two-time home champion",
      quote:
        "Nishikori won in 2012 and 2014 and remains the most recent Japanese singles champion of the Japan Open.",
      legend: true,
      featured: true,
      sortOrder: 30,
    },
    {
      player: player("roger-federer", "federer"),
      name: "Roger Federer",
      country: "Switzerland",
      countryCode: "SUI",
      recordLabel: "2006 champion",
      quote:
        "Federer won Tokyo in 2006 while ranked World No. 1, adding the Japan Open to his global championship legacy.",
      legend: true,
      featured: false,
      sortOrder: 40,
    },
    {
      player: player("rafael-nadal", "nadal"),
      name: "Rafael Nadal",
      country: "Spain",
      countryCode: "ESP",
      recordLabel: "2010 champion",
      quote:
        "Nadal captured Tokyo in 2010 while World No. 1, winning another major hard-court title during one of his greatest seasons.",
      legend: true,
      featured: false,
      sortOrder: 50,
    },
    {
      player: player("novak-djokovic", "djokovic"),
      name: "Novak Djokovic",
      country: "Serbia",
      countryCode: "SRB",
      recordLabel: "2019 champion",
      quote:
        "Djokovic won the 2019 title on his Tokyo debut without dropping a set.",
      legend: true,
      featured: false,
      sortOrder: 60,
    },
  ],

  editions: [

    {
      year: 1972,
      championName: "Tom Gorman",
      championCountryCode: "USA",
    },
    {
      year: 1973,
      championName: "Ken Rosewall",
      championCountryCode: "AUS",
    },
    {
      year: 1974,
      championName: "John Newcombe",
      championCountryCode: "AUS",
    },
    {
      year: 1975,
      championName: "Raul Ramirez",
      championCountryCode: "MEX",
    },
    {
      year: 1976,
      championName: "Roscoe Tanner",
      championCountryCode: "USA",
    },
    {
      year: 1977,
      championName: "Manuel Orantes",
      championCountryCode: "ESP",
    },
    {
      year: 1978,
      championName: "Adriano Panatta",
      championCountryCode: "ITA",
    },
    {
      year: 1979,
      championName: "Terry Moor",
      championCountryCode: "USA",
    },
    {
      year: 1980,
      championName: "Ivan Lendl",
      championCountryCode: "TCH",
    },
    {
      year: 1981,
      championName: "Balazs Taroczy",
      championCountryCode: "HUN",
    },
    {
      year: 1982,
      championName: "Jimmy Arias",
      championCountryCode: "USA",
    },
    {
      year: 1983,
      championName: "Eliot Teltscher",
      championCountryCode: "USA",
    },
    {
      year: 1984,
      championName: "David Pate",
      championCountryCode: "USA",
    },
    {
      year: 1985,
      championName: "Scott Davis",
      championCountryCode: "USA",
    },
    {
      year: 1986,
      championName: "Ramesh Krishnan",
      championCountryCode: "IND",
    },
    {
      year: 1987,
      championName: "Stefan Edberg",
      championCountryCode: "SWE",
    },
    {
      year: 1988,
      championName: "John McEnroe",
      championCountryCode: "USA",
    },
    {
      year: 1989,
      championName: "Stefan Edberg",
      championCountryCode: "SWE",
    },
    {
      year: 1990,
      championName: "Ivan Lendl",
      championCountryCode: "TCH",
    },
    {
      year: 1991,
      championName: "Stefan Edberg",
      championCountryCode: "SWE",
    },
    {
      year: 1992,
      championName: "Jim Courier",
      championCountryCode: "USA",
    },
    {
      year: 1993,
      championName: "Pete Sampras",
      championCountryCode: "USA",
    },
    {
      year: 1994,
      championName: "Pete Sampras",
      championCountryCode: "USA",
    },
    {
      year: 1995,
      championName: "Jim Courier",
      championCountryCode: "USA",
    },
    {
      year: 1996,
      championName: "Pete Sampras",
      championCountryCode: "USA",
    },
    {
      year: 1997,
      championName: "Richard Krajicek",
      championCountryCode: "NED",
    },
    {
      year: 1998,
      championName: "Andrei Pavel",
      championCountryCode: "ROU",
    },
    {
      year: 1999,
      championName: "Nicolas Kiefer",
      championCountryCode: "GER",
    },
    {
      year: 2000,
      championName: "Sjeng Schalken",
      championCountryCode: "NED",
    },
    {
      year: 2001,
      championName: "Lleyton Hewitt",
      championCountryCode: "AUS",
    },
    {
      year: 2002,
      championName: "Kenneth Carlsen",
      championCountryCode: "DEN",
    },
    {
      year: 2003,
      championName: "Rainer Schuettler",
      championCountryCode: "GER",
    },
    {
      year: 2004,
      championName: "Jiri Novak",
      championCountryCode: "CZE",
    },
    {
      year: 2005,
      championName: "Wesley Moodie",
      championCountryCode: "RSA",
    },
    {
      year: 2006,
      championName: "Roger Federer",
      championCountryCode: "SUI",
      championPlayer: player("roger-federer", "federer"),
    },
    {
      year: 2007,
      championName: "David Ferrer",
      championCountryCode: "ESP",
    },
    {
      year: 2008,
      championName: "Tomas Berdych",
      championCountryCode: "CZE",
    },
    {
      year: 2009,
      championName: "Jo-Wilfried Tsonga",
      championCountryCode: "FRA",
    },
    {
      year: 2010,
      championName: "Rafael Nadal",
      championCountryCode: "ESP",
      championPlayer: player("rafael-nadal", "nadal"),
    },
    {
      year: 2011,
      championName: "Andy Murray",
      championCountryCode: "GBR",
      championPlayer: player("andy-murray", "murray"),
    },
    {
      year: 2012,
      championName: "Kei Nishikori",
      championCountryCode: "JPN",
    },
    {
      year: 2013,
      championName: "Juan Martin del Potro",
      championCountryCode: "ARG",
    },
    {
      year: 2014,
      championName: "Kei Nishikori",
      championCountryCode: "JPN",
    },
    {
      year: 2015,
      championName: "Stan Wawrinka",
      championCountryCode: "SUI",
      championPlayer: player("stan-wawrinka", "wawrinka"),
    },
    {
      year: 2016,
      championName: "Nick Kyrgios",
      championCountryCode: "AUS",
    },
    {
      year: 2017,
      championName: "David Goffin",
      championCountryCode: "BEL",
    },
    {
      year: 2018,
      championName: "Daniil Medvedev",
      championCountryCode: "RUS",
      championPlayer: player("daniil-medvedev", "medvedev"),
    },
    {
      year: 2019,
      championName: "Novak Djokovic",
      championCountryCode: "SRB",
      championPlayer: player("novak-djokovic", "djokovic"),
      runnerUpName: "John Millman",
      runnerUpCountryCode: "AUS",
      score: "6-3, 6-2",
    },
    {
      year: 2020,
      cancelled: true,
    },
    {
      year: 2021,
      cancelled: true,
    },
    {
      year: 2022,
      championName: "Taylor Fritz",
      championCountryCode: "USA",
      runnerUpName: "Frances Tiafoe",
      runnerUpCountryCode: "USA",
      score: "7-6(3), 7-6(2)",
    },
    {
      year: 2023,
      championName: "Ben Shelton",
      championCountryCode: "USA",
      runnerUpName: "Aslan Karatsev",
      runnerUpCountryCode: "RUS",
      score: "7-5, 6-1",
    },
    {
      year: 2024,
      championName: "Arthur Fils",
      championCountryCode: "FRA",
      runnerUpName: "Ugo Humbert",
      runnerUpCountryCode: "FRA",
      score: "5-7, 7-6(6), 6-3",
    },
    {
      year: 2025,
      championName: "Carlos Alcaraz",
      championCountryCode: "ESP",
      championPlayer: player("carlos-alcaraz", "alcaraz"),
      runnerUpName: "Taylor Fritz",
      runnerUpCountryCode: "USA",
      score: "6-4, 6-4",
    },
  ],
} satisfies TournamentHistoryDataset;

export default dataset;