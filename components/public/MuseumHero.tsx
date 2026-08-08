"use client";

import Image from "next/image";
import Link from "next/link";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import type {
  PublicHomepageSettings,
} from "@/lib/repositories/public/homepage.repository";

const reveal = {
  hidden: {
    opacity: 0,
    y: 28,
  },

  visible: {
    opacity: 1,
    y: 0,
  },
};

type MuseumHeroProps = {
  settings: PublicHomepageSettings;
};

export default function MuseumHero({
  settings,
}: MuseumHeroProps) {
  return (
    <section className="relative min-h-[100svh] overflow-hidden border-b border-white/10">
      <Image
        src={settings.heroImage}
        alt="AGE202 Digital Tennis Museum"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[62%_center] sm:object-[58%_center] lg:object-center"
      />

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,8,18,.98)_0%,rgba(3,8,18,.94)_22%,rgba(3,8,18,.62)_47%,rgba(3,8,18,.12)_76%,rgba(3,8,18,.35)_100%)]" />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,8,18,.22)_0%,transparent_45%,rgba(3,8,18,.72)_100%)]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_32%,rgba(215,255,0,.11),transparent_31%)]" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1500px] items-center px-5 py-14 sm:px-8 lg:px-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={reveal}
          transition={{
            duration: 0.85,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="w-full max-w-[690px] pt-8 lg:pt-0"
        >
          <div className="mb-5 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.32em] text-[#d7ff00] sm:text-xs">
            <span className="h-px w-10 bg-[#d7ff00]" />

            {settings.heroEyebrow}
          </div>

          <h1 className="text-[clamp(4rem,8.4vw,8.4rem)] font-black uppercase leading-[0.78] tracking-[-0.07em] text-white">
            {settings.heroTitle}

            <br />

            <span className="text-[#d7ff00]">
              {settings.heroSubtitle}
            </span>
          </h1>

          <div className="mt-7 h-px w-14 bg-[#d7ff00]" />

          <p className="mt-6 max-w-lg text-sm leading-7 text-white/72 sm:text-base sm:leading-8">
            {settings.heroDescription}
          </p>

          <Link
            href={settings.heroCtaHref}
            className="group mt-8 inline-flex min-w-[220px] items-center justify-between gap-8 rounded-lg border border-[#d7ff00] bg-black/15 px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-white backdrop-blur transition hover:bg-[#d7ff00] hover:text-[#030812]"
          >
            {settings.heroCtaLabel}

            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </div>

      <div className="absolute bottom-5 right-6 hidden items-center gap-5 lg:flex">
        <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/70">
          {settings.museumTagline}
        </span>

        <span className="h-px w-10 bg-[#d7ff00]" />
      </div>

      <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col gap-3 2xl:flex">
        {[0, 1, 2, 3].map(
          (dot) => (
            <span
              key={dot}
              className={[
                "h-2 w-2 rounded-full",
                dot === 0
                  ? "bg-[#d7ff00]"
                  : "bg-white/40",
              ].join(" ")}
            />
          ),
        )}
      </div>
    </section>
  );
}