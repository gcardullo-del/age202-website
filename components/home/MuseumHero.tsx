"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import type { CSSProperties } from "react";

import MuseumButton from "@/components/ui/MuseumButton";
import {
  revealUp,
  staggerContainer,
} from "@/lib/motion";
import { themeColors } from "@/lib/theme";

const museumStats: MuseumStatProps[] = [
  {
    value: "20+",
    label: "Archive pieces",
  },
  {
    value: "5",
    label: "Champions",
  },
  {
    value: "4",
    label: "Grand Slams",
  },
  {
    value: "100%",
    label: "Curated",
  },
];

const heroTheme = {
  "--museum-bg": themeColors.background.primary,
  "--museum-accent": themeColors.brand.lime,
} as CSSProperties;

export default function MuseumHero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="museum-hero-title"
      style={heroTheme}
      className="relative flex min-h-[calc(100svh-80px)] overflow-hidden bg-[var(--museum-bg)] text-white"
    >
      {/* Background image */}

      <div
        aria-hidden="true"
        className="absolute inset-0"
      >
        <Image
          src="/images/home/museum-hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-45"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[var(--museum-bg)] via-[color:var(--museum-bg)]/85 to-[color:var(--museum-bg)]/20" />

        <div className="absolute inset-0 bg-gradient-to-t from-[var(--museum-bg)] via-transparent to-[color:var(--museum-bg)]/40" />
      </div>

      {/* Atmospheric lights */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-32 top-1/4 h-[420px] w-[420px] rounded-full bg-[color:var(--museum-accent)]/[0.06] blur-[130px]" />

        <div className="absolute right-[-180px] top-[-100px] h-[520px] w-[520px] rounded-full bg-white/[0.035] blur-[150px]" />

        <motion.div
          className="absolute left-[-30%] top-0 h-full w-[18%] rotate-12 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent blur-2xl"
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  x: ["0vw", "170vw"],
                }
          }
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatDelay: 5,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Background grid */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "90px 90px",
        }}
      />

      {/* Vertical museum label */}

      <div
        aria-hidden="true"
        className="absolute right-5 top-1/2 hidden -translate-y-1/2 lg:block"
      >
        <p className="rotate-90 whitespace-nowrap text-[9px] font-black uppercase tracking-[0.42em] text-white/30">
          Digital Museum · Collectible Tennis Apparel
        </p>
      </div>

      {/* Main content */}

      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center px-6 py-24 md:px-8 lg:py-28">
        <motion.div
          variants={staggerContainer}
          initial={shouldReduceMotion ? false : "hidden"}
          animate="visible"
          className="w-full max-w-5xl"
        >
          {/* Museum eyebrow */}

          <motion.div
            variants={revealUp}
            className="flex items-center gap-4"
          >
            <span
              aria-hidden="true"
              className="h-px w-12 bg-[var(--museum-accent)]"
            />

            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--museum-accent)]">
              The digital museum
            </p>
          </motion.div>

          {/* Brand */}

          <motion.div
            variants={revealUp}
            className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 md:mt-8"
          >
            <p className="text-sm font-black uppercase tracking-[0.38em] text-white">
              AGE202
            </p>

            <span
              aria-hidden="true"
              className="h-1 w-1 rounded-full bg-[var(--museum-accent)]"
            />

            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/45">
              Second Hand. First Set.
            </p>
          </motion.div>

          {/* Main title */}

          <motion.h1
            id="museum-hero-title"
            variants={revealUp}
            className="mt-8 max-w-5xl text-[clamp(3.25rem,8.5vw,8.5rem)] font-black leading-[0.86] tracking-[-0.07em]"
          >
            <span className="block text-white">
              Tennis style
            </span>

            <span className="block text-white/25">
              becomes history.
            </span>
          </motion.h1>

          {/* Description */}

          <motion.p
            variants={revealUp}
            className="mt-8 max-w-xl text-base leading-8 text-gray-400 md:mt-10 md:text-lg"
          >
            A curated digital archive preserving collectible tennis apparel,
            iconic champions and the stories behind the greatest eras of the
            sport.
          </motion.p>

          {/* Actions */}

          <motion.div
            variants={revealUp}
            className="mt-9 flex flex-col gap-4 sm:flex-row md:mt-10"
          >
            <MuseumButton
              href="/archive"
              icon="→"
            >
              Explore the archive
            </MuseumButton>

            <MuseumButton
              href="/vault"
              variant="secondary"
              icon="+"
            >
              Enter the vault
            </MuseumButton>
          </motion.div>

          {/* Museum statistics */}

          <motion.div
            variants={revealUp}
            className="mt-14 grid max-w-2xl grid-cols-2 border-y border-white/10 sm:mt-16 sm:grid-cols-4"
          >
            {museumStats.map((stat) => (
              <MuseumStat
                key={stat.label}
                value={stat.value}
                label={stat.label}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Archive identifier */}

      <div className="absolute bottom-8 right-8 z-10 hidden text-right md:block">
        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/30">
          Museum archive
        </p>

        <p className="mt-2 font-mono text-xs tracking-[0.2em] text-white/60">
          AGE-MUSEUM-202
        </p>
      </div>

      {/* Scroll indicator */}

      <motion.a
        href="#museum-introduction"
        aria-label="Discover more about AGE202"
        className="absolute bottom-7 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-3 sm:flex"
        animate={
          shouldReduceMotion
            ? undefined
            : {
                y: [0, 7, 0],
              }
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <span className="text-[8px] font-black uppercase tracking-[0.32em] text-white/35">
          Discover
        </span>

        <span
          aria-hidden="true"
          className="relative h-10 w-px overflow-hidden bg-white/15"
        >
          <motion.span
            className="absolute left-0 top-0 h-4 w-px bg-[var(--museum-accent)]"
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    y: [-18, 42],
                  }
            }
            transition={{
              duration: 1.7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </span>
      </motion.a>

      {/* Bottom fade */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--museum-bg)] to-transparent"
      />
    </section>
  );
}

type MuseumStatProps = {
  value: string;
  label: string;
};

function MuseumStat({
  value,
  label,
}: MuseumStatProps) {
  return (
    <div className="border-white/10 px-3 py-6 odd:border-r sm:border-r sm:px-4 sm:odd:border-r sm:first:pl-0 sm:last:border-r-0 sm:last:pr-0">
      <p className="text-2xl font-black tracking-[-0.04em] text-white">
        {value}
      </p>

      <p className="mt-2 text-[8px] font-black uppercase tracking-[0.2em] text-gray-500">
        {label}
      </p>
    </div>
  );
}