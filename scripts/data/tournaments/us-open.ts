import type {
  TournamentHistoryDataset,
  TournamentHistoryPlayerRef,
} from "../../tournament-history/types";

const player = (
  ...slugCandidates: string[]
): TournamentHistoryPlayerRef => ({
  slugCandidates,
});

const dataset = {
  tournamentSlug: "us-open",

  tournament: {
    name: "US Open",
    shortName: "US Open",
    category: "GRAND_SLAM",
    surface: "HARD",
    city: "New York",
    country: "United States",
    countryCode: "USA",
    venue: "USTA Billie Jean King National Tennis Center",
    foundedYear: 1881,
    description: "The US Open is New York's Grand Slam, a championship shaped by more than a century of American tennis history, night-session energy and the hard courts of Flushing Meadows.",
    history: "The men's championship began in 1881 as the U.S. National Championships. Over time the tournament moved through several homes and surfaces before settling at Flushing Meadows in 1978, where hard courts and night sessions helped define its modern identity. The US Open has repeatedly introduced innovations to major-championship tennis and remains the final Grand Slam of the calendar year.",
    active: true,
    featured: true,
    metaTitle: "US Open Archive | Champions, Finals & History | AGE202",
    metaDescription: "Explore the AGE202 US Open archive: men's singles champions, finals, historic editions, milestones, iconic moments and legends from New York.",
  },

  milestones: [
    {
      year: 1881,
      title: "The beginning",
      subtitle: "U.S. National Championships",
      description: "The men's singles championship begins in Newport, Rhode Island.",
      featured: true,
      sortOrder: 10,
    },
    {
      year: 1915,
      title: "Forest Hills",
      subtitle: "A new New York chapter",
      description: "The championship moves to the West Side Tennis Club at Forest Hills.",
      featured: false,
      sortOrder: 20,
    },
    {
      year: 1968,
      title: "The US Open",
      subtitle: "Open Era identity",
      description: "The event becomes the US Open as professionals and amateurs compete together.",
      featured: true,
      sortOrder: 30,
    },
    {
      year: 1975,
      title: "Three years on clay",
      subtitle: "A rare surface chapter",
      description: "The tournament moves from grass to Har-Tru clay at Forest Hills.",
      featured: false,
      sortOrder: 40,
    },
    {
      year: 1978,
      title: "Flushing Meadows",
      subtitle: "The modern home opens",
      description: "The US Open moves to Flushing Meadows and adopts hard courts.",
      featured: true,
      sortOrder: 50,
    },
    {
      year: 2025,
      title: "Alcaraz wins again",
      subtitle: "The new generation",
      description: "Carlos Alcaraz defeats Jannik Sinner to reclaim the US Open men's singles title.",
      featured: false,
      sortOrder: 60,
    }
  ],

  chapters: [
    {
      eyebrow: "Origins",
      title: "From Newport to New York",
      subtitle: "The roots of the American major",
      yearLabel: "1881–1914",
      description: "The championship began in Newport before its growing national importance eventually pulled it toward New York.",
      featured: true,
      sortOrder: 10,
    },
    {
      eyebrow: "Forest Hills",
      title: "A defining American tennis stage",
      subtitle: "Grass, clay and tradition",
      yearLabel: "1915–1977",
      description: "Forest Hills became one of the great homes of American tennis and hosted the championship across both grass and clay eras.",
      featured: false,
      sortOrder: 20,
    },
    {
      eyebrow: "Transformation",
      title: "Flushing Meadows changes everything",
      subtitle: "Hard courts and night tennis",
      yearLabel: "1978",
      description: "The move to the National Tennis Center created the foundation for the modern US Open.",
      featured: true,
      sortOrder: 30,
    },
    {
      eyebrow: "Energy",
      title: "The night-session major",
      subtitle: "New York after dark",
      description: "Arthur Ashe Stadium and the US Open night session created one of the most distinctive atmospheres in professional tennis.",
      featured: false,
      sortOrder: 40,
    },
    {
      eyebrow: "Modern champions",
      title: "From Federer to the new generation",
      subtitle: "Two decades of global stars",
      yearLabel: "2004–2025",
      description: "Federer, Nadal, Djokovic, Alcaraz and Sinner have all added major chapters to the modern New York archive.",
      featured: false,
      sortOrder: 50,
    }
  ],

  iconicMoments: [
    {
      year: 1968,
      title: "Ashe wins the first US Open",
      subtitle: "A historic champion",
      description: "Arthur Ashe wins the inaugural US Open men's singles title in the first year of the tournament's Open Era identity.",
      featured: true,
      sortOrder: 10,
    },
    {
      year: 1978,
      title: "The move to Flushing Meadows",
      subtitle: "Hard courts arrive",
      description: "The tournament opens its modern New York home and begins the hard-court era.",
      featured: true,
      sortOrder: 20,
    },
    {
      year: 2008,
      title: "Federer wins five straight",
      subtitle: "A New York dynasty",
      description: "Roger Federer completes a run of five consecutive US Open titles.",
      featured: true,
      sortOrder: 30,
    },
    {
      year: 2009,
      title: "Del Potro breaks through",
      subtitle: "A five-set final",
      description: "Juan Martín del Potro defeats Roger Federer to win his first Grand Slam title.",
      featured: false,
      sortOrder: 40,
    },
    {
      year: 2011,
      title: "Djokovic's breakthrough New York title",
      subtitle: "A dominant season crowned",
      description: "Novak Djokovic defeats Rafael Nadal to win the US Open.",
      featured: false,
      sortOrder: 50,
    },
    {
      year: 2022,
      title: "Alcaraz becomes champion",
      subtitle: "A new world No. 1",
      description: "Carlos Alcaraz wins his first Grand Slam title in New York.",
      featured: true,
      sortOrder: 60,
    },
    {
      year: 2024,
      title: "Sinner conquers New York",
      subtitle: "A first US Open title",
      description: "Jannik Sinner defeats Taylor Fritz to claim the championship.",
      featured: true,
      sortOrder: 70,
    }
  ],

  legends: [
    {
      player: player("roger-federer", "federer"),
      name: "Roger Federer",
      country: "Switzerland",
      countryCode: "SUI",
      recordLabel: "5 US Open titles",
      legend: true,
      featured: true,
      sortOrder: 10,
    },
    {
      player: player("rafael-nadal", "nadal"),
      name: "Rafael Nadal",
      country: "Spain",
      countryCode: "ESP",
      recordLabel: "4 US Open titles",
      legend: true,
      featured: true,
      sortOrder: 20,
    },
    {
      player: player("novak-djokovic", "djokovic"),
      name: "Novak Djokovic",
      country: "Serbia",
      countryCode: "SRB",
      recordLabel: "4 US Open titles",
      legend: true,
      featured: true,
      sortOrder: 30,
    },
    {
      player: player("carlos-alcaraz", "alcaraz"),
      name: "Carlos Alcaraz",
      country: "Spain",
      countryCode: "ESP",
      recordLabel: "2 US Open titles",
      legend: true,
      featured: true,
      sortOrder: 40,
    },
    {
      player: player("jannik-sinner", "sinner"),
      name: "Jannik Sinner",
      country: "Italy",
      countryCode: "ITA",
      recordLabel: "US Open champion",
      legend: true,
      featured: true,
      sortOrder: 50,
    }
  ],

  editions: [
    {
      year: 1881,
      championName: "Richard Sears",
    },
    {
      year: 1882,
      championName: "Richard Sears",
    },
    {
      year: 1883,
      championName: "Richard Sears",
    },
    {
      year: 1884,
      championName: "Richard Sears",
    },
    {
      year: 1885,
      championName: "Richard Sears",
    },
    {
      year: 1886,
      championName: "Richard Sears",
    },
    {
      year: 1887,
      championName: "Richard Sears",
    },
    {
      year: 1888,
      championName: "Henry Slocum",
    },
    {
      year: 1889,
      championName: "Henry Slocum",
    },
    {
      year: 1890,
      championName: "Oliver Campbell",
    },
    {
      year: 1891,
      championName: "Oliver Campbell",
    },
    {
      year: 1892,
      championName: "Oliver Campbell",
    },
    {
      year: 1893,
      championName: "Robert Wrenn",
    },
    {
      year: 1894,
      championName: "Robert Wrenn",
    },
    {
      year: 1895,
      championName: "Frederick Hovey",
    },
    {
      year: 1896,
      championName: "Robert Wrenn",
    },
    {
      year: 1897,
      championName: "Robert Wrenn",
    },
    {
      year: 1898,
      championName: "Malcolm Whitman",
    },
    {
      year: 1899,
      championName: "Malcolm Whitman",
    },
    {
      year: 1900,
      championName: "Malcolm Whitman",
    },
    {
      year: 1901,
      championName: "William Larned",
    },
    {
      year: 1902,
      championName: "William Larned",
    },
    {
      year: 1903,
      championName: "Laurence Doherty",
    },
    {
      year: 1904,
      championName: "Holcombe Ward",
    },
    {
      year: 1905,
      championName: "Beals Wright",
    },
    {
      year: 1906,
      championName: "William Clothier",
    },
    {
      year: 1907,
      championName: "William Larned",
    },
    {
      year: 1908,
      championName: "William Larned",
    },
    {
      year: 1909,
      championName: "William Larned",
    },
    {
      year: 1910,
      championName: "William Larned",
    },
    {
      year: 1911,
      championName: "William Larned",
    },
    {
      year: 1912,
      championName: "Maurice McLoughlin",
    },
    {
      year: 1913,
      championName: "Maurice McLoughlin",
    },
    {
      year: 1914,
      championName: "R. Norris Williams",
    },
    {
      year: 1915,
      championName: "Bill Johnston",
    },
    {
      year: 1916,
      championName: "R. Norris Williams",
    },
    {
      year: 1917,
      championName: "Lindley Murray",
    },
    {
      year: 1918,
      championName: "Lindley Murray",
    },
    {
      year: 1919,
      championName: "Bill Johnston",
    },
    {
      year: 1920,
      championName: "Bill Tilden",
    },
    {
      year: 1921,
      championName: "Bill Tilden",
    },
    {
      year: 1922,
      championName: "Bill Tilden",
    },
    {
      year: 1923,
      championName: "Bill Tilden",
    },
    {
      year: 1924,
      championName: "Bill Tilden",
    },
    {
      year: 1925,
      championName: "Bill Tilden",
    },
    {
      year: 1926,
      championName: "René Lacoste",
    },
    {
      year: 1927,
      championName: "René Lacoste",
    },
    {
      year: 1928,
      championName: "Henri Cochet",
    },
    {
      year: 1929,
      championName: "Bill Tilden",
    },
    {
      year: 1930,
      championName: "John Doeg",
    },
    {
      year: 1931,
      championName: "Ellsworth Vines",
    },
    {
      year: 1932,
      championName: "Ellsworth Vines",
    },
    {
      year: 1933,
      championName: "Fred Perry",
    },
    {
      year: 1934,
      championName: "Fred Perry",
    },
    {
      year: 1935,
      championName: "Wilmer Allison",
    },
    {
      year: 1936,
      championName: "Fred Perry",
    },
    {
      year: 1937,
      championName: "Don Budge",
    },
    {
      year: 1938,
      championName: "Don Budge",
    },
    {
      year: 1939,
      championName: "Bobby Riggs",
    },
    {
      year: 1940,
      championName: "Don McNeill",
    },
    {
      year: 1941,
      championName: "Bobby Riggs",
    },
    {
      year: 1942,
      championName: "Ted Schroeder",
    },
    {
      year: 1943,
      championName: "Joe Hunt",
    },
    {
      year: 1944,
      championName: "Frank Parker",
    },
    {
      year: 1945,
      championName: "Frank Parker",
    },
    {
      year: 1946,
      championName: "Jack Kramer",
    },
    {
      year: 1947,
      championName: "Jack Kramer",
    },
    {
      year: 1948,
      championName: "Pancho Gonzales",
    },
    {
      year: 1949,
      championName: "Pancho Gonzales",
    },
    {
      year: 1950,
      championName: "Art Larsen",
    },
    {
      year: 1951,
      championName: "Frank Sedgman",
    },
    {
      year: 1952,
      championName: "Frank Sedgman",
    },
    {
      year: 1953,
      championName: "Tony Trabert",
    },
    {
      year: 1954,
      championName: "Vic Seixas",
    },
    {
      year: 1955,
      championName: "Tony Trabert",
    },
    {
      year: 1956,
      championName: "Ken Rosewall",
    },
    {
      year: 1957,
      championName: "Mal Anderson",
    },
    {
      year: 1958,
      championName: "Ashley Cooper",
    },
    {
      year: 1959,
      championName: "Neale Fraser",
    },
    {
      year: 1960,
      championName: "Neale Fraser",
    },
    {
      year: 1961,
      championName: "Roy Emerson",
    },
    {
      year: 1962,
      championName: "Rod Laver",
    },
    {
      year: 1963,
      championName: "Rafael Osuna",
    },
    {
      year: 1964,
      championName: "Roy Emerson",
    },
    {
      year: 1965,
      championName: "Manuel Santana",
    },
    {
      year: 1966,
      championName: "Fred Stolle",
    },
    {
      year: 1967,
      championName: "John Newcombe",
    },
    {
      year: 1968,
      championName: "Arthur Ashe",
      runnerUpName: "Tom Okker",
    },
    {
      year: 1969,
      championName: "Rod Laver",
      runnerUpName: "Tony Roche",
    },
    {
      year: 1970,
      championName: "Ken Rosewall",
      runnerUpName: "Tony Roche",
    },
    {
      year: 1971,
      championName: "Stan Smith",
      runnerUpName: "Jan Kodeš",
    },
    {
      year: 1972,
      championName: "Ilie Năstase",
      runnerUpName: "Arthur Ashe",
    },
    {
      year: 1973,
      championName: "John Newcombe",
      runnerUpName: "Jan Kodeš",
    },
    {
      year: 1974,
      championName: "Jimmy Connors",
      runnerUpName: "Ken Rosewall",
    },
    {
      year: 1975,
      championName: "Manuel Orantes",
      runnerUpName: "Jimmy Connors",
    },
    {
      year: 1976,
      championName: "Jimmy Connors",
      runnerUpName: "Björn Borg",
    },
    {
      year: 1977,
      championName: "Guillermo Vilas",
      runnerUpName: "Jimmy Connors",
    },
    {
      year: 1978,
      championName: "Jimmy Connors",
      runnerUpName: "Björn Borg",
    },
    {
      year: 1979,
      championName: "John McEnroe",
      runnerUpName: "Vitas Gerulaitis",
    },
    {
      year: 1980,
      championName: "John McEnroe",
      runnerUpName: "Björn Borg",
    },
    {
      year: 1981,
      championName: "John McEnroe",
      runnerUpName: "Björn Borg",
    },
    {
      year: 1982,
      championName: "Jimmy Connors",
      runnerUpName: "Ivan Lendl",
    },
    {
      year: 1983,
      championName: "Jimmy Connors",
      runnerUpName: "Ivan Lendl",
    },
    {
      year: 1984,
      championName: "John McEnroe",
      runnerUpName: "Ivan Lendl",
    },
    {
      year: 1985,
      championName: "Ivan Lendl",
      runnerUpName: "John McEnroe",
    },
    {
      year: 1986,
      championName: "Ivan Lendl",
      runnerUpName: "Miloslav Mečíř",
    },
    {
      year: 1987,
      championName: "Ivan Lendl",
      runnerUpName: "Mats Wilander",
    },
    {
      year: 1988,
      championName: "Mats Wilander",
      runnerUpName: "Ivan Lendl",
    },
    {
      year: 1989,
      championName: "Boris Becker",
      runnerUpName: "Ivan Lendl",
    },
    {
      year: 1990,
      championName: "Pete Sampras",
      runnerUpName: "Andre Agassi",
    },
    {
      year: 1991,
      championName: "Stefan Edberg",
      runnerUpName: "Jim Courier",
    },
    {
      year: 1992,
      championName: "Stefan Edberg",
      runnerUpName: "Pete Sampras",
    },
    {
      year: 1993,
      championName: "Pete Sampras",
      runnerUpName: "Cédric Pioline",
    },
    {
      year: 1994,
      championName: "Andre Agassi",
      runnerUpName: "Michael Stich",
    },
    {
      year: 1995,
      championName: "Pete Sampras",
      runnerUpName: "Andre Agassi",
    },
    {
      year: 1996,
      championName: "Pete Sampras",
      runnerUpName: "Michael Chang",
    },
    {
      year: 1997,
      championName: "Patrick Rafter",
      runnerUpName: "Greg Rusedski",
    },
    {
      year: 1998,
      championName: "Patrick Rafter",
      runnerUpName: "Mark Philippoussis",
    },
    {
      year: 1999,
      championName: "Andre Agassi",
      runnerUpName: "Todd Martin",
    },
    {
      year: 2000,
      championName: "Marat Safin",
      runnerUpName: "Pete Sampras",
    },
    {
      year: 2001,
      championName: "Lleyton Hewitt",
      runnerUpName: "Pete Sampras",
    },
    {
      year: 2002,
      championName: "Pete Sampras",
      runnerUpName: "Andre Agassi",
    },
    {
      year: 2003,
      championName: "Andy Roddick",
      runnerUpName: "Juan Carlos Ferrero",
    },
    {
      year: 2004,
      championName: "Roger Federer",
      runnerUpName: "Lleyton Hewitt",
      championPlayer: player("roger-federer", "federer"),
    },
    {
      year: 2005,
      championName: "Roger Federer",
      runnerUpName: "Andre Agassi",
      championPlayer: player("roger-federer", "federer"),
    },
    {
      year: 2006,
      championName: "Roger Federer",
      runnerUpName: "Andy Roddick",
      championPlayer: player("roger-federer", "federer"),
    },
    {
      year: 2007,
      championName: "Roger Federer",
      runnerUpName: "Novak Djokovic",
      championPlayer: player("roger-federer", "federer"),
      runnerUpPlayer: player("novak-djokovic", "djokovic"),
    },
    {
      year: 2008,
      championName: "Roger Federer",
      runnerUpName: "Andy Murray",
      championPlayer: player("roger-federer", "federer"),
    },
    {
      year: 2009,
      championName: "Juan Martín del Potro",
      runnerUpName: "Roger Federer",
      runnerUpPlayer: player("roger-federer", "federer"),
    },
    {
      year: 2010,
      championName: "Rafael Nadal",
      runnerUpName: "Novak Djokovic",
      championPlayer: player("rafael-nadal", "nadal"),
      runnerUpPlayer: player("novak-djokovic", "djokovic"),
    },
    {
      year: 2011,
      championName: "Novak Djokovic",
      runnerUpName: "Rafael Nadal",
      championPlayer: player("novak-djokovic", "djokovic"),
      runnerUpPlayer: player("rafael-nadal", "nadal"),
    },
    {
      year: 2012,
      championName: "Andy Murray",
      runnerUpName: "Novak Djokovic",
      runnerUpPlayer: player("novak-djokovic", "djokovic"),
    },
    {
      year: 2013,
      championName: "Rafael Nadal",
      runnerUpName: "Novak Djokovic",
      championPlayer: player("rafael-nadal", "nadal"),
      runnerUpPlayer: player("novak-djokovic", "djokovic"),
    },
    {
      year: 2014,
      championName: "Marin Čilić",
      runnerUpName: "Kei Nishikori",
    },
    {
      year: 2015,
      championName: "Novak Djokovic",
      runnerUpName: "Roger Federer",
      championPlayer: player("novak-djokovic", "djokovic"),
      runnerUpPlayer: player("roger-federer", "federer"),
    },
    {
      year: 2016,
      championName: "Stan Wawrinka",
      runnerUpName: "Novak Djokovic",
      runnerUpPlayer: player("novak-djokovic", "djokovic"),
    },
    {
      year: 2017,
      championName: "Rafael Nadal",
      runnerUpName: "Kevin Anderson",
      championPlayer: player("rafael-nadal", "nadal"),
    },
    {
      year: 2018,
      championName: "Novak Djokovic",
      runnerUpName: "Juan Martín del Potro",
      championPlayer: player("novak-djokovic", "djokovic"),
    },
    {
      year: 2019,
      championName: "Rafael Nadal",
      runnerUpName: "Daniil Medvedev",
      championPlayer: player("rafael-nadal", "nadal"),
    },
    {
      year: 2020,
      championName: "Dominic Thiem",
      runnerUpName: "Alexander Zverev",
    },
    {
      year: 2021,
      championName: "Daniil Medvedev",
      runnerUpName: "Novak Djokovic",
      runnerUpPlayer: player("novak-djokovic", "djokovic"),
    },
    {
      year: 2022,
      championName: "Carlos Alcaraz",
      runnerUpName: "Casper Ruud",
      championPlayer: player("carlos-alcaraz", "alcaraz"),
    },
    {
      year: 2023,
      championName: "Novak Djokovic",
      runnerUpName: "Daniil Medvedev",
      championPlayer: player("novak-djokovic", "djokovic"),
    },
    {
      year: 2024,
      championName: "Jannik Sinner",
      runnerUpName: "Taylor Fritz",
      championPlayer: player("jannik-sinner", "sinner"),
    },
    {
      year: 2025,
      championName: "Carlos Alcaraz",
      runnerUpName: "Jannik Sinner",
      championPlayer: player("carlos-alcaraz", "alcaraz"),
      runnerUpPlayer: player("jannik-sinner", "sinner"),
    },
  ],
} satisfies TournamentHistoryDataset;

export default dataset;