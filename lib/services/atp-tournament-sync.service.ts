import {
     Prisma,
  TournamentCategory,
  TournamentCircuit,
} from "@/generated/prisma/client";

import {
  prisma,
} from "@/lib/prisma";


const SUPPORTED_TOUR_CATEGORIES = new Set<TournamentCategory>([
  TournamentCategory.ATP_250,
  TournamentCategory.ATP_500,
  TournamentCategory.MASTERS_1000,
]);


export type AtpTournamentResultInput = {
  tournamentSlug: string;

  year: number;
  editionKey?: string;
  editionLabel?: string | null;

  startDate?: Date | null;
  endDate?: Date | null;
  drawSize?: number | null;

  champion: {
    name: string;
    profileSlug?: string | null;
    countryCode?: string | null;
  };

  runnerUp: {
    name: string;
    profileSlug?: string | null;
    countryCode?: string | null;
  };

  score?: string | null;
};


export type AtpTournamentSyncResult = {
  tournament: {
    id: string;
    name: string;
    slug: string;
    category: TournamentCategory;
  };

  edition: {
    id: string;
    year: number;
    editionKey: string;
    circuit: TournamentCircuit;
    created: boolean;
  };

  champion: {
    playerId: string;
    name: string;
    slug: string;
  };

  runnerUp: {
    playerId: string;
    name: string;
    slug: string;
  };
};


export type TransactionClient =
  Prisma.TransactionClient;


export type ResolvedPlayer = {
  id: string;
  name: string;
  slug: string;
  country: string | null;
  countryCode: string | null;
};


function normalizeText(
  value: string | null | undefined,
): string | null {
  const normalized =
    value?.trim();

  return normalized || null;
}


function normalizeComparableName(
  value: string | null | undefined,
): string {
  return (
    normalizeText(value)
      ?.toLocaleLowerCase()
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        "",
      )
      .replace(
        /[^a-z0-9]+/g,
        " ",
      )
      .trim()
      .replace(
        /\s+/g,
        " ",
      ) ??
    ""
  );
}


function requiredText(
  value: string | null | undefined,
  label: string,
): string {
  const normalized =
    normalizeText(
      value,
    );

  if (!normalized) {
    throw new Error(
      `${label} is required.`,
    );
  }

  return normalized;
}


function normalizeSlug(
  value: string | null | undefined,
): string | null {
  const normalized =
    normalizeText(
      value,
    )
      ?.toLowerCase()
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        "",
      )
      .replace(
        /[^a-z0-9]+/g,
        "-",
      )
      .replace(
        /^-+|-+$/g,
        "",
      );

  return normalized || null;
}


function normalizeCountryCode(
  value: string | null | undefined,
): string | null {
  const normalized =
    normalizeText(
      value,
    );

  return normalized
    ? normalized
        .toUpperCase()
        .slice(
          0,
          3,
        )
    : null;
}


function validateYear(
  year: number,
) {
  if (
    !Number.isInteger(
      year,
    ) ||
    year < 1800 ||
    year > 2200
  ) {
    throw new Error(
      "Tournament year is outside the allowed range.",
    );
  }
}


function normalizeEditionKey(
  value: string | null | undefined,
): string {
  return (
    normalizeSlug(
      value,
    ) ??
    "main"
  );
}


function getArchiveCollectionType(
  age: number | null,
) {
  return age !== null &&
    age <= 23
    ? ("RISING_STAR" as const)
    : ("ARCHIVE" as const);
}


