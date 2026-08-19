import type {
  getPlayerTournamentEditions,
} from "@/lib/repositories/player.repository";

type TournamentEditions = Awaited<
  ReturnType<
    typeof getPlayerTournamentEditions
  >
>;

export type PlayerTrophyStats = {
  recordedTitles: number;
  recordedRunnerUps: number;
  recordedFinals: number;

  recordedGrandSlams: number;
  recordedAustralianOpen: number;
  recordedRolandGarros: number;
  recordedWimbledon: number;
  recordedUsOpen: number;

  recordedMasters1000: number;
  recordedAtp500: number;
  recordedAtp250: number;
  recordedAtpFinals: number;

  recordedOlympicGold: number;
  davisCupTitles: number;

  firstRecordedYear:
    | number
    | null;

  lastRecordedYear:
    | number
    | null;
};

type GetPlayerTrophyStatsInput = {
  playerId:
    | string
    | null;

  tournamentEditions:
    TournamentEditions;

  davisCupTitles?: number;
};

function normalizeTournamentIdentity(
  value: string,
): string {
  return value
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      " ",
    )
    .trim()
    .replace(
      /\s+/g,
      " ",
    );
}

function isTournament(
  tournament: {
    name: string;
    slug: string;
  },
  aliases: readonly string[],
): boolean {
  const searchable = [
    tournament.name,
    tournament.slug,
  ].map(
    normalizeTournamentIdentity,
  );

  const normalizedAliases =
    aliases.map(
      normalizeTournamentIdentity,
    );

  return normalizedAliases.some(
    (alias) =>
      searchable.some(
        (value) =>
          value === alias ||
          value.includes(alias) ||
          alias.includes(value),
      ),
  );
}

export function getPlayerTrophyStats({
  playerId,
  tournamentEditions,
  davisCupTitles = 0,
}: GetPlayerTrophyStatsInput):
  | PlayerTrophyStats
  | null {
  if (!playerId) {
    return null;
  }

  const playerTournamentEditions =
    tournamentEditions.filter(
      (edition) =>
        edition.championPlayerId ===
          playerId ||
        edition.runnerUpPlayerId ===
          playerId,
    );

  const syncedTitles =
    tournamentEditions.filter(
      (edition) =>
        edition.championPlayerId ===
        playerId,
    );

  const syncedRunnerUps =
    tournamentEditions.filter(
      (edition) =>
        edition.runnerUpPlayerId ===
        playerId,
    );

  const countTitlesByCategory = (
    category: string,
  ) =>
    syncedTitles.filter(
      (edition) =>
        edition.tournament.category ===
        category,
    ).length;

  const grandSlamTitles =
    syncedTitles.filter(
      (edition) =>
        edition.tournament.category ===
        "GRAND_SLAM",
    );

  const recordedAustralianOpen =
    grandSlamTitles.filter(
      (edition) =>
        isTournament(
          edition.tournament,
          [
            "australian-open",
            "Australian Open",
          ],
        ),
    ).length;

  const recordedRolandGarros =
    grandSlamTitles.filter(
      (edition) =>
        isTournament(
          edition.tournament,
          [
            "roland-garros",
            "Roland Garros",
            "French Open",
          ],
        ),
    ).length;

  const recordedWimbledon =
    grandSlamTitles.filter(
      (edition) =>
        isTournament(
          edition.tournament,
          [
            "wimbledon",
            "Wimbledon",
          ],
        ),
    ).length;

  const recordedUsOpen =
    grandSlamTitles.filter(
      (edition) =>
        isTournament(
          edition.tournament,
          [
            "us-open",
            "US Open",
            "U.S. Open",
          ],
        ),
    ).length;

  return {
    recordedTitles:
      syncedTitles.length,

    recordedRunnerUps:
      syncedRunnerUps.length,

    recordedFinals:
      playerTournamentEditions.length,

    recordedGrandSlams:
      grandSlamTitles.length,

    recordedAustralianOpen,
    recordedRolandGarros,
    recordedWimbledon,
    recordedUsOpen,

    recordedMasters1000:
      countTitlesByCategory(
        "MASTERS_1000",
      ),

    recordedAtp500:
      countTitlesByCategory(
        "ATP_500",
      ),

    recordedAtp250:
      countTitlesByCategory(
        "ATP_250",
      ),

    recordedAtpFinals:
      countTitlesByCategory(
        "ATP_FINALS",
      ),

    recordedOlympicGold:
      countTitlesByCategory(
        "OLYMPICS",
      ),

    davisCupTitles,

    firstRecordedYear:
      playerTournamentEditions.length >
      0
        ? Math.min(
            ...playerTournamentEditions.map(
              (edition) =>
                edition.year,
            ),
          )
        : null,

    lastRecordedYear:
      playerTournamentEditions.length >
      0
        ? Math.max(
            ...playerTournamentEditions.map(
              (edition) =>
                edition.year,
            ),
          )
        : null,
  };
}