import {
  NextResponse,
} from "next/server";

import {
  CollaborationPartnerType,
  CollaborationProjectType,
  MuseumPageStatus,
} from "@/generated/prisma/client";

import {
  AdminAuthError,
  requireAdmin,
} from "@/lib/auth/admin-auth";

import {
  createCollaborationEntry,
  listPublishedCollaborations,
} from "@/lib/services/collaboration.service";


type CreateCollaborationBody = {
  slug?: unknown;
  sortOrder?: unknown;

  eyebrow?: unknown;
  title?: unknown;
  subtitle?: unknown;
  description?: unknown;
  story?: unknown;

  partnerName?: unknown;
  partnerType?: unknown;
  location?: unknown;
  year?: unknown;
  period?: unknown;

  projectTitle?: unknown;
  projectType?: unknown;
  outcome?: unknown;

  websiteUrl?: unknown;
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


function optionalNullableInteger(
  value: unknown,
  field: string,
): number | null {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
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
 * Public Collaborations archive.
 *
 * Returns only PUBLISHED collaborations,
 * already ordered for the public experience.
 */
export async function GET() {
  try {
    const collaborations =
      await listPublishedCollaborations();

    return NextResponse.json(
      {
        collaborations,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to load collaborations.";

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
 * Creates a Collaboration CMS entry.
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
        CreateCollaborationBody;

    const collaboration =
      await createCollaborationEntry(
        {
          slug:
            requiredString(
              body.slug,
              "Slug",
            ),

          sortOrder:
            optionalInteger(
              body.sortOrder,
              "Sort order",
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

          story:
            optionalString(
              body.story,
            ),

          partnerName:
            requiredString(
              body.partnerName,
              "Partner name",
            ),

          partnerType:
            parseEnumValue(
              body.partnerType,
              Object.values(
                CollaborationPartnerType,
              ),
              "collaboration partner type",
            ),

          location:
            optionalString(
              body.location,
            ),

          year:
            optionalNullableInteger(
              body.year,
              "Year",
            ),

          period:
            optionalString(
              body.period,
            ),

          projectTitle:
            optionalString(
              body.projectTitle,
            ),

          projectType:
            parseOptionalEnumValue(
              body.projectType,
              Object.values(
                CollaborationProjectType,
              ),
              "collaboration project type",
            ),

          outcome:
            optionalString(
              body.outcome,
            ),

          websiteUrl:
            optionalString(
              body.websiteUrl,
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
        collaboration,
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
        : "Unable to create collaboration.";

    const normalized =
      message.toLowerCase();

    const status =
      normalized.includes(
        "already exists",
      ) ||
      normalized.includes(
        "unique constraint",
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