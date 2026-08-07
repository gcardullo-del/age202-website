"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const STORAGE_KEY =
  "age202-opening-experience-seen";

const EXPERIENCE_DURATION =
  27_000;

const AUDIO_PLAYBACK_RATE =
  0.75;

const phrases = [
  {
    eyebrow: "Every shirt",
    title: "holds a chapter.",
    delay: 2.2,
  },
  {
    eyebrow: "Every champion",
    title: "defines an era.",
    delay: 5.9,
  },
  {
    eyebrow: "Every era",
    title: "leaves a legacy.",
    delay: 9.6,
  },
  {
    eyebrow: "Every artifact",
    title: "preserves a moment.",
    delay: 13.3,
  },
];

export default function OpeningExperience() {
  const shouldReduceMotion =
    useReducedMotion();

  const audioRef =
    useRef<HTMLAudioElement | null>(
      null,
    );

  const timerRef =
    useRef<number | null>(
      null,
    );

  const [isReady, setIsReady] =
    useState(false);

  const [isVisible, setIsVisible] =
    useState(false);

  const [hasStarted, setHasStarted] =
    useState(false);

  const [isMuted, setIsMuted] =
    useState(false);

  const stopTimer =
    useCallback(() => {
      if (
        timerRef.current !==
        null
      ) {
        window.clearTimeout(
          timerRef.current,
        );

        timerRef.current =
          null;
      }
    }, []);

  const stopAudio =
    useCallback(() => {
      const audio =
        audioRef.current;

      if (!audio) {
        return;
      }

      audio.pause();
      audio.currentTime = 0;
    }, []);

  const finishExperience =
    useCallback(() => {
      stopTimer();
      stopAudio();

      try {
        window.sessionStorage.setItem(
          STORAGE_KEY,
          "true",
        );
      } catch {
        // The experience still works if storage is unavailable.
      }

      setIsVisible(false);
    }, [
      stopAudio,
      stopTimer,
    ]);

  const startExperience =
    useCallback(async () => {
      if (hasStarted) {
        return;
      }

      setHasStarted(true);

      const audio =
        audioRef.current;

      if (
        audio &&
        !shouldReduceMotion
      ) {
        audio.currentTime = 0;
        audio.muted = isMuted;
        audio.playbackRate =
          AUDIO_PLAYBACK_RATE;

        try {
          await audio.play();
        } catch {
          // The visual experience continues if audio playback fails.
        }
      }

      const duration =
        shouldReduceMotion
          ? 3_500
          : EXPERIENCE_DURATION;

      timerRef.current =
        window.setTimeout(
          finishExperience,
          duration,
        );
    }, [
      finishExperience,
      hasStarted,
      isMuted,
      shouldReduceMotion,
    ]);

  const toggleMute =
    useCallback(() => {
      setIsMuted(
        (currentValue) => {
          const nextValue =
            !currentValue;

          if (audioRef.current) {
            audioRef.current.muted =
              nextValue;
          }

          return nextValue;
        },
      );
    }, []);

  useEffect(() => {
    let hasSeenExperience = false;

    try {
      hasSeenExperience =
        window.sessionStorage.getItem(
          STORAGE_KEY,
        ) === "true";
    } catch {
      hasSeenExperience = false;
    }

    setIsVisible(
      !hasSeenExperience,
    );

    setIsReady(true);
  }, []);

  useEffect(() => {
    if (
      !isReady ||
      !isVisible
    ) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;

      stopTimer();
      stopAudio();
    };
  }, [
    isReady,
    isVisible,
    stopAudio,
    stopTimer,
  ]);

  if (!isReady) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          key="age202-opening"
          role="dialog"
          aria-label="AGE202 opening experience"
          aria-modal="true"
          initial={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 1.8,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
          className="fixed inset-0 z-[9999] overflow-hidden bg-[#02050c] text-white"
        >
          <audio
            ref={audioRef}
            src="/audio/age202-opening.mp3"
            preload="auto"
          />

          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.022]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
              backgroundSize:
                "96px 96px",
            }}
          />

          <motion.div
            aria-hidden="true"
            animate={
              !hasStarted ||
              shouldReduceMotion
                ? undefined
                : {
                    x: [
                      "-8%",
                      "9%",
                      "-4%",
                    ],
                    y: [
                      "5%",
                      "-7%",
                      "4%",
                    ],
                    scale: [
                      1,
                      1.14,
                      1.03,
                    ],
                  }
            }
            transition={{
              duration: 27,
              ease: "easeInOut",
            }}
            className="absolute -left-[18vw] top-[10vh] h-[60vw] min-h-[520px] w-[60vw] min-w-[520px] rounded-full bg-[#d7ff00]/[0.055] blur-[190px]"
          />

          <motion.div
            aria-hidden="true"
            animate={
              !hasStarted ||
              shouldReduceMotion
                ? undefined
                : {
                    x: [
                      "7%",
                      "-8%",
                      "5%",
                    ],
                    y: [
                      "-5%",
                      "8%",
                      "-4%",
                    ],
                    scale: [
                      1.08,
                      0.96,
                      1.11,
                    ],
                  }
            }
            transition={{
              duration: 27,
              ease: "easeInOut",
            }}
            className="absolute -bottom-[30vw] -right-[20vw] h-[64vw] min-h-[560px] w-[64vw] min-w-[560px] rounded-full bg-[#d7ff00]/[0.04] blur-[210px]"
          />

          <div className="absolute right-5 top-5 z-40 flex items-center gap-2 sm:right-8 sm:top-8">
            {hasStarted ? (
              <button
                type="button"
                onClick={
                  toggleMute
                }
                aria-label={
                  isMuted
                    ? "Enable sound"
                    : "Mute sound"
                }
                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/20 text-white/55 backdrop-blur-xl transition hover:border-[#d7ff00]/45 hover:text-[#d7ff00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7ff00]/45"
              >
                {isMuted ? (
                  <VolumeX
                    size={15}
                    aria-hidden="true"
                  />
                ) : (
                  <Volume2
                    size={15}
                    aria-hidden="true"
                  />
                )}
              </button>
            ) : null}

            <button
              type="button"
              onClick={
                finishExperience
              }
              className="rounded-full border border-white/15 bg-black/20 px-4 py-2 font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-white/55 backdrop-blur-xl transition hover:border-[#d7ff00]/45 hover:text-[#d7ff00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7ff00]/45"
            >
              Skip intro
            </button>
          </div>

          <div className="relative flex h-full items-center justify-center px-6 text-center sm:px-10">
            {!hasStarted ? (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 1.2,
                  ease: [
                    0.22,
                    1,
                    0.36,
                    1,
                  ],
                }}
                className="max-w-xl"
              >
                <div className="mx-auto h-px w-16 bg-[#d7ff00] shadow-[0_0_22px_rgba(215,255,0,.55)]" />

                <p className="mt-7 font-mono text-[9px] font-bold uppercase tracking-[0.38em] text-[#d7ff00]">
                  AGE202 presents
                </p>

                <h2 className="mt-6 text-[clamp(3rem,8vw,6.5rem)] font-black uppercase leading-[0.82] tracking-[-0.07em]">
                  Enter the
                  <span className="block text-white/38">
                    museum.
                  </span>
                </h2>

                <p className="mx-auto mt-7 max-w-md text-sm leading-7 text-white/42">
                  A short opening experience
                  with sound.
                </p>

                <button
                  type="button"
                  onClick={
                    startExperience
                  }
                  className="mt-9 inline-flex min-h-12 items-center justify-center rounded-full bg-[#d7ff00] px-8 py-4 text-[10px] font-black uppercase tracking-[0.22em] text-[#030812] transition hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7ff00]/50"
                >
                  Enter AGE202
                </button>
              </motion.div>
            ) : shouldReduceMotion ? (
              <div>
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.38em] text-[#d7ff00]">
                  Digital Tennis Museum
                </p>

                <h2 className="mt-5 text-[clamp(4rem,13vw,9rem)] font-black uppercase leading-[0.78] tracking-[-0.08em]">
                  AGE202
                </h2>

                <p className="mt-6 text-sm uppercase tracking-[0.24em] text-white/45">
                  Every story deserves to be preserved.
                </p>
              </div>
            ) : (
              <>
                {phrases.map(
                  (phrase) => (
                    <motion.div
                      key={
                        phrase.eyebrow
                      }
                      initial={{
                        opacity: 0,
                        y: 28,
                        filter:
                          "blur(16px)",
                      }}
                      animate={{
                        opacity: [
                          0,
                          1,
                          1,
                          0,
                        ],
                        y: [
                          28,
                          0,
                          0,
                          -18,
                        ],
                        filter: [
                          "blur(16px)",
                          "blur(0px)",
                          "blur(0px)",
                          "blur(11px)",
                        ],
                      }}
                      transition={{
                        duration: 3.6,
                        delay:
                          phrase.delay,
                        times: [
                          0,
                          0.18,
                          0.78,
                          1,
                        ],
                        ease: [
                          0.22,
                          1,
                          0.36,
                          1,
                        ],
                      }}
                      className="pointer-events-none absolute inset-x-6"
                    >
                      <p className="font-mono text-[9px] font-bold uppercase tracking-[0.38em] text-[#d7ff00] sm:text-[10px]">
                        {phrase.eyebrow}
                      </p>

                      <p className="mt-5 text-[clamp(2.7rem,7vw,6.9rem)] font-black uppercase leading-[0.86] tracking-[-0.065em] text-white">
                        {phrase.title}
                      </p>
                    </motion.div>
                  ),
                )}

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 32,
                    filter:
                      "blur(17px)",
                  }}
                  animate={{
                    opacity: [
                      0,
                      1,
                      1,
                      0,
                    ],
                    y: [
                      32,
                      0,
                      0,
                      -20,
                    ],
                    filter: [
                      "blur(17px)",
                      "blur(0px)",
                      "blur(0px)",
                      "blur(11px)",
                    ],
                  }}
                  transition={{
                    duration: 4.9,
                    delay: 17,
                    times: [
                      0,
                      0.15,
                      0.82,
                      1,
                    ],
                    ease: [
                      0.22,
                      1,
                      0.36,
                      1,
                    ],
                  }}
                  className="pointer-events-none absolute inset-x-6"
                >
                  <p className="mx-auto max-w-5xl text-[clamp(2.5rem,6.6vw,6.6rem)] font-black uppercase leading-[0.88] tracking-[-0.06em]">
                    Every story deserves
                    <span className="block text-[#d7ff00]">
                      to be preserved.
                    </span>
                  </p>
                </motion.div>

                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.92,
                    filter:
                      "blur(18px)",
                  }}
                  animate={{
                    opacity: [
                      0,
                      1,
                      1,
                    ],
                    scale: [
                      0.92,
                      1,
                      1.012,
                    ],
                    filter: [
                      "blur(18px)",
                      "blur(0px)",
                      "blur(0px)",
                    ],
                  }}
                  transition={{
                    duration: 3.8,
                    delay: 22.2,
                    ease: [
                      0.22,
                      1,
                      0.36,
                      1,
                    ],
                  }}
                  className="pointer-events-none absolute inset-x-6"
                >
                  <motion.div
                    animate={{
                      opacity: [
                        0.4,
                        1,
                        0.55,
                      ],
                    }}
                    transition={{
                      duration: 2.1,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="mx-auto mb-7 h-px w-20 bg-[#d7ff00] shadow-[0_0_24px_rgba(215,255,0,.65)]"
                  />

                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.4em] text-[#d7ff00] sm:text-[10px]">
                    Digital Tennis Museum
                  </p>

                  <h2 className="mt-5 text-[clamp(4.8rem,15vw,11rem)] font-black uppercase leading-[0.72] tracking-[-0.095em] text-white">
                    AGE202
                  </h2>

                  <p className="mt-7 text-[9px] font-black uppercase tracking-[0.32em] text-white/38 sm:text-[10px]">
                    Second Hand. First Set.
                  </p>
                </motion.div>
              </>
            )}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
