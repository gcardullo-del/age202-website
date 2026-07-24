"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  AccentLine,
  Divider,
  GlassCard,
  Label,
  MuseumButton,
  SectionNumber,
  Stat,
} from "@/components/museum-ui";

import type { ChampionComponentProps } from "./types";

export default function ChampionDetails({
  champion,
  activeIndex,
}: ChampionComponentProps) {
  const shouldReduceMotion = useReducedMotion();

  const collectionNumber = String(
    activeIndex + 1
  ).padStart(2, "0");

  const archiveIdentity = `AGE-CHAMPION-${champion.slug
    .replaceAll("-", "")
    .toUpperCase()}`;

  const headingId = `champion-${champion.slug}-title`;

  return (
    <div
      aria-labelledby={headingId}
      className="relative flex min-h-[760px] flex-col justify-between overflow-hidden px-6 py-12 sm:px-10 md:px-12 md:py-16 lg:min-h-full lg:px-12 lg:py-16 xl:px-16 xl:py-20 2xl:px-20"
    >
      {/* Decorative collection number */}

      <SectionNumber
        value={collectionNumber}
        color={champion.accent}
        className="right-0 top-2 text-[150px] sm:text-[240px] xl:text-[300px]"
      />

      {/* Ambient accent glow */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-1/3 h-80 w-80 rounded-full blur-[130px]"
        style={{
          backgroundColor: `${champion.accent}0D`,
        }}
      />

      {/* Champion content */}

      <AnimatePresence mode="wait">
        <motion.div
          key={champion.id}
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 34,
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
                  y: -22,
                  filter: "blur(6px)",
                }
          }
          transition={{
            duration: shouldReduceMotion
              ? 0
              : 0.68,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative z-10"
        >
          {/* Section label */}

          <div className="flex items-center gap-4">
            <AccentLine
              color={champion.accent}
              width={48}
            />

            <Label color={champion.accent}>
              The champions
            </Label>
          </div>

          {/* Collection metadata */}

          <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Label className="font-mono">
              Collection {collectionNumber}
            </Label>

            <span
              aria-hidden="true"
              className="h-1 w-1 rounded-full bg-white/20"
            />

            <Label className="font-mono">
              {champion.nationality}
            </Label>
          </div>

          {/* Champion name */}

          <h2
            id={headingId}
            className="mt-6 text-[clamp(3.25rem,5vw,6.8rem)] font-black leading-[0.84] tracking-[-0.07em] text-white"
          >
            <span className="block text-white/30">
              {champion.firstName}
            </span>

            <span className="block">
              {champion.lastName}
            </span>
          </h2>

          {/* Nickname */}

          <div className="mt-8 flex items-center gap-4">
            <Label
              color={champion.accent}
              dot
            >
              {champion.nickname}
            </Label>
          </div>

          {/* Description */}

          <p className="mt-8 max-w-2xl text-base leading-8 text-gray-400 sm:text-[17px] xl:text-lg xl:leading-9">
            {champion.description}
          </p>

          {/* Quote */}

          <GlassCard
            accent={champion.accent}
            animated={false}
            className="mt-9 max-w-2xl rounded-2xl"
          >
            <blockquote className="relative px-7 py-6 text-sm italic leading-7 text-gray-400 sm:px-8 sm:py-7 sm:text-[15px] sm:leading-8">
              <span
                aria-hidden="true"
                className="absolute bottom-6 left-0 top-6 w-px"
                style={{
                  backgroundColor:
                    champion.accent,
                  boxShadow: `0 0 18px ${champion.accent}`,
                }}
              />

              <span
                aria-hidden="true"
                className="absolute right-6 top-2 font-serif text-7xl leading-none text-white/[0.035]"
              >
                “
              </span>

              <span className="relative z-10">
                “{champion.quote}”
              </span>
            </blockquote>
          </GlassCard>

          {/* Statistics */}

          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Stat
              label="Professional debut"
              value={champion.debutYear}
              accent={champion.accent}
              className="rounded-2xl"
            />

            <Stat
              label="Main brand"
              value={champion.mainBrand}
              accent={champion.accent}
              className="rounded-2xl"
            />

            <Stat
              label="Archive pieces"
              value={champion.archivePieces}
              accent={champion.accent}
              className="rounded-2xl"
            />
          </div>

          {/* Actions */}

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <MuseumButton
              href={`/archive?player=${champion.slug}#archive-explorer`}
              icon="→"
              className="min-h-[54px] justify-center sm:min-w-[230px]"
            >
              Explore collection
            </MuseumButton>

            <MuseumButton
              href={`/hall-of-fame/${champion.slug}`}
              variant="secondary"
              className="min-h-[54px] justify-center sm:min-w-[205px]"
            >
              Champion profile
            </MuseumButton>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Archive footer */}

      <div className="relative z-10 mt-14">
        <Divider
          accent
          color={champion.accent}
        />

        <div className="flex flex-col gap-5 pt-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Label className="font-mono">
              Archive identity
            </Label>

            <p className="mt-2 break-all font-mono text-[9px] uppercase tracking-[0.2em] text-white/55">
              {archiveIdentity}
            </p>
          </div>

          <Label
            color={champion.accent}
            dot
            className="font-mono"
          >
            Curated archive
          </Label>
        </div>
      </div>
    </div>
  );
}