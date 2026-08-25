import type {
  Metadata,
} from "next";

import Image from "next/image";
import Link from "next/link";

import {
  notFound,
} from "next/navigation";

import {
  cache,
} from "react";

import {
  ArrowUpRight,
  BadgeCheck,
  PackageSearch,
  Sparkles,
} from "lucide-react";

import TournamentHero from "@/components/tournaments/TournamentHero";

import {
  getArtifactsByTournamentId,
} from "@/lib/repositories/artifact.repository";

import {
  getMuseumTournamentBySlug,
} from "@/lib/services/museum/tournament.service";

/*
 * Le pagine Tournament devono riflettere immediatamente
 * risultati, Artifact e aggiornamenti provenienti dal database.
 *
 * Evitiamo quindi il prerender statico e qualsiasi cache ISR.
 */
export const dynamic =
  "force-dynamic";

export const revalidate = 0;

const getCachedTournamentBySlug =
  cache(
    (slug: string) =>
      getMuseumTournamentBySlug(
        slug,
      ),
  );

type TournamentPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatCategory(
  category: string,
): string {
  return category
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase(),
    );
}

function formatSurface(
  surface: string,
): string {
  return surface
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase(),
    );
}

function formatPrice(
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
}: TournamentPageProps): Promise<Metadata> {
  const {
    slug,
  } = await params;

  const tournament =
    await getCachedTournamentBySlug(
      slug,
    );

  if (!tournament) {
    return {
      title:
        "Tournament not found | AGE202",
    };
  }

  const title =
    tournament.metaTitle ??
    `${tournament.shortName ?? tournament.name} | Tournament Archive | AGE202`;

  const description =
    tournament.metaDescription ??
    tournament.description ??
    `Explore the AGE202 tournament archive dedicated to ${tournament.name}.`;

  return {
    title,
    description,

    openGraph: {
      title,
      description,
      type: "website",

      images:
        tournament.heroImage
          ? [
              {
                url:
                  tournament.heroImage,
                alt:
                  `${tournament.name} — AGE202 Tournament Archive`,
              },
            ]
          : undefined,
    },

    twitter: {
      card:
        "summary_large_image",
      title,
      description,

      images:
        tournament.heroImage
          ? [
              tournament.heroImage,
            ]
          : undefined,
    },

    robots: {
      index: true,
      follow: true,
    },

    category:
      "Tennis tournament archive",
  };
}

