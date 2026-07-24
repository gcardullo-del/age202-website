"use client";

import { motion, useReducedMotion } from "framer-motion";

type DividerProps = {
  accent?: boolean;
  color?: string;
  className?: string;
};

export default function Divider({
  accent = false,
  color = "#C8FF00",
  className = "",
}: DividerProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className={[
        "relative h-px w-full overflow-hidden bg-white/10",
        className,
      ].join(" ")}
      aria-hidden="true"
    >
      {accent && (
        <motion.span
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  scaleX: 0,
                }
          }
          whileInView={{
            opacity: 1,
            scaleX: 1,
          }}
          viewport={{
            once: true,
            amount: 0.8,
          }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute left-0 top-0 h-px w-24 origin-left"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 20px ${color}`,
          }}
        />
      )}
    </div>
  );
}