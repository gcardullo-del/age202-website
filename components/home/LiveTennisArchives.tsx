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

    mobileImage:
      "/players/other-players/hero-mobile.png",

    alt:
      "AGE202 ATP Archive",

    desktopPosition:
      "center 42%",
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

    mobileImage:
  "/players/women/wta-archive-hero-mobile-v2.png?v=3",

    alt:
      "AGE202 WTA Archive",

    desktopPosition:
      "98% 45%",
  },
] as const;


export default function LiveTennisArchives() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#030812] px-4 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(215,255,0,.07),transparent_26%),radial-gradient(circle_at_82%_72%,rgba(255,255,255,.035),transparent_26%)]" />

      <div className="relative mx-auto max-w-[1900px]">
        <div className="mb-8 flex flex-col justify-between gap-5 border-t border-white/10 pt-5 sm:mb-10 sm:gap-6 sm:pt-6 lg:mb-14 lg:flex-row lg:items-end">
          <div>
            <div className="mb-3 flex items-center gap-3 sm:mb-4">
              <span className="h-px w-8 bg-[#d7ff00] sm:w-10" />

              <p className="text-[9px] font-black uppercase tracking-[0.28em] text-[#d7ff00] sm:text-[10px] sm:tracking-[0.3em]">
                Live Tennis Archives
              </p>
            </div>

            <h2 className="max-w-4xl text-[2rem] font-black uppercase leading-[0.92] tracking-[-0.05em] sm:text-6xl sm:tracking-[-0.055em] lg:text-7xl">
              Two tours.

              <span className="block text-[#d7ff00]">
                One living museum.
              </span>
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
            Follow the current ATP and WTA generations through continuously
            evolving AGE202 archives connected to live rankings and player
            profiles.
          </p>
        </div>


        <div className="grid gap-4 sm:gap-6 xl:grid-cols-2">
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
                className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-[#07101D] shadow-[0_24px_70px_rgba(0,0,0,.28)] sm:min-h-[560px] sm:rounded-[34px] sm:shadow-[0_28px_90px_rgba(0,0,0,.28)] lg:min-h-[520px] xl:min-h-[520px] 2xl:min-h-[540px]"
              >
                <Link
                  href={
                    card.href
                  }
                  aria-label={`Open ${card.title}`}
                  className="absolute inset-0 z-20"
                />


                {/* MOBILE IMAGE — ALWAYS FULL, NEVER CROPPED */}

             {/* MOBILE IMAGE — FULL COMPOSITION, NO CROP */}

<div className="relative w-full bg-[#030812] sm:hidden">
  <img
    src={card.mobileImage}
    alt={card.alt}
   className={
  card.title === "WTA Archive"
    ? "mx-auto -mt-90 block h-auto w-[50%]"
    : "block h-auto w-full"
}
  />

  <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-[#d7ff00]/25 bg-[#030812]/75 px-3 py-2 text-[8px] font-black uppercase tracking-[0.16em] text-[#d7ff00] backdrop-blur-md">
    <CircleDot className="h-3.5 w-3.5" />

    {card.eyebrow}
  </div>
</div>


                {/* TABLET / DESKTOP IMAGE */}

                <Image
                  src={
                    card.image
                  }
                  alt={
                    card.alt
                  }
                  fill
                  sizes="(max-width: 1279px) 100vw, (max-width: 1900px) 50vw, 950px"
                  className="hidden object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035] sm:block"
                  style={{
                    objectPosition:
                      card.desktopPosition,
                  }}
                />


                {/* TABLET / DESKTOP OVERLAYS */}

                <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(180deg,rgba(3,8,18,.10)_0%,rgba(3,8,18,.12)_32%,rgba(3,8,18,.72)_68%,#030812_100%)] sm:block" />

                <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(3,8,18,.15)_0%,transparent_56%,rgba(3,8,18,.20)_100%)] sm:block" />


                {/* LIME TOP LINE */}

                <div className="absolute inset-x-0 top-0 z-10 h-1 bg-[#d7ff00] opacity-90" />


                {/* TABLET / DESKTOP BADGE */}

                <div className="absolute left-7 top-7 z-10 hidden items-center gap-2 rounded-full border border-[#d7ff00]/25 bg-[#030812]/70 px-4 py-2 text-[9px] font-black uppercase tracking-[0.18em] text-[#d7ff00] backdrop-blur-md sm:inline-flex">
                  <CircleDot className="h-3.5 w-3.5" />

                  {
                    card.eyebrow
                  }
                </div>


                {/* CONTENT */}

                <div className="relative z-10 bg-[#07101D] p-5 sm:absolute sm:inset-x-0 sm:bottom-0 sm:bg-transparent sm:p-9 lg:p-10">
                  <div className="text-[9px] font-black uppercase tracking-[0.2em] text-[#d7ff00] sm:text-[10px] sm:tracking-[0.22em]">
                    {
                      card.kicker
                    }
                  </div>

                  <h3 className="mt-2 text-[2.45rem] font-black uppercase leading-[0.9] tracking-[-0.055em] sm:mt-3 sm:text-6xl sm:leading-[0.86] sm:tracking-[-0.06em] lg:text-7xl">
                    {
                      card.title
                    }
                  </h3>

                  <p className="mt-4 max-w-2xl text-[13px] leading-6 text-white/65 sm:mt-5 sm:text-base sm:leading-7">
                    {
                      card.description
                    }
                  </p>

                  <div className="mt-5 inline-flex min-h-[48px] items-center gap-3 rounded-full bg-[#d7ff00] px-5 py-3 text-[10px] font-black uppercase tracking-[0.1em] text-[#030812] shadow-[0_12px_32px_rgba(215,255,0,.16)] transition duration-300 group-hover:-translate-y-0.5 group-hover:bg-white sm:mt-7 sm:min-h-13 sm:px-6 sm:text-[11px] sm:tracking-[0.12em]">
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


        <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[20px] border border-white/10 bg-white/10 sm:mt-6 sm:rounded-[24px] md:grid-cols-4">
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
                className="bg-[#07101D] px-4 py-4 sm:px-6 sm:py-5"
              >
                <div className="text-2xl font-black tracking-[-0.04em] text-[#d7ff00] sm:text-3xl">
                  {
                    value
                  }
                </div>

                <div className="mt-1 text-[8px] font-black uppercase tracking-[0.14em] text-white/35 sm:text-[9px] sm:tracking-[0.16em]">
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