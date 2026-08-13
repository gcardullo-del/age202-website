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

export async function updateTournamentMedia(
  tournamentId: string,
  formData: FormData,
) {
  await requireAdmin();

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

  await prisma.tournament.update({
    where: {
      id: tournamentId,
    },

    data: {
      heroImage:
        optionalText(
          formData,
          "heroImage",
        ),

      logoUrl:
        optionalText(
          formData,
          "logoUrl",
        ),

      websiteUrl:
        optionalText(
          formData,
          "websiteUrl",
        ),

      description:
        optionalText(
          formData,
          "description",
        ),
    },
  });

  revalidatePath(
    "/admin/tournaments",
  );

  revalidatePath(
    `/admin/tournaments/${tournament.slug}`,
  );

  if (
    tournament.category ===
    "MASTERS_1000"
  ) {
    revalidatePath(
      `/results/masters-1000/${tournament.slug}`,
    );
  }

  redirect(
    `/admin/tournaments/${tournament.slug}?saved=media`,
  );
}