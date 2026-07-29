import Image from "next/image";
import Link from "next/link";

import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Minus,
  PackageOpen,
  Sparkles,
} from "lucide-react";

import type { RankingPlayer } from "./types";

import {
  formatAge,
  formatPoints,
  formatTournaments,
} from "./utils";

type RankingRowProps = {
  player: RankingPlayer;
};

function getCountryFlag(countryCode: string | null) {
  if (!countryCode || countryCode.length !== 2) {
    return "🌍";
  }

  return countryCode
    .toUpperCase()
    .replace(
      /./g,
      (character) =>
        String.fromCodePoint(
          127397 + character.charCodeAt(0),
        ),
    );
}

function MovementIndicator({
  player,
}: {
  player: RankingPlayer;
}) {
  if (player.movement === "UP") {
    return (
      <span className="inline-flex items-center gap-1 font-mono text-[9px] font-black text-emerald-400">
        <ArrowUp
          size={12}
          strokeWidth={2.5}
          aria-hidden="true"
        />

        {player.movementValue}
      </span>
    );
  }

  if (player.movement === "DOWN") {
    return (
      <span className="inline-flex items-center gap-1 font-mono text-[9px] font-black text-rose-400">
        <ArrowDown
          size={12}
          strokeWidth={2.5}
          aria-hidden="true"
        />

        {player.movementValue}
      </span>
    );
  }

  if (player.movement === "NEW") {
    return (
      <span className="rounded-full border border-[#D7FF00]/20 bg-[#D7FF00]/[0.06] px-2 py-1 font-mono text-[7px] font-black uppercase tracking-[0.14em] text-[#D7FF00]">
        New
      </span>
    );
  }

  return (
    <span className="inline-flex items-center text-white/25">
      <Minus
        size={13}
        strokeWidth={2}
        aria-hidden="true"
      />
    </span>
  );
}

