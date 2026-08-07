import { NextResponse } from "next/server";

import {
  getFeaturedArtifacts,
  getLatestArtifacts,
} from "@/lib/repositories/artifact.repository";

export async function GET() {
  const [
    latestArtifacts,
    featuredArtifacts,
  ] = await Promise.all([
    getLatestArtifacts(1),
    getFeaturedArtifacts(1),
  ]);

  const latest =
    latestArtifacts[0] ?? null;

  const featured =
    featuredArtifacts[0] ?? null;

  function serializeArtifact(
    artifact:
      | (typeof latestArtifacts)[number]
      | null,
  ) {
    if (!artifact) {
      return null;
    }

    const cover =
      artifact.images.find(
        (image) => image.isCover,
      ) ??
      artifact.images[0] ??
      null;

    return {
      id: artifact.id,
      slug: artifact.slug,
      title: artifact.title,
      subtitle: artifact.subtitle,
      archiveNumber:
        artifact.archiveNumber,
      year: artifact.year,
      player: {
        name: artifact.player.name,
      },
      brand: {
        name: artifact.brand.name,
      },
      cover: cover
        ? {
            url: cover.url,
            alt: cover.alt,
          }
        : null,
    };
  }

  return NextResponse.json({
    latest:
      serializeArtifact(latest),
    featured:
      serializeArtifact(featured),
  });
}
