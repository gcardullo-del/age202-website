"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";

import { UserRoundSearch } from "lucide-react";

import PlayerCard from "./PlayerCard";

import type {
  AtpArchivePlayer,
} from "./types";

type ArchiveGridProps = {
  players: AtpArchivePlayer[];
  totalPlayers: number;
};

export default function ArchiveGrid({
  players,
  totalPlayers,
}: ArchiveGridProps) {
  const prefersReducedMotion =
    useReducedMotion();

  return (
    <section className="px-5 pb-20 pt-10 sm:px-8 lg:px-12 lg:pb-28 lg:pt-14">
      <div className="mx-auto w-full max-w-[1920px]">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-[#D7FF00]">
              Live archive selection
            </p>

            <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.045em] sm:text-4xl">
              ATP player index
            </h2>
          </div>

          <motion.p
            key={players.length}
            aria-live="polite"
            initial={
              prefersReducedMotion
                ? false
                : {
                    opacity: 0,
                    y: 5,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: prefersReducedMotion
                ? 0
                : 0.3,
              ease: "easeOut",
            }}
            className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/35"
          >
            Showing {players.length} of{" "}
            {totalPlayers} players
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {players.length > 0 ? (
            <motion.div
              key="archive-player-grid"
              initial={
                prefersReducedMotion
                  ? false
                  : {
                      opacity: 0,
                    }
              }
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: prefersReducedMotion
                  ? 0
                  : 0.25,
              }}
              className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
            >
              <AnimatePresence>
                {players.map(
                  (player, index) => (
                    <motion.div
                      key={player.id}
                      initial={
                        prefersReducedMotion
                          ? false
                          : {
                              opacity: 0,
                              y: 28,
                              scale: 0.985,
                            }
                      }
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      exit={
                        prefersReducedMotion
                          ? {
                              opacity: 0,
                            }
                          : {
                              opacity: 0,
                              y: 14,
                              scale: 0.98,
                            }
                      }
                      transition={{
                        opacity: {
                          duration:
                            prefersReducedMotion
                              ? 0
                              : 0.32,
                          delay:
                            prefersReducedMotion
                              ? 0
                              : Math.min(
                                  index * 0.045,
                                  0.45,
                                ),
                        },
                        y: {
                          duration:
                            prefersReducedMotion
                              ? 0
                              : 0.48,
                          delay:
                            prefersReducedMotion
                              ? 0
                              : Math.min(
                                  index * 0.045,
                                  0.45,
                                ),
                          ease: [
                            0.22,
                            1,
                            0.36,
                            1,
                          ],
                        },
                        scale: {
                          duration:
                            prefersReducedMotion
                              ? 0
                              : 0.42,
                          delay:
                            prefersReducedMotion
                              ? 0
                              : Math.min(
                                  index * 0.045,
                                  0.45,
                                ),
                          ease: [
                            0.22,
                            1,
                            0.36,
                            1,
                          ],
                        },
                      }}
                    >
                      <PlayerCard
                        player={player}
                      />
                    </motion.div>
                  ),
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="archive-empty-state"
              initial={
                prefersReducedMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 18,
                    }
              }
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: prefersReducedMotion
                  ? 0
                  : 0.38,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
              className="mt-8 rounded-[2rem] border border-dashed border-white/10 bg-white/[0.02] px-7 py-20 text-center"
            >
              <motion.span
                initial={
                  prefersReducedMotion
                    ? false
                    : {
                        opacity: 0,
                        scale: 0.88,
                      }
                }
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration:
                    prefersReducedMotion
                      ? 0
                      : 0.42,
                  delay:
                    prefersReducedMotion
                      ? 0
                      : 0.08,
                  ease: [
                    0.22,
                    1,
                    0.36,
                    1,
                  ],
                }}
                className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-[#D7FF00]/20 bg-[#D7FF00]/[0.07] text-[#D7FF00]"
              >
                <UserRoundSearch
                  size={38}
                  strokeWidth={1.4}
                  aria-hidden="true"
                />
              </motion.span>

              <p className="mt-6 font-mono text-[8px] font-black uppercase tracking-[0.22em] text-[#D7FF00]">
                Archive search
              </p>

              <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.035em]">
                No players found
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/42">
                Try changing the search
                term, ranking range,
                country or sorting option.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}