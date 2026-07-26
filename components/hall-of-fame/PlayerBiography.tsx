"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import type { PlayerProfile } from "@/data/players";

type Props = {
  player: PlayerProfile;
};


export default function PlayerBiography({
  player,
}: Props) {
  const accentColor = player.theme.accent;

  const careerPeriod =
    player.status === "active"
      ? `${player.turnedPro} — Present`
      : `${player.turnedPro} — ${player.retiredYear ?? "—"}`;

  const playerStatus =
    player.status === "active"
      ? "Active"
      : `Retired${player.retiredYear ? ` · ${player.retiredYear}` : ""}`;

  return (
    <section
      id="biography"
      className="relative isolate overflow-hidden border-b border-white/10 bg-[#050B18] py-24 sm:py-32 lg:py-40"
      style={
        {
          "--player-accent": accentColor,
        } as React.CSSProperties
      }
    >
      <div className="pointer-events-none absolute inset-0 -z-20">
        <div
          className="absolute -left-72 top-[12%] h-[640px] w-[640px] rounded-full opacity-[0.07] blur-[210px]"
          style={{ backgroundColor: accentColor }}
        />
        <div
          className="absolute -right-72 bottom-[2%] h-[620px] w-[620px] rounded-full opacity-[0.055] blur-[220px]"
          style={{ backgroundColor: accentColor }}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:90px_90px] opacity-35" />

      <motion.p
        initial={{ opacity: 0, x: 80 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
        className="pointer-events-none absolute -right-[0.05em] top-[8%] -z-10 hidden select-none text-[24vw] font-black leading-none tracking-[-0.12em] text-white/[0.025] lg:block"
      >
        {player.initials}
      </motion.p>

      <div className="relative mx-auto w-full max-w-[1700px] px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-8 border-b border-white/10 pb-10 sm:pb-12 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <div className="flex items-center gap-4">
              <span className="h-px w-10" style={{ backgroundColor: accentColor }} />
              <p
                className="text-[9px] font-black uppercase tracking-[0.38em] sm:text-[10px]"
                style={{ color: accentColor }}
              >
                Curator&apos;s Note
              </p>
            </div>

            <h2 className="mt-7 max-w-5xl text-[clamp(3.4rem,7vw,7.8rem)] font-black leading-[0.84] tracking-[-0.075em] text-white">
              The story behind
              <span className="block text-white/30">the champion.</span>
            </h2>
          </div>

          <div className="max-w-sm lg:text-right">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/28">
              Permanent Collection
            </p>
            <p className="mt-3 text-sm leading-7 text-white/48">
              A museum portrait of {player.name}, documenting the person,
              the era and the visual identity behind the achievements.
            </p>
          </div>
        </motion.div>

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-[minmax(0,1.08fr)_minmax(420px,0.92fr)] lg:gap-14 xl:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -48 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative min-h-[520px] overflow-hidden rounded-[30px] border border-white/10 bg-[#08101F] sm:min-h-[680px] lg:min-h-[780px]">
              <Image
                src={player.image}
                alt={`${player.name} museum portrait`}
                fill
                sizes="(max-width: 1024px) 100vw, 56vw"
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030812] via-[#030812]/5 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#030812]/55 via-transparent to-transparent" />
              <div
                className="absolute inset-x-0 bottom-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
                }}
              />

              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
                <div className="flex flex-col gap-6 border-t border-white/15 pt-6 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/34">
                      Portrait
                    </p>
                    <p className="mt-3 text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">
                      {player.name}
                    </p>
                    <p
                      className="mt-2 text-[9px] font-black uppercase tracking-[0.28em]"
                      style={{ color: accentColor }}
                    >
                      {player.nickname}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-[8px] font-black uppercase tracking-[0.28em] text-white/30">
                      Career
                    </p>
                    <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-white/65">
                      {careerPeriod}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -bottom-6 right-6 hidden min-w-[205px] rounded-[22px] border border-white/10 bg-[#07101F]/95 p-6 shadow-2xl backdrop-blur-xl sm:block lg:-right-7"
            >
              <p className="text-[8px] font-black uppercase tracking-[0.28em] text-white/30">
                Museum Record
              </p>
              <p className="mt-3 text-2xl font-black tracking-[-0.05em] text-white">
                #{player.highestRanking}
              </p>
              <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.24em] text-white/38">
                Highest ranking
              </p>
              <div
                className="mt-5 h-px w-full"
                style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }}
              />
            </motion.div>
          </motion.div>

          <div className="flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 38 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-[28px] border border-white/10 bg-[#07101F]/78 p-7 backdrop-blur-xl sm:p-9 lg:p-10"
            >
              <BiographyBlock
                index="01"
                eyebrow="Biography"
                title="The person behind the legacy"
                text={player.biography}
                accentColor={accentColor}
              />

              <div className="my-9 h-px bg-gradient-to-r from-white/15 via-white/5 to-transparent" />

              <BiographyBlock
                index="02"
                eyebrow="Museum Perspective"
                title="Why this story belongs in the archive"
                text={player.museumDescription}
                accentColor={accentColor}
              />
            </motion.div>

            <motion.blockquote
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.85, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className="relative mt-8 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035] p-7 sm:p-9"
            >
              <span
                aria-hidden="true"
                className="absolute -right-1 -top-8 text-[150px] font-black leading-none opacity-[0.08]"
                style={{ color: accentColor }}
              >
                “
              </span>

              <p className="relative max-w-xl text-xl font-semibold leading-9 tracking-[-0.025em] text-white sm:text-2xl sm:leading-10">
                “{player.signature}”
              </p>

              <div className="relative mt-7 flex items-center gap-4">
                <span className="h-px w-10" style={{ backgroundColor: accentColor }} />
                <p className="text-[8px] font-black uppercase tracking-[0.29em] text-white/36">
                  Defining identity
                </p>
              </div>
            </motion.blockquote>

            <motion.div
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 overflow-hidden rounded-[28px] border border-white/10 bg-[#08111F]"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 sm:px-8">
                <div>
                  <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/28">
                    Archive Classification
                  </p>
                  <p className="mt-2 text-sm font-bold text-white/75">
                    Player information
                  </p>
                </div>

                <span
                  className="h-2.5 w-2.5 rounded-full shadow-[0_0_24px_currentColor]"
                  style={{ color: accentColor, backgroundColor: accentColor }}
                />
              </div>

              <div className="grid sm:grid-cols-2">
                <MuseumInfo label="Country" value={player.country} code="01" />
                <MuseumInfo label="Born" value={player.born} code="02" />
                <MuseumInfo label="Birthplace" value={player.birthplace} code="03" />
                <MuseumInfo label="Turned Pro" value={player.turnedPro.toString()} code="04" />
                <MuseumInfo label="Playing Hand" value={player.playingHand} code="05" />
                <MuseumInfo label="Backhand" value={player.backhand} code="06" />
                <MuseumInfo label="Status" value={playerStatus} code="07" />
                <MuseumInfo label="Career Span" value={careerPeriod} code="08" />
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-24 sm:mt-32 lg:mt-40"
        >
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/16 to-transparent" />
          <div className="mt-8 flex flex-col items-center justify-between gap-7 text-center sm:flex-row sm:text-left">
            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/28">
                Continue the Exhibition
              </p>
              <p className="mt-3 text-xl font-black tracking-[-0.035em] text-white sm:text-2xl">
                The career timeline
              </p>
            </div>

            <a
              href="#timeline"
              className="group flex items-center gap-5 rounded-full border border-white/12 bg-white/[0.04] px-6 py-4 transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.07]"
            >
              <span className="text-[9px] font-black uppercase tracking-[0.27em] text-white/60 transition-colors duration-300 group-hover:text-white">
                Continue
              </span>
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full text-base text-black transition-transform duration-500 group-hover:translate-y-1"
                style={{ backgroundColor: accentColor }}
              >
                ↓
              </span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

type BiographyBlockProps = {
  index: string;
  eyebrow: string;
  title: string;
  text: string;
  accentColor: string;
};

function BiographyBlock({
  index,
  eyebrow,
  title,
  text,
  accentColor,
}: BiographyBlockProps) {
  return (
    <div className="relative">
      <div className="flex items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <span className="h-px w-8" style={{ backgroundColor: accentColor }} />
          <p
            className="text-[8px] font-black uppercase tracking-[0.3em]"
            style={{ color: accentColor }}
          >
            {eyebrow}
          </p>
        </div>
        <span className="text-[8px] font-black tracking-[0.24em] text-white/20">
          {index}
        </span>
      </div>

      <h3 className="mt-6 max-w-xl text-2xl font-black leading-tight tracking-[-0.045em] text-white sm:text-3xl">
        {title}
      </h3>
      <p className="mt-6 text-base leading-8 text-white/48 sm:text-lg sm:leading-9">
        {text}
      </p>
    </div>
  );
}

type MuseumInfoProps = {
  label: string;
  value: string;
  code: string;
};

function MuseumInfo({ label, value, code }: MuseumInfoProps) {
  return (
    <div className="group relative min-h-[142px] border-b border-white/10 p-6 odd:sm:border-r sm:p-7">
      <span className="absolute right-5 top-5 text-[8px] font-black tracking-[0.24em] text-white/16">
        {code}
      </span>
      <p className="text-[8px] font-black uppercase tracking-[0.29em] text-white/28">
        {label}
      </p>
      <p className="mt-5 max-w-[90%] text-base font-bold leading-7 text-white/78 transition-colors duration-300 group-hover:text-white">
        {value}
      </p>
      <div className="absolute bottom-0 left-0 h-px w-0 bg-white/40 transition-all duration-700 group-hover:w-full" />
    </div>
  );
}