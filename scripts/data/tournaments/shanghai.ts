import type {
  TournamentHistoryDataset,
  TournamentHistoryPlayerRef,
} from "../../tournament-history/types";

const player = (...slugCandidates: string[]): TournamentHistoryPlayerRef => ({
  slugCandidates,
});

const dataset = {
  tournamentSlug: "shanghai",

  tournament: {
    name: "Shanghai Masters",
    shortName: "Shanghai",
    category: "MASTERS_1000",
    surface: "HARD",
    city: "Shanghai",
    country: "China",
    countryCode: "CHN",
    venue: "Qizhong Forest Sports City Arena",
    foundedYear: 2009,
    description:
      "Shanghai represents the Masters 1000 series in Asia through a modern venue, fast hard courts and a major position in the final phase of the ATP season.",
    history:
      "Shanghai developed its world-class tennis infrastructure through major year-end championships before joining the permanent Masters calendar in 2009. The tournament quickly became the leading regular ATP Tour event in Asia, with the Qizhong Forest Sports City Arena providing one of the most distinctive homes on the circuit.",
    active: true,
    metaTitle:
      "Shanghai Masters | History, Champions & Legends | AGE202",
    metaDescription:
      "Explore the Shanghai Masters archive: editions, finals, champions, title leaders, iconic moments and AGE202 legends.",
  },

  milestones: [
    {
      year: 2002,
      title: "Shanghai hosts the elite",
      subtitle: "The city enters top-level men's tennis",
      description:
        "Shanghai begins establishing itself as a global tennis destination by hosting the season-ending championship.",
      sortOrder: 10,
    },
    {
      year: 2005,
      title: "The year-end championship era",
      subtitle: "A world-class venue takes shape",
      description:
        "Shanghai hosts the ATP season finale and deepens its place in the international tennis calendar.",
      sortOrder: 20,
    },
    {
      year: 2009,
      title: "The Masters begins",
      subtitle: "Asia gains a permanent Masters 1000",
      description:
        "The Shanghai Masters launches as a permanent ATP Masters 1000 event and immediately becomes the flagship tournament of the Asian swing.",
      featured: true,
      sortOrder: 30,
    },
    {
      year: 2023,
      title: "Return and expansion",
      subtitle: "A larger Shanghai Masters",
      description:
        "Shanghai returns to the Tour with an expanded 96-player format and a renewed global presence.",
      sortOrder: 40,
    },
    {
      year: 2025,
      title: "The Vacherot fairytale",
      subtitle: "The lowest-ranked Masters 1000 champion",
      description:
        "Valentin Vacherot completes one of the most improbable title runs in Masters history, winning Shanghai from outside the world's top 200.",
      featured: true,
      sortOrder: 50,
    },
  ],

  chapters: [
    {
      eyebrow: "Foundations",
      title: "Shanghai becomes a tennis capital",
      subtitle: "From the season finale to a permanent Masters",
      description:
        "Before the Masters arrived, Shanghai had already built a strong connection with elite men's tennis through major year-end championships and a new generation of world-class facilities.",
      yearLabel: "2002 — 2008",
      sortOrder: 10,
    },
    {
      eyebrow: "Masters era",
      title: "Asia's flagship Masters",
      subtitle: "A new permanent place on the ATP calendar",
      description:
        "The 2009 launch established Shanghai as the only Masters 1000 tournament in Asia and created a major new stage for the sport's leading players.",
      yearLabel: "2009 — 2019",
      featured: true,
      sortOrder: 20,
    },
    {
      eyebrow: "Return",
      title: "Shanghai expands",
      subtitle: "A new 96-player format",
      description:
        "After a three-year absence, the tournament returned in 2023 with a larger draw, an extended schedule and renewed importance in the race toward the ATP Finals.",
      yearLabel: "2023 — present",
      sortOrder: 30,
    },
    {
      eyebrow: "New generation",
      title: "From Sinner to Vacherot",
      subtitle: "New stories on the Asian stage",
      description:
        "Jannik Sinner's 2024 triumph and Valentin Vacherot's extraordinary 2025 breakthrough opened a new chapter in Shanghai's modern history.",
      yearLabel: "2024 — present",
      sortOrder: 40,
    },
  ],

  iconicMoments: [
    {
      year: 2009,
      title: "The first Shanghai Masters",
      subtitle: "A new Asian landmark",
      description:
        "Nikolay Davydenko defeats Rafael Nadal to become the inaugural Shanghai Masters champion.",
      sortOrder: 10,
    },
    {
      year: 2012,
      title: "Djokovic saves five match points",
      subtitle: "A Shanghai classic",
      description:
        "Novak Djokovic survives five championship points against Andy Murray before winning a dramatic three-set final.",
      featured: true,
      sortOrder: 20,
    },
    {
      year: 2017,
      title: "Federer defeats Nadal",
      subtitle: "A rivalry chapter in Shanghai",
      description:
        "Roger Federer beats Rafael Nadal in the final to claim his second Shanghai Masters title.",
      sortOrder: 30,
    },
    {
      year: 2024,
      title: "Sinner conquers Shanghai",
      subtitle: "World No. 1 takes the crown",
      description:
        "Jannik Sinner defeats Novak Djokovic in straight sets to win his first Shanghai Masters title.",
      featured: true,
      sortOrder: 40,
    },
    {
      year: 2025,
      title: "Vacherot's impossible run",
      subtitle: "From qualifier to Masters champion",
      description:
        "World No. 204 Valentin Vacherot defeats his cousin Arthur Rinderknech to become the lowest-ranked Masters 1000 champion in history.",
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
      recordLabel: "The King of Shanghai",
      quote:
        "Four titles and the tournament record for match wins make Djokovic the defining champion of the Shanghai Masters.",
      legend: true,
      featured: true,
      sortOrder: 10,
    },
    {
      player: player("andy-murray", "murray"),
      name: "Andy Murray",
      country: "United Kingdom",
      countryCode: "GBR",
      recordLabel: "The Shanghai Specialist",
      quote:
        "Three titles in 2010, 2011 and 2016 made Murray one of Shanghai's most successful champions.",
      legend: true,
      featured: false,
      sortOrder: 20,
    },
    {
      player: player("roger-federer", "federer"),
      name: "Roger Federer",
      country: "Switzerland",
      countryCode: "SUI",
      recordLabel: "The Shanghai Icon",
      quote:
        "Federer's victories in 2014 and 2017, combined with his enduring popularity in China, made him one of the tournament's defining figures.",
      legend: true,
      featured: true,
      sortOrder: 30,
    },
    {
      name: "Daniil Medvedev",
      country: "Russia",
      countryCode: "RUS",
      recordLabel: "The 2019 Champion",
      quote:
        "Medvedev's 2019 title underlined his emergence as one of the premier hard-court players of his generation.",
      legend: true,
      featured: false,
      sortOrder: 40,
    },
    {
      player: player("jannik-sinner", "sinner"),
      name: "Jannik Sinner",
      country: "Italy",
      countryCode: "ITA",
      recordLabel: "The New No. 1 Champion",
      quote:
        "Sinner's 2024 victory over Djokovic added Shanghai to an extraordinary season at the top of men's tennis.",
      legend: true,
      featured: true,
      sortOrder: 50,
    },
    {
      name: "Valentin Vacherot",
      country: "Monaco",
      countryCode: "MON",
      recordLabel: "The Fairytale Champion",
      quote:
        "Vacherot's 2025 title from No. 204 in the world became one of the greatest underdog stories in Masters 1000 history.",
      legend: true,
      featured: false,
      sortOrder: 60,
    },
  ],

  editions: [

    {
      year: 2009,
      championName: "Nikolay Davydenko",
      runnerUpName: "Rafael Nadal",
      championCountryCode: "RUS",
      runnerUpCountryCode: "ESP",
      runnerUpPlayer: player("rafael-nadal", "nadal"),
      score: "7-6(3), 6-3",
    },
    {
      year: 2010,
      championName: "Andy Murray",
      runnerUpName: "Roger Federer",
      championCountryCode: "GBR",
      runnerUpCountryCode: "SUI",
      championPlayer: player("andy-murray", "murray"),
      runnerUpPlayer: player("roger-federer", "federer"),
      score: "6-3, 6-2",
    },
    {
      year: 2011,
      championName: "Andy Murray",
      runnerUpName: "David Ferrer",
      championCountryCode: "GBR",
      runnerUpCountryCode: "ESP",
      championPlayer: player("andy-murray", "murray"),
      score: "7-5, 6-4",
    },
    {
      year: 2012,
      championName: "Novak Djokovic",
      runnerUpName: "Andy Murray",
      championCountryCode: "SRB",
      runnerUpCountryCode: "GBR",
      championPlayer: player("novak-djokovic", "djokovic"),
      runnerUpPlayer: player("andy-murray", "murray"),
      score: "5-7, 7-6(11), 6-3",
    },
    {
      year: 2013,
      championName: "Novak Djokovic",
      runnerUpName: "Juan Martin del Potro",
      championCountryCode: "SRB",
      runnerUpCountryCode: "ARG",
      championPlayer: player("novak-djokovic", "djokovic"),
      score: "6-1, 3-6, 7-6(3)",
    },
    {
      year: 2014,
      championName: "Roger Federer",
      runnerUpName: "Gilles Simon",
      championCountryCode: "SUI",
      runnerUpCountryCode: "FRA",
      championPlayer: player("roger-federer", "federer"),
      score: "7-6(6), 7-6(2)",
    },
    {
      year: 2015,
      championName: "Novak Djokovic",
      runnerUpName: "Jo-Wilfried Tsonga",
      championCountryCode: "SRB",
      runnerUpCountryCode: "FRA",
      championPlayer: player("novak-djokovic", "djokovic"),
      score: "6-2, 6-4",
    },
    {
      year: 2016,
      championName: "Andy Murray",
      runnerUpName: "Roberto Bautista Agut",
      championCountryCode: "GBR",
      runnerUpCountryCode: "ESP",
      championPlayer: player("andy-murray", "murray"),
      score: "7-6(1), 6-1",
    },
    {
      year: 2017,
      championName: "Roger Federer",
      runnerUpName: "Rafael Nadal",
      championCountryCode: "SUI",
      runnerUpCountryCode: "ESP",
      championPlayer: player("roger-federer", "federer"),
      runnerUpPlayer: player("rafael-nadal", "nadal"),
      score: "6-4, 6-3",
    },
    {
      year: 2018,
      championName: "Novak Djokovic",
      runnerUpName: "Borna Coric",
      championCountryCode: "SRB",
      runnerUpCountryCode: "CRO",
      championPlayer: player("novak-djokovic", "djokovic"),
      score: "6-3, 6-4",
    },
    {
      year: 2019,
      championName: "Daniil Medvedev",
      runnerUpName: "Alexander Zverev",
      championCountryCode: "RUS",
      runnerUpCountryCode: "GER",
      score: "6-4, 6-1",
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
      cancelled: true,
    },
    {
      year: 2023,
      championName: "Hubert Hurkacz",
      runnerUpName: "Andrey Rublev",
      championCountryCode: "POL",
      runnerUpCountryCode: "RUS",
      score: "6-3, 3-6, 7-6(8)",
    },
    {
      year: 2024,
      championName: "Jannik Sinner",
      runnerUpName: "Novak Djokovic",
      championCountryCode: "ITA",
      runnerUpCountryCode: "SRB",
      championPlayer: player("jannik-sinner", "sinner"),
      runnerUpPlayer: player("novak-djokovic", "djokovic"),
      score: "7-6(4), 6-3",
    },
    {
      year: 2025,
      championName: "Valentin Vacherot",
      runnerUpName: "Arthur Rinderknech",
      championCountryCode: "MON",
      runnerUpCountryCode: "FRA",
      score: "4-6, 6-3, 6-3",
    },
  ],
} satisfies TournamentHistoryDataset;

export default dataset;