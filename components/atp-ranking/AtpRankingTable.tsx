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

import { getPlayerPortraitPath } from "@/lib/players/portraits";
import {
  getRankingPlayerHref,
  getRankingPlayerLinkLabel,
} from "@/lib/players/ranking-links";

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
  archiveUrl: string | null;
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
  variant = "table",
  linked = true,
}: {
  player: AtpPlayer;
  variant?: "table" | "feature";
  linked?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  const portraitImage = getPlayerPortraitPath({
    name: player.name,
    slug: player.player?.slug,
  });

  const playerHref = getRankingPlayerHref({
    archiveUrl: player.archiveUrl,
    collectionUrl: player.collectionUrl,
  });

  const isFeature = variant === "feature";

  const avatar = (
    <div
      className={[
        "relative shrink-0 rounded-full p-[2px]",
        "bg-[linear-gradient(145deg,rgba(204,255,0,0.5),rgba(255,255,255,0.06),rgba(204,255,0,0.12))]",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_12px_32px_rgba(0,0,0,0.32)]",
        "transition duration-300",
        "group-hover/avatar:scale-[1.04]",
        "group-hover/avatar:shadow-[0_0_0_1px_rgba(204,255,0,0.35),0_0_28px_rgba(204,255,0,0.16)]",
        isFeature ? "h-16 w-16" : "h-12 w-12",
      ].join(" ")}
    >
      <div className="relative h-full w-full overflow-hidden rounded-full border border-black/30 bg-[linear-gradient(145deg,rgba(204,255,0,0.12),rgba(255,255,255,0.025))]">
        {!failed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={portraitImage}
            alt={`Ritratto di ${player.name}`}
            className="h-full w-full object-cover object-top saturate-[0.9] transition duration-500 group-hover/avatar:scale-[1.09] group-hover/avatar:saturate-100"
            loading={isFeature ? "eager" : "lazy"}
            onError={() => setFailed(true)}
          />
        ) : (
          <div
            className={[
              "grid h-full w-full place-items-center font-mono font-black uppercase tracking-[0.08em] text-[#ccff00]",
              isFeature ? "text-sm" : "text-[10px]",
            ].join(" ")}
          >
            {getPlayerInitials(player.name)}
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#030a16]/50 to-transparent" />
        <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/10" />
      </div>

      <span
        className={[
          "absolute -bottom-1 -right-1 grid place-items-center rounded-full border-2 border-[#060e1b] bg-[#ccff00] font-mono font-black text-[#030a16] shadow-[0_4px_14px_rgba(0,0,0,0.35)]",
          isFeature
            ? "h-6 min-w-6 px-1 text-[8px]"
            : "h-5 min-w-5 px-1 text-[7px]",
        ].join(" ")}
        aria-hidden="true"
      >
        {player.rank}
      </span>

      {player.collectionUrl ? (
        <span
          className="absolute -left-0.5 top-0 h-2.5 w-2.5 rounded-full border-2 border-[#060e1b] bg-[#ccff00] shadow-[0_0_12px_rgba(204,255,0,0.7)]"
          aria-hidden="true"
        />
      ) : player.archiveUrl ? (
        <span
          className="absolute -left-0.5 top-0 h-2.5 w-2.5 rounded-full border-2 border-[#060e1b] bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.55)]"
          aria-hidden="true"
        />
      ) : null}
    </div>
  );

  if (!linked || !playerHref) {
    return avatar;
  }

  return (
    <Link
      href={playerHref}
      aria-label={`Apri la pagina di ${player.name}`}
      className="group/avatar shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#ccff00]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060e1b]"
    >
      {avatar}
    </Link>
  );
}

