import type { Metadata } from "next";

import ArchivePhilosophy from "@/components/home/ArchivePhilosophy";
import ChampionCollections from "@/components/home/ChampionCollections";
import FeaturedBrands from "@/components/home/FeaturedBrands";
import FeaturedPiece from "@/components/home/FeaturedPiece";
import MuseumHero from "@/components/home/MuseumHero";
import MuseumManifesto from "@/components/home/MuseumManifesto";
import MuseumStatistics from "@/components/home/MuseumStatistics";
import Reveal from "@/components/ui/Reveal";
import VaultSection from "@/components/vault/VaultSection";

const pageTitle =
  "AGE202 | The Digital Museum of Tennis Apparel";

const pageDescription =
  "Discover AGE202, the digital museum dedicated to collectible tennis apparel, iconic champions and the stories behind the greatest eras of tennis.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    type: "website",
    siteName: "AGE202",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
  },
};

export default function HomePage() {
  return (
    <main
      id="main-content"
      className="min-h-screen overflow-hidden bg-[#050B18] text-white"
    >
      <MuseumHero />

      <div
        id="museum-introduction"
        className="relative scroll-mt-20"
      >
        <Reveal>
          <ChampionCollections />
        </Reveal>

        <MuseumStatistics />

        <MuseumManifesto />

        <Reveal delay={0.1}>
          <FeaturedPiece />
        </Reveal>

        <Reveal delay={0.15}>
          <VaultSection />
        </Reveal>

        <Reveal delay={0.2}>
          <FeaturedBrands />
        </Reveal>

        <Reveal delay={0.25}>
          <ArchivePhilosophy />
        </Reveal>
      </div>
    </main>
  );
}