"use client";

import {
  motion,
  useReducedMotion,
} from "framer-motion";

import type {
  PropsWithChildren,
} from "react";

import {
  museumTransition,
} from "@/lib/motion";

type RevealProps = PropsWithChildren<{
  delay?: number;
  className?: string;
}>;

export default function Reveal({
  children,
  delay = 0,
  className,
}: RevealProps) {
  const shouldReduceMotion =
    useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              y: 60,
            }
      }
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        ...museumTransition,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}