import type {
  TournamentHistoryDataset,
  TournamentHistoryPlayerRef,
} from "../../tournament-history/types";

const player = (...slugCandidates: string[]): TournamentHistoryPlayerRef => ({
  slugCandidates,
});

const dataset = {
  tournamentSlug: "washington",

  tournament: {
    name: "Mubadala DC Open",
    shortName: "Washington",
    category: "ATP_500",
    surface: "HARD",
    city: "Washington, D.C.",
    country: "United States",
    countryCode: "USA",
    venue: "William H.G. FitzGerald Tennis Center",
    foundedYear: 1969,
    description:
      "Washington is one of the historic pillars of the North American hard-court summer, combining more than five decades of tennis with a distinctive public-park setting in the United States capital.",
    history:
      "Established in 1969 with Arthur Ashe among the driving forces behind its creation, Washington developed into one of the longest-running professional tournaments in the United States. The event moved from its original clay courts to hard courts and became a major stop on the summer swing. Andre Agassi built the tournament's defining singles record with five titles, while champions across later generations have included Andy Roddick, Juan Martin del Potro, Alexander Zverev, Nick Kyrgios, Dan Evans, Sebastian Korda, Alex de Minaur and Taylor Fritz.",
    active: true,
    metaTitle:
      "Washington ATP 500 | History, Legends & Recent Finals | AGE202",
    metaDescription:
      "Explore the Mubadala DC Open in Washington: tournament history, iconic moments, legends and the five most recent ATP 500 finals.",
  },

  iconicMoments: [
    {
      year: 1969,
      title: "A tournament with a purpose",
      subtitle: "Washington joins the professional calendar",
      description:
        "The Washington tournament begins in 1969, with Arthur Ashe among the central figures behind an event created in the United States capital and rooted in a public-park setting.",
      featured: true,
      sortOrder: 10,
    },
    {
      year: 1990,
      title: "Agassi's Washington era begins",
      subtitle: "The first of a record five titles",
      description:
        "Andre Agassi wins Washington for the first time and begins the most successful singles championship record in tournament history.",
      featured: true,
      sortOrder: 20,
    },
    {
      year: 2007,
      title: "Roddick completes a Washington hat-trick",
      subtitle: "A third title for the American star",
      description:
        "Andy Roddick captures his third Washington crown, strengthening his place among the event's most successful modern champions.",
      sortOrder: 30,
    },
    {
      year: 2013,
      title: "Del Potro reaches three",
      subtitle: "An unbeaten championship run",
      description:
        "Juan Martin del Potro wins his third Washington title, completing a perfect three-for-three record in singles finals at the event.",
      featured: true,
      sortOrder: 40,
    },
    {
      year: 2026,
      title: "Fritz wins the capital",
      subtitle: "An all-new championship chapter",
      description:
        "Taylor Fritz defeats 19-year-old Rafael Jodar 7-6(2), 6-4 in a rain-delayed final to capture his first Washington singles title.",
      sortOrder: 50,
    },
  ],

  legends: [
    {
      name: "Andre Agassi",
      country: "United States",
      countryCode: "USA",
      recordLabel: "Record five-time champion",
      quote:
        "Agassi won Washington five times and became the defining singles champion in the tournament's modern history.",
      legend: true,
      featured: true,
      sortOrder: 10,
    },
    {
      name: "Andy Roddick",
      country: "United States",
      countryCode: "USA",
      recordLabel: "Three-time champion",
      quote:
        "Roddick captured Washington in 2001, 2005 and 2007, making the tournament one of the most successful stops of his career.",
      legend: true,
      featured: true,
      sortOrder: 20,
    },
    {
      name: "Juan Martin del Potro",
      country: "Argentina",
      countryCode: "ARG",
      recordLabel: "Three-time champion",
      quote:
        "Del Potro won the title in 2008, 2009 and 2013 and never lost a Washington singles final.",
      legend: true,
      featured: true,
      sortOrder: 30,
    },
    {
      name: "Jimmy Connors",
      country: "United States",
      countryCode: "USA",
      recordLabel: "Three-time champion",
      quote:
        "Connors won Washington three times during the 1970s and became one of the championship's first dominant American stars.",
      legend: true,
      featured: false,
      sortOrder: 40,
    },
    {
      name: "Alexander Zverev",
      country: "Germany",
      countryCode: "GER",
      recordLabel: "Back-to-back champion",
      quote:
        "Zverev won consecutive Washington titles in 2017 and 2018 during his rise into the elite of men's tennis.",
      legend: true,
      featured: false,
      sortOrder: 50,
    },
    {
      name: "Nick Kyrgios",
      country: "Australia",
      countryCode: "AUS",
      recordLabel: "Two-time champion",
      quote:
        "Kyrgios captured Washington in 2019 and 2022, producing two of the most memorable title runs of his career.",
      legend: true,
      featured: false,
      sortOrder: 60,
    },
  ],

  editions: [
    { year: 1969, championName: "Thomaz Koch", championCountryCode: "BRA" },
    { year: 1970, championName: "Cliff Richey", championCountryCode: "USA" },
    { year: 1971, championName: "Ken Rosewall", championCountryCode: "AUS" },
    { year: 1972, championName: "Tony Roche", championCountryCode: "AUS" },
    { year: 1973, championName: "Arthur Ashe", championCountryCode: "USA" },
    { year: 1974, championName: "Harold Solomon", championCountryCode: "USA" },
    { year: 1975, championName: "Guillermo Vilas", championCountryCode: "ARG" },
    { year: 1976, championName: "Jimmy Connors", championCountryCode: "USA" },
    { year: 1977, championName: "Guillermo Vilas", championCountryCode: "ARG" },
    { year: 1978, championName: "Jimmy Connors", championCountryCode: "USA" },
    { year: 1979, championName: "Guillermo Vilas", championCountryCode: "ARG" },
    { year: 1980, championName: "Jimmy Connors", championCountryCode: "USA" },
    { year: 1981, championName: "Jose Luis Clerc", championCountryCode: "ARG" },
    { year: 1982, championName: "Ivan Lendl", championCountryCode: "TCH" },
    { year: 1983, championName: "Jose Luis Clerc", championCountryCode: "ARG" },
    { year: 1984, championName: "Andres Gomez", championCountryCode: "ECU" },
    { year: 1985, championName: "Yannick Noah", championCountryCode: "FRA" },
    { year: 1986, championName: "Karel Novacek", championCountryCode: "TCH" },
    { year: 1987, championName: "Ivan Lendl", championCountryCode: "TCH" },
    { year: 1988, championName: "Jimmy Connors", championCountryCode: "USA" },
    { year: 1989, championName: "Tim Mayotte", championCountryCode: "USA" },
    { year: 1990, championName: "Andre Agassi", championCountryCode: "USA" },
    { year: 1991, championName: "Andre Agassi", championCountryCode: "USA" },
    { year: 1992, championName: "Petr Korda", championCountryCode: "TCH" },
    { year: 1993, championName: "Amos Mansdorf", championCountryCode: "ISR" },
    { year: 1994, championName: "Stefan Edberg", championCountryCode: "SWE" },
    { year: 1995, championName: "Andre Agassi", championCountryCode: "USA" },
    { year: 1996, championName: "Michael Chang", championCountryCode: "USA" },
    { year: 1997, championName: "Michael Chang", championCountryCode: "USA" },
    { year: 1998, championName: "Andre Agassi", championCountryCode: "USA" },
    { year: 1999, championName: "Andre Agassi", championCountryCode: "USA" },
    { year: 2000, championName: "Alex Corretja", championCountryCode: "ESP" },
    { year: 2001, championName: "Andy Roddick", championCountryCode: "USA" },
    { year: 2002, championName: "James Blake", championCountryCode: "USA" },
    { year: 2003, championName: "Tim Henman", championCountryCode: "GBR" },
    { year: 2004, championName: "Lleyton Hewitt", championCountryCode: "AUS" },
    { year: 2005, championName: "Andy Roddick", championCountryCode: "USA" },
    { year: 2006, championName: "Arnaud Clement", championCountryCode: "FRA" },
    { year: 2007, championName: "Andy Roddick", championCountryCode: "USA" },
    { year: 2008, championName: "Juan Martin del Potro", championCountryCode: "ARG" },
    { year: 2009, championName: "Juan Martin del Potro", championCountryCode: "ARG" },
    { year: 2010, championName: "David Nalbandian", championCountryCode: "ARG" },
    { year: 2011, championName: "Radek Stepanek", championCountryCode: "CZE" },
    { year: 2012, championName: "Alexandr Dolgopolov", championCountryCode: "UKR" },
    { year: 2013, championName: "Juan Martin del Potro", championCountryCode: "ARG" },
    { year: 2014, championName: "Milos Raonic", championCountryCode: "CAN" },
    { year: 2015, championName: "Kei Nishikori", championCountryCode: "JPN" },
    { year: 2016, championName: "Gael Monfils", championCountryCode: "FRA" },
    { year: 2017, championName: "Alexander Zverev", championCountryCode: "GER" },
    { year: 2018, championName: "Alexander Zverev", championCountryCode: "GER" },
    { year: 2019, championName: "Nick Kyrgios", championCountryCode: "AUS" },
    { year: 2020, cancelled: true },
    { year: 2021, championName: "Jannik Sinner", championCountryCode: "ITA", championPlayer: player("jannik-sinner", "sinner") },
    {
      year: 2022,
      championName: "Nick Kyrgios",
      runnerUpName: "Yoshihito Nishioka",
      championCountryCode: "AUS",
      runnerUpCountryCode: "JPN",
      score: "6-4, 6-3",
    },
    {
      year: 2023,
      championName: "Daniel Evans",
      runnerUpName: "Tallon Griekspoor",
      championCountryCode: "GBR",
      runnerUpCountryCode: "NED",
      score: "7-5, 6-3",
    },
    {
      year: 2024,
      championName: "Sebastian Korda",
      runnerUpName: "Flavio Cobolli",
      championCountryCode: "USA",
      runnerUpCountryCode: "ITA",
      score: "4-6, 6-2, 6-0",
    },
    {
      year: 2025,
      championName: "Alex de Minaur",
      runnerUpName: "Alejandro Davidovich Fokina",
      championCountryCode: "AUS",
      runnerUpCountryCode: "ESP",
      championPlayer: player("alex-de-minaur", "de-minaur"),
      score: "5-7, 6-1, 7-6(3)",
    },
    {
      year: 2026,
      championName: "Taylor Fritz",
      runnerUpName: "Rafael Jodar",
      championCountryCode: "USA",
      runnerUpCountryCode: "ESP",
      score: "7-6(2), 6-4",
    },
  ],
} satisfies TournamentHistoryDataset;

export default dataset;