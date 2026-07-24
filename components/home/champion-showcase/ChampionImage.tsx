"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import {
  memo,
  type MouseEvent,
  useRef,
} from "react";

import type { ChampionComponentProps } from "./types";

function ChampionImage({
  champion,
  activeIndex,
}: ChampionComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const smoothPointerX = useSpring(pointerX, {
    stiffness: 90,
    damping: 24,
    mass: 0.8,
  });

  const smoothPointerY = useSpring(pointerY, {
    stiffness: 90,
    damping: 24,
    mass: 0.8,
  });

  const imagePointerX = useTransform(
    smoothPointerX,
    [-1, 1],
    shouldReduceMotion ? [0, 0] : [-7, 7]
  );

  const imagePointerY = useTransform(
    smoothPointerY,
    [-1, 1],
    shouldReduceMotion ? [0, 0] : [-5, 5]
  );

  const glowPointerX = useTransform(
    smoothPointerX,
    [-1, 1],
    shouldReduceMotion ? [0, 0] : [-20, 20]
  );

  const glowPointerY = useTransform(
    smoothPointerY,
    [-1, 1],
    shouldReduceMotion ? [0, 0] : [-14, 14]
  );

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const imageScrollY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? ["0%", "0%"] : ["-3%", "3%"]
  );

  const numberScrollY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [-18, 18]
  );

  function handlePointerMove(
    event: MouseEvent<HTMLDivElement>
  ) {
    if (
      shouldReduceMotion ||
      !containerRef.current
    ) {
      return;
    }

    const bounds =
      containerRef.current.getBoundingClientRect();

    const normalizedX =
      ((event.clientX - bounds.left) / bounds.width) *
        2 -
      1;

    const normalizedY =
      ((event.clientY - bounds.top) / bounds.height) *
        2 -
      1;

    pointerX.set(normalizedX);
    pointerY.set(normalizedY);
  }

  function resetPointerPosition() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handlePointerMove}
      onMouseLeave={resetPointerPosition}
      className="group relative isolate h-full min-h-[620px] overflow-hidden bg-[#030814] lg:min-h-[760px] xl:min-h-[820px]"
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={champion.id}
          className="absolute inset-0"
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  scale: 1.1,
                  filter: "blur(16px)",
                }
          }
          animate={{
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
          }}
          exit={
            shouldReduceMotion
              ? undefined
              : {
                  opacity: 0,
                  scale: 1.045,
                  filter: "blur(12px)",
                }
          }
          transition={{
            opacity: {
              duration: shouldReduceMotion ? 0 : 0.55,
              ease: [0.22, 1, 0.36, 1],
            },
            scale: {
              duration: shouldReduceMotion ? 0 : 1.15,
              ease: [0.22, 1, 0.36, 1],
            },
            filter: {
              duration: shouldReduceMotion ? 0 : 0.7,
              ease: [0.22, 1, 0.36, 1],
            },
          }}
        >
          <motion.div
            className="absolute -inset-x-4 -inset-y-[6%]"
            style={{
              x: imagePointerX,
              y: imageScrollY,
            }}
          >
            <motion.div
              className="relative h-full w-full"
              style={{
                y: imagePointerY,
              }}
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      scale: [1.015, 1.035, 1.015],
                    }
              }
              transition={{
                duration: shouldReduceMotion ? 0 : 14,
                repeat: shouldReduceMotion ? 0 : Infinity,
                ease: "easeInOut",
              }}
            >
              <Image
                src={champion.image}
                alt={`${champion.name} — ${champion.nickname}`}
                fill
                priority={activeIndex === 0}
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover object-[58%_center] transition-transform duration-[1800ms] ease-out group-hover:scale-[1.015]"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#030814] via-[#030814]/10 to-black/35"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#030814]/45 via-transparent to-black/15 lg:from-[#030814]/20"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,transparent_0%,transparent_34%,rgba(0,0,0,0.22)_70%,rgba(0,0,0,0.58)_100%)]"
      />

      <motion.div
        key={`${champion.id}-portrait-glow`}
        aria-hidden="true"
        className="pointer-events-none absolute right-[4%] top-[12%] h-[68%] w-[68%] rounded-full blur-[120px]"
        initial={
          shouldReduceMotion
            ? false
            : {
                opacity: 0,
                scale: 0.78,
              }
        }
        animate={{
          opacity: 0.18,
          scale: 1,
        }}
        transition={{
          duration: shouldReduceMotion ? 0 : 1.2,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          x: glowPointerX,
          y: glowPointerY,
          background: `radial-gradient(circle, ${champion.accent} 0%, ${champion.accent}55 32%, transparent 72%)`,
        }}
      />

      <motion.div
        key={`${champion.id}-lower-glow`}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[8%] bottom-[-18%] h-[42%] rounded-full blur-[100px]"
        initial={
          shouldReduceMotion
            ? false
            : {
                opacity: 0,
              }
        }
        animate={{
          opacity: 0.2,
        }}
        transition={{
          duration: shouldReduceMotion ? 0 : 1,
          delay: shouldReduceMotion ? 0 : 0.15,
        }}
        style={{
          backgroundColor: champion.accent,
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='.5'/%3E%3C/svg%3E\")",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
        }}
      />

      <div className="absolute left-6 top-6 z-20 sm:left-8 sm:top-8 lg:left-10 lg:top-10">
        <motion.div
          key={`${champion.id}-portrait-label`}
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  y: -12,
                }
          }
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.6,
            delay: shouldReduceMotion ? 0 : 0.25,
          }}
          className="flex items-center gap-3 rounded-full border border-white/15 bg-black/20 px-4 py-2.5 backdrop-blur-xl"
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor: champion.accent,
              boxShadow: `0 0 14px ${champion.accent}`,
            }}
          />

          <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-white/65">
            Champion portrait
          </p>
        </motion.div>
      </div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-5 top-[7%] z-10 text-[190px] font-black leading-none tracking-[-0.1em] text-white/[0.035] sm:text-[250px] lg:-right-8 lg:text-[320px] xl:text-[390px]"
        style={{
          y: numberScrollY,
        }}
      >
        {String(activeIndex + 1).padStart(2, "0")}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${champion.id}-image-information`}
          className="absolute inset-x-0 bottom-0 z-20"
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 28,
                }
          }
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={
            shouldReduceMotion
              ? undefined
              : {
                  opacity: 0,
                  y: 18,
                }
          }
          transition={{
            duration: shouldReduceMotion ? 0 : 0.65,
            delay: shouldReduceMotion ? 0 : 0.18,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="bg-gradient-to-t from-[#030814] via-[#030814]/85 to-transparent px-6 pb-7 pt-28 sm:px-8 sm:pb-9 lg:px-10 lg:pb-10 xl:px-12">
            <div className="border-t border-white/15 pt-6">
              <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span
                      className="h-px w-9"
                      style={{
                        backgroundColor: champion.accent,
                      }}
                    />

                    <p
                      className="text-[8px] font-black uppercase tracking-[0.3em]"
                      style={{
                        color: champion.accent,
                      }}
                    >
                      AGE202 collection
                    </p>
                  </div>

                  <h3 className="mt-4 text-2xl font-black uppercase tracking-[-0.035em] text-white sm:text-3xl xl:text-4xl">
                    {champion.name}
                  </h3>

                  <p className="mt-3 text-[9px] font-bold uppercase tracking-[0.22em] text-white/40">
                    {champion.nickname}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-0 overflow-hidden rounded-xl border border-white/10 bg-black/20 backdrop-blur-xl xl:min-w-[430px]">
                  <ImageMetadata
                    label="Nationality"
                    value={champion.nationality}
                  />

                  <ImageMetadata
                    label="Professional debut"
                    value={String(champion.debutYear)}
                    className="border-l border-white/10"
                  />

                  <ImageMetadata
                    label="Main brand"
                    value={champion.mainBrand}
                    className="border-l border-white/10"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 z-30 h-16 w-px"
        style={{
          background: `linear-gradient(to top, ${champion.accent}, transparent)`,
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 z-30 h-px w-16"
        style={{
          background: `linear-gradient(to left, ${champion.accent}, transparent)`,
        }}
      />
    </div>
  );
}

type ImageMetadataProps = {
  label: string;
  value: string;
  className?: string;
};

function ImageMetadata({
  label,
  value,
  className = "",
}: ImageMetadataProps) {
  return (
    <div
      className={[
        "min-w-0 px-4 py-4 sm:px-5",
        className,
      ].join(" ")}
    >
      <p className="text-[7px] font-black uppercase leading-4 tracking-[0.2em] text-white/25">
        {label}
      </p>

      <p
        title={value}
        className="mt-2 truncate text-[9px] font-black uppercase tracking-[0.12em] text-white/75 sm:text-[10px]"
      >
        {value}
      </p>
    </div>
  );
}

export default memo(ChampionImage);