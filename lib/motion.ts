import type { Transition, Variants } from "framer-motion";

export const museumTransition: Transition = {
  duration: 0.8,
  ease: [0.22, 1, 0.36, 1],
};

export const fastTransition: Transition = {
  duration: 0.3,
  ease: "easeOut",
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

export const revealUp: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: museumTransition,
  },
};

export const revealScale: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: museumTransition,
  },
};

export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: museumTransition,
  },
};

export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    filter: "blur(10px)",
  },
  animate: {
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    filter: "blur(8px)",
    transition: {
      duration: 0.35,
    },
  },
};