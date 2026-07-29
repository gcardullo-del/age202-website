"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  Crown,
  GalleryVerticalEnd,
  Shirt,
  Trophy,
} from "lucide-react";

import ArchiveGrid from "@/components/players/atp/ArchiveGrid";
import ArchiveHero from "@/components/players/atp/ArchiveHero";
import ArchiveInsight from "@/components/players/atp/ArchiveInsight";
import ArchiveToolbar from "@/components/players/atp/ArchiveToolbar";

import type {
  AtpArchiveExplorerProps,
  RankingFilter,
  SortOption,
} from "@/components/players/atp/types";

import {
  matchesRanking,
} from "@/components/players/atp/utils";

export type {
  AtpArchivePlayer,
} from "@/components/players/atp/types";

const VALID_RANKING_FILTERS: RankingFilter[] = [
  "ALL",
  "TOP_10",
  "TOP_20",
  "TOP_50",
];

const VALID_SORT_OPTIONS: SortOption[] = [
  "RANK_ASC",
  "RANK_DESC",
  "POINTS_DESC",
  "ARTIFACTS_DESC",
  "NAME_ASC",
];

function isRankingFilter(
  value: string | null,
): value is RankingFilter {
  return (
    value !== null &&
    VALID_RANKING_FILTERS.includes(
      value as RankingFilter,
    )
  );
}

function isSortOption(
  value: string | null,
): value is SortOption {
  return (
    value !== null &&
    VALID_SORT_OPTIONS.includes(
      value as SortOption,
    )
  );
}

