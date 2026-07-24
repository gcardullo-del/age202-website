"use client";

import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
} from "framer-motion";
import type { ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  accent?: string;
  hover?: boolean;
  animated?: boolean;
  className?: string;
} & Omit<
  HTMLMotionProps<"div">,
  "children" | "className"
>;

export default function GlassCard({
  children,
  accent = "#C8FF00",
  hover = true,
  animated = true,
  className = "",
  ...props
}: GlassCardProps) {
  const shouldReduceMotion = useReducedMotion();

  const entranceEnabled =
    animated && !shouldReduceMotion;

  return (
    <motion.div
      initial={
        entranceEnabled
          ? {
              opacity: 0,
              y: 28,
            }
          : false
      }
      whileInView={
        entranceEnabled
          ? {
              opacity: 1,
              y: 0,
            }
          : undefined
      }
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={[
        "group relative isolate overflow-hidden",
        "rounded-2xl border border-white/10",
        "bg-white/[0.025] backdrop-blur-xl",
        hover
          ? [
              "transition duration-500",
              "hover:-translate-y-1",
              "hover:border-white/20",
              "hover:bg-white/[0.04]",
            ].join(" ")
          : "",
        className,
      ].join(" ")}
      {...props}
    >
      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute -right-20 -top-20",
          "h-52 w-52 rounded-full blur-[90px]",
          "opacity-0 transition duration-700",
          hover ? "group-hover:opacity-20" : "",
        ].join(" ")}
        style={{
          backgroundColor: accent,
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />

      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}