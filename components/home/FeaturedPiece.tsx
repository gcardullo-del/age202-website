"use client";

import { memo, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import type { CSSProperties } from "react";

import { SectionHeader } from "@/components/museum-ui";
import MuseumButton from "@/components/ui/MuseumButton";
import { age202Theme } from "@/lib/theme";

const featuredPiece = {
  id: "federer-wimbledon-2017",
  title: "The Wimbledon 2017 Collection",
  originalTitle: "Nike RF Wimbledon 2017",
  player: "Roger Federer",
  archiveNumber: "AGE-00001",
  rarity: "Ultra Rare",
  year: "2017",
  tournament: "Wimbledon",
  brand: "Nike",
  collection: "Championship Edition",
  status: "Museum Verified",
  image: "/images/home/featured-piece.png",
  description:
    "A defining garment from one of the most celebrated seasons in modern tennis history, digitally preserved for its historical, visual and cultural significance.",
} as const;

const featuredPieceTheme = {
  "--featured-background": age202Theme.colors.background.primary,
  "--featured-accent": age202Theme.colors.brand.lime,
  "--featured-panel": "#08101F",
  "--featured-panel-soft": "#0A1425",
} as CSSProperties;

function FeaturedPieces() {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? ["0%", "0%"] : ["-5%", "5%"],
  );

  const glowY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? ["0%", "0%"] : ["-18%", "18%"],
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="featured-piece-heading"
      style={featuredPieceTheme}
      className="relative overflow-hidden border-y border-white/10 bg-[var(--featured-background)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <motion.div
          style={{ y: glowY }}
          className="absolute -right-40 top-1/4 h-[560px] w-[560px] rounded-full bg-[color:var(--featured-accent)]/[0.06] blur-[160px]"
        />

        <div className="absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-blue-500/[0.035] blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "88px 88px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-6 py-20 md:px-8 lg:py-28">
        <div className="mx-auto mb-14 max-w-7xl lg:mb-20">
          <SectionHeader
            eyebrow="Featured archive piece"
            title={
              <span id="featured-piece-heading">
                An icon preserved
                <span className="block text-white/25">
                  beyond the match.
                </span>
              </span>
            }
            description="Selected from the AGE202 archive for its historical, visual and cultural significance within tennis apparel."
          />
        </div>

        <article
          aria-labelledby="featured-piece-title"
          className="group relative mx-auto max-w-7xl overflow-hidden rounded-[34px] border border-white/10 bg-[var(--featured-panel)] shadow-[0_45px_140px_rgba(0,0,0,0.5)]"
        >
          <div className="grid min-h-[820px] lg:grid-cols-[1.25fr_0.75fr]">
            <div className="relative min-h-[560px] overflow-hidden lg:min-h-full">
              <motion.div
                style={{
                  y: imageY,
                  scale: shouldReduceMotion ? 1 : 1.07,
                }}
                className="absolute inset-0"
              >
                <Image
                  src={featuredPiece.image}
                  alt={`${featuredPiece.originalTitle} — ${featuredPiece.player}`}
                  fill
                  priority={false}
                  sizes="(max-width: 1024px) 100vw, 63vw"
                  className={[
                    "object-cover object-center",
                    shouldReduceMotion
                      ? ""
                      : "transition-transform duration-[1400ms] ease-out group-hover:scale-[1.035]",
                  ].join(" ")}
                />
              </motion.div>

              <div className="absolute inset-0 bg-gradient-to-t from-[var(--featured-background)] via-transparent to-black/15 lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[var(--featured-panel)]" />

              <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[var(--featured-background)] via-[var(--featured-background)]/30 to-transparent lg:hidden" />

              <div className="absolute left-6 top-6 flex max-w-[calc(100%-3rem)] flex-wrap gap-3 md:left-8 md:top-8">
                <span className="rounded-full border border-[color:var(--featured-accent)]/30 bg-black/30 px-4 py-2 text-[8px] font-black uppercase tracking-[0.22em] text-[var(--featured-accent)] backdrop-blur-xl">
                  Museum verified
                </span>

                <span className="rounded-full border border-white/15 bg-black/30 px-4 py-2 text-[8px] font-black uppercase tracking-[0.22em] text-white/90 backdrop-blur-xl">
                  AGE202 digital archive
                </span>
              </div>

              <div className="absolute bottom-7 left-7 md:bottom-9 md:left-9">
                <div className="rounded-2xl border border-white/10 bg-black/25 px-5 py-4 backdrop-blur-xl">
                  <p className="text-[8px] font-black uppercase tracking-[0.28em] text-white/45">
                    Archive number
                  </p>

                  <p className="mt-2 font-mono text-sm font-bold tracking-[0.2em] text-white">
                    {featuredPiece.archiveNumber}
                  </p>
                </div>
              </div>

              <div
                aria-hidden="true"
                className="absolute bottom-9 right-9 hidden h-24 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent lg:block"
              />
            </div>

            <div className="relative flex flex-col justify-center overflow-hidden px-7 py-14 md:px-12 lg:px-12 lg:py-16">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-4 -top-8 text-[190px] font-black leading-none tracking-[-0.09em] text-white/[0.018] md:text-[250px]"
              >
                01
              </div>

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 hidden w-px bg-gradient-to-b from-transparent via-white/10 to-transparent lg:block"
              />

              <div className="relative z-10">
                <div className="flex items-center gap-4">
                  <span className="h-px w-10 bg-[var(--featured-accent)]" />

                  <p className="text-[9px] font-black uppercase tracking-[0.32em] text-[var(--featured-accent)]">
                    Featured acquisition
                  </p>
                </div>

                <p className="mt-8 text-[10px] font-black uppercase tracking-[0.28em] text-white/45">
                  {featuredPiece.player}
                </p>

                <h3
                  id="featured-piece-title"
                  className="mt-4 max-w-lg text-4xl font-black leading-[0.93] tracking-[-0.055em] text-white sm:text-5xl lg:text-[3.45rem]"
                >
                  The Wimbledon
                  <span className="block text-white/28">
                    2017 Collection
                  </span>
                </h3>

                <p className="mt-7 max-w-lg text-[15px] leading-7 text-white/48">
                  {featuredPiece.description}
                </p>

                <div className="mt-9 rounded-[24px] border border-white/10 bg-white/[0.025] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] md:p-6">
                  <div className="flex items-start justify-between gap-5 border-b border-white/10 pb-5">
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[var(--featured-accent)]">
                        Archive passport
                      </p>

                      <p className="mt-2 text-sm font-bold tracking-[-0.01em] text-white">
                        Authenticated digital record
                      </p>
                    </div>

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[color:var(--featured-accent)]/25 bg-[color:var(--featured-accent)]/[0.07]">
                      <span className="font-mono text-[9px] font-black tracking-[0.1em] text-[var(--featured-accent)]">
                        A202
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-5 gap-y-6 pt-6">
                    <PassportItem
                      label="Player"
                      value={featuredPiece.player}
                    />

                    <PassportItem
                      label="Season"
                      value={featuredPiece.year}
                    />

                    <PassportItem
                      label="Tournament"
                      value={featuredPiece.tournament}
                    />

                    <PassportItem
                      label="Brand"
                      value={featuredPiece.brand}
                    />

                    <PassportItem
                      label="Collection"
                      value={featuredPiece.collection}
                    />

                    <PassportItem
                      label="Rarity"
                      value={featuredPiece.rarity}
                      accent
                    />
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
                    <div>
                      <p className="text-[7px] font-black uppercase tracking-[0.25em] text-white/25">
                        Record ID
                      </p>

                      <p className="mt-1 font-mono text-[10px] font-bold tracking-[0.15em] text-white/65">
                        {featuredPiece.archiveNumber}
                      </p>
                    </div>

                    <span className="rounded-full border border-[color:var(--featured-accent)]/20 bg-[color:var(--featured-accent)]/[0.06] px-3 py-2 text-[7px] font-black uppercase tracking-[0.2em] text-[var(--featured-accent)]">
                      {featuredPiece.status}
                    </span>
                  </div>
                </div>
                                <blockquote className="mt-8 border-l border-[color:var(--featured-accent)]/45 pl-5 text-sm italic leading-7 text-white/35">
                  “Every garment preserves a moment. Every moment becomes part
                  of tennis history.”
                </blockquote>

                <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <MuseumButton
                    href={`/product/${featuredPiece.id}`}
                    aria-label={`Explore ${featuredPiece.originalTitle}`}
                    icon="→"
                  >
                    Explore the piece
                  </MuseumButton>

                  <MuseumButton href="/archive" variant="secondary">
                    View full archive
                  </MuseumButton>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

type PassportItemProps = {
  label: string;
  value: string;
  accent?: boolean;
};

function PassportItem({
  label,
  value,
  accent = false,
}: PassportItemProps) {
  return (
    <div className="min-w-0">
      <p className="text-[7px] font-black uppercase tracking-[0.25em] text-white/25">
        {label}
      </p>

      <p
        title={value}
        className={[
          "mt-2 truncate text-[10px] font-bold uppercase tracking-[0.1em]",
          accent ? "text-[var(--featured-accent)]" : "text-white/80",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}

export default memo(FeaturedPieces);