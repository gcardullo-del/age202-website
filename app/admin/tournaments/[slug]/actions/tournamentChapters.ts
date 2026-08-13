"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  requireAdmin,
} from "@/lib/auth/admin-auth";

import { prisma } from "@/lib/prisma";

function requiredText(
  formData: FormData,
  key: string,
): string {
  const value = formData.get(key);

  if (
    typeof value !== "string" ||
    !value.trim()
  ) {
    throw new Error(`${key} is required.`);
  }

  return value.trim();
}

function optionalText(
  formData: FormData,
  key: string,
): string | null {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  return normalized || null;
}

function integerValue(
  formData: FormData,
  key: string,
  fallback = 0,
): number {
  const value = optionalText(formData, key);

  if (value === null) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);

  if (!Number.isInteger(parsed)) {
    throw new Error(`${key} must be an integer.`);
  }

  return parsed;
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
    throw new Error("Tournament not found.");
  }

  return tournament;
}

function revalidateTournamentPaths(
  slug: string,
  category: string,
) {
  revalidatePath("/admin/tournaments");
  revalidatePath(`/admin/tournaments/${slug}`);

  if (category === "MASTERS_1000") {
    revalidatePath(
      `/results/masters-1000/${slug}`,
    );
  }
}

export async function createTournamentChapter(
  tournamentId: string,
  formData: FormData,
) {
  await requireAdmin();

  const tournament =
    await getTournamentContext(tournamentId);

  await prisma.tournamentChapter.create({
    data: {
      tournamentId,
      eyebrow: optionalText(formData, "eyebrow"),
      title: requiredText(formData, "title"),
      subtitle: optionalText(formData, "subtitle"),
      description: optionalText(formData, "description"),
      imageUrl: optionalText(formData, "imageUrl"),
      yearLabel: optionalText(formData, "yearLabel"),
      sortOrder: integerValue(formData, "sortOrder"),
      featured: formData.get("featured") === "on",
    },
  });

  revalidateTournamentPaths(
    tournament.slug,
    tournament.category,
  );

  redirect(
    `/admin/tournaments/${tournament.slug}?saved=chapter`,
  );
}

export async function updateTournamentChapter(
  tournamentId: string,
  chapterId: string,
  formData: FormData,
) {
  await requireAdmin();

  const tournament =
    await getTournamentContext(tournamentId);

  const chapter =
    await prisma.tournamentChapter.findFirst({
      where: {
        id: chapterId,
        tournamentId,
      },
      select: {
        id: true,
      },
    });

  if (!chapter) {
    throw new Error("Chapter not found.");
  }

  await prisma.tournamentChapter.update({
    where: {
      id: chapter.id,
    },
    data: {
      eyebrow: optionalText(formData, "eyebrow"),
      title: requiredText(formData, "title"),
      subtitle: optionalText(formData, "subtitle"),
      description: optionalText(formData, "description"),
      imageUrl: optionalText(formData, "imageUrl"),
      yearLabel: optionalText(formData, "yearLabel"),
      sortOrder: integerValue(formData, "sortOrder"),
      featured: formData.get("featured") === "on",
    },
  });

  revalidateTournamentPaths(
    tournament.slug,
    tournament.category,
  );

  redirect(
    `/admin/tournaments/${tournament.slug}?saved=chapter`,
  );
}

export async function deleteTournamentChapter(
  tournamentId: string,
  chapterId: string,
) {
  await requireAdmin();

  const tournament =
    await getTournamentContext(tournamentId);

  const chapter =
    await prisma.tournamentChapter.findFirst({
      where: {
        id: chapterId,
        tournamentId,
      },
      select: {
        id: true,
      },
    });

  if (!chapter) {
    throw new Error("Chapter not found.");
  }

  await prisma.tournamentChapter.delete({
    where: {
      id: chapter.id,
    },
  });

  revalidateTournamentPaths(
    tournament.slug,
    tournament.category,
  );

  redirect(
    `/admin/tournaments/${tournament.slug}?saved=chapter`,
  );
}