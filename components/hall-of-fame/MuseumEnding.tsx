"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { PlayerProfile } from "@/data/players";

type Props = {
  player: PlayerProfile;
};

const fade = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8 },
  },
};

export default function MuseumEnding({ player }: Props) {
  const accent = player.theme.accent;

  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-[#02050C] py-28 md:py-40">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, white 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />

      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[180px]"
        style={{ background: player.theme.glow, opacity: 0.08 }}
      />

      <div className="relative mx-auto max-w-7xl px-6 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fade}
        >
          <p
            className="text-[11px] font-black uppercase tracking-[0.4em]"
            style={{ color: accent }}
          >
            AGE202 Digital Museum
          </p>

          <h2 className="mt-8 text-5xl font-black tracking-[-0.06em] text-white md:text-8xl">
            THANK YOU
            <span className="block text-white/20">
              FOR VISITING
            </span>
          </h2>

          <p className="mx-auto mt-10 max-w-3xl text-lg leading-9 text-white/55">
            You have reached the end of the{" "}
            <span style={{ color: accent }}>
              {player.name}
            </span>{" "}
            exhibition.
          </p>

          <blockquote className="mx-auto mt-16 max-w-4xl">
            <p className="text-2xl italic leading-relaxed text-white/90 md:text-4xl">
              “{player.signature}”
            </p>

            <footer
              className="mt-6 text-xs font-black uppercase tracking-[0.35em]"
              style={{ color: accent }}
            >
              {player.name}
            </footer>
          </blockquote>

          <div className="mt-20 flex flex-col items-center justify-center gap-5 md:flex-row">
            <Link
              href="/hall-of-fame"
              className="rounded-full border border-white/15 bg-white/5 px-8 py-4 text-xs font-black uppercase tracking-[0.28em] text-white transition hover:border-white/40 hover:bg-white/10"
            >
              Hall of Fame
            </Link>

            <Link
              href="/archives"
              className="rounded-full px-8 py-4 text-xs font-black uppercase tracking-[0.28em] text-black transition hover:scale-105"
              style={{ backgroundColor: accent }}
            >
              Museum Collections
            </Link>

            <Link
              href="/"
              className="rounded-full border border-white/15 bg-white/5 px-8 py-4 text-xs font-black uppercase tracking-[0.28em] text-white transition hover:border-white/40 hover:bg-white/10"
            >
              Back Home
            </Link>
          </div>

          <div className="mt-24 border-t border-white/10 pt-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-white/30">
              Every jersey tells a story.
              Every story becomes history.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}