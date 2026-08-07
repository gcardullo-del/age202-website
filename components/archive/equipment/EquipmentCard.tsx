import Image from "next/image";

import {
  CircleDot,
  Sparkles,
} from "lucide-react";

import type {
  EquipmentCardProps,
} from "./types";

export default function EquipmentCard({
  item,
  accent,
}: EquipmentCardProps) {
  return (
    <article className="group relative flex min-h-[320px] min-w-0 flex-col rounded-[1.8rem] border border-white/10 bg-white/[0.025] transition duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.04]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.8rem]"
      >
        <div
          className="absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-0 blur-[70px] transition-opacity duration-500 group-hover:opacity-[0.16]"
          style={{
            backgroundColor:
              accent,
          }}
        />
      </div>

      {item.imageUrl ? (
        <div className="relative aspect-[16/10] min-w-0 overflow-hidden rounded-t-[1.8rem] border-b border-white/10 bg-black/15">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-contain p-6 transition duration-700 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
        </div>
      ) : null}

      <div className="relative z-10 flex min-w-0 flex-1 flex-col px-7 pb-8 pt-8">
        <div className="flex min-h-8 min-w-0 items-center justify-between gap-4">
          <p className="min-w-0 break-words py-1 font-mono text-[8px] font-black uppercase leading-[1.7] tracking-[0.16em] text-white/25">
            {item.brand ??
              "AGE202 archive"}
          </p>

          {item.featured ? (
            <Sparkles
              className="h-4 w-4 shrink-0"
              style={{
                color: accent,
              }}
              aria-hidden="true"
            />
          ) : (
            <CircleDot
              className="h-4 w-4 shrink-0 text-white/15"
              aria-hidden="true"
            />
          )}
        </div>

        <h4 className="mt-4 min-w-0 break-words text-2xl font-black leading-[1.2] tracking-[-0.03em] text-white">
          {item.name}
        </h4>

        {item.period ? (
          <p
            className="mt-3 break-words py-1 text-[9px] font-black uppercase leading-[1.7] tracking-[0.14em]"
            style={{
              color: accent,
            }}
          >
            {item.period}
          </p>
        ) : null}

        {item.description ? (
          <p className="mt-4 min-w-0 break-words text-sm leading-7 text-white/42">
            {item.description}
          </p>
        ) : null}

        {item.curiosity ? (
          <div className="mt-6 border-t border-white/10 pt-5">
            <p className="font-mono text-[8px] font-black uppercase leading-[1.7] tracking-[0.16em] text-white/22">
              Museum note
            </p>

            <p className="mt-2 min-w-0 break-words text-xs italic leading-6 text-white/35">
              {item.curiosity}
            </p>
          </div>
        ) : null}

        <div className="mt-auto pt-7">
          <span
            className="block h-px w-12 transition-all duration-500 group-hover:w-20"
            style={{
              backgroundColor:
                accent,
            }}
          />
        </div>
      </div>
    </article>
  );
}
