import type {
  CareerEventCategory,
  Prisma,
} from "@/generated/prisma/client";

export type CareerTimelineFormEvent = {
  clientId?: string;
  year: string | number;
  month?: string | number | null;
  day?: string | number | null;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  category?: CareerEventCategory | null;
  imageUrl?: string | null;
  location?: string | null;
  tournament?: string | null;
  featured?: boolean;
  sortOrder?: string | number | null;
};

export type NormalizedCareerTimelineEvent = {
  year: number;
  month: number | null;
  day: number | null;
  title: string;
  subtitle: string | null;
  description: string | null;
  category: CareerEventCategory;
  imageUrl: string | null;
  location: string | null;
  tournament: string | null;
  featured: boolean;
  sortOrder: number;
};

const careerEventCategories =
  new Set<CareerEventCategory>([
    "DEBUT",
    "RANKING",
    "TITLE",
    "GRAND_SLAM",
    "MASTERS_1000",
    "ATP_FINALS",
    "OLYMPICS",
    "DAVIS_CUP",
    "RIVALRY",
    "COMEBACK",
    "RETIREMENT",
    "MILESTONE",
    "OTHER",
  ]);

const DEFAULT_CATEGORY:
  CareerEventCategory =
  "MILESTONE";

function normalizeOptionalString(
  value:
    | string
    | null
    | undefined,
): string | null {
  if (
    typeof value !== "string"
  ) {
    return null;
  }

  const normalized =
    value.trim();

  return normalized || null;
}

function parseInteger(
  value:
    | string
    | number
    | null
    | undefined,
  label: string,
): number {
  const parsed =
    typeof value === "number"
      ? value
      : Number.parseInt(
          String(value ?? ""),
          10,
        );

  if (
    !Number.isInteger(parsed)
  ) {
    throw new Error(
      `${label} must be a whole number.`,
    );
  }

  return parsed;
}

function parseOptionalInteger(
  value:
    | string
    | number
    | null
    | undefined,
  label: string,
): number | null {
  if (
    value === null ||
    value === undefined ||
    String(value).trim() === ""
  ) {
    return null;
  }

  return parseInteger(
    value,
    label,
  );
}

function normalizeCategory(
  value:
    | CareerEventCategory
    | null
    | undefined,
): CareerEventCategory {
  if (
    value &&
    careerEventCategories.has(
      value,
    )
  ) {
    return value;
  }

  return DEFAULT_CATEGORY;
}

function validateDateParts({
  year,
  month,
  day,
}: {
  year: number;
  month: number | null;
  day: number | null;
}): void {
  if (
    year < 1800 ||
    year > 2100
  ) {
    throw new Error(
      "Career event year must be between 1800 and 2100.",
    );
  }

  if (
    month !== null &&
    (
      month < 1 ||
      month > 12
    )
  ) {
    throw new Error(
      "Career event month must be between 1 and 12.",
    );
  }

  if (
    day !== null &&
    (
      day < 1 ||
      day > 31
    )
  ) {
    throw new Error(
      "Career event day must be between 1 and 31.",
    );
  }

  if (
    day !== null &&
    month === null
  ) {
    throw new Error(
      "Career event month is required when a day is provided.",
    );
  }

  if (
    month !== null &&
    day !== null
  ) {
    const date =
      new Date(
        Date.UTC(
          year,
          month - 1,
          day,
        ),
      );

    if (
      date.getUTCFullYear() !==
        year ||
      date.getUTCMonth() !==
        month - 1 ||
      date.getUTCDate() !== day
    ) {
      throw new Error(
        "Career event date is not valid.",
      );
    }
  }
}

export function parseCareerTimelinePayload(
  rawValue:
    | string
    | null
    | undefined,
): CareerTimelineFormEvent[] {
  if (
    !rawValue?.trim()
  ) {
    return [];
  }

  let parsed: unknown;

  try {
    parsed =
      JSON.parse(rawValue);
  } catch {
    throw new Error(
      "Career timeline payload is not valid JSON.",
    );
  }

  if (!Array.isArray(parsed)) {
    throw new Error(
      "Career timeline payload must be an array.",
    );
  }

  return parsed as CareerTimelineFormEvent[];
}

