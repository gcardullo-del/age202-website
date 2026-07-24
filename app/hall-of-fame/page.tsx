import type { Metadata } from "next";

import Link from "next/link";

import HallOfFameExhibition from "@/components/hall-of-fame/HallOfFameExhibition";
import ExhibitionEnding from "@/components/hall-of-fame/ExhibitionEnding";

export const metadata: Metadata = {
  title: "Hall of Fame | AGE202 Digital Museum",
  description:
    "Enter the AGE202 Hall of Fame and explore the careers, records, defining moments and collectible apparel of tennis icons.",
};

const heroStats = [
  { value: "05", label: "Champions" },
  { value: "04", label: "Grand Slam Rooms" },
  { value: "01", label: "Living Archive" },
];

export default function HallOfFamePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050B18] text-white">
      <div className="h-[104px] sm:h-[116px]" />

      <section className="relative isolate overflow-hidden border-b border-white/[0.08]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_78%_18%,rgba(200,255,0,0.09),transparent_28%),radial-gradient(circle_at_10%_82%,rgba(59,130,246,0.07),transparent_30%),linear-gradient(180deg,#07101D_0%,#050B18_100%)]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.22] [background-image:linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:72px_72px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-[8vw] bottom-[-5vw] select-none whitespace-nowrap text-[clamp(9rem,25vw,28rem)] font-black leading-none tracking-[-0.1em] text-white/[0.022]"
        >
          HOF
        </div>

        <div className="relative mx-auto max-w-[1450px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
          <div className="grid gap-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-end">
            <div>
              <Link
                href="/"
                className={[
                  "group inline-flex items-center gap-3 rounded-full text-[9px] font-black uppercase tracking-[0.3em]",
                  "text-white/35 transition duration-300 hover:text-[#C8FF00]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8FF00]",
                  "focus-visible:ring-offset-4 focus-visible:ring-offset-[#050B18]",
                ].join(" ")}
              >
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:-translate-x-1"
                >
                  ←
                </span>

                AGE202 Museum
              </Link>

              <div className="mt-16 flex items-center gap-4">
                <span className="h-px w-12 bg-[#C8FF00]/70 sm:w-20" />

                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#C8FF00] sm:text-[10px]">
                  The Champions Wing
                </p>
              </div>

              <h1 className="mt-7 text-[clamp(4.5rem,11vw,10.5rem)] font-black uppercase leading-[0.79] tracking-[-0.075em]">
                Hall of
                <span className="block text-white/18">Fame.</span>
              </h1>

              <p className="mt-9 max-w-3xl text-base leading-8 text-white/48 sm:text-lg sm:leading-9 lg:text-xl lg:leading-10">
                Five champions. Five distinct identities. Enter each exhibit
                to discover the records, defining moments and collectible
                apparel preserved inside the AGE202 Digital Museum.
              </p>
            </div>

            <aside className="border-t border-white/[0.08] pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              <p className="text-[9px] font-black uppercase tracking-[0.32em] text-white/28">
                Permanent Exhibition
              </p>

              <p className="mt-5 max-w-md text-2xl font-black leading-tight tracking-[-0.04em] text-white sm:text-3xl">
                Five careers that changed the visual language of tennis.
              </p>

              <div className="mt-10 grid grid-cols-3 border-y border-white/[0.08]">
                {heroStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="border-r border-white/[0.08] px-3 py-6 text-center last:border-r-0 sm:px-5"
                  >
                    <span className="block font-mono text-xl font-bold tracking-[-0.04em] text-[#C8FF00] sm:text-2xl">
                      {stat.value}
                    </span>

                    <span className="mt-2 block text-[7px] font-black uppercase tracking-[0.22em] text-white/28 sm:text-[8px]">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-between gap-6">
                <p className="max-w-xs text-[9px] font-bold uppercase leading-5 tracking-[0.22em] text-white/24">
                  Scroll to enter the permanent collection
                </p>

                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 text-[#C8FF00]"
                >
                  ↓
                </span>
              </div>
            </aside>
          </div>

          <div className="mt-20 grid gap-px overflow-hidden rounded-[24px] border border-white/[0.08] bg-white/[0.08] sm:grid-cols-3">
            <HeroBadge index="01" label="Career Records" />
            <HeroBadge index="02" label="Defining Moments" />
            <HeroBadge index="03" label="Curated Apparel" />
          </div>
        </div>
      </section>

      <section className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-72 w-[70%] -translate-x-1/2 bg-[#C8FF00]/[0.035] blur-[150px]"
        />

        <div className="relative">
          <HallOfFameExhibition />
          <ExhibitionEnding />
        </div>
      </section>
    </main>
  );
}

type HeroBadgeProps = {
  index: string;
  label: string;
};

function HeroBadge({ index, label }: HeroBadgeProps) {
  return (
    <div className="flex min-h-20 items-center justify-between gap-6 bg-[#08111F]/92 px-5 py-5 backdrop-blur-xl sm:px-7">
      <span className="font-mono text-[9px] tracking-[0.22em] text-[#C8FF00]">
        {index}
      </span>

      <span className="text-right text-[9px] font-black uppercase tracking-[0.22em] text-white/48">
        {label}
      </span>
    </div>
  );
}