import type { Metadata } from "next";


import MemorabiliaExperience, {
  type PublicMemorabiliaItem,
} from "@/components/memorabilia/MemorabiliaExperience";

import { prisma } from "@/lib/prisma";


const SITE_URL =
  "https://www.age202.com";

const MEMORABILIA_URL =
  `${SITE_URL}/memorabilia`;


export const metadata: Metadata = {
  title:
    "Tennis Memorabilia, Signed Items & Collectibles | AGE202",

  description:
    "Explore the AGE202 tennis memorabilia archive, including signed objects, historic equipment, apparel and collectible pieces connected to players and tennis history.",

  alternates: {
    canonical:
      "/memorabilia",
  },

  openGraph: {
    type:
      "website",

    url:
      "/memorabilia",

    title:
      "Tennis Memorabilia, Signed Items & Collectibles | AGE202",

    description:
      "Explore the AGE202 tennis memorabilia archive, including signed objects, historic equipment, apparel and collectible pieces connected to players and tennis history.",

    siteName:
      "AGE202",

    locale:
      "en_US",
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "Tennis Memorabilia, Signed Items & Collectibles | AGE202",

    description:
      "Discover signed tennis objects, historic equipment, apparel and collectible pieces preserved inside the AGE202 digital museum.",
  },

  robots: {
    index:
      true,

    follow:
      true,

    googleBot: {
      index:
        true,

      follow:
        true,

      "max-image-preview":
        "large",

      "max-snippet":
        -1,

      "max-video-preview":
        -1,
    },
  },

  category:
    "Tennis Memorabilia",
};


export const dynamic =
  "force-dynamic";


export default async function MemorabiliaPage() {
  const records =
    await prisma.memorabilia.findMany({
      where: {
        status:
          "PUBLISHED",
      },

      include: {
        player: {
          select: {
            name:
              true,
          },
        },

        images: {
          orderBy: {
            sortOrder:
              "asc",
          },
        },
      },

      orderBy: [
        {
          featured:
            "desc",
        },
        {
          displayOrder:
            "asc",
        },
        {
          publishedAt:
            "desc",
        },
        {
          createdAt:
            "desc",
        },
      ],
    });


  const memorabilia:
    PublicMemorabiliaItem[] =
    records.map(
      (
        item,
      ) => {
        const cover =
          item.images.find(
            (
              image,
            ) =>
              image.isCover,
          ) ??
          item.images[0] ??
          null;

        return {
          id:
            item.id,

          inventoryNumber:
            item.inventoryNumber,

          title:
            item.title,

          subtitle:
            item.subtitle,

          slug:
            item.slug,

          type:
            item.type,

          availability:
            item.availability,

          rarity:
            item.rarity,

          year:
            item.year,

          brand:
            item.brand,

          collection:
            item.collection,

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

          coverImage:
            cover
              ? {
                  url:
                    cover.url,

                  alt:
                    cover.alt ??
                    item.title,
                }
              : null,
        };
      },
    );


  const structuredData = {
    "@context":
      "https://schema.org",

    "@graph": [
      {
        "@type":
          "CollectionPage",

        "@id":
          `${MEMORABILIA_URL}#webpage`,

        url:
          MEMORABILIA_URL,

        name:
          "Tennis Memorabilia, Signed Items & Collectibles",

        description:
          "Explore the AGE202 tennis memorabilia archive, including signed objects, historic equipment, apparel and collectible pieces connected to players and tennis history.",

        isPartOf: {
          "@type":
            "WebSite",

          "@id":
            `${SITE_URL}/#website`,

          name:
            "AGE202",

          url:
            SITE_URL,
        },

        mainEntity: {
          "@id":
            `${MEMORABILIA_URL}#items`,
        },

        breadcrumb: {
          "@id":
            `${MEMORABILIA_URL}#breadcrumb`,
        },
      },

      {
        "@type":
          "ItemList",

        "@id":
          `${MEMORABILIA_URL}#items`,

        name:
          "AGE202 Tennis Memorabilia",

        numberOfItems:
          memorabilia.length,

        itemListElement:
          memorabilia.map(
            (
              item,
              index,
            ) => ({
              "@type":
                "ListItem",

              position:
                index + 1,

              url:
                `${SITE_URL}/memorabilia/${item.slug}`,

              name:
                item.title,
            }),
          ),
      },

      {
        "@type":
          "BreadcrumbList",

        "@id":
          `${MEMORABILIA_URL}#breadcrumb`,

        itemListElement: [
          {
            "@type":
              "ListItem",

            position:
              1,

            name:
              "AGE202",

            item:
              SITE_URL,
          },

          {
            "@type":
              "ListItem",

            position:
              2,

            name:
              "Memorabilia",

            item:
              MEMORABILIA_URL,
          },
        ],
      },
    ],
  };


  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              structuredData,
            ).replace(
              /</g,
              "\\u003c",
            ),
        }}
      />

      <MemorabiliaExperience
        memorabilia={
          memorabilia
        }
      />
    </>
  );
}
