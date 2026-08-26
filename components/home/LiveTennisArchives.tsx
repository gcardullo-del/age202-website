"use client";

import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  CircleDot,
} from "lucide-react";

import {
  motion,
} from "framer-motion";


const cards = [
  {
    eyebrow:
      "Live Top 50 Index",

    kicker:
      "02 · The wider tour",

    title:
      "ATP Archive",

    description:
      "Discover established champions, rising stars and the next generation through a dynamic archive connected to the current ATP Top 50.",

    href:
      "/players/other-players",

    cta:
      "Enter ATP Archive",

    image:
      "/players/other-players/hero.png",

    alt:
      "AGE202 ATP Archive",
  },

  {
    eyebrow:
      "Live Top 50 Index",

    kicker:
      "02 · The women's tour",

    title:
      "WTA Archive",

    description:
      "Discover the current generation through a dynamic AGE202 archive connected to the WTA Top 50.",

    href:
      "/players/women/archive",

    cta:
      "Enter WTA Archive",

    image:
      "/players/women/wta-archive-hero.png",

    alt:
      "AGE202 WTA Archive",
  },
] as const;


export default function LiveTennisArchives() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#030812] px-6 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(215,255,0,.07),transparent_26%),radial-gradient(circle_at_82%_72%,rgba(255,255,255,.035),transparent_26%)]" />

      <div className="relative mx-auto max-w-[1500px]">
        <div className="mb-10 flex flex-col justify-between gap-6 border-t border-white/10 pt-6 lg:mb-14 lg:flex-row lg:items-end">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-10 bg-[#d7ff00]" />

              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d7ff00]">
                Live Tennis Archives
              </p>
            </div>

            <h2 className="max-w-4xl text-4xl font-black uppercase leading-[0.92] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              Two tours.
              <span className="block text-[#d7ff00]">
                One living museum.
              </span>
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
            Follow the current ATP and WTA generations through continuously
            evolving AGE202 archives connected to live rankings and player profiles.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          {cards.map(
            (
              card,
              index,
            ) => (
              <motion.article
                key={
                  card.title
                }
                initial={{
                  opacity:
                    0,

                  y:
                    28,
                }}
                whileInView={{
                  opacity:
                    1,

                  y:
                    0,
                }}
                viewport={{
                  once:
                    true,

                  amount:
                    0.2,
                }}
                transition={{
                  duration:
                    0.65,

                  delay:
                    index *
                    0.08,
                }}
                className="group relative min-h-[560px] overflow-hidden rounded-[34px] border border-white/10 bg-[#07101D] shadow-[0_28px_90px_rgba(0,0,0,.28)]"
              >
                <Link
                  href={
                    card.href
                  }
                  aria-label={`Open ${card.title}`}
                  className="absolute inset-0 z-20"
                />

                <Image
                  src={
                    card.image
                  }
                  alt={
                    card.alt
                  }
                  fill
                  sizes="(max-width: 1280px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                />

                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,8,18,.10)_0%,rgba(3,8,18,.12)_32%,rgba(3,8,18,.72)_68%,#030812_100%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,8,18,.15)_0%,transparent_56%,rgba(3,8,18,.20)_100%)]" />
                <div className="absolute inset-x-0 top-0 h-1 bg-[#d7ff00] opacity-90" />

                <div className="absolute left-6 top-6 z-10 inline-flex items-center gap-2 rounded-full border border-[#d7ff00]/25 bg-[#030812]/70 px-4 py-2 text-[9px] font-black uppercase tracking-[0.18em] text-[#d7ff00] backdrop-blur-md sm:left-7 sm:top-7">
                  <CircleDot className="h-3.5 w-3.5" />

                  {
                    card.eyebrow
                  }
                </div>

                <div className="absolute inset-x-0 bottom-0 z-10 p-7 sm:p-9 lg:p-10">
                  <div className="text-[10px] font-black uppercase tracking-[0.22em] text-[#d7ff00]">
                    {
                      card.kicker
                    }
                  </div>

                  <h3 className="mt-3 text-5xl font-black uppercase leading-[0.86] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
                    {
                      card.title
                    }
                  </h3>

                  <p className="mt-5 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
                    {
                      card.description
                    }
                  </p>

                  <div className="mt-7 inline-flex min-h-13 items-center gap-3 rounded-full bg-[#d7ff00] px-6 py-3 text-[11px] font-black uppercase tracking-[0.12em] text-[#030812] shadow-[0_12px_32px_rgba(215,255,0,.16)] transition duration-300 group-hover:-translate-y-0.5 group-hover:bg-white">
                    {
                      card.cta
                    }

                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.article>
            ),
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[24px] border border-white/10 bg-white/10 md:grid-cols-4">
          {[
            [
              "100",
              "Players indexed",
            ],
            [
              "02",
              "Live tours",
            ],
            [
              "ATP + WTA",
              "Dynamic rankings",
            ],
            [
              "24/7",
              "Living archives",
            ],
          ].map(
            ([
              value,
              label,
            ]) => (
              <div
                key={
                  label
                }
                className="bg-[#07101D] px-5 py-5 sm:px-6"
              >
                <div className="text-2xl font-black tracking-[-0.04em] text-[#d7ff00] sm:text-3xl">
                  {
                    value
                  }
                </div>

                <div className="mt-1 text-[9px] font-black uppercase tracking-[0.16em] text-white/35">
                  {
                    label
                  }
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
