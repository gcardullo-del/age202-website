"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function ExhibitionEnding() {
  return (
    <section className="relative isolate overflow-hidden border-t border-white/10 bg-[#030812] py-28 sm:py-36 lg:py-48">
      {/* AMBIENT LIGHT */}

      <div className="pointer-events-none absolute inset-0 -z-20">
        <div className="absolute left-1/2 top-1/2 h-[680px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C8FF00]/[0.055] blur-[220px]" />

        <div className="absolute -bottom-80 left-1/2 h-[620px] w-[1000px] -translate-x-1/2 rounded-[50%] bg-blue-500/[0.035] blur-[210px]" />
      </div>

      {/* MUSEUM GRID */}

      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:90px_90px] opacity-30" />

      {/* LARGE BACKGROUND WORDMARK */}

      <motion.p
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          duration: 1.4,
          ease: [0.22, 1, 0.36, 1],
        }}
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[34vw] font-black leading-none tracking-[-0.12em] text-white/[0.018] sm:text-[29vw] lg:text-[23vw]"
      >
        AGE202
      </motion.p>

      {/* TOP LABEL */}

      <div className="relative mx-auto w-full max-w-[1450px] px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto h-px max-w-5xl origin-center bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{
            duration: 0.8,
            delay: 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-4">
            <span className="h-px w-10 bg-[#C8FF00]/70" />

            <p className="text-[9px] font-black uppercase tracking-[0.42em] text-[#C8FF00] sm:text-[10px]">
              End of Exhibition
            </p>

            <span className="h-px w-10 bg-[#C8FF00]/70" />
          </div>
        </motion.div>

        {/* MAIN MESSAGE */}

        <div className="mx-auto mt-12 max-w-6xl text-center sm:mt-16">
          <motion.h2
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 1,
              delay: 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-[clamp(3.3rem,8.5vw,8.8rem)] font-black leading-[0.82] tracking-[-0.075em] text-white"
          >
            Legends leave
            <span className="block text-white/35">
              the court.
            </span>

            <span className="mt-4 block">
              Their legacy
            </span>

            <span className="block text-[#C8FF00]">
              remains.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.85,
              delay: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mx-auto mt-10 max-w-2xl text-base leading-8 text-white/48 sm:mt-12 sm:text-lg sm:leading-9"
          >
            Every garment, every match and every defining memory becomes part
            of a living archive dedicated to preserving tennis history.
          </motion.p>
        </div>

        {/* ARCHIVE CTA */}

        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.85,
            delay: 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-12 flex justify-center sm:mt-16"
        >
          <Link
            href="/archive"
            className="group relative inline-flex min-h-20 items-center gap-8 overflow-hidden rounded-full border border-[#C8FF00]/35 bg-[#C8FF00] px-8 text-black shadow-[0_22px_80px_rgba(200,255,0,0.14)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_110px_rgba(200,255,0,0.24)] sm:px-10"
          >
            <span className="pointer-events-none absolute inset-0 translate-y-full bg-white transition-transform duration-500 group-hover:translate-y-0" />

            <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.32em] sm:text-xs">
              Explore the Archive
            </span>

            <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-black/15 bg-black text-xl text-[#C8FF00] transition-all duration-500 group-hover:-rotate-12 group-hover:bg-[#050B18]">
              →
            </span>
          </Link>
        </motion.div>

        {/* MUSEUM MANIFESTO */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.85,
            delay: 0.48,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto mt-20 grid max-w-5xl gap-px overflow-hidden rounded-[28px] border border-white/10 bg-white/10 sm:grid-cols-3 lg:mt-28"
        >
          <ManifestoItem
            number="01"
            title="Preserve"
            description="Protecting the apparel and visual identity of the game."
          />

          <ManifestoItem
            number="02"
            title="Document"
            description="Connecting every piece to a player, season and moment."
          />

          <ManifestoItem
            number="03"
            title="Remember"
            description="Keeping tennis culture accessible for future generations."
          />
        </motion.div>

        {/* FOOTNOTE */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 1,
            delay: 0.55,
          }}
          className="mt-20 sm:mt-28"
        >
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

          <div className="mt-8 flex flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.34em] text-white/65">
                AGE202
              </p>

              <p className="mt-2 text-[8px] font-bold uppercase tracking-[0.28em] text-white/28">
                Digital Museum of Tennis Apparel
              </p>
            </div>

            <p className="max-w-md text-[9px] font-bold uppercase leading-5 tracking-[0.22em] text-white/28 sm:text-right">
              Preserving the garments that witnessed tennis history.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

type ManifestoItemProps = {
  number: string;
  title: string;
  description: string;
};

function ManifestoItem({
  number,
  title,
  description,
}: ManifestoItemProps) {
  return (
    <div className="group relative min-h-[210px] overflow-hidden bg-[#07101F]/90 p-7 backdrop-blur-xl transition-colors duration-500 hover:bg-[#0A1628] sm:p-8">
      <div className="absolute right-5 top-3 text-7xl font-black tracking-[-0.08em] text-white/[0.025] transition-colors duration-500 group-hover:text-[#C8FF00]/[0.06]">
        {number}
      </div>

      <p className="relative text-[9px] font-black uppercase tracking-[0.35em] text-[#C8FF00]">
        Principle {number}
      </p>

      <h3 className="relative mt-8 text-2xl font-black tracking-[-0.04em] text-white">
        {title}
      </h3>

      <p className="relative mt-4 max-w-xs text-sm leading-7 text-white/42">
        {description}
      </p>

      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#C8FF00] transition-all duration-700 group-hover:w-full" />
    </div>
  );
}