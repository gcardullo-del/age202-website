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
  tournamentSlug: "roland-garros",

  tournament: {
    name: "Roland Garros",
    shortName: "Roland Garros",
    category: "GRAND_SLAM",
    surface: "CLAY",
    city: "Paris",
    country: "France",
    countryCode: "FRA",
    venue: "Stade Roland-Garros",
    foundedYear: 1891,
    description: "Roland Garros is the clay-court Grand Slam of Paris, a championship defined by red clay, long-form point construction and one of the deepest historical identities in tennis.",
    history: "First contested in 1891 as the French Championships, the event opened to international competitors in 1925 and moved to Stade Roland-Garros in 1928. In 1968 it became the first Grand Slam tournament of the Open Era. The Paris clay has rewarded endurance, movement and tactical patience, while Rafael Nadal's fourteen men's singles titles created one of the most extraordinary records in major-championship history.",
    active: true,
    featured: true,
    metaTitle: "Roland Garros Archive | Champions, Finals & History | AGE202",
    metaDescription: "Explore the AGE202 Roland Garros archive: champions, finals, historic editions, milestones, iconic moments and legends from Paris.",
  },

  milestones: [
    {
      year: 1891,
      title: "The beginning",
      subtitle: "French Championships",
      description: "The first French men's championship establishes the tournament that will become Roland Garros.",
      featured: true,
      sortOrder: 10,
    },
    {
      year: 1925,
      title: "International expansion",
      subtitle: "A Grand Slam identity emerges",
      description: "The championship opens to international amateur competitors and enters its major-championship era.",
      featured: false,
      sortOrder: 20,
    },
    {
      year: 1928,
      title: "Stade Roland-Garros",
      subtitle: "Paris finds its permanent stage",
      description: "The tournament moves to the new stadium at Porte d'Auteuil, the home that defines its modern identity.",
      featured: true,
      sortOrder: 30,
    },
    {
      year: 1968,
      title: "The first Open",
      subtitle: "Open Era begins in Paris",
      description: "Roland Garros becomes the first Grand Slam tournament of the Open Era.",
      featured: true,
      sortOrder: 40,
    },
    {
      year: 2005,
      title: "Nadal arrives",
      subtitle: "A new clay dynasty",
      description: "Rafael Nadal wins his first Roland Garros title and begins an unprecedented reign in Paris.",
      featured: true,
      sortOrder: 50,
    },
    {
      year: 2026,
      title: "A new champion",
      subtitle: "Zverev breaks through",
      description: "Alexander Zverev wins the 2026 men's singles title and his first Grand Slam championship.",
      featured: false,
      sortOrder: 60,
    }
  ],

  chapters: [
    {
      eyebrow: "Origins",
      title: "From French Championships to Roland Garros",
      subtitle: "The roots of the Paris major",
      yearLabel: "1891–1928",
      description: "The championship evolved from a French national event into an international major before settling at Stade Roland-Garros.",
      featured: true,
      sortOrder: 10,
    },
    {
      eyebrow: "Surface",
      title: "The red-clay examination",
      subtitle: "Movement, patience and endurance",
      description: "Roland Garros developed a sporting identity unlike any other major, with clay rewarding physical resilience, point construction and tactical depth.",
      featured: false,
      sortOrder: 20,
    },
    {
      eyebrow: "Open Era",
      title: "Paris opens the gates",
      subtitle: "Professionals and amateurs together",
      yearLabel: "1968",
      description: "The 1968 championship helped launch the modern era of Grand Slam tennis by welcoming professional players.",
      featured: true,
      sortOrder: 30,
    },
    {
      eyebrow: "Dynasty",
      title: "The Nadal era",
      subtitle: "Fourteen titles on one stage",
      yearLabel: "2005–2022",
      description: "Rafael Nadal's record-setting run transformed the modern history of Roland Garros and set a benchmark unmatched at any men's major.",
      featured: true,
      sortOrder: 40,
    },
    {
      eyebrow: "Modern era",
      title: "A new generation in Paris",
      subtitle: "The clay major keeps evolving",
      description: "Djokovic, Alcaraz, Zverev and the new generation continue to add chapters to one of tennis's most demanding championships.",
      featured: false,
      sortOrder: 50,
    }
  ],

  iconicMoments: [
    {
      year: 1968,
      title: "The first Open Era major",
      subtitle: "Ken Rosewall wins in Paris",
      description: "Roland Garros stages the first Grand Slam tournament of the Open Era.",
      featured: true,
      sortOrder: 10,
    },
    {
      year: 1983,
      title: "Noah triumphs at home",
      subtitle: "A French champion in Paris",
      description: "Yannick Noah becomes the first French men's singles champion at Roland Garros since 1946.",
      featured: false,
      sortOrder: 20,
    },
    {
      year: 2009,
      title: "Federer completes the career Grand Slam",
      subtitle: "A missing major secured",
      description: "Roger Federer defeats Robin Söderling to win his first Roland Garros title.",
      featured: true,
      sortOrder: 30,
    },
    {
      year: 2022,
      title: "Nadal reaches fourteen",
      subtitle: "An unmatched major record",
      description: "Rafael Nadal wins a record-extending fourteenth Roland Garros men's singles title.",
      featured: true,
      sortOrder: 40,
    },
    {
      year: 2023,
      title: "Djokovic wins his third",
      subtitle: "History on Court Philippe-Chatrier",
      description: "Novak Djokovic wins Roland Garros for a third time.",
      featured: false,
      sortOrder: 50,
    },
    {
      year: 2025,
      title: "Alcaraz survives an epic",
      subtitle: "A five-set Paris classic",
      description: "Carlos Alcaraz defeats Jannik Sinner in a dramatic five-set final.",
      featured: true,
      sortOrder: 60,
    },
    {
      year: 2026,
      title: "Zverev breaks through",
      subtitle: "A maiden major in Paris",
      description: "Alexander Zverev defeats Flavio Cobolli to claim his first Grand Slam title.",
      featured: true,
      sortOrder: 70,
    }
  ],

  legends: [
    {
      player: player("rafael-nadal", "nadal"),
      name: "Rafael Nadal",
      country: "Spain",
      countryCode: "ESP",
      recordLabel: "14 Roland Garros titles",
      legend: true,
      featured: true,
      sortOrder: 10,
    },
    {
      player: player("novak-djokovic", "djokovic"),
      name: "Novak Djokovic",
      country: "Serbia",
      countryCode: "SRB",
      recordLabel: "3 Roland Garros titles",
      legend: true,
      featured: true,
      sortOrder: 20,
    },
    {
      player: player("roger-federer", "federer"),
      name: "Roger Federer",
      country: "Switzerland",
      countryCode: "SUI",
      recordLabel: "Roland Garros champion",
      legend: true,
      featured: true,
      sortOrder: 30,
    },
    {
      player: player("carlos-alcaraz", "alcaraz"),
      name: "Carlos Alcaraz",
      country: "Spain",
      countryCode: "ESP",
      recordLabel: "2 Roland Garros titles",
      legend: true,
      featured: true,
      sortOrder: 40,
    },
  ],

  editions: [
    {
      year: 1891,
      championName: "H. Briggs",
    },
    {
      year: 1892,
      championName: "Jean Schopfer",
    },
    {
      year: 1893,
      championName: "Laurent Riboulet",
    },
    {
      year: 1894,
      championName: "André Vacherot",
    },
    {
      year: 1895,
      championName: "André Vacherot",
    },
    {
      year: 1896,
      championName: "André Vacherot",
    },
    {
      year: 1897,
      championName: "Paul Aymé",
    },
    {
      year: 1898,
      championName: "Paul Aymé",
    },
    {
      year: 1899,
      championName: "Paul Aymé",
    },
    {
      year: 1900,
      championName: "Paul Aymé",
    },
    {
      year: 1901,
      championName: "André Vacherot",
    },
    {
      year: 1902,
      championName: "Marcel Vacherot",
    },
    {
      year: 1903,
      championName: "Max Decugis",
    },
    {
      year: 1904,
      championName: "Max Decugis",
    },
    {
      year: 1905,
      championName: "Maurice Germot",
    },
    {
      year: 1906,
      championName: "Maurice Germot",
    },
    {
      year: 1907,
      championName: "Max Decugis",
    },
    {
      year: 1908,
      championName: "Max Decugis",
    },
    {
      year: 1909,
      championName: "Max Decugis",
    },
    {
      year: 1910,
      championName: "Maurice Germot",
    },
    {
      year: 1911,
      championName: "André Gobert",
    },
    {
      year: 1912,
      championName: "Max Decugis",
    },
    {
      year: 1913,
      championName: "Max Decugis",
    },
    {
      year: 1914,
      championName: "Max Decugis",
    },
    {
      year: 1920,
      championName: "André Gobert",
    },
    {
      year: 1921,
      championName: "Jean Samazeuilh",
    },
    {
      year: 1922,
      championName: "Henri Cochet",
    },
    {
      year: 1923,
      championName: "François Blanchy",
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
      championName: "Henri Cochet",
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
      championName: "René Lacoste",
    },
    {
      year: 1930,
      championName: "Henri Cochet",
    },
    {
      year: 1931,
      championName: "Jean Borotra",
    },
    {
      year: 1932,
      championName: "Henri Cochet",
    },
    {
      year: 1933,
      championName: "Jack Crawford",
    },
    {
      year: 1934,
      championName: "Gottfried von Cramm",
    },
    {
      year: 1935,
      championName: "Fred Perry",
    },
    {
      year: 1936,
      championName: "Gottfried von Cramm",
    },
    {
      year: 1937,
      championName: "Henner Henkel",
    },
    {
      year: 1938,
      championName: "Don Budge",
    },
    {
      year: 1939,
      championName: "Don McNeill",
    },
    {
      year: 1946,
      championName: "Marcel Bernard",
    },
    {
      year: 1947,
      championName: "József Asbóth",
    },
    {
      year: 1948,
      championName: "Frank Parker",
    },
    {
      year: 1949,
      championName: "Frank Parker",
    },
    {
      year: 1950,
      championName: "Budge Patty",
    },
    {
      year: 1951,
      championName: "Jaroslav Drobný",
    },
    {
      year: 1952,
      championName: "Jaroslav Drobný",
    },
    {
      year: 1953,
      championName: "Ken Rosewall",
    },
    {
      year: 1954,
      championName: "Tony Trabert",
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
      championName: "Sven Davidson",
    },
    {
      year: 1958,
      championName: "Mervyn Rose",
    },
    {
      year: 1959,
      championName: "Nicola Pietrangeli",
    },
    {
      year: 1960,
      championName: "Nicola Pietrangeli",
    },
    {
      year: 1961,
      championName: "Manuel Santana",
    },
    {
      year: 1962,
      championName: "Rod Laver",
    },
    {
      year: 1963,
      championName: "Roy Emerson",
    },
    {
      year: 1964,
      championName: "Manuel Santana",
    },
    {
      year: 1965,
      championName: "Fred Stolle",
    },
    {
      year: 1966,
      championName: "Tony Roche",
    },
    {
      year: 1967,
      championName: "Roy Emerson",
    },
    {
      year: 1968,
      championName: "Ken Rosewall",
      runnerUpName: "Rod Laver",
    },
    {
      year: 1969,
      championName: "Rod Laver",
      runnerUpName: "Ken Rosewall",
    },
    {
      year: 1970,
      championName: "Jan Kodeš",
      runnerUpName: "Željko Franulović",
    },
    {
      year: 1971,
      championName: "Jan Kodeš",
      runnerUpName: "Ilie Năstase",
    },
    {
      year: 1972,
      championName: "Andrés Gimeno",
      runnerUpName: "Patrick Proisy",
    },
    {
      year: 1973,
      championName: "Ilie Năstase",
      runnerUpName: "Nikola Pilić",
    },
    {
      year: 1974,
      championName: "Björn Borg",
      runnerUpName: "Manuel Orantes",
    },
    {
      year: 1975,
      championName: "Björn Borg",
      runnerUpName: "Guillermo Vilas",
    },
    {
      year: 1976,
      championName: "Adriano Panatta",
      runnerUpName: "Harold Solomon",
    },
    {
      year: 1977,
      championName: "Guillermo Vilas",
      runnerUpName: "Brian Gottfried",
    },
    {
      year: 1978,
      championName: "Björn Borg",
      runnerUpName: "Guillermo Vilas",
    },
    {
      year: 1979,
      championName: "Björn Borg",
      runnerUpName: "Víctor Pecci",
    },
    {
      year: 1980,
      championName: "Björn Borg",
      runnerUpName: "Vitas Gerulaitis",
    },
    {
      year: 1981,
      championName: "Björn Borg",
      runnerUpName: "Ivan Lendl",
    },
    {
      year: 1982,
      championName: "Mats Wilander",
      runnerUpName: "Guillermo Vilas",
    },
    {
      year: 1983,
      championName: "Yannick Noah",
      runnerUpName: "Mats Wilander",
    },
    {
      year: 1984,
      championName: "Ivan Lendl",
      runnerUpName: "John McEnroe",
    },
    {
      year: 1985,
      championName: "Mats Wilander",
      runnerUpName: "Ivan Lendl",
    },
    {
      year: 1986,
      championName: "Ivan Lendl",
      runnerUpName: "Mikael Pernfors",
    },
    {
      year: 1987,
      championName: "Ivan Lendl",
      runnerUpName: "Mats Wilander",
    },
    {
      year: 1988,
      championName: "Mats Wilander",
      runnerUpName: "Henri Leconte",
    },
    {
      year: 1989,
      championName: "Michael Chang",
      runnerUpName: "Stefan Edberg",
    },
    {
      year: 1990,
      championName: "Andrés Gómez",
      runnerUpName: "Andre Agassi",
    },
    {
      year: 1991,
      championName: "Jim Courier",
      runnerUpName: "Andre Agassi",
    },
    {
      year: 1992,
      championName: "Jim Courier",
      runnerUpName: "Petr Korda",
    },
    {
      year: 1993,
      championName: "Sergi Bruguera",
      runnerUpName: "Jim Courier",
    },
    {
      year: 1994,
      championName: "Sergi Bruguera",
      runnerUpName: "Alberto Berasategui",
    },
    {
      year: 1995,
      championName: "Thomas Muster",
      runnerUpName: "Michael Chang",
    },
    {
      year: 1996,
      championName: "Yevgeny Kafelnikov",
      runnerUpName: "Michael Stich",
    },
    {
      year: 1997,
      championName: "Gustavo Kuerten",
      runnerUpName: "Sergi Bruguera",
    },
    {
      year: 1998,
      championName: "Carlos Moyá",
      runnerUpName: "Àlex Corretja",
    },
    {
      year: 1999,
      championName: "Andre Agassi",
      runnerUpName: "Andrei Medvedev",
    },
    {
      year: 2000,
      championName: "Gustavo Kuerten",
      runnerUpName: "Magnus Norman",
    },
    {
      year: 2001,
      championName: "Gustavo Kuerten",
      runnerUpName: "Àlex Corretja",
    },
    {
      year: 2002,
      championName: "Albert Costa",
      runnerUpName: "Juan Carlos Ferrero",
    },
    {
      year: 2003,
      championName: "Juan Carlos Ferrero",
      runnerUpName: "Martin Verkerk",
    },
    {
      year: 2004,
      championName: "Gastón Gaudio",
      runnerUpName: "Guillermo Coria",
    },
    {
      year: 2005,
      championName: "Rafael Nadal",
      runnerUpName: "Mariano Puerta",
      championPlayer: player("rafael-nadal", "nadal"),
    },
    {
      year: 2006,
      championName: "Rafael Nadal",
      runnerUpName: "Roger Federer",
      championPlayer: player("rafael-nadal", "nadal"),
      runnerUpPlayer: player("roger-federer", "federer"),
    },
    {
      year: 2007,
      championName: "Rafael Nadal",
      runnerUpName: "Roger Federer",
      championPlayer: player("rafael-nadal", "nadal"),
      runnerUpPlayer: player("roger-federer", "federer"),
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
      runnerUpName: "Robin Söderling",
      championPlayer: player("roger-federer", "federer"),
    },
    {
      year: 2010,
      championName: "Rafael Nadal",
      runnerUpName: "Robin Söderling",
      championPlayer: player("rafael-nadal", "nadal"),
    },
    {
      year: 2011,
      championName: "Rafael Nadal",
      runnerUpName: "Roger Federer",
      championPlayer: player("rafael-nadal", "nadal"),
      runnerUpPlayer: player("roger-federer", "federer"),
    },
    {
      year: 2012,
      championName: "Rafael Nadal",
      runnerUpName: "Novak Djokovic",
      championPlayer: player("rafael-nadal", "nadal"),
      runnerUpPlayer: player("novak-djokovic", "djokovic"),
    },
    {
      year: 2013,
      championName: "Rafael Nadal",
      runnerUpName: "David Ferrer",
      championPlayer: player("rafael-nadal", "nadal"),
    },
    {
      year: 2014,
      championName: "Rafael Nadal",
      runnerUpName: "Novak Djokovic",
      championPlayer: player("rafael-nadal", "nadal"),
      runnerUpPlayer: player("novak-djokovic", "djokovic"),
    },
    {
      year: 2015,
      championName: "Stan Wawrinka",
      runnerUpName: "Novak Djokovic",
      runnerUpPlayer: player("novak-djokovic", "djokovic"),
    },
    {
      year: 2016,
      championName: "Novak Djokovic",
      runnerUpName: "Andy Murray",
      championPlayer: player("novak-djokovic", "djokovic"),
    },
    {
      year: 2017,
      championName: "Rafael Nadal",
      runnerUpName: "Stan Wawrinka",
      championPlayer: player("rafael-nadal", "nadal"),
    },
    {
      year: 2018,
      championName: "Rafael Nadal",
      runnerUpName: "Dominic Thiem",
      championPlayer: player("rafael-nadal", "nadal"),
    },
    {
      year: 2019,
      championName: "Rafael Nadal",
      runnerUpName: "Dominic Thiem",
      championPlayer: player("rafael-nadal", "nadal"),
    },
    {
      year: 2020,
      championName: "Rafael Nadal",
      runnerUpName: "Novak Djokovic",
      championPlayer: player("rafael-nadal", "nadal"),
      runnerUpPlayer: player("novak-djokovic", "djokovic"),
    },
    {
      year: 2021,
      championName: "Novak Djokovic",
      runnerUpName: "Stefanos Tsitsipas",
      championPlayer: player("novak-djokovic", "djokovic"),
    },
    {
      year: 2022,
      championName: "Rafael Nadal",
      runnerUpName: "Casper Ruud",
      championPlayer: player("rafael-nadal", "nadal"),
    },
    {
      year: 2023,
      championName: "Novak Djokovic",
      runnerUpName: "Casper Ruud",
      championPlayer: player("novak-djokovic", "djokovic"),
    },
    {
      year: 2024,
      championName: "Carlos Alcaraz",
      runnerUpName: "Alexander Zverev",
      championPlayer: player("carlos-alcaraz", "alcaraz"),
    },
    {
      year: 2025,
      championName: "Carlos Alcaraz",
      runnerUpName: "Jannik Sinner",
      championPlayer: player("carlos-alcaraz", "alcaraz"),
      runnerUpPlayer: player("jannik-sinner", "sinner"),
    },
    {
      year: 2026,
      championName: "Alexander Zverev",
      runnerUpName: "Flavio Cobolli",
    },
  ],
} satisfies TournamentHistoryDataset;

export default dataset;