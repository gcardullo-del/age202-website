import type {
  TournamentHistoryDataset,
  TournamentHistoryPlayerRef,
} from "../../tournament-history/types";

const player = (...slugCandidates: string[]): TournamentHistoryPlayerRef => ({
  slugCandidates,
});

const dataset = {
  tournamentSlug: "doha",

  tournament: {
    name: "Qatar ExxonMobil Open",
    shortName: "Doha",
    category: "ATP_500",
    surface: "HARD",
    city: "Doha",
    country: "Qatar",
    countryCode: "QAT",
    venue: "Khalifa International Tennis & Squash Complex",
    foundedYear: 1993,
    description:
      "Doha combines outdoor hard-court tennis with a long Middle Eastern tournament tradition and, since 2025, ATP 500 status.",
    history:
      "Established in 1993, the Qatar ExxonMobil Open became one of the ATP Tour's established early-season hard-court events. Roger Federer built the tournament record with three singles titles, while champions have also included Rafael Nadal, Novak Djokovic, Andy Murray, Andrey Rublev and Carlos Alcaraz. Doha was upgraded to ATP 500 status in 2025, opening a new chapter in its history.",
    active: true,
    metaTitle:
      "Doha ATP 500 | History, Legends & Recent Finals | AGE202",
    metaDescription:
      "Explore the Qatar ExxonMobil Open in Doha: tournament history, iconic moments, legends and the five most recent finals.",
  },

  iconicMoments: [
    {
      year: 1993,
      title: "The Doha story begins",
      subtitle: "A new ATP tournament in Qatar",
      description:
        "Doha joins the ATP Tour in 1993 and begins a hard-court tradition that will bring generations of leading players to Qatar.",
      sortOrder: 10,
    },
    {
      year: 2005,
      title: "Federer reaches the summit",
      subtitle: "The World No. 1 wins Doha",
      description:
        "Roger Federer captures the title as World No. 1 and strengthens the record-setting relationship that will ultimately bring him three Doha crowns.",
      featured: true,
      sortOrder: 20,
    },
    {
      year: 2014,
      title: "Nadal lifts the trophy",
      subtitle: "The World No. 1 adds Doha",
      description:
        "Rafael Nadal defeats Gael Monfils in three sets to add the Qatar title to his global championship collection.",
      featured: true,
      sortOrder: 30,
    },
    {
      year: 2025,
      title: "The ATP 500 era begins",
      subtitle: "Doha steps into a new category",
      description:
        "The Qatar ExxonMobil Open is upgraded from ATP 250 to ATP 500 status, significantly expanding its place on the Tour calendar.",
      featured: true,
      sortOrder: 40,
    },
    {
      year: 2026,
      title: "Alcaraz conquers Doha",
      subtitle: "A dominant championship performance",
      description:
        "Carlos Alcaraz defeats Arthur Fils in straight sets to win his first Doha title and become champion in the tournament's second season as an ATP 500.",
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
        "Federer won Doha three times and holds the tournament record for singles match victories.",
      legend: true,
      featured: true,
      sortOrder: 10,
    },
    {
      player: player("novak-djokovic", "djokovic"),
      name: "Novak Djokovic",
      country: "Serbia",
      countryCode: "SRB",
      recordLabel: "Back-to-back champion",
      quote:
        "Djokovic won consecutive Doha titles in 2016 and 2017, including a memorable championship match against Andy Murray.",
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
        "Murray captured consecutive Doha titles in 2008 and 2009 and remains the tournament's youngest singles champion.",
      legend: true,
      featured: false,
      sortOrder: 30,
    },
    {
      name: "Roberto Bautista Agut",
      country: "Spain",
      countryCode: "ESP",
      recordLabel: "Two-time champion",
      quote:
        "Bautista Agut won Doha in 2019 and 2022, becoming the tournament's oldest singles champion with his second crown.",
      legend: true,
      featured: false,
      sortOrder: 40,
    },
    {
      player: player("rafael-nadal", "nadal"),
      name: "Rafael Nadal",
      country: "Spain",
      countryCode: "ESP",
      recordLabel: "2014 champion",
      quote:
        "Nadal won Doha in 2014 while ranked World No. 1, defeating Gael Monfils in the final.",
      legend: true,
      featured: false,
      sortOrder: 50,
    },
    {
      player: player("andrey-rublev", "rublev"),
      name: "Andrey Rublev",
      country: "Russia",
      countryCode: "RUS",
      recordLabel: "Two-time champion",
      quote:
        "Rublev won the tournament in 2020 and returned in 2025 to become the first champion of Doha's ATP 500 era.",
      legend: true,
      featured: true,
      sortOrder: 60,
    },
  ],

  editions: [
    { year: 1993, championName: "Boris Becker", championCountryCode: "GER" },
    { year: 1994, championName: "Stefan Edberg", championCountryCode: "SWE" },
    { year: 1995, championName: "Stefan Edberg", championCountryCode: "SWE" },
    { year: 1996, championName: "Petr Korda", championCountryCode: "CZE" },
    { year: 1997, championName: "Jim Courier", championCountryCode: "USA" },
    { year: 1998, championName: "Petr Korda", championCountryCode: "CZE" },
    { year: 1999, championName: "Rainer Schuettler", championCountryCode: "GER" },
    { year: 2000, championName: "Fabrice Santoro", championCountryCode: "FRA" },
    { year: 2001, championName: "Marcelo Rios", championCountryCode: "CHI" },
    { year: 2002, championName: "Younes El Aynaoui", championCountryCode: "MAR" },
    { year: 2003, championName: "Stefan Koubek", championCountryCode: "AUT" },
    { year: 2004, championName: "Nicolas Escude", championCountryCode: "FRA" },
    {
      year: 2005,
      championName: "Roger Federer",
      championCountryCode: "SUI",
      championPlayer: player("roger-federer", "federer"),
    },
    {
      year: 2006,
      championName: "Roger Federer",
      championCountryCode: "SUI",
      championPlayer: player("roger-federer", "federer"),
    },
    { year: 2007, championName: "Ivan Ljubicic", championCountryCode: "CRO" },
    {
      year: 2008,
      championName: "Andy Murray",
      championCountryCode: "GBR",
      championPlayer: player("andy-murray", "murray"),
    },
    {
      year: 2009,
      championName: "Andy Murray",
      championCountryCode: "GBR",
      championPlayer: player("andy-murray", "murray"),
    },
    { year: 2010, championName: "Nikolay Davydenko", championCountryCode: "RUS" },
    {
      year: 2011,
      championName: "Roger Federer",
      championCountryCode: "SUI",
      championPlayer: player("roger-federer", "federer"),
    },
    { year: 2012, championName: "Jo-Wilfried Tsonga", championCountryCode: "FRA" },
    { year: 2013, championName: "Richard Gasquet", championCountryCode: "FRA" },
    {
      year: 2014,
      championName: "Rafael Nadal",
      championCountryCode: "ESP",
      championPlayer: player("rafael-nadal", "nadal"),
    },
    { year: 2015, championName: "David Ferrer", championCountryCode: "ESP" },
    {
      year: 2016,
      championName: "Novak Djokovic",
      championCountryCode: "SRB",
      championPlayer: player("novak-djokovic", "djokovic"),
    },
    {
      year: 2017,
      championName: "Novak Djokovic",
      championCountryCode: "SRB",
      championPlayer: player("novak-djokovic", "djokovic"),
    },
    { year: 2018, championName: "Gael Monfils", championCountryCode: "FRA" },
    { year: 2019, championName: "Roberto Bautista Agut", championCountryCode: "ESP" },
    {
      year: 2020,
      championName: "Andrey Rublev",
      championCountryCode: "RUS",
      championPlayer: player("andrey-rublev", "rublev"),
    },
    { year: 2021, championName: "Nikoloz Basilashvili", championCountryCode: "GEO" },
    {
      year: 2022,
      championName: "Roberto Bautista Agut",
      runnerUpName: "Nikoloz Basilashvili",
      championCountryCode: "ESP",
      runnerUpCountryCode: "GEO",
      score: "6-3, 6-4",
    },
    {
      year: 2023,
      championName: "Daniil Medvedev",
      runnerUpName: "Andy Murray",
      championCountryCode: "RUS",
      runnerUpCountryCode: "GBR",
      championPlayer: player("daniil-medvedev", "medvedev"),
      runnerUpPlayer: player("andy-murray", "murray"),
      score: "6-4, 6-4",
    },
    {
      year: 2024,
      championName: "Karen Khachanov",
      runnerUpName: "Jakub Mensik",
      championCountryCode: "RUS",
      runnerUpCountryCode: "CZE",
      score: "7-6(12), 6-4",
    },
    {
      year: 2025,
      championName: "Andrey Rublev",
      runnerUpName: "Jack Draper",
      championCountryCode: "RUS",
      runnerUpCountryCode: "GBR",
      championPlayer: player("andrey-rublev", "rublev"),
      score: "7-5, 5-7, 6-1",
    },
    {
      year: 2026,
      championName: "Carlos Alcaraz",
      runnerUpName: "Arthur Fils",
      championCountryCode: "ESP",
      runnerUpCountryCode: "FRA",
      championPlayer: player("carlos-alcaraz", "alcaraz"),
      score: "6-2, 6-1",
    },
  ],
} satisfies TournamentHistoryDataset;

export default dataset;