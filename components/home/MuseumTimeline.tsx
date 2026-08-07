import Link from "next/link";
import { ChevronRight } from "lucide-react";

import Reveal from "@/components/ui/Reveal";

const eras = [
  {
    year: "2003",
    player: "Roger Federer",
    slug: "federer",
    color: "#D9FF00",
    description:
      "The beginning of a legendary dynasty.",
  },
  {
    year: "2005",
    player: "Rafael Nadal",
    slug: "nadal",
    color: "#FF6B35",
    description:
      "The King of Clay changes tennis forever.",
  },
  {
    year: "2008",
    player: "Novak Djokovic",
    slug: "djokovic",
    color: "#00C853",
    description:
      "A new era of consistency and dominance.",
  },
  {
    year: "2020",
    player: "Jannik Sinner",
    slug: "sinner",
    color: "#FF6F00",
    description:
      "Italian tennis reaches a historic level.",
  },
  {
    year: "2022",
    player: "Carlos Alcaraz",
    slug: "alcaraz",
    color: "#29B6F6",
    description:
      "A new generation begins.",
  },
];

export default function MuseumTimeline() {
  return (
    <section className="relative overflow-hidden bg-[#07101E] py-36">
      {/* Background grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
      >
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "90px 90px",
          }}
        />
      </div>

      {/* Central glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-full w-[700px] -translate-x-1/2 rounded-full bg-[#C8FF00]/[0.03] blur-[180px]"
      />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        {/* Section heading */}
        <Reveal>
          <div className="text-center">
            <span className="text-[11px] font-black uppercase tracking-[0.35em] text-[#C8FF00]">
              Museum Timeline
            </span>

            <h2 className="mt-6 text-5xl font-black tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
              The Modern Era
            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-gray-400 sm:text-xl sm:leading-9">
              Every champion marks the beginning of a new chapter in tennis
              history. Explore the collections that defined an era.
            </p>
          </div>
        </Reveal>

        {/* Timeline */}
        <div className="relative mt-24 lg:mt-28">
          <Reveal delay={0.08}>
            <div
              aria-hidden="true"
              className="absolute left-0 right-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent md:block"
            />
          </Reveal>

          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-5 lg:gap-5 xl:gap-8">
            {eras.map((era, index) => (
              <Reveal
                key={era.slug}
                delay={index * 0.08}
              >
                <Link
                  href={`/archives/${era.slug}`}
                  className="group relative block h-full"
                >
                  {/* Timeline marker */}
                  <div className="relative z-10 hidden h-24 items-start justify-center md:flex lg:h-24">
                    <div
                      className="mt-[37px] h-7 w-7 rounded-full border-[5px] bg-[#07101E] transition-all duration-500 group-hover:scale-125"
                      style={{
                        borderColor:
                          era.color,
                        boxShadow: `0 0 0 8px #07101E, 0 0 28px ${era.color}33`,
                      }}
                    />
                  </div>

                  {/* Museum card */}
                  <div className="relative h-full overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] p-7 transition-all duration-500 group-hover:-translate-y-3 group-hover:border-white/20 group-hover:bg-white/[0.055]">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-[60px] transition-opacity duration-500 group-hover:opacity-20"
                      style={{
                        backgroundColor:
                          era.color,
                      }}
                    />

                    <div className="relative">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/30">
                          Historical chapter
                        </span>

                        <span
                          className="h-2 w-2 rounded-full"
                          style={{
                            backgroundColor:
                              era.color,
                            boxShadow: `0 0 14px ${era.color}`,
                          }}
                        />
                      </div>

                      <p className="mt-10 text-5xl font-black tracking-[-0.06em] text-white/[0.12] transition-colors duration-500 group-hover:text-white/[0.2]">
                        {era.year}
                      </p>

                      <h3
                        className="mt-4 text-2xl font-black leading-tight tracking-[-0.035em] transition-transform duration-500 group-hover:translate-x-1"
                        style={{
                          color:
                            era.color,
                        }}
                      >
                        {era.player}
                      </h3>

                      <p className="mt-5 min-h-[84px] text-sm leading-7 text-gray-400">
                        {era.description}
                      </p>

                      <div className="mt-8 h-px bg-gradient-to-r from-white/10 to-transparent" />

                      <div className="mt-6 flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase tracking-[0.22em] text-white/40 transition-colors duration-300 group-hover:text-white">
                          Explore archive
                        </span>

                        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/50 transition-all duration-300 group-hover:border-transparent group-hover:text-[#07101E]">
                          <ChevronRight
                            size={15}
                            className="transition-transform duration-300 group-hover:translate-x-0.5"
                          />
                        </span>
                      </div>
                    </div>

                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-px opacity-50"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${era.color}, transparent)`,
                      }}
                    />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Archive reference */}
        <Reveal delay={0.2}>
          <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-6 font-mono text-[8px] uppercase tracking-[0.22em] text-white/25 sm:flex-row sm:items-center sm:justify-between">
            <span>
              AGE202 Historical Registry
            </span>

            <span>
              Modern Tennis Era · 2003—Present
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}