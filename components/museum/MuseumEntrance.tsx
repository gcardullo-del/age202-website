"use client";

import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";

export default function MuseumEntrance() {
  const shouldReduceMotion = useReducedMotion();
  const [isOpening, setIsOpening] = useState(false);

  function scrollToMuseum() {
    const museumContent = document.getElementById("museum-content");

    museumContent?.scrollIntoView({
      behavior: shouldReduceMotion ? "auto" : "smooth",
      block: "start",
    });
  }

  function enterMuseum() {
    if (isOpening) return;

    if (shouldReduceMotion) {
      scrollToMuseum();
      return;
    }

    setIsOpening(true);

    window.setTimeout(() => {
      scrollToMuseum();
    }, 1500);

    window.setTimeout(() => {
      setIsOpening(false);
    }, 2600);
  }

  return (
    <>
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050B18] text-white">
        {/* BACKGROUND */}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(200,255,0,0.12),transparent_36%),linear-gradient(135deg,#081426_0%,#050B18_45%,#02050B_100%)]" />

        <div className="absolute inset-0 bg-[#050B18]/25" />

        <div className="absolute inset-0 bg-gradient-to-b from-[#050B18]/10 via-transparent to-[#050B18]" />

        <div className="absolute inset-0 bg-gradient-to-r from-[#050B18]/65 via-transparent to-[#050B18]/65" />

        {/* LIGHT BEAMS */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="pointer-events-none absolute left-[10%] top-[-30%] h-[110%] w-36 rotate-[18deg] bg-gradient-to-b from-[#C8FF00]/15 via-[#C8FF00]/[0.025] to-transparent blur-3xl"
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.3 }}
          className="pointer-events-none absolute right-[12%] top-[-30%] h-[110%] w-40 rotate-[-18deg] bg-gradient-to-b from-blue-400/10 via-blue-400/[0.02] to-transparent blur-3xl"
        />

        {/* GRID FLOOR */}

        <div
          className="pointer-events-none absolute bottom-0 left-1/2 h-[42%] w-[150%] -translate-x-1/2 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
            backgroundSize: "70px 70px",
            transform:
              "translateX(-50%) perspective(500px) rotateX(62deg) scale(1.4)",
            transformOrigin: "bottom",
          }}
        />

        {/* TENNIS BALL */}

        {!shouldReduceMotion && (
          <motion.div
            initial={{
              x: "-20vw",
              y: "20vh",
              opacity: 0,
              rotate: 0,
            }}
            animate={{
              x: ["-20vw", "12vw", "32vw", "60vw"],
              y: ["20vh", "-10vh", "5vh", "-18vh"],
              opacity: [0, 0.8, 0.6, 0],
              rotate: [0, 220, 520, 900],
            }}
            transition={{
              duration: 6,
              delay: 1.5,
              repeat: Infinity,
              repeatDelay: 4,
              ease: "easeInOut",
            }}
            className="pointer-events-none absolute left-0 top-1/2 z-[5] h-10 w-10 rounded-full bg-[#C8FF00] shadow-[0_0_55px_rgba(200,255,0,0.65)] md:h-14 md:w-14"
          >
            <span className="absolute left-[45%] top-0 h-full w-[2px] rotate-[25deg] rounded-full bg-black/25" />
          </motion.div>
        )}

        {/* TOP BAR */}

        <div className="absolute left-0 top-0 z-20 flex w-full items-center justify-between px-6 py-7 md:px-10">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/70">
            AGE202
          </p>

          <p className="hidden text-[9px] font-black uppercase tracking-[0.35em] text-white/35 sm:block">
            Digital Tennis Museum
          </p>

          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#C8FF00]">
            Est. 202
          </p>
        </div>

        {/* MAIN CONTENT */}

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-6 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1.2 }}
            className="mb-8 h-px w-24 origin-center bg-[#C8FF00]"
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[10px] font-black uppercase tracking-[0.55em] text-[#C8FF00] md:text-xs"
          >
            Welcome to AGE202
          </motion.p>

          <h1 className="mt-8 text-6xl font-black leading-[0.82] tracking-[-0.075em] md:text-8xl xl:text-[9.5rem]">
            <motion.span
              initial={{ opacity: 0, y: 45 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35 }}
              className="block"
            >
              DIGITAL
            </motion.span>

            <motion.span
              initial={{ opacity: 0, y: 45 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.5 }}
              className="block text-white/40"
            >
              TENNIS
            </motion.span>

            <motion.span
              initial={{ opacity: 0, y: 45 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.65 }}
              className="block"
            >
              MUSEUM
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-9 text-xs font-black uppercase tracking-[0.4em] text-white/55 md:text-sm"
          >
            Second Hand.
            <span className="ml-3 text-[#C8FF00]">First Set.</span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.15 }}
            className="mt-8 max-w-2xl text-sm leading-7 text-gray-400 md:text-lg md:leading-9"
          >
            Stories, legendary champions and collectible tennis apparel
            preserved inside one immersive digital archive.
          </motion.p>

          <motion.button
            type="button"
            onClick={enterMuseum}
            disabled={isOpening}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.35 }}
            whileHover={
              shouldReduceMotion || isOpening
                ? undefined
                : { scale: 1.03 }
            }
            whileTap={
              shouldReduceMotion || isOpening
                ? undefined
                : { scale: 0.98 }
            }
            className="group mt-12 inline-flex items-center gap-5 rounded-full border border-[#C8FF00]/70 bg-[#050B18]/30 px-7 py-5 text-[10px] font-black uppercase tracking-[0.32em] text-white backdrop-blur-xl transition-colors duration-500 hover:bg-[#C8FF00] hover:text-black disabled:cursor-wait disabled:opacity-60 md:px-9"
          >
            {isOpening ? "Opening museum" : "Enter the museum"}

            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C8FF00] text-base text-black transition-all duration-500 group-hover:translate-x-1 group-hover:bg-black group-hover:text-[#C8FF00]">
              ↓
            </span>
          </motion.button>
        </div>

        {/* SCROLL INDICATOR */}

        <motion.button
          type="button"
          onClick={enterMuseum}
          aria-label="Scroll to museum content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-3"
        >
          <span className="text-[8px] font-black uppercase tracking-[0.35em] text-white/35">
            Explore
          </span>

          <motion.span
            animate={shouldReduceMotion ? undefined : { y: [0, 7, 0] }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
            }}
            className="h-8 w-px bg-gradient-to-b from-[#C8FF00] to-transparent"
          />
        </motion.button>
      </section>

      <AnimatePresence>
        {isOpening && (
          <MuseumDoorTransition />
        )}
      </AnimatePresence>
    </>
  );
}

