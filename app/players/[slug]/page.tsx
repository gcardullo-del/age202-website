import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { ArrowDown, ListTree } from "lucide-react";

import {
  CareerEventCategory,
} from "@/generated/prisma/client";

import ArchivePassport from "@/components/players/atp/ArchivePassport";
import PlayerArtifacts from "@/components/players/atp/PlayerArtifacts";
import PlayerDossier from "@/components/players/atp/PlayerDossier";
import PlayerHero from "@/components/players/atp/PlayerHero";
import PlayerIntelligence from "@/components/players/atp/PlayerIntelligence";
import PlayerOverview from "@/components/players/atp/PlayerOverview";
import RelatedCollections from "@/components/players/atp/RelatedCollections";
import RelatedPlayers from "@/components/players/atp/RelatedPlayers";
import TrophyCabinet from "@/components/players/atp/TrophyCabinet";
import PlayerTournamentResults from "@/components/players/atp/PlayerTournamentResults";

import {
  getAdjacentArchivePlayers,
  getPlayerBySlug,
  getPlayerRelatedCollections,
  getPlayerTournamentEditions,
} from "@/lib/repositories/player.repository";

import {
  prisma,
} from "@/lib/prisma";

import {
  getPlayerTrophyStats,
} from "@/lib/services/players/player-trophy-stats.service";

const getCachedPlayerBySlug = cache((slug: string) =>
  getPlayerBySlug(slug),
);

type PlayerPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type AdjacentArchivePlayers = Awaited<
  ReturnType<typeof getAdjacentArchivePlayers>
>;

type NavigationPlayer = NonNullable<
  AdjacentArchivePlayers["previousPlayer"]
>;

function getLocalHeroImage(slug: string): string {
  /*
   * Convenzione ATP Archive Premium:
   * public/players/heroes/<player-slug>.webp
   *
   * Esempio:
   * public/players/heroes/alexander-zverev.webp
   */
  return `/players/heroes/${slug}.webp`;
}

function getCollectionLabel(collectionType: string): string {
  return collectionType === "FEATURED"
    ? "Champion Collection"
    : collectionType.replaceAll("_", " ");
}

function getCountryLabel(
  rankingCountry: string | null | undefined,
  playerCountry: string | null | undefined,
): string {
  return rankingCountry ?? playerCountry ?? "International";
}

function calculateArchiveScore({
  hasHeroImage,
  hasBiography,
  hasQuote,
  hasRanking,
  hasProfile,
  artifactCount,
  brandCount,
}: {
  hasHeroImage: boolean;
  hasBiography: boolean;
  hasQuote: boolean;
  hasRanking: boolean;
  hasProfile: boolean;
  artifactCount: number;
  brandCount: number;
}): number {
  const score =
    (hasHeroImage ? 15 : 0) +
    (hasBiography ? 15 : 0) +
    (hasQuote ? 10 : 0) +
    (hasRanking ? 20 : 0) +
    (hasProfile ? 20 : 0) +
    Math.min(artifactCount * 4, 12) +
    Math.min(brandCount * 4, 8);

  return Math.min(score, 100);
}

function getArchiveScoreLabel(score: number): string {
  if (score >= 85) return "Museum grade";
  if (score >= 65) return "Established";
  if (score >= 40) return "Developing";
  return "Emerging";
}

