import type { Metadata } from "next";

import { notFound } from "next/navigation";

import ArchiveExplorer from "@/components/archive/ArchiveExplorer";
import MuseumEnding from "@/components/hall-of-fame/MuseumEnding";
import MuseumNavigation from "@/components/hall-of-fame/MuseumNavigation";
import PlayerAchievements from "@/components/hall-of-fame/PlayerAchievements";
import PlayerBiography from "@/components/hall-of-fame/PlayerBiography";
import PlayerHero from "@/components/hall-of-fame/PlayerHero";
import PlayerTimeline from "@/components/hall-of-fame/PlayerTimeline";
import PlayerTrophyCabinet from "@/components/hall-of-fame/PlayerTrophyCabinet";
import RelatedLegends from "@/components/hall-of-fame/RelatedLegends";

import {
  getPlayerBySlug,
  players,
  productMatchesPlayer,
} from "@/data/players";
import { products } from "@/data/products";

type PlayerPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return players.map((player) => ({
    slug: player.slug,
  }));
}

export async function generateMetadata({
  params,
}: PlayerPageProps): Promise<Metadata> {
  const { slug } = await params;
  const player = getPlayerBySlug(slug);

  if (!player) {
    return {
      title: "Hall of Fame | AGE202 Digital Museum",
      description:
        "Explore the careers, defining moments and collectible apparel preserved inside the AGE202 Hall of Fame.",
    };
  }

  return {
    title: `${player.name} | AGE202 Hall of Fame`,
    description: player.museumDescription,
    alternates: {
      canonical: `/hall-of-fame/${player.slug}`,
    },
    openGraph: {
      title: `${player.name} | AGE202 Hall of Fame`,
      description: player.museumDescription,
      type: "profile",
      images: [
        {
          url: player.heroImage,
          alt: `${player.name} — AGE202 Hall of Fame`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${player.name} | AGE202 Hall of Fame`,
      description: player.museumDescription,
      images: [player.heroImage],
    },
  };
}

export default async function PlayerPage({
  params,
}: PlayerPageProps) {
  const { slug } = await params;
  const player = getPlayerBySlug(slug);

  if (!player) {
    notFound();
  }

  const playerProducts = products.filter((product) =>
    productMatchesPlayer(product, player),
  );

  return (
    <main className="min-h-screen overflow-hidden bg-[#050B18] pb-28 text-white md:pb-32">
      <div className="h-[104px] sm:h-[116px]" />

      <PlayerHero
        player={player}
        archivePieces={playerProducts.length}
      />

      <PlayerBiography player={player} />

      <PlayerTimeline player={player} />

      <PlayerAchievements player={player} />

      <PlayerTrophyCabinet player={player} />

      <section
        id="player-archive"
        className="relative scroll-mt-28 overflow-hidden border-y border-white/[0.08] py-24 md:py-32 lg:py-40"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_18%,rgba(255,255,255,0.045),transparent_28%),linear-gradient(180deg,#050B18_0%,#07101D_50%,#050B18_100%)]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:72px_72px]"
        />

        <div className="relative mx-auto max-w-[1700px] px-5 sm:px-8 lg:px-12">
          <div className="mb-14 grid gap-10 lg:mb-20 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.42fr)] lg:items-end">
            <div className="max-w-5xl">
              <div className="flex items-center gap-4">
                <span
                  className="h-px w-12 sm:w-20"
                  style={{
                    backgroundColor: player.theme.accent,
                    opacity: 0.7,
                  }}
                />

                <p
                  className="text-[9px] font-black uppercase tracking-[0.4em] sm:text-[10px]"
                  style={{ color: player.theme.accent }}
                >
                  AGE202 Collection
                </p>
              </div>

              <h2 className="mt-7 text-[clamp(3.4rem,8vw,7.5rem)] font-black uppercase leading-[0.84] tracking-[-0.07em]">
                The {player.lastName}
                <span className="block text-white/18">
                  archive.
                </span>
              </h2>

              <p className="mt-8 max-w-3xl text-base leading-8 text-white/45 md:text-lg md:leading-9">
                {player.museumDescription}
              </p>
            </div>

            <aside className="border-t border-white/[0.08] pt-7 lg:border-l lg:border-t-0 lg:pl-9 lg:pt-0">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/28">
                Documented Collection
              </p>

              <p
                className="mt-4 font-mono text-5xl font-bold tracking-[-0.06em] sm:text-6xl"
                style={{ color: player.theme.accent }}
              >
                {String(playerProducts.length).padStart(
                  2,
                  "0",
                )}
              </p>

              <p className="mt-3 text-[9px] font-bold uppercase leading-5 tracking-[0.22em] text-white/28">
                Preserved pieces currently connected to this
                exhibition
              </p>
            </aside>
          </div>

          {playerProducts.length > 0 ? (
            <ArchiveExplorer products={playerProducts} />
          ) : (
            <div className="relative overflow-hidden rounded-[34px] border border-dashed border-white/15 bg-[#0A1425]/80 px-6 py-20 text-center backdrop-blur-xl md:py-28">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"
                style={{
                  backgroundColor: player.theme.accent,
                  opacity: 0.06,
                }}
              />

              <div className="relative">
                <p
                  className="text-[10px] font-black uppercase tracking-[0.38em]"
                  style={{ color: player.theme.accent }}
                >
                  Archive in progress
                </p>

                <h3 className="mt-6 text-3xl font-black tracking-[-0.045em] sm:text-4xl">
                  No documented pieces yet.
                </h3>

                <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/38 sm:text-base sm:leading-8">
                  New garments, match-worn references and
                  collectible stories will be added as the
                  AGE202 archive continues to grow.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <RelatedLegends player={player} />

      <MuseumEnding player={player} />

      <MuseumNavigation player={player} />
    </main>
  );
}