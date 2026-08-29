import "server-only";

import { randomUUID } from "crypto";

import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  generateArtifactImageVariants,
  type ArtifactImageVariantName,
} from "@/lib/services/artifactImageVariants.service";

const BUCKET =
  process.env.SUPABASE_STORAGE_BUCKET ??
  "artifact";

export type StoredArtifactImageVariant = {
  name: ArtifactImageVariantName;
  path: string;
  publicUrl: string;
};

export type StoredArtifactImageVariants = {
  sourcePath: string;
  variants: StoredArtifactImageVariant[];
};

function sanitizeStorageSegment(
  value: string,
): string {
  const normalized =
    value
      .trim()
      .replace(
        /[^a-zA-Z0-9_-]+/g,
        "-",
      )
      .replace(
        /^-+|-+$/g,
        "",
      );

  if (!normalized) {
    throw new Error(
      "Invalid storage path segment.",
    );
  }

  return normalized;
}

function buildVariantPath({
  artifactId,
  imageKey,
  variantName,
}: {
  artifactId: string;
  imageKey: string;
  variantName: ArtifactImageVariantName;
}): string {
  const safeArtifactId =
    sanitizeStorageSegment(
      artifactId,
    );

  const safeImageKey =
    sanitizeStorageSegment(
      imageKey,
    );

  return [
    "artifacts",
    safeArtifactId,
    safeImageKey,
    `${variantName}.webp`,
  ].join("/");
}

function getPublicUrl(
  path: string,
): string {
  const {
    data: {
      publicUrl,
    },
  } =
    supabaseAdmin.storage
      .from(BUCKET)
      .getPublicUrl(path);

  return publicUrl;
}

export async function storeArtifactImageVariants({
  artifactId,
  sourceBuffer,
  sourcePath,
  imageKey = randomUUID(),
}: {
  artifactId: string;
  sourceBuffer: Buffer;
  sourcePath: string;
  imageKey?: string;
}): Promise<StoredArtifactImageVariants> {
  if (!sourcePath.trim()) {
    throw new Error(
      "Artifact image source path is required.",
    );
  }

  const variants =
    await generateArtifactImageVariants(
      sourceBuffer,
    );

  const uploadedPaths: string[] =
    [];

  try {
    const storedVariants =
      await Promise.all(
        variants.map(
          async (variant) => {
            const path =
              buildVariantPath({
                artifactId,
                imageKey,
                variantName:
                  variant.name,
              });

            const {
              error,
            } =
              await supabaseAdmin.storage
                .from(BUCKET)
                .upload(
                  path,
                  variant.buffer,
                  {
                    contentType:
                      variant.contentType,
                    cacheControl:
                      "31536000",
                    upsert:
                      false,
                  },
                );

            if (error) {
              throw new Error(
                `Unable to upload ${variant.name} artifact image variant: ${error.message}`,
              );
            }

            uploadedPaths.push(
              path,
            );

            return {
              name:
                variant.name,
              path,
              publicUrl:
                getPublicUrl(
                  path,
                ),
            };
          },
        ),
      );

    return {
      sourcePath:
        sourcePath.trim(),
      variants:
        storedVariants,
    };
  } catch (error) {
    if (
      uploadedPaths.length >
      0
    ) {
      await Promise.allSettled([
        supabaseAdmin.storage
          .from(BUCKET)
          .remove(
            uploadedPaths,
          ),
      ]);
    }

    throw error;
  }
}

export async function deleteStoredArtifactImageVariants(
  variants:
    | StoredArtifactImageVariant[]
    | string[],
): Promise<void> {
  if (variants.length === 0) {
    return;
  }

  const paths =
    variants.map(
      (variant) =>
        typeof variant ===
        "string"
          ? variant
          : variant.path,
    );

  const normalizedPaths =
    Array.from(
      new Set(
        paths
          .map((path) =>
            path.trim(),
          )
          .filter(Boolean),
      ),
    );

  if (
    normalizedPaths.length ===
    0
  ) {
    return;
  }

  const {
    error,
  } =
    await supabaseAdmin.storage
      .from(BUCKET)
      .remove(
        normalizedPaths,
      );

  if (error) {
    throw new Error(
      `Unable to delete artifact image variants: ${error.message}`,
    );
  }
}
