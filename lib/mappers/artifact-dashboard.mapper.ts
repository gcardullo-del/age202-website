import type {
  ArtifactDashboardData,
} from "@/lib/types/artifact-dashboard";

import type {
  getArtifactBySlug,
} from "@/lib/repositories/artifact.repository";

type ArtifactRecord =
  NonNullable<
    Awaited<
      ReturnType<
        typeof getArtifactBySlug
      >
    >
  >;

function countStoryBlocks(
  artifact: ArtifactRecord,
): number {
  return [
    artifact.description,
    artifact.museumStory,
    artifact.historicalContext,
    artifact.curatorNote,
  ].filter(
    (value) =>
      Boolean(
        value?.trim(),
      ),
  ).length;
}

export function mapArtifactToDashboardData(
  artifact: ArtifactRecord,
): ArtifactDashboardData {
  return {
    id: artifact.id,

    archiveNumber:
      artifact.archiveNumber,

    title:
      artifact.title,

    subtitle:
      artifact.subtitle,

    slug:
      artifact.slug,

    description:
      artifact.description,

    museumStory:
      artifact.museumStory,

    historicalContext:
      artifact.historicalContext,

    curatorNote:
      artifact.curatorNote,

    year:
      artifact.year,

    season:
      artifact.season,

    tournament:
      artifact.tournament,

    collection:
      artifact.collection,

    edition:
      artifact.edition,

    category:
      artifact.category,

    rarity:
      artifact.rarity,

    condition:
      artifact.condition,

    availability:
      artifact.availability,

    status:
      artifact.status,

    size:
      artifact.size,

    colour:
      artifact.colour,

    material:
      artifact.material,

    authentic:
      artifact.authentic,

    authenticityCode:
      artifact.authenticityCode,

    vintage:
      artifact.vintage,

    featured:
      artifact.featured,

    tags:
      artifact.tags,

    price:
      artifact.price?.toString() ??
      null,

    currency:
      artifact.currency,

    vintedUrl:
      artifact.vintedUrl,

    publishedAt:
      artifact.publishedAt,

    createdAt:
      artifact.createdAt,

    updatedAt:
      artifact.updatedAt,

    player: {
      id:
        artifact.player.id,

      name:
        artifact.player.name,

      slug:
        artifact.player.slug,

      country:
        artifact.player.country,

      heroImage:
        artifact.player.heroImage,

      portraitImage:
        artifact.player
          .portraitImage,
    },

    brand: {
      id:
        artifact.brand.id,

      name:
        artifact.brand.name,

      slug:
        artifact.brand.slug,

      logo:
        artifact.brand.logo,
    },

    images:
      artifact.images.map(
        (image) => ({
          id:
            image.id,

          url:
            image.url,

          heroUrl:
            image.heroUrl,

          alt:
            image.alt,

          isCover:
            image.isCover,

          sortOrder:
            image.sortOrder,
        }),
      ),

    certificate:
      artifact.certificate
        ? {
            id:
              artifact.certificate.id,

            code:
              artifact.certificate.code,

            verified:
              artifact.certificate
                .verified,

            issuedAt:
              artifact.certificate
                .issuedAt,
          }
        : null,

    stats: {
      imageCount:
        artifact.images.length,

      hasCertificate:
        Boolean(
          artifact.certificate,
        ),

      storyBlocks:
        countStoryBlocks(
          artifact,
        ),
    },
  };
}