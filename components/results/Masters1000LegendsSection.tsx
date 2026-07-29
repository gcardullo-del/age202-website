import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Crown, Medal, Sparkles, Trophy } from "lucide-react";

import { getTournamentLegends } from "@/lib/tournament-engine";
import { getPlayerArchiveHref } from "@/lib/player-links";
import type { Masters1000Legend } from "@/lib/data/masters-1000-legends";
import type { Masters1000Slug } from "@/lib/data/masters-1000";

type Masters1000LegendsSectionProps = {
  slug: Masters1000Slug;
};

export default function Masters1000LegendsSection({
  slug,
}: Masters1000LegendsSectionProps) {
  const data = getTournamentLegends(slug);

  if (data.legends.length === 0) {
    return null;
  }

  return (
    <section
      id="legends"
      className="relative scroll-mt-16 overflow-hidden border-t border-white/10 px-5 py-14 sm:px-8 lg:px-12 lg:py-20"
    >
      <div className="pointer-events-none absolute -right-48 top-10 h-[34rem] w-[34rem] rounded-full bg-[var(--tournament-glow)] opacity-30 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:56px_56px]" />

      <div className="relative mx-auto max-w-[1440px]">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-[var(--tournament-primary)]">
                <Crown size={17} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--tournament-primary)]">
                {data.eyebrow}
              </p>
            </div>

            <h2 className="mt-6 max-w-5xl text-4xl font-black uppercase leading-[0.9] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
              {data.title}
            </h2>
          </div>

          <p className="text-sm leading-7 text-white/43 lg:text-right">
            {data.description}
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {data.legends.map((legend, index) => {
            const isLast = index === data.legends.length - 1;

            return (
              <LegendCard
                key={legend.name}
                legend={legend}
                index={index}
                featured={index < 2}
                wide={isLast && data.legends.length % 3 === 1}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

type LegendCardProps = {
  legend: Masters1000Legend;
  index: number;
  featured: boolean;
  wide: boolean;
};

function LegendCard({ legend, index, featured, wide }: LegendCardProps) {
  const playerHref = getPlayerArchiveHref(legend.name) ?? legend.playerHref ?? null;

  const card = (
    <article
      className={`group relative flex h-full min-h-[490px] flex-col overflow-hidden rounded-[1.7rem] border bg-[#07101D] shadow-[0_18px_55px_rgba(0,0,0,0.18)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_26px_75px_rgba(0,0,0,0.32)] ${
        wide
          ? "xl:grid xl:min-h-[350px] xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]"
          : ""
      } ${
        featured
          ? "border-[var(--tournament-primary)]/50 shadow-[0_24px_80px_rgba(0,0,0,0.34)]"
          : "border-white/10 hover:border-[var(--tournament-primary)]/60"
      }`}
    >
      <div
        className={`relative h-64 overflow-hidden border-b border-white/10 bg-[linear-gradient(145deg,var(--tournament-secondary),#020611)] ${
          wide ? "xl:h-full xl:border-b-0 xl:border-r" : ""
        }`}
      >
        {legend.image ? (
          <Image
            src={legend.image}
            alt={legend.name}
            fill
            sizes={
              wide
                ? "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 58vw"
                : "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            }
            className="object-cover object-[center_24%] opacity-88 grayscale-[8%] transition duration-700 group-hover:scale-[1.045] group-hover:opacity-100 group-hover:grayscale-0"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <span className="text-[7rem] font-black uppercase tracking-[-0.09em] text-white/[0.09]">
              {legend.initials}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#07101D] via-transparent to-black/18 xl:group-[.wide]:bg-gradient-to-r" />
        <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/12 bg-[#050B18]/78 px-3 py-2 backdrop-blur-xl">
          <span className="font-mono text-[8px] font-black uppercase tracking-[0.18em] text-[var(--tournament-primary)]">
            {legend.countryCode}
          </span>
          <span className="h-1 w-1 rounded-full bg-white/25" />
          <span className="font-mono text-[7px] uppercase tracking-[0.16em] text-white/45">
            {legend.country}
          </span>
        </div>

        <span className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-2xl border border-white/12 bg-[#050B18]/78 font-mono text-[8px] font-black text-white/45 backdrop-blur-xl">
          0{index + 1}
        </span>
      </div>

      <div
        className={`flex flex-1 flex-col p-6 sm:p-7 ${wide ? "xl:p-8" : ""}`}
      >
        <p className="font-mono text-[8px] font-black uppercase tracking-[0.19em] text-[var(--tournament-primary)]">
          {legend.recordLabel}
        </p>

        <h3 className="mt-4 text-3xl font-black uppercase leading-[0.92] tracking-[-0.05em]">
          {legend.name}
        </h3>

        <div className="mt-7 grid grid-cols-[105px_minmax(0,1fr)] gap-5 rounded-[1.25rem] border border-white/10 bg-black/15 p-5 transition group-hover:border-[var(--tournament-primary)]/30">
          <div className="border-r border-white/10 pr-5">
            <div className="flex items-center gap-2 text-[var(--tournament-primary)]">
              <Trophy size={15} strokeWidth={1.6} aria-hidden="true" />
              <span className="text-3xl font-black tracking-[-0.05em]">
                {legend.titles}
              </span>
            </div>
            <p className="mt-2 font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/30">
              {legend.titles === 1 ? "Title" : "Titles"}
            </p>
          </div>

          <div>
            <p className="font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/30">
              Championship years
            </p>
            <p className="mt-3 text-xs font-black leading-6 tracking-[0.03em] text-white/70">
              {legend.titleYears.join(" · ")}
            </p>
          </div>
        </div>

        <blockquote className="mt-5 border-l-2 border-[var(--tournament-primary)] pl-4 text-sm font-black uppercase leading-6 tracking-[-0.015em] text-white/55">
          “{legend.quote}”
        </blockquote>

        <div className="mt-auto pt-6">
          {playerHref ? (
            <span className="inline-flex items-center gap-2 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/38 transition group-hover:text-[var(--tournament-primary)]">
              View player profile
              <ArrowRight size={13} aria-hidden="true" />
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/22">
              <Medal size={13} aria-hidden="true" />
              Historical legend
            </span>
          )}
        </div>
      </div>

      {featured ? (
        <div className="pointer-events-none absolute bottom-5 right-5 text-[var(--tournament-primary)]/10">
          <Sparkles size={56} strokeWidth={1} aria-hidden="true" />
        </div>
      ) : null}
    </article>
  );

  const wrapperClassName = wide
    ? "block h-full xl:col-span-3"
    : "block h-full";

  if (!playerHref) {
    return <div className={wrapperClassName}>{card}</div>;
  }

  return (
    <Link
      href={playerHref}
      className={`${wrapperClassName} rounded-[1.7rem] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tournament-primary)]`}
      aria-label={`View ${legend.name} profile`}
    >
      {card}
    </Link>
  );
}
