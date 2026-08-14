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
  createMedia,
} from "@/lib/repositories/media.repository";

import {
  uploadArtifactImage,
} from "@/lib/services/artifactStorage.service";


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


function optionalFile(
  formData: FormData,
  key: string,
): File | null {
  const value =
    formData.get(key);

  if (
    !(value instanceof File) ||
    value.size <= 0
  ) {
    return null;
  }

  return value;
}


function extensionFromFile(
  file: File,
): string {
  return (
    file.name
      .split(".")
      .pop()
      ?.trim()
      .toLowerCase() ||
    "bin"
  );
}


function titleFromFileName(
  fileName: string,
): string {
  return (
    fileName
      .replace(
        /\.[^/.]+$/,
        "",
      )
      .replace(
        /[-_]+/g,
        " ",
      )
      .replace(
        /\s+/g,
        " ",
      )
      .trim() ||
    "Tournament hero"
  );
}


export async function updateTournamentMedia(
  tournamentId: string,
  formData: FormData,
) {
  await requireAdmin();

  const tournament =
    await prisma.tournament.findUnique({
      where: {
        id:
          tournamentId,
      },

      select: {
        id: true,
        slug: true,
        name: true,
        category: true,
        heroImage: true,
      },
    });


  if (!tournament) {
    throw new Error(
      "Tournament not found.",
    );
  }


  const heroFile =
    optionalFile(
      formData,
      "heroFile",
    );


  let heroImage =
    optionalText(
      formData,
      "heroImage",
    );


  if (heroFile) {
    if (
      !heroFile.type.startsWith(
        "image/",
      )
    ) {
      throw new Error(
        "Tournament hero must be an image.",
      );
    }


    const uploadedUrl =
      await uploadArtifactImage(
        `tournaments/${tournament.slug}/hero`,
        heroFile,
      );


    await createMedia({
      title:
        `${tournament.name} · Hero`,

      alt:
        `${tournament.name} tournament hero`,

      originalName:
        heroFile.name,

      url:
        uploadedUrl,

      mimeType:
        heroFile.type ||
        "application/octet-stream",

      extension:
        extensionFromFile(
          heroFile,
        ),

      size:
        heroFile.size,

      width:
        null,

      height:
        null,

      tags: [
        "Tournament",
        tournament.slug,
        "Hero",
      ],

      folderId:
        null,

      isUsed:
        true,
    });


    heroImage =
      uploadedUrl;
  }


  await prisma.tournament.update({
    where: {
      id:
        tournamentId,
    },

    data: {
      heroImage,

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