function PlayerName({
  player,
}: {
  player: AtpPlayer;
}) {
  const playerHref = getRankingPlayerHref({
    archiveUrl: player.archiveUrl,
    collectionUrl: player.collectionUrl,
  });

  const linkLabel = getRankingPlayerLinkLabel({
    archiveUrl: player.archiveUrl,
    collectionUrl: player.collectionUrl,
  });

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

        {linkLabel ? (
          <span className="hidden shrink-0 rounded-full border border-white/10 bg-white/[0.025] px-2 py-1 font-mono text-[6px] font-black uppercase tracking-[0.12em] text-white/35 transition group-hover/player:border-[#ccff00]/25 group-hover/player:text-[#ccff00] xl:inline-flex">
            {linkLabel}
          </span>
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

  if (!playerHref) {
    return content;
  }

  return (
    <Link
      href={playerHref}
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
  const playerHref = getRankingPlayerHref({
    archiveUrl: player.archiveUrl,
    collectionUrl: player.collectionUrl,
  });

  if (player.collectionUrl && player.hasAvailableArtifacts) {
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

  if (player.archiveUrl) {
    return (
      <Link
        href={player.archiveUrl}
        className="group/archive inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-3 py-2 font-mono text-[8px] font-black uppercase tracking-[0.12em] text-white/40 transition hover:border-[#ccff00]/30 hover:text-[#ccff00]"
      >
        ATP Archive

        <ArrowRight
          size={12}
          className="transition group-hover/archive:translate-x-0.5"
          aria-hidden="true"
        />
      </Link>
    );
  }

  if (player.collectionUrl) {
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
    <span className="font-mono text-[8px] font-black uppercase tracking-[0.15em] text-white/20">
      —
    </span>
  );
}



function PlayerHoverIntelligence({
  player,
}: {
  player: AtpPlayer;
}) {
  const playerHref = getRankingPlayerHref({
    archiveUrl: player.archiveUrl,
    collectionUrl: player.collectionUrl,
  });

  const variation = getVariation(
    player.rank,
    player.previousRank,
  );

  const profileLabel = player.collectionUrl
    ? "Featured Collection"
    : player.archiveUrl
      ? "ATP Archive"
      : "Ranking Profile";

  return (
    <div className="pointer-events-none absolute left-[calc(100%+14px)] top-1/2 z-50 hidden w-[330px] -translate-y-1/2 opacity-0 transition duration-200 group-hover/row:pointer-events-auto group-hover/row:opacity-100 2xl:block">
      <div className="relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#07101D]/98 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#ccff00]/[0.055] blur-3xl" />

        <div className="relative">
          <div className="flex items-start gap-4">
            <PlayerAvatar
              player={player}
              variant="feature"
              linked={false}
            />

            <div className="min-w-0 flex-1">
              <p className="font-mono text-[7px] font-black uppercase tracking-[0.18em] text-[#ccff00]">
                {profileLabel}
              </p>

              <h4 className="mt-2 truncate text-xl font-black uppercase tracking-[-0.035em] text-white">
                {player.name}
              </h4>

              <div className="mt-3 flex items-center gap-3">
                <Flag
                  code={player.countryCode}
                  country={player.country}
                />

                <span className="truncate text-xs font-bold text-white/48">
                  {player.country}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.025] p-3">
              <p className="font-mono text-[7px] font-black uppercase tracking-[0.14em] text-white/25">
                Current rank
              </p>

              <p className="mt-2 text-xl font-black text-white">
                #{player.rank}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.025] p-3">
              <p className="font-mono text-[7px] font-black uppercase tracking-[0.14em] text-white/25">
                ATP points
              </p>

              <p className="mt-2 text-xl font-black tabular-nums text-white">
                {formatPoints(player.points)}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.025] p-3">
              <p className="font-mono text-[7px] font-black uppercase tracking-[0.14em] text-white/25">
                Age
              </p>

              <p className="mt-2 text-xl font-black text-white">
                {player.age ?? "—"}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.025] p-3">
              <p className="font-mono text-[7px] font-black uppercase tracking-[0.14em] text-white/25">
                Weekly trend
              </p>

              <p
                className={[
                  "mt-2 text-sm font-black uppercase",
                  variation.direction === "up"
                    ? "text-emerald-400"
                    : variation.direction === "down"
                      ? "text-rose-400"
                      : "text-white/35",
                ].join(" ")}
              >
                {variation.direction === "stable"
                  ? "Stable"
                  : variation.label}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-black/15 px-4 py-3">
            <div>
              <p className="font-mono text-[7px] font-black uppercase tracking-[0.14em] text-white/24">
                AGE202 status
              </p>

              <p className="mt-1 text-xs font-black uppercase text-white/65">
                {profileLabel}
              </p>
            </div>

            {playerHref ? (
              <Link
                href={playerHref}
                className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-[#ccff00]/25 bg-[#ccff00]/[0.055] px-3 py-2 font-mono text-[7px] font-black uppercase tracking-[0.12em] text-[#ccff00] transition hover:bg-[#ccff00] hover:text-black"
              >
                Open
                <ArrowRight size={11} aria-hidden="true" />
              </Link>
            ) : (
              <span className="font-mono text-[7px] font-black uppercase tracking-[0.12em] text-white/20">
                View only
              </span>
            )}
          </div>
        </div>
      </div>

      <span className="absolute right-full top-1/2 h-4 w-4 -translate-y-1/2 translate-x-2 rotate-45 border-b border-l border-white/10 bg-[#07101D]" />
    </div>
  );
}

function RankingPodium({
  players,
}: {
  players: AtpPlayer[];
}) {
  const podiumPlayers = players.slice(0, 3);

  if (podiumPlayers.length < 3) {
    return null;
  }

  const [leader, second, third] = podiumPlayers;

  const podiumOrder = [
    {
      player: second,
      position: 2,
      heightClass: "min-h-[250px]",
      accentClass:
        "border-slate-300/20 bg-[linear-gradient(180deg,rgba(203,213,225,0.055),rgba(6,14,27,0.96))]",
      medalClass:
        "border-slate-300/30 bg-slate-300/10 text-slate-200",
      orderClass: "order-2 lg:order-1",
    },
    {
      player: leader,
      position: 1,
      heightClass: "min-h-[310px]",
      accentClass:
        "border-[#ccff00]/30 bg-[linear-gradient(180deg,rgba(204,255,0,0.085),rgba(6,14,27,0.98))] shadow-[0_24px_90px_rgba(204,255,0,0.08)]",
      medalClass:
        "border-[#ccff00]/35 bg-[#ccff00]/10 text-[#ccff00]",
      orderClass: "order-1 lg:order-2",
    },
    {
      player: third,
      position: 3,
      heightClass: "min-h-[235px]",
      accentClass:
        "border-orange-400/20 bg-[linear-gradient(180deg,rgba(251,146,60,0.055),rgba(6,14,27,0.96))]",
      medalClass:
        "border-orange-400/30 bg-orange-400/10 text-orange-300",
      orderClass: "order-3",
    },
  ];

  const leaderPoints = leader.points ?? 0;

  return (
    <section className="mt-5 overflow-hidden rounded-[2rem] border border-white/10 bg-[#040b16] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.28)] sm:p-6 lg:p-8">
      <div className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[8px] font-black uppercase tracking-[0.22em] text-[#ccff00]">
            ATP Top 3
          </p>

          <h3 className="mt-2 text-3xl font-black uppercase tracking-[-0.045em] text-white sm:text-4xl">
            World podium
          </h3>
        </div>

        <p className="max-w-xl text-sm leading-7 text-white/35 sm:text-right">
          The three leading players in the current ATP ranking, connected to
          the AGE202 archive experience.
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3 lg:items-end">
        {podiumOrder.map(
          ({
            player,
            position,
            heightClass,
            accentClass,
            medalClass,
            orderClass,
          }) => {
            const playerHref = getRankingPlayerHref({
              archiveUrl: player.archiveUrl,
              collectionUrl: player.collectionUrl,
            });

            const pointsGap =
              position === 1 || leaderPoints === 0
                ? null
                : Math.max(
                    leaderPoints - (player.points ?? 0),
                    0,
                  );

            const content = (
              <article
                className={[
                  "group/podium relative flex overflow-hidden rounded-[1.75rem] border p-5 transition duration-300 hover:-translate-y-1 sm:p-6",
                  heightClass,
                  accentClass,
                ].join(" ")}
              >
                <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full border border-white/[0.045]" />
                <div className="pointer-events-none absolute -bottom-20 -left-16 h-44 w-44 rounded-full bg-white/[0.018] blur-2xl" />

                <div className="relative flex w-full flex-col">
                  {player.collectionUrl ? (
                  <div className="mb-4 flex items-center justify-between rounded-xl border border-[#ccff00]/15 bg-[#ccff00]/[0.04] px-3 py-2">
                    <span className="inline-flex items-center gap-2 font-mono text-[7px] font-black uppercase tracking-[0.14em] text-[#ccff00]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#ccff00] shadow-[0_0_10px_rgba(204,255,0,0.8)]" />
                      AGE202 Featured Collection
                    </span>
                  </div>
                ) : player.archiveUrl ? (
                  <div className="mb-4 flex items-center justify-between rounded-xl border border-cyan-300/15 bg-cyan-300/[0.035] px-3 py-2">
                    <span className="inline-flex items-center gap-2 font-mono text-[7px] font-black uppercase tracking-[0.14em] text-cyan-200/75">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.65)]" />
                      ATP Archive Profile
                    </span>
                  </div>
                ) : null}

                <div className="flex items-start justify-between gap-4">
                    <PlayerAvatar
                      player={player}
                      variant="feature"
                      linked={false}
                    />

                    <span
                      className={[
                        "inline-flex h-9 min-w-9 items-center justify-center rounded-full border px-2 font-mono text-[10px] font-black",
                        medalClass,
                      ].join(" ")}
                    >
                      #{position}
                    </span>
                  </div>

                  <div className="mt-8">
                    <p className="font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/28">
                      ATP World Ranking
                    </p>

                    <h4 className="mt-3 text-2xl font-black uppercase leading-[0.95] tracking-[-0.04em] text-white transition group-hover/podium:text-[#ccff00]">
                      {player.name}
                    </h4>

                    <div className="mt-3 flex items-center gap-3">
                      <Flag
                        code={player.countryCode}
                        country={player.country}
                      />

                      <span className="truncate text-xs font-bold text-white/48">
                        {player.country}
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto pt-8">
                    <div className="flex items-end justify-between gap-4 border-t border-white/10 pt-5">
                      <div>
                        <p className="font-mono text-[7px] font-black uppercase tracking-[0.16em] text-white/24">
                          ATP points
                        </p>

                        <p className="mt-2 text-2xl font-black tabular-nums tracking-[-0.04em] text-white">
                          {formatPoints(player.points)}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-mono text-[7px] font-black uppercase tracking-[0.16em] text-white/24">
                          Gap to leader
                        </p>

                        <p className="mt-2 font-mono text-[10px] font-black uppercase text-white/42">
                          {pointsGap === null
                            ? "Leader"
                            : `-${formatPoints(pointsGap)}`}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.055]">
                      <div
                        className="h-full rounded-full bg-[#ccff00] transition-all duration-700"
                        style={{
                          width:
                            leaderPoints > 0
                              ? `${Math.max(
                                  ((player.points ?? 0) /
                                    leaderPoints) *
                                    100,
                                  3,
                                )}%`
                              : "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </article>
            );

            if (!playerHref) {
              return (
                <div
                  key={player.id}
                  className={orderClass}
                >
                  {content}
                </div>
              );
            }

            return (
              <Link
                key={player.id}
                href={playerHref}
                className={[
                  "block rounded-[1.75rem] outline-none focus-visible:ring-2 focus-visible:ring-[#ccff00]/60",
                  orderClass,
                ].join(" ")}
              >
                {content}
              </Link>
            );
          },
        )}
      </div>
    </section>
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
        <div className="group/feature relative overflow-hidden rounded-2xl border border-white/10 bg-[#060e1b] p-5 transition hover:border-[#ccff00]/25">
          <div className="absolute right-[-30px] top-[-35px] h-28 w-28 rounded-full border border-[#ccff00]/10 transition duration-500 group-hover/feature:scale-110" />
          <div className="absolute -bottom-16 -right-12 h-32 w-32 rounded-full bg-[#ccff00]/[0.035] blur-2xl" />

          {players[0] ? (
            <div className="relative flex items-center gap-4">
              <PlayerAvatar
                player={players[0]}
                variant="feature"
              />

              <div className="min-w-0">
                <p className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-[#ccff00]">
                  World leader
                </p>

                <p className="mt-2 truncate text-xl font-black uppercase tracking-[-0.03em] text-white">
                  {players[0].name}
                </p>

                <p className="mt-2 font-mono text-[9px] font-black uppercase tracking-[0.14em] text-white/35">
                  {formatPoints(players[0].points)} points
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xl font-black text-white/30">
              —
            </p>
          )}
        </div>

        <div className="group/feature relative overflow-hidden rounded-2xl border border-white/10 bg-[#060e1b] p-5 transition hover:border-emerald-400/25">
          <div className="absolute right-[-30px] top-[-35px] h-28 w-28 rounded-full border border-emerald-400/10 transition duration-500 group-hover/feature:scale-110" />
          <div className="absolute -bottom-16 -right-12 h-32 w-32 rounded-full bg-emerald-400/[0.035] blur-2xl" />

          {biggestClimber ? (
            <div className="relative flex items-center gap-4">
              <PlayerAvatar
                player={biggestClimber}
                variant="feature"
              />

              <div className="min-w-0">
                <p className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-emerald-400">
                  Biggest climber
                </p>

                <p className="mt-2 truncate text-xl font-black uppercase tracking-[-0.03em] text-white">
                  {biggestClimber.name}
                </p>

                <p className="mt-2 font-mono text-[9px] font-black uppercase tracking-[0.14em] text-white/35">
                  Up{" "}
                  {
                    getVariation(
                      biggestClimber.rank,
                      biggestClimber.previousRank,
                    ).value
                  }{" "}
                  positions
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xl font-black text-white/30">
              No movement available
            </p>
          )}
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

      <RankingPodium players={players} />

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
          <div className="mt-5 hidden overflow-visible rounded-[1.7rem] border border-white/10 bg-[#060e1b] shadow-[0_24px_70px_rgba(0,0,0,0.25)] md:block">
            <table className="w-full table-fixed rounded-[1.7rem]">
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
                      className={[
                        "group/row relative border-b border-white/[0.055] transition duration-300 last:border-b-0",
                        player.collectionUrl
                          ? "bg-[linear-gradient(90deg,rgba(204,255,0,0.055),transparent_42%)] hover:bg-[linear-gradient(90deg,rgba(204,255,0,0.095),rgba(255,255,255,0.025)_58%,transparent)]"
                          : player.archiveUrl
                            ? "bg-[linear-gradient(90deg,rgba(103,232,249,0.035),transparent_38%)] hover:bg-[linear-gradient(90deg,rgba(103,232,249,0.07),rgba(255,255,255,0.02)_58%,transparent)]"
                            : "hover:bg-white/[0.035]",
                      ].join(" ")}
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
                                : player.collectionUrl
                                  ? "border-[#ccff00]/70"
                                  : player.archiveUrl
                                    ? "border-cyan-300/60"
                                    : "border-transparent group-hover/row:border-[#ccff00]",
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

                        {player.collectionUrl ? (
                          <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[#ccff00]/20 bg-[#ccff00]/[0.045] px-2 py-1 font-mono text-[6px] font-black uppercase tracking-[0.12em] text-[#ccff00]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#ccff00] shadow-[0_0_10px_rgba(204,255,0,0.8)]" />
                            Featured
                          </span>
                        ) : player.archiveUrl ? (
                          <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-cyan-300/15 bg-cyan-300/[0.035] px-2 py-1 font-mono text-[6px] font-black uppercase tracking-[0.12em] text-cyan-200/75">
                            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.65)]" />
                            Archive
                          </span>
                        ) : null}
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

                      <td className="pointer-events-none absolute inset-y-0 right-0 p-0">
                        <PlayerHoverIntelligence
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
                className={[
                  "group relative overflow-hidden rounded-[1.5rem] border p-5 transition duration-300",
                  player.collectionUrl
                    ? "border-[#ccff00]/20 bg-[linear-gradient(135deg,rgba(204,255,0,0.06),rgba(6,14,27,0.98)_52%)] shadow-[0_18px_48px_rgba(204,255,0,0.035)] hover:border-[#ccff00]/45"
                    : player.archiveUrl
                      ? "border-cyan-300/15 bg-[linear-gradient(135deg,rgba(103,232,249,0.045),rgba(6,14,27,0.98)_52%)] hover:border-cyan-300/35"
                      : "border-white/10 bg-[#060e1b] hover:border-[#ccff00]/25",
                ].join(" ")}
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
                          : player.collectionUrl
                            ? "bg-[#ccff00]"
                            : player.archiveUrl
                              ? "bg-cyan-300"
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

                {(() => {
                  const playerHref = getRankingPlayerHref({
    archiveUrl: player.archiveUrl,
    collectionUrl: player.collectionUrl,
  });

                  if (!playerHref) {
                    return (
                      <div className="mt-4 flex w-full items-center justify-center rounded-full border border-white/10 bg-white/[0.02] px-4 py-3 font-mono text-[8px] font-black uppercase tracking-[0.14em] text-white/25">
                        No AGE202 profile
                      </div>
                    );
                  }

                  return (
                    <Link
                      href={playerHref}
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
                        : player.archiveUrl
                          ? "Open ATP Archive"
                          : "Archive coming soon"}

                      <ArrowRight
                        size={14}
                        aria-hidden="true"
                      />
                    </Link>
                  );
                })()}
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