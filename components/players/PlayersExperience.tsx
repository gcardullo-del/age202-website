"use client";


import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Crown,
  Globe2,
  LibraryBig,
  MapPin,
  Shirt,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";

export type FeaturedPlayerCard = {
  id: string;
  name: string;
  slug: string;
  country: string | null;
  biography: string | null;
  heroImage: string | null;
  portraitImage: string | null;
  debutYear: number | null;
  accent: string;
  artifactCount: number;
  href: string;
};

export type NationSummary = {
  country: string;
  count: number;
};

type PlayersExperienceProps = {
  featuredPlayers: FeaturedPlayerCard[];
  atpPlayerCount: number;
  totalArtifactCount: number;
  nations: NationSummary[];
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const easePremium = [0.22, 1, 0.36, 1] as const;

function playerSummary(player: FeaturedPlayerCard): string {
  if (player.biography?.trim()) {
    const clean = player.biography.trim();

    return clean.length > 155
      ? `${clean.slice(0, 152).trim()}…`
      : clean;
  }

  const details = [
    player.country,
    player.debutYear
      ? `Professional archive since ${player.debutYear}`
      : null,
  ].filter(Boolean);

  return (
    details.join(" · ") ||
    "An essential gallery in the AGE202 tennis archive."
  );
}

function artifactLabel(count: number): string {
  return count === 1 ? "1 archived piece" : `${count} archived pieces`;
}

type ArchiveGatewayCardProps = {
  index: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  visual: string;
  accent: string;
  background: string;
  image?: string;
  imageAlt?: string;
  imagePosition?: string;
  imageFit?: "cover" | "contain";
  wide?: boolean;
};

function ArchiveGatewayCard({
  index,
  eyebrow,
  title,
  description,
  href,
  cta,
  visual,
  accent,
  background,
  image,
  imageAlt,
  imagePosition = "object-center",
  imageFit = "cover",
  wide = false,
}: ArchiveGatewayCardProps) {
  return (
    <motion.article
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUp}
      transition={{ duration: 0.65, ease: easePremium }}
      className={`group relative overflow-hidden rounded-[30px] border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.28)] transition duration-500 hover:-translate-y-1 hover:border-white/20 ${
        wide
          ? "h-[330px] sm:h-[360px]"
          : "aspect-[16/8.5] min-h-[330px]"
      }`}
      style={{ background }}
    >
      {image ? (
        <>
          {imageFit === "contain" ? (
            <div className="absolute inset-0 bg-[#050B18]" />
          ) : null}

          <Image
            src={image}
            alt={imageAlt ?? ""}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className={`transition duration-700 ease-out ${
              imageFit === "contain"
                ? "object-contain"
                : "object-cover group-hover:scale-[1.025]"
            } ${imagePosition}`}
          />

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,7,17,0.14)_0%,rgba(3,7,17,0.34)_38%,rgba(3,7,17,0.96)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,7,17,0.50)_0%,rgba(3,7,17,0.10)_65%,rgba(3,7,17,0.22)_100%)]" />
        </>
      ) : null}

      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: accent }}
      />

      {!image ? (
        <div
          aria-hidden="true"
          className="absolute -right-8 top-16 select-none text-[8rem] font-black uppercase leading-none tracking-[-0.09em] opacity-[0.055] sm:text-[10rem]"
          style={{ color: accent }}
        >
          {visual}
        </div>
      ) : null}

      {!image ? (
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(3,7,17,0.16)_38%,rgba(3,7,17,0.96)_100%)]" />
      ) : null}

      <div className="relative flex h-full min-h-[330px] flex-col justify-between p-6 sm:p-7">
        <div className="flex items-start justify-between gap-5">
          <span
            className="rounded-full border px-3 py-2 font-mono text-[8px] font-black uppercase tracking-[0.2em]"
            style={{
              borderColor: `${accent}55`,
              backgroundColor: `${accent}12`,
              color: accent,
            }}
          >
            {index}
          </span>

          <LibraryBig
            className="h-5 w-5 opacity-70"
            style={{ color: accent }}
          />
        </div>

        <div>
          <div
            className="mb-4 text-[10px] font-semibold uppercase tracking-[0.24em]"
            style={{ color: accent }}
          >
            {eyebrow}
          </div>

          <h3 className="text-3xl font-black uppercase leading-[0.9] tracking-[-0.05em] sm:text-4xl">
            {title}
          </h3>

          <p className="mt-5 max-w-md text-sm leading-7 text-white/60">
            {description}
          </p>

          <Link
            href={href}
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-[#C8FF00] bg-[#C8FF00] px-5 text-[11px] font-black uppercase tracking-[0.1em] text-[#050B18] shadow-[0_10px_28px_rgba(200,255,0,0.14)] transition duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-[#050B18]"
          >
            {cta}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export default function PlayersExperience({
  featuredPlayers,
  atpPlayerCount,
  totalArtifactCount,
  nations,
}: PlayersExperienceProps) {
  const shouldReduceMotion = useReducedMotion();

  const stats = [
    {
      value: featuredPlayers.length,
      label: "Champion collections",
      icon: Trophy,
    },
    {
      value: atpPlayerCount,
      label: "ATP players indexed",
      icon: Users,
    },
    {
      value: totalArtifactCount,
      label: "Published artifacts",
      icon: Shirt,
    },
  ];

  return (
    <div className="overflow-hidden bg-[#050B18] text-white">
      <section className="relative isolate min-h-[720px] overflow-hidden border-b border-white/10 bg-[#020611] md:min-h-[780px] lg:min-h-[840px]">
        <div className="absolute inset-0">
          <motion.div
            initial={{
              opacity: 0,
              scale: shouldReduceMotion ? 1 : 1.04,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: shouldReduceMotion ? 0 : 1.2,
              ease: easePremium,
            }}
            className="absolute inset-0"
          >
            <Image
              src="/players/players-trophies-hero.png"
              alt="Collage delle coppe dei grandi tornei del tennis"
              fill
              priority
              sizes="100vw"
              className="object-cover object-[center_54%]"
            />
          </motion.div>

          <div className="absolute inset-0 bg-[linear-gradient(90deg,#020611_0%,rgba(2,6,17,0.98)_24%,rgba(2,6,17,0.82)_46%,rgba(2,6,17,0.38)_70%,rgba(2,6,17,0.12)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,17,0.12)_0%,rgba(2,6,17,0.02)_45%,#020611_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_26%,rgba(200,255,0,0.13),transparent_24%)]" />
          <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:72px_72px]" />
        </div>

        <div className="relative mx-auto grid min-h-[720px] w-full max-w-[1680px] items-start gap-10 px-6 pb-24 pt-10 sm:px-10 sm:pt-12 md:min-h-[780px] md:pb-28 lg:min-h-[840px] lg:grid-cols-[1.18fr_0.52fr] lg:px-14 lg:pb-32 lg:pt-14">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: shouldReduceMotion ? 0 : 0.11,
                  delayChildren: shouldReduceMotion ? 0 : 0.15,
                },
              },
            }}
            className="max-w-4xl"
          >
            <motion.div
              variants={fadeUp}
              transition={{
                duration: 0.72,
                ease: easePremium,
              }}
              className="mb-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C8FF00]"
            >
              <span className="h-px w-10 bg-[#C8FF00]" />
              <Crown className="h-3.5 w-3.5" />
              The tennis universe
            </motion.div>

            <motion.h1
              variants={fadeUp}
              transition={{
                duration: 0.85,
                ease: easePremium,
              }}
              className="max-w-4xl text-[clamp(4.2rem,9vw,8.4rem)] font-black uppercase leading-[0.8] tracking-[-0.075em]"
            >
              Players
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{
                duration: 0.72,
                ease: easePremium,
              }}
              className="mt-6 max-w-2xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8"
            >
              Discover legendary champions, rising stars and authentic tennis
              collectibles inside the complete AGE202 players universe.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{
                duration: 0.72,
                ease: easePremium,
              }}
              className="mt-7 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href="#champion-collections"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#C8FF00] px-7 text-sm font-black uppercase tracking-[0.12em] text-[#050B18] shadow-[0_14px_40px_rgba(200,255,0,0.18)] transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_46px_rgba(255,255,255,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8FF00] focus-visible:ring-offset-4 focus-visible:ring-offset-[#020611]"
              >
                Explore collections
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/players/other-players"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-white/25 bg-white/[0.07] px-7 text-sm font-black uppercase tracking-[0.12em] text-white backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#C8FF00]/60 hover:bg-[#C8FF00]/10 hover:text-[#C8FF00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#020611]"
              >
                Open ATP Archive
                <LibraryBig className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              x: shouldReduceMotion ? 0 : 34,
              y: shouldReduceMotion ? 0 : 18,
            }}
            animate={{
              opacity: 1,
              x: 0,
              y: 0,
            }}
            transition={{
              delay: shouldReduceMotion ? 0 : 0.32,
              duration: shouldReduceMotion ? 0 : 0.8,
              ease: easePremium,
            }}
            className="mt-8 w-full max-w-[290px] rounded-[22px] border border-[#C8FF00]/20 bg-[#07101D]/84 p-4 shadow-[0_22px_62px_rgba(0,0,0,0.42)] backdrop-blur-2xl sm:p-4 lg:absolute lg:bottom-8 lg:left-14 lg:mt-0"
          >
            <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <div className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#C8FF00]">
                  AGE202 index
                </div>
                <div className="mt-1 text-[11px] text-white/44">
                  Live archive overview
                </div>
              </div>

              <Globe2 className="h-5 w-5 text-[#C8FF00]" />
            </div>

            <div>
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between border-b border-white/10 py-3 last:border-b-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#C8FF00]/18 bg-[#C8FF00]/10 text-[#C8FF00]">
                        <Icon className="h-4 w-4" />
                      </div>

                      <span className="text-[9px] uppercase tracking-[0.14em] text-white/52 sm:text-[10px]">
                        {stat.label}
                      </span>
                    </div>

                    <span className="text-2xl font-black tracking-[-0.05em] text-white">
                      {stat.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        <Link
          href="#champion-collections"
          aria-label="Scroll to Champion Collections"
          className="absolute bottom-7 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-1.5 text-white/55 transition-colors hover:text-[#C8FF00] lg:flex"
        >
          <span className="text-[9px] font-semibold uppercase tracking-[0.32em]">
            Discover collections
          </span>
          <ArrowDown className="h-4 w-4 animate-bounce" />
        </Link>
      </section>

      <section
        id="champion-collections"
        className="relative mx-auto w-full max-w-[1680px] px-6 py-24 sm:px-10 lg:px-14 lg:py-32"
      >
        <div className="mb-12 flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
          <div>
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#C8FF00]">
              <Sparkles className="h-4 w-4" />
              01 · Signature galleries
            </div>

            <h2 className="max-w-3xl text-4xl font-black uppercase leading-[0.9] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              Champion Collections
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-7 text-white/58 sm:text-base">
            Curated exhibitions dedicated to five defining champions. Each gallery
            connects career history, visual identity and authentic AGE202 pieces.
          </p>
        </div>

        <div className="space-y-5">
          <div className="grid gap-5 lg:grid-cols-3">
            {featuredPlayers.slice(0, 3).map((player, index) => {
              const image = player.heroImage ?? player.portraitImage;

              return (
                <motion.article
                  key={player.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{
                    once: true,
                    amount: 0.18,
                  }}
                  variants={fadeUp}
                  transition={{
                    duration: 0.65,
                    delay: Math.min(index * 0.06, 0.18),
                    ease: easePremium,
                  }}
                  className="group relative min-h-[460px] overflow-hidden rounded-[32px] border border-white/10 bg-[#07101D] shadow-[0_24px_80px_rgba(0,0,0,0.28)] transition duration-500 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_30px_90px_rgba(0,0,0,0.38)]"
                >
                  {image ? (
                    <Image
                      src={image}
                      alt={player.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover object-top transition duration-700 ease-out group-hover:scale-[1.045]"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#030711] via-[#030711]/38 to-transparent" />

                  <div
                    className="absolute inset-x-0 top-0 h-1 opacity-90"
                    style={{
                      backgroundColor: player.accent || "#C8FF00",
                    }}
                  />

                  <div className="absolute inset-x-0 bottom-0 p-7 sm:p-8">
                    <div className="mb-5 flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/78 backdrop-blur-md">
                        The Big Three
                      </span>

                      {player.country ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-white/62 backdrop-blur-md">
                          <MapPin className="h-3 w-3" />
                          {player.country}
                        </span>
                      ) : null}
                    </div>

                    <h3 className="text-3xl font-black uppercase leading-[0.9] tracking-[-0.05em] sm:text-4xl">
                      {player.name}
                    </h3>

                    <p className="mt-5 text-sm leading-7 text-white/62">
                      {playerSummary(player)}
                    </p>

                    <div className="mt-7 flex flex-wrap items-center justify-between gap-5 border-t border-white/12 pt-6">
                      <div>
                        <div className="text-xl font-black text-white">
                          {player.artifactCount}
                        </div>

                        <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/42">
                          {artifactLabel(player.artifactCount)}
                        </div>
                      </div>

                      <Link
                        href={player.href}
                        className="group/button relative z-10 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#C8FF00] px-5 text-xs font-black uppercase tracking-[0.1em] text-[#050B18] shadow-[0_10px_26px_rgba(200,255,0,0.14)] transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_14px_34px_rgba(255,255,255,0.15)]"
                        aria-label={`Explore ${player.name} collection`}
                      >
                        Explore collection
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {featuredPlayers.slice(3, 5).map((player, index) => {
              const image = player.heroImage ?? player.portraitImage;

              return (
                <motion.article
                  key={player.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{
                    once: true,
                    amount: 0.18,
                  }}
                  variants={fadeUp}
                  transition={{
                    duration: 0.65,
                    delay: Math.min(index * 0.08, 0.16),
                    ease: easePremium,
                  }}
                  className="group relative min-h-[520px] overflow-hidden rounded-[32px] border border-white/10 bg-[#07101D] shadow-[0_24px_80px_rgba(0,0,0,0.28)] transition duration-500 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_30px_90px_rgba(0,0,0,0.38)]"
                >
                  {image ? (
                    <Image
                      src={image}
                      alt={player.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover object-[center_24%] transition duration-700 ease-out group-hover:scale-[1.035]"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#030711] via-[#030711]/34 to-transparent" />

                  <div
                    className="absolute inset-x-0 top-0 h-1 opacity-90"
                    style={{
                      backgroundColor: player.accent || "#C8FF00",
                    }}
                  />

                  <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
                    <div className="mb-5 flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/78 backdrop-blur-md">
                        New Era
                      </span>

                      {player.country ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-white/62 backdrop-blur-md">
                          <MapPin className="h-3 w-3" />
                          {player.country}
                        </span>
                      ) : null}
                    </div>

                    <h3 className="max-w-3xl text-5xl font-black uppercase leading-[0.86] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
                      {player.name}
                    </h3>

                    <p className="mt-5 max-w-2xl text-sm leading-7 text-white/62 sm:text-base">
                      {playerSummary(player)}
                    </p>

                    <div className="mt-7 flex flex-wrap items-center justify-between gap-5 border-t border-white/12 pt-6">
                      <div>
                        <div className="text-xl font-black text-white">
                          {player.artifactCount}
                        </div>

                        <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/42">
                          {artifactLabel(player.artifactCount)}
                        </div>
                      </div>

                      <Link
                        href={player.href}
                        className="group/button relative z-10 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#C8FF00] px-5 text-xs font-black uppercase tracking-[0.1em] text-[#050B18] shadow-[0_10px_26px_rgba(200,255,0,0.14)] transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_14px_34px_rgba(255,255,255,0.15)]"
                        aria-label={`Explore ${player.name} collection`}
                      >
                        Explore collection
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#030711]">
        <div className="mx-auto w-full max-w-[1680px] px-6 py-20 sm:px-10 lg:px-14 lg:py-28">
          <div className="mb-12 flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <div>
              <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#C8FF00]">
                <LibraryBig className="h-4 w-4" />
                02 · Explore the player archives
              </div>

              <h2 className="max-w-4xl text-4xl font-black uppercase leading-[0.9] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                Three archives.
                <span className="block text-white/35">One tennis universe.</span>
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-7 text-white/58 sm:text-base">
              Move through the men&apos;s tour, the women&apos;s game and the emerging
              generation through three dedicated AGE202 archives.
            </p>
          </div>

          <div className="space-y-5">
            <div className="grid gap-5 lg:grid-cols-2">
              <ArchiveGatewayCard
                index="01"
                eyebrow="The wider tour"
                title="ATP Archive"
                description="Discover established champions and current tour players through the living AGE202 ATP archive."
                href="/players/other-players"
                cta="Enter ATP Archive"
                visual="ATP"
                accent="#C8FF00"
                background="radial-gradient(circle at 72% 24%, rgba(200,255,0,0.18), transparent 28%), linear-gradient(145deg, #0B1723 0%, #06101C 48%, #030711 100%)"
                image="/players/other-players/hero.png"
                imageAlt="AGE202 ATP Archive"
                imagePosition="object-[100%_center]"
              />

              <ArchiveGatewayCard
                index="02"
                eyebrow="The women's game"
                title="WTA Archive"
                description="Explore rankings, profiles, careers and the players shaping today's WTA Tour."
                href="/players/women/archive"
                cta="Enter WTA Archive"
                visual="WTA"
                accent="#F4A7FF"
                background="radial-gradient(circle at 74% 22%, rgba(244,167,255,0.18), transparent 28%), linear-gradient(145deg, #17101F 0%, #0B0C19 50%, #030711 100%)"
                image="/players/women/wta-archive-hero.png"
                imageAlt="AGE202 WTA Archive"
                imagePosition="object-center"
                imageFit="contain"
              />
            </div>

            <div className="grid gap-5">
              <ArchiveGatewayCard
                index="03"
                eyebrow="The future of tennis"
                title="Next Gen Archive"
                description="Meet the emerging generation building the future of professional tennis and the stories still being written."
                href="/next-gen"
                cta="Enter Next Gen"
                visual="NEXT"
                accent="#4EB3FF"
                background="radial-gradient(circle at 74% 22%, rgba(78,179,255,0.20), transparent 28%), linear-gradient(145deg, #071827 0%, #07101D 50%, #030711 100%)"
                wide
              />
            </div>
          </div>

          <div className="mt-5 rounded-[28px] border border-white/10 bg-[#07101D]/72 px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#C8FF00]/10 text-[#C8FF00]">
                  <Globe2 className="h-5 w-5" />
                </div>

                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/38">
                    ATP archive snapshot
                  </div>
                  <div className="mt-1 text-lg font-black uppercase tracking-[-0.025em] text-white/82">
                    {atpPlayerCount} players indexed
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {nations.slice(0, 6).map((nation) => (
                  <span
                    key={nation.country}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/52"
                  >
                    {nation.country} · {nation.count}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1680px] px-6 py-20 sm:px-10 lg:px-14 lg:py-28">
        <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(200,255,0,0.12),transparent_34%),linear-gradient(135deg,#07101D,#030711)] px-7 py-14 sm:px-12 lg:px-16 lg:py-20">
          <div className="absolute right-[-5rem] top-[-6rem] h-64 w-64 rounded-full border border-[#C8FF00]/15" />
          <div className="absolute right-[-1rem] top-[-2rem] h-40 w-40 rounded-full border border-[#C8FF00]/20" />

          <div className="relative flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <div className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#C8FF00]">
                The archive keeps growing
              </div>

              <h2 className="text-4xl font-black uppercase leading-[0.92] tracking-[-0.05em] sm:text-6xl">
                Every player tells a different story.
              </h2>

              <p className="mt-6 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
                Sprint 5.1 establishes the new Players experience. Premium dynamic
                profiles and advanced archive tools follow in the next stages of
                Sprint 5.
              </p>
            </div>

            <Link
              href="/players/other-players"
              className="group inline-flex min-h-14 shrink-0 items-center justify-center gap-3 rounded-full border border-white/22 bg-white/[0.05] px-7 text-sm font-black uppercase tracking-[0.1em] text-white backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#C8FF00]/60 hover:bg-[#C8FF00]/10 hover:text-[#C8FF00]"
            >
              Browse all players
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}