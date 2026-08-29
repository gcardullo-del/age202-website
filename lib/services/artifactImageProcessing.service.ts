import "server-only";

import {
  storeArtifactImageVariants,
  type StoredArtifactImageVariants,
} from "@/lib/services/artifactImageVariantStorage.service";
import { supabaseAdmin } from "@/lib/supabase/admin";

const BUCKET =
  process.env.SUPABASE_STORAGE_BUCKET ??
  "artifact";

const MAX_SOURCE_IMAGE_SIZE =
  15 * 1024 * 1024;

const ALLOWED_SOURCE_CONTENT_TYPES =
  new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
  ]);

type ProcessArtifactPendingImageInput = {
  artifactId: string;
  sourcePath: string;
  imageKey?: string;
};

function normalizeSourcePath(
  sourcePath: string,
): string {
  const normalized =
    sourcePath.trim();

  if (!normalized) {
    throw new Error(
      "Artifact image source path is required.",
    );
  }

  if (
    !normalized.startsWith(
      "pending/",
    )
  ) {
    throw new Error(
      "Artifact image source must belong to the pending upload area.",
    );
  }

  return normalized;
}

function validateContentType(
  contentType: string | undefined,
): void {
  if (!contentType) {
    return;
  }

  const normalized =
    contentType
      .split(";")[0]
      ?.trim()
      .toLowerCase();

  if (
    normalized &&
    !ALLOWED_SOURCE_CONTENT_TYPES.has(
      normalized,
    )
  ) {
    throw new Error(
      `Unsupported artifact source image type: ${normalized}.`,
    );
  }
}

export async function processArtifactPendingImage({
  artifactId,
  sourcePath,
  imageKey,
}: ProcessArtifactPendingImageInput): Promise<StoredArtifactImageVariants> {
  const normalizedSourcePath =
    normalizeSourcePath(
      sourcePath,
    );

  const {
    data,
    error,
  } =
    await supabaseAdmin.storage
      .from(BUCKET)
      .download(
        normalizedSourcePath,
      );

  if (error) {
    throw new Error(
      `Unable to download artifact source image: ${error.message}`,
    );
  }

  if (!data) {
    throw new Error(
      "Artifact source image download returned no data.",
    );
  }

  validateContentType(
    data.type,
  );

  if (
    data.size <= 0
  ) {
    throw new Error(
      "Artifact source image is empty.",
    );
  }

  if (
    data.size >
    MAX_SOURCE_IMAGE_SIZE
  ) {
    throw new Error(
      "Artifact source image exceeds the 15 MB processing limit.",
    );
  }

  const arrayBuffer =
    await data.arrayBuffer();

  const sourceBuffer =
    Buffer.from(
      arrayBuffer,
    );

  return storeArtifactImageVariants({
    artifactId,
    sourceBuffer,
    sourcePath:
      normalizedSourcePath,
    ...(imageKey
      ? {
          imageKey,
        }
      : {}),
  });
}
