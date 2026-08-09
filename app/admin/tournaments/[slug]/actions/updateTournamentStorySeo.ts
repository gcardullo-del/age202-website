"use server";

import {
  revalidatePath,
} from "next/cache";
import {
  redirect,
} from "next/navigation";

import { prisma } from "@/lib/prisma";

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

export async function updateTournamentStorySeo(
  tournamentId: string,
  formData: FormData,
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

  await prisma.tournament.update({
    where: {
      id: tournamentId,
    },

    data: {
      description:
        optionalText(
          formData,
          "description",
        ),

      history:
        optionalText(
          formData,
          "history",
        ),

      metaTitle:
        optionalText(
          formData,
          "metaTitle",
        ),

      metaDescription:
        optionalText(
          formData,
          "metaDescription",
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
    `/admin/tournaments/${tournament.slug}?saved=story-seo`,
  );
}