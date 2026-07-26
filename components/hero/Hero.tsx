"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import HeroBackground from "./HeroBackground";
import { heroSlides } from "@/data/heroSlides";

const SLIDE_DURATION = 12_000;

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (heroSlides.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setCurrentSlide((previousSlide) => {
        return (previousSlide + 1) % heroSlides.length;
      });
    }, SLIDE_DURATION);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const slide = heroSlides[currentSlide];

  if (!slide) {
    return null;
  }

  const archiveHref = `/archives/${slide.player
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")}`;

  return (
    <section
      aria-label="AGE202 featured collections"
      className="relative isolate flex min-h-[calc(100svh-96px)] overflow-hidden bg-[#050b18]"
    >
      <HeroBackground image={slide.image} />

      <div className="absolute inset-0 bg-gradient-to-r from-[#050b18]/95 via-[#050b18]/72 to-[#050b18]/15" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050b18]/85 via-transparent to-[#050b18]/20" />

      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative z-10 flex w-full items-center"
        >
          <div className="mx-auto w-full max-w-[1480px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
            <span
              className="inline-flex rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] sm:text-xs"
              style={{
                color: slide.accent,
                borderColor: slide.accent,
              }}
            >
              {slide.player} Collection
            </span>

            <h1 className="mt-7 max-w-5xl text-[clamp(3.5rem,8vw,8.5rem)] font-black uppercase leading-[0.84] tracking-[-0.065em] text-white sm:mt-8">
              {slide.title}
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-white/65 sm:mt-8 sm:text-lg sm:leading-9 lg:text-xl">
              {slide.description}
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:mt-12 sm:flex-row sm:flex-wrap sm:gap-5">
              <Link
                href={archiveHref}
                className="inline-flex min-h-14 items-center justify-center rounded-full px-7 py-4 text-sm font-black uppercase tracking-[0.08em] text-black transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_35px_rgba(200,255,0,.25)] sm:px-8"
                style={{
                  backgroundColor: slide.accent,
                }}
              >
                Explore archive
                <span className="ml-3" aria-hidden="true">
                  →
                </span>
              </Link>

              <Link
                href="/vault"
                className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/20 px-7 py-4 text-sm font-bold uppercase tracking-[0.08em] text-white transition duration-300 hover:-translate-y-0.5 hover:border-[#c8ff00] hover:text-[#c8ff00] sm:px-8"
              >
                The Vault
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {heroSlides.length > 1 && (
        <div
          className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 sm:bottom-9"
          aria-label="Select featured collection"
        >
          {heroSlides.map((heroSlide, index) => {
            const active = currentSlide === index;

            return (
              <button
                key={heroSlide.id}
                type="button"
                onClick={() => setCurrentSlide(index)}
                aria-label={`Show ${heroSlide.player} collection`}
                aria-current={active ? "true" : undefined}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  active
                    ? "w-10 bg-[#c8ff00]"
                    : "w-2.5 bg-white/35 hover:bg-white/70"
                }`}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}