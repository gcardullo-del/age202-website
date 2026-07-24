"use client";

import {
  motion,
  useReducedMotion,
} from "framer-motion";

type StatProps = {
  label: string;
  value: string | number;
  description?: string;
  accent?: string;
  align?: "left" | "center";
  className?: string;
};

export default function Stat({
  label,
  value,
  description,
  accent = "#C8FF00",
  align = "left",
  className = "",
}: StatProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              y: 20,
            }
      }
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.6,
      }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={[
        "group relative overflow-hidden",
        "border border-white/10 bg-white/[0.02]",
        "px-6 py-7 transition duration-500",
        "hover:border-white/20 hover:bg-white/[0.035]",
        align === "center"
          ? "text-center"
          : "text-left",
        className,
      ].join(" ")}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full opacity-0 blur-[45px] transition duration-500 group-hover:opacity-25"
        style={{
          backgroundColor: accent,
        }}
      />

      <p className="relative z-10 text-[8px] font-black uppercase tracking-[0.24em] text-white/30">
        {label}
      </p>

      <p className="relative z-10 mt-4 text-2xl font-black uppercase tracking-[-0.03em] text-white sm:text-3xl">
        {value}
      </p>

      {description && (
        <p className="relative z-10 mt-3 text-xs leading-6 text-white/35">
          {description}
        </p>
      )}

      <span
        aria-hidden="true"
        className={[
          "absolute bottom-0 h-px w-0",
          "transition-all duration-500",
          "group-hover:w-full",
          align === "center"
            ? "left-1/2 -translate-x-1/2"
            : "left-0",
        ].join(" ")}
        style={{
          backgroundColor: accent,
          boxShadow: `0 0 18px ${accent}`,
        }}
      />
    </motion.div>
  );
}