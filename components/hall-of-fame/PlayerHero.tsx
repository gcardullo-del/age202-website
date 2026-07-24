"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import type {
  PlayerProfile,
  PlayerSlug,
} from "@/data/players";

type Props = {
  player: PlayerProfile;
  archivePieces: number;
};

const playerAccentColors: Record<PlayerSlug, string> = {
  federer: "#C8FF00",
  nadal: "#FF7A18",
  djokovic: "#4EA5FF",
  sinner: "#8DFF61",
  alcaraz: "#FFD54A",
};

const playerExhibitNumbers: Record<PlayerSlug, string> = {
  federer: "01",
  nadal: "02",
  djokovic: "03",
  sinner: "04",
  alcaraz: "05",
};

export default function PlayerHero({
  player,
  archivePieces,
}: Props) {
  const accentColor = player.theme.accent;

  const exhibitNumber =
    playerExhibitNumbers[player.slug] ?? "00";

  const careerPeriod =
    player.status === "active"
      ? `${player.turnedPro} — Present`
      : `${player.turnedPro} — ${player.retiredYear ?? "—"}`;

  return (
    <section
  id="hero"
  className="relative isolate min-h-[100svh] overflow-hidden border-b border-white/10 bg-[#030812]"
      style={
        {
          "--player-accent": accentColor,
        } as React.CSSProperties
      }
    >
      {/* PLAYER IMAGE */}

      <motion.div
        initial={{
          opacity: 0,
          scale: 1.08,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 1.35,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="absolute inset-x-0 top-0 h-[58%] sm:h-[64%] lg:inset-y-0 lg:left-auto lg:right-0 lg:h-full lg:w-[58%] xl:w-[61%]"
      >
        <Image
          src={player.heroImage}
          alt={player.name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 62vw"
          className="object-cover object-top lg:object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-[#030812]/10 via-[#030812]/5 to-[#030812] lg:bg-gradient-to-r lg:from-[#030812] lg:via-[#030812]/25 lg:to-transparent" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#030812] via-transparent to-[#030812]/30 lg:from-[#030812]/80" />
      </motion.div>

      {/* AMBIENT LIGHT */}

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -left-48 top-1/3 h-[600px] w-[600px] rounded-full opacity-[0.09] blur-[190px]"
          style={{
            backgroundColor: accentColor,
          }}
        />

        <div
          className="absolute right-[8%] top-[12%] h-[450px] w-[450px] rounded-full opacity-[0.07] blur-[160px]"
          style={{
            backgroundColor: accentColor,
          }}
        />
      </div>

      {/* MUSEUM GRID */}

      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:90px_90px] opacity-40" />

      {/* LARGE INITIALS */}

      <motion.p
        initial={{
          opacity: 0,
          x: 80,
        }}
        animate={{
          opacity: 1,
          x: 0,
        }}
        transition={{
          duration: 1.2,
          delay: 0.2,
          ease: [0.22, 1, 0.36, 1],
        }}
        aria-hidden="true"
        className="pointer-events-none absolute right-[-0.05em] top-[18%] hidden select-none text-[26vw] font-black leading-none tracking-[-0.12em] text-white/[0.035] lg:block"
      >
        {player.initials}
      </motion.p>

      {/* EXHIBIT NUMBER */}

      <div className="pointer-events-none absolute right-6 top-24 z-20 hidden text-right lg:block xl:right-10">
        <motion.p
          initial={{
            opacity: 0,
            y: -18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
            delay: 0.75,
          }}
          className="text-[9px] font-black uppercase tracking-[0.32em] text-white/45"
        >
          Permanent Exhibit
        </motion.p>

        <motion.p
          initial={{
            opacity: 0,
            y: 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
            delay: 0.85,
          }}
          className="mt-2 text-5xl font-black tracking-[-0.06em] text-white"
        >
          {exhibitNumber}
        </motion.p>
      </div>

      {/* CONTENT */}

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1700px] flex-col justify-end px-6 pb-10 pt-[49vh] sm:px-8 sm:pb-12 sm:pt-[56vh] md:px-10 lg:justify-center lg:pb-12 lg:pt-32">
        <div className="max-w-[850px] lg:w-[55%]">
          {/* MUSEUM LABEL */}

          <motion.div
            initial={{
              opacity: 0,
              y: 24,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-wrap items-center gap-4"
          >
            <span
              className="h-px w-10"
              style={{
                backgroundColor: accentColor,
              }}
            />

            <p
              className="text-[9px] font-black uppercase tracking-[0.38em] sm:text-[10px]"
              style={{
                color: accentColor,
              }}
            >
              Hall of Fame · Exhibit {exhibitNumber}
            </p>

            <span className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.24em] text-white/50 backdrop-blur-md">
              {player.countryCode}
            </span>
          </motion.div>

          {/* PLAYER NAME */}

          <motion.h1
            initial={{
              opacity: 0,
              y: 55,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 1,
              delay: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-7 text-[clamp(4rem,9.6vw,9.4rem)] font-black leading-[0.76] tracking-[-0.085em] text-white lg:mt-9"
          >
            <span className="block">
              {player.firstName}
            </span>

            <span className="block text-white/32">
              {player.lastName}
            </span>
          </motion.h1>

          {/* NICKNAME */}

          <motion.div
            initial={{
              opacity: 0,
              y: 28,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.48,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-7 flex items-center gap-4 lg:mt-9"
          >
            <span
              className="text-xl sm:text-2xl"
              style={{
                color: accentColor,
              }}
            >
              “
            </span>

            <p className="text-sm font-black uppercase tracking-[0.22em] text-white/80 sm:text-base">
              {player.nickname}
            </p>
          </motion.div>

          {/* SIGNATURE */}

          <motion.p
            initial={{
              opacity: 0,
              y: 24,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.58,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-6 max-w-2xl text-sm leading-7 text-white/52 sm:text-base sm:leading-8 lg:text-lg lg:leading-9"
          >
            {player.signature}
          </motion.p>

          {/* CTA AND CAREER */}

          <motion.div
            initial={{
              opacity: 0,
              y: 28,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.85,
              delay: 0.68,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center lg:mt-10"
          >
            <Link
              href={`/archives/${player.slug}`}
              className="group relative inline-flex min-h-16 w-fit items-center gap-6 overflow-hidden rounded-full border px-7 transition-all duration-500 hover:-translate-y-1"
              style={{
                borderColor: `${accentColor}66`,
                backgroundColor: accentColor,
                boxShadow: `0 20px 70px ${accentColor}20`,
              }}
            >
              <span className="absolute inset-0 translate-y-full bg-white transition-transform duration-500 group-hover:translate-y-0" />

              <span className="relative z-10 text-[9px] font-black uppercase tracking-[0.3em] text-black sm:text-[10px]">
                Explore the Collection
              </span>

              <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black text-lg transition-transform duration-500 group-hover:-rotate-12">
                <span
                  style={{
                    color: accentColor,
                  }}
                >
                  →
                </span>
              </span>
            </Link>

            <div className="flex items-center gap-4 sm:pl-2">
              <span className="h-9 w-px bg-white/15" />

              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/30">
                  Professional Career
                </p>

                <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-white/65">
                  {careerPeriod}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* STATISTICS */}

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.9,
            delay: 0.78,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-[24px] border border-white/10 bg-white/10 backdrop-blur-xl sm:grid-cols-4 lg:mt-14 lg:max-w-5xl"
        >
          <HeroStat
            value={player.careerTitles}
            label="Career Titles"
            accentColor={accentColor}
          />

          <HeroStat
            value={player.grandSlamTitles}
            label="Grand Slams"
            accentColor={accentColor}
          />

          <HeroStat
            value={player.weeksAtNumberOne}
            label="Weeks No. 1"
            accentColor={accentColor}
          />

          <HeroStat
            value={archivePieces}
            label="Archive Pieces"
            accentColor={accentColor}
          />
        </motion.div>

        {/* LOWER MUSEUM DETAILS */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 1,
            delay: 1,
          }}
          className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-5 text-[8px] font-black uppercase tracking-[0.25em] text-white/28 sm:flex-row sm:items-center sm:justify-between lg:mt-8"
        >
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <span>{player.country}</span>
            <span>Highest ranking #{player.highestRanking}</span>
            <span>{player.playingHand}</span>
          </div>

          <span>
            AGE202 Digital Museum
          </span>
        </motion.div>
      </div>

      {/* SCROLL INDICATOR */}

      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 1,
          delay: 1.15,
        }}
        className="absolute bottom-10 right-10 z-20 hidden items-center gap-4 xl:flex"
      >
        <p className="text-[8px] font-black uppercase tracking-[0.32em] text-white/30">
          Enter the exhibition
        </p>

        <div className="flex h-12 w-7 justify-center rounded-full border border-white/15 pt-2">
          <motion.span
            animate={{
              y: [0, 14, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor: accentColor,
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}

type HeroStatProps = {
  value: number;
  label: string;
  accentColor: string;
};

function HeroStat({
  value,
  label,
  accentColor,
}: HeroStatProps) {
  return (
    <div className="group relative min-h-[130px] overflow-hidden bg-[#07101F]/88 p-5 transition-colors duration-500 hover:bg-[#0A1628] sm:min-h-[150px] sm:p-6 lg:min-h-[160px] lg:p-7">
      <div
        className="absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-700 group-hover:w-full"
        style={{
          backgroundColor: accentColor,
        }}
      />

      <div
        className="absolute -right-10 -top-10 h-24 w-24 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20"
        style={{
          backgroundColor: accentColor,
        }}
      />

      <p className="relative text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl">
        {value}
      </p>

      <p className="relative mt-5 text-[8px] font-black uppercase tracking-[0.27em] text-white/34 sm:text-[9px]">
        {label}
      </p>
    </div>
  );
}