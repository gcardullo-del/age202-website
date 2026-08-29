import "server-only";

import sharp from "sharp";

export type ArtifactImageVariantName =
  | "thumbnail"
  | "card"
  | "gallery"
  | "detail"
  | "hero";

export type ArtifactImageVariant = {
  name: ArtifactImageVariantName;
  width: number;
  height: number | null;
  buffer: Buffer;
  contentType: "image/webp";
  extension: "webp";
};

type ArtifactImageVariantDefinition = {
  name: ArtifactImageVariantName;
  width: number;
  height?: number;
  quality: number;
};

const ARTIFACT_IMAGE_VARIANT_DEFINITIONS: readonly ArtifactImageVariantDefinition[] =
  [
    {
      name: "thumbnail",
      width: 128,
      height: 128,
      quality: 78,
    },
    {
      name: "card",
      width: 384,
      quality: 82,
    },
    {
      name: "gallery",
      width: 640,
      quality: 84,
    },
    {
      name: "detail",
      width: 960,
      quality: 86,
    },
    {
      name: "hero",
      width: 1536,
      quality: 88,
    },
  ] as const;

async function createVariantBuffer(
  sourceBuffer: Buffer,
  definition: ArtifactImageVariantDefinition,
): Promise<Buffer> {
  const pipeline = sharp(sourceBuffer, {
    failOn: "error",
  }).rotate();

  const resized = definition.height
    ? pipeline.resize({
        width: definition.width,
        height: definition.height,
        fit: "cover",
        position: "centre",
        withoutEnlargement: true,
      })
    : pipeline.resize({
        width: definition.width,
        fit: "inside",
        withoutEnlargement: true,
      });

  return resized
    .webp({
      quality: definition.quality,
      effort: 4,
      smartSubsample: true,
    })
    .toBuffer();
}

export async function generateArtifactImageVariants(
  sourceBuffer: Buffer,
): Promise<ArtifactImageVariant[]> {
  if (!Buffer.isBuffer(sourceBuffer)) {
    throw new TypeError(
      "Artifact image source must be a Buffer.",
    );
  }

  if (sourceBuffer.length === 0) {
    throw new Error(
      "Artifact image source is empty.",
    );
  }

  const metadata = await sharp(sourceBuffer, {
    failOn: "error",
  }).metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error(
      "Unable to determine artifact image dimensions.",
    );
  }

  const variants = await Promise.all(
    ARTIFACT_IMAGE_VARIANT_DEFINITIONS.map(
      async (definition) => {
        const buffer =
          await createVariantBuffer(
            sourceBuffer,
            definition,
          );

        return {
          name: definition.name,
          width: definition.width,
          height:
            definition.height ?? null,
          buffer,
          contentType:
            "image/webp" as const,
          extension:
            "webp" as const,
        };
      },
    ),
  );

  return variants;
}

export function getArtifactImageVariantDefinitions() {
  return ARTIFACT_IMAGE_VARIANT_DEFINITIONS;
}
