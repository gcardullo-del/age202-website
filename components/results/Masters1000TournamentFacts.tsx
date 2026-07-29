"use client";

import {
  Building2,
  CalendarDays,
  CircleDot,
  CloudSun,
  Crown,
  MapPin,
  Sparkles,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

import type { Masters1000FactIcon } from "@/lib/data/masters-1000-facts";
import { getTournamentFacts } from "@/lib/tournament-engine";

type Masters1000TournamentFactsProps = {
  slug: string;
};

const iconMap: Record<Masters1000FactIcon, LucideIcon> = {
  category: Crown,
  location: MapPin,
  venue: Building2,
  surface: CircleDot,
  founded: CalendarDays,
  capacity: UsersRound,
  climate: CloudSun,
  signature: Sparkles,
};

export default function Masters1000TournamentFacts({
  slug,
}: Masters1000TournamentFactsProps) {
  const data = getTournamentFacts(slug);

  if (!data) return null;

  return (
    <section
      id="facts"
      className="relative scroll-mt-16 overflow-hidden border-t border-white/10 bg-[#030814] px-6 py-24 sm:px-8 lg:px-12 lg:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,var(--tournament-glow),transparent_34%)] opacity-30" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:64px_64px]" />

      <div className="relative mx-auto max-w-[1500px]">
        <div className="grid gap-20 xl:grid-cols-[430px_minmax(0,1fr)]">
          {/* LEFT */}

          <aside className="xl:sticky xl:top-28 self-start">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.32em] text-[var(--tournament-primary)]">
              {data.eyebrow}
            </p>

            <h2 className="mt-6 text-5xl font-black uppercase leading-[0.84] tracking-[-0.07em] sm:text-6xl lg:text-7xl">
              {data.title}
            </h2>

            <p className="mt-8 max-w-md text-base leading-8 text-white/55">
              {data.description}
            </p>

            {data.note && (
              <div className="mt-12 border-l border-[var(--tournament-primary)]/50 pl-6">
                <p className="font-mono text-[9px] font-black uppercase tracking-[0.25em] text-white/30">
                  AGE202 Editorial Note
                </p>

                <p className="mt-4 text-sm leading-8 text-white/55">
                  {data.note}
                </p>
              </div>
            )}
          </aside>

          {/* RIGHT */}

          <div className="space-y-8">
            {data.facts.map((fact) => {
              const Icon = iconMap[fact.icon];

              return (
                <article
                  key={fact.label}
                  className="group relative overflow-hidden rounded-[2.5rem] border border-white/8 bg-white/[0.03] px-10 py-12 transition-all duration-500 hover:border-[var(--tournament-primary)]/35 hover:bg-white/[0.045]"
                >
                  <div className="absolute inset-y-0 left-0 w-[3px] bg-[var(--tournament-primary)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="flex items-start gap-8">
                    <div className="mt-1 text-[var(--tournament-primary)]">
                      <Icon size={26} strokeWidth={1.5} />
                    </div>

                    <div className="flex-1">
                      <p className="font-mono text-[10px] font-black uppercase tracking-[0.30em] text-white/35">
                        {fact.label}
                      </p>

                      <h3 className="mt-4 text-4xl font-black uppercase leading-[0.9] tracking-[-0.05em] lg:text-5xl">
                        {fact.value}
                      </h3>

                      <p className="mt-6 max-w-2xl text-base leading-8 text-white/45">
                        {fact.detail}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}