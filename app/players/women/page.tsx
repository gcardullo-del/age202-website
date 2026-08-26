import WomenPlayersExperience, {
  type NationSummary,
  type WomenFeaturedPlayerCard,
} from "@/components/players/WomenPlayersExperience";

import {
  getWomenPlayers,
} from "@/lib/repositories/player.repository";


export const dynamic =
  "force-dynamic";


export const metadata = {
  title: "Women Players | AGE202",
  description:
    "Explore the AGE202 women's tennis archive, powered by the current WTA Top 50.",
  alternates: {
    canonical: "/players/women",
  },
  openGraph: {
    title: "Women Players | AGE202",
    description:
      "A living archive of the women shaping professional tennis today.",
    url: "/players/women",
    images: [
      {
        url: "/players/players-trophies-hero.png",
        width: 1200,
        height: 630,
        alt: "AGE202 Women Players archive",
      },
    ],
  },
};


function normalizeWomenPlayer(
  player: Awaited<ReturnType<typeof getWomenPlayers>>[number],
): WomenFeaturedPlayerCard {
  return {
    id: player.id,
    name: player.name,
    slug: player.slug,
    country:
      player.wtaPlayer?.country ??
      player.country,
    countryCode:
      player.wtaPlayer?.countryCode ??
      null,
    rank:
      player.wtaPlayer?.rank ??
      null,
    previousRank:
      player.wtaPlayer?.previousRank ??
      null,
    points:
      player.wtaPlayer?.points ??
      null,
    age:
      player.wtaPlayer?.age ??
      null,
    portraitImage:
      player.portraitImage ??
      player.wtaPlayer?.imageUrl ??
      null,
    artifactCount:
      player._count.artifacts,
    href:
      `/players/women/${player.slug}`,
  };
}


function buildNationSummary(
  players: Awaited<ReturnType<typeof getWomenPlayers>>,
): NationSummary[] {
  const counts =
    new Map<
      string,
      number
    >();


  for (
    const player
    of players
  ) {
    const country =
      player.wtaPlayer?.country?.trim() ||
      player.country?.trim();


    if (!country) {
      continue;
    }


    counts.set(
      country,
      (
        counts.get(
          country,
        ) ??
        0
      ) + 1,
    );
  }


  return [
    ...counts.entries(),
  ]
    .map(
      (
        [
          country,
          count,
        ],
      ) => ({
        country,
        count,
      }),
    )
    .sort(
      (
        first,
        second,
      ) => {
        if (
          first.count !==
          second.count
        ) {
          return (
            second.count -
            first.count
          );
        }


        return first.country.localeCompare(
          second.country,
        );
      },
    )
    .slice(
      0,
      6,
    );
}


export default async function WomenPlayersPage() {
  const womenPlayersData =
    await getWomenPlayers();


  const womenPlayers =
    womenPlayersData.map(
      normalizeWomenPlayer,
    );


  const featuredPlayers =
    womenPlayers.slice(
      0,
      5,
    );


  const totalArtifactCount =
    womenPlayers.reduce(
      (
        total,
        player,
      ) =>
        total +
        player.artifactCount,
      0,
    );


  return (
    <WomenPlayersExperience
      featuredPlayers={featuredPlayers}
      wtaPlayerCount={womenPlayers.length}
      totalArtifactCount={totalArtifactCount}
      nations={buildNationSummary(
        womenPlayersData,
      )}
    />
  );
}


