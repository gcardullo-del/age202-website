import type { CSSProperties } from "react";
import type { Metadata } from "next";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import GrandSlamHallOfChampionsSection from "@/components/results/GrandSlamHallOfChampionsSection";
import GrandSlamGallerySection from "@/components/results/GrandSlamGallerySection";
import GrandSlamEditorialChaptersSection from "@/components/results/GrandSlamEditorialChaptersSection";
import GrandSlamIconicMomentsSection from "@/components/results/GrandSlamIconicMomentsSection";
import GrandSlamRecordsSection from "@/components/results/GrandSlamRecordsSection";
import GrandSlamTimelineSection from "@/components/results/GrandSlamTimelineSection";
import GrandSlamHistorySection from "@/components/results/GrandSlamHistorySection";
import GrandSlamEditionsSection from "@/components/results/GrandSlamEditionsSection";
import GrandSlamIconicFinalsSection from "@/components/results/GrandSlamIconicFinalsSection";
import GrandSlamHeroSection from "@/components/results/GrandSlamHeroSection";
import GrandSlamArchivePreviewSection from "@/components/results/GrandSlamArchivePreviewSection";
import GrandSlamNavigation from "@/components/results/GrandSlamNavigation";
import Masters1000TournamentDraw, {
  type Masters1000DrawMatch,
} from "@/components/results/Masters1000TournamentDraw";

import {
  ArrowDown,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  CircleDot,
  Flag,
  MapPin,
  PackageSearch,
  Sparkles,
  Trophy,
} from "lucide-react";

import {
  GRAND_SLAM_SLUGS,
  getGrandSlamBySlug,
  type GrandSlamData,
} from "@/lib/data/grand-slams";

import {
  getMuseumTournamentBySlug,
} from "@/lib/services/museum/tournament.service";

import {
  mapGrandSlamMuseumData,
} from "@/lib/mappers/museum/grand-slam-museum.mapper";

import {
  prisma,
} from "@/lib/prisma";

export const dynamic =
  "force-dynamic";

export const revalidate =
  0;

