import type { Metadata } from "next";
import { Users } from "lucide-react";

import PlatformPage from "@/components/platform/PlatformPage";
import { getFeaturedPlayers } from "@/lib/repositories/player.repository";

export const metadata: Metadata = {
  title: "Players",
  description:
    "Explore the official AGE202 player galleries and the expanding digital tennis archive.",
};

/**
 * Manteniamo temporaneamente la compatibilità con le attuali pagine:
 *
 * /archives/federer
 * /archives/nadal
 * /archives/djokovic
 * /archives/sinner
 * /archives/alcaraz
 *
 * Quando creeremo /players/[slug], questa funzione verrà rimossa.
 */
function getLegacyArchiveHref(slug: string): string {
  const slugParts = slug.split("-");
  const archiveSlug = slugParts[slugParts.length - 1];

  return `/archives/${archiveSlug}`;
}

function getPlayerDescription(player: {
  country: string | null;
  biography: string | null;
  _count: {
    artifacts: number;
  };
}): string {
  const artifactCount = player._count.artifacts;

  const archiveLabel =
    artifactCount === 1
      ? "1 artifact in the archive"
      : `${artifactCount} artifacts in the archive`;

  if (player.biography) {
    return `${player.biography} ${archiveLabel}.`;
  }

  if (player.country) {
    return `${player.country}. ${archiveLabel}.`;
  }

  return `${archiveLabel}.`;
}

export default async function PlayersPage() {
  const featuredPlayers = await getFeaturedPlayers();

  const playerFeatures = featuredPlayers.map((player) => ({
    title: player.name,
    description: getPlayerDescription(player),
    href: getLegacyArchiveHref(player.slug),

    /*
     * Le immagini vengono lette direttamente dal database.
     * heroImage ha la priorità; portraitImage viene usata come fallback.
     */
    image: player.heroImage ?? player.portraitImage ?? undefined,

    /*
     * Usiamo soltanto campi già presenti nel database reale.
     */
    label:
      player.collectionType === "FEATURED"
        ? "Featured collection"
        : "Player collection",
  }));

  const features = [
    ...playerFeatures,
    {
      title: "Other Players",
      description:
        "Explore artifacts connected to Grand Slam champions, legends and tour players beyond the five principal AGE202 galleries.",
      href: "/players/other-players",
      label: "Extended archive",
      period: "Open Era",
    },
  ];

  return (
    <PlatformPage
      eyebrow="The museum galleries"
      title="Players"
      intro="Enter the official AGE202 player galleries: five dedicated champion collections and an expanding archive representing the wider history of professional tennis."
      icon={Users}
      features={features}
      sectionEyebrow="Player collections"
      sectionTitle="Explore the galleries"
      sectionDescription="Each gallery brings together authenticated garments, historical references and collectible pieces connected to the careers that shaped modern tennis."
    />
  );
}