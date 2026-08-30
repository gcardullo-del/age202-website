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

import {
  getBoolean,
  getHighlights,
  getNextGenStatus,
  getOptionalDate,
  getOptionalString,
  getRequiredPositiveInteger,
  getRequiredString,
  normalizePlayerKey,
  validateAtpProfileUrl,
} from "./nextGenPlayerForm.utils";

function getContributionStatus(
  formData: FormData,
): "AWAITING" | "RECEIVED" | "PUBLISHED" {
  const value =
    getRequiredString(
      formData,
      "contributionStatus",
    );

  if (
    value !== "AWAITING" &&
    value !== "RECEIVED" &&
    value !== "PUBLISHED"
  ) {
    throw new Error(
      "Contribution status non valido.",
    );
  }

  return value;
}

export async function createNextGenPlayer(
  formData: FormData,
): Promise<void> {
  await requireAdmin();

  const archiveNumber =
    getRequiredPositiveInteger(
      formData,
      "archiveNumber",
    );

  const name =
    getRequiredString(
      formData,
      "name",
    );

  const requestedPlayerKey =
    getOptionalString(
      formData,
      "playerKey",
    ) ?? name;

  const playerKey =
    normalizePlayerKey(
      requestedPlayerKey,
    );

  if (!playerKey) {
    throw new Error(
      "Impossibile generare un Player Key valido.",
    );
  }

  const firstName =
    getOptionalString(
      formData,
      "firstName",
    );

  const lastName =
    getOptionalString(
      formData,
      "lastName",
    );

  const country =
    getRequiredString(
      formData,
      "country",
    );

  const countryCode =
    getOptionalString(
      formData,
      "countryCode",
    )?.toUpperCase() ?? null;

  const flag =
    getOptionalString(
      formData,
      "flag",
    );

  const birthDate =
    getOptionalDate(
      formData,
      "birthDate",
    );

  const birthPlace =
    getOptionalString(
      formData,
      "birthPlace",
    );

  const plays =
    getOptionalString(
      formData,
      "plays",
    );

  const backhand =
    getOptionalString(
      formData,
      "backhand",
    );

  const story =
    getOptionalString(
      formData,
      "story",
    );

  const highlights =
    getHighlights(
      formData,
    );

  const portraitImage =
    getOptionalString(
      formData,
      "portraitImage",
    );

  const portraitAlt =
    getOptionalString(
      formData,
      "portraitAlt",
    );

  const contributionStatus =
    getContributionStatus(
      formData,
    );

  const contributionTitle =
    getOptionalString(
      formData,
      "contributionTitle",
    );

  const contributionText =
    getOptionalString(
      formData,
      "contributionText",
    );

  const contributionImage =
    getOptionalString(
      formData,
      "contributionImage",
    );

  const contributionDate =
    getOptionalDate(
      formData,
      "contributionDate",
    );

  const contributionSource =
    getOptionalString(
      formData,
      "contributionSource",
    );

  const atpProfileUrl =
    validateAtpProfileUrl(
      getRequiredString(
        formData,
        "atpProfileUrl",
      ),
    );

  const status =
    getNextGenStatus(
      formData,
    );

  const featured =
    getBoolean(
      formData,
      "featured",
    );

  const [
    archiveNumberConflict,
    playerKeyConflict,
    atpUrlPlayerConflict,
    rankingKeyConflict,
    rankingUrlConflict,
  ] =
    await Promise.all([
      prisma.nextGenPlayer.findUnique({
        where: {
          archiveNumber,
        },
        select: {
          id: true,
          name: true,
        },
      }),

      prisma.nextGenPlayer.findUnique({
        where: {
          playerKey,
        },
        select: {
          id: true,
          name: true,
        },
      }),

      prisma.nextGenPlayer.findUnique({
        where: {
          atpProfileUrl,
        },
        select: {
          id: true,
          name: true,
        },
      }),

      prisma.nextGenRanking.findUnique({
        where: {
          playerKey,
        },
        select: {
          id: true,
          name: true,
        },
      }),

      prisma.nextGenRanking.findUnique({
        where: {
          atpProfileUrl,
        },
        select: {
          id: true,
          name: true,
        },
      }),
    ]);

  if (archiveNumberConflict) {
    throw new Error(
      `Archive Number ${archiveNumber} è già assegnato a ${archiveNumberConflict.name}.`,
    );
  }

  if (playerKeyConflict) {
    throw new Error(
      `Player Key "${playerKey}" è già usato da ${playerKeyConflict.name}.`,
    );
  }

  if (atpUrlPlayerConflict) {
    throw new Error(
      `Questo profilo ATP è già collegato a ${atpUrlPlayerConflict.name}.`,
    );
  }

  if (rankingKeyConflict) {
    throw new Error(
      `Esiste già un record ranking con Player Key "${playerKey}".`,
    );
  }

  if (rankingUrlConflict) {
    throw new Error(
      `Questo profilo ATP è già collegato al ranking di ${rankingUrlConflict.name}.`,
    );
  }

  const publishedAt =
    status === "PUBLISHED"
      ? new Date()
      : null;

  await prisma.$transaction(
    async (transaction) => {
      await transaction.nextGenPlayer.create({
        data: {
          playerKey,
          archiveNumber,
          name,
          firstName,
          lastName,
          country,
          countryCode,
          flag,
          birthDate,
          birthPlace,
          plays,
          backhand,
          story,
          highlights,
          portraitImage,
          portraitAlt,
          contributionStatus,
          contributionTitle,
          contributionText,
          contributionImage,
          contributionDate,
          contributionSource,
          atpProfileUrl,
          status,
          featured,
          publishedAt,
        },
      });

      await transaction.nextGenRanking.create({
        data: {
          playerKey,
          name,
          atpProfileUrl,
          source:
            "ATP_PROFILE",
          active:
            status !== "ARCHIVED",
        },
      });
    },
  );

  revalidatePath(
    "/admin/next-gen",
  );

  revalidatePath(
    "/next-gen",
  );

  redirect(
    `/admin/next-gen/${playerKey}`,
  );
}