export function normalizeCareerTimelineEvents(
  events: CareerTimelineFormEvent[],
): NormalizedCareerTimelineEvent[] {
  return events.map(
    (event, index) => {
      const year =
        parseInteger(
          event.year,
          `Career event ${index + 1} year`,
        );

      const month =
        parseOptionalInteger(
          event.month,
          `Career event ${index + 1} month`,
        );

      const day =
        parseOptionalInteger(
          event.day,
          `Career event ${index + 1} day`,
        );

      validateDateParts({
        year,
        month,
        day,
      });

      const title =
        normalizeOptionalString(
          event.title,
        );

      if (!title) {
        throw new Error(
          `Career event ${index + 1} title is required.`,
        );
      }

      const sortOrder =
        parseOptionalInteger(
          event.sortOrder,
          `Career event ${index + 1} sort order`,
        ) ?? index;

      if (sortOrder < 0) {
        throw new Error(
          `Career event ${index + 1} sort order cannot be negative.`,
        );
      }

      return {
        year,
        month,
        day,
        title,
        subtitle:
          normalizeOptionalString(
            event.subtitle,
          ),
        description:
          normalizeOptionalString(
            event.description,
          ),
        category:
          normalizeCategory(
            event.category,
          ),
        imageUrl:
          normalizeOptionalString(
            event.imageUrl,
          ),
        location:
          normalizeOptionalString(
            event.location,
          ),
        tournament:
          normalizeOptionalString(
            event.tournament,
          ),
        featured:
          event.featured === true,
        sortOrder,
      };
    },
  );
}

export function sortCareerTimelineEvents<
  T extends {
    year: number;
    month: number | null;
    day: number | null;
    sortOrder: number;
  },
>(
  events: T[],
): T[] {
  return [...events].sort(
    (first, second) => {
      if (
        first.year !==
        second.year
      ) {
        return (
          first.year -
          second.year
        );
      }

      const firstMonth =
        first.month ?? 0;

      const secondMonth =
        second.month ?? 0;

      if (
        firstMonth !==
        secondMonth
      ) {
        return (
          firstMonth -
          secondMonth
        );
      }

      const firstDay =
        first.day ?? 0;

      const secondDay =
        second.day ?? 0;

      if (
        firstDay !==
        secondDay
      ) {
        return (
          firstDay -
          secondDay
        );
      }

      return (
        first.sortOrder -
        second.sortOrder
      );
    },
  );
}

export function prepareCareerTimelineCreateManyData({
  playerId,
  events,
}: {
  playerId: string;
  events: NormalizedCareerTimelineEvent[];
}): Prisma.PlayerCareerEventCreateManyInput[] {
  const normalizedPlayerId =
    playerId.trim();

  if (!normalizedPlayerId) {
    throw new Error(
      "playerId is required to create career timeline events.",
    );
  }

  return events.map(
    (event, index) => ({
      playerId:
        normalizedPlayerId,
      year: event.year,
      month: event.month,
      day: event.day,
      title: event.title,
      subtitle:
        event.subtitle,
      description:
        event.description,
      category:
        event.category,
      imageUrl:
        event.imageUrl,
      location:
        event.location,
      tournament:
        event.tournament,
      featured:
        event.featured,
      sortOrder: index,
    }),
  );
}

export async function replacePlayerCareerTimeline({
  transaction,
  playerId,
  events,
}: {
  transaction:
    Prisma.TransactionClient;
  playerId: string;
  events: NormalizedCareerTimelineEvent[];
}): Promise<void> {
  const normalizedPlayerId =
    playerId.trim();

  if (!normalizedPlayerId) {
    throw new Error(
      "playerId is required to replace the career timeline.",
    );
  }

  await transaction.playerCareerEvent.deleteMany({
    where: {
      playerId:
        normalizedPlayerId,
    },
  });

  if (events.length === 0) {
    return;
  }

  const orderedEvents =
    sortCareerTimelineEvents(
      events,
    ).map(
      (event, index) => ({
        ...event,
        sortOrder: index,
      }),
    );

  await transaction.playerCareerEvent.createMany({
    data:
      prepareCareerTimelineCreateManyData({
        playerId:
          normalizedPlayerId,
        events:
          orderedEvents,
      }),
  });
}

export function parseAndNormalizeCareerTimeline(
  rawValue:
    | string
    | null
    | undefined,
): NormalizedCareerTimelineEvent[] {
  return normalizeCareerTimelineEvents(
    parseCareerTimelinePayload(
      rawValue,
    ),
  );
}