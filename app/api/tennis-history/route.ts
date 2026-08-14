import {
  NextResponse,
} from "next/server";

import {
  MuseumPageStatus,
  TennisHistoryEntryType,
  TennisHistoryEra,
  TennisHistoryGender,
} from "@/generated/prisma/client";

import {
  AdminAuthError,
  requireAdmin,
} from "@/lib/auth/admin-auth";

import {
  createTennisHistory,
  listPublishedTennisHistoryEntries,
} from "@/lib/services/tennis-history.service";


type CreateTennisHistoryBody = {
  type?: unknown;
  slug?: unknown;
  year?: unknown;
  month?: unknown;
  day?: unknown;
  sortOrder?: unknown;
  era?: unknown;
  gender?: unknown;

  eyebrow?: unknown;
  title?: unknown;
  subtitle?: unknown;
  description?: unknown;
  quote?: unknown;
  achievement?: unknown;
  period?: unknown;

  country?: unknown;
  countryCode?: unknown;

  playerOne?: unknown;
  playerTwo?: unknown;
  players?: unknown;

  href?: unknown;

  imageUrl?: unknown;
  mediaId?: unknown;

  featured?: unknown;
  status?: unknown;
  publishedAt?: unknown;
};


function requiredString(
  value: unknown,
  field: string,
): string {
  if (
    typeof value !== "string" ||
    !value.trim()
  ) {
    throw new Error(
      `${field} is required.`,
    );
  }

  return value.trim();
}


function optionalString(
  value: unknown,
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


function requiredInteger(
  value: unknown,
  field: string,
): number {
  const parsed =
    typeof value === "number"
      ? value
      : Number.parseInt(
          String(value),
          10,
        );

  if (
    !Number.isInteger(
      parsed,
    )
  ) {
    throw new Error(
      `${field} must be an integer.`,
    );
  }

  return parsed;
}


function optionalInteger(
  value: unknown,
  field: string,
): number | undefined {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return undefined;
  }

  return requiredInteger(
    value,
    field,
  );
}


function optionalBoolean(
  value: unknown,
): boolean | undefined {
  return typeof value ===
    "boolean"
    ? value
    : undefined;
}


function parseEnumValue<T extends string>(
  value: unknown,
  values: readonly T[],
  field: string,
): T {
  if (
    typeof value !== "string" ||
    !values.includes(
      value as T,
    )
  ) {
    throw new Error(
      `Invalid ${field}.`,
    );
  }

  return value as T;
}


function parseOptionalEnumValue<
  T extends string,
>(
  value: unknown,
  values: readonly T[],
  field: string,
): T | null {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  return parseEnumValue(
    value,
    values,
    field,
  );
}


function parsePlayers(
  value: unknown,
): string[] {
  if (
    value === null ||
    value === undefined
  ) {
    return [];
  }

  if (
    !Array.isArray(value)
  ) {
    throw new Error(
      "Players must be an array.",
    );
  }

  return value.map(
    (
      player,
      index,
    ) =>
      requiredString(
        player,
        `Player ${index + 1}`,
      ),
  );
}


function parseOptionalDate(
  value: unknown,
): Date | null {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  if (
    typeof value !== "string"
  ) {
    throw new Error(
      "Published at must be a valid date.",
    );
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    throw new Error(
      "Published at must be a valid date.",
    );
  }

  return date;
}


/**
 * Public Tennis History timeline.
 *
 * Returns only PUBLISHED entries,
 * already ordered chronologically.
 */
export async function GET() {
  try {
    const entries =
      await listPublishedTennisHistoryEntries();

    return NextResponse.json(
      {
        entries,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to load Tennis History.";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 500,
      },
    );
  }
}


/**
 * Creates a Tennis History CMS entry.
 *
 * Used by the Admin editor.
 */
export async function POST(
  request: Request,
) {
  try {
    await requireAdmin();

    const body =
      (await request.json()) as
        CreateTennisHistoryBody;

    const entry =
      await createTennisHistory(
        {
          type:
            parseEnumValue(
              body.type,
              Object.values(
                TennisHistoryEntryType,
              ),
              "Tennis History type",
            ),

          slug:
            requiredString(
              body.slug,
              "Slug",
            ),

          year:
            requiredInteger(
              body.year,
              "Year",
            ),

          month:
            optionalInteger(
              body.month,
              "Month",
            ),

          day:
            optionalInteger(
              body.day,
              "Day",
            ),

          sortOrder:
            optionalInteger(
              body.sortOrder,
              "Sort order",
            ),

          era:
            parseEnumValue(
              body.era,
              Object.values(
                TennisHistoryEra,
              ),
              "Tennis History era",
            ),

          gender:
            parseOptionalEnumValue(
              body.gender,
              Object.values(
                TennisHistoryGender,
              ),
              "Tennis History gender",
            ),

          eyebrow:
            optionalString(
              body.eyebrow,
            ),

          title:
            requiredString(
              body.title,
              "Title",
            ),

          subtitle:
            optionalString(
              body.subtitle,
            ),

          description:
            optionalString(
              body.description,
            ),

          quote:
            optionalString(
              body.quote,
            ),

          achievement:
            optionalString(
              body.achievement,
            ),

          period:
            optionalString(
              body.period,
            ),

          country:
            optionalString(
              body.country,
            ),

          countryCode:
            optionalString(
              body.countryCode,
            ),

          playerOne:
            optionalString(
              body.playerOne,
            ),

          playerTwo:
            optionalString(
              body.playerTwo,
            ),

          players:
            parsePlayers(
              body.players,
            ),

          href:
            optionalString(
              body.href,
            ),

          imageUrl:
            optionalString(
              body.imageUrl,
            ),

          mediaId:
            optionalString(
              body.mediaId,
            ),

          featured:
            optionalBoolean(
              body.featured,
            ),

          status:
            body.status ===
              null ||
            body.status ===
              undefined ||
            body.status ===
              ""
              ? undefined
              : parseEnumValue(
                  body.status,
                  Object.values(
                    MuseumPageStatus,
                  ),
                  "publication status",
                ),

          publishedAt:
            parseOptionalDate(
              body.publishedAt,
            ),
        },
      );

    return NextResponse.json(
      {
        entry,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    if (
      error instanceof
      AdminAuthError
    ) {
      return NextResponse.json(
        {
          error:
            error.message,
        },
        {
          status:
            error.status,
        },
      );
    }

    const message =
      error instanceof Error
        ? error.message
        : "Unable to create Tennis History entry.";

    const status =
      message
        .toLowerCase()
        .includes(
          "already exists",
        )
        ? 409
        : 400;

    return NextResponse.json(
      {
        error: message,
      },
      {
        status,
      },
    );
  }
}