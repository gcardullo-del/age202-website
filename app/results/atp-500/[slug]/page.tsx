import type {
  CSSProperties,
} from "react";

import type {
  Metadata,
} from "next";

import Image from "next/image";

import {
  notFound,
} from "next/navigation";

import {
  ArrowUpRight,
  BadgeCheck,
  PackageSearch,
  Sparkles,
} from "lucide-react";

import ATP500IconicMoments from "./components/ATP500IconicMoments";
import ATP500Legends from "./components/ATP500Legends";
import ATP500RecentEditions from "./components/ATP500RecentEditions";
import ATP500TournamentHero from "./components/ATP500TournamentHero";
import ATP500TournamentIdentity from "./components/ATP500TournamentIdentity";
import ATP500TournamentNavigation from "./components/ATP500TournamentNavigation";

import {
  ATP_500_SLUGS,
  getAtp500Tournament,
} from "@/lib/data/atp-500";

import {
  mapAtp500TournamentPageData,
} from "@/lib/mappers/atp-500-cms.mapper";

import {
  prisma,
} from "@/lib/prisma";

type Atp500TournamentPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type TournamentStyle =
  CSSProperties & {
    "--tournament-primary": string;
    "--tournament-secondary": string;
    "--tournament-glow": string;
  };

export const dynamic =
  "force-dynamic";

export const revalidate =
  0;

export function generateStaticParams() {
  return ATP_500_SLUGS.map(
    (slug) => ({
      slug,
    }),
  );
}

function formatArtifactPrice(
  price: unknown,
  currency: string | null,
) {
  if (
    price === null ||
    price === undefined
  ) {
    return null;
  }

  const numericPrice =
    Number(price);

  if (
    Number.isNaN(
      numericPrice,
    )
  ) {
    return null;
  }

  return new Intl.NumberFormat(
    "it-IT",
    {
      style: "currency",
      currency:
        currency ?? "EUR",
    },
  ).format(numericPrice);
}

