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
  createMedia,
} from "@/lib/repositories/media.repository";

import {
  uploadArtifactImage,
} from "@/lib/services/artifactStorage.service";

import {
  prisma,
} from "@/lib/prisma";


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

  if (
    typeof value !== "string"
  ) {
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


function integerValue(
  formData: FormData,
  key: string,
  fallback = 0,
): number {
  const value =
    optionalText(
      formData,
      key,
    );

  if (
    value === null
  ) {
    return fallback;
  }

  const parsed =
    Number.parseInt(
      value,
      10,
    );

  if (
    !Number.isInteger(
      parsed,
    )
  ) {
    throw new Error(
      `${key} must be an integer.`,
    );
  }

  return parsed;
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
    "Tournament gallery image"
  );
}


async function getTournamentContext(
  tournamentId: string,
) {
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
      },
    });

  if (
    !tournament
  ) {
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


async function uploadGalleryImage(
  tournament: {
    slug: string;
    name: string;
  },
  file: File,
): Promise<string> {
  if (
    !file.type.startsWith(
      "image/",
    )
  ) {
    throw new Error(
      "Tournament gallery file must be an image.",
    );
  }

  const uploadedUrl =
    await uploadArtifactImage(
      `tournaments/${tournament.slug}/gallery`,
      file,
    );

  await createMedia({
    title:
      `${tournament.name} · ${titleFromFileName(
        file.name,
      )}`,

    alt:
      titleFromFileName(
        file.name,
      ),

    originalName:
      file.name,

    url:
      uploadedUrl,

    mimeType:
      file.type ||
      "application/octet-stream",

    extension:
      extensionFromFile(
        file,
      ),

    size:
      file.size,

    width:
      null,

    height:
      null,

    tags: [
      "Tournament",
      tournament.slug,
      "Gallery",
    ],

    folderId:
      null,

    isUsed:
      true,
  });

  return uploadedUrl;
}


export async function createTournamentGalleryItem(
  tournamentId: string,
  formData: FormData,
) {
  await requireAdmin();

  const tournament =
    await getTournamentContext(
      tournamentId,
    );

  const imageFile =
    optionalFile(
      formData,
      "imageFile",
    );

  let imageUrl =
    optionalText(
      formData,
      "imageUrl",
    );

  if (
    imageFile
  ) {
    imageUrl =
      await uploadGalleryImage(
        tournament,
        imageFile,
      );
  }

  if (
    !imageUrl
  ) {
    throw new Error(
      "Gallery image is required.",
    );
  }

  await prisma.tournamentGalleryItem.create({
    data: {
      tournamentId,

      imageUrl,

      title:
        optionalText(
          formData,
          "title",
        ),

      eyebrow:
        optionalText(
          formData,
          "eyebrow",
        ),

      caption:
        optionalText(
          formData,
          "caption",
        ),

      alt:
        optionalText(
          formData,
          "alt",
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
    `/admin/tournaments/${tournament.slug}?saved=gallery`,
  );
}


export async function updateTournamentGalleryItem(
  tournamentId: string,
  galleryItemId: string,
  formData: FormData,
) {
  await requireAdmin();

  const tournament =
    await getTournamentContext(
      tournamentId,
    );

  const galleryItem =
    await prisma.tournamentGalleryItem.findFirst({
      where: {
        id:
          galleryItemId,

        tournamentId,
      },

      select: {
        id: true,
        imageUrl: true,
      },
    });

  if (
    !galleryItem
  ) {
    throw new Error(
      "Gallery item not found.",
    );
  }

  const imageFile =
    optionalFile(
      formData,
      "imageFile",
    );

  let imageUrl =
    optionalText(
      formData,
      "imageUrl",
    ) ??
    galleryItem.imageUrl;

  if (
    imageFile
  ) {
    imageUrl =
      await uploadGalleryImage(
        tournament,
        imageFile,
      );
  }

  await prisma.tournamentGalleryItem.update({
    where: {
      id:
        galleryItem.id,
    },

    data: {
      imageUrl,

      title:
        optionalText(
          formData,
          "title",
        ),

      eyebrow:
        optionalText(
          formData,
          "eyebrow",
        ),

      caption:
        optionalText(
          formData,
          "caption",
        ),

      alt:
        optionalText(
          formData,
          "alt",
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
    `/admin/tournaments/${tournament.slug}?saved=gallery`,
  );
}


export async function deleteTournamentGalleryItem(
  tournamentId: string,
  galleryItemId: string,
) {
  await requireAdmin();

  const tournament =
    await getTournamentContext(
      tournamentId,
    );

  const galleryItem =
    await prisma.tournamentGalleryItem.findFirst({
      where: {
        id:
          galleryItemId,

        tournamentId,
      },

      select: {
        id: true,
      },
    });

  if (
    !galleryItem
  ) {
    throw new Error(
      "Gallery item not found.",
    );
  }

  await prisma.tournamentGalleryItem.delete({
    where: {
      id:
        galleryItem.id,
    },
  });

  revalidateTournamentPaths(
    tournament.slug,
    tournament.category,
  );

  redirect(
    `/admin/tournaments/${tournament.slug}?saved=gallery`,
  );
}