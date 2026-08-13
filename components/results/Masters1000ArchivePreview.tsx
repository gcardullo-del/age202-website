import Link from "next/link";

import {
  ArrowRight,
  CalendarDays,
  Crown,
  Layers3,
  Medal,
  Trophy,
} from "lucide-react";

import type { TournamentConfig } from "@/lib/data/tournaments/types";

type Masters1000ArchivePreviewProps = {
  tournament: TournamentConfig;
};

type ArchiveItem = {
  icon: typeof Crown;
  title: string;
  description: string;
  status: string;
  href: string;
};

export default function Masters1000ArchivePreview({
  tournament,
}: Masters1000ArchivePreviewProps) {
  const archiveItems: ArchiveItem[] = [
    {
      icon: Crown,
      title: "Hall of Champions",
      description:
        "A complete record of tournament winners across every edition.",
      status: "Open section",
      href: "#champions",
    },
    {
      icon: CalendarDays,
      title: "Tournament Editions",
      description:
        "Season-by-season finals, champions, runners-up and results.",
      status: "Explore archive",
      href: "#editions",
    },
    {
      icon: Medal,
      title: "Greatest Finals",
      description:
        "Championship matches that became part of Masters history.",
      status: "View finals",
      href: "#champions",
    },
    {
      icon: Trophy,
      title: "AGE202 Collection",
      description:
        "Apparel and memorabilia connected to the tournament and its champions.",
      status: "Explore collection",
      href: "/memorabilia",
    },
  ];

  return (
    <section
      id="archive"
      className="relative overflow-hidden border-t border-white/10 px-5 py-16 sm:px-8 lg:px-12 lg:py-20"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#07101D] p-6 sm:p-8 lg:p-10">
          <div
            className="pointer-events-none absolute -right-32 -top-32 h-[26rem] w-[26rem] rounded-full opacity-50 blur-3xl"
            style={{
              backgroundColor:
                tournament.colors.glow,
            }}
          />

          <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />

          <div className="relative">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-end">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--tournament-primary)]">
                  AGE202 tournament archive
                </p>

                <h2 className="mt-5 max-w-4xl text-4xl font-black uppercase leading-[0.9] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
                  The next layers of {tournament.name}
                </h2>
              </div>

              <p className="text-sm leading-7 text-white/42 lg:text-right">
                Continue exploring the tournament through its champions,
                editions, defining finals and connected AGE202 memorabilia.
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-2">
              {archiveItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group block rounded-[1.5rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tournament-primary)]"
                  >
                    <article className="flex h-full items-start gap-5 rounded-[1.5rem] border border-white/10 bg-black/15 p-6 transition duration-300 group-hover:-translate-y-0.5 group-hover:border-[var(--tournament-primary)]/55 group-hover:bg-white/[0.035]">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-[var(--tournament-primary)]">
                        <Icon
                          size={18}
                          strokeWidth={1.4}
                          aria-hidden="true"
                        />
                      </span>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <h3 className="text-base font-black uppercase tracking-[-0.02em] transition group-hover:text-[var(--tournament-primary)]">
                            {item.title}
                          </h3>

                          <span className="rounded-full border border-white/10 bg-white/[0.025] px-3 py-1.5 font-mono text-[6px] font-black uppercase tracking-[0.16em] text-white/28 transition group-hover:border-[var(--tournament-primary)]/30 group-hover:text-[var(--tournament-primary)]">
                            {item.status}
                          </span>
                        </div>

                        <p className="mt-3 text-xs leading-6 text-white/35">
                          {item.description}
                        </p>

                        <span className="mt-5 inline-flex items-center gap-2 font-mono text-[7px] font-black uppercase tracking-[0.16em] text-white/25 transition group-hover:text-[var(--tournament-primary)]">
                          Explore
                          <ArrowRight
                            size={12}
                            className="transition-transform group-hover:translate-x-1"
                            aria-hidden="true"
                          />
                        </span>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}