function MuseumDoorTransition() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-[999] overflow-hidden"
    >
      {/* LEFT DOOR */}

      <motion.div
        initial={{ x: "-100%" }}
        animate={{
          x: ["-100%", "0%", "0%", "-100%"],
        }}
        transition={{
          duration: 2.5,
          times: [0, 0.24, 0.58, 1],
          ease: [0.76, 0, 0.24, 1],
        }}
        className="absolute inset-y-0 left-0 w-1/2 border-r border-white/10 bg-[#030711]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(200,255,0,0.07),transparent_42%)]" />

        <div className="absolute right-10 top-1/2 h-20 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-[#C8FF00] to-transparent" />
      </motion.div>

      {/* RIGHT DOOR */}

      <motion.div
        initial={{ x: "100%" }}
        animate={{
          x: ["100%", "0%", "0%", "100%"],
        }}
        transition={{
          duration: 2.5,
          times: [0, 0.24, 0.58, 1],
          ease: [0.76, 0, 0.24, 1],
        }}
        className="absolute inset-y-0 right-0 w-1/2 border-l border-white/10 bg-[#030711]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(200,255,0,0.07),transparent_42%)]" />

        <div className="absolute left-10 top-1/2 h-20 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-[#C8FF00] to-transparent" />
      </motion.div>

      {/* CENTER LOGO */}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: [0, 0, 1, 1, 0],
          scale: [0.9, 0.9, 1, 1, 1.08],
        }}
        transition={{
          duration: 2.2,
          times: [0, 0.22, 0.4, 0.72, 1],
        }}
        className="absolute inset-0 z-10 flex items-center justify-center"
      >
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.55em] text-[#C8FF00]">
            AGE202
          </p>

          <p className="mt-5 text-4xl font-black tracking-[-0.06em] text-white md:text-7xl">
            THE MUSEUM
          </p>

          <div className="mx-auto mt-7 h-px w-28 bg-[#C8FF00]" />
        </div>
      </motion.div>
    </motion.div>
  );
}