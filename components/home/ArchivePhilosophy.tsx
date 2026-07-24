"use client";

import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

function ArchivePhilosophy() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="archive-philosophy-heading"
      className="relative overflow-hidden bg-[#050B18] py-24 sm:py-28 lg:py-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-1/2 top-0 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-[#C8FF00]/[0.03] blur-[170px]" />

        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.65) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.65) 1px, transparent 1px)",
            backgroundSize: "96px 96px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
          <motion.div
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 32,
                  }
            }
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.25,
            }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : {
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1],
                  }
            }
          >
            <div className="flex items-center gap-4">
              <span
                aria-hidden="true"
                className="h-px w-10 bg-[#C8FF00]"
              />

              <p className="text-[10px] font-black uppercase tracking-[0.34em] text-[#C8FF00]">
                Archive philosophy
              </p>
            </div>

            <h2
              id="archive-philosophy-heading"
              className="mt-8 text-5xl font-black leading-[0.95] tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl"
            >
              We don&apos;t collect
              <span className="block text-white/25">
                clothing.
              </span>

              <span className="mt-6 block">
                We preserve moments.
              </span>
            </h2>

            <p className="mt-10 max-w-2xl text-base leading-8 text-gray-400 sm:text-lg sm:leading-9">
              Every shirt, jacket and training piece represents a chapter in
              tennis history. AGE202 exists to preserve those moments,
              documenting the garments worn by the sport&apos;s greatest
              champions and transforming them into a living digital archive.
            </p>

            <p className="mt-7 max-w-2xl text-base leading-8 text-gray-500">
              More than a collection, it is a museum dedicated to the stories,
              emotions and unforgettable eras that shaped the game.
            </p>

            <Link
              href="/about"
              className={[
                "mt-12 inline-flex min-h-14 items-center gap-4 rounded-full",
                "bg-[#C8FF00] px-8",
                "text-[10px] font-black uppercase tracking-[0.22em] text-black",
                "transition duration-300",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-[#C8FF00] focus-visible:ring-offset-4",
                "focus-visible:ring-offset-[#050B18]",
                shouldReduceMotion
                  ? ""
                  : "hover:scale-[1.03] hover:bg-white",
              ].join(" ")}
            >
              Discover AGE202
              <span aria-hidden="true">→</span>
            </Link>
          </motion.div>

          <motion.aside
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 32,
                  }
            }
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.25,
            }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : {
                    duration: 0.8,
                    delay: 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }
            }
            className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#08101F] p-8 shadow-[0_30px_90px_rgba(0,0,0,0.24)] sm:p-10 lg:rounded-[36px] lg:p-12"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-6 top-0 select-none text-[170px] font-black leading-none text-white/[0.02]"
            >
              A
            </span>

            <div className="relative">
              <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#C8FF00]">
                Museum manifesto
              </p>

              <blockquote className="mt-8 text-4xl font-black leading-tight tracking-[-0.04em] text-white sm:text-5xl">
                “Second Hand.
                <br />
                First Set.”
              </blockquote>

              <div className="my-10 h-px bg-gradient-to-r from-[#C8FF00]/60 to-transparent" />

              <p className="text-base leading-8 text-gray-400">
                Our mission is to preserve authentic tennis apparel as cultural
                artefacts, ensuring that every generation can rediscover the
                stories behind the sport&apos;s greatest victories.
              </p>

              <div className="mt-10 border-t border-white/10 pt-6">
                <p className="text-[9px] font-black uppercase tracking-[0.28em] text-gray-600">
                  AGE202 Digital Museum
                </p>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}

export default memo(ArchivePhilosophy);