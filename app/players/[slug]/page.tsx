import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { ArrowDown, ListTree } from "lucide-react";

import PlayerDossier from "@/components/players/atp/PlayerDossier";
import PlayerHero from "@/components/players/atp/PlayerHero";
import PlayerIntelligence from "@/components/players/atp/PlayerIntelligence";
import PlayerArtifacts from "@/components/players/atp/PlayerArtifacts";
import TrophyCabinet from "@/components/players/atp/TrophyCabinet";
import ArchivePassport from "@/components/players/atp/ArchivePassport";
import PlayerOverview from "@/components/players/atp/PlayerOverview";
import RelatedPlayers from "@/components/players/atp/RelatedPlayers";
import PlayerNavigation from "@/components/players/atp/PlayerNavigation";

import {
  getAdjacentArchivePlayers,
  getPlayerBySlug,
} from "@/lib/repositories/player.repository";

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

  const description =
    player.biography ??
    `Explore the AGE202 player archive dedicated to ${player.name}.`;

  const socialImage =
    player.heroImage ??
    player.portraitImage ??
    player.atpPlayer?.imageUrl ??
    null;

  return {
    title: `${player.name} | AGE202`,
    description,
    openGraph: {
      title: `${player.name} | AGE202`,
      description,
      type: "profile",
      images: socialImage
        ? [
            {
              url: socialImage,
              alt: player.name,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${player.name} | AGE202`,
      description,
      images: socialImage ? [socialImage] : undefined,
    },
    robots: {
      index: true,
      follow: true,
    },
    category: "Tennis archive",
  };
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
  artifactCount,
  brandCount,
}: {
  hasHeroImage: boolean;
  hasBiography: boolean;
  hasQuote: boolean;
  hasRanking: boolean;
  artifactCount: number;
  brandCount: number;
}): number {
  const score =
    (hasHeroImage ? 20 : 0) +
    (hasBiography ? 20 : 0) +
    (hasQuote ? 10 : 0) +
    (hasRanking ? 20 : 0) +
    Math.min(artifactCount * 5, 20) +
    Math.min(brandCount * 5, 10);

  return Math.min(score, 100);
}

function getArchiveScoreLabel(score: number): string {
  if (score >= 85) return "Museum grade";
  if (score >= 65) return "Established";
  if (score >= 40) return "Developing";
  return "Emerging";
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
  const adjacentPlayers = ranking
    ? await getAdjacentArchivePlayers(ranking.rank, player.id)
    : {
        previousPlayer: null,
        nextPlayer: null,
      };

  const heroImage =
    player.heroImage ??
    player.portraitImage ??
    ranking?.imageUrl ??
    null;

  const artifactCount = player._count.artifacts;

  const brands = Array.from(
    new Set(player.artifacts.map((artifact) => artifact.brand.name)),
  );

  const availableArtifacts = player.artifacts.filter(
    (artifact) => artifact.availability === "AVAILABLE",
  ).length;

  const soldArtifacts = player.artifacts.filter(
    (artifact) => artifact.availability === "SOLD",
  ).length;

  const reservedArtifacts = player.artifacts.filter(
    (artifact) =>
      artifact.availability !== "AVAILABLE" &&
      artifact.availability !== "SOLD",
  ).length;

  const certifiedArtifacts = 0;

  const countryLabel = getCountryLabel(
    ranking?.country,
    player.country,
  );

  const collectionLabel = getCollectionLabel(
    player.collectionType,
  );

  const profileCompletion = [
    Boolean(heroImage),
    Boolean(player.biography),
    Boolean(player.quote),
    Boolean(ranking),
    artifactCount > 0,
    brands.length > 0,
  ].filter(Boolean).length;

  const profileCompletionLabel = `${profileCompletion}/6`;

  const archiveScore = calculateArchiveScore({
    hasHeroImage: Boolean(heroImage),
    hasBiography: Boolean(player.biography),
    hasQuote: Boolean(player.quote),
    hasRanking: Boolean(ranking),
    artifactCount,
    brandCount: brands.length,
  });

  const archiveScoreLabel = getArchiveScoreLabel(archiveScore);

  const archiveConnections: NavigationPlayer[] = [
    adjacentPlayers.previousPlayer,
    adjacentPlayers.nextPlayer,
  ].flatMap((connectedPlayer) =>
    connectedPlayer ? [connectedPlayer] : [],
  );

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: player.name,
    description:
      player.biography ??
      `AGE202 player archive profile dedicated to ${player.name}.`,
    nationality: countryLabel,
    image: heroImage ?? undefined,
    knowsAbout: [
      "Tennis",
      "ATP Tour",
      "Tennis memorabilia",
      "Collectible tennis apparel",
    ],
    mainEntityOfPage: {
      "@type": "WebPage",
      name: `${player.name} | AGE202`,
    },
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#050B18] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <PlayerHero
        player={player}
        ranking={ranking}
        heroImage={heroImage}
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
          <h2 className="sr-only">Player profile navigation</h2>

          <span className="hidden shrink-0 items-center gap-2 border-r border-white/10 pr-4 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-[#D7FF00] sm:inline-flex">
            <ListTree size={13} aria-hidden="true" />
            Profile index
          </span>

          <ProfileIndexLink href="#career-overview" label="Overview" />
          <ProfileIndexLink href="#player-dossier" label="Dossier" />
          <ProfileIndexLink href="#atp-intelligence" label="ATP data" />
          <ProfileIndexLink href="#trophy-cabinet" label="Honours" />
          <ProfileIndexLink href="#player-artifacts" label="Collection" />
          <ProfileIndexLink href="#archive-passport" label="Passport" />
          {archiveConnections.length > 0 ? (
            <ProfileIndexLink href="#related-players" label="Players" />
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
        availableArtifacts={availableArtifacts}
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
        availableArtifacts={availableArtifacts}
        brands={brands}
        archiveScore={archiveScore}
        archiveScoreLabel={archiveScoreLabel}
        hasHeroImage={Boolean(heroImage)}
      />

      <TrophyCabinet
        profileCompletionLabel={profileCompletionLabel}
      />

      <PlayerArtifacts
        player={player}
      />

      <ArchivePassport
        player={player}
        ranking={ranking}
        collectionLabel={collectionLabel}
        artifactCount={artifactCount}
        availableArtifacts={availableArtifacts}
        soldArtifacts={soldArtifacts}
        reservedArtifacts={reservedArtifacts}
        brandCount={brands.length}
        certifiedArtifacts={certifiedArtifacts}
        archiveScore={archiveScore}
        archiveScoreLabel={archiveScoreLabel}
      />

      {archiveConnections.length > 0 ? (
        <RelatedPlayers
          playerName={player.name}
          archiveConnections={archiveConnections.map((connectedPlayer) => ({
            slug: connectedPlayer.slug,
            name: connectedPlayer.name,
            heroImage:
              connectedPlayer.heroImage ??
              connectedPlayer.portraitImage ??
              connectedPlayer.atpPlayer?.imageUrl ??
              null,
            country:
              connectedPlayer.atpPlayer?.country ??
              connectedPlayer.country ??
              "International",
            ranking: connectedPlayer.atpPlayer?.rank ?? null,
          }))}
        />
      ) : null}

      <PlayerNavigation
        previousPlayer={adjacentPlayers.previousPlayer}
        nextPlayer={adjacentPlayers.nextPlayer}
      />

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