export async function generateMetadata({
  params,
}: Atp500TournamentPageProps): Promise<Metadata> {
  const {
    slug,
  } = await params;

  const tournament =
    getAtp500Tournament(
      slug,
    );

  if (!tournament) {
    return {
      title:
        "Tournament not found | AGE202",

      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title =
    `${tournament.name} | ATP 500 Archive | AGE202`;

  const description =
    `${tournament.introduction} Explore the history, iconic moments, legends and recent finals of ${tournament.name}.`;

  return {
    title,
    description,

    keywords: [
      tournament.name,
      tournament.officialName,
      tournament.city,
      tournament.country,
      `${tournament.name} history`,
      `${tournament.name} champions`,
      `${tournament.name} results`,
      "ATP 500",
      "tennis history",
      "AGE202",
    ],

    openGraph: {
      title,
      description,
      type: "website",
    },

    twitter: {
      card:
        "summary_large_image",
      title,
      description,
    },

    robots: {
      index: true,
      follow: true,
    },

    category:
      "ATP 500 tennis",
  };
}

export default async function Atp500TournamentPage({
  params,
}: Atp500TournamentPageProps) {
  const {
    slug,
  } = await params;

  const staticTournament =
    getAtp500Tournament(
      slug,
    );

  if (!staticTournament) {
    notFound();
  }

  const cmsTournament =
    await prisma.tournament.findFirst({
      where: {
        slug,
        category:
          "ATP_500",
        active:
          true,
      },

      select: {
        id: true,

        name: true,
        shortName: true,
        surface: true,
        foundedYear: true,
        city: true,
        country: true,
        countryCode: true,
        venue: true,
        description: true,
        history: true,
        heroImage: true,

        iconicMoments: {
          orderBy: [
            {
              featured:
                "desc",
            },
            {
              sortOrder:
                "asc",
            },
            {
              year:
                "asc",
            },
            {
              createdAt:
                "asc",
            },
          ],

          select: {
            year: true,
            title: true,
            subtitle: true,
            description: true,
            imageUrl: true,
          },
        },

        editions: {
          where: {
            cancelled:
              false,
          },

          orderBy: {
            year:
              "desc",
          },

          take: 5,

          select: {
            year: true,
            endDate: true,
            championName: true,
            runnerUpName: true,
            championCountryCode:
              true,
            runnerUpCountryCode:
              true,
            score: true,

            championPlayer: {
              select: {
                slug: true,
                name: true,
                country:
                  true,
              },
            },

            runnerUpPlayer: {
              select: {
                slug: true,
                name: true,
                country:
                  true,
              },
            },
          },
        },

        champions: {
          where: {
            legend:
              true,
          },

          orderBy: [
            {
              featured:
                "desc",
            },
            {
              sortOrder:
                "asc",
            },
            {
              titles:
                "desc",
            },
            {
              lastTitleYear:
                "desc",
            },
          ],

          select: {
            titles: true,
            firstTitleYear:
              true,
            lastTitleYear:
              true,
            titleYears:
              true,
            finals: true,
            wins: true,
            legend: true,
            featured: true,
            sortOrder: true,
            recordLabel:
              true,
            quote: true,
            imageUrl: true,
            name: true,
            country: true,
            countryCode:
              true,

            player: {
              select: {
                slug: true,
                name: true,
                country:
                  true,
              },
            },
          },
        },
      },
    });

  const tournamentArtifacts =
    cmsTournament
      ? await prisma.artifact.findMany({
          where: {
            tournamentId:
              cmsTournament.id,

            status:
              "PUBLISHED",

            player: {
              active:
                true,
            },
          },

          include: {
            player: true,
            brand: true,

            images: {
              orderBy: [
                {
                  isCover:
                    "desc",
                },
                {
                  sortOrder:
                    "asc",
                },
              ],
            },
          },

          orderBy: [
            {
              availability:
                "asc",
            },
            {
              featured:
                "desc",
            },
            {
              year:
                "desc",
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

          take: 24,
        })
      : [];

  const {
    identity,
    iconicMoments,
    legends,
    recentEditions,
  } =
    mapAtp500TournamentPageData(
      cmsTournament,
      staticTournament,
    );

  const tournamentStyle: TournamentStyle = {
    "--tournament-primary":
      staticTournament.colors.primary,

    "--tournament-secondary":
      staticTournament.colors.secondary,

    "--tournament-glow":
      staticTournament.colors.glow,
  };

  const structuredData = {
    "@context":
      "https://schema.org",

    "@type":
      "SportsEvent",

    name:
      identity.officialName,

    alternateName:
      identity.name,

    description:
      identity.introduction,

    sport:
      "Tennis",

    location: {
      "@type":
        "Place",

      name:
        identity.venue,

      address: {
        "@type":
          "PostalAddress",

        addressLocality:
          identity.city,

        addressCountry:
          identity.country,
      },
    },

    organizer: {
      "@type":
        "Organization",

      name:
        identity.officialName,
    },
  };

  return (
    <main
      style={tournamentStyle}
      className="min-h-screen overflow-hidden bg-[#050B18] text-white selection:bg-[var(--tournament-primary)] selection:text-[#050B18]"
    >
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

      <ATP500TournamentHero
        tournament={
          staticTournament
        }
        identity={
          identity
        }
      />

      <ATP500TournamentIdentity
        tournament={
          staticTournament
        }
        identity={
          identity
        }
      />

      <ATP500IconicMoments
        tournament={
          staticTournament
        }
        tournamentName={
          identity.name
        }
        moments={
          iconicMoments
        }
      />

      <ATP500Legends
        tournament={
          staticTournament
        }
        tournamentName={
          identity.name
        }
        legends={
          legends
        }
      />

      <ATP500RecentEditions
        tournament={
          staticTournament
        }
        tournamentName={
          identity.name
        }
        editions={
          recentEditions
        }
      />

      {tournamentArtifacts.length >
      0 ? (
        <section
          id="tournament-artifacts"
          className="relative overflow-hidden border-y border-white/10 bg-[#07101D] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(circle at 82% 18%, color-mix(in srgb, var(--tournament-primary) 12%, transparent), transparent 34%)",
            }}
          />

          <div className="relative mx-auto max-w-[1440px]">
            <div className="grid gap-8 border-b border-white/10 pb-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
              <div>
                <div className="flex items-center gap-3">
                  <Sparkles
                    size={15}
                    aria-hidden="true"
                    className="text-[var(--tournament-primary)]"
                  />

                  <p className="font-mono text-[8px] font-black uppercase tracking-[0.24em] text-[var(--tournament-primary)] sm:text-[9px]">
                    AGE202 Museum
                    Collection
                  </p>
                </div>

                <h2 className="mt-5 text-4xl font-black uppercase leading-[0.9] tracking-[-0.055em] sm:text-5xl lg:text-7xl">
                  Artifacts
                  <br />
                  of{" "}
                  {
                    identity.name
                  }
                </h2>
              </div>

              <div className="lg:text-right">
                <p className="max-w-xl text-sm leading-7 text-white/45 sm:text-base sm:leading-8 lg:ml-auto">
                  Authentic museum
                  pieces catalogued
                  in direct
                  connection with{" "}

                  <span className="font-semibold text-white/75">
                    {
                      identity.name
                    }
                  </span>

                  . Explore the
                  archive record,
                  story and
                  collecting status
                  of each piece.
                </p>

                <p className="mt-4 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-[var(--tournament-primary)]">
                  {
                    tournamentArtifacts.length
                  }{" "}
                  {tournamentArtifacts.length ===
                  1
                    ? "artifact"
                    : "artifacts"}{" "}
                  catalogued
                </p>
              </div>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {tournamentArtifacts.map(
                (
                  artifact,
                ) => {
                  const cover =
                    artifact.images.find(
                      (
                        image,
                      ) =>
                        image.isCover,
                    ) ??
                    artifact
                      .images[0] ??
                    null;

                  const price =
                    formatArtifactPrice(
                      artifact.price,
                      artifact.currency,
                    );

                  const isAvailable =
                    artifact.availability ===
                    "AVAILABLE";

                  return (
                    <article
                      key={
                        artifact.id
                      }
                      className="group overflow-hidden rounded-[2rem] border border-white/10 bg-[#09111F] transition duration-500 hover:-translate-y-1 hover:border-[var(--tournament-primary)]/30"
                    >
                      <a
                        href={`/artifacts/${artifact.slug}`}
                        className="block outline-none focus-visible:ring-2 focus-visible:ring-[var(--tournament-primary)]"
                        aria-label={`Explore ${artifact.title}`}
                      >
                        <div className="relative aspect-[4/5] overflow-hidden bg-[#050B18]">
                          {cover ? (
                            <Image
                              fill
                              src={
                                cover.url
                              }
                              alt={
                                cover.alt ??
                                artifact.title
                              }
                              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                              className="object-cover transition duration-700 group-hover:scale-[1.04]"
                            />
                          ) : (
                            <div className="absolute inset-0 grid place-items-center">
                              <PackageSearch
                                size={52}
                                className="text-white/10"
                                aria-hidden="true"
                              />
                            </div>
                          )}

                          <div className="absolute inset-0 bg-gradient-to-t from-[#050B18]/70 via-transparent to-black/10" />

                          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-5">
                            <span className="rounded-full border border-white/10 bg-black/50 px-3 py-2 font-mono text-[7px] uppercase tracking-[0.14em] text-white/65 backdrop-blur-md">
                              {
                                artifact.archiveNumber
                              }
                            </span>

                            <span
                              className={[
                                "rounded-full border px-3 py-2 font-mono text-[7px] font-black uppercase tracking-[0.14em] backdrop-blur-md",

                                isAvailable
                                  ? "border-[var(--tournament-primary)]/30 bg-black/50 text-[var(--tournament-primary)]"
                                  : "border-white/10 bg-black/50 text-white/45",
                              ].join(
                                " ",
                              )}
                            >
                              {isAvailable
                                ? "Available"
                                : artifact.availability.replaceAll(
                                    "_",
                                    " ",
                                  )}
                            </span>
                          </div>

                          <span className="absolute bottom-5 right-5 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur-md transition duration-300 group-hover:border-[var(--tournament-primary)] group-hover:bg-[var(--tournament-primary)] group-hover:text-[#050B18]">
                            <ArrowUpRight
                              size={17}
                              aria-hidden="true"
                            />
                          </span>
                        </div>
                      </a>

                      <div className="p-6">
                        <div className="flex items-center justify-between gap-4">
                          <p className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-[var(--tournament-primary)]">
                            {
                              artifact.player.name
                            }
                          </p>

                          <p className="font-mono text-[7px] uppercase tracking-[0.14em] text-white/30">
                            {
                              artifact.brand.name
                            }
                          </p>
                        </div>

                        <a
                          href={`/artifacts/${artifact.slug}`}
                          className="outline-none"
                        >
                          <h3 className="mt-4 text-2xl font-black uppercase leading-tight tracking-[-0.03em] transition group-hover:text-[var(--tournament-primary)]">
                            {
                              artifact.title
                            }
                          </h3>
                        </a>

                        {artifact.subtitle ? (
                          <p className="mt-3 text-sm leading-6 text-white/45">
                            {
                              artifact.subtitle
                            }
                          </p>
                        ) : null}

                        <div className="mt-6 border-t border-white/10 pt-5">
                          <div className="flex items-end justify-between gap-6">
                            <div>
                              <p className="text-sm font-black text-white">
                                {price ??
                                  "Museum record"}
                              </p>

                              <span className="mt-2 inline-flex items-center gap-1.5 font-mono text-[7px] uppercase tracking-[0.12em] text-white/30">
                                <BadgeCheck
                                  size={11}
                                  className="text-[var(--tournament-primary)]"
                                  aria-hidden="true"
                                />

                                AGE202
                                archive
                                record
                              </span>
                            </div>
                          </div>

                          <a
                            href={`/artifacts/${artifact.slug}`}
                            className="group/cta mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--tournament-primary)] px-5 py-3.5 text-center text-[8px] font-black uppercase tracking-[0.18em] text-[#050B18] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tournament-primary)]"
                          >
                            {isAvailable
                              ? "Explore & Collect"
                              : "Explore Artifact"}

                            <ArrowUpRight
                              size={13}
                              aria-hidden="true"
                              className="transition-transform duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5"
                            />
                          </a>

                          <p className="mt-3 text-center font-mono text-[7px] uppercase tracking-[0.14em] text-white/25">
                            {isAvailable
                              ? "Available to collect"
                              : "AGE202 museum archive"}
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                },
              )}
            </div>
          </div>
        </section>
      ) : null}

      <ATP500TournamentNavigation
        currentSlug={
          staticTournament.slug
        }
      />
    </main>
  );
}