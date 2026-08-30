"use server";

import {
  revalidatePath,
} from "next/cache";

import {
  requireAdmin,
} from "@/lib/auth/admin-auth";

import {
  createMedia,
} from "@/lib/repositories/media.repository";

import {
  uploadArtifactImage,
} from "@/lib/services/artifactStorage.service";

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
      .replace(/\.[^/.]+$/, "")
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim() ||
    "NEXT GEN media"
  );
}

export type UploadNextGenMediaResult = {
  url: string;
  title: string;
  alt: string;
};

export async function uploadNextGenMedia(
  formData: FormData,
): Promise<UploadNextGenMediaResult> {
  await requireAdmin();

  const entry =
    formData.get("file");

  if (
    !(entry instanceof File) ||
    entry.size <= 0
  ) {
    throw new Error(
      "Seleziona un'immagine.",
    );
  }

  if (
    !entry.type.startsWith(
      "image/",
    )
  ) {
    throw new Error(
      "Il file selezionato non è un'immagine supportata.",
    );
  }

  const title =
    titleFromFileName(
      entry.name,
    );

  const url =
    await uploadArtifactImage(
      "next-gen",
      entry,
    );

  await createMedia({
    title,
    alt: title,
    originalName:
      entry.name,
    url,
    mimeType:
      entry.type ||
      "application/octet-stream",
    extension:
      extensionFromFile(
        entry,
      ),
    size:
      entry.size,
    width: null,
    height: null,
    tags: [
      "next-gen",
    ],
    folderId: null,
    isUsed: true,
  });

  revalidatePath(
    "/admin/media",
  );

  revalidatePath(
    "/admin/next-gen",
  );

  return {
    url,
    title,
    alt: title,
  };
}