function PlayerIdentity({
  player,
}: {
  player: RankingPlayer;
}) {
  const content = (
    <div className="flex min-w-0 items-center gap-4">
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/[0.04]">
        {player.imageUrl ? (
          <Image
            src={player.imageUrl}
            alt={player.name}
            fill
            sizes="48px"
            className="object-cover object-top"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-lg">
            {getCountryFlag(player.countryCode)}
          </div>
        )}
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-black uppercase tracking-[-0.02em] text-white transition group-hover:text-[#D7FF00] sm:text-base">
            {player.name}
          </p>

          {player.hasProfile ? (
            <Sparkles
              size={13}
              className="shrink-0 text-[#D7FF00]"
              aria-hidden="true"
            />
          ) : null}
        </div>

        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm">
            {getCountryFlag(player.countryCode)}
          </span>

          <span className="truncate font-mono text-[8px] font-black uppercase tracking-[0.15em] text-white/35">
            {player.country ?? "International"}
          </span>
        </div>
      </div>
    </div>
  );

  if (!player.hasProfile || !player.slug) {
    return content;
  }

  return (
    <Link
      href={`/players/${player.slug}`}
      className="rounded-xl outline-none transition focus-visible:ring-2 focus-visible:ring-[#D7FF00]/60"
    >
      {content}
    </Link>
  );
}

function Age202Status({
  player,
}: {
  player: RankingPlayer;
}) {
  if (!player.hasProfile) {
    return (
      <span className="font-mono text-[8px] font-black uppercase tracking-[0.16em] text-white/20">
        —
      </span>
    );
  }

  if (player.availableArtifacts > 0) {
    return (
      <Link
        href={`/players/${player.slug}#available-artifacts`}
        className="group/status inline-flex items-center gap-3 rounded-full border border-[#D7FF00]/20 bg-[#D7FF00]/[0.055] px-4 py-2 transition hover:border-[#D7FF00]/45 hover:bg-[#D7FF00]/[0.1]"
      >
        <PackageOpen
          size={13}
          className="text-[#D7FF00]"
          aria-hidden="true"
        />

        <span>
          <span className="block font-mono text-[7px] font-black uppercase tracking-[0.16em] text-[#D7FF00]">
            Available
          </span>

          <span className="mt-0.5 block text-[9px] font-black uppercase tracking-[0.08em] text-white/60">
            {player.availableArtifacts}{" "}
            {player.availableArtifacts === 1
              ? "item"
              : "items"}
          </span>
        </span>

        <ArrowRight
          size={12}
          className="text-white/30 transition group-hover/status:translate-x-1 group-hover/status:text-[#D7FF00]"
          aria-hidden="true"
        />
      </Link>
    );
  }

  return (
    <Link
      href={`/players/${player.slug}`}
      className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 font-mono text-[7px] font-black uppercase tracking-[0.15em] text-white/38 transition hover:border-white/20 hover:text-white/65"
    >
      Coming soon
    </Link>
  );
}

export default function RankingRow({
  player,
}: RankingRowProps) {
  return (
    <div className="group relative overflow-hidden rounded-[1.4rem] border border-white/10 bg-white/[0.025] transition duration-300 hover:-translate-y-0.5 hover:border-[#D7FF00]/25 hover:bg-white/[0.04] hover:shadow-[0_18px_50px_rgba(0,0,0,0.24)]">
      <div className="absolute inset-y-0 left-0 w-1 bg-[#D7FF00] opacity-0 transition duration-300 group-hover:opacity-100" />

      <div className="grid min-h-[92px] grid-cols-[54px_minmax(0,1fr)_auto] items-center gap-4 px-4 py-4 sm:grid-cols-[64px_58px_minmax(220px,1.4fr)_100px_80px_120px_minmax(150px,0.7fr)] sm:px-6">
        <div className="text-center">
          <span className="font-mono text-[8px] font-black uppercase tracking-[0.16em] text-white/25">
            Rank
          </span>

          <p className="mt-1 text-2xl font-black tracking-[-0.06em] text-white">
            {player.rank}
          </p>
        </div>

        <div className="hidden justify-center sm:flex">
          <MovementIndicator player={player} />
        </div>

        <PlayerIdentity player={player} />

        <div className="hidden text-right sm:block">
          <p className="font-mono text-[7px] font-black uppercase tracking-[0.16em] text-white/25">
            Age
          </p>

          <p className="mt-2 text-sm font-black text-white/70">
            {formatAge(player.age)}
          </p>
        </div>

        <div className="hidden text-right sm:block">
          <p className="font-mono text-[7px] font-black uppercase tracking-[0.16em] text-white/25">
            Events
          </p>

          <p className="mt-2 text-sm font-black text-white/70">
            {formatTournaments(
              player.tournamentsPlayed,
            )}
          </p>
        </div>

        <div className="hidden text-right sm:block">
          <p className="font-mono text-[7px] font-black uppercase tracking-[0.16em] text-white/25">
            Points
          </p>

          <p className="mt-2 text-sm font-black text-white">
            {formatPoints(player.points)}
          </p>
        </div>

        <div className="flex justify-end">
          <Age202Status player={player} />
        </div>
      </div>

      <div className="grid grid-cols-3 border-t border-white/10 px-4 py-3 sm:hidden">
        <div>
          <p className="font-mono text-[7px] font-black uppercase tracking-[0.14em] text-white/25">
            Movement
          </p>

          <div className="mt-2">
            <MovementIndicator player={player} />
          </div>
        </div>

        <div className="text-center">
          <p className="font-mono text-[7px] font-black uppercase tracking-[0.14em] text-white/25">
            Points
          </p>

          <p className="mt-2 text-xs font-black text-white">
            {formatPoints(player.points)}
          </p>
        </div>

        <div className="text-right">
          <p className="font-mono text-[7px] font-black uppercase tracking-[0.14em] text-white/25">
            Age
          </p>

          <p className="mt-2 text-xs font-black text-white/65">
            {formatAge(player.age)}
          </p>
        </div>
      </div>
    </div>
  );
}