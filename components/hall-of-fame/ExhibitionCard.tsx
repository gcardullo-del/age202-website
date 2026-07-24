"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { players } from "@/data/players";

type ExhibitionCardProps = {
  player: (typeof players)[number];
  exhibitNumber: number;
  archivePieces: number;
  accentColor?: string;
};

export default function ExhibitionCard({
  player,
  exhibitNumber,
  archivePieces,
  accentColor = "#C8FF00",
}: ExhibitionCardProps) {
  const exhibit = String(exhibitNumber).padStart(2, "0");

  const status =
    player.status === "active"
      ? "Active Player"
      : "Permanent Collection";

  const career =
  player.status === "active"
    ? "Active Career"
    : `Retired ${player.retiredYear ?? ""}`.trim();

  return (
    <motion.article
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative"
    >
      <Link
        href={`/hall-of-fame/${player.slug}`}
        className="group relative block min-h-[860px] overflow-hidden rounded-[34px] border border-white/10 bg-[#07101F] shadow-[0_45px_130px_rgba(0,0,0,0.42)] transition-all duration-700 hover:border-white/20 lg:min-h-[900px]"
      >
        {/* AMBIENT BACKGROUND */}

        <div
          className="pointer-events-none absolute -left-40 top-20 h-[520px] w-[520px] rounded-full opacity-[0.08] blur-[180px] transition-all duration-1000 group-hover:opacity-[0.16]"
          style={{ backgroundColor: accentColor }}
        />

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.025] via-transparent to-black/40" />

        {/* LARGE INITIALS */}

        <motion.p
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.2 }}
          className="pointer-events-none absolute -right-4 top-16 z-10 text-[170px] font-black leading-none tracking-[-0.12em] text-white/[0.035] transition-all duration-1000 group-hover:-translate-y-3 group-hover:text-white/[0.065] md:text-[250px]"
        >
          {player.initials}
        </motion.p>

        <div className="relative grid min-h-[860px] lg:min-h-[900px] lg:grid-cols-[0.92fr_1.08fr]">
          {/* CONTENT */}

          <div className="relative z-20 flex flex-col justify-between px-7 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-14 xl:px-16">
            <div>
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div>
                  <p
                    className="text-[10px] font-black uppercase tracking-[0.38em]"
                    style={{ color: accentColor }}
                  >
                    Permanent Exhibit {exhibit}
                  </p>

                  <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
                    AGE202 Hall of Fame
                  </p>
                </div>

                <span className="rounded-full border border-white/15 bg-white/[0.045] px-4 py-2 text-[9px] font-black uppercase tracking-[0.24em] text-white/75 backdrop-blur-xl">
                  {status}
                </span>
              </div>

              <div className="mt-16 lg:mt-24">
                <div className="flex items-center gap-4">
                  <span
                    className="h-px w-14"
                    style={{ backgroundColor: accentColor }}
                  />

                  <p
                    className="text-[10px] font-black uppercase tracking-[0.38em]"
                    style={{ color: accentColor }}
                  >
                    {player.signature}
                  </p>
                </div>

                <h2 className="mt-7 text-[clamp(4rem,8vw,8rem)] font-black leading-[0.78] tracking-[-0.085em] text-white">
                  <span className="block">
                    {player.firstName}
                  </span>

                  <span className="block text-white/38 transition-colors duration-700 group-hover:text-white">
                    {player.lastName}
                  </span>
                </h2>

                <p className="mt-8 max-w-xl text-base leading-8 text-white/55 md:text-lg">
                  A permanent exhibition dedicated to one of tennis&apos; most
                  defining careers, preserving the achievements, identity and
                  apparel that shaped an era.
                </p>
              </div>
            </div>

            <div className="mt-16">
              <div className="grid grid-cols-2 gap-x-8 gap-y-8 border-y border-white/10 py-8 sm:grid-cols-4">
                <ExhibitionStat
                  value={player.grandSlamTitles}
                  label="Grand Slams"
                />

                <ExhibitionStat
                  value={player.careerTitles}
                  label="Career Titles"
                />

                <ExhibitionStat
                  value={player.weeksAtNumberOne}
                  label="Weeks at No.1"
                />

                <ExhibitionStat
                  value={archivePieces}
                  label="Archive Pieces"
                />
              </div>

              <div className="mt-9 flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
                <div className="grid grid-cols-2 gap-x-10 gap-y-6 text-sm">
                  <MuseumDetail
                    label="Nationality"
                    value={player.country}
                  />

                  <MuseumDetail
                    label="Career"
                    value={career}
                  />

                  <MuseumDetail
                    label="Exhibit"
                    value={exhibit}
                  />

                  <MuseumDetail
                    label="Collection"
                    value={status}
                  />
                </div>

                <div className="flex items-center gap-5">
                  <span
                    className="text-[10px] font-black uppercase tracking-[0.32em] text-white/65 transition-colors duration-500"
                    style={
                      {
                        "--hover-color": accentColor,
                      } as React.CSSProperties
                    }
                  >
                    Explore exhibition
                  </span>

                  <span
                    className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/[0.04] text-2xl text-white backdrop-blur-xl transition-all duration-500 group-hover:-rotate-12 group-hover:border-transparent group-hover:text-black"
                    style={
                      {
                        "--accent-color": accentColor,
                      } as React.CSSProperties
                    }
                  >
                    <span
                      className="absolute inset-0 -z-10 scale-0 rounded-full transition-transform duration-500 group-hover:scale-100"
                      style={{ backgroundColor: accentColor }}
                    />

                    →
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* PLAYER IMAGE */}

          <div className="relative min-h-[620px] overflow-hidden border-t border-white/10 lg:min-h-full lg:border-l lg:border-t-0">
            <motion.div
              initial={{ scale: 1.08, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 1.25,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute inset-0"
            >
              <Image
                src={player.heroImage}
                alt={player.name}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover object-top brightness-[0.82] contrast-[1.05] saturate-[0.88] transition-all duration-[1600ms] ease-out group-hover:scale-[1.055] group-hover:brightness-100 group-hover:contrast-[1.08] group-hover:saturate-100"
              />
            </motion.div>

            <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-[#050B18]/15 to-transparent lg:bg-gradient-to-r lg:from-[#07101F] lg:via-[#07101F]/15 lg:to-transparent" />

            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050B18]/50" />

            <div
              className="pointer-events-none absolute bottom-[-160px] right-[-140px] h-[520px] w-[520px] rounded-full opacity-[0.08] blur-[170px] transition-all duration-1000 group-hover:opacity-[0.2]"
              style={{ backgroundColor: accentColor }}
            />

            <div className="absolute bottom-8 right-8 hidden rounded-[24px] border border-white/15 bg-[#050B18]/45 p-6 backdrop-blur-2xl sm:block lg:bottom-10 lg:right-10">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">
                Museum reference
              </p>

              <p className="mt-3 text-sm font-black uppercase tracking-[0.22em] text-white">
                {player.country}
              </p>

              <div className="mt-5 h-px w-full bg-white/10" />

              <p
                className="mt-5 text-[10px] font-black uppercase tracking-[0.28em]"
                style={{ color: accentColor }}
              >
                Exhibit {exhibit}
              </p>
            </div>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 z-30 h-[3px] w-0 transition-all duration-1000 group-hover:w-full"
          style={{ backgroundColor: accentColor }}
        />
      </Link>
    </motion.article>
  );
}

function ExhibitionStat({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div>
      <p className="text-3xl font-black tracking-[-0.055em] text-white md:text-4xl">
        {value}
      </p>

      <p className="mt-2 text-[8px] font-black uppercase tracking-[0.26em] text-white/38">
        {label}
      </p>
    </div>
  );
}

function MuseumDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[8px] font-black uppercase tracking-[0.28em] text-white/30">
        {label}
      </p>

      <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-white/75">
        {value}
      </p>
    </div>
  );
}