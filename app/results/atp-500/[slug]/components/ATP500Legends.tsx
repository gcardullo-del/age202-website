import Image from "next/image";
import Link from "next/link";

import {
  ArrowUpRight,
  Crown,
  Trophy,
} from "lucide-react";

import type {
  Atp500Tournament,
} from "@/lib/data/atp-500";

import type {
  Atp500PublicLegend,
} from "@/lib/mappers/atp-500-cms.mapper";

type ATP500LegendsProps = {
  tournament: Atp500Tournament;
  tournamentName: string;
  legends: readonly Atp500PublicLegend[];
};

export default function ATP500Legends({
  tournament,
  tournamentName,
  legends,
}: ATP500LegendsProps) {
  if (legends.length === 0) {
    return null;
  }

  return (
    <section
      id="tournament-legends"
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
              03 · Tournament legends
            </div>

            <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.045em] sm:text-5xl">
              Legends of {tournamentName}.
            </h2>
          </div>

          <p className="max-w-2xl text-sm leading-6 text-white/45">
            Champions whose titles, records and defining performances
            became part of the tournament&apos;s identity.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {legends.map((legend, index) => {
            const card = (
              <article
                className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-[#08101F]"
              >
                <div className="relative min-h-[270px] overflow-hidden border-b border-white/10">
                  {legend.image ? (
                    <>
                      <Image
                        src={legend.image}
                        alt={`${legend.name} — ${tournamentName}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                      />

                      <div
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(180deg, rgba(5,11,24,0.08) 0%, rgba(5,11,24,0.90) 100%), radial-gradient(circle at 75% 18%, ${tournament.colors.glow}, transparent 42%)`,
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `radial-gradient(circle at 72% 20%, ${tournament.colors.glow}, transparent 34%), linear-gradient(145deg, ${tournament.colors.secondary} 0%, #08101F 60%, #050B18 100%)`,
                        }}
                      />

                      <div
                        className="absolute inset-0 flex items-center justify-center select-none text-[7rem] font-black uppercase tracking-[-0.08em] opacity-[0.10]"
                        style={{
                          color: tournament.colors.primary,
                        }}
                        aria-hidden="true"
                      >
                        {legend.initials}
                      </div>
                    </>
                  )}

                  <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-5">
                    <div
                      className="rounded-full border px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.18em] backdrop-blur-md"
                      style={{
                        borderColor: `${tournament.colors.primary}45`,
                        color: tournament.colors.primary,
                        backgroundColor: "rgba(5,11,24,0.58)",
                      }}
                    >
                      {legend.featured
                        ? "Featured legend"
                        : "Tournament legend"}
                    </div>

                    {legend.playerHref ? (
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-md transition group-hover:scale-105"
                        style={{
                          borderColor: `${tournament.colors.primary}45`,
                          color: tournament.colors.primary,
                          backgroundColor: "rgba(5,11,24,0.58)",
                        }}
                        aria-hidden="true"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </div>
                    ) : null}
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <div className="flex items-end justify-between gap-5">
                      <div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-white/48">
                          <span>{legend.flag}</span>
                          <span>{legend.country}</span>
                        </div>

                        <h3 className="mt-2 text-2xl font-black uppercase leading-[0.94] tracking-[-0.04em]">
                          {legend.name}
                        </h3>
                      </div>

                      <div className="shrink-0 text-right">
                        <div
                          className="text-4xl font-black leading-none"
                          style={{
                            color: tournament.colors.primary,
                          }}
                        >
                          {legend.titles}
                        </div>

                        <div className="mt-1 text-[8px] font-black uppercase tracking-[0.16em] text-white/35">
                          Titles
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2">
                    <Crown
                      className="h-4 w-4"
                      style={{
                        color: tournament.colors.primary,
                      }}
                      aria-hidden="true"
                    />

                    <span
                      className="text-[8px] font-black uppercase tracking-[0.18em]"
                      style={{
                        color: tournament.colors.primary,
                      }}
                    >
                      {legend.recordLabel}
                    </span>
                  </div>

                  {legend.titleYears.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {legend.titleYears.map((year) => (
                        <span
                          key={year}
                          className="rounded-full border border-white/10 bg-white/[0.025] px-3 py-1.5 text-[9px] font-black tracking-[0.12em] text-white/50"
                        >
                          {year}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <p className="mt-5 text-sm leading-6 text-white/55">
                    {legend.quote}
                  </p>

                  {(legend.finals !== undefined ||
                    legend.wins !== undefined) ? (
                    <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/10 pt-5">
                      <LegendStat
                        label="Finals"
                        value={legend.finals}
                        accent={tournament.colors.primary}
                      />

                      <LegendStat
                        label="Wins"
                        value={legend.wins}
                        accent={tournament.colors.primary}
                      />
                    </div>
                  ) : null}

                  {legend.playerHref ? (
                    <div
                      className="mt-6 flex items-center justify-between border-t pt-5"
                      style={{
                        borderColor: `${tournament.colors.primary}25`,
                      }}
                    >
                      <span className="text-[8px] font-black uppercase tracking-[0.18em] text-white/30">
                        AGE202 player archive
                      </span>

                      <span
                        className="text-[9px] font-black uppercase tracking-[0.16em]"
                        style={{
                          color: tournament.colors.primary,
                        }}
                      >
                        Explore player
                      </span>
                    </div>
                  ) : (
                    <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-5">
                      <Trophy
                        className="h-3.5 w-3.5 text-white/25"
                        aria-hidden="true"
                      />

                      <span className="text-[8px] font-black uppercase tracking-[0.18em] text-white/25">
                        Historical tournament record
                      </span>
                    </div>
                  )}
                </div>

                <div
                  className="absolute inset-x-0 bottom-0 h-px scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${tournament.colors.primary}, transparent)`,
                  }}
                  aria-hidden="true"
                />
              </article>
            );

            return legend.playerHref ? (
              <Link
                key={`${legend.name}-${index}`}
                href={legend.playerHref}
                className="block h-full"
                aria-label={`Explore ${legend.name} in the AGE202 player archive`}
              >
                {card}
              </Link>
            ) : (
              <div
                key={`${legend.name}-${index}`}
                className="h-full"
              >
                {card}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

type LegendStatProps = {
  label: string;
  value: number | undefined;
  accent: string;
};

function LegendStat({
  label,
  value,
  accent,
}: LegendStatProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
      <div
        className="text-xl font-black"
        style={{
          color: accent,
        }}
      >
        {value ?? "—"}
      </div>

      <div className="mt-1 text-[8px] font-black uppercase tracking-[0.16em] text-white/30">
        {label}
      </div>
    </div>
  );
}