import "dotenv/config";

import { prisma } from "../lib/prisma";

type PlayerCandidate = {
  id: string;
  name: string;
  slug: string;
  firstName: string | null;
  lastName: string | null;
  rank: number | null;
};

type SafeMatch = {
  editionId: string;
  year: number;
  tournamentName: string;
  tournamentCategory: string;
  championName: string;
  playerId: string;
  playerName: string;
  rank: number | null;
};

function normalizeName(
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

function buildPlayerAliases(
  player: PlayerCandidate,
): string[] {
  const aliases =
    new Set<string>();

  aliases.add(
    normalizeName(
      player.name,
    ),
  );

  if (
    player.firstName &&
    player.lastName
  ) {
    aliases.add(
      normalizeName(
        `${player.firstName} ${player.lastName}`,
      ),
    );

    aliases.add(
      normalizeName(
        `${player.lastName} ${player.firstName}`,
      ),
    );
  }

  aliases.add(
    normalizeName(
      player.slug.replace(
        /-/g,
        " ",
      ),
    ),
  );

  return Array.from(
    aliases,
  ).filter(Boolean);
}

async function main() {
  console.log("");
  console.log(
    "AGE202 TROPHY EDITION LINKER",
  );

  console.log(
    "────────────────────────────────────────",
  );

  console.log("");

  /*
   * 1. Recuperiamo esclusivamente
   *    i Top 50 ATP AGE202 collegati
   *    a un vero record Player.
   */
  const topPlayersRaw =
    await prisma.atpPlayer.findMany({
      where: {
        active: true,

        rank: {
          lte: 50,
        },

        playerId: {
          not: null,
        },
      },

      select: {
        rank: true,

        player: {
          select: {
            id: true,
            name: true,
            slug: true,
            firstName: true,
            lastName: true,
          },
        },
      },

      orderBy: {
        rank: "asc",
      },
    });

  const players: PlayerCandidate[] =
    topPlayersRaw
      .filter(
        (
          entry,
        ): entry is typeof entry & {
          player: NonNullable<
            typeof entry.player
          >;
        } =>
          entry.player !== null,
      )
      .map(
        (entry) => ({
          id:
            entry.player.id,

          name:
            entry.player.name,

          slug:
            entry.player.slug,

          firstName:
            entry.player.firstName,

          lastName:
            entry.player.lastName,

          rank:
            entry.rank,
        }),
      );

  console.log(
    `Top 50 linked players: ${players.length}`,
  );

  /*
   * 2. Costruiamo un indice:
   *
   *    nome normalizzato
   *           ↓
   *    uno o più Player
   *
   *    Se più Player condividessero
   *    lo stesso alias, NON faremo
   *    alcun aggiornamento.
   */
  const aliasToPlayers =
    new Map<
      string,
      PlayerCandidate[]
    >();

  for (
    const player
    of players
  ) {
    const aliases =
      buildPlayerAliases(
        player,
      );

    for (
      const alias
      of aliases
    ) {
      const existing =
        aliasToPlayers.get(
          alias,
        ) ?? [];

      existing.push(
        player,
      );

      aliasToPlayers.set(
        alias,
        existing,
      );
    }
  }

  /*
   * 3. Leggiamo SOLO edizioni:
   *
   *    - non cancellate
   *    - con championName
   *    - ancora senza championPlayerId
   */
  const editions =
    await prisma.tournamentEdition.findMany({
      where: {
        cancelled: false,

        championPlayerId: null,

        championName: {
          not: null,
        },
      },

      select: {
        id: true,
        year: true,
        championName: true,

        tournament: {
          select: {
            name: true,
            category: true,
          },
        },
      },

      orderBy: [
        {
          year: "asc",
        },
      ],
    });

  console.log(
    `Unlinked named editions: ${editions.length}`,
  );

  /*
   * 4. Prepariamo esclusivamente
   *    match sicuri 1 → 1.
   *
   *    Nessuna scrittura avviene
   *    durante questa fase.
   */
  const safeMatches:
    SafeMatch[] = [];

  let ambiguousEditions =
    0;

  let unmatchedEditions =
    0;

  for (
    const edition
    of editions
  ) {
    const championName =
      edition.championName;

    if (!championName) {
      continue;
    }

    const normalizedName =
      normalizeName(
        championName,
      );

    const candidates =
      aliasToPlayers.get(
        normalizedName,
      ) ?? [];

    if (
      candidates.length === 0
    ) {
      unmatchedEditions += 1;
      continue;
    }

    if (
      candidates.length > 1
    ) {
      ambiguousEditions += 1;
      continue;
    }

    const player =
      candidates[0];

    safeMatches.push({
      editionId:
        edition.id,

      year:
        edition.year,

      tournamentName:
        edition.tournament.name,

      tournamentCategory:
        edition.tournament.category,

      championName,

      playerId:
        player.id,

      playerName:
        player.name,

      rank:
        player.rank,
    });
  }

  console.log(
    `Safe matches found: ${safeMatches.length}`,
  );

  console.log(
    `Ambiguous editions skipped: ${ambiguousEditions}`,
  );

  console.log(
    `Unmatched editions skipped: ${unmatchedEditions}`,
  );

  console.log("");

  /*
   * Safety stop:
   *
   * se non troviamo nulla,
   * non facciamo partire transazioni.
   */
  if (
    safeMatches.length === 0
  ) {
    console.log(
      "Nothing to link.",
    );

    console.log(
      "No database records were modified.",
    );

    console.log("");

    return;
  }

  console.log(
    "SAFE MATCHES TO LINK",
  );

  console.log(
    "────────────────────────────────────────",
  );

  for (
    const match
    of safeMatches
  ) {
    console.log(
      [
        match.year,
        match.tournamentName,
        match.championName,
        "→",
        `#${match.rank ?? "—"}`,
        match.playerName,
      ].join(
        " | ",
      ),
    );
  }

  console.log("");
  console.log(
    "────────────────────────────────────────",
  );

  console.log(
    `Starting transaction for ${safeMatches.length} editions...`,
  );

  /*
   * 5. Scrittura atomica.
   *
   * updateMany viene usato con:
   *
   * - ID preciso dell'edizione
   * - championPlayerId ancora null
   *
   * Quindi non sovrascriviamo
   * MAI un collegamento già presente.
   *
   * Se qualcosa fallisce,
   * Prisma effettua rollback
   * dell'intera transazione.
   */
  const linkedCount =
    await prisma.$transaction(
      async (
        tx,
      ) => {
        let count =
          0;

        for (
          const match
          of safeMatches
        ) {
          const result =
            await tx.tournamentEdition.updateMany({
              where: {
                id:
                  match.editionId,

                championPlayerId:
                  null,
              },

              data: {
                championPlayerId:
                  match.playerId,
              },
            });

          if (
            result.count === 1
          ) {
            count += 1;

            console.log(
              [
                "✓ LINKED",
                match.year,
                match.tournamentName,
                match.championName,
                "→",
                match.playerName,
              ].join(
                " | ",
              ),
            );

            continue;
          }

          /*
           * Se un record cambia tra
           * audit e scrittura, fermiamo
           * tutto e facciamo rollback.
           */
          throw new Error(
            [
              "Safety check failed.",
              `Edition ${match.editionId}`,
              "was not updated exactly once.",
              "Transaction aborted.",
            ].join(
              " ",
            ),
          );
        }

        return count;
      },
    );

  console.log("");
  console.log(
    "────────────────────────────────────────",
  );

  console.log(
    `Linked editions: ${linkedCount}`,
  );

  console.log(
    `Expected editions: ${safeMatches.length}`,
  );

  if (
    linkedCount !==
    safeMatches.length
  ) {
    throw new Error(
      "Linked edition count does not match safe match count.",
    );
  }

  console.log("");
  console.log(
    "🏆 AGE202 tournament champion linking completed.",
  );

  console.log(
    "Only previously-unlinked tournament editions were modified.",
  );

  console.log("");
}

main()
  .catch(
    (error) => {
      console.error("");
      console.error(
        "❌ AGE202 trophy edition linking failed.",
      );

      console.error(
        error,
      );

      console.error("");

      process.exitCode = 1;
    },
  )
  .finally(
    async () => {
      await prisma.$disconnect();
    },
  );