type GrandSlamPageProps = {
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

export function generateStaticParams() {
  return GRAND_SLAM_SLUGS.map(
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
  ).format(
    numericPrice,
  );
}

export async function generateMetadata({
  params,
}: GrandSlamPageProps): Promise<Metadata> {
  const {
    slug,
  } = await params;

  const fallbackTournament =
    getGrandSlamBySlug(
      slug,
    );

  if (!fallbackTournament) {
    return {
      title:
        "Tournament not found | AGE202",

      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const museumTournament =
    await getMuseumTournamentBySlug(
      slug,
    );

  const tournament =
    mapGrandSlamMuseumData(
      fallbackTournament,
      museumTournament,
    );

  const title =
    `${tournament.name} Archive | AGE202`;

  const description =
    `${tournament.introduction} Explore the history, timeline, identity and records of ${tournament.name}.`;

  return {
    title,
    description,

    keywords: [
      tournament.name,
      `${tournament.name} history`,
      `${tournament.name} champions`,
      `${tournament.name} results`,
      `${tournament.name} archive`,
      "Grand Slam tennis",
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
      "Grand Slam tennis",
  };
}

export default async function GrandSlamTournamentPage({
  params,
}: GrandSlamPageProps) {
  const {
    slug,
  } = await params;

  const fallbackTournament =
    getGrandSlamBySlug(
      slug,
    );

  if (!fallbackTournament) {
    notFound();
  }

  const museumTournament =
    await getMuseumTournamentBySlug(
      slug,
    );

  const tournament =
    mapGrandSlamMuseumData(
      fallbackTournament,
      museumTournament,
    );

  /*
   * Latest synchronized ATP singles draw.
   *
   * During an active Grand Slam this contains the progressive
   * tournament results already synchronized by AGE202.
   */
  const currentDrawEdition =
    museumTournament
      ? await prisma.tournamentEdition.findFirst({
          where: {
            tournamentId:
              museumTournament.id,

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
   * GRAND SLAM → ARTIFACT
   *
   * Museum Tournament.id
   *        ↓
   * Artifact.tournamentId
   *
   * The same relational system already used
   * by the Masters 1000 and ATP 500 archives.
   */
  const tournamentArtifacts =
    museumTournament
      ? await prisma.artifact.findMany({
          where: {
            tournamentId:
              museumTournament.id,

            status:
              "PUBLISHED",

            player: {
              active: true,
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
        tournament.name,
    },
  };

  return (
    <main
      style={
        tournamentStyle
      }
      className="min-h-screen overflow-hidden bg-[#050B18] text-white"
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

      <GrandSlamHeroSection
        tournament={
          tournament
        }
      />

      <TournamentNavigation
        tournament={
          tournament
        }
        hasArtifacts={
          tournamentArtifacts.length >
          0
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

      <TournamentOverview
        tournament={
          tournament
        }
      />

      <GrandSlamGallerySection
        slug={
          tournament.slug
        }
      />

      <GrandSlamHallOfChampionsSection
        slug={
          tournament.slug
        }
      />

      <GrandSlamEditionsSection
        slug={
          tournament.slug
        }
      />

      <GrandSlamIconicFinalsSection
        slug={
          tournament.slug
        }
      />

      <GrandSlamEditorialChaptersSection
        slug={
          tournament.slug
        }
      />

      <GrandSlamHistorySection
        slug={
          tournament.slug
        }
        fallbackHistory={
          tournament.history
        }
        fallbackFounded={
          tournament.founded
        }
      />

      <GrandSlamTimelineSection
        slug={
          tournament.slug
        }
        fallbackEntries={
          tournament.timeline
        }
      />

      <GrandSlamRecordsSection
        slug={
          tournament.slug
        }
        fallbackRecords={
          tournament.records
        }
      />

      <GrandSlamIconicMomentsSection
        slug={
          tournament.slug
        }
      />

      {tournamentArtifacts.length >
      0 ? (
        <section
          id="artifacts"
          className="scroll-mt-24 relative overflow-hidden border-y border-white/10 bg-[#07101D] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28"
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

                  . Explore their
                  archive records,
                  stories and
                  collecting status.
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
                      <Link
                        href={`/artifacts/${artifact.slug}`}
                        aria-label={`Explore ${artifact.title}`}
                        className="block outline-none focus-visible:ring-2 focus-visible:ring-[var(--tournament-primary)]"
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
                      </Link>

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

                        <Link
                          href={`/artifacts/${artifact.slug}`}
                          className="outline-none"
                        >
                          <h3 className="mt-4 text-2xl font-black uppercase leading-tight tracking-[-0.03em] transition group-hover:text-[var(--tournament-primary)]">
                            {
                              artifact.title
                            }
                          </h3>
                        </Link>

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

                          <Link
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
                          </Link>

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

      <GrandSlamArchivePreviewSection
        tournament={
          tournament
        }
      />

      <GrandSlamNavigation
        tournament={
          tournament
        }
      />

      <BackToTop />
    </main>
  );
}

type TournamentNavigationProps = {
  tournament: GrandSlamData;
  hasArtifacts: boolean;
};

function TournamentNavigation({
  tournament,
  hasArtifacts,
}: TournamentNavigationProps) {
  return (
    <nav
      aria-label={`${tournament.name} page sections`}
      className="sticky top-0 z-40 border-b border-white/10 bg-[#050B18]/95 shadow-[0_14px_40px_rgba(0,0,0,0.22)] backdrop-blur-2xl"
    >
      <div className="mx-auto flex min-h-[74px] max-w-[1480px] items-center px-5 sm:px-8 lg:px-12">
        <div className="flex w-full items-center gap-4 overflow-x-auto py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="sticky left-0 z-10 hidden shrink-0 bg-[#050B18]/95 pr-4 sm:block">
            <div className="flex min-h-[48px] items-center gap-3.5 border-r border-white/10 pr-5">
              <span className="grid h-9 w-9 place-items-center rounded-xl border border-[var(--tournament-primary)]/25 bg-[var(--tournament-primary)]/[0.06] text-[var(--tournament-primary)]">
                <Trophy
                  size={14}
                  strokeWidth={
                    1.5
                  }
                  aria-hidden="true"
                />
              </span>

              <div>
                <span className="block font-mono text-[7px] font-black uppercase tracking-[0.2em] text-white/30">
                  Tournament
                </span>

                <span className="mt-0.5 block font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[var(--tournament-primary)]">
                  {
                    tournament.code
                  }
                </span>
              </div>
            </div>
          </div>

          <SectionLink
            href="#overview"
            label="Overview"
            index="01"
          />

          <SectionLink
            href="#gallery"
            label="Gallery"
            index="02"
          />

          <SectionLink
            href="#champions"
            label="Champions"
            index="03"
          />

          <SectionLink
            href="#editions"
            label="Editions"
            index="04"
          />

          <SectionLink
            href="#iconic-finals"
            label="Iconic Finals"
            index="05"
          />

          <SectionLink
            href="#chapters"
            label="Chapters"
            index="06"
          />

          <SectionLink
            href="#history"
            label="History"
            index="07"
          />

          <SectionLink
            href="#timeline"
            label="Timeline"
            index="08"
          />

          <SectionLink
            href="#records"
            label="Records"
            index="09"
          />

          <SectionLink
            href="#moments"
            label="Moments"
            index="10"
          />

          {hasArtifacts ? (
            <SectionLink
              href="#artifacts"
              label="Artifacts"
              index="11"
            />
          ) : null}

          <SectionLink
            href="#archive"
            label="Archive"
            index={
              hasArtifacts
                ? "12"
                : "11"
            }
          />
        </div>
      </div>
    </nav>
  );
}

type SectionLinkProps = {
  href: string;
  label: string;
  index: string;
};

function SectionLink({
  href,
  label,
  index,
}: SectionLinkProps) {
  return (
    <a
      href={href}
      className="group relative flex min-h-[48px] shrink-0 items-center gap-2.5 rounded-xl border border-transparent px-4 py-2.5 transition duration-200 hover:border-white/10 hover:bg-white/[0.035]"
    >
      <span className="font-mono text-[7px] font-black tracking-[0.14em] text-[var(--tournament-primary)]/55 transition group-hover:text-[var(--tournament-primary)]">
        {index}
      </span>

      <span className="font-mono text-[9px] font-black uppercase tracking-[0.16em] text-white/52 transition group-hover:text-white sm:text-[10px]">
        {label}
      </span>

      <span className="absolute inset-x-4 bottom-0 h-px origin-left scale-x-0 bg-[var(--tournament-primary)] transition-transform duration-200 group-hover:scale-x-100" />
    </a>
  );
}

type TournamentOverviewProps = {
  tournament: GrandSlamData;
};

function TournamentOverview({
  tournament,
}: TournamentOverviewProps) {
  return (
    <section
      id="overview"
      className="scroll-mt-24 relative px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <div
        className="pointer-events-none absolute -left-48 top-20 h-[32rem] w-[32rem] rounded-full blur-3xl"
        style={{
          backgroundColor:
            tournament.colors.glow,
          opacity: 0.32,
        }}
      />

      <div className="relative mx-auto max-w-[1440px]">
        <SectionHeading
          eyebrow="Tournament overview"
          title={`Inside ${tournament.name}`}
          description="The essential identity, setting and sporting characteristics of the championship."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
          <OverviewCard
            icon={MapPin}
            label="Location"
            value={`${tournament.city}, ${tournament.country}`}
            description="The host city and country of the championship."
          />

          <OverviewCard
            icon={Building2}
            label="Venue"
            value={
              tournament.venue
            }
            description="The permanent home and principal setting of the event."
          />

          <OverviewCard
            icon={CircleDot}
            label="Court"
            value={
              tournament.surface
            }
            description="The surface that shapes movement, rhythm and tactics."
          />

          <OverviewCard
            icon={CalendarDays}
            label="Calendar"
            value={
              tournament.calendar
            }
            description="Its traditional position within the tennis season."
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#07101D] p-7 sm:p-9 lg:p-11">
            <div className="pointer-events-none absolute -right-12 -top-20 text-[10rem] font-black uppercase leading-none tracking-[-0.09em] text-white/[0.025]">
              {
                tournament.code
              }
            </div>

            <div className="relative">
              <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-[var(--tournament-primary)]">
                <Flag
                  size={20}
                  strokeWidth={
                    1.4
                  }
                  aria-hidden="true"
                />
              </span>

              <p className="mt-8 font-mono text-[8px] font-black uppercase tracking-[0.2em] text-[var(--tournament-primary)]">
                Tournament character
              </p>

              <h3 className="mt-4 max-w-3xl text-3xl font-black uppercase leading-[0.95] tracking-[-0.045em] sm:text-4xl">
                {
                  tournament.identity
                }
              </h3>

              <p className="mt-6 max-w-3xl text-sm leading-7 text-white/45 sm:text-base">
                {
                  tournament.introduction
                }
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.025] p-7 sm:p-9">
            <p className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-[var(--tournament-primary)]">
              Tournament statement
            </p>

            <blockquote className="mt-7 text-3xl font-black uppercase leading-[0.98] tracking-[-0.045em] text-white/76">
              “
              {
                tournament.motto
              }
              ”
            </blockquote>

            <div className="mt-9 border-t border-white/10 pt-6">
              <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/28">
                AGE202 tournament
                archive
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type OverviewCardProps = {
  icon: typeof MapPin;
  label: string;
  value: string;
  description: string;
};

function OverviewCard({
  icon: Icon,
  label,
  value,
  description,
}: OverviewCardProps) {
  return (
    <article className="group rounded-[1.7rem] border border-white/10 bg-[#07101D] p-6 transition hover:-translate-y-1 hover:border-[var(--tournament-primary)]">
      <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-[var(--tournament-primary)]">
        <Icon
          size={18}
          strokeWidth={1.4}
          aria-hidden="true"
        />
      </span>

      <p className="mt-7 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/28">
        {label}
      </p>

      <h3 className="mt-3 text-xl font-black uppercase leading-tight tracking-[-0.03em]">
        {value}
      </h3>

      <p className="mt-4 text-xs leading-6 text-white/35">
        {description}
      </p>
    </article>
  );
}

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_470px] lg:items-end">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--tournament-primary)]">
          {eyebrow}
        </p>

        <h2 className="mt-5 max-w-5xl text-4xl font-black uppercase leading-[0.9] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
          {title}
        </h2>
      </div>

      <p className="text-sm leading-7 text-white/43 lg:text-right">
        {description}
      </p>
    </div>
  );
}

function BackToTop() {
  return (
    <div className="border-t border-white/10 px-5 py-8 text-center sm:px-8 lg:px-12">
      <a
        href="#"
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-5 py-3 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/42 transition hover:border-[var(--tournament-primary)] hover:text-[var(--tournament-primary)]"
      >
        Back to top

        <ArrowDown
          size={13}
          className="rotate-180"
          aria-hidden="true"
        />
      </a>
    </div>
  );
}