export async function generateMetadata({
  params,
}: PlayerPageProps): Promise<Metadata> {
  const { slug } = await params;
  const player = await getCachedPlayerBySlug(slug);

  if (!player) {
    return {
      title: "Player not found | AGE202",
    };
  }

  const profile = player.playerProfile;

  const description =
    profile?.biographyShort ??
    player.biography ??
    `Explore the AGE202 ATP Archive profile dedicated to ${player.name}.`;

  const socialImage =
    player.heroImage ??
    getLocalHeroImage(player.slug);

  return {
    title: `${player.name} | ATP Archive | AGE202`,
    description,

    openGraph: {
      title: `${player.name} | ATP Archive | AGE202`,
      description,
      type: "profile",
      images: [
        {
          url: socialImage,
          alt: `${player.name} — AGE202 ATP Archive`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `${player.name} | ATP Archive | AGE202`,
      description,
      images: [socialImage],
    },

    robots: {
      index: true,
      follow: true,
    },

    category: "Tennis archive",
  };
}

export default async function PlayerPage({
  params,
}: PlayerPageProps) {
  const { slug } = await params;
  const player = await getCachedPlayerBySlug(slug);

  if (!player) {
    notFound();
  }

  const ranking = player.atpPlayer;
  const profile = player.playerProfile;

  const [
    adjacentPlayers,
    relatedCollections,
    tournamentEditions,
    davisCupCareerEvents,
  ] = await Promise.all([
    ranking
      ? getAdjacentArchivePlayers(
          ranking.rank,
          player.id,
        )
      : Promise.resolve({
          previousPlayer: null,
          nextPlayer: null,
        }),

    getPlayerRelatedCollections(
      player.id,
    ),

    getPlayerTournamentEditions(
      player.id,
    ),

    prisma.playerCareerEvent.findMany({
      where: {
        playerId:
          player.id,

        category:
          CareerEventCategory.DAVIS_CUP,
      },

      select: {
        year: true,
      },
    }),
  ]);

  const davisCupTitles =
    new Set(
      davisCupCareerEvents.map(
        (event) =>
          event.year,
      ),
    ).size;

  const liveTrophyStats =
    getPlayerTrophyStats({
      playerId:
        player.id,

      tournamentEditions,

      davisCupTitles,
    });

  /*
   * Le Hero dei Top 50 vivono in:
   * public/players/heroes/<slug>.webp
   *
   * Il campo Prisma player.heroImage rimane prioritario:
   * permette in futuro di usare un percorso diverso senza
   * modificare questo file.
   */
  const heroImage =
    player.heroImage ??
    getLocalHeroImage(player.slug);

  const portraitImage =
    player.portraitImage ??
    ranking?.imageUrl ??
    null;

  const artifactCount =
    player._count.artifacts;

  const brands = Array.from(
    new Set(
      player.artifacts.map(
        (artifact) => artifact.brand.name,
      ),
    ),
  );

  const availableArtifacts =
    player.artifacts.filter(
      (artifact) =>
        artifact.availability === "AVAILABLE",
    ).length;

  const soldArtifacts =
    player.artifacts.filter(
      (artifact) =>
        artifact.availability === "SOLD",
    ).length;

  const reservedArtifacts =
    player.artifacts.filter(
      (artifact) =>
        artifact.availability !== "AVAILABLE" &&
        artifact.availability !== "SOLD",
    ).length;

  /*
   * Sarà collegato al repository dei certificati
   * quando la relazione sarà inclusa nella query Player.
   */
  const certifiedArtifacts = 0;

  const countryLabel = getCountryLabel(
    ranking?.country,
    player.country,
  );

  const collectionLabel =
    getCollectionLabel(
      player.collectionType,
    );

  const hasBiography = Boolean(
    profile?.biographyShort ??
      profile?.biographyLong ??
      player.biography,
  );

  const hasProfile = Boolean(
    profile &&
      (
        profile.birthDate ||
        profile.height ||
        profile.weight ||
        profile.turnedPro ||
        profile.careerHigh ||
        profile.atpTitles > 0 ||
        profile.grandSlams > 0 ||
        profile.playingStyle
      ),
  );

  const profileCompletionChecks = [
    Boolean(heroImage),
    hasBiography,
    Boolean(player.quote),
    Boolean(ranking),
    hasProfile,
    artifactCount > 0,
    brands.length > 0,
  ];

  const profileCompletion =
    profileCompletionChecks.filter(Boolean).length;

  const profileCompletionLabel =
    `${profileCompletion}/${profileCompletionChecks.length}`;

  const archiveScore =
    calculateArchiveScore({
      hasHeroImage: Boolean(heroImage),
      hasBiography,
      hasQuote: Boolean(player.quote),
      hasRanking: Boolean(ranking),
      hasProfile,
      artifactCount,
      brandCount: brands.length,
    });

  const archiveScoreLabel =
    getArchiveScoreLabel(archiveScore);

  const archiveConnections: NavigationPlayer[] = [
    adjacentPlayers.previousPlayer,
    adjacentPlayers.nextPlayer,
  ].flatMap((connectedPlayer) =>
    connectedPlayer
      ? [connectedPlayer]
      : [],
  );

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: player.name,

    description:
      profile?.biographyShort ??
      player.biography ??
      `AGE202 ATP Archive profile dedicated to ${player.name}.`,

    nationality: countryLabel,
    image: heroImage,

    birthDate:
      profile?.birthDate
        ? profile.birthDate
            .toISOString()
            .slice(0, 10)
        : undefined,

    birthPlace:
      profile?.birthPlace ??
      undefined,

    height:
      profile?.height
        ? `${profile.height} cm`
        : undefined,

    weight:
      profile?.weight
        ? `${profile.weight} kg`
        : undefined,

    knowsAbout: [
      "Tennis",
      "ATP Tour",
      "Tennis memorabilia",
      "Collectible tennis apparel",
    ],

    mainEntityOfPage: {
      "@type": "WebPage",
      name: `${player.name} | ATP Archive | AGE202`,
    },
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#050B18] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            structuredData,
          ).replace(/</g, "\\u003c"),
        }}
      />

      <PlayerHero
        player={player}
        ranking={ranking}
        heroImage={heroImage}
        portraitImage={portraitImage}
        countryLabel={countryLabel}
        collectionLabel={collectionLabel}
        artifactCount={artifactCount}
        brandCount={brands.length}
      />

      <nav
        aria-label="Player profile sections"
        className="sticky top-0 z-40 border-b border-white/10 bg-[#050B18]/92 px-5 py-3 backdrop-blur-xl sm:px-8 lg:px-12"
      >
        <div className="mx-auto flex max-w-[1440px] items-center gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <h2 className="sr-only">
            Player profile navigation
          </h2>

          <span className="hidden shrink-0 items-center gap-2 border-r border-white/10 pr-4 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-[#D7FF00] sm:inline-flex">
            <ListTree
              size={13}
              aria-hidden="true"
            />
            Profile index
          </span>

          <ProfileIndexLink
            href="#career-overview"
            label="Overview"
          />

          <ProfileIndexLink
            href="#player-dossier"
            label="Dossier"
          />

          <ProfileIndexLink
            href="#atp-intelligence"
            label="ATP data"
          />

          <ProfileIndexLink
            href="#trophy-cabinet"
            label="Honours"
          />

          {tournamentEditions.length > 0 ? (
            <ProfileIndexLink
              href="#tournament-results"
              label="Results"
            />
          ) : null}

          <ProfileIndexLink
            href="#player-artifacts"
            label="Collection"
          />

          <ProfileIndexLink
            href="#archive-passport"
            label="Passport"
          />

          {relatedCollections.length > 0 ? (
            <ProfileIndexLink
              href="#related-collections"
              label="Collections"
            />
          ) : null}

          {archiveConnections.length > 0 ? (
            <ProfileIndexLink
              href="#related-players"
              label="Players"
            />
          ) : null}
        </div>
      </nav>

      <PlayerOverview
        player={player}
        ranking={ranking}
        countryLabel={countryLabel}
        collectionLabel={collectionLabel}
        brands={brands}
        artifactCount={artifactCount}
        availableArtifacts={
          availableArtifacts
        }
      />

      <PlayerDossier
        player={player}
        ranking={ranking}
        countryLabel={countryLabel}
        collectionLabel={collectionLabel}
        artifactCount={artifactCount}
        brands={brands}
      />

      <PlayerIntelligence
        player={player}
        ranking={ranking}
        artifactCount={artifactCount}
        availableArtifacts={
          availableArtifacts
        }
        brands={brands}
        archiveScore={archiveScore}
        archiveScoreLabel={
          archiveScoreLabel
        }
        hasHeroImage={Boolean(heroImage)}
      />

      <TrophyCabinet
        playerName={player.name}
        profile={profile}
        profileCompletionLabel={
          profileCompletionLabel
        }
        liveStats={
          liveTrophyStats
        }
      />

      {tournamentEditions.length > 0 ? (
        <PlayerTournamentResults
          playerId={player.id}
          playerName={player.name}
          editions={tournamentEditions}
        />
      ) : null}

      <PlayerArtifacts
        player={player}
      />

      <ArchivePassport
        player={player}
        ranking={ranking}
        collectionLabel={collectionLabel}
        artifactCount={artifactCount}
        availableArtifacts={
          availableArtifacts
        }
        soldArtifacts={soldArtifacts}
        reservedArtifacts={
          reservedArtifacts
        }
        brandCount={brands.length}
        certifiedArtifacts={
          certifiedArtifacts
        }
        archiveScore={archiveScore}
        archiveScoreLabel={
          archiveScoreLabel
        }
      />

      {relatedCollections.length > 0 ? (
        <RelatedCollections
          playerName={player.name}
          collections={relatedCollections}
        />
      ) : null}

      {archiveConnections.length > 0 ? (
        <RelatedPlayers
          playerName={player.name}
          archiveConnections={archiveConnections.map(
            (connectedPlayer) => ({
              slug: connectedPlayer.slug,
              name: connectedPlayer.name,

              heroImage:
                connectedPlayer.heroImage ??
                getLocalHeroImage(
                  connectedPlayer.slug,
                ),

              country:
                connectedPlayer.atpPlayer
                  ?.country ??
                connectedPlayer.country ??
                "International",

              ranking:
                connectedPlayer.atpPlayer
                  ?.rank ??
                null,
            }),
          )}
        />
      ) : null}

      {/*
       * PlayerNavigation è stato rimosso:
       * RelatedPlayers offre già la navigazione precedente/successiva
       * e impedisce il doppione mostrato a fondo pagina.
       */}

      <div className="border-t border-white/10 px-5 py-8 text-center sm:px-8 lg:px-12">
        <a
          href="#player-profile-title"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-5 py-3 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/42 outline-none transition hover:border-[#D7FF00]/35 hover:text-[#D7FF00] focus-visible:border-[#D7FF00]/60 focus-visible:text-[#D7FF00] focus-visible:ring-2 focus-visible:ring-[#D7FF00]/20 motion-reduce:transition-none"
        >
          Back to top

          <ArrowDown
            size={13}
            className="rotate-180"
            aria-hidden="true"
          />
        </a>
      </div>
    </main>
  );
}

type ProfileIndexLinkProps = {
  href: string;
  label: string;
};

function ProfileIndexLink({
  href,
  label,
}: ProfileIndexLinkProps) {
  return (
    <a
      href={href}
      className="shrink-0 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2 font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/42 outline-none transition hover:border-[#D7FF00]/35 hover:bg-[#D7FF00]/[0.06] hover:text-[#D7FF00] focus-visible:border-[#D7FF00]/60 focus-visible:text-[#D7FF00] focus-visible:ring-2 focus-visible:ring-[#D7FF00]/20 motion-reduce:transition-none sm:text-[8px]"
    >
      {label}
    </a>
  );
}