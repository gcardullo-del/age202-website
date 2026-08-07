import {
  CollectionStatus,
  CollectionType,
} from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma";

export type MuseumCollectionListItem = {
  id: string;
  name: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  type: CollectionType;
  status: CollectionStatus;
  heroImageUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  featured: boolean;
  displayOrder: number | null;
  playerCount: number;
  artifactCount: number;
  originalCount: number;
  mediaCount: number;
};

export type MuseumCollectionPlayerLink = {
  id: string;
  collectionId: string;
  playerId: string;
  sortOrder: number;
  featured: boolean;
  collection: MuseumCollectionListItem;
};

const collectionCountSelect = {
  _count: {
    select: {
      players: true,
      artifacts: true,
      originals: true,
      media: true,
    },
  },
} as const;

function mapMuseumCollection(
  collection: {
    id: string;
    name: string;
    slug: string;
    title: string;
    subtitle: string | null;
    description: string | null;
    type: CollectionType;
    status: CollectionStatus;
    heroImageUrl: string | null;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    featured: boolean;
    displayOrder: number | null;
    _count: {
      players: number;
      artifacts: number;
      originals: number;
      media: number;
    };
  },
): MuseumCollectionListItem {
  return {
    id: collection.id,
    name: collection.name,
    slug: collection.slug,
    title: collection.title,
    subtitle: collection.subtitle,
    description: collection.description,
    type: collection.type,
    status: collection.status,
    heroImageUrl: collection.heroImageUrl,
    primaryColor: collection.primaryColor,
    secondaryColor: collection.secondaryColor,
    accentColor: collection.accentColor,
    featured: collection.featured,
    displayOrder: collection.displayOrder,
    playerCount: collection._count.players,
    artifactCount: collection._count.artifacts,
    originalCount: collection._count.originals,
    mediaCount: collection._count.media,
  };
}

export async function getAllMuseumCollections(): Promise<
  MuseumCollectionListItem[]
> {
  const collections =
    await prisma.museumCollection.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        title: true,
        subtitle: true,
        description: true,
        type: true,
        status: true,
        heroImageUrl: true,
        primaryColor: true,
        secondaryColor: true,
        accentColor: true,
        featured: true,
        displayOrder: true,
        ...collectionCountSelect,
      },

      orderBy: [
        {
          featured: "desc",
        },
        {
          displayOrder: "asc",
        },
        {
          name: "asc",
        },
      ],
    });

  return collections.map(
    mapMuseumCollection,
  );
}

export async function getPublishedMuseumCollections(): Promise<
  MuseumCollectionListItem[]
> {
  const collections =
    await prisma.museumCollection.findMany({
      where: {
        status: "PUBLISHED",
      },

      select: {
        id: true,
        name: true,
        slug: true,
        title: true,
        subtitle: true,
        description: true,
        type: true,
        status: true,
        heroImageUrl: true,
        primaryColor: true,
        secondaryColor: true,
        accentColor: true,
        featured: true,
        displayOrder: true,
        ...collectionCountSelect,
      },

      orderBy: [
        {
          featured: "desc",
        },
        {
          displayOrder: "asc",
        },
        {
          name: "asc",
        },
      ],
    });

  return collections.map(
    mapMuseumCollection,
  );
}

export async function getMuseumCollectionById(
  collectionId: string,
): Promise<MuseumCollectionListItem | null> {
  const normalizedCollectionId =
    collectionId.trim();

  if (!normalizedCollectionId) {
    return null;
  }

  const collection =
    await prisma.museumCollection.findUnique({
      where: {
        id: normalizedCollectionId,
      },

      select: {
        id: true,
        name: true,
        slug: true,
        title: true,
        subtitle: true,
        description: true,
        type: true,
        status: true,
        heroImageUrl: true,
        primaryColor: true,
        secondaryColor: true,
        accentColor: true,
        featured: true,
        displayOrder: true,
        ...collectionCountSelect,
      },
    });

  return collection
    ? mapMuseumCollection(collection)
    : null;
}

export async function getMuseumCollectionBySlug(
  slug: string,
): Promise<MuseumCollectionListItem | null> {
  const normalizedSlug =
    slug.trim();

  if (!normalizedSlug) {
    return null;
  }

  const collection =
    await prisma.museumCollection.findUnique({
      where: {
        slug: normalizedSlug,
      },

      select: {
        id: true,
        name: true,
        slug: true,
        title: true,
        subtitle: true,
        description: true,
        type: true,
        status: true,
        heroImageUrl: true,
        primaryColor: true,
        secondaryColor: true,
        accentColor: true,
        featured: true,
        displayOrder: true,
        ...collectionCountSelect,
      },
    });

  return collection
    ? mapMuseumCollection(collection)
    : null;
}

export async function getPlayerMuseumCollections(
  playerId: string,
): Promise<MuseumCollectionPlayerLink[]> {
  const normalizedPlayerId =
    playerId.trim();

  if (!normalizedPlayerId) {
    return [];
  }

  const links =
    await prisma.museumCollectionPlayer.findMany({
      where: {
        playerId: normalizedPlayerId,
      },

      select: {
        id: true,
        collectionId: true,
        playerId: true,
        sortOrder: true,
        featured: true,

        collection: {
          select: {
            id: true,
            name: true,
            slug: true,
            title: true,
            subtitle: true,
            description: true,
            type: true,
            status: true,
            heroImageUrl: true,
            primaryColor: true,
            secondaryColor: true,
            accentColor: true,
            featured: true,
            displayOrder: true,
            ...collectionCountSelect,
          },
        },
      },

      orderBy: [
        {
          featured: "desc",
        },
        {
          sortOrder: "asc",
        },
        {
          collection: {
            name: "asc",
          },
        },
      ],
    });

  return links.map((link) => ({
    id: link.id,
    collectionId:
      link.collectionId,
    playerId: link.playerId,
    sortOrder: link.sortOrder,
    featured: link.featured,
    collection:
      mapMuseumCollection(
        link.collection,
      ),
  }));
}

export async function getMuseumCollectionOptionsForPlayer(
  playerId?: string | null,
): Promise<{
  collections: MuseumCollectionListItem[];
  selectedCollectionIds: string[];
}> {
  const [
    collections,
    selectedLinks,
  ] = await Promise.all([
    getAllMuseumCollections(),

    playerId?.trim()
      ? prisma.museumCollectionPlayer.findMany({
          where: {
            playerId:
              playerId.trim(),
          },

          select: {
            collectionId: true,
          },
        })
      : Promise.resolve([]),
  ]);

  return {
    collections,
    selectedCollectionIds:
      selectedLinks.map(
        (link) =>
          link.collectionId,
      ),
  };
}