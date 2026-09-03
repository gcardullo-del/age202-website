import type {
   CSSProperties,
} from "react";

import type {
  Metadata,
} from "next";

import Image from "next/image";

import {
  notFound,
  redirect,
} from "next/navigation";

import {
  ArrowUpRight,
  BadgeCheck,
  PackageSearch,
  Sparkles,
} from "lucide-react";

import Masters1000ChampionsTimeline from "@/components/results/Masters1000ChampionsTimeline";
import Masters1000HallOfChampionsSection from "@/components/results/Masters1000HallOfChampionsSection";
import Masters1000LegendsSection from "@/components/results/Masters1000LegendsSection";
import Masters1000TournamentGallery from "@/components/results/Masters1000TournamentGallery";
import Masters1000TournamentFacts from "@/components/results/Masters1000TournamentFacts";
import Masters1000TournamentEditions from "@/components/results/Masters1000TournamentEditions";
import Masters1000TournamentRecords from "@/components/results/Masters1000TournamentRecords";
import Masters1000ChampionSpotlight from "@/components/results/Masters1000ChampionSpotlight";
import Masters1000MuseumChapter from "@/components/results/Masters1000MuseumChapter";
import Masters1000TournamentHero from "@/components/results/Masters1000TournamentHero";
import Masters1000TournamentNavigation from "@/components/results/Masters1000TournamentNavigation";
import Masters1000TournamentOverview from "@/components/results/Masters1000TournamentOverview";
import Masters1000TournamentHistory from "@/components/results/Masters1000TournamentHistory";
import Masters1000TournamentTimeline from "@/components/results/Masters1000TournamentTimeline";
import Masters1000IconicMoments from "@/components/results/Masters1000IconicMoments";
import Masters1000ArchivePreview from "@/components/results/Masters1000ArchivePreview";
import Masters1000MastersNavigation from "@/components/results/Masters1000MastersNavigation";
import Masters1000BackToTop from "@/components/results/Masters1000BackToTop";
import Masters1000TournamentDraw, {
  type Masters1000DrawMatch,
} from "@/components/results/Masters1000TournamentDraw";

import {
  MASTERS_1000_SLUGS,
  getTournament,
  resolveTournamentSlugs,
} from "@/lib/tournament-engine";

import {
  prisma,
} from "@/lib/prisma";

import {
  mapCmsTournamentPageData,
} from "@/lib/mappers/masters-1000-cms.mapper";

type Masters1000PageProps = {
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

/*
 * Results and Museum Artifact connections
 * must always reflect current database data.
 */
export const dynamic =
  "force-dynamic";

export const revalidate =
  0;

export function generateStaticParams() {
  return MASTERS_1000_SLUGS.map(
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
        currency ??
        "EUR",
    },
  ).format(
    numericPrice,
  );
}

