import { notFound } from "next/navigation";

import AdminShell from "@/components/admin/AdminShell";
import { prisma } from "@/lib/prisma";

import ArtifactForm from "../new/components/ArtifactForm";

type PageProps = {
  params: Promise<{
    artifactId: string;
  }>;
};

export default async function EditArtifactPage({
  params,
}: PageProps) {
  const { artifactId } = await params;

  const [artifact, players, brands] =
    await Promise.all([
      prisma.artifact.findUnique({
        where: {
          id: artifactId,
        },

        include: {
          images: {
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
      }),

      prisma.player.findMany({
        orderBy: {
          name: "asc",
        },
      }),

      prisma.brand.findMany({
        orderBy: {
          name: "asc",
        },
      }),
    ]);

  if (!artifact) {
    notFound();
  }

  return (
    <AdminShell
      title="Edit Artifact"
      description="Update an existing artifact."
    >
      <ArtifactForm
        mode="edit"
        artifactId={artifact.id}
        players={players}
        brands={brands}
        initialValues={{
          title: artifact.title,

          subtitle:
            artifact.subtitle,

          archiveNumber:
            artifact.archiveNumber,

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

          playerId:
            artifact.playerId,

          brandId:
            artifact.brandId,

          category:
            artifact.category,

          rarity:
            artifact.rarity,

          size:
            artifact.size,

          condition:
            artifact.condition,

          colour:
            artifact.colour,

          material:
            artifact.material,

          description:
            artifact.description,

          museumStory:
            artifact.museumStory,

          historicalContext:
            artifact.historicalContext,

          curatorNote:
            artifact.curatorNote,

          availability:
            artifact.availability,

          price:
            artifact.price?.toString() ??
            null,

          currency:
            artifact.currency,

          vintedUrl:
            artifact.vintedUrl,

          authentic:
            artifact.authentic,

          authenticityCode:
            artifact.authenticityCode,

          vintage:
            artifact.vintage,

          tags:
            artifact.tags,

          status:
            artifact.status,

          slug:
            artifact.slug,

          featured:
            artifact.featured,

          images: artifact.images.map(
            (image) => ({
              id: image.id,
              url: image.url,
              alt: image.alt,
              isCover: image.isCover,
              sortOrder:
                image.sortOrder,
            }),
          ),
        }}
      />
    </AdminShell>
  );
}