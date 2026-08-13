import Link from "next/link";

import {
  ArrowUpRight,
  Crown,
  Landmark,
  Trophy,
} from "lucide-react";

import type {
  TennisHistoryLegend,
} from "./tennis-history.data";


type LegendOfHistoryCardProps = {
  legend: TennisHistoryLegend;
};


export default function LegendOfHistoryCard({
  legend,
}: LegendOfHistoryCardProps) {
  const content = (
    <article className="group relative overflow-hidden rounded-[2rem] border border-[#d7ff00]/20 bg-[linear-gradient(145deg,rgba(10,20,38,.98),rgba(5,11,24,.98))] shadow-[0_24px_70px_rgba(0,0,0,.35)] transition duration-500 hover:-translate-y-1 hover:border-[#d7ff00]/45">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(215,255,0,.11),transparent_28%)]" />

      <div className="absolute right-0 top-0 h-44 w-44 rounded-full border border-[#d7ff00]/10 translate-x-1/3 -translate-y-1/3" />

      <div className="relative grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-[320px] overflow-hidden border-b border-white/10 bg-[#071020] lg:min-h-[430px] lg:border-b-0 lg:border-r">
          {legend.imageUrl ? (
            <img
              src={legend.imageUrl}
              alt={legend.name}
              className="absolute inset-0 h-full w-full object-cover grayscale-[20%] transition duration-700 group-hover:scale-[1.025]"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center">
                <Crown
                  size={34}
                  className="mx-auto text-[#d7ff00]/60"
                />

                <p className="mt-5 text-[10px] font-black uppercase tracking-[.28em] text-white/35">
                  Portrait pending
                </p>

                <p className="mt-2 text-xs font-semibold uppercase tracking-[.15em] text-white/20">
                  AGE202 Media Archive
                </p>
              </div>
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#050b18] via-[#050b18]/65 to-transparent p-6 pt-24">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d7ff00]/25 bg-[#050b18]/80 px-3 py-2 backdrop-blur">
              <span className="text-[9px] font-black uppercase tracking-[.2em] text-[#d7ff00]">
                {legend.period}
              </span>
            </div>
          </div>
        </div>

        <div className="relative flex flex-col p-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#d7ff00]" />

                <p className="text-[9px] font-black uppercase tracking-[.26em] text-[#d7ff00]">
                  {legend.eyebrow}
                </p>
              </div>

              <p className="mt-4 text-[11px] font-black uppercase tracking-[.2em] text-white/38">
                {legend.country} · {legend.countryCode}
              </p>
            </div>

            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full border border-[#d7ff00]/30 bg-[#d7ff00]/[.04] text-sm font-black text-[#d7ff00] shadow-[0_0_30px_rgba(215,255,0,.08)]">
              {legend.year}
            </div>
          </div>

          <div className="mt-10">
            <h3 className="text-[clamp(2.6rem,5vw,5.4rem)] font-black uppercase leading-[.83] tracking-[-.065em]">
              {legend.name}
            </h3>

            <p className="mt-5 text-sm font-black uppercase tracking-[.2em] text-[#d7ff00] sm:text-base">
              {legend.title}
            </p>
          </div>

          <p className="mt-7 max-w-2xl text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
            {legend.description}
          </p>

          <blockquote className="mt-8 border-l border-[#d7ff00]/45 pl-5 text-lg font-semibold italic leading-8 text-white/72">
            “{legend.quote}”
          </blockquote>

          <div className="mt-9 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.2rem] border border-white/10 bg-white/[.025] p-4">
              <div className="flex items-center gap-2 text-white/32">
                <Trophy size={15} />
                <span className="text-[8px] font-black uppercase tracking-[.2em]">
                  Signature achievement
                </span>
              </div>

              <p className="mt-3 text-sm font-black uppercase tracking-[-.02em] text-white/85">
                {legend.achievement}
              </p>
            </div>

            <div className="rounded-[1.2rem] border border-white/10 bg-white/[.025] p-4">
              <div className="flex items-center gap-2 text-white/32">
                <Landmark size={15} />
                <span className="text-[8px] font-black uppercase tracking-[.2em]">
                  Historical period
                </span>
              </div>

              <p className="mt-3 text-sm font-black uppercase tracking-[-.02em] text-white/85">
                {legend.period}
              </p>
            </div>
          </div>

          <div className="mt-auto pt-10">
            {legend.href ? (
              <div className="inline-flex items-center gap-3 text-[9px] font-black uppercase tracking-[.22em] text-[#d7ff00]">
                Enter AGE202 archive
                <ArrowUpRight
                  size={15}
                  className="transition group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </div>
            ) : (
              <p className="text-[8px] font-black uppercase tracking-[.2em] text-white/25">
                Historical profile · AGE202
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );


  if (!legend.href) {
    return content;
  }


  return (
    <Link
      href={legend.href}
      className="block"
    >
      {content}
    </Link>
  );
}