import type {
  Metadata,
} from "next";

import {
  AtpRankingTable,
} from "@/components/atp-ranking/AtpRankingTable";

import {
  getRanking,
} from "@/lib/services/atp-ranking.service";


export const dynamic =
  "force-dynamic";


const SITE_URL =
  "https://www.age202.com";

const PAGE_URL =
  `${SITE_URL}/atp-ranking`;

const PAGE_TITLE =
  "ATP Rankings: World Tennis Ranking, Players & Points | AGE202";

const PAGE_DESCRIPTION =
  "Explore the ATP world rankings with player positions, official ranking points, movement, nationalities and links to AGE202 tennis archives and collections.";


export const metadata: Metadata = {
  title:
    PAGE_TITLE,

  description:
    PAGE_DESCRIPTION,

  alternates: {
    canonical:
      "/atp-ranking",
  },

  keywords: [
    "ATP rankings",
    "ATP world ranking",
    "tennis rankings",
    "men's tennis ranking",
    "ATP ranking points",
    "ATP players",
    "tennis players ranking",
    "AGE202",
  ],

  openGraph: {
    type:
      "website",

    url:
      PAGE_URL,

    title:
      PAGE_TITLE,

    description:
      PAGE_DESCRIPTION,

    siteName:
      "AGE202",

    locale:
      "en_US",
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      PAGE_TITLE,

    description:
      PAGE_DESCRIPTION,
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
    "ATP Rankings",
};


function formatDate(
  value: Date | null,
): string {
  if (!value) {
    return "Data non disponibile";
  }

  return new Intl.DateTimeFormat(
    "it-IT",
    {
      day:
        "2-digit",

      month:
        "long",

      year:
        "numeric",
    },
  ).format(
    value,
  );
}


function serializeJsonLd(
  value: unknown,
) {
  return JSON.stringify(
    value,
  ).replace(
    /</g,
    "\\u003c",
  );
}


export default async function AtpRankingPage() {
  const players =
    await getRanking(
      150,
    );

  const leader =
    players[0] ??
    null;

  const latestDate =
    players.length > 0
      ? players.reduce(
          (
            latest,
            player,
          ) => {
            const value =
              new Date(
                player.rankingDate,
              );

            return value >
              latest
              ? value
              : latest;
          },
          new Date(
            players[0].rankingDate,
          ),
        )
      : null;

  const source =
    leader?.source ??
    "AGE202";

  const structuredData = {
    "@context":
      "https://schema.org",

    "@graph": [
      {
        "@type":
          "CollectionPage",

        "@id":
          `${PAGE_URL}#webpage`,

        url:
          PAGE_URL,

        name:
          PAGE_TITLE,

        headline:
          "ATP World Rankings",

        description:
          PAGE_DESCRIPTION,

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

        about: {
          "@type":
            "Thing",

          name:
            "ATP world rankings",
        },

        mainEntity: {
          "@id":
            `${PAGE_URL}#ranking-list`,
        },

        breadcrumb: {
          "@id":
            `${PAGE_URL}#breadcrumb`,
        },
      },

      {
        "@type":
          "ItemList",

        "@id":
          `${PAGE_URL}#ranking-list`,

        name:
          "ATP World Rankings",

        numberOfItems:
          players.length,

        itemListOrder:
          "https://schema.org/ItemListOrderAscending",

        itemListElement:
          players.map(
            (
              player,
              index,
            ) => ({
              "@type":
                "ListItem",

              position:
                index +
                1,

              item: {
                "@type":
                  "Person",

                name:
                  player.name,
              },
            }),
          ),
      },

      {
        "@type":
          "BreadcrumbList",

        "@id":
          `${PAGE_URL}#breadcrumb`,

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
              "ATP Rankings",

            item:
              PAGE_URL,
          },
        ],
      },
    ],
  };


  return (
    <main className="min-h-screen bg-[#030a16] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            serializeJsonLd(
              structuredData,
            ),
        }}
      />

      <section className="relative overflow-hidden border-b border-white/10 bg-[linear-gradient(110deg,#030a16_0%,#07111d_58%,#172111_100%)]">
        <div className="pointer-events-none absolute right-[-90px] top-8 size-[390px] rounded-full border border-[#ccff00]/10" />

        <div className="pointer-events-none absolute right-[-15px] top-24 size-[250px] rounded-full border border-[#ccff00]/10" />

        <div className="mx-auto grid w-full max-w-[1680px] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.45fr_0.75fr] lg:px-10 lg:py-12">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#ccff00]">
              AGE202 Tour Intelligence
            </p>

            <h1 className="mt-3 max-w-4xl text-[clamp(3.8rem,8vw,8.8rem)] font-black uppercase leading-[0.76] tracking-[-0.075em]">
              ATP World

              <span className="block text-[#ccff00]">
                Rankings.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Esplora la classifica ATP con posizioni, punti,
              variazioni, nazionalità e collegamenti alle
              collezioni e agli archivi AGE202.
            </p>
          </div>

          <div className="self-end rounded-2xl border border-white/10 bg-[#07101d]/80 p-5 shadow-2xl shadow-black/30">
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-500">
              Platform status
            </p>

            <p className="mt-1 text-2xl font-black uppercase">
              Rankings data
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Dataset verificato sulla classifica ATP e
              pubblicato nell&apos;archivio AGE202.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#ccff00]">
                  Leader
                </p>

                <p className="mt-2 text-base font-black">
                  {leader?.name ??
                    "—"}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#ccff00]">
                  Leader points
                </p>

                <p className="mt-2 text-base font-black tabular-nums">
                  {leader?.points?.toLocaleString(
                    "it-IT",
                  ) ??
                    "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto grid w-full max-w-[1680px] border-t border-white/10 px-4 sm:grid-cols-4 sm:px-6 lg:px-10">
          {[
            [
              "Players",
              `${players.length}`,
            ],
            [
              "Ranking range",
              `Top ${players.length}`,
            ],
            [
              "Updated",
              formatDate(
                latestDate,
              ),
            ],
            [
              "Source",
              source,
            ],
          ].map(
            (
              [
                label,
                value,
              ],
            ) => (
              <div
                key={
                  label
                }
                className="border-b border-white/10 py-4 sm:border-b-0 sm:border-r sm:px-5 first:sm:pl-0 last:sm:border-r-0"
              >
                <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#ccff00]">
                  {label}
                </p>

                <p className="mt-1 text-sm font-black uppercase text-white">
                  {value}
                </p>
              </div>
            ),
          )}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1680px] px-4 py-8 sm:px-6 lg:px-10">
        <div className="mb-4">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#ccff00]">
            Season overview
          </p>

          <h2 className="mt-1 text-4xl font-black uppercase tracking-[-0.05em] sm:text-5xl">
            Ranking table
          </h2>
        </div>

        <AtpRankingTable
          players={
            players
          }
        />
      </section>
  </main>
  );
}