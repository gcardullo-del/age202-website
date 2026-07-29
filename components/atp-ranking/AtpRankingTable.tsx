"use client";

import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ChevronDown,
  RotateCcw,
  Search,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useMemo, useState } from "react";

type LinkedPlayer = {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  portraitImage: string | null;
};

type AtpPlayer = {
  id: string;
  rank: number;
  previousRank: number | null;

  name: string;
  country: string;
  countryCode: string;

  points: number | null;
  age: number | null;

  imageUrl: string | null;

  player: LinkedPlayer | null;

  availableArtifacts: number;
  hasAvailableArtifacts: boolean;
  collectionUrl: string | null;
};

type Props = {
  players: AtpPlayer[];
};

type RankingSort =
  | "ranking"
  | "points-desc"
  | "points-asc"
  | "name-asc"
  | "name-desc"
  | "age-asc"
  | "age-desc";

const FLAGS: Record<string, string> = {
  ARG: "ar",
  AUS: "au",
  AUT: "at",
  BEL: "be",
  BIH: "ba",
  BOL: "bo",
  BRA: "br",
  BUL: "bg",
  CAN: "ca",
  CHI: "cl",
  CHN: "cn",
  COL: "co",
  CRO: "hr",
  CZE: "cz",
  DEN: "dk",
  ESP: "es",
  EST: "ee",
  FIN: "fi",
  FRA: "fr",
  GBR: "gb",
  GEO: "ge",
  GER: "de",
  GRE: "gr",
  HKG: "hk",
  HUN: "hu",
  ITA: "it",
  JPN: "jp",
  KAZ: "kz",
  LTU: "lt",
  MON: "mc",
  NED: "nl",
  NOR: "no",
  PAR: "py",
  PER: "pe",
  POL: "pl",
  POR: "pt",
  RUS: "ru",
  SRB: "rs",
  SUI: "ch",
  SVK: "sk",
  UKR: "ua",
  USA: "us",
};

function normalizeValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function getVariation(
  rank: number,
  previousRank: number | null,
) {
  if (
    previousRank === null ||
    previousRank === rank
  ) {
    return {
      direction: "stable" as const,
      value: 0,
      label: "Stable",
    };
  }

  if (previousRank > rank) {
    return {
      direction: "up" as const,
      value: previousRank - rank,
      label: `Up ${previousRank - rank}`,
    };
  }

  return {
    direction: "down" as const,
    value: rank - previousRank,
    label: `Down ${rank - previousRank}`,
  };
}

function getPodiumLabel(rank: number) {
  if (rank === 1) {
    return "World No. 1";
  }

  if (rank === 2) {
    return "World No. 2";
  }

  if (rank === 3) {
    return "World No. 3";
  }

  return null;
}

function getPlayerInitials(name: string) {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return "ATP";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${
    words[words.length - 1][0]
  }`.toUpperCase();
}

function formatPoints(points: number | null) {
  if (points === null) {
    return "—";
  }

  return points.toLocaleString("it-IT");
}

function formatAvailableItems(
  availableArtifacts: number,
) {
  if (availableArtifacts === 1) {
    return "1 item";
  }

  return `${availableArtifacts} items`;
}

function Flag({
  code,
  country,
}: {
  code: string;
  country: string;
}) {
  const alpha2 = FLAGS[code.toUpperCase()];

  if (!alpha2) {
    return (
      <span className="flex h-7 w-10 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.035] font-mono text-[8px] font-black uppercase tracking-[0.08em] text-white/45">
        {code || "—"}
      </span>
    );
  }

  return (
    <span className="block h-7 w-10 shrink-0 overflow-hidden rounded-md border border-white/15 bg-white/[0.035]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://flagcdn.com/w80/${alpha2}.png`}
        alt={`Bandiera ${country}`}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </span>
  );
}

