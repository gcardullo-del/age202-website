import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Crown, Medal, Trophy } from "lucide-react";

import type { Masters1000Slug } from "@/lib/data/masters-1000";
import { getTournamentLegends } from "@/lib/tournament-engine";
import { getPlayerArchiveHref } from "@/lib/player-links";

type Masters1000ChampionSpotlightProps = {
  slug: Masters1000Slug;
  index: number;
  chapter: string;
  reverse?: boolean;
};

export default function Masters1000ChampionSpotlight({
  slug,
  index,
  chapter,
  reverse = false,
}: Masters1000ChampionSpotlightProps) {
  const data = getTournamentLegends(slug);
  const legend = data.legends[index];

  if (!legend) return null;

  const href = getPlayerArchiveHref(legend.name) ?? legend.playerHref ?? null;

  return (
    <section
      className="relative isolate min-h-[760px] overflow-hidden border-y border-white/10 bg-[#020611]"
      aria-label={`${legend.name} spotlight`}
    >
      {legend.image ? (
        <Image
          src={legend.image}
          alt={legend.name}
          fill
          sizes="100vw"
          className={`object-cover opacity-55 grayscale-[12%] ${reverse ? "object-[30%_center]" : "object-[70%_center]"}`}
        />
      ) : null}

      <div className={`absolute inset-0 ${reverse ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-[#020611] via-[#020611]/78 to-[#020611]/18`} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#020611] via-transparent to-[#020611]/30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--tournament-glow),transparent_45%)] opacity-25" />

      <div className={`relative mx-auto flex min-h-[760px] max-w-[1480px] items-center px-5 py-20 sm:px-8 lg:px-12 ${reverse ? "justify-end" : "justify-start"}`}>
        <div className={`max-w-3xl ${reverse ? "lg:text-right" : ""}`}>
          <p className="font-mono text-[9px] font-black uppercase tracking-[0.28em] text-[var(--tournament-primary)]">
            {chapter}
          </p>

          <p className="mt-7 text-[clamp(1rem,2vw,1.35rem)] font-black uppercase tracking-[0.2em] text-white/42">
            {legend.recordLabel}
          </p>

          <h2 className="mt-5 text-[clamp(4.5rem,10vw,10rem)] font-black uppercase leading-[0.72] tracking-[-0.09em]">
            {legend.name}
          </h2>

          <blockquote className={`mt-9 max-w-2xl border-[var(--tournament-primary)] text-2xl font-black uppercase leading-[1.05] tracking-[-0.04em] text-white/68 sm:text-3xl ${reverse ? "ml-auto border-r-2 pr-6" : "border-l-2 pl-6"}`}>
            “{legend.quote}”
          </blockquote>

          <div className={`mt-10 flex flex-wrap gap-3 ${reverse ? "lg:justify-end" : ""}`}>
            <SpotlightStat icon={Trophy} value={String(legend.titles)} label={legend.titles === 1 ? "Title" : "Titles"} />
            <SpotlightStat icon={Medal} value={legend.titleYears.join(" · ")} label="Championship years" wide />
            <SpotlightStat icon={Crown} value={legend.countryCode} label={legend.country} />
          </div>

          {href ? (
            <Link
              href={href}
              className="mt-10 inline-flex items-center gap-3 rounded-full border border-white/15 bg-black/20 px-6 py-3.5 font-mono text-[8px] font-black uppercase tracking-[0.2em] text-white/60 backdrop-blur-xl transition hover:border-[var(--tournament-primary)] hover:text-[var(--tournament-primary)]"
            >
              Enter player archive
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          ) : null}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-4 right-6 font-mono text-[7px] font-black uppercase tracking-[0.22em] text-white/18">
        AGE202 Museum Experience
      </div>
    </section>
  );
}

function SpotlightStat({
  icon: Icon,
  value,
  label,
  wide = false,
}: {
  icon: typeof Trophy;
  value: string;
  label: string;
  wide?: boolean;
}) {
  return (
    <div className={`rounded-[1.35rem] border border-white/12 bg-[#07101D]/68 px-5 py-4 backdrop-blur-xl ${wide ? "min-w-[240px]" : "min-w-[130px]"}`}>
      <div className="flex items-center gap-2 text-[var(--tournament-primary)]">
        <Icon size={14} strokeWidth={1.4} aria-hidden="true" />
        <span className="font-mono text-[7px] font-black uppercase tracking-[0.18em] text-white/34">{label}</span>
      </div>
      <p className="mt-3 text-lg font-black uppercase tracking-[-0.03em]">{value}</p>
    </div>
  );
}
