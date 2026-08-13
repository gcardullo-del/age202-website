import type {
  TournamentHistoryDataset,
  TournamentHistoryPlayerRef,
} from "../../tournament-history/types";

const player = (...slugCandidates: string[]): TournamentHistoryPlayerRef => ({
  slugCandidates,
});

const dataset = {
  tournamentSlug: "dallas",

  tournament: {
    name: "Nexo Dallas Open",
    shortName: "Dallas",
    category: "ATP_500",
    surface: "HARD",
    city: "Frisco",
    country: "United States",
    countryCode: "USA",
    venue: "Ford Center at The Star",
    foundedYear: 2022,
    description:
      "Dallas is the only indoor ATP Tour event in the United States, combining fast hard-court tennis with a modern home at Ford Center at The Star in Frisco.",
    history:
      "The Dallas Open moved to North Texas in 2022 after previously being staged in New York. Reilly Opelka won the first Dallas edition, Wu Yibing made history in 2023, and Tommy Paul became the home champion in 2024. The tournament was upgraded from ATP 250 to ATP 500 status in 2025 and relocated to Ford Center at The Star in Frisco. Denis Shapovalov won the first ATP 500 edition before Ben Shelton captured the 2026 title in a dramatic all-American final.",
    active: true,
    metaTitle:
      "Dallas ATP 500 | History, Champions & Recent Finals | AGE202",
    metaDescription:
      "Explore the Dallas Open: tournament history, iconic moments, champions and every Dallas final from 2022 through 2026.",
  },

  iconicMoments: [
    {
      year: 2022,
      title: "The Dallas era begins",
      subtitle: "Professional indoor tennis arrives in North Texas",
      description:
        "The tournament moves from New York to Dallas, where Reilly Opelka defeats Jenson Brooksby to become the first champion of the North Texas era.",
      sortOrder: 10,
    },
    {
      year: 2023,
      title: "Wu makes history",
      subtitle: "A landmark title for Chinese men's tennis",
      description:
        "Wu Yibing defeats John Isner in a three-tie-break final and becomes the first Chinese man to win an ATP Tour singles title.",
      featured: true,
      sortOrder: 20,
    },
    {
      year: 2024,
      title: "Paul wins at home",
      subtitle: "An all-American Dallas final",
      description:
        "Tommy Paul defeats Marcos Giron in three sets to capture the final Dallas title of the tournament's ATP 250 era.",
      sortOrder: 30,
    },
    {
      year: 2025,
      title: "Dallas becomes ATP 500",
      subtitle: "A new venue and a new category",
      description:
        "The tournament moves to Ford Center at The Star in Frisco and begins its ATP 500 era, with Denis Shapovalov defeating Casper Ruud for the biggest title of his career.",
      featured: true,
      sortOrder: 40,
    },
    {
      year: 2026,
      title: "Shelton saves three championship points",
      subtitle: "A dramatic all-American final",
      description:
        "Ben Shelton saves three championship points and defeats Taylor Fritz 3-6, 6-3, 7-5 to win his first indoor ATP Tour title.",
      featured: true,
      sortOrder: 50,
    },
  ],

  legends: [
    {
      name: "Reilly Opelka",
      country: "United States",
      countryCode: "USA",
      recordLabel: "2022 champion",
      quote:
        "Opelka won the inaugural Dallas edition, defeating Jenson Brooksby in an all-American final decided by two tie-breaks.",
      legend: true,
      featured: false,
      sortOrder: 10,
    },
    {
      name: "Wu Yibing",
      country: "China",
      countryCode: "CHN",
      recordLabel: "2023 champion",
      quote:
        "Wu's Dallas victory made him the first Chinese man to capture an ATP Tour singles title.",
      legend: true,
      featured: true,
      sortOrder: 20,
    },
    {
      name: "Tommy Paul",
      country: "United States",
      countryCode: "USA",
      recordLabel: "2024 champion",
      quote:
        "Paul won the 2024 Dallas crown in an all-American final against Marcos Giron.",
      legend: true,
      featured: false,
      sortOrder: 30,
    },
    {
      name: "Denis Shapovalov",
      country: "Canada",
      countryCode: "CAN",
      recordLabel: "First ATP 500 champion",
      quote:
        "Shapovalov defeated Casper Ruud in 2025 to become the first champion of Dallas's ATP 500 era.",
      legend: true,
      featured: true,
      sortOrder: 40,
    },
    {
      player: player("ben-shelton", "shelton"),
      name: "Ben Shelton",
      country: "United States",
      countryCode: "USA",
      recordLabel: "2026 champion",
      quote:
        "Shelton saved three championship points against Taylor Fritz to win the 2026 title and his first indoor ATP Tour trophy.",
      legend: true,
      featured: true,
      sortOrder: 50,
    },
  ],

  editions: [
    {
      year: 2022,
      championName: "Reilly Opelka",
      runnerUpName: "Jenson Brooksby",
      championCountryCode: "USA",
      runnerUpCountryCode: "USA",
      score: "7-6(5), 7-6(3)",
    },
    {
      year: 2023,
      championName: "Wu Yibing",
      runnerUpName: "John Isner",
      championCountryCode: "CHN",
      runnerUpCountryCode: "USA",
      score: "6-7(4), 7-6(3), 7-6(12)",
    },
    {
      year: 2024,
      championName: "Tommy Paul",
      runnerUpName: "Marcos Giron",
      championCountryCode: "USA",
      runnerUpCountryCode: "USA",
      score: "7-6(3), 5-7, 6-3",
    },
    {
      year: 2025,
      championName: "Denis Shapovalov",
      runnerUpName: "Casper Ruud",
      championCountryCode: "CAN",
      runnerUpCountryCode: "NOR",
      score: "7-6(5), 6-3",
    },
    {
      year: 2026,
      championName: "Ben Shelton",
      runnerUpName: "Taylor Fritz",
      championCountryCode: "USA",
      runnerUpCountryCode: "USA",
      championPlayer: player("ben-shelton", "shelton"),
      score: "3-6, 6-3, 7-5",
    },
  ],
} satisfies TournamentHistoryDataset;

export default dataset;