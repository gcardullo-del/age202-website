"use client";

import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";

import type { ChampionNavigationProps } from "./types";

function ChampionNavigation({
  champions,
  activeIndex,
  onSelect,
}: ChampionNavigationProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <nav
      aria-label="Champion navigation"
      className="relative border-t border-white/10 bg-[#050B18]/95"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.012] to-transparent"
      />

      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        {champions.map((champion, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={champion.id}
              type="button"
              onClick={() => onSelect(index)}
              aria-pressed={isActive}
              className={[
                "group relative min-h-[132px] overflow-hidden px-6 py-7 text-left",
                "border-b border-white/10",
                "transition duration-500",
                "focus-visible:z-20 focus-visible:bg-white/[0.04]",
                "focus-visible:outline-none",
                "focus-visible:ring-2 focus-visible:ring-inset",
                "focus-visible:ring-[#C8FF00]",
                "sm:min-h-[142px] sm:border-r",
                index >= champions.length - 2 ? "sm:border-b-0" : "",
                "lg:min-h-[154px] lg:border-b-0",
                index === champions.length - 1 ? "lg:border-r-0" : "",
                isActive
                  ? "bg-white/[0.045]"
                  : "hover:bg-white/[0.025]",
              ].join(" ")}
            >
              {isActive && (
                <motion.span
                  layoutId="champion-navigation-top-accent"
                  className="absolute inset-x-0 top-0 h-[2px]"
                  style={{
                    backgroundColor: champion.accent,
                    boxShadow: `0 0 24px ${champion.accent}`,
                  }}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : {
                          duration: 0.5,
                          ease: [0.22, 1, 0.36, 1],
                        }
                  }
                />
              )}

              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-[65px] transition duration-500 group-hover:opacity-100"
                style={{
                  backgroundColor: `${champion.accent}24`,
                }}
              />

              <div
                aria-hidden="true"
                className={[
                  "pointer-events-none absolute",
                  "bottom-[-56px] left-1/2",
                  "h-28 w-28 -translate-x-1/2",
                  "rounded-full blur-[55px]",
                  "transition duration-500",
                  isActive ? "opacity-100" : "opacity-0",
                ].join(" ")}
                style={{
                  backgroundColor: `${champion.accent}1F`,
                }}
              />

              <div className="relative z-10 flex h-full items-start justify-between gap-5">
                <div>
                  <div className="flex items-center gap-3">
                    <p
                      className={[
                        "font-mono text-[9px] tracking-[0.24em] transition",
                        isActive ? "text-white" : "text-white/25",
                      ].join(" ")}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </p>

                    <span
                      className={[
                        "h-px transition-all duration-500",
                        isActive
                          ? "w-7"
                          : "w-3 bg-white/15 group-hover:w-5",
                      ].join(" ")}
                      style={
                        isActive
                          ? {
                              backgroundColor: champion.accent,
                            }
                          : undefined
                      }
                    />
                  </div>

                  <p
                    className={[
                      "mt-5 text-xs font-black uppercase tracking-[0.2em] transition duration-300",
                      "sm:text-[13px] lg:text-sm",
                      isActive
                        ? "text-white"
                        : "text-white/45 group-hover:text-white",
                    ].join(" ")}
                  >
                    {champion.lastName}
                  </p>

                  <p
                    className={[
                      "mt-3 max-w-[200px] text-[9px] font-bold uppercase leading-5 tracking-[0.18em]",
                      "transition duration-300",
                      isActive
                        ? "text-white/45"
                        : "text-white/20 group-hover:text-white/35",
                    ].join(" ")}
                  >
                    {champion.nickname}
                  </p>
                </div>

                <span
                  aria-hidden="true"
                  className={[
                    "mt-1 h-2.5 w-2.5 shrink-0 rounded-full border",
                    "transition duration-500",
                    isActive
                      ? "scale-100"
                      : "scale-75 border-white/20 bg-transparent group-hover:scale-100",
                  ].join(" ")}
                  style={
                    isActive
                      ? {
                          backgroundColor: champion.accent,
                          borderColor: champion.accent,
                          boxShadow: `0 0 20px ${champion.accent}`,
                        }
                      : undefined
                  }
                />
              </div>

              <span
                aria-hidden="true"
                className={[
                  "pointer-events-none absolute bottom-3 right-4",
                  "text-[74px] font-black leading-none tracking-[-0.08em]",
                  "transition duration-500",
                  isActive
                    ? "text-white/[0.045]"
                    : "text-white/[0.018] group-hover:text-white/[0.03]",
                ].join(" ")}
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              {isActive && (
                <motion.div
                  key={`${champion.id}-navigation-progress`}
                  className="absolute bottom-0 left-0 h-[2px]"
                  initial={shouldReduceMotion ? false : { width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : {
                          duration: 0.75,
                          ease: [0.22, 1, 0.36, 1],
                        }
                  }
                  style={{
                    backgroundColor: champion.accent,
                    boxShadow: `0 0 20px ${champion.accent}`,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default memo(ChampionNavigation);