export type PlayerProfile = {
  id: string;
  bio: string;

  stats: {
    slams: number;
    titles: number;
    weeks: number;
    born: string;
  };
};

export const playerProfiles: PlayerProfile[] = [
  {
    id: "federer",

    bio:
      "Roger Federer è considerato uno dei più grandi tennisti della storia. Eleganza, tecnica e longevità hanno definito una carriera che ha ispirato milioni di appassionati.",

    stats: {
      slams: 20,
      titles: 103,
      weeks: 310,
      born: "1981",
    },
  },

  {
    id: "nadal",

    bio:
      "Rafael Nadal ha rivoluzionato il tennis sulla terra rossa grazie a intensità, resilienza e spirito competitivo.",

    stats: {
      slams: 22,
      titles: 92,
      weeks: 209,
      born: "1986",
    },
  },

  {
    id: "djokovic",

    bio:
      "Novak Djokovic è il giocatore con il maggior numero di titoli Slam nell'era moderna e uno dei più dominanti di sempre.",

    stats: {
      slams: 24,
      titles: 100,
      weeks: 428,
      born: "1987",
    },
  },

  {
    id: "sinner",

    bio:
      "Jannik Sinner rappresenta la nuova generazione del tennis mondiale con potenza, precisione e continuità.",

    stats: {
      slams: 4,
      titles: 20,
      weeks: 60,
      born: "2001",
    },
  },

  {
    id: "alcaraz",

    bio:
      "Carlos Alcaraz combina esplosività e creatività, diventando in pochi anni uno dei protagonisti assoluti del circuito ATP.",

    stats: {
      slams: 5,
      titles: 22,
      weeks: 36,
      born: "2003",
    },
  },
];