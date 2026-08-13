import Link from "next/link";

import {
  ArrowUpRight,
  CalendarDays,
  Trophy,
} from "lucide-react";

import type {
  Atp500Tournament,
} from "@/lib/data/atp-500";

import type {
  Atp500PublicEdition,
  Atp500PublicEditionPlayer,
} from "@/lib/mappers/atp-500-cms.mapper";

type ATP500RecentEditionsProps = {
  tournament: Atp500Tournament;
  tournamentName: string;
  editions: readonly Atp500PublicEdition[];
};

export default function ATP500RecentEditions({
  tournament,
  tournamentName,
  editions,
}: ATP500RecentEditionsProps) {
  if (editions.length === 0) {
    return null;
  }

  return (
    <section
      id="recent-editions"
      className="border-b border-white/10 px-5 py-16 sm:px-8 lg:px-12 lg:py-20"
    >
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-10 flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div
              className="text-[9px] font-black uppercase tracking-[0.24em]"
              style={{
                color: tournament.colors.primary,
              }}
            >
              04 · Recent editions
            </div>

            <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.045em] sm:text-5xl">
              The latest five finals.
            </h2>
          </div>

          <p className="max-w-2xl text-sm leading-6 text-white/45">
            The most recent championship matches from the
            {` ${tournamentName} `}
            archive.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#08101F]">
          {editions.map((edition, index) => (
            <article
              key={`${edition.year}-${edition.champion.name}-${edition.runnerUp.name}`}
              className="group relative overflow-hidden border-b border-white/[0.07] last:border-b-0"
            >
              <div
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 select-none text-[7rem] font-black leading-none tracking-[-0.08em] opacity-[0.035] sm:right-8 sm:text-[9rem]"
                style={{
                  color: tournament.colors.primary,
                }}
                aria-hidden="true"
              >
                {edition.year}
              </div>

              <div className="relative grid gap-6 px-5 py-6 sm:px-6 lg:grid-cols-[150px_1fr_90px_1fr_220px] lg:items-center lg:gap-5 lg:px-7">
                <div>
                  <div
                    className="text-3xl font-black leading-none"
                    style={{
                      color: tournament.colors.primary,
                    }}
                  >
                    {edition.year}
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.15em] text-white/30">
                    <CalendarDays
                      className="h-3.5 w-3.5"
                      aria-hidden="true"
                    />
                    Final
                  </div>

                  <div className="mt-2 text-[10px] leading-4 text-white/35">
                    {edition.date}
                  </div>
                </div>

                <PlayerBlock
                  player={edition.champion}
                  role="Champion"
                  accent={tournament.colors.primary}
                  featured
                />

                <div className="hidden text-center text-[9px] font-black uppercase tracking-[0.2em] text-white/18 lg:block">
                  vs
                </div>

                <PlayerBlock
                  player={edition.runnerUp}
                  role="Runner-up"
                  accent={tournament.colors.primary}
                />

                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 lg:text-right">
                  <div className="text-[8px] font-black uppercase tracking-[0.18em] text-white/28">
                    Final score
                  </div>

                  <div className="mt-2 text-sm font-black leading-6 text-white/78">
                    {edition.score}
                  </div>
                </div>
              </div>

              <div
                className="absolute inset-y-0 left-0 w-[3px] origin-y scale-y-0 transition-transform duration-300 group-hover:scale-y-100"
                style={{
                  backgroundColor: tournament.colors.primary,
                }}
                aria-hidden="true"
              />

              <div
                className="absolute inset-x-0 bottom-0 h-px scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                style={{
                  background:
                    `linear-gradient(90deg, transparent, ${tournament.colors.primary}, transparent)`,
                }}
                aria-hidden="true"
              />

              <span className="sr-only">
                Edition {index + 1}
              </span>
            </article>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.17em] text-white/28">
          <Trophy
            className="h-4 w-4"
            style={{
              color: tournament.colors.primary,
            }}
            aria-hidden="true"
          />

          Five most recent completed editions
        </div>
      </div>
    </section>
  );
}

type PlayerBlockProps = {
  player: Atp500PublicEditionPlayer;
  role: "Champion" | "Runner-up";
  accent: string;
  featured?: boolean;
};

function PlayerBlock({
  player,
  role,
  accent,
  featured = false,
}: PlayerBlockProps) {
  const content = (
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        <span className="text-sm">
          {player.flag}
        </span>

        <span
          className="text-[8px] font-black uppercase tracking-[0.17em]"
          style={{
            color: featured
              ? accent
              : "rgba(255,255,255,0.32)",
          }}
        >
          {role}
        </span>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <div className="truncate text-lg font-black uppercase tracking-[-0.025em] text-white">
          {player.name}
        </div>

        {player.playerHref ? (
          <ArrowUpRight
            className="h-4 w-4 shrink-0"
            style={{
              color: accent,
            }}
            aria-hidden="true"
          />
        ) : null}
      </div>

      <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/30">
        {player.countryCode || player.country}
      </div>
    </div>
  );

  if (!player.playerHref) {
    return content;
  }

  return (
    <Link
      href={player.playerHref}
      className="block rounded-2xl outline-none transition hover:bg-white/[0.025] focus-visible:bg-white/[0.035] focus-visible:ring-2"
      style={{
        ["--tw-ring-color" as string]: `${accent}55`,
      }}
      aria-label={`Open ${player.name} in the AGE202 player archive`}
    >
      <div className="p-2 -m-2">
        {content}
      </div>
    </Link>
  );
}