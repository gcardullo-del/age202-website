"use client";

import Image from "next/image";
import Link from "next/link";

import { motion } from "framer-motion";
import {
  ArrowRight,
  UserRound,
} from "lucide-react";

import type {
  PublicHomepageFeaturedPlayer,
} from "@/lib/repositories/public/homepage.repository";

type MuseumCollectionsProps = {
  players: PublicHomepageFeaturedPlayer[];
};

type PlayerCardMetadata = {
  era: string;
  period: string;
  badge: string;
  href: string;
  position: string;
};

const reveal = {
  hidden: {
    opacity: 0,
    y: 28,
  },

  visible: {
    opacity: 1,
    y: 0,
  },
};

const championMetadata:
  Record<
    string,
    PlayerCardMetadata
  > = {
  "roger-federer": {
    era: "The art of elegance",
    period: "1998 — 2022",
    badge: "The Maestro",
    href: "/archives/federer",
    position: "object-center",
  },

  federer: {
    era: "The art of elegance",
    period: "1998 — 2022",
    badge: "The Maestro",
    href: "/archives/federer",
    position: "object-center",
  },

  "rafael-nadal": {
    era: "The king of clay",
    period: "2001 — 2024",
    badge: "Clay legend",
    href: "/archives/nadal",
    position: "object-center",
  },

  nadal: {
    era: "The king of clay",
    period: "2001 — 2024",
    badge: "Clay legend",
    href: "/archives/nadal",
    position: "object-center",
  },

  "novak-djokovic": {
    era: "The pursuit of greatness",
    period: "2003 — Present",
    badge: "Record breaker",
    href: "/archives/djokovic",
    position: "object-center",
  },

  djokovic: {
    era: "The pursuit of greatness",
    period: "2003 — Present",
    badge: "Record breaker",
    href: "/archives/djokovic",
    position: "object-center",
  },

  "jannik-sinner": {
    era: "A new Italian era",
    period: "2018 — Present",
    badge: "Italian icon",
    href: "/archives/sinner",
    position: "object-[center_15%]",
  },

  sinner: {
    era: "A new Italian era",
    period: "2018 — Present",
    badge: "Italian icon",
    href: "/archives/sinner",
    position: "object-[center_15%]",
  },

  "carlos-alcaraz": {
    era: "The future in motion",
    period: "2018 — Present",
    badge: "New generation",
    href: "/archives/alcaraz",
    position: "object-center",
  },

  alcaraz: {
    era: "The future in motion",
    period: "2018 — Present",
    badge: "New generation",
    href: "/archives/alcaraz",
    position: "object-center",
  },
};

function formatCollectionType(
  value: string,
): string {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    );
}

function getPlayerMetadata(
  player: PublicHomepageFeaturedPlayer,
): PlayerCardMetadata {
  const predefined =
    championMetadata[player.slug];

  if (predefined) {
    return predefined;
  }

  return {
    era:
      player.country
        ? `${player.country} archive`
        : "AGE202 player archive",

    period:
      formatCollectionType(
        player.collectionType,
      ),

    badge:
      player.nickname ??
      formatCollectionType(
        player.collectionType,
      ),

    href:
      `/players/other-players/${player.slug}`,

    position:
      "object-center",
  };
}

