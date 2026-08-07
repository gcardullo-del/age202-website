"use client";

import Link from "next/link";

import {
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  ArrowDown,
} from "lucide-react";

import type {
  Champion,
} from "@/data/champions";

type CareerTimelineProps = {
  champion: Champion;
};

export default function CareerTimeline({
  champion,
}: CareerTimelineProps) {
  const shouldReduceMotion =
    useReducedMotion();

  return (
    <section
      id="career-timeline"
      className="relative scroll-mt-20 overflow-hidden border-y border-white/[0.07] bg-[#07101E] py-24 sm:py-28 lg:py-36"
    >
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.65) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.65) 1px, transparent 1px)",
          backgroundSize:
            "96px 96px",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-48 top-1/3 h-[460px] w-[460px] rounded-full opacity-[0.08] blur-[160px]"
        style={{
          backgroundColor:
            champion.accent,
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-56 bottom-[-120px] h-[520px] w-[520px] rounded-full opacity-[0.06] blur-[170px]"
        style={{
          backgroundColor:
            champion.accent,
        }}
      />

      <div className="relative mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12">
        {/* =====================================================
            SECTION HEADER
        ====================================================== */}

        <div className="grid gap-10 lg:grid-cols-[0.72fr_1fr] lg:items-end lg:gap-20">
          <div>
            <div className="flex items-center gap-4">
              <span
                aria-hidden="true"
                className="h-px w-10 sm:w-14"
                style={{
                  backgroundColor:
                    champion.accent,
                  boxShadow:
                    `0 0 14px ${champion.accent}`,
                }}
              />

              <p
                className="text-[10px] font-black uppercase tracking-[0.32em]"
                style={{
                  color:
                    champion.accent,
                }}
              >
                Chapter II · The Career
              </p>
            </div>

            <h2 className="mt-6 max-w-3xl text-5xl font-black leading-[0.92] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
              The chapters behind{" "}
              <span className="text-white/35">
                the champion.
              </span>
            </h2>
          </div>

          <div className="lg:pb-2">
            <p className="max-w-2xl text-base leading-8 text-white/45 sm:text-lg sm:leading-9">
              A chronological record of
              the moments that shaped{" "}
              <span className="font-semibold text-white/75">
                {champion.name}
              </span>
              , from the professional
              debut to the defining
              achievements of a historic
              career.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <TimelineMeta
                label="First chapter"
                value={String(
                  champion
                    .careerTimeline[0]
                    ?.year ??
                    champion.debutYear,
                )}
              />

              <TimelineMeta
                label="Recorded events"
                value={String(
                  champion
                    .careerTimeline
                    .length,
                )}
              />

              <TimelineMeta
                label="Archive status"
                value="Documented"
                accent={
                  champion.accent
                }
              />
            </div>
          </div>
        </div>

        {/* =====================================================
            TIMELINE
        ====================================================== */}

        <div className="relative mt-20 sm:mt-24 lg:mt-28">
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-[19px] top-0 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent sm:left-[27px] lg:left-1/2 lg:-translate-x-1/2"
          />

          <div className="space-y-8 sm:space-y-10 lg:space-y-0">
            {champion.careerTimeline.map(
              (event, index) => {
                const isEven =
                  index % 2 === 0;

                return (
                  <motion.article
                    key={`${event.year}-${event.title}`}
                    initial={
                      shouldReduceMotion
                        ? false
                        : {
                            opacity: 0,
                            y: 42,
                          }
                    }
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.25,
                    }}
                    transition={{
                      duration: 0.75,
                      delay: Math.min(
                        index * 0.07,
                        0.35,
                      ),
                      ease: [
                        0.22,
                        1,
                        0.36,
                        1,
                      ],
                    }}
                    className="relative lg:grid lg:grid-cols-[1fr_96px_1fr] lg:items-center"
                  >
                    {/* Left or right card */}

                    <div
                      className={[
                        "ml-14 sm:ml-20 lg:ml-0",
                        isEven
                          ? "lg:col-start-1 lg:pr-12"
                          : "lg:col-start-3 lg:pl-12",
                      ].join(" ")}
                    >
                      <TimelineCard
                        chapter={
                          index + 1
                        }
                        year={
                          event.year
                        }
                        title={
                          event.title
                        }
                        description={
                          event.description
                        }
                        accent={
                          champion.accent
                        }
                        align={
                          isEven
                            ? "right"
                            : "left"
                        }
                      />
                    </div>

                    {/* Center marker */}

                    <div className="absolute left-0 top-8 z-10 flex h-10 w-10 items-center justify-center sm:left-2 sm:h-12 sm:w-12 lg:static lg:col-start-2 lg:row-start-1 lg:mx-auto lg:h-16 lg:w-16">
                      <div
                        className="relative flex h-10 w-10 items-center justify-center rounded-full border bg-[#07101E] transition duration-500 sm:h-12 sm:w-12 lg:h-14 lg:w-14"
                        style={{
                          borderColor:
                            `${champion.accent}88`,
                          boxShadow:
                            `0 0 0 8px #07101E, 0 0 34px ${champion.accent}22`,
                        }}
                      >
                        <span
                          className="h-2.5 w-2.5 rounded-full lg:h-3 lg:w-3"
                          style={{
                            backgroundColor:
                              champion.accent,
                            boxShadow:
                              `0 0 16px ${champion.accent}`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Empty balancing column */}

                    <div
                      aria-hidden="true"
                      className={[
                        "hidden lg:block",
                        isEven
                          ? "lg:col-start-3"
                          : "lg:col-start-1",
                      ].join(" ")}
                    />
                  </motion.article>
                );
              },
            )}
          </div>
        </div>

        {/* =====================================================
            CHAPTER TRANSITION
        ====================================================== */}

        <div className="mt-20 border-t border-white/10 pt-8 lg:mt-28">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p
                className="font-mono text-[8px] font-black uppercase tracking-[0.24em]"
                style={{
                  color:
                    champion.accent,
                }}
              >
                End of Chapter II
              </p>

              <h3 className="mt-4 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
                The career becomes
                legacy.
              </h3>

              <p className="mt-4 max-w-xl text-sm leading-7 text-white/35">
                Continue the museum
                journey and discover how{" "}
                {champion.firstName}
                {" "}
                influenced tennis far
                beyond victories and
                records.
              </p>
            </div>

            <Link
              href="#legacy-section"
              className="group inline-flex min-h-12 w-fit items-center justify-center gap-3 rounded-full border px-6 py-3 text-[9px] font-black uppercase tracking-[0.19em] transition duration-300 hover:-translate-y-0.5"
              style={{
                borderColor:
                  `${champion.accent}45`,
                backgroundColor:
                  `${champion.accent}0d`,
                color:
                  champion.accent,
              }}
            >
              Continue to the legacy

              <ArrowDown
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1"
                aria-hidden="true"
              />
            </Link>
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 font-mono text-[8px] uppercase tracking-[0.22em] text-white/25 sm:flex-row sm:items-center sm:justify-between">
            <span>
              AGE202 Career Registry ·{" "}
              {champion.name}
            </span>

            <span>
              Archive reference ·{" "}
              {champion.certificateId}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   TIMELINE CARD
========================================================= */

type TimelineCardProps = {
  chapter: number;
  year: number;
  title: string;
  description: string;
  accent: string;
  align: "left" | "right";
};

function TimelineCard({
  chapter,
  year,
  title,
  description,
  accent,
  align,
}: TimelineCardProps) {
  const chapterLabel =
    String(chapter).padStart(
      2,
      "0",
    );

  return (
    <div
      className={[
        "group relative min-w-0 rounded-[30px] border border-white/10 bg-white/[0.025] p-7 transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.045] sm:p-9",
        align === "right"
          ? "lg:text-right"
          : "lg:text-left",
      ].join(" ")}
    >
      {/* Decorative layer only */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[30px]"
      >
        <div
          className={[
            "absolute -top-16 h-44 w-44 rounded-full opacity-0 blur-[70px] transition-opacity duration-500 group-hover:opacity-[0.18]",
            align === "right"
              ? "-left-16"
              : "-right-16",
          ].join(" ")}
          style={{
            backgroundColor:
              accent,
          }}
        />

        <span
          className={[
            "absolute -bottom-7 select-none text-[110px] font-black leading-none tracking-[-0.09em] text-white/[0.018] transition duration-500 group-hover:text-white/[0.035] sm:text-[140px]",
            align === "right"
              ? "-left-3"
              : "-right-3",
          ].join(" ")}
        >
          {chapterLabel}
        </span>
      </div>

      {/* Text content */}

      <div className="relative min-w-0">
        <div
          className={[
            "flex min-h-7 min-w-0 items-center gap-4",
            align === "right"
              ? "lg:justify-end"
              : "lg:justify-start",
          ].join(" ")}
        >
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{
              backgroundColor:
                accent,
              boxShadow:
                `0 0 12px ${accent}`,
            }}
          />

          <p className="min-w-0 break-words py-1 font-mono text-[9px] uppercase leading-[1.7] tracking-[0.2em] text-white/30">
            Chapter {chapterLabel}
          </p>
        </div>

        <p className="mt-7 break-words text-6xl font-black leading-[1.05] tracking-[-0.07em] text-white/[0.12] transition-colors duration-500 group-hover:text-white/[0.2] sm:text-7xl">
          {year}
        </p>

        <h3
          className="mt-5 min-w-0 break-words text-2xl font-black leading-[1.2] tracking-[-0.035em] sm:text-3xl"
          style={{
            color: accent,
          }}
        >
          {title}
        </h3>

        <p className="mt-5 min-w-0 break-words whitespace-normal text-sm leading-7 text-white/45 sm:text-base sm:leading-8">
          {description}
        </p>

        <div
          className={[
            "mt-8 flex min-w-0 items-center gap-3",
            align === "right"
              ? "lg:justify-end"
              : "lg:justify-start",
          ].join(" ")}
        >
          <span
            className="h-px w-10 shrink-0"
            style={{
              backgroundColor:
                accent,
            }}
          />

          <span className="min-w-0 break-words py-1 text-[8px] font-black uppercase leading-[1.7] tracking-[0.18em] text-white/30">
            AGE202 documented event
          </span>
        </div>
      </div>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px opacity-60"
        style={{
          background:
            `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        }}
      />
    </div>
  );
}

/* =========================================================
   TIMELINE META
========================================================= */

type TimelineMetaProps = {
  label: string;
  value: string;
  accent?: string;
};

function TimelineMeta({
  label,
  value,
  accent,
}: TimelineMetaProps) {
  return (
    <div className="rounded-full border border-white/10 bg-white/[0.025] px-5 py-3 backdrop-blur-xl">
      <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/25">
        {label}
      </p>

      <p
        className="mt-1 text-[10px] font-black uppercase tracking-[0.13em] text-white/60"
        style={
          accent
            ? {
                color: accent,
              }
            : undefined
        }
      >
        {value}
      </p>
    </div>
  );
}