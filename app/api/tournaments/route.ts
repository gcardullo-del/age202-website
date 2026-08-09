import {
  NextResponse,
} from "next/server";

import {
  CourtSurface,
  TournamentCategory,
} from "@/generated/prisma/client";

import {
  prisma,
} from "@/lib/prisma";

type CreateTournamentBody = {
  name?: unknown;
  shortName?: unknown;
  slug?: unknown;
  category?: unknown;
  surface?: unknown;
  city?: unknown;
  country?: unknown;
  countryCode?: unknown;
  venue?: unknown;
  foundedYear?: unknown;
  description?: unknown;
  history?: unknown;
  logoUrl?: unknown;
  heroImage?: unknown;
  websiteUrl?: unknown;
  active?: unknown;
  featured?: unknown;
  displayOrder?: unknown;
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

function optionalInteger(
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

function normalizeSlug(
  value: string,
): string {
  return value
    .trim()
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      "-",
    )
    .replace(
      /^-+|-+$/g,
      "",
    );
}

function parseCategory(
  value: unknown,
): TournamentCategory {
  if (
    typeof value !== "string" ||
    !Object.values(
      TournamentCategory,
    ).includes(
      value as TournamentCategory,
    )
  ) {
    throw new Error(
      "Invalid tournament category.",
    );
  }

  return value as TournamentCategory;
}

function parseSurface(
  value: unknown,
): CourtSurface {
  if (
    typeof value !== "string" ||
    !Object.values(
      CourtSurface,
    ).includes(
      value as CourtSurface,
    )
  ) {
    throw new Error(
      "Invalid court surface.",
    );
  }

  return value as CourtSurface;
}

export async function GET() {
  const tournaments =
    await prisma.tournament.findMany({
      orderBy: [
        {
          category: "asc",
        },
        {
          displayOrder: "asc",
        },
        {
          name: "asc",
        },
      ],
    });

  return NextResponse.json(
    tournaments,
    {
      status: 200,
    },
  );
}

export async function POST(
  request: Request,
) {
  try {
    const body =
      (await request.json()) as
        CreateTournamentBody;

    const name =
      requiredString(
        body.name,
        "Name",
      );

    const slug =
      normalizeSlug(
        requiredString(
          body.slug,
          "Slug",
        ),
      );

    if (!slug) {
      return NextResponse.json(
        {
          error:
            "Slug is invalid.",
        },
        {
          status: 400,
        },
      );
    }

    const category =
      parseCategory(
        body.category,
      );

    const surface =
      parseSurface(
        body.surface,
      );

    const country =
      requiredString(
        body.country,
        "Country",
      );

    const foundedYear =
      optionalInteger(
        body.foundedYear,
        "Founded year",
      );

    const displayOrder =
      optionalInteger(
        body.displayOrder,
        "Display order",
      );

    const existing =
      await prisma.tournament.findUnique({
        where: {
          slug,
        },

        select: {
          id: true,
        },
      });

    if (existing) {
      return NextResponse.json(
        {
          error:
            "A tournament with this slug already exists.",
        },
        {
          status: 409,
        },
      );
    }

    const tournament =
      await prisma.tournament.create({
        data: {
          name,
          slug,
          shortName:
            optionalString(
              body.shortName,
            ),
          category,
          surface,
          city:
            optionalString(
              body.city,
            ),
          country,
          countryCode:
            optionalString(
              body.countryCode,
            ),
          venue:
            optionalString(
              body.venue,
            ),
          foundedYear,
          description:
            optionalString(
              body.description,
            ),
          history:
            optionalString(
              body.history,
            ),
          logoUrl:
            optionalString(
              body.logoUrl,
            ),
          heroImage:
            optionalString(
              body.heroImage,
            ),
          websiteUrl:
            optionalString(
              body.websiteUrl,
            ),
          active:
            typeof body.active ===
            "boolean"
              ? body.active
              : true,
          featured:
            typeof body.featured ===
            "boolean"
              ? body.featured
              : false,
          displayOrder,
        },

        select: {
          id: true,
          name: true,
          slug: true,
          category: true,
          surface: true,
        },
      });

    return NextResponse.json(
      {
        tournament,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to create tournament.";

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