function VariationBadge({
  rank,
  previousRank,
}: {
  rank: number;
  previousRank: number | null;
}) {
  const variation = getVariation(
    rank,
    previousRank,
  );

  if (variation.direction === "up") {
    return (
      <span
        aria-label={variation.label}
        className="inline-flex items-center justify-center gap-1 font-mono text-[9px] font-black text-emerald-400"
      >
        <ArrowUp
          size={13}
          strokeWidth={2.6}
          aria-hidden="true"
        />

        {variation.value}
      </span>
    );
  }

  if (variation.direction === "down") {
    return (
      <span
        aria-label={variation.label}
        className="inline-flex items-center justify-center gap-1 font-mono text-[9px] font-black text-rose-400"
      >
        <ArrowDown
          size={13}
          strokeWidth={2.6}
          aria-hidden="true"
        />

        {variation.value}
      </span>
    );
  }

  return (
    <span
      aria-label={variation.label}
      className="font-mono text-[10px] font-black text-white/20"
    >
      —
    </span>
  );
}

function PlayerAvatar({
  player,
}: {
  player: AtpPlayer;
}) {
  const portraitImage =
    player.player?.portraitImage ??
    player.imageUrl;

  return (
    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/10 bg-[linear-gradient(145deg,rgba(204,255,0,0.12),rgba(255,255,255,0.025))]">
      {portraitImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={portraitImage}
          alt={player.name}
          className="h-full w-full object-cover object-top"
          loading="lazy"
        />
      ) : (
        <div className="grid h-full w-full place-items-center font-mono text-[10px] font-black uppercase tracking-[0.08em] text-[#ccff00]">
          {getPlayerInitials(player.name)}
        </div>
      )}
    </div>
  );
}

function PlayerName({
  player,
}: {
  player: AtpPlayer;
}) {
  const content = (
    <div className="min-w-0">
      <div className="flex min-w-0 items-center gap-2">
        <p className="truncate text-sm font-black uppercase tracking-[-0.02em] text-white transition group-hover/player:text-[#ccff00]">
          {player.name}
        </p>

        {player.hasAvailableArtifacts ? (
          <Sparkles
            size={12}
            className="shrink-0 text-[#ccff00]"
            aria-hidden="true"
          />
        ) : null}
      </div>

      <div className="mt-1 flex items-center gap-2">
        <span className="font-mono text-[8px] font-black uppercase tracking-[0.16em] text-white/30">
          ATP #{player.rank}
        </span>

        {getPodiumLabel(player.rank) ? (
          <>
            <span className="h-1 w-1 rounded-full bg-white/20" />

            <span className="truncate font-mono text-[8px] font-black uppercase tracking-[0.14em] text-[#ccff00]/65">
              {getPodiumLabel(player.rank)}
            </span>
          </>
        ) : null}
      </div>
    </div>
  );

  if (!player.collectionUrl) {
    return content;
  }

  return (
    <Link
      href={player.collectionUrl}
      className="group/player min-w-0 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#ccff00]/60"
    >
      {content}
    </Link>
  );
}

function CollectionStatus({
  player,
}: {
  player: AtpPlayer;
}) {
  if (!player.collectionUrl) {
    return (
      <span className="font-mono text-[8px] font-black uppercase tracking-[0.15em] text-white/20">
        —
      </span>
    );
  }

  if (!player.hasAvailableArtifacts) {
    return (
      <Link
        href={player.collectionUrl}
        className="group/archive inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-3 py-2 font-mono text-[8px] font-black uppercase tracking-[0.12em] text-white/40 transition hover:border-[#ccff00]/30 hover:text-[#ccff00]"
      >
        Coming soon

        <ArrowRight
          size={12}
          className="transition group-hover/archive:translate-x-0.5"
          aria-hidden="true"
        />
      </Link>
    );
  }

  return (
    <Link
      href={player.collectionUrl}
      className="group/archive inline-flex items-center gap-2 rounded-full border border-[#ccff00]/25 bg-[#ccff00]/[0.055] px-3 py-2 font-mono text-[8px] font-black uppercase tracking-[0.12em] text-[#ccff00] transition hover:border-[#ccff00]/55 hover:bg-[#ccff00] hover:text-black"
    >
      {formatAvailableItems(
        player.availableArtifacts,
      )}

      <ArrowRight
        size={12}
        className="transition group-hover/archive:translate-x-0.5"
        aria-hidden="true"
      />
    </Link>
  );
}

