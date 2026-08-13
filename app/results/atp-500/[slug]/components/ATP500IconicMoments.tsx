import Image from "next/image";

import {
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

import type {
  Atp500Tournament,
} from "@/lib/data/atp-500";

import type {
  Atp500PublicIconicMoment,
} from "@/lib/mappers/atp-500-cms.mapper";

type ATP500IconicMomentsProps = {
  tournament: Atp500Tournament;
  tournamentName: string;
  moments: readonly Atp500PublicIconicMoment[];
};

export default function ATP500IconicMoments({
  tournament,
  tournamentName,
  moments,
}: ATP500IconicMomentsProps) {
  if (moments.length === 0) {
    return null;
  }

  return (
    <section
      id="iconic-moments"
      className="border-b border-white/10 px-5 py-16 sm:px-8 lg:px-12 lg:py-20"
    >
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-10 flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div
              className="text-[9px] font-black uppercase tracking-[0.24em]"
              style={{
                color:
                  tournament.colors.primary,
              }}
            >
              02 · Iconic moments
            </div>

            <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.045em] sm:text-5xl">
              Moments that shaped
              {" "}
              {tournamentName}.
            </h2>
          </div>

          <p className="max-w-2xl text-sm leading-6 text-white/45">
  Defining matches, milestones and turning points selected
  from the tournament&apos;s historical archive.
</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {moments.map(
            (
              moment,
              index,
            ) => (
              <article
                key={`${moment.year}-${moment.title}-${index}`}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#08101F]"
              >
                <div className="relative min-h-[260px] overflow-hidden border-b border-white/10">
                  {moment.imageUrl ? (
                    <>
                      <Image
                        src={moment.imageUrl}
                        alt={`${moment.title} — ${tournamentName}`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      />

                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            `linear-gradient(180deg, rgba(5,11,24,0.10) 0%, rgba(5,11,24,0.82) 100%), radial-gradient(circle at 80% 20%, ${tournament.colors.glow}, transparent 42%)`,
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            `radial-gradient(circle at 72% 24%, ${tournament.colors.glow}, transparent 34%), linear-gradient(145deg, ${tournament.colors.secondary} 0%, #08101F 58%, #050B18 100%)`,
                        }}
                      />

                      <div
                        className="absolute -right-2 bottom-[-24px] select-none text-[9rem] font-black leading-none tracking-[-0.08em] opacity-[0.08]"
                        style={{
                          color:
                            tournament.colors.primary,
                        }}
                        aria-hidden="true"
                      >
                        {moment.year}
                      </div>
                    </>
                  )}

                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <div
                          className="text-[10px] font-black uppercase tracking-[0.2em]"
                          style={{
                            color:
                              tournament.colors.primary,
                          }}
                        >
                          {moment.year}
                        </div>

                        <div className="mt-2 text-[9px] font-black uppercase tracking-[0.18em] text-white/35">
                          Iconic moment
                        </div>
                      </div>

                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full border"
                        style={{
                          borderColor:
                            `${tournament.colors.primary}45`,
                          color:
                            tournament.colors.primary,
                          backgroundColor:
                            `${tournament.colors.primary}10`,
                        }}
                      >
                        <ArrowUpRight
                          className="h-4 w-4"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2">
                    <Sparkles
                      className="h-4 w-4"
                      style={{
                        color:
                          tournament.colors.primary,
                      }}
                      aria-hidden="true"
                    />

                    <span
                      className="text-[8px] font-black uppercase tracking-[0.18em]"
                      style={{
                        color:
                          tournament.colors.primary,
                      }}
                    >
                      AGE202 archive moment
                    </span>
                  </div>

                  <h3 className="mt-4 text-2xl font-black uppercase leading-[0.95] tracking-[-0.04em]">
                    {moment.title}
                  </h3>

                  {moment.subtitle ? (
                    <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.12em] text-white/38">
                      {moment.subtitle}
                    </p>
                  ) : null}

                  <p className="mt-5 text-sm leading-6 text-white/55">
                    {moment.description}
                  </p>
                </div>

                <div
                  className="absolute inset-x-0 bottom-0 h-px scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                  style={{
                    background:
                      `linear-gradient(90deg, transparent, ${tournament.colors.primary}, transparent)`,
                  }}
                  aria-hidden="true"
                />
              </article>
            ),
          )}
        </div>
      </div>
    </section>
  );
}