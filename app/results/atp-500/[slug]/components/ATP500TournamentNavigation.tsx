import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  MapPin,
} from "lucide-react";

import {
  atp500Tournaments,
  getAtp500Href,
} from "@/lib/data/atp-500";

type ATP500TournamentNavigationProps = {
  currentSlug: string;
};

export default function ATP500TournamentNavigation({
  currentSlug,
}: ATP500TournamentNavigationProps) {
  return (
    <section
      id="all-atp-500-tournaments"
      className="border-b border-white/10 px-5 py-16 sm:px-8 lg:px-12 lg:py-20"
    >
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-[9px] font-black uppercase tracking-[0.24em] text-[#B8FF4A]">
              ATP 500 World Archive
            </div>

            <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.045em] sm:text-5xl">
              All ATP 500 tournaments.
            </h2>
          </div>

          <p className="max-w-2xl text-sm leading-6 text-white/45">
            Continue through the complete AGE202 ATP 500 archive
            without returning to the tournament index.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {atp500Tournaments.map(
            (
              tournament,
              index,
            ) => {
              const isCurrent =
                tournament.slug ===
                currentSlug;

              return (
                <Link
                  key={tournament.slug}
                  href={getAtp500Href(
                    tournament.slug,
                  )}
                  aria-current={
                    isCurrent
                      ? "page"
                      : undefined
                  }
                  className="group relative min-h-[260px] overflow-hidden rounded-3xl border border-white/10 bg-[#08101F] transition hover:-translate-y-1 hover:border-white/20"
                >
                  {tournament.heroImage ? (
                    <>
                      <Image
                        src={
                          tournament.heroImage
                        }
                        alt={
                          tournament.name
                        }
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition duration-500 group-hover:scale-[1.04]"
                      />

                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,11,24,0.08),rgba(5,11,24,0.92))]" />
                    </>
                  ) : (
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          `radial-gradient(circle at 70% 18%, ${tournament.colors.glow}, transparent 34%), linear-gradient(145deg, ${tournament.colors.secondary} 0%, #08101F 62%, #050B18 100%)`,
                      }}
                    />
                  )}

                  <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
                    <div
                      className="flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-[11px] font-black text-[#050B18]"
                      style={{
                        backgroundColor:
                          tournament.colors.primary,
                      }}
                    >
                      {index + 1}
                    </div>

                    {isCurrent ? (
                      <div
                        className="rounded-full border px-3 py-1 text-[8px] font-black uppercase tracking-[0.16em]"
                        style={{
                          borderColor:
                            `${tournament.colors.primary}55`,
                          color:
                            tournament.colors.primary,
                          backgroundColor:
                            "rgba(5,11,24,0.68)",
                        }}
                      >
                        Current
                      </div>
                    ) : null}
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.16em] text-white/42">
                      <MapPin
                        className="h-3.5 w-3.5"
                        style={{
                          color:
                            tournament.colors.primary,
                        }}
                        aria-hidden="true"
                      />

                      {tournament.city}
                    </div>

                    <h3 className="mt-2 text-xl font-black uppercase leading-[0.95] tracking-[-0.035em]">
                      {tournament.name}
                    </h3>

                    <div className="mt-2 text-[9px] font-black uppercase tracking-[0.15em] text-white/35">
                      {tournament.country}
                    </div>

                    <div
                      className="mt-5 flex items-center justify-between border-t pt-4"
                      style={{
                        borderColor:
                          `${tournament.colors.primary}2A`,
                      }}
                    >
                      <span
                        className="text-[9px] font-black uppercase tracking-[0.16em]"
                        style={{
                          color:
                            tournament.colors.primary,
                        }}
                      >
                        {isCurrent
                          ? "You are here"
                          : "Explore history"}
                      </span>

                      <span
                        className="flex h-8 w-8 items-center justify-center rounded-full border"
                        style={{
                          borderColor:
                            `${tournament.colors.primary}45`,
                          color:
                            tournament.colors.primary,
                          backgroundColor:
                            `${tournament.colors.primary}10`,
                        }}
                      >
                        <ArrowRight
                          className="h-3.5 w-3.5"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </div>

                  <div
                    className="absolute inset-x-0 bottom-0 h-px scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                    style={{
                      background:
                        `linear-gradient(90deg, transparent, ${tournament.colors.primary}, transparent)`,
                    }}
                    aria-hidden="true"
                  />
                </Link>
              );
            },
          )}
        </div>
      </div>
    </section>
  );
}