export async function resolvePlayer(
  transaction: TransactionClient,
  input: {
    name: string;
    profileSlug?: string | null;
    countryCode?: string | null;
  },
): Promise<ResolvedPlayer> {
  const name =
    requiredText(
      input.name,
      "Player name",
    );

  const profileSlug =
    normalizeSlug(
      input.profileSlug,
    );

  const requestedCountryCode =
    normalizeCountryCode(
      input.countryCode,
    );


  /*
   * 1.
   * Preferiamo lo slug ATP quando il parser lo possiede.
   */
  if (profileSlug) {
    const atpPlayer =
      await transaction.atpPlayer.findUnique({
        where: {
          slug:
            profileSlug,
        },

        select: {
          id: true,
          name: true,
          slug: true,
          country: true,
          countryCode: true,
          age: true,
          imageUrl: true,
          playerId: true,

          player: {
            select: {
              id: true,
              name: true,
              slug: true,
              country: true,
            },
          },
        },
      });


    if (atpPlayer?.player) {
      return {
        id:
          atpPlayer.player.id,

        name:
          atpPlayer.player.name,

        slug:
          atpPlayer.player.slug,

        country:
          atpPlayer.player.country,

        countryCode:
          atpPlayer.countryCode,
      };
    }


    if (atpPlayer) {
      const existingPlayerBySlug =
        await transaction.player.findUnique({
          where: {
            slug:
              atpPlayer.slug,
          },

          select: {
            id: true,
            name: true,
            slug: true,
            country: true,
          },
        });


      const player =
        existingPlayerBySlug ??
        await transaction.player.create({
          data: {
            name:
              atpPlayer.name,

            slug:
              atpPlayer.slug,

            country:
              atpPlayer.country,

            portraitImage:
              atpPlayer.imageUrl,

            collectionType:
              getArchiveCollectionType(
                atpPlayer.age,
              ),

            active:
              true,
          },

          select: {
            id: true,
            name: true,
            slug: true,
            country: true,
          },
        });


      await transaction.atpPlayer.update({
        where: {
          id:
            atpPlayer.id,
        },

        data: {
          playerId:
            player.id,
        },
      });


      return {
        ...player,

        countryCode:
          atpPlayer.countryCode,
      };
    }


    /*
     * Lo slug ATP può identificare già
     * un Player AGE202 anche quando
     * non esiste ancora il relativo
     * record AtpPlayer.
     *
     * Esempio:
     * G. Monfils -> gael-monfils -> Gael Monfils
     */
    const existingPlayerByProfileSlug =
      await transaction.player.findUnique({
        where: {
          slug:
            profileSlug,
        },

        select: {
          id:
            true,

          name:
            true,

          slug:
            true,

          country:
            true,

          atpPlayer: {
            select: {
              countryCode:
                true,
            },
          },
        },
      });


    if (existingPlayerByProfileSlug) {
      return {
        id:
          existingPlayerByProfileSlug.id,

        name:
          existingPlayerByProfileSlug.name,

        slug:
          existingPlayerByProfileSlug.slug,

        country:
          existingPlayerByProfileSlug.country,

        countryCode:
          existingPlayerByProfileSlug.atpPlayer
            ?.countryCode ??
          requestedCountryCode,
      };
    }
  }


  /*
   * 2.
   * Fallback sicuro: Player AGE202 con nome esatto.
   */
  const directPlayers =
    await transaction.player.findMany({
      where: {
        name: {
          equals:
            name,

          mode:
            "insensitive",
        },

        active:
          true,
      },

      select: {
        id: true,
        name: true,
        slug: true,
        country: true,

        atpPlayer: {
          select: {
            countryCode: true,
          },
        },
      },

      take: 2,
    });


  if (
    directPlayers.length ===
    1
  ) {
    const player =
      directPlayers[0];

    return {
      id:
        player.id,

      name:
        player.name,

      slug:
        player.slug,

      country:
        player.country,

      countryCode:
        player.atpPlayer
          ?.countryCode ??
        requestedCountryCode,
    };
  }


  if (
    directPlayers.length >
    1
  ) {
    throw new Error(
      `Player resolution is ambiguous for "${name}".`,
    );
  }


  /*
   * 3.
   * Fallback: AtpPlayer con nome esatto.
   */
  const atpPlayers =
    await transaction.atpPlayer.findMany({
      where: {
        name: {
          equals:
            name,

          mode:
            "insensitive",
        },

        active:
          true,
      },

      select: {
        id: true,
        name: true,
        slug: true,
        country: true,
        countryCode: true,
        age: true,
        imageUrl: true,
        playerId: true,

        player: {
          select: {
            id: true,
            name: true,
            slug: true,
            country: true,
          },
        },
      },

      take: 2,
    });


  if (
    atpPlayers.length >
    1
  ) {
    throw new Error(
      `ATP player resolution is ambiguous for "${name}".`,
    );
  }


  /*
   * 4.
   * Fallback storico.
   */
  if (
    atpPlayers.length ===
    0
  ) {
    const historicalSlug =
      profileSlug ??
      normalizeSlug(
        name,
      );


    if (!historicalSlug) {
      throw new Error(
        `Unable to generate an AGE202 slug for historical player "${name}".`,
      );
    }


    const existingPlayerBySlug =
      await transaction.player.findUnique({
        where: {
          slug:
            historicalSlug,
        },

        select: {
          id: true,
          name: true,
          slug: true,
          country: true,
        },
      });


    if (existingPlayerBySlug) {
      const sameName =
        normalizeComparableName(
          existingPlayerBySlug.name,
        ) ===
        normalizeComparableName(
          name,
        );


      if (!sameName) {
        throw new Error(
          `Historical player slug collision for "${name}": slug "${historicalSlug}" already belongs to "${existingPlayerBySlug.name}".`,
        );
      }


      return {
        ...existingPlayerBySlug,

        countryCode:
          requestedCountryCode,
      };
    }


    const historicalPlayer =
      await transaction.player.create({
        data: {
          name,

          slug:
            historicalSlug,

          country:
            null,

          portraitImage:
            null,

          collectionType:
            "ARCHIVE",

          active:
            true,
        },

        select: {
          id: true,
          name: true,
          slug: true,
          country: true,
        },
      });


    return {
      ...historicalPlayer,

      countryCode:
        requestedCountryCode,
    };
  }


  const atpPlayer =
    atpPlayers[0];


  if (
    requestedCountryCode &&
    atpPlayer.countryCode !==
      requestedCountryCode
  ) {
    throw new Error(
      `Country mismatch while resolving "${name}": expected ${requestedCountryCode}, found ${atpPlayer.countryCode}.`,
    );
  }


  if (atpPlayer.player) {
    return {
      id:
        atpPlayer.player.id,

      name:
        atpPlayer.player.name,

      slug:
        atpPlayer.player.slug,

      country:
        atpPlayer.player.country,

      countryCode:
        atpPlayer.countryCode,
    };
  }


  const existingPlayerBySlug =
    await transaction.player.findUnique({
      where: {
        slug:
          atpPlayer.slug,
      },

      select: {
        id: true,
        name: true,
        slug: true,
        country: true,
      },
    });


  const player =
    existingPlayerBySlug ??
    await transaction.player.create({
      data: {
        name:
          atpPlayer.name,

        slug:
          atpPlayer.slug,

        country:
          atpPlayer.country,

        portraitImage:
          atpPlayer.imageUrl,

        collectionType:
          getArchiveCollectionType(
            atpPlayer.age,
          ),

        active:
          true,
      },

      select: {
        id: true,
        name: true,
        slug: true,
        country: true,
      },
    });


  await transaction.atpPlayer.update({
    where: {
      id:
        atpPlayer.id,
    },

    data: {
      playerId:
        player.id,
    },
  });


  return {
    ...player,

    countryCode:
      atpPlayer.countryCode,
  };
}


