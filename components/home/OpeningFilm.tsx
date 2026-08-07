"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowDown,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const scenes = [
  {
    kicker: "1877",
    title: "The game begins.",
    text: "Grass courts. Wooden racquets. A new sporting language takes shape.",
  },
  {
    kicker: "1968",
    title: "The Open Era.",
    text: "Tennis changes forever as generations of champions begin writing a modern history.",
  },
  {
    kicker: "The legends",
    title: "Greatness becomes identity.",
    text: "Style, rivalry, resilience and innovation transform champions into cultural icons.",
  },
  {
    kicker: "The rivalries",
    title: "Every era finds its opposite.",
    text: "Contrasting styles create unforgettable matches and define the moments people remember.",
  },
  {
    kicker: "The new era",
    title: "The story continues.",
    text: "A new generation inherits the game, accelerates it and begins writing its own chapter.",
  },
  {
    kicker: "AGE202",
    title: "Preserve the game.",
    text: "Every shirt holds a chapter. Every artifact preserves a moment. Welcome to the Digital Tennis Museum.",
  },
] as const;

const SCENE_DURATION = 4300;

export default function OpeningFilm() {
  const sectionRef =
    useRef<HTMLElement | null>(null);

  const isInView = useInView(
    sectionRef,
    {
      amount: 0.55,
    },
  );

  const shouldReduceMotion =
    useReducedMotion();

  const [
    activeScene,
    setActiveScene,
  ] = useState(0);

  const [
    isPlaying,
    setIsPlaying,
  ] = useState(true);

  const hasFinished =
    activeScene ===
    scenes.length - 1;

  const progress =
    useMemo(
      () =>
        ((activeScene + 1) /
          scenes.length) *
        100,
      [activeScene],
    );

  useEffect(() => {
    if (
      shouldReduceMotion ||
      !isInView ||
      !isPlaying
    ) {
      return;
    }

    const timer =
      window.setTimeout(() => {
        setActiveScene(
          (current) => {
            if (
              current >=
              scenes.length - 1
            ) {
              setIsPlaying(
                false,
              );

              return current;
            }

            return current + 1;
          },
        );
      }, SCENE_DURATION);

    return () => {
      window.clearTimeout(
        timer,
      );
    };
  }, [
    activeScene,
    isInView,
    isPlaying,
    shouldReduceMotion,
  ]);

  function restart() {
    setActiveScene(0);
    setIsPlaying(true);
  }

  function togglePlayback() {
    if (hasFinished) {
      restart();
      return;
    }

    setIsPlaying(
      (current) => !current,
    );
  }

  return (
    <section
      ref={sectionRef}
      id="opening-film"
      aria-labelledby="opening-film-title"
      className="relative min-h-[92svh] overflow-hidden border-y border-white/10 bg-[#02050c] text-white"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(200,255,0,0.075),transparent_34%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
          backgroundSize:
            "110px 110px",
        }}
      />

      <motion.div
        aria-hidden="true"
        animate={
          shouldReduceMotion
            ? undefined
            : {
                scale: [
                  1,
                  1.12,
                  1.02,
                ],
                opacity: [
                  0.35,
                  0.75,
                  0.4,
                ],
              }
        }
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C8FF00]/[0.035] blur-[180px]"
      />

      <div className="relative mx-auto flex min-h-[92svh] max-w-[1500px] flex-col px-5 py-8 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between gap-6 border-b border-white/10 pb-5">
          <div>
            <p className="font-mono text-[8px] font-bold uppercase tracking-[0.28em] text-[#C8FF00]">
              AGE202 Museum Film
            </p>

            <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.2em] text-white/25">
              The evolution of tennis
            </p>
          </div>

          <button
            type="button"
            onClick={
              togglePlayback
            }
            aria-label={
              hasFinished
                ? "Restart film"
                : isPlaying
                  ? "Pause film"
                  : "Play film"
            }
            className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-white/45 transition hover:border-[#C8FF00]/40 hover:text-[#C8FF00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8FF00]/45"
          >
            {hasFinished ? (
              <RotateCcw
                size={15}
                aria-hidden="true"
              />
            ) : isPlaying ? (
              <Pause
                size={15}
                aria-hidden="true"
              />
            ) : (
              <Play
                size={15}
                aria-hidden="true"
              />
            )}
          </button>
        </div>

        <div className="relative flex flex-1 items-center justify-center py-16 text-center">
          <AnimatePresence
            mode="wait"
          >
            <motion.div
              key={activeScene}
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 34,
                      filter:
                        "blur(14px)",
                    }
              }
              animate={{
                opacity: 1,
                y: 0,
                filter:
                  "blur(0px)",
              }}
              exit={
                shouldReduceMotion
                  ? undefined
                  : {
                      opacity: 0,
                      y: -26,
                      filter:
                        "blur(10px)",
                    }
              }
              transition={{
                duration: 1.15,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
              className="mx-auto max-w-5xl"
            >
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.38em] text-[#C8FF00] sm:text-xs">
                {
                  scenes[
                    activeScene
                  ].kicker
                }
              </p>

              <h2
                id="opening-film-title"
                className="mt-7 text-[clamp(3.6rem,8.5vw,8.6rem)] font-black uppercase leading-[0.78] tracking-[-0.075em]"
              >
                {
                  scenes[
                    activeScene
                  ].title
                }
              </h2>

              <p className="mx-auto mt-8 max-w-2xl text-sm leading-7 text-white/45 sm:text-base sm:leading-8">
                {
                  scenes[
                    activeScene
                  ].text
                }
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="border-t border-white/10 pt-5">
          <div className="flex items-center gap-5">
            <span className="w-10 font-mono text-[8px] text-white/25">
              {String(
                activeScene + 1,
              ).padStart(
                2,
                "0",
              )}
            </span>

            <div className="relative h-px flex-1 overflow-hidden bg-white/10">
              <motion.div
                className="absolute inset-y-0 left-0 bg-[#C8FF00]"
                animate={{
                  width: `${progress}%`,
                }}
                transition={{
                  duration: 0.8,
                  ease: [
                    0.22,
                    1,
                    0.36,
                    1,
                  ],
                }}
              />
            </div>

            <span className="w-10 text-right font-mono text-[8px] text-white/25">
              {String(
                scenes.length,
              ).padStart(
                2,
                "0",
              )}
            </span>
          </div>

          <div className="mt-5 flex items-center justify-between gap-6">
            <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/20">
              From origins to legacy
            </p>

            <a
              href="#museum-timeline"
              className="inline-flex items-center gap-2 font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-white/35 transition hover:text-[#C8FF00]"
            >
              Continue the story
              <ArrowDown
                size={12}
                aria-hidden="true"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}