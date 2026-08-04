import {
  notFound,
} from "next/navigation";

import AdminShell from "@/components/admin/AdminShell";

import {
  getAllMedia,
} from "@/lib/repositories/media.repository";
import { prisma } from "@/lib/prisma";

import CollectionArtifactsManager from "../components/CollectionArtifactsManager";
import CollectionForm from "../components/CollectionForm";
import CollectionPlayersManager from "../components/CollectionPlayersManager";
import DeleteCollectionButton from "../components/DeleteCollectionButton";

export const dynamic =
  "force-dynamic";

export default async function EditCollectionPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  const [
    collection,
    mediaAssets,
    players,
    artifacts,
  ] = await Promise.all([
    prisma.museumCollection.findUnique(
      {
        where: {
          id,
        },

        include: {
          players: {
            orderBy: {
              sortOrder: "asc",
            },
          },

          artifacts: {
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
      },
    ),

    getAllMedia({
      mimeType: "image/",
    }),

    prisma.player.findMany(
      {
        orderBy: [
          {
            displayOrder:
              "asc",
          },
          {
            name: "asc",
          },
        ],

        select: {
          id: true,
          name: true,
          firstName: true,
          lastName: true,
          nickname: true,
          country: true,
          portraitImage: true,
          heroImage: true,
          active: true,
        },
      },
    ),

    prisma.artifact.findMany(
      {
        orderBy: [
          {
            featured: "desc",
          },
          {
            createdAt: "desc",
          },
        ],

        include: {
          player: {
            select: {
              name: true,
            },
          },

          brand: {
            select: {
              name: true,
            },
          },

          images: {
            orderBy: [
              {
                isCover: "desc",
              },
              {
                sortOrder: "asc",
              },
            ],
            take: 1,
          },
        },
      },
    ),
  ]);

  if (!collection) {
    notFound();
  }

  const selectedPlayerIds =
    collection.players.map(
      (entry) =>
        entry.playerId,
    );

  const featuredPlayerId =
    collection.players.find(
      (entry) =>
        entry.featured,
    )?.playerId ?? null;

  const selectedArtifactIds =
    collection.artifacts.map(
      (entry) =>
        entry.artifactId,
    );

  const featuredArtifactIds =
    collection.artifacts
      .filter(
        (entry) =>
          entry.featured,
      )
      .map(
        (entry) =>
          entry.artifactId,
      );

  const artifactOptions =
    artifacts.map(
      (artifact) => ({
        id: artifact.id,
        title:
          artifact.title,
        subtitle:
          artifact.subtitle,
        archiveNumber:
          artifact.archiveNumber,
        year: artifact.year,
        category:
          artifact.category,
        rarity:
          artifact.rarity,
        status:
          artifact.status,
        playerName:
          artifact.player.name,
        brandName:
          artifact.brand.name,
        imageUrl:
          artifact.images[0]
            ?.url ?? null,
      }),
    );

  return (
    <AdminShell
      title="Edit Collection"
      description="Update the collection and connect its museum content."
    >
      <div className="space-y-7">
        <div className="flex justify-end">
          <DeleteCollectionButton
            collectionId={
              collection.id
            }
            collectionTitle={
              collection.title
            }
          />
        </div>

        <CollectionForm
          mode="edit"
          collectionId={
            collection.id
          }
          mediaAssets={
            mediaAssets
          }
          initialValues={{
            name:
              collection.name,
            slug:
              collection.slug,
            eyebrow:
              collection.eyebrow,
            title:
              collection.title,
            subtitle:
              collection.subtitle,
            description:
              collection.description,
            type:
              collection.type,
            status:
              collection.status,
            heroTitle:
              collection.heroTitle,
            heroSubtitle:
              collection.heroSubtitle,
            heroImageUrl:
              collection.heroImageUrl,
            heroMediaId:
              collection.heroMediaId,
            primaryColor:
              collection.primaryColor,
            secondaryColor:
              collection.secondaryColor,
            accentColor:
              collection.accentColor,
            featured:
              collection.featured,
            displayOrder:
              collection.displayOrder,
            metaTitle:
              collection.metaTitle,
            metaDescription:
              collection.metaDescription,
          }}
        />

        <CollectionPlayersManager
          collectionId={
            collection.id
          }
          players={players}
          selectedPlayerIds={
            selectedPlayerIds
          }
          featuredPlayerId={
            featuredPlayerId
          }
        />

        <CollectionArtifactsManager
          collectionId={
            collection.id
          }
          artifacts={
            artifactOptions
          }
          selectedArtifactIds={
            selectedArtifactIds
          }
          featuredArtifactIds={
            featuredArtifactIds
          }
        />
      </div>
    </AdminShell>
  );
}