export async function generateMetadata({
  params,
}: Masters1000PageProps): Promise<Metadata> {
  const {
    slug,
  } = await params;

  const {
    publicSlug,
  } = resolveTournamentSlugs(
    slug,
  );

  const tournament =
    getTournament(
      publicSlug,
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
    `${tournament.name} Archive | AGE202`;

  const description =
    `${tournament.introduction} Explore the history, identity, timeline, records and defining moments of ${tournament.name}.`;

  return {
    title,
    description,

    keywords: [
      tournament.name,
      tournament.officialName,
      `${tournament.name} history`,
      `${tournament.name} champions`,
      `${tournament.name} results`,
      `${tournament.name} archive`,
      "ATP Masters 1000",
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
      "ATP Masters 1000 tennis",
  };
}

export default async function Masters1000TournamentPage({
  params,
}: Masters1000PageProps) {
  const {
    slug,
  } = await params;

  const {
    publicSlug,
    cmsSlug,
  } = resolveTournamentSlugs(
    slug,
  );

  if (
    slug !==
    publicSlug
  ) {
    redirect(
      `/results/masters-1000/${publicSlug}`,
    );
  }

  const staticTournament =
    getTournament(
      publicSlug,
    );

  if (
    !staticTournament
  ) {
    notFound();
  }

  /*
   * Tournament Studio record.
   *
   * IMPORTANT:
   * id is now included because Artifact.tournamentId
   * points directly to this Tournament record.
   */
  const cmsTournament =
    await prisma.tournament.findUnique({
      where: {
        slug:
          cmsSlug,
      },

      select: {
        id: true,

        name: true,
        shortName: true,
        surface: true,
        foundedYear: true,
        city: true,
        country: true,
        venue: true,
        heroImage: true,
        logoUrl: true,
        description: true,
        history: true,

        galleryItems: {
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
              createdAt:
                "asc",
            },
          ],

          select: {
            id: true,
            imageUrl: true,
            title: true,
            eyebrow: true,
            caption: true,
            alt: true,
          },
        },

        milestones: {
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
            id: true,
            year: true,
            title: true,
            subtitle: true,
            description: true,
          },
        },

        chapters: {
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
              createdAt:
                "asc",
            },
          ],

          select: {
            id: true,
            eyebrow: true,
            title: true,
            subtitle: true,
            description: true,
            yearLabel: true,
          },
        },

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
            id: true,
            year: true,
            title: true,
            subtitle: true,
            description: true,
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

          select: {
            id: true,
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
                name: true,
                slug: true,
                country:
                  true,
              },
            },

            runnerUpPlayer: {
              select: {
                name: true,
                slug: true,
                country:
                  true,
              },
            },
          },
        },

        champions: {
          orderBy: [
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
            id: true,
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
                name: true,
                slug: true,
                country:
                  true,
              },
            },
          },
        },
      },
    });

  /*
   * Latest synchronized ATP singles draw.
   *
   * Tournaments without synchronized matches remain unchanged:
   * Masters1000TournamentDraw returns nothing when this list is empty.
   */
  const currentDrawEdition =
    cmsTournament
      ? await prisma.tournamentEdition.findFirst({
          where: {
            tournamentId:
              cmsTournament.id,

            circuit:
              "ATP",

            drawType:
              "SINGLES",

            cancelled:
              false,

            matches: {
              some: {},
            },
          },

          orderBy: [
            {
              year:
                "desc",
            },
            {
              updatedAt:
                "desc",
            },
          ],

          select: {
            year: true,

            matches: {
              orderBy: [
                {
                  roundOrder:
                    "asc",
                },
                {
                  matchNumber:
                    "asc",
                },
              ],

              select: {
                id: true,
                round: true,
                matchNumber: true,
                scoreSummary: true,
                court: true,
                winnerEntryId: true,
                playerOneEntryId:
                  true,
                playerTwoEntryId:
                  true,

                playerOne: {
                  select: {
                    name: true,
                    seed: true,
                  },
                },

                playerTwo: {
                  select: {
                    name: true,
                    seed: true,
                  },
                },
              },
            },
          },
        })
      : null;

  /*
   * Museum Artifact collection.
   *
   * The production diagnostic already confirmed:
   *
   * Tournament.id === Artifact.tournamentId
   *
   * so this query uses the real Prisma relation.
   */
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

  /*
   * CMS → PUBLIC MASTERS 1000
   *
   * Keep TournamentConfig as visual/content fallback.
   */
  const {
    tournament,
    heroImage,
    cmsGalleryImages,
    publicTimelineEntries,
    placeChapter,
    archiveChapter,
    publicIconicMoments,
    cmsEditions,
    cmsRecentFinals,
    cmsTitleLeaders,
    cmsLegends,
  } =
    mapCmsTournamentPageData(
      cmsTournament,
      staticTournament,
    );

  const tournamentStyle:
    TournamentStyle = {
    "--tournament-primary":
      tournament.colors.primary,

    "--tournament-secondary":
      tournament.colors.secondary,

    "--tournament-glow":
      tournament.colors.glow,
  };

  const structuredData = {
    "@context":
      "https://schema.org",

    "@type":
      "SportsEvent",

    name:
      tournament.officialName,

    alternateName:
      tournament.name,

    description:
      tournament.introduction,

    sport:
      "Tennis",

    location: {
      "@type":
        "Place",

      name:
        tournament.venue,

      address: {
        "@type":
          "PostalAddress",

        addressLocality:
          tournament.city,

        addressCountry:
          tournament.country,
      },
    },

    organizer: {
      "@type":
        "Organization",

      name:
        tournament.officialName,
    },
  };

  return (
    <main
      style={
        tournamentStyle
      }
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

      <Masters1000TournamentHero
        tournament={
          tournament
        }
        heroImage={
          heroImage
        }
      />

      <Masters1000TournamentNavigation
        tournament={
          tournament
        }
      />

      {currentDrawEdition ? (
        <Masters1000TournamentDraw
          tournamentName={
            tournament.name
          }
          year={
            currentDrawEdition.year
          }
          matches={
            currentDrawEdition.matches.map(
              (match) => ({
                ...match,
                round:
                  match.round as Masters1000DrawMatch["round"],
              }),
            )
          }
        />
      ) : null}

      <Masters1000TournamentGallery
        slug={
          tournament.slug
        }
        cmsImages={
          cmsGalleryImages
        }
      />

      <Masters1000MuseumChapter
        eyebrow={
          placeChapter.eyebrow
        }
        title={
          placeChapter.title
        }
        statement={
          placeChapter.statement
        }
        code={
          placeChapter.code
        }
      />

      <Masters1000TournamentOverview
        tournament={
          tournament
        }
      />

      <Masters1000TournamentFacts
        slug={
          tournament.slug
        }
      />

      <Masters1000ChampionSpotlight
        slug={
          tournament.slug
        }
        index={0}
        chapter="Chapter II · The king"
      />

      <Masters1000HallOfChampionsSection
        slug={
          tournament.slug
        }
        tournamentName={
          tournament.name
        }
        cmsRecentFinals={
          cmsRecentFinals
        }
        cmsTitleLeaders={
          cmsTitleLeaders
        }
      />

      <Masters1000ChampionsTimeline
        tournamentName={
          tournament.name
        }
        entries={
          tournament.championsTimeline
        }
      />

      <Masters1000ChampionSpotlight
        slug={
          tournament.slug
        }
        index={1}
        chapter="Chapter III · The rival"
        reverse
      />

      <Masters1000LegendsSection
        slug={
          tournament.slug
        }
        data={
          cmsLegends
        }
      />

      <Masters1000MuseumChapter
        eyebrow={
          archiveChapter.eyebrow
        }
        title={
          archiveChapter.title
        }
        statement={
          archiveChapter.statement
        }
        code={
          archiveChapter.code
        }
      />

      <Masters1000TournamentEditions
        slug={
          tournament.slug
        }
        tournamentName={
          tournament.name
        }
        cmsEditions={
          cmsEditions
        }
      />

      <Masters1000TournamentHistory
        tournament={
          tournament
        }
      />

      <Masters1000TournamentTimeline
        tournamentName={
          tournament.name
        }
        entries={
          publicTimelineEntries
        }
      />

      <Masters1000TournamentRecords
        slug={
          tournament.slug
        }
      />

      <Masters1000ChampionSpotlight
        slug={
          tournament.slug
        }
        index={2}
        chapter="Chapter V · The legacy"
      />

      <Masters1000IconicMoments
        tournamentName={
          tournament.name
        }
        moments={
          publicIconicMoments
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
                    size={
                      15
                    }
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
                    tournament.name
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
                      tournament.name
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
                                size={
                                  52
                                }
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
                              size={
                                17
                              }
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
                                  size={
                                    11
                                  }
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
                              size={
                                13
                              }
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

      <Masters1000ArchivePreview
        tournament={
          tournament
        }
      />

      <Masters1000MastersNavigation
        tournament={
          tournament
        }
      />

      <Masters1000BackToTop />
    </main>
  );
}
