"use client";

import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

const brands = [
  {
    name: "Nike",
    description: "Innovation • Legacy",
    founded: "1971",
    country: "United States",
    accent: "bg-[#C8FF00]",
  },
  {
    name: "Adidas",
    description: "Performance • Heritage",
    founded: "1949",
    country: "Germany",
    accent: "bg-white",
  },
  {
    name: "On",
    description: "Swiss Precision",
    founded: "2010",
    country: "Switzerland",
    accent: "bg-cyan-300",
  },
  {
    name: "Asics",
    description: "Japanese Craftsmanship",
    founded: "1949",
    country: "Japan",
    accent: "bg-blue-400",
  },
] as const;

function FeaturedBrands() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="featured-brands-heading"
      className="relative overflow-hidden border-y border-white/10 bg-[#050B18] py-24 sm:py-28 lg:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-1/2 top-0 h-[520px] w-[760px] -translate-x-1/2 rounded-full bg-[#C8FF00]/[0.035] blur-[160px]" />

        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "96px 96px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <header className="mx-auto max-w-3xl text-center">
          <div className="flex items-center justify-center gap-4">
            <span
              aria-hidden="true"
              className="h-px w-10 bg-[#C8FF00]"
            />

            <p className="text-[10px] font-black uppercase tracking-[0.34em] text-[#C8FF00]">
              Curated brands
            </p>

            <span
              aria-hidden="true"
              className="h-px w-10 bg-[#C8FF00]"
            />
          </div>

          <h2
            id="featured-brands-heading"
            className="mt-6 text-4xl font-black tracking-[-0.045em] text-white sm:text-5xl lg:text-7xl"
          >
            The brands behind
            <span className="block text-white/25">
              the legends.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-sm leading-7 text-gray-500 sm:text-base sm:leading-8">
            Discover the brands that shaped generations of champions and
            became part of tennis history through innovation, craftsmanship
            and unmistakable design.
          </p>
        </header>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 28,
                    }
              }
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.3,
              }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : {
                      duration: 0.7,
                      delay: index * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }
              }
            >
              <Link
                href="/brands"
                aria-label={`View the ${brand.name} archive`}
                className={[
                  "group relative flex min-h-[360px] flex-col overflow-hidden",
                  "rounded-[30px] border border-white/10 bg-[#08101F] p-8",
                  "shadow-[0_25px_70px_rgba(0,0,0,0.24)]",
                  "transition duration-500",
                  "hover:border-white/20 hover:shadow-[0_32px_90px_rgba(0,0,0,0.38)]",
                  "focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-[#C8FF00] focus-visible:ring-offset-4",
                  "focus-visible:ring-offset-[#050B18]",
                  shouldReduceMotion
                    ? ""
                    : "hover:-translate-y-1 hover:scale-[1.015]",
                ].join(" ")}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-5 top-3 select-none text-[82px] font-black uppercase leading-none tracking-[-0.08em] text-white/[0.025] transition duration-500 group-hover:text-white/[0.045]"
                >
                  {brand.name}
                </span>

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/0 blur-[70px] transition duration-500 group-hover:bg-white/[0.025]"
                />

                <div className="relative z-10 flex h-full flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-[8px] font-black uppercase tracking-[0.26em] text-white/30">
                      Sportswear archive
                    </p>

                    <span className="font-mono text-[9px] tracking-[0.22em] text-white/20">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="mt-14">
                    <h3 className="text-4xl font-black tracking-[-0.055em] text-white transition-colors duration-300 group-hover:text-[#C8FF00]">
                      {brand.name}
                    </h3>

                    <div className="mt-6 h-px overflow-hidden bg-white/10">
                      <span
                        aria-hidden="true"
                        className={[
                          "block h-full w-12 origin-left transition-transform duration-500",
                          brand.accent,
                          shouldReduceMotion
                            ? ""
                            : "group-hover:scale-x-[4]",
                        ].join(" ")}
                      />
                    </div>

                    <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.22em] text-gray-500">
                      {brand.description}
                    </p>
                  </div>

                  <dl className="mt-auto grid grid-cols-2 gap-6 border-t border-white/10 pt-7">
                    <div>
                      <dt className="text-[8px] font-black uppercase tracking-[0.22em] text-white/25">
                        Origin
                      </dt>

                      <dd className="mt-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                        {brand.country}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-[8px] font-black uppercase tracking-[0.22em] text-white/25">
                        Founded
                      </dt>

                      <dd className="mt-2 font-mono text-[10px] tracking-[0.16em] text-white">
                        {brand.founded}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                    <span className="text-[9px] font-black uppercase tracking-[0.24em] text-[#C8FF00]">
                      View collection
                    </span>

                    <span
                      aria-hidden="true"
                      className={
                        shouldReduceMotion
                          ? "text-[#C8FF00]"
                          : "text-[#C8FF00] transition-transform duration-300 group-hover:translate-x-1"
                      }
                    >
                      →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-600">
            AGE202 Brand Hall
          </p>

          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/25">
            Heritage · Innovation · Performance
          </p>
        </div>
      </div>
    </section>
  );
}

export default memo(FeaturedBrands);