export default function AtpArchiveExplorer({
  players,
}: AtpArchiveExplorerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const availableCountries = players
    .map((player) => player.country?.trim())
    .filter(
      (country): country is string =>
        Boolean(country),
    );

  const countries = Array.from(
    new Set(availableCountries),
  ).sort((first, second) =>
    first.localeCompare(second, "it-IT"),
  );

  const initialQuery =
    searchParams.get("q")?.trim() ?? "";

  const initialRankingParam =
    searchParams.get("ranking");

  const initialCountryParam =
    searchParams.get("country");

  const initialSortParam =
    searchParams.get("sort");

  const [query, setQuery] = useState(
    initialQuery,
  );

  const [
    rankingFilter,
    setRankingFilter,
  ] = useState<RankingFilter>(
    isRankingFilter(initialRankingParam)
      ? initialRankingParam
      : "ALL",
  );

  const [
    countryFilter,
    setCountryFilter,
  ] = useState(
    initialCountryParam &&
      countries.includes(initialCountryParam)
      ? initialCountryParam
      : "ALL",
  );

  const [
    sortOption,
    setSortOption,
  ] = useState<SortOption>(
    isSortOption(initialSortParam)
      ? initialSortParam
      : "RANK_ASC",
  );

  useEffect(() => {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    const normalizedQuery = query.trim();

    if (normalizedQuery) {
      params.set("q", normalizedQuery);
    } else {
      params.delete("q");
    }

    if (rankingFilter !== "ALL") {
      params.set(
        "ranking",
        rankingFilter,
      );
    } else {
      params.delete("ranking");
    }

    if (countryFilter !== "ALL") {
      params.set(
        "country",
        countryFilter,
      );
    } else {
      params.delete("country");
    }

    if (sortOption !== "RANK_ASC") {
      params.set("sort", sortOption);
    } else {
      params.delete("sort");
    }

    const currentQueryString =
      searchParams.toString();

    const nextQueryString =
      params.toString();

    if (
      currentQueryString ===
      nextQueryString
    ) {
      return;
    }

    const nextUrl = nextQueryString
      ? `${pathname}?${nextQueryString}`
      : pathname;

    const timeoutId = window.setTimeout(
      () => {
        router.replace(nextUrl, {
          scroll: false,
        });
      },
      250,
    );

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [
    countryFilter,
    pathname,
    query,
    rankingFilter,
    router,
    searchParams,
    sortOption,
  ]);

  const normalizedQuery = query
    .trim()
    .toLocaleLowerCase("it-IT");

  const matchingPlayers =
    players.filter((player) => {
      const normalizedName =
        player.name.toLocaleLowerCase(
          "it-IT",
        );

      const normalizedCountry =
        player.country?.toLocaleLowerCase(
          "it-IT",
        );

      const matchesQuery =
        normalizedQuery.length === 0 ||
        normalizedName.includes(
          normalizedQuery,
        ) ||
        normalizedCountry?.includes(
          normalizedQuery,
        );

      const matchesCountry =
        countryFilter === "ALL" ||
        player.country === countryFilter;

      return (
        matchesQuery &&
        matchesCountry &&
        matchesRanking(
          player.ranking,
          rankingFilter,
        )
      );
    });

  const filteredPlayers = [
    ...matchingPlayers,
  ].sort((first, second) => {
    if (sortOption === "RANK_DESC") {
      return (
        (second.ranking ?? 0) -
        (first.ranking ?? 0)
      );
    }

    if (sortOption === "POINTS_DESC") {
      return (
        (second.points ?? 0) -
        (first.points ?? 0)
      );
    }

    if (
      sortOption === "ARTIFACTS_DESC"
    ) {
      return (
        second.artifactCount -
        first.artifactCount
      );
    }

    if (sortOption === "NAME_ASC") {
      return first.name.localeCompare(
        second.name,
        "it-IT",
      );
    }

    return (
      (first.ranking ??
        Number.MAX_SAFE_INTEGER) -
      (second.ranking ??
        Number.MAX_SAFE_INTEGER)
    );
  });

  const archiveStatistics = players.reduce(
    (statistics, player) => {
      statistics.artifactCount +=
        player.artifactCount;

      if (
        player.collectionType ===
        "FEATURED"
      ) {
        statistics.championCount += 1;
      }

      if (player.artifactCount > 0) {
        statistics.playersWithArtifacts +=
          1;
      }

      if (
        player.ranking !== null &&
        player.ranking <= 10
      ) {
        statistics.topTenPlayers += 1;
      }

      return statistics;
    },
    {
      artifactCount: 0,
      championCount: 0,
      playersWithArtifacts: 0,
      topTenPlayers: 0,
    },
  );

  function resetFilters() {
    setQuery("");
    setRankingFilter("ALL");
    setCountryFilter("ALL");
    setSortOption("RANK_ASC");

    router.replace(pathname, {
      scroll: false,
    });
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050B18] text-white">
      <ArchiveHero
        playerCount={players.length}
        countryCount={countries.length}
        artifactCount={
          archiveStatistics.artifactCount
        }
      />

      <ArchiveToolbar
        query={query}
        setQuery={setQuery}
        rankingFilter={rankingFilter}
        setRankingFilter={
          setRankingFilter
        }
        countryFilter={countryFilter}
        setCountryFilter={
          setCountryFilter
        }
        sortOption={sortOption}
        setSortOption={setSortOption}
        countries={countries}
        filteredPlayers={
          filteredPlayers.length
        }
        totalPlayers={players.length}
        onReset={resetFilters}
      />

      <section className="border-b border-white/10 px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto grid w-full max-w-[1920px] gap-px overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/10 sm:grid-cols-2 xl:grid-cols-4">
          <ArchiveInsight
            icon={Crown}
            value={
              archiveStatistics.championCount
            }
            label="Champion Collections"
          />

          <ArchiveInsight
            icon={Trophy}
            value={
              archiveStatistics.topTenPlayers
            }
            label="Current Top 10"
          />

          <ArchiveInsight
            icon={Shirt}
            value={
              archiveStatistics.playersWithArtifacts
            }
            label="Players with artifacts"
          />

          <ArchiveInsight
            icon={GalleryVerticalEnd}
            value={
              archiveStatistics.artifactCount
            }
            label="Published artifacts"
          />
        </div>
      </section>

      <ArchiveGrid
        players={filteredPlayers}
        totalPlayers={players.length}
      />
    </main>
  );
}