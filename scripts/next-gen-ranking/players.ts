import type {
  NextGenRankingPlayer,
} from "./types";


export const NEXT_GEN_RANKING_PLAYERS:
  NextGenRankingPlayer[] = [
    {
      id:
        "moise-kouame",

      name:
        "Moïse Kouamé",

      atpProfileUrl:
        "https://www.atptour.com/en/players/moise-kouame/k0o4/overview",

      active:
        true,
    },

    {
      id:
        "federico-cina",

      name:
        "Federico Cinà",

      atpProfileUrl:
        "https://www.atptour.com/en/players/federico-cina/c0nb/overview",

      active:
        true,
    },

    {
      id:
        "diego-dedura",

      name:
        "Diego Dedura",

      atpProfileUrl:
        "https://www.atptour.com/en/players/diego-dedura/d0lj/overview",

      active:
        true,
    },

    {
      id:
        "nicolai-budkov-kjaer",

      name:
        "Nicolai Budkov Kjær",

      atpProfileUrl:
        "https://www.atptour.com/en/players/nicolai-budkov-kjaer/b0u4/overview",

      active:
        true,
    },

    {
      id:
        "henry-searle",

      name:
        "Henry Searle",

      atpProfileUrl:
        "https://www.atptour.com/en/players/henry-searle/s0tx/overview",

      active:
        true,
    },

    {
      id:
        "joel-schwaerzler",

      name:
        "Joel Schwärzler",

      atpProfileUrl:
        "https://www.atptour.com/en/players/joel-schwaerzler/s0wt/overview",

      active:
        true,
    },

    {
      id:
        "maxim-mrva",

      name:
        "Maxim Mrva",

      atpProfileUrl:
        "https://www.atptour.com/en/players/maxim-mrva/m0se/overview",

      active:
        true,
    },

    {
      id:
        "cruz-hewitt",

      name:
        "Cruz Hewitt",

      atpProfileUrl:
        "https://www.atptour.com/en/players/cruz-hewitt/h0k0/overview",

      active:
        true,
    },

    {
      id:
        "max-schoenhaus",

      name:
        "Max Schönhaus",

      atpProfileUrl:
        "https://www.atptour.com/en/players/max-schoenhaus/s0vu/overview",

      active:
        true,
    },

    {
      id:
        "ognjen-milic",

      name:
        "Ognjen Milić",

      atpProfileUrl:
        "https://www.atptour.com/en/players/ognjen-milic/m0ur/overview",

      active:
        true,
    },
  ];


export function getActiveNextGenRankingPlayers():
  NextGenRankingPlayer[] {
  return NEXT_GEN_RANKING_PLAYERS.filter(
    (player) =>
      player.active,
  );
}


export function getNextGenRankingPlayer(
  playerId: string,
): NextGenRankingPlayer | null {
  return (
    NEXT_GEN_RANKING_PLAYERS.find(
      (player) =>
        player.id ===
        playerId,
    ) ??
    null
  );
}