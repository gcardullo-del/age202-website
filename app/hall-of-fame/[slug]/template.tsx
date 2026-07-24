"use client";

import type { ReactNode } from "react";

import { motion } from "framer-motion";

type HallOfFameTemplateProps = {
  children: ReactNode;
};

const transitionEase = [0.22, 1, 0.36, 1] as const;

export default function HallOfFameTemplate({
  children,
}: HallOfFameTemplateProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={{
        initial: {
          opacity: 0,
        },
        animate: {
          opacity: 1,
          transition: {
            duration: 0.55,
            ease: transitionEase,
            when: "beforeChildren",
          },
        },
        exit: {
          opacity: 0,
          transition: {
            duration: 0.28,
            ease: transitionEase,
          },
        },
      }}
      className="relative min-h-screen bg-[#050B18]"
    >
      <motion.div
        aria-hidden="true"
        initial={{
          scaleY: 1,
        }}
        animate={{
          scaleY: 0,
        }}
        transition={{
          duration: 1.05,
          ease: transitionEase,
        }}
        className="pointer-events-none fixed inset-0 z-[100] origin-top bg-[#030711]"
      />

      <motion.div
        aria-hidden="true"
        initial={{
          scaleX: 0,
          opacity: 1,
        }}
        animate={{
          scaleX: 1,
          opacity: 0,
        }}
        transition={{
          scaleX: {
            duration: 0.95,
            delay: 0.08,
            ease: transitionEase,
          },
          opacity: {
            duration: 0.28,
            delay: 0.72,
            ease: "easeOut",
          },
        }}
        className="pointer-events-none fixed left-0 top-0 z-[101] h-[2px] w-full origin-left bg-gradient-to-r from-transparent via-white to-transparent"
      />

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
          filter: "blur(10px)",
        }}
        animate={{
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
        }}
        transition={{
          duration: 0.85,
          delay: 0.22,
          ease: transitionEase,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}