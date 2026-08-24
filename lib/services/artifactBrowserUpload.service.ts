"use client";

import { createClient } from "@/lib/supabase/client";

const BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ??
  "artifacts";

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const MAX_IMAGE_SIZE =
  20 * 1024 * 1024;

export type BrowserUploadedArtifactImage = {
  url: string;
  path: string;
  fileName: string;
  mimeType: string;
  size: number;
};

function getFileExtension(
  file: File,
): string {
  const extension =
    file.name
      .split(".")
      .pop()
      ?.trim()
      .toLowerCase();

  if (extension) {
    return extension;
  }

  switch (file.type) {
    case "image/png":
      return "png";

    case "image/webp":
      return "webp";

    case "image/avif":
      return "avif";

    case "image/jpeg":
    default:
      return "jpg";
  }
}

function validateImage(
  file: File,
) {
  if (
    !ALLOWED_IMAGE_TYPES.has(
      file.type,
    )
  ) {
    throw new Error(
      `Formato immagine non supportato: ${file.name}`,
    );
  }

  if (file.size <= 0) {
    throw new Error(
      `Il file ${file.name} è vuoto.`,
    );
  }

  if (
    file.size >
    MAX_IMAGE_SIZE
  ) {
    throw new Error(
      `Il file ${file.name} supera il limite di 20 MB.`,
    );
  }
}

function createUploadPath(
  uploadSessionId: string,
  file: File,
) {
  const extension =
    getFileExtension(file);

  return [
    "pending",
    uploadSessionId,
    `${crypto.randomUUID()}.${extension}`,
  ].join("/");
}

export function createArtifactUploadSessionId() {
  return crypto.randomUUID();
}

export async function uploadArtifactImageFromBrowser({
  uploadSessionId,
  file,
}: {
  uploadSessionId: string;
  file: File;
}): Promise<BrowserUploadedArtifactImage> {
  validateImage(file);

  const supabase =
    createClient();

  const path =
    createUploadPath(
      uploadSessionId,
      file,
    );

  const {
    error,
  } =
    await supabase.storage
      .from(BUCKET)
      .upload(
        path,
        file,
        {
          contentType:
            file.type ||
            undefined,

          cacheControl:
            "3600",

          upsert: false,
        },
      );

  if (error) {
    throw new Error(
      `Upload fallito per ${file.name}: ${error.message}`,
    );
  }

  const {
    data,
  } =
    supabase.storage
      .from(BUCKET)
      .getPublicUrl(path);

  return {
    url:
      data.publicUrl,

    path,

    fileName:
      file.name,

    mimeType:
      file.type,

    size:
      file.size,
  };
}

export async function deleteArtifactImageFromBrowser(
  path: string,
) {
  const normalizedPath =
    path.trim();

  if (
    !normalizedPath ||
    !normalizedPath.startsWith(
      "pending/",
    )
  ) {
    return;
  }

  const supabase =
    createClient();

  const {
    error,
  } =
    await supabase.storage
      .from(BUCKET)
      .remove([
        normalizedPath,
      ]);

  if (error) {
    throw new Error(
      `Impossibile eliminare l'immagine temporanea: ${error.message}`,
    );
  }
}