"use client";

import { motion, useReducedMotion } from "framer-motion";

type AccentLineProps = {
  color?: string;
  width?: number;
  animated?: boolean;
  className?: string;
};

export default function AccentLine({
  color = "#C8FF00",
  width = 48,
  animated = true,
  className = "",
}: AccentLineProps) {
  const shouldReduceMotion = useReducedMotion();

  if (!animated || shouldReduceMotion) {
    return (
      <span
        aria-hidden="true"
        className={[
          "block h-px shrink-0",
          className,
        ].join(" ")}
        style={{
          width,
          backgroundColor: color,
          boxShadow: `0 0 16px ${color}66`,
        }}
      />
    );
  }

  return (
    <motion.span
      aria-hidden="true"
      initial={{
        width: 0,
        opacity: 0,
      }}
      whileInView={{
        width,
        opacity: 1,
      }}
      viewport={{
        once: true,
        amount: 0.8,
      }}
      transition={{
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={[
        "block h-px shrink-0",
        className,
      ].join(" ")}
      style={{
        backgroundColor: color,
        boxShadow: `0 0 16px ${color}66`,
      }}
    />
  );
}