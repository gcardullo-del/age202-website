import type {
  TournamentHistoryDataset,
  TournamentHistoryPlayerRef,
} from "../../tournament-history/types";

const player = (...slugCandidates: string[]): TournamentHistoryPlayerRef => ({
  slugCandidates,
});

const dataset = {
  tournamentSlug: "madrid",

  editions: [
    { year: 2002, championName: "Andre Agassi", runnerUpName: "Jiri Novak", championCountryCode: "USA", runnerUpCountryCode: "CZE", score: "Walkover" },
    { year: 2003, championName: "Juan Carlos Ferrero", runnerUpName: "Nicolas Massu", championCountryCode: "ESP", runnerUpCountryCode: "CHI", score: "6-3, 6-4, 6-3" },
    { year: 2004, championName: "Marat Safin", runnerUpName: "David Nalbandian", championCountryCode: "RUS", runnerUpCountryCode: "ARG", score: "6-2, 6-4, 6-3" },
    { year: 2005, championName: "Rafael Nadal", runnerUpName: "Ivan Ljubicic", championCountryCode: "ESP", runnerUpCountryCode: "CRO", championPlayer: player("rafael-nadal", "nadal"), score: "3-6, 2-6, 6-3, 6-4, 7-6(3)" },
    { year: 2006, championName: "Roger Federer", runnerUpName: "Fernando Gonzalez", championCountryCode: "SUI", runnerUpCountryCode: "CHI", championPlayer: player("roger-federer", "federer"), score: "7-5, 6-1, 6-0" },
    { year: 2007, championName: "David Nalbandian", runnerUpName: "Roger Federer", championCountryCode: "ARG", runnerUpCountryCode: "SUI", runnerUpPlayer: player("roger-federer", "federer"), score: "1-6, 6-3, 6-3" },
    { year: 2008, championName: "Andy Murray", runnerUpName: "Gilles Simon", championCountryCode: "GBR", runnerUpCountryCode: "FRA", score: "6-4, 7-6(6)" },
    { year: 2009, championName: "Roger Federer", runnerUpName: "Rafael Nadal", championCountryCode: "SUI", runnerUpCountryCode: "ESP", championPlayer: player("roger-federer", "federer"), runnerUpPlayer: player("rafael-nadal", "nadal"), score: "6-4, 6-4" },
    { year: 2010, championName: "Rafael Nadal", runnerUpName: "Roger Federer", championCountryCode: "ESP", runnerUpCountryCode: "SUI", championPlayer: player("rafael-nadal", "nadal"), runnerUpPlayer: player("roger-federer", "federer"), score: "6-4, 7-6(5)" },
    { year: 2011, championName: "Novak Djokovic", runnerUpName: "Rafael Nadal", championCountryCode: "SRB", runnerUpCountryCode: "ESP", championPlayer: player("novak-djokovic", "djokovic"), runnerUpPlayer: player("rafael-nadal", "nadal"), score: "7-5, 6-4" },
    { year: 2012, championName: "Roger Federer", runnerUpName: "Tomas Berdych", championCountryCode: "SUI", runnerUpCountryCode: "CZE", championPlayer: player("roger-federer", "federer"), score: "3-6, 7-5, 7-5" },
    { year: 2013, championName: "Rafael Nadal", runnerUpName: "Stan Wawrinka", championCountryCode: "ESP", runnerUpCountryCode: "SUI", championPlayer: player("rafael-nadal", "nadal"), score: "6-2, 6-4" },
    { year: 2014, championName: "Rafael Nadal", runnerUpName: "Kei Nishikori", championCountryCode: "ESP", runnerUpCountryCode: "JPN", championPlayer: player("rafael-nadal", "nadal"), score: "2-6, 6-4, 3-0 ret." },
    { year: 2015, championName: "Andy Murray", runnerUpName: "Rafael Nadal", championCountryCode: "GBR", runnerUpCountryCode: "ESP", runnerUpPlayer: player("rafael-nadal", "nadal"), score: "6-3, 6-2" },
    { year: 2016, championName: "Novak Djokovic", runnerUpName: "Andy Murray", championCountryCode: "SRB", runnerUpCountryCode: "GBR", championPlayer: player("novak-djokovic", "djokovic"), score: "6-2, 3-6, 6-3" },
    { year: 2017, championName: "Rafael Nadal", runnerUpName: "Dominic Thiem", championCountryCode: "ESP", runnerUpCountryCode: "AUT", championPlayer: player("rafael-nadal", "nadal"), score: "7-6(8), 6-4" },
    { year: 2018, championName: "Alexander Zverev", runnerUpName: "Dominic Thiem", championCountryCode: "GER", runnerUpCountryCode: "AUT", score: "6-4, 6-4" },
    { year: 2019, championName: "Novak Djokovic", runnerUpName: "Stefanos Tsitsipas", championCountryCode: "SRB", runnerUpCountryCode: "GRE", championPlayer: player("novak-djokovic", "djokovic"), score: "6-3, 6-4" },
    { year: 2020, cancelled: true },
    { year: 2021, championName: "Alexander Zverev", runnerUpName: "Matteo Berrettini", championCountryCode: "GER", runnerUpCountryCode: "ITA", score: "6-7(8), 6-4, 6-3" },
    { year: 2022, championName: "Carlos Alcaraz", runnerUpName: "Alexander Zverev", championCountryCode: "ESP", runnerUpCountryCode: "GER", championPlayer: player("carlos-alcaraz", "alcaraz"), score: "6-3, 6-1" },
    { year: 2023, championName: "Carlos Alcaraz", runnerUpName: "Jan-Lennard Struff", championCountryCode: "ESP", runnerUpCountryCode: "GER", championPlayer: player("carlos-alcaraz", "alcaraz"), score: "6-4, 3-6, 6-3" },
    { year: 2024, championName: "Andrey Rublev", runnerUpName: "Felix Auger-Aliassime", championCountryCode: "RUS", runnerUpCountryCode: "CAN", score: "4-6, 7-5, 7-5" },
    { year: 2025, championName: "Casper Ruud", runnerUpName: "Jack Draper", championCountryCode: "NOR", runnerUpCountryCode: "GBR", score: "7-5, 3-6, 6-4" },
    { year: 2026, championName: "Jannik Sinner", runnerUpName: "Alexander Zverev", championCountryCode: "ITA", runnerUpCountryCode: "GER", championPlayer: player("jannik-sinner", "sinner"), drawSize: 96, score: "6-1, 6-2" },
  ],
} satisfies TournamentHistoryDataset;

export default dataset;