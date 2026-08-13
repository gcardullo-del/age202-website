import type {
  TournamentHistoryDataset,
  TournamentHistoryPlayerRef,
} from "../../tournament-history/types";

const player = (...slugCandidates: string[]): TournamentHistoryPlayerRef => ({
  slugCandidates,
});

const dataset = {
  tournamentSlug: "vienna",

  tournament: {
    name: "Erste Bank Open",
    shortName: "Vienna",
    category: "ATP_500",
    surface: "HARD",
    city: "Vienna",
    country: "Austria",
    countryCode: "AUT",
    venue: "Wiener Stadthalle",
    foundedYear: 1974,
    description:
      "Vienna is one of the great indoor hard-court tournaments of the European autumn, combining a historic city setting with decades of elite championship tennis at the Wiener Stadthalle.",
    history:
      "First staged in 1974, the Vienna tournament has grown into one of the leading indoor events on the ATP Tour. The championship has welcomed generations of major winners, from Ivan Lendl, Andre Agassi and Pete Sampras to Roger Federer, Novak Djokovic and Andy Murray. Austrian champions including Horst Skoff, Jurgen Melzer and Dominic Thiem created memorable home victories. In the modern ATP 500 era, Jannik Sinner has emerged as a defining champion, winning in 2023 and again in 2025.",
    active: true,
    metaTitle:
      "Vienna ATP 500 | History, Legends & Recent Finals | AGE202",
    metaDescription:
      "Explore the Erste Bank Open in Vienna: tournament history, iconic moments, legends and the five most recent completed ATP 500 finals.",
  },

  iconicMoments: [
    {
      year: 1974,
      title: "Vienna's indoor tradition begins",
      subtitle: "The first championship at the Stadthalle",
      description:
        "Vienna launches a tournament that will become one of the defining indoor stops of the European autumn tennis season.",
      sortOrder: 10,
    },
    {
      year: 1988,
      title: "Austrian breakthrough",
      subtitle: "Horst Skoff wins at home",
      description:
        "Horst Skoff becomes the first Austrian singles champion of the modern Vienna tournament, creating one of the event's landmark home victories.",
      featured: true,
      sortOrder: 20,
    },
    {
      year: 2002,
      title: "Federer completes the repeat",
      subtitle: "Back-to-back Vienna titles",
      description:
        "Roger Federer successfully defends his Vienna crown, completing consecutive titles during his rise toward the top of men's tennis.",
      featured: true,
      sortOrder: 30,
    },
    {
      year: 2019,
      title: "Thiem wins at home",
      subtitle: "Austria celebrates its leading star",
      description:
        "Dominic Thiem defeats Diego Schwartzman in three sets to capture his home tournament and add his name to Vienna's Austrian champions.",
      featured: true,
      sortOrder: 40,
    },
    {
      year: 2025,
      title: "Sinner reclaims Vienna",
      subtitle: "A second crown after a three-set battle",
      description:
        "Jannik Sinner rallies past Alexander Zverev 3-6, 6-3, 7-5 to win his second Vienna title and extend his indoor hard-court dominance.",
      featured: true,
      sortOrder: 50,
    },
  ],

  legends: [
    {
      name: "Brian Gottfried",
      country: "United States",
      countryCode: "USA",
      recordLabel: "Four-time champion",
      quote:
        "Gottfried won four Vienna titles during the tournament's formative years and established one of its defining early championship records.",
      legend: true,
      featured: true,
      sortOrder: 10,
    },
    {
      player: player("roger-federer", "federer"),
      name: "Roger Federer",
      country: "Switzerland",
      countryCode: "SUI",
      recordLabel: "Two-time champion",
      quote:
        "Federer won consecutive Vienna titles in 2001 and 2002 during the years that preceded his rise to World No. 1.",
      legend: true,
      featured: true,
      sortOrder: 20,
    },
    {
      player: player("andy-murray", "murray"),
      name: "Andy Murray",
      country: "Great Britain",
      countryCode: "GBR",
      recordLabel: "Two-time champion",
      quote:
        "Murray captured Vienna in 2014 and 2016, with the second title forming part of his extraordinary run to the World No. 1 ranking.",
      legend: true,
      featured: false,
      sortOrder: 30,
    },
    {
      name: "Jurgen Melzer",
      country: "Austria",
      countryCode: "AUT",
      recordLabel: "Back-to-back home champion",
      quote:
        "Melzer won consecutive Vienna titles in 2009 and 2010, producing one of the tournament's greatest home championship runs.",
      legend: true,
      featured: true,
      sortOrder: 40,
    },
    {
      name: "Dominic Thiem",
      country: "Austria",
      countryCode: "AUT",
      recordLabel: "2019 home champion",
      quote:
        "Thiem captured his home title in 2019, defeating Diego Schwartzman in a memorable three-set final.",
      legend: true,
      featured: true,
      sortOrder: 50,
    },
    {
      player: player("jannik-sinner", "sinner"),
      name: "Jannik Sinner",
      country: "Italy",
      countryCode: "ITA",
      recordLabel: "Two-time champion",
      quote:
        "Sinner won Vienna in 2023 and 2025, joining the tournament's select group of multiple modern champions.",
      legend: true,
      featured: true,
      sortOrder: 60,
    },
  ],

  editions: [
    { year: 1974, championName: "Vitas Gerulaitis", championCountryCode: "USA" },
    { year: 1975, championName: "Brian Gottfried", championCountryCode: "USA" },
    { year: 1976, championName: "Wojtek Fibak", championCountryCode: "POL" },
    { year: 1977, championName: "Brian Gottfried", championCountryCode: "USA" },
    { year: 1978, championName: "Stan Smith", championCountryCode: "USA" },
    { year: 1979, championName: "Brian Gottfried", championCountryCode: "USA" },
    { year: 1980, championName: "Brian Gottfried", championCountryCode: "USA" },
    { year: 1981, championName: "Ivan Lendl", championCountryCode: "TCH" },
    { year: 1982, championName: "Brian Teacher", championCountryCode: "USA" },
    { year: 1983, championName: "Johan Kriek", championCountryCode: "USA" },
    { year: 1984, championName: "Tim Wilkison", championCountryCode: "USA" },
    { year: 1985, championName: "Jan Gunnarsson", championCountryCode: "SWE" },
    { year: 1986, championName: "Brad Gilbert", championCountryCode: "USA" },
    { year: 1987, championName: "Jonas Svensson", championCountryCode: "SWE" },
    { year: 1988, championName: "Horst Skoff", championCountryCode: "AUT" },
    { year: 1989, championName: "Paul Annacone", championCountryCode: "USA" },
    { year: 1990, championName: "Anders Jarryd", championCountryCode: "SWE" },
    { year: 1991, championName: "Michael Stich", championCountryCode: "GER" },
    { year: 1992, championName: "Petr Korda", championCountryCode: "TCH" },
    { year: 1993, championName: "Goran Ivanisevic", championCountryCode: "CRO" },
    { year: 1994, championName: "Andre Agassi", championCountryCode: "USA" },
    { year: 1995, championName: "Filip Dewulf", championCountryCode: "BEL" },
    { year: 1996, championName: "Boris Becker", championCountryCode: "GER" },
    { year: 1997, championName: "Goran Ivanisevic", championCountryCode: "CRO" },
    { year: 1998, championName: "Pete Sampras", championCountryCode: "USA" },
    { year: 1999, championName: "Greg Rusedski", championCountryCode: "GBR" },
    { year: 2000, championName: "Tim Henman", championCountryCode: "GBR" },
    {
      year: 2001,
      championName: "Roger Federer",
      championCountryCode: "SUI",
      championPlayer: player("roger-federer", "federer"),
    },
    {
      year: 2002,
      championName: "Roger Federer",
      championCountryCode: "SUI",
      championPlayer: player("roger-federer", "federer"),
    },
    { year: 2003, championName: "Roger Federer", championCountryCode: "SUI", championPlayer: player("roger-federer", "federer") },
    { year: 2004, championName: "Feliciano Lopez", championCountryCode: "ESP" },
    {
      year: 2005,
      championName: "Ivan Ljubicic",
      championCountryCode: "CRO",
    },
    {
      year: 2006,
      championName: "Ivan Ljubicic",
      championCountryCode: "CRO",
    },
    {
      year: 2007,
      championName: "Novak Djokovic",
      championCountryCode: "SRB",
      championPlayer: player("novak-djokovic", "djokovic"),
    },
    { year: 2008, championName: "Philipp Petzschner", championCountryCode: "GER" },
    { year: 2009, championName: "Jurgen Melzer", championCountryCode: "AUT" },
    { year: 2010, championName: "Jurgen Melzer", championCountryCode: "AUT" },
    { year: 2011, championName: "Jo-Wilfried Tsonga", championCountryCode: "FRA" },
    { year: 2012, championName: "Juan Martin del Potro", championCountryCode: "ARG" },
    { year: 2013, championName: "Tommy Haas", championCountryCode: "GER" },
    {
      year: 2014,
      championName: "Andy Murray",
      championCountryCode: "GBR",
      championPlayer: player("andy-murray", "murray"),
    },
    { year: 2015, championName: "David Ferrer", championCountryCode: "ESP" },
    {
      year: 2016,
      championName: "Andy Murray",
      championCountryCode: "GBR",
      championPlayer: player("andy-murray", "murray"),
    },
    { year: 2017, championName: "Lucas Pouille", championCountryCode: "FRA" },
    { year: 2018, championName: "Kevin Anderson", championCountryCode: "RSA" },
    { year: 2019, championName: "Dominic Thiem", championCountryCode: "AUT" },
    {
      year: 2020,
      championName: "Andrey Rublev",
      championCountryCode: "RUS",
      championPlayer: player("andrey-rublev", "rublev"),
    },
    {
      year: 2021,
      championName: "Alexander Zverev",
      runnerUpName: "Frances Tiafoe",
      championCountryCode: "GER",
      runnerUpCountryCode: "USA",
      championPlayer: player("alexander-zverev", "zverev"),
      score: "7-5, 6-4",
    },
    {
      year: 2022,
      championName: "Daniil Medvedev",
      runnerUpName: "Denis Shapovalov",
      championCountryCode: "RUS",
      runnerUpCountryCode: "CAN",
      championPlayer: player("daniil-medvedev", "medvedev"),
      score: "4-6, 6-3, 6-2",
    },
    {
      year: 2023,
      championName: "Jannik Sinner",
      runnerUpName: "Daniil Medvedev",
      championCountryCode: "ITA",
      runnerUpCountryCode: "RUS",
      championPlayer: player("jannik-sinner", "sinner"),
      runnerUpPlayer: player("daniil-medvedev", "medvedev"),
      score: "7-6(7), 4-6, 6-3",
    },
    {
      year: 2024,
      championName: "Jack Draper",
      runnerUpName: "Karen Khachanov",
      championCountryCode: "GBR",
      runnerUpCountryCode: "RUS",
      score: "6-4, 7-5",
    },
    {
      year: 2025,
      championName: "Jannik Sinner",
      runnerUpName: "Alexander Zverev",
      championCountryCode: "ITA",
      runnerUpCountryCode: "GER",
      championPlayer: player("jannik-sinner", "sinner"),
      runnerUpPlayer: player("alexander-zverev", "zverev"),
      score: "3-6, 6-3, 7-5",
    },
  ],
} satisfies TournamentHistoryDataset;

export default dataset;