async function syncTournamentChampionSummary(
  transaction: TransactionClient,
  tournamentId: string,
  player: ResolvedPlayer,
) {
  const [
    titleEditions,
    runnerUpEditions,
  ] =
    await Promise.all([
      transaction.tournamentEdition.findMany({
        where: {
          tournamentId,

          circuit:
            TournamentCircuit.ATP,

          championPlayerId:
            player.id,

          cancelled:
            false,
        },

        select: {
          year: true,
        },

        orderBy: {
          year:
            "asc",
        },
      }),

      transaction.tournamentEdition.count({
        where: {
          tournamentId,

          circuit:
            TournamentCircuit.ATP,

          runnerUpPlayerId:
            player.id,

          cancelled:
            false,
        },
      }),
    ]);


  if (
    titleEditions.length ===
    0
  ) {
    const existingChampion =
      await transaction.tournamentChampion.findUnique({
        where: {
          tournamentId_playerId: {
            tournamentId,
            playerId:
              player.id,
          },
        },

        select: {
          id: true,
          titles: true,
        },
      });


    if (existingChampion) {
      await transaction.tournamentChampion.update({
        where: {
          id:
            existingChampion.id,
        },

        data: {
          finals:
            existingChampion.titles +
            runnerUpEditions,
        },
      });
    }

    return;
  }


  const titleYears =
    titleEditions.map(
      (edition) =>
        edition.year,
    );

  const titles =
    titleYears.length;

  const firstTitleYear =
    titleYears[0] ??
    null;

  const lastTitleYear =
    titleYears[
      titleYears.length - 1
    ] ??
    null;

  const finals =
    titles +
    runnerUpEditions;


  const linkedChampion =
    await transaction.tournamentChampion.findUnique({
      where: {
        tournamentId_playerId: {
          tournamentId,
          playerId:
            player.id,
        },
      },
    });


  if (linkedChampion) {
    await transaction.tournamentChampion.update({
      where: {
        id:
          linkedChampion.id,
      },

      data: {
        name:
          player.name,

        country:
          player.country,

        countryCode:
          player.countryCode,

        titles,
        firstTitleYear,
        lastTitleYear,
        titleYears,
        finals,
      },
    });

    return;
  }


  const historicalChampion =
    await transaction.tournamentChampion.findFirst({
      where: {
        tournamentId,

        playerId:
          null,

        name: {
          equals:
            player.name,

          mode:
            "insensitive",
        },
      },

      orderBy: {
        createdAt:
          "asc",
      },
    });


  if (historicalChampion) {
    await transaction.tournamentChampion.update({
      where: {
        id:
          historicalChampion.id,
      },

      data: {
        playerId:
          player.id,

        name:
          player.name,

        country:
          player.country,

        countryCode:
          player.countryCode,

        titles,
        firstTitleYear,
        lastTitleYear,
        titleYears,
        finals,
      },
    });

    return;
  }


  await transaction.tournamentChampion.create({
    data: {
      tournamentId,

      playerId:
        player.id,

      name:
        player.name,

      country:
        player.country,

      countryCode:
        player.countryCode,

      titles,
      firstTitleYear,
      lastTitleYear,
      titleYears,
      finals,
    },
  });
}


