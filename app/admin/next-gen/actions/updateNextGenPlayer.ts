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

export async function updateNextGenPlayer(
  playerKey: string,
  formData: FormData,
): Promise<void> {
  await requireAdmin();

  const existing =
    await prisma.nextGenPlayer.findUnique({
      where: {
        playerKey,
      },
    });

  if (!existing) {
    throw new Error(
      "NEXT GEN player non trovato.",
    );
  }

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
    atpUrlPlayerConflict,
    rankingUrlConflict,
  ] =
    await Promise.all([
      prisma.nextGenPlayer.findFirst({
        where: {
          archiveNumber,
          NOT: {
            playerKey,
          },
        },
        select: {
          name: true,
        },
      }),

      prisma.nextGenPlayer.findFirst({
        where: {
          atpProfileUrl,
          NOT: {
            playerKey,
          },
        },
        select: {
          name: true,
        },
      }),

      prisma.nextGenRanking.findFirst({
        where: {
          atpProfileUrl,
          NOT: {
            playerKey,
          },
        },
        select: {
          name: true,
        },
      }),
    ]);

  if (archiveNumberConflict) {
    throw new Error(
      `Archive Number ${archiveNumber} è già assegnato a ${archiveNumberConflict.name}.`,
    );
  }

  if (atpUrlPlayerConflict) {
    throw new Error(
      `Questo profilo ATP è già collegato a ${atpUrlPlayerConflict.name}.`,
    );
  }

  if (rankingUrlConflict) {
    throw new Error(
      `Questo profilo ATP è già collegato al ranking di ${rankingUrlConflict.name}.`,
    );
  }

  const publishedAt =
    status === "PUBLISHED"
      ? existing.publishedAt ??
        new Date()
      : null;

  await prisma.$transaction(
    async (transaction) => {
      await transaction.nextGenPlayer.update({
        where: {
          playerKey,
        },
        data: {
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

      await transaction.nextGenRanking.upsert({
        where: {
          playerKey,
        },
        create: {
          playerKey,
          name,
          atpProfileUrl,
          source:
            "ATP_PROFILE",
          active:
            status !== "ARCHIVED",
        },
        update: {
          name,
          atpProfileUrl,
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
    `/admin/next-gen/${playerKey}`,
  );

  revalidatePath(
    "/next-gen",
  );

  redirect(
    `/admin/next-gen/${playerKey}`,
  );
}
