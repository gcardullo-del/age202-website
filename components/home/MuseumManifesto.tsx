"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { museumQuotes } from "@/data";
import {
  GlowBackground,
  SectionHeader,
} from "@/components/museum-ui";

const quoteInterval = 6500;

export default function MuseumManifesto() {
  const sectionRef = useRef<HTMLElement>(null);

  const isInView = useInView(sectionRef, {
    once: false,
    amount: 0.4,
  });

  const shouldReduceMotion = useReducedMotion();

  const [activeQuoteIndex, setActiveQuoteIndex] =
    useState(0);

  useEffect(() => {
    if (!isInView || shouldReduceMotion) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveQuoteIndex((currentIndex) =>
        currentIndex === museumQuotes.length - 1
          ? 0
          : currentIndex + 1
      );
    }, quoteInterval);

    return () => {
      window.clearInterval(interval);
    };
  }, [isInView, shouldReduceMotion]);

  const activeQuote =
    museumQuotes[activeQuoteIndex];

  function selectQuote(index: number) {
    setActiveQuoteIndex(index);
  }

  function showPreviousQuote() {
    setActiveQuoteIndex((currentIndex) =>
      currentIndex === 0
        ? museumQuotes.length - 1
        : currentIndex - 1
    );
  }

  function showNextQuote() {
    setActiveQuoteIndex((currentIndex) =>
      currentIndex === museumQuotes.length - 1
        ? 0
        : currentIndex + 1
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-b border-white/10 bg-[#050B18]"
    >
      <GlowBackground
        position="left"
        intensity="medium"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-280px] right-[-100px] h-[520px] w-[520px] rounded-full bg-white/[0.025] blur-[150px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "120px 100%",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-24 md:px-8 lg:py-36">
        <div className="grid gap-14 lg:grid-cols-[0.3fr_1fr] lg:gap-20">
          <div className="flex flex-col justify-between">
            <div>
              <SectionHeader
                eyebrow="Museum manifesto"
                title={
                  <>
                    The principles
                    <span className="block text-white/25">
                      behind the archive.
                    </span>
                  </>
                }
                description="The vision behind AGE202 and its interpretation of collectible tennis culture."
                className="lg:block"
              />
            </div>

            <div className="mt-12 hidden lg:block">
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/20">
                Archive document
              </p>

              <p className="mt-2 font-mono text-xs tracking-[0.2em] text-white/50">
                AGE-MANIFESTO-202
              </p>
            </div>
          </div>

          <div className="relative min-h-[420px]">
            <div
              aria-hidden="true"
              className="absolute -left-4 -top-14 text-[170px] font-black leading-none text-[#C8FF00]/[0.05] sm:text-[230px]"
            >
              “
            </div>

            <div className="relative z-10 flex min-h-[420px] flex-col justify-between">
              <div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeQuote.id}
                    initial={
                      shouldReduceMotion
                        ? false
                        : {
                            opacity: 0,
                            y: 32,
                            filter: "blur(8px)",
                          }
                    }
                    animate={{
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                    }}
                    exit={
                      shouldReduceMotion
                        ? undefined
                        : {
                            opacity: 0,
                            y: -24,
                            filter: "blur(7px)",
                          }
                    }
                    transition={{
                      duration: 0.75,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C8FF00]">
                      {activeQuote.category}
                    </p>

                    <blockquote className="mt-8 max-w-5xl text-4xl font-black leading-[1.04] tracking-[-0.05em] text-white sm:text-5xl lg:text-7xl">
                      {activeQuote.quote}
                    </blockquote>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-14 border-t border-white/10 pt-7">
                <div className="flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-3">
                    {museumQuotes.map((quote, index) => {
                      const isActive =
                        index === activeQuoteIndex;

                      return (
                        <button
                          key={quote.id}
                          type="button"
                          onClick={() =>
                            selectQuote(index)
                          }
                          aria-label={`Show quote ${index + 1}`}
                          aria-current={
                            isActive
                              ? "true"
                              : undefined
                          }
                          className={[
                            "relative h-8 overflow-hidden rounded-full border transition-all duration-500",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8FF00]",
                            isActive
                              ? "w-20 border-[#C8FF00]/30 bg-[#C8FF00]/[0.07]"
                              : "w-8 border-white/10 bg-white/[0.02] hover:border-white/25",
                          ].join(" ")}
                        >
                          {isActive && (
                            <motion.span
                              key={`progress-${activeQuote.id}`}
                              className="absolute inset-y-0 left-0 bg-[#C8FF00]/15"
                              initial={{
                                width: shouldReduceMotion
                                  ? "100%"
                                  : "0%",
                              }}
                              animate={{
                                width: "100%",
                              }}
                              transition={{
                                duration:
                                  quoteInterval / 1000,
                                ease: "linear",
                              }}
                            />
                          )}

                          <span
                            className={[
                              "relative z-10 font-mono text-[8px]",
                              isActive
                                ? "text-[#C8FF00]"
                                : "text-white/30",
                            ].join(" ")}
                          >
                            {String(index + 1).padStart(
                              2,
                              "0"
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-4 sm:gap-5">
                    <button
                      type="button"
                      onClick={showPreviousQuote}
                      aria-label="Previous quote"
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white transition hover:border-[#C8FF00]/40 hover:bg-[#C8FF00] hover:text-[#050B18] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8FF00]"
                    >
                      <span aria-hidden="true">
                        ←
                      </span>
                    </button>

                    <p className="min-w-16 text-center font-mono text-[9px] tracking-[0.2em] text-white/40">
                      {String(
                        activeQuoteIndex + 1
                      ).padStart(2, "0")}
                      {" / "}
                      {String(
                        museumQuotes.length
                      ).padStart(2, "0")}
                    </p>

                    <button
                      type="button"
                      onClick={showNextQuote}
                      aria-label="Next quote"
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white transition hover:border-[#C8FF00]/40 hover:bg-[#C8FF00] hover:text-[#050B18] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8FF00]"
                    >
                      <span aria-hidden="true">
                        →
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-6 lg:hidden">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/20">
            AGE-MANIFESTO-202
          </p>
        </div>
      </div>
    </section>
  );
}