"use client";

import { motion, useReducedMotion } from "framer-motion";

type SectionNumberProps = {
  value: number | string;
  color?: string;
  position?: "left" | "right";
  className?: string;
};

export default function SectionNumber({
  value,
  color,
  position = "right",
  className = "",
}: SectionNumberProps) {
  const shouldReduceMotion = useReducedMotion();

  const formattedValue =
    typeof value === "number"
      ? String(value).padStart(2, "0")
      : value;

  return (
    <motion.span
      aria-hidden="true"
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              y: 24,
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
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={[
        "pointer-events-none absolute top-0 select-none",
        "text-[150px] font-black leading-none tracking-[-0.1em]",
        "text-white/[0.025]",
        "sm:text-[200px] lg:text-[260px]",
        position === "right"
          ? "-right-3 sm:-right-6"
          : "-left-3 sm:-left-6",
        className,
      ].join(" ")}
      style={
        color
          ? {
              color: `${color}0D`,
            }
          : undefined
      }
    >
      {formattedValue}
    </motion.span>
  );
}