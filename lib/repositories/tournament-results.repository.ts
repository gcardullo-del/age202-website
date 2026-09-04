import {
  TournamentCategory,
  TournamentCircuit,
} from "@/generated/prisma/client";

import {
  prisma,
} from "@/lib/prisma";


const RESULTS_TIME_ZONE =
  "Europe/Rome";


const supportedTournamentFilters = [
  {
    tournament: {
      category:
        TournamentCategory.GRAND_SLAM,
    },
  },
  {
    circuit:
      TournamentCircuit.ATP,

    tournament: {
      category:
        TournamentCategory.MASTERS_1000,
    },
  },
  {
    circuit:
      TournamentCircuit.WTA,

    tournament: {
      category:
        TournamentCategory.WTA_1000,
    },
  },
  {
    circuit:
      TournamentCircuit.ATP,

    tournament: {
      category:
        TournamentCategory.ATP_500,
    },
  },
];


const matchInclude = {
  edition: {
    include: {
      tournament:
        true,
    },
  },

  playerOne: {
    include: {
      player:
        true,
    },
  },

  playerTwo: {
    include: {
      player:
        true,
    },
  },

  winner: {
    include: {
      player:
        true,
    },
  },

  sets: {
    orderBy: {
      setNumber:
        "asc" as const,
    },
  },
};


const drawMatchInclude = {
  playerOne: {
    include: {
      player:
        true,
    },
  },

  playerTwo: {
    include: {
      player:
        true,
    },
  },

  winner: {
    include: {
      player:
        true,
    },
  },

  sets: {
    orderBy: {
      setNumber:
        "asc" as const,
    },
  },

  nextMatch:
    true,
};


type DateParts = {
  year: number;
  month: number;
  day: number;
};


function getDatePartsInTimeZone(
  date: Date,
  timeZone: string,
): DateParts {
  const formatter =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone,
        year:
          "numeric",
        month:
          "2-digit",
        day:
          "2-digit",
      },
    );


  const parts =
    formatter.formatToParts(
      date,
    );


  const values =
    Object.fromEntries(
      parts.map((part) => [
        part.type,
        part.value,
      ]),
    );


  return {
    year:
      Number(values.year),

    month:
      Number(values.month),

    day:
      Number(values.day),
  };
}


function getTimeZoneOffsetMilliseconds(
  date: Date,
  timeZone: string,
) {
  const formatter =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone,
        year:
          "numeric",
        month:
          "2-digit",
        day:
          "2-digit",
        hour:
          "2-digit",
        minute:
          "2-digit",
        second:
          "2-digit",
        hourCycle:
          "h23",
      },
    );


  const parts =
    formatter.formatToParts(
      date,
    );


  const values =
    Object.fromEntries(
      parts.map((part) => [
        part.type,
        part.value,
      ]),
    );


  const representedAsUtc =
    Date.UTC(
      Number(values.year),
      Number(values.month) - 1,
      Number(values.day),
      Number(values.hour),
      Number(values.minute),
      Number(values.second),
    );


  return (
    representedAsUtc -
    date.getTime()
  );
}


function createUtcDateFromZonedMidnight(
  parts: DateParts,
  timeZone: string,
) {
  const wallClockUtc =
    Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      0,
      0,
      0,
      0,
    );


  let utcTimestamp =
    wallClockUtc;


  for (
    let attempt = 0;
    attempt < 4;
    attempt += 1
  ) {
    const offset =
      getTimeZoneOffsetMilliseconds(
        new Date(
          utcTimestamp,
        ),
        timeZone,
      );


    const correctedTimestamp =
      wallClockUtc -
      offset;


    if (
      correctedTimestamp ===
      utcTimestamp
    ) {
      break;
    }


    utcTimestamp =
      correctedTimestamp;
  }


  return new Date(
    utcTimestamp,
  );
}


function addCalendarDays(
  parts: DateParts,
  days: number,
): DateParts {
  const date =
    new Date(
      Date.UTC(
        parts.year,
        parts.month - 1,
        parts.day +
          days,
      ),
    );


  return {
    year:
      date.getUTCFullYear(),

    month:
      date.getUTCMonth() +
      1,

    day:
      date.getUTCDate(),
  };
}


export function getResultsDayRange(
  date =
    new Date(),
) {
  const dateParts =
    getDatePartsInTimeZone(
      date,
      RESULTS_TIME_ZONE,
    );


  const nextDateParts =
    addCalendarDays(
      dateParts,
      1,
    );


  return {
    start:
      createUtcDateFromZonedMidnight(
        dateParts,
        RESULTS_TIME_ZONE,
      ),

    end:
      createUtcDateFromZonedMidnight(
        nextDateParts,
        RESULTS_TIME_ZONE,
      ),

    timeZone:
      RESULTS_TIME_ZONE,

    dateParts,
  };
}


