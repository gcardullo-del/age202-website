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

import {
  SectionHeader,
} from "@/components/museum-ui";
import MuseumButton from "@/components/ui/MuseumButton";
import { themeColors } from "@/lib/theme";

const featuredPiece = {
  id: "federer-wimbledon-2017",
  title: "Nike RF Wimbledon 2017",
  player: "Roger Federer",
  archiveNumber: "AGE-00001",
  rarity: "Ultra Rare",
  year: "2017",
  tournament: "Wimbledon",
  brand: "Nike",
  image: "/images/home/featured-piece.png",
  description:
    "A defining piece from one of the most celebrated seasons in modern tennis history, preserved as part of the AGE202 digital archive.",
} as const;

const featuredPieceTheme = {
  "--featured-background":
    themeColors.background.primary,
  "--featured-accent":
    themeColors.brand.lime,
  "--featured-panel": "#08101F",
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
    shouldReduceMotion
      ? ["0%", "0%"]
      : ["-6%", "6%"],
  );

  const glowY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion
      ? ["0%", "0%"]
      : ["-20%", "20%"],
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
          className="absolute -right-40 top-1/4 h-[520px] w-[520px] rounded-full bg-[color:var(--featured-accent)]/[0.055] blur-[150px]"
        />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "88px 88px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-6 py-20 md:px-8 lg:py-32">
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
          className="group relative mx-auto max-w-7xl overflow-hidden rounded-[34px] border border-white/10 bg-[var(--featured-panel)] shadow-[0_40px_120px_rgba(0,0,0,0.45)]"
        >
          <div className="grid min-h-[720px] lg:grid-cols-[1.15fr_0.85fr]">
            <div className="relative min-h-[520px] overflow-hidden lg:min-h-full">
              <motion.div
                style={{
                  y: imageY,
                  scale: shouldReduceMotion
                    ? 1
                    : 1.08,
                }}
                className="absolute inset-0"
              >
                <Image
                  src={featuredPiece.image}
                  alt={`${featuredPiece.title} — ${featuredPiece.player}`}
                  fill
                  priority={false}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 58vw"
                  className={[
                    "object-cover object-center",
                    shouldReduceMotion
                      ? ""
                      : "transition duration-1000 group-hover:scale-[1.025]",
                  ].join(" ")}
                />
              </motion.div>

              <div className="absolute inset-0 bg-gradient-to-t from-[var(--featured-background)] via-transparent to-black/20 lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[var(--featured-panel)]" />

              <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-[var(--featured-background)] to-transparent lg:hidden" />

              <div className="absolute left-6 top-6 flex flex-wrap gap-3 md:left-8 md:top-8">
                <span className="rounded-full border border-[color:var(--featured-accent)]/25 bg-[color:var(--featured-accent)]/10 px-4 py-2 text-[8px] font-black uppercase tracking-[0.22em] text-[var(--featured-accent)] backdrop-blur-md">
                  {featuredPiece.rarity}
                </span>

                <span className="rounded-full border border-white/15 bg-black/20 px-4 py-2 text-[8px] font-black uppercase tracking-[0.22em] text-white backdrop-blur-md">
                  Authenticated archive
                </span>
              </div>

              <div className="absolute bottom-7 left-7 md:bottom-9 md:left-9">
                <p className="text-[8px] font-black uppercase tracking-[0.28em] text-white/50">
                  Archive number
                </p>

                <p className="mt-2 font-mono text-sm font-bold tracking-[0.2em] text-white">
                  {featuredPiece.archiveNumber}
                </p>
              </div>
            </div>

            <div className="relative flex flex-col justify-center px-7 py-14 md:px-12 lg:px-14 lg:py-20">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute right-0 top-0 text-[180px] font-black leading-none text-white/[0.018] md:text-[240px]"
              >
                01
              </div>

              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--featured-accent)]">
                  {featuredPiece.player}
                </p>

                <h3
                  id="featured-piece-title"
                  className="mt-6 max-w-xl text-4xl font-black leading-[0.95] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl"
                >
                  {featuredPiece.title}
                </h3>

                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-4">
                  <MetadataItem
                    label="Tournament"
                    value={featuredPiece.tournament}
                  />

                  <MetadataItem
                    label="Year"
                    value={featuredPiece.year}
                  />

                  <MetadataItem
                    label="Brand"
                    value={featuredPiece.brand}
                  />
                </div>

                <div
                  aria-hidden="true"
                  className="my-9 h-px bg-gradient-to-r from-white/15 to-transparent"
                />

                <p className="max-w-xl text-base leading-8 text-gray-400">
                  {featuredPiece.description}
                </p>

                <blockquote className="mt-8 border-l border-[color:var(--featured-accent)]/50 pl-6 text-sm italic leading-7 text-gray-500">
                  “Every garment preserves a moment. Every moment becomes part
                  of tennis history.”
                </blockquote>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <MuseumButton
                    href={`/product/${featuredPiece.id}`}
                    aria-label={`Explore ${featuredPiece.title}`}
                    icon="→"
                  >
                    Explore the piece
                  </MuseumButton>

                  <MuseumButton
                    href="/archive"
                    variant="secondary"
                  >
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

type MetadataItemProps = {
  label: string;
  value: string;
};

function MetadataItem({
  label,
  value,
}: MetadataItemProps) {
  return (
    <div>
      <p className="text-[8px] font-black uppercase tracking-[0.24em] text-gray-600">
        {label}
      </p>

      <p
        title={value}
        className="mt-2 text-xs font-bold uppercase tracking-[0.13em] text-white"
      >
        {value}
      </p>
    </div>
  );
}

export default memo(FeaturedPieces);