export async function syncAtpTournamentResult(
  input: AtpTournamentResultInput,
): Promise<AtpTournamentSyncResult> {
  const tournamentSlug =
    requiredText(
      input.tournamentSlug,
      "Tournament slug",
    )
      .toLowerCase();

  const editionKey =
    normalizeEditionKey(
      input.editionKey,
    );

  validateYear(
    input.year,
  );


  const championName =
    requiredText(
      input.champion.name,
      "Champion name",
    );

  const runnerUpName =
    requiredText(
      input.runnerUp.name,
      "Runner-up name",
    );


  if (
    championName.localeCompare(
      runnerUpName,
      undefined,
      {
        sensitivity:
          "base",
      },
    ) ===
    0
  ) {
    throw new Error(
      "Champion and runner-up cannot be the same player.",
    );
  }


  return prisma.$transaction(
    async (transaction) => {
      const tournament =
        await transaction.tournament.findUnique({
          where: {
            slug:
              tournamentSlug,
          },

          select: {
            id: true,
            name: true,
            slug: true,
            category: true,
            active: true,
          },
        });


      if (!tournament) {
        throw new Error(
          `Tournament not found in AGE202: ${tournamentSlug}.`,
        );
      }


      if (!tournament.active) {
        throw new Error(
          `Tournament is inactive in AGE202: ${tournament.slug}.`,
        );
      }


      if (
        !SUPPORTED_TOUR_CATEGORIES.has(
          tournament.category,
        )
      ) {
        throw new Error(
          `${tournament.name} is ${tournament.category}; ATP Tournament Sync currently supports only ATP_250, ATP_500 and MASTERS_1000.`,
        );
      }


      const [
        champion,
        runnerUp,
      ] =
        await Promise.all([
          resolvePlayer(
            transaction,
            input.champion,
          ),

          resolvePlayer(
            transaction,
            input.runnerUp,
          ),
        ]);


      if (
        champion.id ===
        runnerUp.id
      ) {
        throw new Error(
          `Champion and runner-up resolved to the same AGE202 Player (${champion.name}).`,
        );
      }


      const existingEdition =
        await transaction.tournamentEdition.findUnique({
          where: {
            tournamentId_year_editionKey_circuit: {
              tournamentId:
                tournament.id,

              year:
                input.year,

              editionKey,

              circuit:
                TournamentCircuit.ATP,
            },
          },

          select: {
            id: true,
          },
        });


      const editionData = {
        editionLabel:
          normalizeText(
            input.editionLabel,
          ),

        startDate:
          input.startDate ??
          null,

        endDate:
          input.endDate ??
          null,

        drawSize:
          input.drawSize ??
          null,

        championName:
          champion.name,

        runnerUpName:
          runnerUp.name,

        championPlayerId:
          champion.id,

        runnerUpPlayerId:
          runnerUp.id,

        championCountryCode:
          champion.countryCode ??
          normalizeCountryCode(
            input.champion.countryCode,
          ),

        runnerUpCountryCode:
          runnerUp.countryCode ??
          normalizeCountryCode(
            input.runnerUp.countryCode,
          ),

        score:
          normalizeText(
            input.score,
          ),

        cancelled:
          false,
      };


      const edition =
        existingEdition
          ? await transaction.tournamentEdition.update({
              where: {
                id:
                  existingEdition.id,
              },

              data:
                editionData,

              select: {
                id: true,
                year: true,
                editionKey: true,
                circuit: true,
              },
            })
          : await transaction.tournamentEdition.create({
              data: {
                tournamentId:
                  tournament.id,

                year:
                  input.year,

                editionKey,

                circuit:
                  TournamentCircuit.ATP,

                ...editionData,
              },

              select: {
                id: true,
                year: true,
                editionKey: true,
                circuit: true,
              },
            });


      await syncTournamentChampionSummary(
        transaction,
        tournament.id,
        champion,
      );


      await syncTournamentChampionSummary(
        transaction,
        tournament.id,
        runnerUp,
      );


      return {
        tournament: {
          id:
            tournament.id,

          name:
            tournament.name,

          slug:
            tournament.slug,

          category:
            tournament.category,
        },

        edition: {
          id:
            edition.id,

          year:
            edition.year,

          editionKey:
            edition.editionKey,

          circuit:
            edition.circuit,

          created:
            !existingEdition,
        },

        champion: {
          playerId:
            champion.id,

          name:
            champion.name,

          slug:
            champion.slug,
        },

        runnerUp: {
          playerId:
            runnerUp.id,

          name:
            runnerUp.name,

          slug:
            runnerUp.slug,
        },
      };
    },
    {
      maxWait:
        10_000,

      timeout:
        30_000,
    },
  );
}