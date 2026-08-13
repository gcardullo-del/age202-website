import {
  ArrowRightLeft,
  Flame,
  Swords,
} from "lucide-react";

import type {
  TennisHistoryRivalry,
} from "./tennis-history.data";


type IconicRivalryCardProps = {
  rivalry: TennisHistoryRivalry;
};


export default function IconicRivalryCard({
  rivalry,
}: IconicRivalryCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-[2rem] border border-[#d7ff00]/20 bg-[linear-gradient(135deg,rgba(5,11,24,.99),rgba(12,22,37,.98))] shadow-[0_24px_70px_rgba(0,0,0,.35)] transition duration-500 hover:-translate-y-1 hover:border-[#d7ff00]/45">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(215,255,0,.09),transparent_33%)]" />

      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#d7ff00]/20 to-transparent" />


      {rivalry.imageUrl ? (
        <div className="relative h-[240px] overflow-hidden border-b border-white/10 sm:h-[320px] lg:h-[390px]">
          <img
            src={rivalry.imageUrl}
            alt={`${rivalry.playerOne} vs ${rivalry.playerTwo}`}
            className="absolute inset-0 h-full w-full object-cover grayscale-[12%] transition duration-700 group-hover:scale-[1.025]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#050b18] via-[#050b18]/28 to-black/5" />

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d7ff00]/25 bg-[#050b18]/80 px-3 py-2 backdrop-blur">
              <Flame
                size={13}
                className="text-[#d7ff00]"
              />

              <span className="text-[8px] font-black uppercase tracking-[.22em] text-[#d7ff00]">
                Rivalry archive
              </span>
            </div>

            <span className="rounded-full border border-white/10 bg-[#050b18]/75 px-3 py-2 text-[8px] font-black uppercase tracking-[.2em] text-white/45 backdrop-blur">
              {rivalry.period}
            </span>
          </div>
        </div>
      ) : null}


      <div className="relative p-6 sm:p-8 lg:p-10">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#d7ff00]" />

              <p className="text-[9px] font-black uppercase tracking-[.28em] text-[#d7ff00]">
                {rivalry.eyebrow}
              </p>
            </div>

            <p className="mt-4 text-[9px] font-black uppercase tracking-[.2em] text-white/32">
              {rivalry.period}
            </p>
          </div>


          <div className="grid h-16 w-16 place-items-center rounded-full border border-[#d7ff00]/30 bg-[#d7ff00]/[.04] text-sm font-black text-[#d7ff00]">
            {rivalry.year}
          </div>
        </div>


        <div className="mt-10 text-center">
          <Swords
            size={24}
            className="mx-auto text-[#d7ff00]"
          />

          <h3 className="mt-5 text-[clamp(2.5rem,5vw,5.2rem)] font-black uppercase leading-[.84] tracking-[-.065em]">
            {rivalry.title}
          </h3>
        </div>


        <div className="mt-10 grid items-center gap-5 sm:grid-cols-[1fr_auto_1fr]">
          <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[.025] p-6 sm:p-8">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full border border-white/[.04]" />

            <p className="text-[8px] font-black uppercase tracking-[.22em] text-white/28">
              Rival 01
            </p>

            <p className="mt-5 text-2xl font-black uppercase leading-none tracking-[-.045em] sm:text-4xl">
              {rivalry.playerOne}
            </p>
          </div>


          <div className="relative z-10 mx-auto grid h-14 w-14 place-items-center rounded-full border border-[#d7ff00]/35 bg-[#071020] shadow-[0_0_35px_rgba(215,255,0,.08)]">
            <ArrowRightLeft
              size={18}
              className="text-[#d7ff00]"
            />
          </div>


          <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[.025] p-6 text-right sm:p-8">
            <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full border border-white/[.04]" />

            <p className="text-[8px] font-black uppercase tracking-[.22em] text-white/28">
              Rival 02
            </p>

            <p className="mt-5 text-2xl font-black uppercase leading-none tracking-[-.045em] sm:text-4xl">
              {rivalry.playerTwo}
            </p>
          </div>
        </div>


        <div className="mx-auto mt-9 max-w-3xl text-center">
          <p className="text-sm leading-7 text-white/52 sm:text-base sm:leading-8">
            {rivalry.description}
          </p>
        </div>


        <div className="mt-9 flex items-center justify-center gap-3 border-t border-white/10 pt-6">
          <Flame
            size={14}
            className="text-[#d7ff00]"
          />

          <span className="text-[8px] font-black uppercase tracking-[.24em] text-white/32">
            Rivalry preserved in the AGE202 historical archive
          </span>
        </div>
      </div>
    </article>
  );
}