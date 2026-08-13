"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  requireAdmin,
} from "@/lib/auth/admin-auth";

import { prisma } from "@/lib/prisma";

function requiredText(formData: FormData, key: string): string {
  const value = formData.get(key);

  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${key} is required.`);
  }

  return value.trim();
}

function optionalText(formData: FormData, key: string): string | null {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized || null;
}

function optionalInteger(formData: FormData, key: string): number | null {
  const value = optionalText(formData, key);

  if (value === null) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);

  if (!Number.isInteger(parsed)) {
    throw new Error(`${key} must be an integer.`);
  }

  return parsed;
}

function integerValue(formData: FormData, key: string, fallback = 0): number {
  return optionalInteger(formData, key) ?? fallback;
}

function optionalDate(formData: FormData, key: string): Date | null {
  const value = optionalText(formData, key);

  if (value === null) {
    return null;
  }

  const parsed = new Date(`${value}T12:00:00.000Z`);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`${key} must be a valid date.`);
  }

  return parsed;
}

function validateYear(year: number | null) {
  if (year !== null && (year < 1800 || year > 2200)) {
    throw new Error("Iconic moment year is outside the allowed range.");
  }
}

async function getTournamentContext(tournamentId: string) {
  const tournament = await prisma.tournament.findUnique({
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

function revalidateTournamentPaths(slug: string, category: string) {
  revalidatePath("/admin/tournaments");
  revalidatePath(`/admin/tournaments/${slug}`);

  if (category === "MASTERS_1000") {
    revalidatePath(`/results/masters-1000/${slug}`);
  }
}

export async function createTournamentIconicMoment(
  tournamentId: string,
  formData: FormData,
) {
  await requireAdmin();

  const tournament = await getTournamentContext(tournamentId);
  const year = optionalInteger(formData, "year");

  validateYear(year);

  await prisma.tournamentIconicMoment.create({
    data: {
      tournamentId,
      year,
      momentDate: optionalDate(formData, "momentDate"),
      title: requiredText(formData, "title"),
      subtitle: optionalText(formData, "subtitle"),
      description: optionalText(formData, "description"),
      imageUrl: optionalText(formData, "imageUrl"),
      sortOrder: integerValue(formData, "sortOrder"),
      featured: formData.get("featured") === "on",
    },
  });

  revalidateTournamentPaths(tournament.slug, tournament.category);

  redirect(
    `/admin/tournaments/${tournament.slug}?saved=iconic-moment`,
  );
}

export async function updateTournamentIconicMoment(
  tournamentId: string,
  iconicMomentId: string,
  formData: FormData,
) {
  await requireAdmin();

  const tournament = await getTournamentContext(tournamentId);

  const iconicMoment = await prisma.tournamentIconicMoment.findFirst({
    where: {
      id: iconicMomentId,
      tournamentId,
    },
    select: {
      id: true,
    },
  });

  if (!iconicMoment) {
    throw new Error("Iconic moment not found.");
  }

  const year = optionalInteger(formData, "year");
  validateYear(year);

  await prisma.tournamentIconicMoment.update({
    where: {
      id: iconicMoment.id,
    },
    data: {
      year,
      momentDate: optionalDate(formData, "momentDate"),
      title: requiredText(formData, "title"),
      subtitle: optionalText(formData, "subtitle"),
      description: optionalText(formData, "description"),
      imageUrl: optionalText(formData, "imageUrl"),
      sortOrder: integerValue(formData, "sortOrder"),
      featured: formData.get("featured") === "on",
    },
  });

  revalidateTournamentPaths(tournament.slug, tournament.category);

  redirect(
    `/admin/tournaments/${tournament.slug}?saved=iconic-moment`,
  );
}

export async function deleteTournamentIconicMoment(
  tournamentId: string,
  iconicMomentId: string,
) {
  await requireAdmin();

  const tournament = await getTournamentContext(tournamentId);

  const iconicMoment = await prisma.tournamentIconicMoment.findFirst({
    where: {
      id: iconicMomentId,
      tournamentId,
    },
    select: {
      id: true,
    },
  });

  if (!iconicMoment) {
    throw new Error("Iconic moment not found.");
  }

  await prisma.tournamentIconicMoment.delete({
    where: {
      id: iconicMoment.id,
    },
  });

  revalidateTournamentPaths(tournament.slug, tournament.category);

  redirect(
    `/admin/tournaments/${tournament.slug}?saved=iconic-moment`,
  );
}