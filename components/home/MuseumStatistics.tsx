
"use client";

import { memo, useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";

import type { MuseumStatistic } from "@/data";
import { museumStatistics } from "@/data";
import {
  GlowBackground,
  MuseumPanel,
  SectionHeader,
} from "@/components/museum-ui";

function MuseumStatistics() {
  return (
    <section
      aria-labelledby="museum-statistics-heading"
      className="relative overflow-hidden border-y border-white/10 bg-[#050B18]"
    >
      <GlowBackground position="center" intensity="medium" grid />

      <div className="relative mx-auto max-w-7xl px-6 py-20 md:px-8 lg:py-28">
        <SectionHeader
          eyebrow="Museum in numbers"
          title={
            <>
              <span id="museum-statistics-heading">
                One collection.
              </span>
              <span className="block text-white/25">
                Countless stories.
              </span>
            </>
          }
          description="AGE202 documents the relationship between tennis history, legendary champions and the garments that defined their most recognisable eras."
        />

        <MuseumPanel className="mt-16 grid md:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {museumStatistics.map((statistic, index) => (
            <StatisticCard
              key={statistic.label}
              statistic={statistic}
              index={index}
            />
          ))}
        </MuseumPanel>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-600">
            AGE202 Digital Museum
          </p>

          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/25">
            Archive index · Updated collection
          </p>
        </div>
      </div>
    </section>
  );
}

type StatisticCardProps = {
  statistic: MuseumStatistic;
  index: number;
};

const StatisticCard = memo(function StatisticCard({
  statistic,
  index,
}: StatisticCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const isInView = useInView(cardRef, {
    once: true,
    amount: 0.45,
  });

  const isLastStatistic = index === museumStatistics.length - 1;

  return (
    <motion.div
      ref={cardRef}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : undefined}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : {
              duration: 0.75,
              delay: index * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }
      }
      className={[
        "group relative min-h-[330px] overflow-hidden p-7 md:p-9",
        !isLastStatistic ? "border-b border-white/10" : "",
        index === 0 || index === 1 ? "md:border-b md:border-white/10" : "md:border-b-0",
        index === 0 || index == 2 ? "md:border-r md:border-white/10" : "md:border-r-0",
        !isLastStatistic ? "lg:border-r lg:border-white/10" : "lg:border-r-0",
        "lg:border-b-0",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#C8FF00]/0 blur-[70px] transition duration-500 group-hover:bg-[#C8FF00]/[0.07]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.018] via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

      <p className="relative z-10 font-mono text-[9px] tracking-[0.22em] text-white/20">
        {String(index + 1).padStart(2, "0")}
      </p>

      <div className="relative z-10 mt-12 flex items-start">
        {statistic.prefix && (
          <span className="mt-3 text-xl font-black text-[#C8FF00]">
            {statistic.prefix}
          </span>
        )}

        <AnimatedCounter value={statistic.value} shouldStart={isInView} />

        {statistic.suffix && (
          <span className="mt-2 text-2xl font-black text-[#C8FF00] md:text-3xl">
            {statistic.suffix}
          </span>
        )}
      </div>

      <h3 className="relative z-10 mt-5 text-[10px] font-black uppercase tracking-[0.28em] text-white">
        {statistic.label}
      </h3>

      <p className="relative z-10 mt-6 text-sm leading-7 text-gray-500 transition duration-300 group-hover:text-gray-400">
        {statistic.description}
      </p>

      <div className="absolute inset-x-7 bottom-0 h-px bg-gradient-to-r from-transparent via-[#C8FF00]/0 to-transparent transition duration-500 group-hover:via-[#C8FF00]/60 md:inset-x-9" />
    </motion.div>
  );
});

type AnimatedCounterProps = {
  value: number;
  shouldStart: boolean;
  duration?: number;
};

function AnimatedCounter({
  value,
  shouldStart,
  duration = 1600,
}: AnimatedCounterProps) {
  const shouldReduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!shouldStart) return;
    if (shouldReduceMotion) {
      setDisplayValue(value);
      return;
    }

    let frame = 0;
    let start: number | null = null;

    const animate = (time: number) => {
      if (start === null) start = time;
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [duration, shouldReduceMotion, shouldStart, value]);

  return (
    <span
      aria-label={String(value)}
      className="text-6xl font-black leading-none tracking-[-0.07em] text-white md:text-7xl"
    >
      {displayValue}
    </span>
  );
}

export default memo(MuseumStatistics);