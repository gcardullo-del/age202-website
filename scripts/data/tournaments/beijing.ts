import type {
  TournamentHistoryDataset,
  TournamentHistoryPlayerRef,
} from "../../tournament-history/types";

const player = (...slugCandidates: string[]): TournamentHistoryPlayerRef => ({
  slugCandidates,
});

const dataset = {
  tournamentSlug: "beijing",

  tournament: {
    name: "China Open",
    shortName: "Beijing",
    category: "ATP_500",
    surface: "HARD",
    city: "Beijing",
    country: "China",
    countryCode: "CHN",
    venue: "National Tennis Center",
    foundedYear: 2004,
    description:
      "Beijing is one of the flagship ATP 500 tournaments in Asia, bringing elite hard-court tennis to the Chinese capital at the National Tennis Center.",
    history:
      "The modern ATP China Open began in Beijing in 2004. Marat Safin became its inaugural champion before Rafael Nadal, Andy Roddick and other leading players added their names to the trophy. Novak Djokovic then created the tournament's defining dynasty, winning six titles and compiling a perfect 29-0 record in Beijing. After Andy Murray, Nadal, Nikoloz Basilashvili and Dominic Thiem won the final editions before a multi-year interruption, the tournament returned in 2023. Jannik Sinner won on the comeback and again in 2025, with Carlos Alcaraz taking the 2024 crown.",
    active: true,
    metaTitle:
      "Beijing ATP 500 | History, Legends & Recent Finals | AGE202",
    metaDescription:
      "Explore the China Open in Beijing: tournament history, iconic moments, legends and the five most recent completed ATP 500 finals.",
  },

  iconicMoments: [
    {
      year: 2004,
      title: "The modern China Open begins",
      subtitle: "Safin becomes Beijing's first ATP champion",
      description:
        "Marat Safin wins the inaugural modern ATP edition without dropping a set, beginning a new championship tradition in the Chinese capital.",
      sortOrder: 10,
    },
    {
      year: 2009,
      title: "The Djokovic dynasty begins",
      subtitle: "The first of six Beijing titles",
      description:
        "Novak Djokovic defeats Marin Cilic to win Beijing for the first time and launches the most dominant championship run in tournament history.",
      featured: true,
      sortOrder: 20,
    },
    {
      year: 2015,
      title: "Djokovic reaches six",
      subtitle: "A perfect 29-0 Beijing record",
      description:
        "Djokovic captures his sixth China Open crown, extending an unbeaten tournament record that remains unmatched.",
      featured: true,
      sortOrder: 30,
    },
    {
      year: 2023,
      title: "Sinner's breakthrough in Beijing",
      subtitle: "A first victory over Medvedev",
      description:
        "Jannik Sinner defeats Carlos Alcaraz and then Daniil Medvedev to win the title, earning his first career victory over Medvedev in the final.",
      featured: true,
      sortOrder: 40,
    },
    {
      year: 2024,
      title: "Alcaraz wins an instant classic",
      subtitle: "A deciding tie-break against Sinner",
      description:
        "Carlos Alcaraz defeats defending champion Jannik Sinner 6-7(6), 6-4, 7-6(3) in a memorable championship match.",
      featured: true,
      sortOrder: 50,
    },
  ],

  legends: [
    {
      player: player("novak-djokovic", "djokovic"),
      name: "Novak Djokovic",
      country: "Serbia",
      countryCode: "SRB",
      recordLabel: "Record six-time champion · 29-0",
      quote:
        "Djokovic won Beijing six times between 2009 and 2015 and never lost a singles match at the tournament.",
      legend: true,
      featured: true,
      sortOrder: 10,
    },
    {
      player: player("rafael-nadal", "nadal"),
      name: "Rafael Nadal",
      country: "Spain",
      countryCode: "ESP",
      recordLabel: "Two-time champion",
      quote:
        "Nadal won Beijing on his tournament debut in 2005 and returned twelve years later to capture a second title in 2017.",
      legend: true,
      featured: true,
      sortOrder: 20,
    },
    {
      player: player("jannik-sinner", "sinner"),
      name: "Jannik Sinner",
      country: "Italy",
      countryCode: "ITA",
      recordLabel: "Two-time champion",
      quote:
        "Sinner won Beijing in 2023 and 2025, joining Djokovic and Nadal as the only multiple champions of the modern ATP event.",
      legend: true,
      featured: true,
      sortOrder: 30,
    },
    {
      player: player("carlos-alcaraz", "alcaraz"),
      name: "Carlos Alcaraz",
      country: "Spain",
      countryCode: "ESP",
      recordLabel: "2024 champion",
      quote:
        "Alcaraz won the 2024 title by defeating Jannik Sinner in a three-set final decided by a championship tie-break.",
      legend: true,
      featured: true,
      sortOrder: 40,
    },
    {
      player: player("andy-murray", "murray"),
      name: "Andy Murray",
      country: "Great Britain",
      countryCode: "GBR",
      recordLabel: "2016 champion",
      quote:
        "Murray captured the 2016 Beijing title during his extraordinary run toward the year-end World No. 1 ranking.",
      legend: true,
      featured: false,
      sortOrder: 50,
    },
    {
      name: "Marat Safin",
      country: "Russia",
      countryCode: "RUS",
      recordLabel: "Inaugural 2004 champion",
      quote:
        "Safin became the first champion of the modern ATP China Open in 2004, winning the tournament without dropping a set.",
      legend: true,
      featured: false,
      sortOrder: 60,
    },
  ],

  editions: [
    { year: 2004, championName: "Marat Safin", championCountryCode: "RUS" },
    {
      year: 2005,
      championName: "Rafael Nadal",
      championCountryCode: "ESP",
      championPlayer: player("rafael-nadal", "nadal"),
    },
    { year: 2006, championName: "Marcos Baghdatis", championCountryCode: "CYP" },
    { year: 2007, championName: "Fernando Gonzalez", championCountryCode: "CHI" },
    { year: 2008, championName: "Andy Roddick", championCountryCode: "USA" },
    {
      year: 2009,
      championName: "Novak Djokovic",
      championCountryCode: "SRB",
      championPlayer: player("novak-djokovic", "djokovic"),
    },
    {
      year: 2010,
      championName: "Novak Djokovic",
      championCountryCode: "SRB",
      championPlayer: player("novak-djokovic", "djokovic"),
    },
    { year: 2011, championName: "Tomas Berdych", championCountryCode: "CZE" },
    {
      year: 2012,
      championName: "Novak Djokovic",
      championCountryCode: "SRB",
      championPlayer: player("novak-djokovic", "djokovic"),
    },
    {
      year: 2013,
      championName: "Novak Djokovic",
      championCountryCode: "SRB",
      championPlayer: player("novak-djokovic", "djokovic"),
    },
    {
      year: 2014,
      championName: "Novak Djokovic",
      championCountryCode: "SRB",
      championPlayer: player("novak-djokovic", "djokovic"),
    },
    {
      year: 2015,
      championName: "Novak Djokovic",
      championCountryCode: "SRB",
      championPlayer: player("novak-djokovic", "djokovic"),
    },
    {
      year: 2016,
      championName: "Andy Murray",
      championCountryCode: "GBR",
      championPlayer: player("andy-murray", "murray"),
    },
    {
      year: 2017,
      championName: "Rafael Nadal",
      championCountryCode: "ESP",
      championPlayer: player("rafael-nadal", "nadal"),
    },
    { year: 2018, championName: "Nikoloz Basilashvili", championCountryCode: "GEO" },
    {
      year: 2019,
      championName: "Dominic Thiem",
      runnerUpName: "Stefanos Tsitsipas",
      championCountryCode: "AUT",
      runnerUpCountryCode: "GRE",
      score: "3-6, 6-4, 6-1",
    },
    { year: 2020, cancelled: true },
    { year: 2021, cancelled: true },
    { year: 2022, cancelled: true },
    {
      year: 2023,
      championName: "Jannik Sinner",
      runnerUpName: "Daniil Medvedev",
      championCountryCode: "ITA",
      runnerUpCountryCode: "RUS",
      championPlayer: player("jannik-sinner", "sinner"),
      runnerUpPlayer: player("daniil-medvedev", "medvedev"),
      score: "7-6(2), 7-6(2)",
    },
    {
      year: 2024,
      championName: "Carlos Alcaraz",
      runnerUpName: "Jannik Sinner",
      championCountryCode: "ESP",
      runnerUpCountryCode: "ITA",
      championPlayer: player("carlos-alcaraz", "alcaraz"),
      runnerUpPlayer: player("jannik-sinner", "sinner"),
      score: "6-7(6), 6-4, 7-6(3)",
    },
    {
      year: 2025,
      championName: "Jannik Sinner",
      runnerUpName: "Learner Tien",
      championCountryCode: "ITA",
      runnerUpCountryCode: "USA",
      championPlayer: player("jannik-sinner", "sinner"),
      score: "6-2, 6-2",
    },
  ],
} satisfies TournamentHistoryDataset;

export default dataset;