export function AtpRankingTable({
  players,
}: Props) {
  const [search, setSearch] = useState("");
  const [country, setCountry] =
    useState("all");

  const [sort, setSort] =
    useState<RankingSort>("ranking");

  const countries = useMemo(() => {
    return Array.from(
      new Set(
        players
          .map((player) => player.country)
          .filter(Boolean),
      ),
    ).sort((first, second) =>
      first.localeCompare(second, "it"),
    );
  }, [players]);

  const filteredPlayers = useMemo(() => {
    const query = normalizeValue(
      search.trim(),
    );

    const matchingPlayers = players.filter(
      (player) => {
        const matchesCountry =
          country === "all" ||
          player.country === country;

        if (!matchesCountry) {
          return false;
        }

        if (!query) {
          return true;
        }

        return [
          player.name,
          player.country,
          player.countryCode,
          String(player.rank),
        ].some((value) =>
          normalizeValue(value).includes(query),
        );
      },
    );

    return [...matchingPlayers].sort(
      (first, second) => {
        switch (sort) {
          case "points-desc":
            return (
              (second.points ?? -1) -
              (first.points ?? -1)
            );

          case "points-asc":
            return (
              (first.points ??
                Number.MAX_SAFE_INTEGER) -
              (second.points ??
                Number.MAX_SAFE_INTEGER)
            );

          case "name-asc":
            return first.name.localeCompare(
              second.name,
              "it",
            );

          case "name-desc":
            return second.name.localeCompare(
              first.name,
              "it",
            );

          case "age-asc":
            return (
              (first.age ??
                Number.MAX_SAFE_INTEGER) -
              (second.age ??
                Number.MAX_SAFE_INTEGER)
            );

          case "age-desc":
            return (
              (second.age ?? -1) -
              (first.age ?? -1)
            );

          case "ranking":
          default:
            return first.rank - second.rank;
        }
      },
    );
  }, [country, players, search, sort]);

  const linkedCollectionsCount = useMemo(
    () =>
      players.filter(
        (player) => player.collectionUrl,
      ).length,
    [players],
  );

  const totalAvailableArtifacts = useMemo(
    () =>
      players.reduce(
        (total, player) =>
          total +
          player.availableArtifacts,
        0,
      ),
    [players],
  );

  const representedCountries = useMemo(
    () =>
      new Set(
        players
          .map((player) => player.countryCode)
          .filter(Boolean),
      ).size,
    [players],
  );

  const biggestClimber = useMemo(() => {
    return players.reduce<AtpPlayer | null>(
      (bestPlayer, currentPlayer) => {
        const currentVariation =
          getVariation(
            currentPlayer.rank,
            currentPlayer.previousRank,
          );

        if (
          currentVariation.direction !== "up"
        ) {
          return bestPlayer;
        }

        if (!bestPlayer) {
          return currentPlayer;
        }

        const bestVariation = getVariation(
          bestPlayer.rank,
          bestPlayer.previousRank,
        );

        return currentVariation.value >
          bestVariation.value
          ? currentPlayer
          : bestPlayer;
      },
      null,
    );
  }, [players]);

  const hasActiveFilters =
    search.trim().length > 0 ||
    country !== "all" ||
    sort !== "ranking";

  function resetFilters() {
    setSearch("");
    setCountry("all");
    setSort("ranking");
  }

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#060e1b] p-5">
          <div className="absolute right-[-30px] top-[-35px] h-28 w-28 rounded-full border border-[#ccff00]/10" />

          <p className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-[#ccff00]">
            World leader
          </p>

          <p className="mt-3 truncate text-xl font-black uppercase tracking-[-0.03em] text-white">
            {players[0]?.name ?? "—"}
          </p>

          <p className="mt-2 font-mono text-[9px] font-black uppercase tracking-[0.14em] text-white/35">
            {formatPoints(
              players[0]?.points ?? null,
            )}{" "}
            points
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#060e1b] p-5">
          <div className="absolute right-[-30px] top-[-35px] h-28 w-28 rounded-full border border-emerald-400/10" />

          <p className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-emerald-400">
            Biggest climber
          </p>

          <p className="mt-3 truncate text-xl font-black uppercase tracking-[-0.03em] text-white">
            {biggestClimber?.name ?? "—"}
          </p>

          <p className="mt-2 font-mono text-[9px] font-black uppercase tracking-[0.14em] text-white/35">
            {biggestClimber
              ? `Up ${
                  getVariation(
                    biggestClimber.rank,
                    biggestClimber.previousRank,
                  ).value
                } positions`
              : "No movement available"}
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#060e1b] p-5">
          <div className="absolute right-[-30px] top-[-35px] h-28 w-28 rounded-full border border-[#ccff00]/10" />

          <p className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-[#ccff00]">
            AGE202 items
          </p>

          <p className="mt-3 text-3xl font-black tracking-[-0.05em] text-white">
            {totalAvailableArtifacts}
          </p>

          <p className="mt-2 font-mono text-[9px] font-black uppercase tracking-[0.14em] text-white/35">
            Available across{" "}
            {linkedCollectionsCount} archives
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#060e1b] p-5">
          <div className="absolute right-[-30px] top-[-35px] h-28 w-28 rounded-full border border-[#ccff00]/10" />

          <p className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-[#ccff00]">
            Countries
          </p>

          <p className="mt-3 text-3xl font-black tracking-[-0.05em] text-white">
            {representedCountries}
          </p>

          <p className="mt-2 font-mono text-[9px] font-black uppercase tracking-[0.14em] text-white/35">
            Nations represented
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[1.7rem] border border-white/10 bg-[#050c17]/90 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:p-5">
        <div className="grid gap-3 xl:grid-cols-[minmax(300px,1fr)_220px_220px_auto]">
          <label className="relative">
            <span className="sr-only">
              Search player
            </span>

            <Search
              size={17}
              className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-white/30"
              aria-hidden="true"
            />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search player, nation or rank"
              className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.035] pl-14 pr-5 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#ccff00]/45 focus:bg-white/[0.05]"
            />
          </label>

          <label className="relative">
            <span className="sr-only">
              Filter by country
            </span>

            <select
              value={country}
              onChange={(event) =>
                setCountry(event.target.value)
              }
              className="h-14 w-full appearance-none rounded-2xl border border-white/10 bg-[#08111f] px-5 pr-12 text-sm text-white outline-none transition focus:border-[#ccff00]/45"
            >
              <option value="all">
                All countries
              </option>

              {countries.map((countryName) => (
                <option
                  key={countryName}
                  value={countryName}
                >
                  {countryName}
                </option>
              ))}
            </select>

            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-white/35"
              aria-hidden="true"
            />
          </label>

          <label className="relative">
            <span className="sr-only">
              Sort ranking
            </span>

            <select
              value={sort}
              onChange={(event) =>
                setSort(
                  event.target
                    .value as RankingSort,
                )
              }
              className="h-14 w-full appearance-none rounded-2xl border border-white/10 bg-[#08111f] px-5 pr-12 text-sm text-white outline-none transition focus:border-[#ccff00]/45"
            >
              <option value="ranking">
                ATP Ranking
              </option>

              <option value="points-desc">
                Points: highest
              </option>

              <option value="points-asc">
                Points: lowest
              </option>

              <option value="name-asc">
                Name: A–Z
              </option>

              <option value="name-desc">
                Name: Z–A
              </option>

              <option value="age-asc">
                Age: youngest
              </option>

              <option value="age-desc">
                Age: oldest
              </option>
            </select>

            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-white/35"
              aria-hidden="true"
            />
          </label>

          <button
            type="button"
            onClick={resetFilters}
            disabled={!hasActiveFilters}
            className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.025] px-5 font-mono text-[8px] font-black uppercase tracking-[0.16em] text-white/50 transition hover:border-[#ccff00]/30 hover:text-[#ccff00] disabled:cursor-not-allowed disabled:opacity-35"
          >
            <RotateCcw
              size={15}
              aria-hidden="true"
            />

            Reset
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
          <div className="flex flex-wrap gap-3">
            <span className="rounded-full border border-white/10 bg-white/[0.025] px-4 py-2 font-mono text-[8px] font-black uppercase tracking-[0.14em] text-white/40">
              {filteredPlayers.length} results
            </span>

            {country !== "all" ? (
              <span className="rounded-full border border-[#ccff00]/20 bg-[#ccff00]/[0.045] px-4 py-2 font-mono text-[8px] font-black uppercase tracking-[0.14em] text-[#ccff00]">
                {country}
              </span>
            ) : null}
          </div>

          <p className="font-mono text-[8px] font-black uppercase tracking-[0.14em] text-white/25">
            Top {players.length} ATP players
          </p>
        </div>
      </div>

      {filteredPlayers.length > 0 ? (
        <>
          <div className="mt-5 hidden overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#060e1b] shadow-[0_24px_70px_rgba(0,0,0,0.25)] md:block">
            <table className="w-full table-fixed">
              <colgroup>
                <col className="w-[7%]" />
                <col className="w-[7%]" />
                <col className="w-[31%]" />
                <col className="w-[19%]" />
                <col className="w-[12%]" />
                <col className="w-[8%]" />
                <col className="w-[16%]" />
              </colgroup>

              <thead className="border-b border-white/10 bg-white/[0.025]">
                <tr>
                  {[
                    "Rank",
                    "Trend",
                    "Player",
                    "Nation",
                    "Points",
                    "Age",
                    "AGE202",
                  ].map((label, index) => (
                    <th
                      key={label}
                      className={[
                        "px-5 py-4 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/25",
                        index === 1
                          ? "text-center"
                          : index >= 4
                            ? "text-right"
                            : "text-left",
                      ].join(" ")}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredPlayers.map(
                  (player) => (
                    <tr
                      key={player.id}
                      className="group relative border-b border-white/[0.055] transition last:border-b-0 hover:bg-white/[0.035]"
                    >
                      <td
                        className={[
                          "border-l-2 px-5 py-4 transition",
                          player.rank === 1
                            ? "border-amber-400"
                            : player.rank === 2
                              ? "border-slate-300"
                              : player.rank === 3
                                ? "border-orange-400"
                                : "border-transparent group-hover:border-[#ccff00]",
                        ].join(" ")}
                      >
                        <div className="flex items-center gap-2">
                          {player.rank <= 3 ? (
                            <Trophy
                              size={13}
                              className={
                                player.rank ===
                                1
                                  ? "text-amber-400"
                                  : player.rank ===
                                      2
                                    ? "text-slate-300"
                                    : "text-orange-400"
                              }
                              aria-hidden="true"
                            />
                          ) : null}

                          <span className="font-mono text-sm font-black tabular-nums text-white">
                            {String(
                              player.rank,
                            ).padStart(2, "0")}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <VariationBadge
                          rank={player.rank}
                          previousRank={
                            player.previousRank
                          }
                        />
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <PlayerAvatar
                            player={player}
                          />

                          <PlayerName
                            player={player}
                          />
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Flag
                            code={
                              player.countryCode
                            }
                            country={
                              player.country
                            }
                          />

                          <div className="min-w-0">
                            <p className="truncate text-xs font-bold text-white/65">
                              {player.country}
                            </p>

                            <p className="mt-1 font-mono text-[8px] font-black uppercase tracking-[0.12em] text-white/25">
                              {
                                player.countryCode
                              }
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-right font-mono text-sm font-black tabular-nums text-white">
                        {formatPoints(
                          player.points,
                        )}
                      </td>

                      <td className="px-5 py-4 text-right text-sm font-bold text-white/45">
                        {player.age ?? "—"}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <CollectionStatus
                          player={player}
                        />
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-5 grid gap-3 md:hidden">
            {filteredPlayers.map((player) => (
              <article
                key={player.id}
                className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#060e1b] p-5 transition hover:border-[#ccff00]/25"
              >
                <div
                  className={[
                    "absolute inset-y-0 left-0 w-1",
                    player.rank === 1
                      ? "bg-amber-400"
                      : player.rank === 2
                        ? "bg-slate-300"
                        : player.rank === 3
                          ? "bg-orange-400"
                          : "bg-[#ccff00] opacity-0 transition group-hover:opacity-100",
                  ].join(" ")}
                />

                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <PlayerAvatar
                      player={player}
                    />

                    <PlayerName
                      player={player}
                    />
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="font-mono text-[8px] font-black uppercase tracking-[0.15em] text-[#ccff00]">
                      Rank
                    </p>

                    <p className="mt-1 text-2xl font-black tracking-[-0.05em] text-white">
                      #{player.rank}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-y border-white/10 py-3">
                  <div className="flex items-center gap-3">
                    <Flag
                      code={player.countryCode}
                      country={player.country}
                    />

                    <div>
                      <p className="text-xs font-bold text-white/65">
                        {player.country}
                      </p>

                      <p className="mt-1 font-mono text-[8px] font-black uppercase tracking-[0.12em] text-white/25">
                        {player.countryCode}
                      </p>
                    </div>
                  </div>

                  <VariationBadge
                    rank={player.rank}
                    previousRank={
                      player.previousRank
                    }
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/[0.025] p-3">
                    <p className="font-mono text-[8px] font-black uppercase tracking-[0.15em] text-white/25">
                      Points
                    </p>

                    <p className="mt-2 text-xl font-black tracking-[-0.04em] text-white">
                      {formatPoints(
                        player.points,
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.025] p-3">
                    <p className="font-mono text-[8px] font-black uppercase tracking-[0.15em] text-white/25">
                      Age
                    </p>

                    <p className="mt-2 text-xl font-black tracking-[-0.04em] text-white">
                      {player.age ?? "—"}
                    </p>
                  </div>
                </div>

                {player.collectionUrl ? (
                  <Link
                    href={player.collectionUrl}
                    className={[
                      "mt-4 flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 font-mono text-[9px] font-black uppercase tracking-[0.14em] transition",
                      player.hasAvailableArtifacts
                        ? "bg-[#ccff00] text-black hover:bg-white"
                        : "border border-white/10 bg-white/[0.025] text-white/45 hover:border-[#ccff00]/30 hover:text-[#ccff00]",
                    ].join(" ")}
                  >
                    {player.hasAvailableArtifacts
                      ? `Explore ${formatAvailableItems(
                          player.availableArtifacts,
                        )}`
                      : "Archive coming soon"}

                    <ArrowRight
                      size={14}
                      aria-hidden="true"
                    />
                  </Link>
                ) : (
                  <div className="mt-4 flex w-full items-center justify-center rounded-full border border-white/10 bg-white/[0.02] px-4 py-3 font-mono text-[8px] font-black uppercase tracking-[0.14em] text-white/25">
                    No AGE202 profile
                  </div>
                )}
              </article>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-5 grid min-h-[360px] place-items-center rounded-[1.7rem] border border-white/10 bg-[#060e1b] px-6 py-16 text-center">
          <div className="max-w-md">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-[#ccff00]/20 bg-[#ccff00]/[0.055]">
              <Search
                size={23}
                className="text-[#ccff00]"
                aria-hidden="true"
              />
            </span>

            <p className="mt-6 font-mono text-[8px] font-black uppercase tracking-[0.2em] text-[#ccff00]">
              No ranking results
            </p>

            <h3 className="mt-3 text-2xl font-black uppercase tracking-[-0.04em] text-white">
              No players found
            </h3>

            <p className="mt-4 text-sm leading-7 text-white/40">
              Change the player search, country
              filter or sorting option to view more
              ATP players.
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 font-mono text-[8px] font-black uppercase tracking-[0.14em] text-white/60 transition hover:border-[#ccff00]/30 hover:text-[#ccff00]"
            >
              <RotateCcw
                size={14}
                aria-hidden="true"
              />

              Reset filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}