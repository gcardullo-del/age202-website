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
  tournamentSlug: "wimbledon",

  tournament: {
    name: "Wimbledon",
    shortName: "Wimbledon",
    category: "GRAND_SLAM",
    surface: "GRASS",
    city: "London",
    country: "United Kingdom",
    countryCode: "GBR",
    venue: "All England Lawn Tennis and Croquet Club",
    foundedYear: 1877,
    description: "Wimbledon is the oldest tennis championship in the world and the sport's defining grass-court major, shaped by tradition, Centre Court and generations of champions at the All England Club.",
    history: "First held in 1877, The Championships developed from a pioneering lawn-tennis competition into one of world sport's most recognisable events. Played at the All England Club, Wimbledon preserves a distinctive grass-court identity and ceremonial tradition while continuously evolving its facilities and competitive format. Its champions span the challenge-round pioneers, the amateur era and the modern Open Era.",
    active: true,
    featured: true,
    metaTitle: "Wimbledon Archive | Champions, Finals & History | AGE202",
    metaDescription: "Explore the AGE202 Wimbledon archive: gentlemen's singles champions, finals, historic editions, milestones, iconic moments and legends.",
  },

  milestones: [
    {
      year: 1877,
      title: "The first Championship",
      subtitle: "Wimbledon begins",
      description: "The first Gentlemen's Singles championship establishes the tournament's place in tennis history.",
      featured: true,
      sortOrder: 10,
    },
    {
      year: 1922,
      title: "A new home",
      subtitle: "Church Road era",
      description: "The Championships move to the present Church Road site and Centre Court.",
      featured: true,
      sortOrder: 20,
    },
    {
      year: 1968,
      title: "Open Era",
      subtitle: "Professionals arrive",
      description: "Wimbledon joins the Open Era and welcomes professional players into The Championships.",
      featured: false,
      sortOrder: 30,
    },
    {
      year: 1985,
      title: "Becker breaks through",
      subtitle: "A teenage champion",
      description: "Boris Becker wins Wimbledon at 17, becoming the youngest men's singles champion of the Open Era.",
      featured: false,
      sortOrder: 40,
    },
    {
      year: 2003,
      title: "Federer begins his reign",
      subtitle: "The first of eight",
      description: "Roger Federer wins his first Wimbledon title and starts a record-setting Open Era run.",
      featured: true,
      sortOrder: 50,
    },
    {
      year: 2026,
      title: "Sinner defends the crown",
      subtitle: "A new grass-court era",
      description: "Jannik Sinner wins Wimbledon for the second consecutive year.",
      featured: false,
      sortOrder: 60,
    }
  ],

  chapters: [
    {
      eyebrow: "Origins",
      title: "The birthplace of championship tennis",
      subtitle: "From 1877 to a global institution",
      yearLabel: "1877–1921",
      description: "Wimbledon began as a lawn-tennis championship in 1877 and quickly became the reference point for the emerging sport.",
      featured: true,
      sortOrder: 10,
    },
    {
      eyebrow: "Home",
      title: "Centre Court and Church Road",
      subtitle: "A stage unlike any other",
      yearLabel: "1922",
      description: "The move to Church Road established the physical and symbolic home associated with The Championships today.",
      featured: false,
      sortOrder: 20,
    },
    {
      eyebrow: "Surface",
      title: "The grass-court major",
      subtitle: "Timing, movement and precision",
      description: "Wimbledon's grass creates a distinct competitive rhythm where serving, movement, timing and first-strike tennis remain central.",
      featured: false,
      sortOrder: 30,
    },
    {
      eyebrow: "Champions",
      title: "From Borg to Federer and Djokovic",
      subtitle: "Dynasties on Centre Court",
      yearLabel: "1976–2023",
      description: "The Open Era produced extraordinary Wimbledon dynasties, from Borg and Sampras to Federer and Djokovic.",
      featured: true,
      sortOrder: 40,
    },
    {
      eyebrow: "Next generation",
      title: "Alcaraz and Sinner",
      subtitle: "The new Centre Court rivalry",
      yearLabel: "2023–2026",
      description: "Carlos Alcaraz and Jannik Sinner have carried the championship into a new generation.",
      featured: false,
      sortOrder: 50,
    }
  ],

  iconicMoments: [
    {
      year: 1980,
      title: "Borg vs McEnroe",
      subtitle: "A Centre Court classic",
      description: "Björn Borg defeats John McEnroe in a final remembered as one of Wimbledon's defining matches.",
      featured: true,
      sortOrder: 10,
    },
    {
      year: 2008,
      title: "Nadal ends Federer's run",
      subtitle: "A final for the ages",
      description: "Rafael Nadal defeats Roger Federer in five sets to win his first Wimbledon title.",
      featured: true,
      sortOrder: 20,
    },
    {
      year: 2009,
      title: "Federer wins No. 6",
      subtitle: "16–14 in the fifth",
      description: "Roger Federer defeats Andy Roddick in an extraordinary five-set final.",
      featured: false,
      sortOrder: 30,
    },
    {
      year: 2019,
      title: "Djokovic saves championship points",
      subtitle: "The longest men's final",
      description: "Novak Djokovic defeats Roger Federer after a fifth-set tiebreak in a historic final.",
      featured: true,
      sortOrder: 40,
    },
    {
      year: 2023,
      title: "Alcaraz dethrones Djokovic",
      subtitle: "A new champion emerges",
      description: "Carlos Alcaraz defeats Novak Djokovic in five sets to claim his first Wimbledon crown.",
      featured: true,
      sortOrder: 50,
    },
    {
      year: 2025,
      title: "Sinner wins Wimbledon",
      subtitle: "A first title on grass",
      description: "Jannik Sinner becomes Wimbledon men's singles champion.",
      featured: false,
      sortOrder: 60,
    },
    {
      year: 2026,
      title: "Sinner retains the title",
      subtitle: "Back-to-back at SW19",
      description: "Jannik Sinner defeats Alexander Zverev to successfully defend the Wimbledon crown.",
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
      recordLabel: "8 Wimbledon titles",
      legend: true,
      featured: true,
      sortOrder: 10,
    },
    {
      player: player("novak-djokovic", "djokovic"),
      name: "Novak Djokovic",
      country: "Serbia",
      countryCode: "SRB",
      recordLabel: "7 Wimbledon titles",
      legend: true,
      featured: true,
      sortOrder: 20,
    },
    {
      player: player("rafael-nadal", "nadal"),
      name: "Rafael Nadal",
      country: "Spain",
      countryCode: "ESP",
      recordLabel: "2 Wimbledon titles",
      legend: true,
      featured: true,
      sortOrder: 30,
    },
    {
      player: player("carlos-alcaraz", "alcaraz"),
      name: "Carlos Alcaraz",
      country: "Spain",
      countryCode: "ESP",
      recordLabel: "2 Wimbledon titles",
      legend: true,
      featured: true,
      sortOrder: 40,
    },
    {
      player: player("jannik-sinner", "sinner"),
      name: "Jannik Sinner",
      country: "Italy",
      countryCode: "ITA",
      recordLabel: "2 Wimbledon titles",
      legend: true,
      featured: true,
      sortOrder: 50,
    }
  ],

  editions: [
    {
      year: 1877,
      championName: "Spencer Gore",
    },
    {
      year: 1878,
      championName: "Frank Hadow",
    },
    {
      year: 1879,
      championName: "John Hartley",
    },
    {
      year: 1880,
      championName: "John Hartley",
    },
    {
      year: 1881,
      championName: "William Renshaw",
    },
    {
      year: 1882,
      championName: "William Renshaw",
    },
    {
      year: 1883,
      championName: "William Renshaw",
    },
    {
      year: 1884,
      championName: "William Renshaw",
    },
    {
      year: 1885,
      championName: "William Renshaw",
    },
    {
      year: 1886,
      championName: "William Renshaw",
    },
    {
      year: 1887,
      championName: "Herbert Lawford",
    },
    {
      year: 1888,
      championName: "Ernest Renshaw",
    },
    {
      year: 1889,
      championName: "William Renshaw",
    },
    {
      year: 1890,
      championName: "Willoughby Hamilton",
    },
    {
      year: 1891,
      championName: "Wilfred Baddeley",
    },
    {
      year: 1892,
      championName: "Wilfred Baddeley",
    },
    {
      year: 1893,
      championName: "Joshua Pim",
    },
    {
      year: 1894,
      championName: "Joshua Pim",
    },
    {
      year: 1895,
      championName: "Wilfred Baddeley",
    },
    {
      year: 1896,
      championName: "Harold Mahony",
    },
    {
      year: 1897,
      championName: "Reginald Doherty",
    },
    {
      year: 1898,
      championName: "Reginald Doherty",
    },
    {
      year: 1899,
      championName: "Reginald Doherty",
    },
    {
      year: 1900,
      championName: "Reginald Doherty",
    },
    {
      year: 1901,
      championName: "Arthur Gore",
    },
    {
      year: 1902,
      championName: "Laurence Doherty",
    },
    {
      year: 1903,
      championName: "Laurence Doherty",
    },
    {
      year: 1904,
      championName: "Laurence Doherty",
    },
    {
      year: 1905,
      championName: "Laurence Doherty",
    },
    {
      year: 1906,
      championName: "Laurence Doherty",
    },
    {
      year: 1907,
      championName: "Norman Brookes",
    },
    {
      year: 1908,
      championName: "Arthur Gore",
    },
    {
      year: 1909,
      championName: "Arthur Gore",
    },
    {
      year: 1910,
      championName: "Anthony Wilding",
    },
    {
      year: 1911,
      championName: "Anthony Wilding",
    },
    {
      year: 1912,
      championName: "Anthony Wilding",
    },
    {
      year: 1913,
      championName: "Anthony Wilding",
    },
    {
      year: 1914,
      championName: "Norman Brookes",
    },
    {
      year: 1919,
      championName: "Gerald Patterson",
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
      championName: "Gerald Patterson",
    },
    {
      year: 1923,
      championName: "Bill Johnston",
    },
    {
      year: 1924,
      championName: "Jean Borotra",
    },
    {
      year: 1925,
      championName: "René Lacoste",
    },
    {
      year: 1926,
      championName: "Jean Borotra",
    },
    {
      year: 1927,
      championName: "René Lacoste",
    },
    {
      year: 1928,
      championName: "René Lacoste",
    },
    {
      year: 1929,
      championName: "Henri Cochet",
    },
    {
      year: 1930,
      championName: "Bill Tilden",
    },
    {
      year: 1931,
      championName: "Sidney Wood",
    },
    {
      year: 1932,
      championName: "Ellsworth Vines",
    },
    {
      year: 1933,
      championName: "Jack Crawford",
    },
    {
      year: 1934,
      championName: "Fred Perry",
    },
    {
      year: 1935,
      championName: "Fred Perry",
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
      year: 1946,
      championName: "Yvon Petra",
    },
    {
      year: 1947,
      championName: "Jack Kramer",
    },
    {
      year: 1948,
      championName: "Bob Falkenburg",
    },
    {
      year: 1949,
      championName: "Ted Schroeder",
    },
    {
      year: 1950,
      championName: "Budge Patty",
    },
    {
      year: 1951,
      championName: "Dick Savitt",
    },
    {
      year: 1952,
      championName: "Frank Sedgman",
    },
    {
      year: 1953,
      championName: "Vic Seixas",
    },
    {
      year: 1954,
      championName: "Jaroslav Drobný",
    },
    {
      year: 1955,
      championName: "Tony Trabert",
    },
    {
      year: 1956,
      championName: "Lew Hoad",
    },
    {
      year: 1957,
      championName: "Lew Hoad",
    },
    {
      year: 1958,
      championName: "Ashley Cooper",
    },
    {
      year: 1959,
      championName: "Alex Olmedo",
    },
    {
      year: 1960,
      championName: "Neale Fraser",
    },
    {
      year: 1961,
      championName: "Rod Laver",
    },
    {
      year: 1962,
      championName: "Rod Laver",
    },
    {
      year: 1963,
      championName: "Chuck McKinley",
    },
    {
      year: 1964,
      championName: "Roy Emerson",
    },
    {
      year: 1965,
      championName: "Roy Emerson",
    },
    {
      year: 1966,
      championName: "Manuel Santana",
    },
    {
      year: 1967,
      championName: "John Newcombe",
    },
    {
      year: 1968,
      championName: "Rod Laver",
      runnerUpName: "Tony Roche",
    },
    {
      year: 1969,
      championName: "Rod Laver",
      runnerUpName: "John Newcombe",
    },
    {
      year: 1970,
      championName: "John Newcombe",
      runnerUpName: "Ken Rosewall",
    },
    {
      year: 1971,
      championName: "John Newcombe",
      runnerUpName: "Stan Smith",
    },
    {
      year: 1972,
      championName: "Stan Smith",
      runnerUpName: "Ilie Năstase",
    },
    {
      year: 1973,
      championName: "Jan Kodeš",
      runnerUpName: "Alex Metreveli",
    },
    {
      year: 1974,
      championName: "Jimmy Connors",
      runnerUpName: "Ken Rosewall",
    },
    {
      year: 1975,
      championName: "Arthur Ashe",
      runnerUpName: "Jimmy Connors",
    },
    {
      year: 1976,
      championName: "Björn Borg",
      runnerUpName: "Ilie Năstase",
    },
    {
      year: 1977,
      championName: "Björn Borg",
      runnerUpName: "Jimmy Connors",
    },
    {
      year: 1978,
      championName: "Björn Borg",
      runnerUpName: "Jimmy Connors",
    },
    {
      year: 1979,
      championName: "Björn Borg",
      runnerUpName: "Roscoe Tanner",
    },
    {
      year: 1980,
      championName: "Björn Borg",
      runnerUpName: "John McEnroe",
    },
    {
      year: 1981,
      championName: "John McEnroe",
      runnerUpName: "Björn Borg",
    },
    {
      year: 1982,
      championName: "Jimmy Connors",
      runnerUpName: "John McEnroe",
    },
    {
      year: 1983,
      championName: "John McEnroe",
      runnerUpName: "Chris Lewis",
    },
    {
      year: 1984,
      championName: "John McEnroe",
      runnerUpName: "Jimmy Connors",
    },
    {
      year: 1985,
      championName: "Boris Becker",
      runnerUpName: "Kevin Curren",
    },
    {
      year: 1986,
      championName: "Boris Becker",
      runnerUpName: "Ivan Lendl",
    },
    {
      year: 1987,
      championName: "Pat Cash",
      runnerUpName: "Ivan Lendl",
    },
    {
      year: 1988,
      championName: "Stefan Edberg",
      runnerUpName: "Boris Becker",
    },
    {
      year: 1989,
      championName: "Boris Becker",
      runnerUpName: "Stefan Edberg",
    },
    {
      year: 1990,
      championName: "Stefan Edberg",
      runnerUpName: "Boris Becker",
    },
    {
      year: 1991,
      championName: "Michael Stich",
      runnerUpName: "Boris Becker",
    },
    {
      year: 1992,
      championName: "Andre Agassi",
      runnerUpName: "Goran Ivanišević",
    },
    {
      year: 1993,
      championName: "Pete Sampras",
      runnerUpName: "Jim Courier",
    },
    {
      year: 1994,
      championName: "Pete Sampras",
      runnerUpName: "Goran Ivanišević",
    },
    {
      year: 1995,
      championName: "Pete Sampras",
      runnerUpName: "Boris Becker",
    },
    {
      year: 1996,
      championName: "Richard Krajicek",
      runnerUpName: "MaliVai Washington",
    },
    {
      year: 1997,
      championName: "Pete Sampras",
      runnerUpName: "Cédric Pioline",
    },
    {
      year: 1998,
      championName: "Pete Sampras",
      runnerUpName: "Goran Ivanišević",
    },
    {
      year: 1999,
      championName: "Pete Sampras",
      runnerUpName: "Andre Agassi",
    },
    {
      year: 2000,
      championName: "Pete Sampras",
      runnerUpName: "Patrick Rafter",
    },
    {
      year: 2001,
      championName: "Goran Ivanišević",
      runnerUpName: "Patrick Rafter",
    },
    {
      year: 2002,
      championName: "Lleyton Hewitt",
      runnerUpName: "David Nalbandian",
    },
    {
      year: 2003,
      championName: "Roger Federer",
      runnerUpName: "Mark Philippoussis",
      championPlayer: player("roger-federer", "federer"),
    },
    {
      year: 2004,
      championName: "Roger Federer",
      runnerUpName: "Andy Roddick",
      championPlayer: player("roger-federer", "federer"),
    },
    {
      year: 2005,
      championName: "Roger Federer",
      runnerUpName: "Andy Roddick",
      championPlayer: player("roger-federer", "federer"),
    },
    {
      year: 2006,
      championName: "Roger Federer",
      runnerUpName: "Rafael Nadal",
      championPlayer: player("roger-federer", "federer"),
      runnerUpPlayer: player("rafael-nadal", "nadal"),
    },
    {
      year: 2007,
      championName: "Roger Federer",
      runnerUpName: "Rafael Nadal",
      championPlayer: player("roger-federer", "federer"),
      runnerUpPlayer: player("rafael-nadal", "nadal"),
    },
    {
      year: 2008,
      championName: "Rafael Nadal",
      runnerUpName: "Roger Federer",
      championPlayer: player("rafael-nadal", "nadal"),
      runnerUpPlayer: player("roger-federer", "federer"),
    },
    {
      year: 2009,
      championName: "Roger Federer",
      runnerUpName: "Andy Roddick",
      championPlayer: player("roger-federer", "federer"),
    },
    {
      year: 2010,
      championName: "Rafael Nadal",
      runnerUpName: "Tomáš Berdych",
      championPlayer: player("rafael-nadal", "nadal"),
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
      championName: "Roger Federer",
      runnerUpName: "Andy Murray",
      championPlayer: player("roger-federer", "federer"),
    },
    {
      year: 2013,
      championName: "Andy Murray",
      runnerUpName: "Novak Djokovic",
      runnerUpPlayer: player("novak-djokovic", "djokovic"),
    },
    {
      year: 2014,
      championName: "Novak Djokovic",
      runnerUpName: "Roger Federer",
      championPlayer: player("novak-djokovic", "djokovic"),
      runnerUpPlayer: player("roger-federer", "federer"),
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
      championName: "Andy Murray",
      runnerUpName: "Milos Raonic",
    },
    {
      year: 2017,
      championName: "Roger Federer",
      runnerUpName: "Marin Čilić",
      championPlayer: player("roger-federer", "federer"),
    },
    {
      year: 2018,
      championName: "Novak Djokovic",
      runnerUpName: "Kevin Anderson",
      championPlayer: player("novak-djokovic", "djokovic"),
    },
    {
      year: 2019,
      championName: "Novak Djokovic",
      runnerUpName: "Roger Federer",
      championPlayer: player("novak-djokovic", "djokovic"),
      runnerUpPlayer: player("roger-federer", "federer"),
    },
    { year: 2020, cancelled: true },
    {
      year: 2021,
      championName: "Novak Djokovic",
      runnerUpName: "Matteo Berrettini",
      championPlayer: player("novak-djokovic", "djokovic"),
    },
    {
      year: 2022,
      championName: "Novak Djokovic",
      runnerUpName: "Nick Kyrgios",
      championPlayer: player("novak-djokovic", "djokovic"),
    },
    {
      year: 2023,
      championName: "Carlos Alcaraz",
      runnerUpName: "Novak Djokovic",
      championPlayer: player("carlos-alcaraz", "alcaraz"),
      runnerUpPlayer: player("novak-djokovic", "djokovic"),
    },
    {
      year: 2024,
      championName: "Carlos Alcaraz",
      runnerUpName: "Novak Djokovic",
      championPlayer: player("carlos-alcaraz", "alcaraz"),
      runnerUpPlayer: player("novak-djokovic", "djokovic"),
    },
    {
      year: 2025,
      championName: "Jannik Sinner",
      runnerUpName: "Carlos Alcaraz",
      championPlayer: player("jannik-sinner", "sinner"),
      runnerUpPlayer: player("carlos-alcaraz", "alcaraz"),
    },
    {
      year: 2026,
      championName: "Jannik Sinner",
      runnerUpName: "Alexander Zverev",
      championPlayer: player("jannik-sinner", "sinner"),
    },
  ],
} satisfies TournamentHistoryDataset;

export default dataset;