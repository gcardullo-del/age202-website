
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
  deleteCollaborationEntry,
  findCollaborationById,
  updateCollaborationEntry,
} from "@/lib/services/collaboration.service";


type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};


type UpdateCollaborationBody = {
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


function optionalString(
  value: unknown,
  field: string,
): string | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (typeof value !== "string") {
    throw new Error(
      `${field} must be a string.`,
    );
  }

  const normalized =
    value.trim();

  return normalized || null;
}


function optionalRequiredString(
  value: unknown,
  field: string,
): string | undefined {
  if (value === undefined) {
    return undefined;
  }

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

  if (!Number.isInteger(parsed)) {
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
  if (value === undefined) {
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

  return requiredInteger(
    value,
    field,
  );
}


function optionalNullableInteger(
  value: unknown,
  field: string,
): number | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (
    value === null ||
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
  field: string,
): boolean | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "boolean") {
    throw new Error(
      `${field} must be a boolean.`,
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
  nullable = false,
): T | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (
    nullable &&
    (
      value === null ||
      value === ""
    )
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


function parseOptionalDate(
  value: unknown,
): Date | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (
    value === null ||
    value === ""
  ) {
    return null;
  }

  if (typeof value !== "string") {
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


function errorStatus(
  message: string,
): number {
  const normalized =
    message.toLowerCase();

  if (
    normalized.includes(
      "record to update not found",
    ) ||
    normalized.includes(
      "record to delete does not exist",
    ) ||
    normalized.includes(
      "not found",
    )
  ) {
    return 404;
  }

  if (
    normalized.includes(
      "unique constraint",
    ) ||
    normalized.includes(
      "already exists",
    )
  ) {
    return 409;
  }

  return 400;
}


/**
 * Returns one Collaboration CMS entry by id.
 */
export async function GET(
  _request: Request,
  context: RouteContext,
) {
  try {
    const {
      id,
    } = await context.params;

    const collaboration =
      await findCollaborationById(
        id,
      );

    if (!collaboration) {
      return NextResponse.json(
        {
          error:
            "Collaboration not found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        collaboration,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to load collaboration.";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: errorStatus(
          message,
        ),
      },
    );
  }
}


/**
 * Updates one Collaboration CMS entry.
 */
export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    await requireAdmin();

    const {
      id,
    } = await context.params;

    const body =
      (await request.json()) as
        UpdateCollaborationBody;

    const collaboration =
      await updateCollaborationEntry(
        id,
        {
          slug:
            optionalRequiredString(
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
              "Eyebrow",
            ),

          title:
            optionalRequiredString(
              body.title,
              "Title",
            ),

          subtitle:
            optionalString(
              body.subtitle,
              "Subtitle",
            ),

          description:
            optionalString(
              body.description,
              "Description",
            ),

          story:
            optionalString(
              body.story,
              "Story",
            ),

          partnerName:
            optionalRequiredString(
              body.partnerName,
              "Partner name",
            ),

          partnerType:
            parseOptionalEnumValue(
              body.partnerType,
              Object.values(
                CollaborationPartnerType,
              ),
              "collaboration partner type",
            ) ?? undefined,

          location:
            optionalString(
              body.location,
              "Location",
            ),

          year:
            optionalNullableInteger(
              body.year,
              "Year",
            ),

          period:
            optionalString(
              body.period,
              "Period",
            ),

          projectTitle:
            optionalString(
              body.projectTitle,
              "Project title",
            ),

          projectType:
            parseOptionalEnumValue(
              body.projectType,
              Object.values(
                CollaborationProjectType,
              ),
              "collaboration project type",
              true,
            ),

          outcome:
            optionalString(
              body.outcome,
              "Outcome",
            ),

          websiteUrl:
            optionalString(
              body.websiteUrl,
              "Website URL",
            ),

          href:
            optionalString(
              body.href,
              "Href",
            ),

          imageUrl:
            optionalString(
              body.imageUrl,
              "Image URL",
            ),

          mediaId:
            optionalString(
              body.mediaId,
              "Media id",
            ),

          featured:
            optionalBoolean(
              body.featured,
              "Featured",
            ),

          status:
            parseOptionalEnumValue(
              body.status,
              Object.values(
                MuseumPageStatus,
              ),
              "publication status",
            ) ?? undefined,

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
        status: 200,
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
        : "Unable to update collaboration.";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: errorStatus(
          message,
        ),
      },
    );
  }
}


/**
 * Deletes one Collaboration CMS entry.
 *
 * Any linked MediaAsset remains in the Media Library.
 */
export async function DELETE(
  _request: Request,
  context: RouteContext,
) {
  try {
    await requireAdmin();

    const {
      id,
    } = await context.params;

    await deleteCollaborationEntry(
      id,
    );

    return NextResponse.json(
      {
        success: true,
      },
      {
        status: 200,
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
        : "Unable to delete collaboration.";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: errorStatus(
          message,
        ),
      },
    );
  }
}