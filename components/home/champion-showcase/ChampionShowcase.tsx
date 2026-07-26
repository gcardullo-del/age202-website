"use client";

import {
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  type FocusEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  GlowBackground,
  SectionHeader,
} from "@/components/museum-ui";

import ChampionDetails from "./ChampionDetails";
import ChampionImage from "./ChampionImage";
import ChampionNavigation from "./ChampionNavigation";
import type {
  ChampionDirection,
  ChampionShowcaseProps,
} from "./types";

const AUTOMATIC_ROTATION_DELAY = 9000;

export default function ChampionShowcase({
  champions,
  initialChampionId,
  className = "",
}: ChampionShowcaseProps) {
  const shouldReduceMotion = useReducedMotion();

  const initialIndex = useMemo(() => {
    if (!initialChampionId) {
      return 0;
    }

    const matchingIndex = champions.findIndex(
      (champion) =>
        champion.id === initialChampionId ||
        champion.slug === initialChampionId
    );

    return matchingIndex >= 0 ? matchingIndex : 0;
  }, [champions, initialChampionId]);

  const [activeIndex, setActiveIndex] =
    useState(initialIndex);

  const [direction, setDirection] =
    useState<ChampionDirection>(1);

  const [isPaused, setIsPaused] =
    useState(false);

  const activeChampion = champions[activeIndex];

  /*
   * Mantiene l’indice attivo sincronizzato quando cambia
   * la lista dei campioni o l’identificatore iniziale.
   */
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (champions.length === 0) {
        setActiveIndex(0);
        return;
      }

      setActiveIndex((currentIndex) =>
        currentIndex >= champions.length ? initialIndex : currentIndex
      );
    });

    return () => window.cancelAnimationFrame(frame);
  }, [champions.length, initialIndex]);

  const selectChampion = useCallback(
    (nextIndex: number) => {
      if (
        nextIndex < 0 ||
        nextIndex >= champions.length ||
        nextIndex === activeIndex
      ) {
        return;
      }

      setDirection(
        nextIndex > activeIndex ? 1 : -1
      );

      setActiveIndex(nextIndex);
    },
    [activeIndex, champions.length]
  );

  /*
   * L’inclusione di activeIndex nelle dipendenze fa ripartire
   * il timer dopo ogni cambio, anche quando la scelta è manuale.
   */
  useEffect(() => {
    if (
      shouldReduceMotion ||
      isPaused ||
      champions.length <= 1
    ) {
      return;
    }

    const interval = window.setInterval(() => {
      setDirection(1);

      setActiveIndex((currentIndex) =>
        currentIndex === champions.length - 1
          ? 0
          : currentIndex + 1
      );
    }, AUTOMATIC_ROTATION_DELAY);

    return () => {
      window.clearInterval(interval);
    };
  }, [
    activeIndex,
    champions.length,
    isPaused,
    shouldReduceMotion,
  ]);

  function handleFocusCapture() {
    setIsPaused(true);
  }

  function handleBlurCapture(
    event: FocusEvent<HTMLElement>
  ) {
    const nextFocusedElement =
      event.relatedTarget as Node | null;

    if (
      nextFocusedElement &&
      event.currentTarget.contains(
        nextFocusedElement
      )
    ) {
      return;
    }

    setIsPaused(false);
  }

  if (
    champions.length === 0 ||
    !activeChampion
  ) {
    return null;
  }

  return (
    <section
      aria-labelledby="champion-collections-title"
      className={[
        "relative overflow-hidden",
        "border-y border-white/10",
        "bg-[#050B18]",
        className,
      ].join(" ")}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={handleFocusCapture}
      onBlurCapture={handleBlurCapture}
    >
      <GlowBackground
        position="right"
        intensity="medium"
        grid
      />

      <motion.div
        key={`${activeChampion.id}-ambient-glow`}
        aria-hidden="true"
        className={[
          "pointer-events-none absolute",
          "right-[-220px] top-[18%]",
          "h-[680px] w-[680px]",
          "rounded-full blur-[210px]",
        ].join(" ")}
        initial={
          shouldReduceMotion
            ? false
            : {
                opacity: 0,
                scale: 0.9,
              }
        }
        animate={{
          opacity: 0.1,
          scale: 1,
        }}
        transition={{
          duration: shouldReduceMotion
            ? 0
            : 0.9,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          backgroundColor:
            activeChampion.accent,
        }}
      />

      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute",
          "left-[-280px] top-[35%]",
          "h-[560px] w-[560px]",
          "rounded-full bg-white/[0.025]",
          "blur-[190px]",
        ].join(" ")}
      />

      <div className="relative px-4 py-20 sm:px-6 md:px-8 lg:py-28 xl:px-10 2xl:px-14">
        <div className="mx-auto w-full max-w-[1840px]">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="Champion collections"
              title={
                <span
                  id="champion-collections-title"
                >
                  Five champions.
                  <span className="block text-white/25">
                    Five defining eras.
                  </span>
                </span>
              }
              description="Explore the champions who transformed tennis history and created some of the sport's most recognisable visual identities."
            />
          </div>

          <div className="mt-14 overflow-hidden rounded-[28px] border border-white/10 bg-[#07101F]/85 shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl lg:mt-20">
            <div className="grid min-h-[760px] lg:grid-cols-[minmax(440px,0.88fr)_minmax(620px,1.12fr)] xl:min-h-[820px] xl:grid-cols-[minmax(500px,0.82fr)_minmax(760px,1.18fr)]">
              <motion.div
                key={`${activeChampion.id}-details-panel`}
                initial={
                  shouldReduceMotion
                    ? false
                    : {
                        opacity: 0,
                        x: direction * -34,
                      }
                }
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: shouldReduceMotion
                    ? 0
                    : 0.62,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={[
                  "relative z-10",
                  "border-b border-white/10",
                  "bg-[#07101F]/95",
                  "lg:border-b-0 lg:border-r",
                ].join(" ")}
              >
                <ChampionDetails
                  champion={activeChampion}
                  activeIndex={activeIndex}
                />
              </motion.div>

              <motion.div
                key={`${activeChampion.id}-image-panel`}
                initial={
                  shouldReduceMotion
                    ? false
                    : {
                        opacity: 0,
                        x: direction * 28,
                      }
                }
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: shouldReduceMotion
                    ? 0
                    : 0.68,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative min-h-[620px] lg:min-h-full"
              >
                <ChampionImage
                  champion={activeChampion}
                  activeIndex={activeIndex}
                />
              </motion.div>
            </div>

            <ChampionNavigation
              champions={champions}
              activeIndex={activeIndex}
              onSelect={selectChampion}
            />
          </div>

          <div className="mt-7 flex flex-col gap-5 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.28em] text-white/25">
                AGE202 Hall of Champions
              </p>

              <p className="mt-2 max-w-lg text-xs leading-6 text-white/30">
                Five athletes, five visual
                identities and five chapters of
                modern tennis history.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor:
                    activeChampion.accent,
                  boxShadow: `0 0 18px ${activeChampion.accent}`,
                }}
              />

              <p
                aria-live="polite"
                className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/35"
              >
                Automatic rotation{" "}
                {isPaused ? "paused" : "active"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}