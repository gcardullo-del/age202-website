import type { Metadata } from "next";

import MemorabiliaExperience, {
  type PublicMemorabiliaItem,
} from "@/components/memorabilia/MemorabiliaExperience";

import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Memorabilia",
  description:
    "Discover the AGE202 archive of tennis memorabilia, signed objects, historic equipment and collectible pieces.",
};

export const dynamic = "force-dynamic";

export default async function MemorabiliaPage() {
  const records =
    await prisma.memorabilia.findMany({
      where: {
        status: "PUBLISHED",
      },

      include: {
        player: {
          select: {
            name: true,
          },
        },

        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },

      orderBy: [
        {
          featured: "desc",
        },
        {
          displayOrder: "asc",
        },
        {
          publishedAt: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    });

  const memorabilia: PublicMemorabiliaItem[] =
    records.map((item) => {
      const cover =
        item.images.find(
          (image) =>
            image.isCover,
        ) ??
        item.images[0] ??
        null;

      return {
        id: item.id,
        inventoryNumber:
          item.inventoryNumber,
        title: item.title,
        subtitle: item.subtitle,
        slug: item.slug,
        type: item.type,
        availability:
          item.availability,
        rarity: item.rarity,
        year: item.year,
        brand: item.brand,
        collection: item.collection,
        playerName:
          item.player?.name ??
          null,
        price:
          item.price?.toString() ??
          null,
        currency:
          item.currency,
        stripeActive:
          item.stripeActive,
        featured:
          item.featured,
        coverImage: cover
          ? {
              url: cover.url,
              alt:
                cover.alt ??
                item.title,
            }
          : null,
      };
    });

  return (
    <MemorabiliaExperience
      memorabilia={memorabilia}
    />
  );
}