export async function getTournamentMatchesForDay(
  date =
    new Date(),
) {
  const {
    start,
    end,
  } =
    getResultsDayRange(
      date,
    );


  return prisma.tournamentMatch.findMany({
    where: {
      OR: [
        {
          scheduledAt: {
            gte:
              start,

            lt:
              end,
          },
        },

        /*
         * ATP DAILY SCHEDULE
         *
         * ATP does not always publish an individual
         * start time for every match on a court.
         *
         * Those matches are intentionally stored with
         * scheduledAt = null rather than inventing a time.
         *
         * Daily ATP records use the provisional
         * "atp:daily:" external ID.
         *
         * IMPORTANT:
         * A provisional daily record must only be shown
         * on the day in which it was synchronized.
         *
         * Without this lastSyncedAt filter, a match with
         * scheduledAt = null would remain visible for the
         * entire active tournament.
         */
        {
          scheduledAt:
            null,

          externalId: {
            startsWith:
              "atp:daily:",
          },

          lastSyncedAt: {
            gte:
              start,

            lt:
              end,
          },

          edition: {
            is: {
              startDate: {
                lte:
                  date,
              },

              endDate: {
                gte:
                  date,
              },
            },
          },
        },
      ],

      edition: {
        is: {
          cancelled:
            false,

          OR:
            supportedTournamentFilters,
        },
      },
    },

    include:
      matchInclude,

    orderBy: [
      {
        scheduledAt:
          "asc",
      },
      {
        edition: {
          tournament: {
            displayOrder:
              "asc",
          },
        },
      },
      {
        roundOrder:
          "asc",
      },
      {
        matchNumber:
          "asc",
      },
    ],
  });
}


export async function getCurrentTournamentMatches() {
  const now =
    new Date();


  return prisma.tournamentMatch.findMany({
    where: {
      edition: {
        is: {
          cancelled:
            false,

          startDate: {
            lte:
              now,
          },

          endDate: {
            gte:
              now,
          },

          OR:
            supportedTournamentFilters,
        },
      },
    },

    include:
      matchInclude,

    orderBy: [
      {
        scheduledAt:
          "asc",
      },
      {
        roundOrder:
          "asc",
      },
      {
        matchNumber:
          "asc",
      },
    ],
  });
}


export async function getTournamentDraw({
  tournamentSlug,
  year,
  circuit,
  editionKey =
    "main",
}: {
  tournamentSlug: string;
  year: number;
  circuit: TournamentCircuit;
  editionKey?: string;
}) {
  const normalizedSlug =
    tournamentSlug
      .trim()
      .toLowerCase();


  if (
    !normalizedSlug ||
    !Number.isInteger(
      year,
    )
  ) {
    return null;
  }


  return prisma.tournamentEdition.findFirst({
    where: {
      year,
      circuit,
      editionKey,

      cancelled:
        false,

      tournament: {
        slug:
          normalizedSlug,

        active:
          true,
      },
    },

    include: {
      tournament:
        true,

      championPlayer:
        true,

      runnerUpPlayer:
        true,

      entries: {
        include: {
          player:
            true,
        },

        orderBy: [
          {
            seed:
              "asc",
          },
          {
            name:
              "asc",
          },
        ],
      },

      matches: {
        include:
          drawMatchInclude,

        orderBy: [
          {
            roundOrder:
              "asc",
          },
          {
            bracketPosition:
              "asc",
          },
          {
            matchNumber:
              "asc",
          },
        ],
      },
    },
  });
}


export async function getLatestTournamentDraw({
  tournamentSlug,
  circuit,
  editionKey =
    "main",
}: {
  tournamentSlug: string;
  circuit: TournamentCircuit;
  editionKey?: string;
}) {
  const normalizedSlug =
    tournamentSlug
      .trim()
      .toLowerCase();


  if (!normalizedSlug) {
    return null;
  }


  return prisma.tournamentEdition.findFirst({
    where: {
      circuit,
      editionKey,

      cancelled:
        false,

      tournament: {
        slug:
          normalizedSlug,

        active:
          true,
      },
    },

    include: {
      tournament:
        true,

      championPlayer:
        true,

      runnerUpPlayer:
        true,

      entries: {
        include: {
          player:
            true,
        },

        orderBy: [
          {
            seed:
              "asc",
          },
          {
            name:
              "asc",
          },
        ],
      },

      matches: {
        include:
          drawMatchInclude,

        orderBy: [
          {
            roundOrder:
              "asc",
          },
          {
            bracketPosition:
              "asc",
          },
          {
            matchNumber:
              "asc",
          },
        ],
      },
    },

    orderBy: {
      year:
        "desc",
    },
  });
}