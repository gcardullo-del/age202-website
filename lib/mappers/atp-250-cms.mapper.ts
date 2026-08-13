import type {
  ATP250Leader,
  ATP250LatestFinal,
  ATP250Tournament,
} from "@/lib/data/atp-250";

export type ATP250CmsEdition = {
  year: number;
  championName: string | null;
  runnerUpName: string | null;
  championCountryCode: string | null;
  runnerUpCountryCode: string | null;
  score: string | null;
  cancelled: boolean;
};

export type ATP250CmsChampion = {
  name: string | null;
  titles: number;
};

export type ATP250CmsTournament = {
  slug: string;
  editions: readonly ATP250CmsEdition[];
  champions: readonly ATP250CmsChampion[];
};

export type ATP250PublicTournament = ATP250Tournament;

function resolveLatestFinal(
  fallback: ATP250LatestFinal,
  cmsTournament:
    | ATP250CmsTournament
    | null
    | undefined,
): ATP250LatestFinal {
  if (!cmsTournament) {
    return fallback;
  }

  const latestEdition =
    cmsTournament.editions.find(
      (edition) =>
        !edition.cancelled &&
        Boolean(
          edition.championName,
        ) &&
        Boolean(
          edition.runnerUpName,
        ) &&
        Boolean(
          edition.score,
        ),
    );

  if (
    !latestEdition ||
    !latestEdition.championName ||
    !latestEdition.runnerUpName ||
    !latestEdition.score
  ) {
    return fallback;
  }

  return {
    year: latestEdition.year,
    champion:
      latestEdition.championName,
    runnerUp:
      latestEdition.runnerUpName,
    score:
      latestEdition.score,
  };
}

function resolveLeader(
  fallback: ATP250Leader,
  cmsTournament:
    | ATP250CmsTournament
    | null
    | undefined,
): ATP250Leader {
  if (
    !cmsTournament ||
    cmsTournament.champions.length === 0
  ) {
    return fallback;
  }

  const validChampions =
    cmsTournament.champions.filter(
      (
        champion,
      ): champion is {
        name: string;
        titles: number;
      } =>
        Boolean(
          champion.name?.trim(),
        ) &&
        champion.titles > 0,
    );

  if (
    validChampions.length === 0
  ) {
    return fallback;
  }

  const maxTitles =
    validChampions.reduce(
      (
        currentMax,
        champion,
      ) =>
        Math.max(
          currentMax,
          champion.titles,
        ),
      0,
    );

  const names =
    validChampions
      .filter(
        (champion) =>
          champion.titles ===
          maxTitles,
      )
      .map(
        (champion) =>
          champion.name.trim(),
      )
      .sort(
        (
          a,
          b,
        ) =>
          a.localeCompare(b),
      );

  if (names.length === 0) {
    return fallback;
  }

  return {
    names,
    titles: maxTitles,
  };
}

export function mapATP250TournamentFromCms(
  tournament: ATP250Tournament,
  cmsTournament:
    | ATP250CmsTournament
    | null
    | undefined,
): ATP250PublicTournament {
  return {
    ...tournament,

    leader:
      resolveLeader(
        tournament.leader,
        cmsTournament,
      ),

    latestFinal:
      resolveLatestFinal(
        tournament.latestFinal,
        cmsTournament,
      ),
  };
}

export function mapATP250TournamentsFromCms(
  tournaments:
    readonly ATP250Tournament[],
  cmsTournaments:
    readonly ATP250CmsTournament[],
): ATP250PublicTournament[] {
  const bySlug =
    new Map(
      cmsTournaments.map(
        (tournament) => [
          tournament.slug,
          tournament,
        ],
      ),
    );

  return tournaments.map(
    (tournament) =>
      mapATP250TournamentFromCms(
        tournament,
        bySlug.get(
          tournament.slug,
        ),
      ),
  );
}