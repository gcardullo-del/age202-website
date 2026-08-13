"use server";

import {
  revalidatePath,
} from "next/cache";

import {
  redirect,
} from "next/navigation";

import {
  requireAdmin,
} from "@/lib/auth/admin-auth";

import {
  prisma,
} from "@/lib/prisma";

const TOURNAMENT_CATEGORIES = new Set([
  "GRAND_SLAM",
  "ATP_FINALS",
  "MASTERS_1000",
  "ATP_500",
  "ATP_250",
  "OLYMPICS",
  "DAVIS_CUP",
  "OTHER",
] as const);

const COURT_SURFACES = new Set([
  "HARD",
  "CLAY",
  "GRASS",
  "CARPET",
  "INDOOR_HARD",
  "OTHER",
] as const);

function requiredText(
  formData: FormData,
  key: string,
): string {
  const value =
    formData.get(key);

  if (
    typeof value !== "string" ||
    !value.trim()
  ) {
    throw new Error(
      `${key} is required.`,
    );
  }

  return value.trim();
}

function optionalText(
  formData: FormData,
  key: string,
): string | null {
  const value =
    formData.get(key);

  if (typeof value !== "string") {
    return null;
  }

  const normalized =
    value.trim();

  return normalized || null;
}

function optionalInteger(
  formData: FormData,
  key: string,
): number | null {
  const value =
    optionalText(
      formData,
      key,
    );

  if (value === null) {
    return null;
  }

  const parsed =
    Number.parseInt(
      value,
      10,
    );

  if (!Number.isInteger(parsed)) {
    throw new Error(
      `${key} must be an integer.`,
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

export async function updateTournamentIdentity(
  tournamentId: string,
  formData: FormData,
) {
  await requireAdmin();

  const name =
    requiredText(
      formData,
      "name",
    );

  const rawSlug =
    requiredText(
      formData,
      "slug",
    );

  const slug =
    normalizeSlug(
      rawSlug,
    );

  if (!slug) {
    throw new Error(
      "A valid tournament slug is required.",
    );
  }

  const category =
    requiredText(
      formData,
      "category",
    );

  if (
    !TOURNAMENT_CATEGORIES.has(
      category as
        | "GRAND_SLAM"
        | "ATP_FINALS"
        | "MASTERS_1000"
        | "ATP_500"
        | "ATP_250"
        | "OLYMPICS"
        | "DAVIS_CUP"
        | "OTHER",
    )
  ) {
    throw new Error(
      "Invalid tournament category.",
    );
  }

  const surface =
    requiredText(
      formData,
      "surface",
    );

  if (
    !COURT_SURFACES.has(
      surface as
        | "HARD"
        | "CLAY"
        | "GRASS"
        | "CARPET"
        | "INDOOR_HARD"
        | "OTHER",
    )
  ) {
    throw new Error(
      "Invalid court surface.",
    );
  }

  const country =
    requiredText(
      formData,
      "country",
    );

  const foundedYear =
    optionalInteger(
      formData,
      "foundedYear",
    );

  if (
    foundedYear !== null &&
    (
      foundedYear < 1800 ||
      foundedYear > 2200
    )
  ) {
    throw new Error(
      "Founded year is outside the allowed range.",
    );
  }

  const displayOrder =
    optionalInteger(
      formData,
      "displayOrder",
    );

  const existingTournament =
    await prisma.tournament.findUnique({
      where: {
        id: tournamentId,
      },

      select: {
        slug: true,
      },
    });

  if (!existingTournament) {
    throw new Error(
      "Tournament not found.",
    );
  }

  await prisma.tournament.update({
    where: {
      id: tournamentId,
    },

    data: {
      name,
      slug,

      shortName:
        optionalText(
          formData,
          "shortName",
        ),

      category:
        category as
          | "GRAND_SLAM"
          | "ATP_FINALS"
          | "MASTERS_1000"
          | "ATP_500"
          | "ATP_250"
          | "OLYMPICS"
          | "DAVIS_CUP"
          | "OTHER",

      surface:
        surface as
          | "HARD"
          | "CLAY"
          | "GRASS"
          | "CARPET"
          | "INDOOR_HARD"
          | "OTHER",

      city:
        optionalText(
          formData,
          "city",
        ),

      country,

      countryCode:
        optionalText(
          formData,
          "countryCode",
        )?.toUpperCase() ??
        null,

      venue:
        optionalText(
          formData,
          "venue",
        ),

      foundedYear,

      displayOrder,

      active:
        formData.get(
          "active",
        ) === "on",

      featured:
        formData.get(
          "featured",
        ) === "on",
    },
  });

  revalidatePath(
    "/admin/tournaments",
  );

  revalidatePath(
    `/admin/tournaments/${existingTournament.slug}`,
  );

  revalidatePath(
    `/admin/tournaments/${slug}`,
  );

  if (
    category ===
    "MASTERS_1000"
  ) {
    revalidatePath(
      `/results/masters-1000/${slug}`,
    );
  }

  redirect(
    `/admin/tournaments/${slug}?saved=identity`,
  );
}