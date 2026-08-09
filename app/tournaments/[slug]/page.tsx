import type {
  Metadata,
} from "next";
import {
  notFound,
} from "next/navigation";
import {
  cache,
} from "react";

import TournamentHero from "@/components/tournaments/TournamentHero";

import {
  getMuseumTournamentBySlug,
} from "@/lib/services/museum/tournament.service";

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