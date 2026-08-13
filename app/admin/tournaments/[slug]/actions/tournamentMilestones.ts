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

import { prisma } from "@/lib/prisma";

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

function integerValue(
  formData: FormData,
  key: string,
  fallback = 0,
): number {
  return (
    optionalInteger(
      formData,
      key,
    ) ?? fallback
  );
}

function validateYear(
  year: number | null,
) {
  if (
    year !== null &&
    (
      year < 1800 ||
      year > 2200
    )
  ) {
    throw new Error(
      "Milestone year is outside the allowed range.",
    );
  }
}

async function getTournamentContext(
  tournamentId: string,
) {
  const tournament =
    await prisma.tournament.findUnique({
      where: {
        id: tournamentId,
      },

      select: {
        slug: true,
        category: true,
      },
    });

  if (!tournament) {
    throw new Error(
      "Tournament not found.",
    );
  }

  return tournament;
}

function revalidateTournamentPaths(
  slug: string,
  category: string,
) {
  revalidatePath(
    "/admin/tournaments",
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
}

export async function createTournamentMilestone(
  tournamentId: string,
  formData: FormData,
) {
  await requireAdmin();

  const tournament =
    await getTournamentContext(
      tournamentId,
    );

  const year =
    optionalInteger(
      formData,
      "year",
    );

  validateYear(year);

  await prisma.tournamentMilestone.create({
    data: {
      tournamentId,
      year,

      title:
        requiredText(
          formData,
          "title",
        ),

      subtitle:
        optionalText(
          formData,
          "subtitle",
        ),

      description:
        optionalText(
          formData,
          "description",
        ),

      imageUrl:
        optionalText(
          formData,
          "imageUrl",
        ),

      sortOrder:
        integerValue(
          formData,
          "sortOrder",
        ),

      featured:
        formData.get(
          "featured",
        ) === "on",
    },
  });

  revalidateTournamentPaths(
    tournament.slug,
    tournament.category,
  );

  redirect(
    `/admin/tournaments/${tournament.slug}?saved=milestone`,
  );
}

export async function updateTournamentMilestone(
  tournamentId: string,
  milestoneId: string,
  formData: FormData,
) {
  await requireAdmin();

  const tournament =
    await getTournamentContext(
      tournamentId,
    );

  const milestone =
    await prisma.tournamentMilestone.findFirst({
      where: {
        id: milestoneId,
        tournamentId,
      },

      select: {
        id: true,
      },
    });

  if (!milestone) {
    throw new Error(
      "Milestone not found.",
    );
  }

  const year =
    optionalInteger(
      formData,
      "year",
    );

  validateYear(year);

  await prisma.tournamentMilestone.update({
    where: {
      id: milestone.id,
    },

    data: {
      year,

      title:
        requiredText(
          formData,
          "title",
        ),

      subtitle:
        optionalText(
          formData,
          "subtitle",
        ),

      description:
        optionalText(
          formData,
          "description",
        ),

      imageUrl:
        optionalText(
          formData,
          "imageUrl",
        ),

      sortOrder:
        integerValue(
          formData,
          "sortOrder",
        ),

      featured:
        formData.get(
          "featured",
        ) === "on",
    },
  });

  revalidateTournamentPaths(
    tournament.slug,
    tournament.category,
  );

  redirect(
    `/admin/tournaments/${tournament.slug}?saved=milestone`,
  );
}

export async function deleteTournamentMilestone(
  tournamentId: string,
  milestoneId: string,
) {
  await requireAdmin();

  const tournament =
    await getTournamentContext(
      tournamentId,
    );

  const milestone =
    await prisma.tournamentMilestone.findFirst({
      where: {
        id: milestoneId,
        tournamentId,
      },

      select: {
        id: true,
      },
    });

  if (!milestone) {
    throw new Error(
      "Milestone not found.",
    );
  }

  await prisma.tournamentMilestone.delete({
    where: {
      id: milestone.id,
    },
  });

  revalidateTournamentPaths(
    tournament.slug,
    tournament.category,
  );

  redirect(
    `/admin/tournaments/${tournament.slug}?saved=milestone`,
  );
}