import Image from "next/image";

import {
  Sparkles,
  Trophy,
} from "lucide-react";

import {
  categoryConfig,
} from "./category-config";

import type {
  FeaturedEquipmentProps,
} from "./types";

export default function FeaturedEquipment({
  item,
  playerName,
  accent,
}: FeaturedEquipmentProps) {
  const category =
    categoryConfig[item.category];

  return (
    <article className="group relative min-w-0 rounded-[2.2rem] border border-white/10 bg-[#09111f]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2.2rem]"
      >
        <div
          className="absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-[0.13] blur-[115px] transition-opacity duration-700 group-hover:opacity-[0.2]"
          style={{
            backgroundColor:
              accent,
          }}
        />

        <span className="absolute -bottom-10 right-4 select-none text-[150px] font-black leading-none tracking-[-0.08em] text-white/[0.018] sm:text-[220px] lg:right-10 lg:text-[300px]">
          01
        </span>
      </div>

      <div className="relative z-10 grid min-w-0 gap-10 px-7 py-9 sm:px-10 sm:py-12 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-center lg:px-14 lg:py-16">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="rounded-full border px-4 py-2 font-mono text-[8px] font-black uppercase leading-[1.6] tracking-[0.18em]"
              style={{
                borderColor:
                  `${accent}40`,
                backgroundColor:
                  `${accent}0d`,
                color: accent,
              }}
            >
              Featured equipment
            </span>

            <span className="rounded-full border border-white/10 bg-white/[0.025] px-4 py-2 font-mono text-[8px] uppercase leading-[1.6] tracking-[0.18em] text-white/35">
              {category.label}
            </span>
          </div>

          <p className="mt-8 break-words font-mono text-[9px] uppercase leading-[1.7] tracking-[0.2em] text-white/25">
            {item.brand ??
              "Museum record"}
          </p>

          <h3 className="mt-3 max-w-4xl break-words text-4xl font-black leading-[0.98] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
            {item.name}
          </h3>

          {item.period ? (
            <p
              className="mt-5 break-words text-[10px] font-black uppercase leading-[1.7] tracking-[0.18em]"
              style={{
                color: accent,
              }}
            >
              {item.period}
            </p>
          ) : null}

          {item.description ? (
            <p className="mt-7 max-w-4xl break-words text-base leading-8 text-white/50 sm:text-lg sm:leading-9">
              {item.description}
            </p>
          ) : null}

          {item.curiosity ? (
            <div
              className="mt-8 border-l pl-5 sm:pl-7"
              style={{
                borderColor:
                  accent,
              }}
            >
              <div className="flex items-center gap-2">
                <Sparkles
                  className="h-4 w-4 shrink-0"
                  style={{
                    color: accent,
                  }}
                  aria-hidden="true"
                />

                <p className="font-mono text-[8px] font-black uppercase leading-[1.7] tracking-[0.2em] text-white/25">
                  Museum curiosity
                </p>
              </div>

              <p className="mt-3 max-w-3xl break-words text-sm italic leading-7 text-white/48 sm:text-base sm:leading-8">
                {item.curiosity}
              </p>
            </div>
          ) : null}
        </div>

        <div className="relative min-h-[300px] min-w-0 overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/[0.025] sm:min-h-[360px]">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={`${item.name} used by ${playerName}`}
              fill
              className="object-contain p-8 sm:p-10"
              sizes="(max-width: 1024px) 100vw, 440px"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
              <span
                className="grid h-20 w-20 place-items-center rounded-full border"
                style={{
                  borderColor:
                    `${accent}35`,
                  backgroundColor:
                    `${accent}0d`,
                  color: accent,
                }}
              >
                <Trophy
                  className="h-8 w-8"
                  aria-hidden="true"
                />
              </span>

              <p className="mt-6 font-mono text-[8px] font-black uppercase leading-[1.7] tracking-[0.2em] text-white/25">
                Archive image
              </p>

              <p className="mt-2 max-w-xs text-sm leading-7 text-white/38">
                A dedicated museum image
                can be added from the
                Equipment CMS.
              </p>
            </div>
          )}

          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-px"
            style={{
              background:
                `linear-gradient(90deg, transparent, ${accent}, transparent)`,
              boxShadow:
                `0 0 18px ${accent}`,
            }}
          />
        </div>
      </div>
    </article>
  );
}