export default function MuseumCollections({
  players,
}: MuseumCollectionsProps) {
  if (players.length === 0) {
    return null;
  }

  return (
    <section
      id="collections"
      className="border-b border-white/10 bg-[#050b18] px-4 py-20 sm:px-6 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-[1600px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.25,
          }}
          variants={reveal}
          transition={{
            duration: 0.65,
          }}
          className="mb-14 flex flex-col justify-between gap-6 border-t border-white/10 pt-7 md:flex-row md:items-end lg:mb-16"
        >
          <div>
            <div className="mb-4 h-0.5 w-8 bg-[#d7ff00]" />

            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d7ff00]">
              Featured galleries
            </p>

            <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.045em] sm:text-5xl">
              Champion collections
            </h2>
          </div>

          <Link
            href="/players/other-players"
            className="group inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.22em] text-white/70 transition hover:text-[#d7ff00]"
          >
            View all players

            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </motion.div>

        <div
          className={[
            "-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-5",
            "sm:-mx-6 sm:px-6",
            "lg:mx-0 lg:grid lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0",
            players.length === 1
              ? "lg:grid-cols-1"
              : "",
            players.length === 2
              ? "lg:grid-cols-2"
              : "",
            players.length === 3
              ? "lg:grid-cols-3"
              : "",
            players.length === 4
              ? "lg:grid-cols-4"
              : "",
            players.length >= 5
              ? "lg:grid-cols-5"
              : "",
          ].join(" ")}
        >
          {players.map(
            (player, index) => {
              const metadata =
                getPlayerMetadata(
                  player,
                );

              const image =
                player.portraitImage ??
                player.heroImage;

              return (
                <motion.div
                  key={player.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{
                    once: true,
                    amount: 0.18,
                  }}
                  variants={reveal}
                  transition={{
                    duration: 0.55,
                    delay:
                      index *
                      0.06,
                  }}
                  className="w-[88vw] shrink-0 snap-center sm:w-[58vw] md:w-[45vw] lg:w-auto"
                >
                  <Link
                    href={
                      metadata.href
                    }
                    className="group relative block min-h-[600px] overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#071021] shadow-[0_32px_90px_rgba(0,0,0,.45)] transition duration-500 hover:-translate-y-2 hover:border-[#d7ff00]/60 hover:shadow-[0_42px_120px_rgba(0,0,0,.62)] sm:min-h-[630px] lg:min-h-[600px] xl:min-h-[640px]"
                  >
                    <div className="absolute inset-x-0 top-0 h-[74%] overflow-hidden">
                      {image ? (
                        <>
                          <Image
                            src={image}
                            alt=""
                            fill
                            aria-hidden="true"
                            sizes="(max-width: 640px) 88vw, (max-width: 1024px) 45vw, 20vw"
                            className="scale-110 object-cover opacity-28 blur-2xl saturate-90 transition duration-700 group-hover:scale-[1.2] group-hover:opacity-40"
                          />

                          <div className="absolute inset-0 bg-[#071021]/20" />

                          <Image
                            src={image}
                            alt={`${player.name} champion collection`}
                            fill
                            sizes="(max-width: 640px) 88vw, (max-width: 1024px) 45vw, 20vw"
                            className={`object-cover transition duration-1000 ease-out group-hover:scale-[1.07] ${metadata.position}`}
                          />
                        </>
                      ) : (
                        <div className="absolute inset-0 grid place-items-center bg-[#071021]">
                          <UserRound className="h-20 w-20 text-white/10" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,8,18,.10)_0%,transparent_46%,rgba(3,8,18,.32)_100%)]" />
                    </div>

                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_42%,rgba(5,11,24,.24)_62%,rgba(5,11,24,.98)_78%,#050b18_100%)]" />

                    <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between p-6 sm:p-7">
                      <span className="rounded-full border border-white/20 bg-[#030812]/60 px-3 py-2 text-[8px] font-black uppercase tracking-[0.2em] text-white/80 backdrop-blur-xl">
                        {
                          metadata.badge
                        }
                      </span>

                      <span className="rounded-full border border-white/10 bg-[#030812]/35 px-3 py-2 text-[8px] font-black uppercase tracking-[0.2em] text-white/60 backdrop-blur-xl">
                        Gallery{" "}
                        {String(
                          index + 1,
                        ).padStart(
                          2,
                          "0",
                        )}
                      </span>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-7">
                      <div className="mb-5 flex items-center justify-between gap-4 border-b border-white/12 pb-4">
                        <p className="truncate text-[9px] font-black uppercase tracking-[0.22em] text-[#d7ff00]">
                          {
                            metadata.era
                          }
                        </p>

                        <p className="shrink-0 text-[8px] font-bold uppercase tracking-[0.16em] text-white/45">
                          {
                            metadata.period
                          }
                        </p>
                      </div>

                      <h3 className="text-[clamp(1.65rem,2vw,2.35rem)] font-black uppercase leading-[0.88] tracking-[-0.055em] text-white">
                        {player.name}
                      </h3>

                      <div className="mt-7 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-[0.22em] text-white/75 transition group-hover:text-white">
                          Enter gallery
                        </span>

                        <span className="grid h-12 w-12 place-items-center rounded-full border border-[#d7ff00]/75 text-[#d7ff00] transition duration-300 group-hover:rotate-[-8deg] group-hover:border-[#d7ff00] group-hover:bg-[#d7ff00] group-hover:text-[#030812] group-hover:shadow-[0_0_28px_rgba(215,255,0,.3)]">
                          <ArrowRight
                            size={17}
                          />
                        </span>
                      </div>
                    </div>

                    <div
                      className="pointer-events-none absolute inset-[1px] rounded-[1.72rem] border border-white/[0.04]"
                    />

                    <div
                      className="absolute left-0 top-0 h-1 w-0 transition-all duration-700 group-hover:w-full"
                      style={{
                        backgroundColor:
                          player.accent,
                      }}
                    />

                    <div
                      className="pointer-events-none absolute -bottom-24 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full opacity-0 blur-[80px] transition duration-700 group-hover:opacity-10"
                      style={{
                        backgroundColor:
                          player.accent,
                      }}
                    />
                  </Link>
                </motion.div>
              );
            },
          )}
        </div>
      </div>
    </section>
  );
}