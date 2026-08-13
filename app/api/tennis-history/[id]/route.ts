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
  deleteTennisHistory,
  findTennisHistoryEntryById,
  publishTennisHistory,
  unpublishTennisHistory,
  updateTennisHistory,
} from "@/lib/services/tennis-history.service";


type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};


type UpdateTennisHistoryBody = {
  type?: unknown;
  slug?: unknown;
  year?: unknown;
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

  action?: unknown;
};


function optionalString(
  value: unknown,
): string | null | undefined {
  if (
    value === undefined
  ) {
    return undefined;
  }

  if (
    value === null
  ) {
    return null;
  }

  if (
    typeof value !== "string"
  ) {
    throw new Error(
      "Expected a string value.",
    );
  }

  const normalized =
    value.trim();

  return normalized || null;
}


function optionalInteger(
  value: unknown,
  field: string,
): number | undefined {
  if (
    value === undefined
  ) {
    return undefined;
  }

  if (
    value === null ||
    value === ""
  ) {
    throw new Error(
      `${field} must be an integer.`,
    );
  }

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


function optionalBoolean(
  value: unknown,
): boolean | undefined {
  if (
    value === undefined
  ) {
    return undefined;
  }

  if (
    typeof value !==
    "boolean"
  ) {
    throw new Error(
      "Expected a boolean value.",
    );
  }

  return value;
}


function parseOptionalEnumValue<
  T extends string,
>(
  value: unknown,
  values: readonly T[],
  field: string,
): T | null | undefined {
  if (
    value === undefined
  ) {
    return undefined;
  }

  if (
    value === null ||
    value === ""
  ) {
    return null;
  }

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


function parsePlayers(
  value: unknown,
): string[] | undefined {
  if (
    value === undefined
  ) {
    return undefined;
  }

  if (
    !Array.isArray(value)
  ) {
    throw new Error(
      "Players must be an array.",
    );
  }

  return value
    .map(
      (
        player,
        index,
      ) => {
        if (
          typeof player !==
          "string"
        ) {
          throw new Error(
            `Player ${index + 1} must be a string.`,
          );
        }

        return player.trim();
      },
    )
    .filter(Boolean);
}


function parseOptionalDate(
  value: unknown,
): Date | null | undefined {
  if (
    value === undefined
  ) {
    return undefined;
  }

  if (
    value === null ||
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


export async function GET(
  _request: Request,
  context: RouteContext,
) {
  try {
    const {
      id,
    } =
      await context.params;

    const entry =
      await findTennisHistoryEntryById(
        id,
      );

    if (!entry) {
      return NextResponse.json(
        {
          error:
            "Tennis History entry not found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        entry,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to load Tennis History entry.";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 400,
      },
    );
  }
}


export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    const {
      id,
    } =
      await context.params;

    const body =
      (await request.json()) as
        UpdateTennisHistoryBody;

    if (
      body.action ===
      "publish"
    ) {
      const entry =
        await publishTennisHistory(
          id,
        );

      return NextResponse.json(
        {
          entry,
        },
        {
          status: 200,
        },
      );
    }

    if (
      body.action ===
      "unpublish"
    ) {
      const entry =
        await unpublishTennisHistory(
          id,
        );

      return NextResponse.json(
        {
          entry,
        },
        {
          status: 200,
        },
      );
    }

    const entry =
      await updateTennisHistory(
        id,
        {
          type:
            parseOptionalEnumValue(
              body.type,
              Object.values(
                TennisHistoryEntryType,
              ),
              "Tennis History type",
            ) ??
            undefined,

          slug:
            optionalString(
              body.slug,
            ) ??
            undefined,

          year:
            optionalInteger(
              body.year,
              "Year",
            ),

          sortOrder:
            optionalInteger(
              body.sortOrder,
              "Sort order",
            ),

          era:
            parseOptionalEnumValue(
              body.era,
              Object.values(
                TennisHistoryEra,
              ),
              "Tennis History era",
            ) ??
            undefined,

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
            optionalString(
              body.title,
            ) ??
            undefined,

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
            parseOptionalEnumValue(
              body.status,
              Object.values(
                MuseumPageStatus,
              ),
              "publication status",
            ) ??
            undefined,

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
        status: 200,
      },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to update Tennis History entry.";

    const status =
      message
        .toLowerCase()
        .includes(
          "not found",
        )
        ? 404
        : message
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


export async function DELETE(
  _request: Request,
  context: RouteContext,
) {
  try {
    const {
      id,
    } =
      await context.params;

    const entry =
      await deleteTennisHistory(
        id,
      );

    return NextResponse.json(
      {
        entry,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to delete Tennis History entry.";

    const status =
      message
        .toLowerCase()
        .includes(
          "not found",
        )
        ? 404
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