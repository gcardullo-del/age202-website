"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import HeroBackground from "./HeroBackground";
import { heroSlides } from "@/data/heroSlides";

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const slide = heroSlides[currentSlide];

  return (
    <section className="relative h-screen overflow-hidden">

      <HeroBackground image={slide.image} />

      <div className="absolute inset-0 bg-gradient-to-r from-[#050B18]/96 via-[#050B18]/70 to-transparent" />

<div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 flex h-full items-center"
        >
          <div className="mx-auto w-full max-w-7xl px-8">

            <span
              className="inline-flex rounded-full border px-4 py-2 text-sm font-bold uppercase tracking-[0.3em]"
              style={{
                color: slide.accent,
                borderColor: slide.accent,
              }}
            >
              {slide.player} Collection
            
            </span>

            <h1 className="mt-8 max-w-4xl text-6xl font-black leading-none text-white lg:text-8xl">
              {slide.title}
            </h1>

            <p className="mt-8 max-w-2xl text-xl leading-9 text-gray-300">
              {slide.description}
            </p>

            <div className="mt-12 flex flex-wrap gap-5">

              <Link
  href={`/archives/${slide.player.toLowerCase()}`}
  className="rounded-full px-8 py-4 font-bold text-black transition-all duration-300 hover:scale-105 hover:shadow-[0_0_35px_rgba(200,255,0,.30)]"
  style={{
    backgroundColor: slide.accent,
  }}
>
  Explore Archive →
</Link>

              <Link
                href="/vault"
                className="rounded-full border border-white/20 px-8 py-4 font-semibold text-white transition-all duration-300 hover:border-[#C8FF00] hover:text-[#C8FF00]"
              >
                The Vault
              </Link>

            </div>

          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 gap-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-3 rounded-full transition-all duration-300 ${
              currentSlide === index
                ? "w-10 bg-[#C8FF00]"
                : "w-3 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

    </section>
  );
}