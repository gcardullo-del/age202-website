"use client";

import Link from "next/link";

import {
  ArrowUpRight,
  BadgeCheck,
  CircleDot,
  LockKeyhole,
} from "lucide-react";

export type AtpArchiveDirectoryPlayer = {
  id: string;
  name: string;
  slug: string;
  country: string | null;
  ranking: number;
  points: number | null;
  hasPage: boolean;
  profileComplete: boolean;
};

type ArchiveDirectoryProps = {
  players: AtpArchiveDirectoryPlayer[];
  totalPlayers: number;
};

function formatPoints(
  points: number | null,
): string {
  if (points === null) {
    return "—";
  }

  return new Intl.NumberFormat(
    "it-IT",
  ).format(points);
}

function DirectoryRow({
  player,
}: {
  player: AtpArchiveDirectoryPlayer;
}) {
  const content = (
    <>
      <span className="font-mono text-sm font-black tabular-nums text-[#D7FF00] sm:text-base">
        #{player.ranking}
      </span>

      <span className="min-w-0">
        <span className="block truncate text-base font-black uppercase tracking-[-0.025em] text-white/88 transition group-hover:text-white sm:text-lg">
          {player.name}
        </span>

        <span className="mt-1 block truncate font-mono text-[7px] uppercase tracking-[0.16em] text-white/30 sm:text-[8px]">
          {player.country ??
            "International"}
        </span>
      </span>

      <span className="hidden text-right sm:block">
        <span className="block text-sm font-black tabular-nums text-white/72">
          {formatPoints(
            player.points,
          )}
        </span>

        <span className="mt-1 block font-mono text-[7px] uppercase tracking-[0.16em] text-white/25">
          ATP points
        </span>
      </span>

      <span
        className={`hidden items-center justify-end gap-2 font-mono text-[7px] font-black uppercase tracking-[0.16em] sm:flex ${
          player.profileComplete
            ? "text-[#D7FF00]"
            : player.hasPage
              ? "text-white/45"
              : "text-white/25"
        }`}
      >
        {player.profileComplete ? (
          <BadgeCheck
            size={13}
            aria-hidden="true"
          />
        ) : player.hasPage ? (
          <CircleDot
            size={12}
            aria-hidden="true"
          />
        ) : (
          <LockKeyhole
            size={12}
            aria-hidden="true"
          />
        )}

        {player.profileComplete
          ? "Profile"
          : player.hasPage
            ? "Basic"
            : "Ranking only"}
      </span>

      <span
        className={`grid h-10 w-10 place-items-center rounded-xl border transition ${
          player.hasPage
            ? "border-white/10 bg-white/[0.025] text-white/40 group-hover:border-[#D7FF00]/35 group-hover:text-[#D7FF00]"
            : "border-white/[0.06] bg-white/[0.015] text-white/18"
        }`}
      >
        {player.hasPage ? (
          <ArrowUpRight
            size={16}
            aria-hidden="true"
          />
        ) : (
          <LockKeyhole
            size={14}
            aria-hidden="true"
          />
        )}
      </span>
    </>
  );

  const rowClassName =
    "group grid min-h-[78px] grid-cols-[70px_minmax(0,1fr)_auto] items-center gap-4 border-b border-white/10 px-4 py-4 outline-none transition last:border-b-0 sm:grid-cols-[90px_minmax(0,1fr)_150px_130px_auto] sm:px-6";

  if (player.hasPage) {
    return (
      <Link
        href={`/players/${player.slug}`}
        className={`${rowClassName} hover:bg-[#D7FF00]/[0.055] focus-visible:bg-[#D7FF00]/[0.07]`}
      >
        {content}
      </Link>
    );
  }

  return (
    <div
      className={`${rowClassName} cursor-default bg-white/[0.008]`}
      aria-label={`${player.name}, ranking ATP ${player.ranking}, pagina non ancora disponibile`}
    >
      {content}
    </div>
  );
}

export default function ArchiveDirectory({
  players,
  totalPlayers,
}: ArchiveDirectoryProps) {
  return (
    <section
      id="archive-directory"
      className="border-t border-white/10 px-5 py-16 sm:px-8 lg:px-12 lg:py-20"
    >
      <div className="mx-auto w-full max-w-[1920px]">
        <div className="flex flex-col gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-[8px] font-black uppercase tracking-[0.24em] text-[#D7FF00]">
              ATP Archive Directory
            </p>

            <h2 className="mt-4 max-w-4xl text-4xl font-black uppercase leading-[0.88] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
              Ranked 51–100
            </h2>
          </div>

          <div className="max-w-xl lg:text-right">
            <p className="text-sm leading-7 text-white/45">
              Players ranked 51–100
              remain visible even before
              their complete AGE202 profile
              is created. Existing pages
              remain clickable when ranking
              positions change.
            </p>

            <p className="mt-3 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/30">
              {players.length} shown /{" "}
              {totalPlayers} directory players
            </p>
          </div>
        </div>

        {players.length > 0 ? (
          <div className="mt-8 overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#07101D]/70">
            {players.map((player) => (
              <DirectoryRow
                key={player.id}
                player={player}
              />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-[1.8rem] border border-dashed border-white/10 bg-white/[0.02] px-6 py-14 text-center">
            <p className="text-lg font-black uppercase tracking-[-0.03em] text-white/60">
              No directory players match
              the active filters
            </p>

            <p className="mt-3 text-sm text-white/35">
              Reset or modify the search
              filters to restore the
              51–100 directory.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
