import type {
  RankingMovement,
  RankingPlayer,
} from "./types";

export function getRankingMovement(
  currentRank: number,
  previousRank: number | null,
): {
  movement: RankingMovement;
  movementValue: number;
} {
  if (previousRank === null) {
    return {
      movement: "NEW",
      movementValue: 0,
    };
  }

  if (currentRank < previousRank) {
    return {
      movement: "UP",
      movementValue: previousRank - currentRank,
    };
  }

  if (currentRank > previousRank) {
    return {
      movement: "DOWN",
      movementValue: currentRank - previousRank,
    };
  }

  return {
    movement: "SAME",
    movementValue: 0,
  };
}

export function formatPoints(points: number) {
  return new Intl.NumberFormat("en-US").format(points);
}

export function formatAge(age: number | null) {
  if (age === null) {
    return "—";
  }

  return `${age}`;
}

export function formatTournaments(
  tournaments: number | null,
) {
  if (tournaments === null) {
    return "—";
  }

  return `${tournaments}`;
}

export function filterPlayers(
  players: RankingPlayer[],
  query: string,
  country: string,
) {
  return players.filter((player) => {
    const matchesName =
      query.length === 0 ||
      player.name
        .toLowerCase()
        .includes(query.toLowerCase());

    const matchesCountry =
      country === "all" ||
      player.country === country;

    return matchesName && matchesCountry;
  });
}

export function sortPlayers(
  players: RankingPlayer[],
  sort: string,
) {
  const sorted = [...players];

  switch (sort) {
    case "points-desc":
      sorted.sort(
        (a, b) => b.points - a.points,
      );
      break;

    case "points-asc":
      sorted.sort(
        (a, b) => a.points - b.points,
      );
      break;

    case "name-asc":
      sorted.sort((a, b) =>
        a.name.localeCompare(b.name),
      );
      break;

    case "name-desc":
      sorted.sort((a, b) =>
        b.name.localeCompare(a.name),
      );
      break;

    default:
      sorted.sort(
        (a, b) => a.rank - b.rank,
      );
  }

  return sorted;
}

export function getCountries(
  players: RankingPlayer[],
) {
  return [...new Set(players
    .map((player) => player.country)
    .filter(Boolean))]
    .sort() as string[];
}