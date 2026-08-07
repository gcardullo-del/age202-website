import { NextResponse } from "next/server";

import {
  getLatestArtifacts,
} from "@/lib/repositories/artifact.repository";

export async function GET() {
  const artifacts =
    await getLatestArtifacts(6);

  const payload = artifacts.map(
    (artifact) => ({
      id: artifact.id,
      slug: artifact.slug,
      title: artifact.title,
      subtitle:
        artifact.subtitle,
      archiveNumber:
        artifact.archiveNumber,
      currency:
        artifact.currency,
      price:
        artifact.price
          ? artifact.price.toString()
          : null,
      player: {
        name:
          artifact.player.name,
      },
      brand: {
        name:
          artifact.brand.name,
      },
      images:
        artifact.images.map(
          (image) => ({
            url: image.url,
            alt: image.alt,
            isCover:
              image.isCover,
          }),
        ),
    }),
  );

  return NextResponse.json(payload);
}
