import Image from "next/image";
import Link from "next/link";

import {
  ArrowDown,
  BadgeCheck,
  Sparkles,
} from "lucide-react";

import type {
  Champion,
} from "@/data/champions";

import type {
  PlayerTrophyStats,
} from "@/lib/services/players/player-trophy-stats.service";

type ArchiveHeroProps = {
  champion: Champion;

  liveStats:
    | PlayerTrophyStats
    | null;
};

export default function ArchiveHero({
  champion,
  liveStats,
}: ArchiveHeroProps) {
  const debutSuffix =
    String(
      champion.debutYear,
    ).slice(-2);

  /*
   * Le statistiche live vengono utilizzate
   * quando AGE202 possiede un archivio tornei
   * collegato al giocatore.
   *
   * In assenza di dati live utilizziamo
   * i valori editoriali presenti nel Champion.
   *
   * Weeks at No. 1 resta editoriale perché
   * PlayerTrophyStats non calcola ancora
   * le settimane al numero uno.
   */
  const grandSlams =
    liveStats?.recordedGrandSlams ??
    champion.trophies.grandSlams;

  const atpTitles =
    liveStats?.recordedTitles ??
    champion.trophies.atpTitles;

  const weeksAtNo1 =
    champion.trophies.weeksAtNo1;

  return (
    <section className="relative isolate flex min-h-[calc(100svh-96px)] overflow-hidden border-b border-white/[0.07] bg-[#050B18]">
      {/* =====================================================
          BACKGROUND IMAGE
      ====================================================== */}

      <Image
        src={champion.image}
        alt={`${champion.name} archive hero`}
        fill
        priority
        sizes="100vw"
        className="object-cover object-[68%_center] sm:object-[70%_center] lg:object-[72%_center]"
      />

      {/* =====================================================
          CINEMATIC BACKGROUND OVERLAYS
      ====================================================== */}

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,11,24,0.98)_0%,rgba(5,11,24,0.92)_24%,rgba(5,11,24,0.66)_44%,rgba(5,11,24,0.24)_66%,rgba(5,11,24,0.06)_82%,rgba(5,11,24,0.16)_100%)]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,7,15,0.42)_0%,transparent_28%,transparent_64%,rgba(5,11,24,0.82)_100%)]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_72%_34%,transparent_0%,transparent_26%,rgba(5,11,24,0.10)_48%,rgba(5,11,24,0.36)_100%)]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:80px_80px] opacity-60"
      />

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-[#050B18] via-[#050B18]/48 to-transparent"
      />

      {/* =====================================================
          ACCENT LIGHTS
      ====================================================== */}

      <div
        aria-hidden="true"
        className="absolute -left-44 top-1/4 h-[420px] w-[420px] rounded-full opacity-[0.16] blur-[150px]"
        style={{
          backgroundColor:
            champion.accent,
        }}
      />

      <div
        aria-hidden="true"
        className="absolute right-[8%] top-[18%] h-[320px] w-[320px] rounded-full opacity-[0.07] blur-[130px]"
        style={{
          backgroundColor:
            champion.accent,
        }}
      />

      <div
        aria-hidden="true"
        className="absolute -right-48 bottom-[-160px] h-[500px] w-[500px] rounded-full opacity-[0.08] blur-[170px]"
        style={{
          backgroundColor:
            champion.accent,
        }}
      />

      {/* =====================================================
          DECORATIVE ARCHIVE NUMBER
      ====================================================== */}

      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-8 right-3 select-none text-[150px] font-black leading-none tracking-[-0.12em] text-white/[0.025] sm:text-[220px] lg:right-10 lg:text-[320px]"
      >
        {debutSuffix}
      </span>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="relative z-10 flex w-full items-center py-16 sm:py-20 lg:pb-36 lg:pt-24">
        <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-8 lg:px-12">
          <div className="max-w-[820px]">
            {/* Archive badges */}

            <div className="flex flex-wrap items-center gap-3">
              <span
                className="inline-flex items-center gap-3 rounded-full border px-4 py-2 text-[9px] font-black uppercase tracking-[0.28em] backdrop-blur-xl sm:text-[10px]"
                style={{
                  color:
                    champion.accent,

                  borderColor:
                    `${champion.accent}55`,

                  backgroundColor:
                    `${champion.accent}12`,
                }}
              >
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    backgroundColor:
                      champion.accent,

                    boxShadow:
                      `0 0 14px ${champion.accent}`,
                  }}
                />

                AGE202 Digital Archive
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-4 py-2 text-[9px] font-black uppercase tracking-[0.24em] text-white/50 backdrop-blur-xl sm:text-[10px]">
                <BadgeCheck
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                />

                Verified Champion
              </span>
            </div>

            {/* Nickname */}

            <div className="mt-8 flex items-center gap-4 sm:mt-10">
              <span
                aria-hidden="true"
                className="h-px w-10 sm:w-14"
                style={{
                  backgroundColor:
                    champion.accent,

                  boxShadow:
                    `0 0 12px ${champion.accent}`,
                }}
              />

              <p
                className="text-[10px] font-black uppercase tracking-[0.34em] sm:text-xs"
                style={{
                  color:
                    champion.accent,
                }}
              >
                {champion.nickname}
              </p>
            </div>

            {/* Player name */}

            <h1 className="mt-6 text-[clamp(4rem,9.2vw,8.8rem)] font-black leading-[0.8] tracking-[-0.075em] text-white">
              <span className="block">
                {champion.firstName}
              </span>

              <span className="block text-white/68">
                {champion.lastName}
              </span>
            </h1>

            {/* Curatorial quote and signature */}

            <div className="mt-9 max-w-2xl border-l pl-5 sm:mt-11 sm:pl-7">
              <div
                className="absolute"
                aria-hidden="true"
              />

              <div
                className="border-l"
                style={{
                  borderColor:
                    `${champion.accent}80`,
                }}
              >
                <div className="pl-5 sm:pl-7">
                  <div className="flex items-center gap-2">
                    <Sparkles
                      className="h-4 w-4"
                      style={{
                        color:
                          champion.accent,
                      }}
                      aria-hidden="true"
                    />

                    <p className="font-mono text-[8px] font-black uppercase tracking-[0.24em] text-white/30">
                      Curatorial portrait
                    </p>
                  </div>

                  <p className="mt-4 max-w-xl text-lg font-medium italic leading-8 text-white/78 sm:text-xl sm:leading-9">
                    {champion.quote}
                  </p>

                  {champion.signatureImage ? (
                    <div className="mt-5">
                      <Image
                        src={
                          champion.signatureImage
                        }
                        alt={`${champion.name} signature`}
                        width={220}
                        height={90}
                        className="h-auto w-[150px] opacity-85 brightness-0 invert sm:w-[185px]"
                      />
                    </div>
                  ) : (
                    <p
                      className="mt-5 text-sm font-semibold tracking-[0.08em]"
                      style={{
                        color:
                          champion.accent,
                      }}
                    >
                      {champion.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}

            <p className="mt-8 max-w-2xl text-base leading-8 text-white/58 sm:text-lg sm:leading-9">
              {champion.description}
            </p>

            {/* Primary CTA */}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="#career-timeline"
                className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#050B18] transition duration-300 hover:-translate-y-0.5"
                style={{
                  backgroundColor:
                    champion.accent,

                  boxShadow:
                    `0 16px 45px ${champion.accent}20`,
                }}
              >
                Begin the experience

                <ArrowDown
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1"
                  aria-hidden="true"
                />
              </Link>

              <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/30">
                Scroll through the legacy
              </span>
            </div>

            {/* Museum metadata */}

            <div
              className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5 border-l-2 pl-5 sm:mt-12 sm:pl-6"
              style={{
                borderColor:
                  champion.accent,
              }}
            >
              <ArchiveMeta
                label="Nationality"
                value={
                  champion.nationality
                }
              />

              <ArchiveMeta
                label="Professional debut"
                value={String(
                  champion.debutYear,
                )}
              />

              <ArchiveMeta
                label="Primary brand"
                value={
                  champion.mainBrand
                }
              />
            </div>

            {/* Hero statistics */}

            <div className="mt-10 grid max-w-3xl grid-cols-1 overflow-hidden rounded-[24px] border border-white/10 bg-black/30 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:mt-12 sm:grid-cols-3">
              <HeroStat
                label="Grand Slams"
                value={String(
                  grandSlams,
                )}
                accent={
                  champion.accent
                }
              />

              <HeroStat
                label="ATP Titles"
                value={String(
                  atpTitles,
                )}
                accent={
                  champion.accent
                }
                className="border-t border-white/10 sm:border-l sm:border-t-0"
              />

              <HeroStat
                label="Weeks at No. 1"
                value={String(
                  weeksAtNo1,
                )}
                accent={
                  champion.accent
                }
                className="border-t border-white/10 sm:border-l sm:border-t-0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          BOTTOM ARCHIVE STRIP
      ====================================================== */}

      <div className="absolute inset-x-0 bottom-0 z-20 hidden border-t border-white/[0.07] bg-[#050B18]/55 backdrop-blur-xl lg:block">
        <div className="mx-auto grid max-w-[1440px] grid-cols-4 divide-x divide-white/[0.07] px-12">
          <ArchiveStripItem
            label="Archive code"
            value={`AGE-${champion.id.toUpperCase()}-202`}
          />

          <ArchiveStripItem
            label="Collection"
            value={
              champion.name
            }
          />

          <ArchiveStripItem
            label="Classification"
            value="Champion Archive"
          />

          <ArchiveStripItem
            label="Archive status"
            value="Active"
            accent={
              champion.accent
            }
          />
        </div>
      </div>

      {/* Accent line */}

      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 z-30 h-px"
        style={{
          background:
            `linear-gradient(90deg, transparent, ${champion.accent}, transparent)`,

          boxShadow:
            `0 0 24px ${champion.accent}`,
        }}
      />
    </section>
  );
}

