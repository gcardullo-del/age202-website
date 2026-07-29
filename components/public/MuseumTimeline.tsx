"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const moments = [
  {
    year: "1968",
    title: "The Open Era",
    text: "The modern professional age of tennis begins.",
  },
  {
    year: "1988",
    title: "Golden Slam",
    text: "A season that redefined the limits of achievement.",
  },
  {
    year: "2003",
    title: "A new champion",
    text: "Federer wins his first Wimbledon singles crown.",
  },
  {
    year: "2008",
    title: "Centre Court epic",
    text: "One of the most celebrated finals in tennis history.",
  },
  {
    year: "2024",
    title: "The new generation",
    text: "A changing of the guard becomes visible.",
  },
];

export default function MuseumTimeline() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.28em] text-[#ccff00]">
            Museum timeline
          </p>

          <h2 className="mt-4 text-4xl font-black uppercase tracking-[-.045em] sm:text-6xl">
            The game through time
          </h2>
        </div>

        <p className="max-w-md text-base leading-7 text-slate-400">
          A visual path through eras, turning points and moments that shaped
          the culture surrounding every artifact.
        </p>
      </div>

      <div className="relative mt-16">
        <div className="absolute bottom-0 left-[7px] top-0 w-px bg-white/15 md:left-0 md:right-0 md:top-[7px] md:h-px md:w-auto" />

        <div className="grid gap-10 md:grid-cols-5 md:gap-5">
          {moments.map((moment, index) => (
            <motion.article
              key={moment.year}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
              }}
              className="relative pl-10 md:pl-0 md:pt-10"
            >
              <span className="absolute left-0 top-1 h-[15px] w-[15px] rounded-full border-4 border-[#050b18] bg-[#ccff00] shadow-[0_0_16px_rgba(204,255,0,.45)] md:top-0" />

              <p className="text-3xl font-black tracking-[-.04em] text-[#ccff00]">
                {moment.year}
              </p>

              <h3 className="mt-3 text-lg font-black uppercase tracking-[-.02em]">
                {moment.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                {moment.text}
              </p>
            </motion.article>
          ))}
        </div>
      </div>

      <Link
        href="/results/grand-slams"
        className="mt-14 inline-flex items-center gap-3 rounded-full border border-white/15 px-6 py-3 text-xs font-bold uppercase tracking-[.18em] transition hover:border-[#ccff00] hover:text-[#ccff00]"
      >
        Explore tennis history
        <ArrowRight size={15} aria-hidden="true" />
      </Link>
    </section>
  );
}