export default async function TournamentPage({
  params,
}: TournamentPageProps) {
  const {
    slug,
  } = await params;

  const tournament =
    await getCachedTournamentBySlug(
      slug,
    );

  if (!tournament) {
    notFound();
  }

  /*
   * Artifact collegati tramite relazione Prisma reale.
   *
   * Tournament.id
   *      ↓
   * Artifact.tournamentId
   */
  const artifacts =
    await getArtifactsByTournamentId(
      tournament.id,
    );

  const categoryLabel =
    formatCategory(
      tournament.category,
    );

  const surfaceLabel =
    formatSurface(
      tournament.surface,
    );

  const location = [
    tournament.city,
    tournament.country,
  ]
    .filter(Boolean)
    .join(", ");

  const structuredData = {
    "@context":
      "https://schema.org",

    "@type":
      "SportsEvent",

    name:
      tournament.name,

    description:
      tournament.description ??
      undefined,

    location:
      tournament.venue
        ? {
            "@type":
              "Place",

            name:
              tournament.venue,

            address:
              location ||
              tournament.country,
          }
        : undefined,

    image:
      tournament.heroImage ??
      undefined,

    sport:
      "Tennis",

    organizer: {
      "@type":
        "Organization",

      name:
        "AGE202",
    },

    mainEntityOfPage: {
      "@type":
        "WebPage",

      name:
        `${tournament.name} | AGE202 Tournament Archive`,
    },
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#050B18] text-white">
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

      <TournamentHero
        tournament={
          tournament
        }
      />

      <section
        id="tournament-overview"
        className="border-b border-white/10 px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28"
      >
        <div className="mx-auto max-w-[1440px]">
          <div className="max-w-4xl">
            <p className="font-mono text-[8px] font-black uppercase tracking-[0.24em] text-[#D7FF00] sm:text-[9px]">
              Tournament dossier
            </p>

            <h2 className="mt-4 text-4xl font-black uppercase tracking-[-0.055em] sm:text-5xl lg:text-6xl">
              {tournament.shortName ??
                tournament.name}
            </h2>

            <p className="mt-6 max-w-3xl text-base leading-8 text-white/55 sm:text-lg">
              {tournament.description ??
                `AGE202 tournament archive dedicated to ${tournament.name}.`}
            </p>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            <OverviewFact
              label="Category"
              value={
                categoryLabel
              }
            />

            <OverviewFact
              label="Surface"
              value={
                surfaceLabel
              }
            />

            <OverviewFact
              label="Location"
              value={
                location ||
                tournament.country
              }
            />

            <OverviewFact
              label="Recorded editions"
              value={String(
                tournament
                  .statistics
                  .totalEditions,
              )}
            />
          </div>
        </div>
      </section>

      {artifacts.length > 0 && (
        <section
          id="tournament-artifacts"
          className="relative overflow-hidden border-b border-white/10 bg-[#07101D] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(215,255,0,0.07),transparent_30%)]" />

          <div className="relative mx-auto max-w-[1440px]">
            <div className="grid gap-8 border-b border-white/10 pb-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
              <div>
                <div className="flex items-center gap-3">
                  <Sparkles
                    size={15}
                    className="text-[#D7FF00]"
                    aria-hidden="true"
                  />

                  <p className="font-mono text-[8px] font-black uppercase tracking-[0.24em] text-[#D7FF00] sm:text-[9px]">
                    AGE202 Museum Collection
                  </p>
                </div>

                <h2 className="mt-5 text-4xl font-black uppercase leading-[0.92] tracking-[-0.055em] sm:text-5xl lg:text-7xl">
                  Tournament
                  <br />
                  Artifacts
                </h2>
              </div>

              <p className="max-w-xl text-sm leading-7 text-white/45 sm:text-base sm:leading-8">
                Museum artifacts
                catalogued in connection
                with{" "}
                <span className="font-semibold text-white/75">
                  {tournament.shortName ??
                    tournament.name}
                </span>
                . Explore their stories,
                archive records and
                collecting status.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {artifacts.map(
                (artifact) => {
                  const cover =
                    artifact.images.find(
                      (image) =>
                        image.isCover,
                    ) ??
                    artifact.images[0] ??
                    null;

                  const price =
                    formatPrice(
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
                      className="group overflow-hidden rounded-[2rem] border border-white/10 bg-[#09111F] transition duration-500 hover:-translate-y-1 hover:border-[#D7FF00]/25"
                    >
                      <Link
                        href={`/artifacts/${artifact.slug}`}
                        aria-label={`Explore ${artifact.title}`}
                        className="block outline-none focus-visible:ring-2 focus-visible:ring-[#D7FF00]"
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

                          <div className="absolute inset-0 bg-gradient-to-t from-[#050B18]/55 via-transparent to-black/10" />

                          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-5">
                            <span className="rounded-full border border-white/10 bg-black/45 px-3 py-2 font-mono text-[7px] uppercase tracking-[0.14em] text-white/65 backdrop-blur-md">
                              {
                                artifact.archiveNumber
                              }
                            </span>

                            <span
                              className={[
                                "rounded-full border px-3 py-2 font-mono text-[7px] font-black uppercase tracking-[0.14em] backdrop-blur-md",
                                isAvailable
                                  ? "border-[#D7FF00]/30 bg-[#D7FF00]/10 text-[#D7FF00]"
                                  : "border-white/10 bg-black/45 text-white/45",
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

                          <span className="absolute bottom-5 right-5 grid h-11 w-11 place-items-center rounded-full border border-[#D7FF00]/30 bg-black/50 text-[#D7FF00] backdrop-blur-md transition duration-300 group-hover:bg-[#D7FF00] group-hover:text-[#050B18]">
                            <ArrowUpRight
                              size={17}
                              aria-hidden="true"
                            />
                          </span>
                        </div>
                      </Link>

                      <div className="p-6">
                        <div className="flex items-center justify-between gap-4">
                          <p className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-[#D7FF00]">
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
                          <h3 className="mt-4 text-2xl font-black uppercase leading-tight tracking-[-0.03em] transition group-hover:text-[#D7FF00]">
                            {
                              artifact.title
                            }
                          </h3>
                        </Link>

                        {artifact.subtitle && (
                          <p className="mt-3 text-sm leading-6 text-white/45">
                            {
                              artifact.subtitle
                            }
                          </p>
                        )}

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
                                  className="text-[#D7FF00]"
                                  aria-hidden="true"
                                />

                                AGE202 archive
                                record
                              </span>
                            </div>
                          </div>

                          <Link
                            href={`/artifacts/${artifact.slug}`}
                            className="group/cta mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#D7FF00] px-5 py-3.5 text-center text-[8px] font-black uppercase tracking-[0.18em] text-[#050B18] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D7FF00]"
                          >
                            {isAvailable
                              ? "Explore & Collect"
                              : "Explore Artifact"}

                            <ArrowUpRight
                              size={13}
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
      )}
    </main>
  );
}

type OverviewFactProps = {
  label: string;
  value: string;
};

function OverviewFact({
  label,
  value,
}: OverviewFactProps) {
  return (
    <div className="bg-[#07101D] px-5 py-6 sm:px-6">
      <p className="font-mono text-[7px] font-black uppercase tracking-[0.2em] text-white/28">
        {label}
      </p>

      <p className="mt-3 text-xl font-black uppercase tracking-[-0.035em] text-white">
        {value}
      </p>
    </div>
  );
}