type HeroStatProps = {
  label: string;
  value: string;
  accent: string;
  className?: string;
};

function HeroStat({
  label,
  value,
  accent,
  className = "",
}: HeroStatProps) {
  return (
    <div
      className={[
        "group min-w-0 px-6 py-6 transition-colors duration-500 hover:bg-white/[0.035] sm:px-7",
        className,
      ].join(" ")}
    >
      <p
        className="truncate text-2xl font-black tracking-[-0.035em] sm:text-3xl"
        style={{
          color:
            accent,
        }}
      >
        {value}
      </p>

      <p className="mt-2 text-[8px] font-black uppercase tracking-[0.24em] text-white/35">
        {label}
      </p>
    </div>
  );
}

type ArchiveMetaProps = {
  label: string;
  value: string;
};

function ArchiveMeta({
  label,
  value,
}: ArchiveMetaProps) {
  return (
    <div>
      <p className="text-[8px] font-black uppercase tracking-[0.23em] text-white/25">
        {label}
      </p>

      <p className="mt-2 text-xs font-black uppercase tracking-[0.1em] text-white/78 sm:text-sm">
        {value}
      </p>
    </div>
  );
}

type ArchiveStripItemProps = {
  label: string;
  value: string;
  accent?: string;
};

function ArchiveStripItem({
  label,
  value,
  accent,
}: ArchiveStripItemProps) {
  return (
    <div className="px-7 py-5 first:pl-0 last:pr-0">
      <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-white/25">
        {label}
      </p>

      <p
        className="mt-2 truncate font-mono text-[10px] uppercase tracking-[0.15em] text-white/60"
        style={
          accent
            ? {
                color:
                  accent,
              }
            : undefined
        }
      >
        {value}
      </p>
    </div>
  );
}