import Image from "next/image";
import Link from "next/link";

import {
  ArrowDown,
  ArrowLeft,
  CalendarDays,
  Flag,
  Landmark,
  MapPin,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";

import type {
  TournamentMuseumData,
} from "@/lib/services/museum/tournament.service";

type TournamentHeroProps = {
  tournament: TournamentMuseumData;
};

function formatCategory(
  category: string,
): string {
  return category
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase(),
    );
}

function formatSurface(
  surface: string,
): string {
  return surface
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase(),
    );
}

function formatNumber(
  value: number,
): string {
  return String(value).padStart(
    2,
    "0",
  );
}

export default function TournamentHero({
  tournament,
}: TournamentHeroProps) {
  const categoryLabel =
    formatCategory(
      tournament.category,
    );

  const surfaceLabel =
    formatSurface(
      tournament.surface,
    );

  const locationLabel = [
    tournament.city,
    tournament.country,
  ]
    .filter(Boolean)
    .join(", ");

  const heroTitle =
    tournament.shortName ??
    tournament.name;

  const hasHeroImage =
    Boolean(
      tournament.heroImage,
    );

  return (
    <section
      aria-labelledby="tournament-title"
      className="relative isolate min-h-[100svh] overflow-hidden border-b border-white/10 bg-[#020611]"
    >
      <div className="absolute inset-0">
        {tournament.heroImage ? (
          <Image
            src={
              tournament.heroImage
            }
            alt={
              tournament.name
            }
            fill
            priority
            sizes="100vw"
            className="scale-[1.02] object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_30%,rgba(215,255,0,0.17),transparent_34%)]" />
        )}

        <div className="absolute inset-0 bg-[#020611]/24" />

        <div className="absolute inset-0 bg-[linear-gradient(90deg,#020611_0%,rgba(2,6,17,0.99)_22%,rgba(2,6,17,0.88)_48%,rgba(2,6,17,0.34)_76%,rgba(2,6,17,0.08)_100%)]" />

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,17,0.52)_0%,rgba(2,6,17,0.03)_42%,#020611_100%)]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_34%,rgba(215,255,0,0.18),transparent_28%)]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_83%_58%,rgba(125,211,252,0.07),transparent_28%)]" />

        <div className="absolute inset-0 opacity-[0.055] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      <div
        aria-hidden={true}
        className="pointer-events-none absolute -right-[3vw] top-[8%] hidden select-none text-right font-black uppercase leading-[0.78] tracking-[-0.09em] text-white/[0.028] lg:block"
      >
        <span className="block text-[clamp(9rem,18vw,19rem)]">
          AGE202
        </span>

        <span className="block text-[clamp(5rem,10vw,11rem)]">
          Tournament
        </span>
      </div>

      <div
        aria-hidden={true}
        className="pointer-events-none absolute -left-[1.5vw] top-[14%] hidden select-none font-black leading-none tracking-[-0.12em] text-white/[0.04] md:block"
      >
        <span className="text-[clamp(15rem,34vw,38rem)]">
          {tournament.foundedYear ??
            "ATP"}
        </span>
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1540px] flex-col px-5 pb-48 pt-8 sm:px-8 sm:pb-52 sm:pt-10 lg:px-12 lg:pb-48 xl:px-16">
        <div className="flex items-center justify-between gap-6">
          <Link
            href="/results"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-black/25 px-4 py-2 font-mono text-[8px] font-black uppercase tracking-[0.2em] text-white/48 backdrop-blur-xl transition hover:border-[#D7FF00]/35 hover:text-[#D7FF00]"
          >
            <ArrowLeft
              size={13}
              aria-hidden={true}
            />
            Tournament archive
          </Link>

          <div className="hidden items-center gap-3 sm:flex">
            <span className="h-px w-12 bg-[#D7FF00]/45" />

            <span className="font-mono text-[8px] font-black uppercase tracking-[0.24em] text-[#D7FF00]">
              AGE202 tournament dossier
            </span>
          </div>
        </div>

        <div className="relative my-auto py-12 sm:py-16 lg:py-20">
          <div className="relative max-w-5xl border-l border-[#D7FF00]/60 pl-5 sm:pl-8">
            <div className="flex flex-wrap items-center gap-2.5">
              <HeroBadge featured>
                <Trophy
                  size={11}
                  aria-hidden={true}
                />
                {categoryLabel}
              </HeroBadge>

              <HeroBadge>
                <Sparkles
                  size={11}
                  aria-hidden={true}
                />
                {surfaceLabel}
              </HeroBadge>

              <HeroBadge>
                <Flag
                  size={11}
                  aria-hidden={true}
                />
                {tournament.country}
              </HeroBadge>

              <HeroBadge>
                <ShieldCheck
                  size={11}
                  aria-hidden={true}
                />
                AGE202 verified
              </HeroBadge>
            </div>

            <p className="mt-7 font-mono text-[8px] font-black uppercase tracking-[0.3em] text-white/35 sm:text-[9px]">
              AGE202 tournament archive
            </p>

            <h1
              id="tournament-title"
              className="mt-5 max-w-5xl text-[clamp(3.8rem,9vw,9rem)] font-black uppercase leading-[0.78] tracking-[-0.075em]"
            >
              <span className="block text-white/34">
                {tournament.name}
              </span>

              <span className="block text-white">
                {heroTitle}
              </span>
            </h1>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-5">
              <HeroIdentity
                label="Category"
                value={categoryLabel}
              />

              <HeroIdentity
                label="Surface"
                value={surfaceLabel}
              />

              <HeroIdentity
                label="Location"
                value={
                  locationLabel ||
                  tournament.country
                }
              />

              <HeroIdentity
                label="Founded"
                value={
                  tournament.foundedYear
                    ? String(
                        tournament.foundedYear,
                      )
                    : "—"
                }
              />
            </div>

            <p className="mt-7 max-w-3xl text-base leading-8 text-white/58 sm:text-lg">
              {tournament.description ??
                `Explore the AGE202 tournament archive dedicated to ${tournament.name}, including champions, recorded editions and historical context.`}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#tournament-overview"
                className="inline-flex items-center gap-2 rounded-full bg-[#D7FF00] px-5 py-3 text-[8px] font-black uppercase tracking-[0.18em] text-[#050B18] transition hover:-translate-y-0.5 hover:bg-[#E4FF58]"
              >
                Discover tournament
                <ArrowDown
                  size={13}
                  aria-hidden={true}
                />
              </a>

              <Link
                href="/results"
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/25 px-5 py-3 text-[8px] font-black uppercase tracking-[0.18em] text-white/65 backdrop-blur-md transition hover:border-[#D7FF00]/40 hover:text-[#D7FF00]"
              >
                Explore results
                <Trophy
                  size={13}
                  aria-hidden={true}
                />
              </Link>
            </div>

            <aside className="relative mt-8 max-w-3xl overflow-hidden rounded-[1.65rem] border border-white/10 bg-[#07101D]/82 p-4 shadow-[0_24px_75px_rgba(0,0,0,0.38)] backdrop-blur-2xl sm:p-5">
              <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full border border-[#D7FF00]/10" />

              <div className="relative">
                <div className="flex items-center justify-between gap-5">
                  <div>
                    <p className="font-mono text-[7px] font-black uppercase tracking-[0.2em] text-[#D7FF00] sm:text-[8px]">
                      Tournament intelligence
                    </p>

                    <h2 className="mt-2 text-xl font-black uppercase tracking-[-0.04em] sm:text-2xl">
                      Archive snapshot
                    </h2>
                  </div>

                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-[#D7FF00]/20 bg-[#D7FF00]/[0.07] text-[#D7FF00]">
                    <Landmark
                      size={16}
                      strokeWidth={1.5}
                      aria-hidden={true}
                    />
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[1.15rem] border border-white/10 bg-white/10 sm:grid-cols-4">
                  <SnapshotFact
                    label="Editions"
                    value={formatNumber(
                      tournament.statistics
                        .totalEditions,
                    )}
                  />

                  <SnapshotFact
                    label="Champions"
                    value={formatNumber(
                      tournament.champions
                        .length,
                    )}
                  />

                  <SnapshotFact
                    label="First record"
                    value={
                      tournament.statistics
                        .firstRecordedYear
                        ? String(
                            tournament.statistics
                              .firstRecordedYear,
                          )
                        : "—"
                    }
                  />

                  <SnapshotFact
                    label="Record titles"
                    value={formatNumber(
                      tournament.statistics
                        .recordTitles,
                    )}
                  />
                </div>

                <div className="mt-4 grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-3">
                  <SnapshotRow
                    label="Venue"
                    value={
                      tournament.venue ??
                      "Not recorded"
                    }
                  />

                  <SnapshotRow
                    label="Surface"
                    value={surfaceLabel}
                  />

                  <SnapshotRow
                    label="Status"
                    value={
                      tournament.featured
                        ? "Featured tournament"
                        : "Tournament archive"
                    }
                  />
                </div>
              </div>
            </aside>
          </div>
        </div>

        <div className="absolute bottom-7 left-5 right-5 sm:bottom-8 sm:left-8 sm:right-8 lg:left-12 lg:right-12 xl:left-16 xl:right-16">
          <div className="grid gap-px overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/10 shadow-[0_28px_90px_rgba(0,0,0,0.48)] backdrop-blur-2xl sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <HeroStat
              icon={Trophy}
              label="Category"
              value={categoryLabel}
              compact
            />

            <HeroStat
              icon={Sparkles}
              label="Surface"
              value={surfaceLabel}
            />

            <HeroStat
              icon={MapPin}
              label="City"
              value={
                tournament.city ??
                "—"
              }
              compact
            />

            <HeroStat
              icon={Flag}
              label="Country"
              value={
                tournament.country
              }
              compact
            />

            <HeroStat
              icon={CalendarDays}
              label="Founded"
              value={
                tournament.foundedYear
                  ? String(
                      tournament.foundedYear,
                    )
                  : "—"
              }
            />

            <HeroStat
              icon={Landmark}
              label="Recorded editions"
              value={formatNumber(
                tournament.statistics
                  .totalEditions,
              )}
            />
          </div>
        </div>
      </div>

      <a
        href="#tournament-overview"
        aria-label="Scroll to tournament profile"
        className="absolute bottom-9 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/45 transition hover:text-[#D7FF00] 2xl:flex"
      >
        <span className="font-mono text-[8px] font-black uppercase tracking-[0.32em]">
          Discover tournament
        </span>

        <span className="h-10 w-px overflow-hidden bg-white/15">
          <span className="block h-5 w-px animate-pulse bg-[#D7FF00]" />
        </span>
      </a>

      {!hasHeroImage ? (
        <div className="pointer-events-none absolute bottom-0 right-0 h-[48%] w-[48%] bg-[radial-gradient(circle_at_75%_80%,rgba(215,255,0,0.07),transparent_60%)]" />
      ) : null}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#020611] to-transparent" />
    </section>
  );
}

type HeroBadgeProps = {
  children: React.ReactNode;
  featured?: boolean;
};

function HeroBadge({
  children,
  featured = false,
}: HeroBadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full px-3.5 py-2 font-mono text-[7px] font-black uppercase tracking-[0.18em]",
        featured
          ? "border border-[#D7FF00]/35 bg-[#D7FF00]/[0.08] text-[#D7FF00]"
          : "border border-white/10 bg-black/25 text-white/52 backdrop-blur-xl",
      ].join(" ")}
    >
      {children}
    </span>
  );
}

type HeroIdentityProps = {
  label: string;
  value: string;
};

function HeroIdentity({
  label,
  value,
}: HeroIdentityProps) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-mono text-[7px] font-black uppercase tracking-[0.18em] text-white/30">
        {label}
      </span>

      <span className="text-sm font-black uppercase tracking-[-0.02em] text-white/72">
        {value}
      </span>
    </div>
  );
}

type SnapshotFactProps = {
  label: string;
  value: string;
};

function SnapshotFact({
  label,
  value,
}: SnapshotFactProps) {
  return (
    <div className="bg-[#07101D]/96 px-4 py-4">
      <p className="font-mono text-[7px] font-black uppercase tracking-[0.18em] text-white/28">
        {label}
      </p>

      <p className="mt-2 text-xl font-black tracking-[-0.04em] text-white sm:text-2xl">
        {value}
      </p>
    </div>
  );
}

type SnapshotRowProps = {
  label: string;
  value: string;
};

function SnapshotRow({
  label,
  value,
}: SnapshotRowProps) {
  return (
    <div>
      <p className="font-mono text-[7px] font-black uppercase tracking-[0.18em] text-white/28">
        {label}
      </p>

      <p className="mt-2 text-sm font-bold leading-6 text-white/62">
        {value}
      </p>
    </div>
  );
}

type HeroStatProps = {
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
    className?: string;
    "aria-hidden"?: boolean;
  }>;
  label: string;
  value: string;
  compact?: boolean;
};

function HeroStat({
  icon: Icon,
  label,
  value,
  compact = false,
}: HeroStatProps) {
  return (
    <div className="flex min-h-24 items-center gap-3 bg-[#050B18]/86 px-4 py-4">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.025] text-[#D7FF00]">
        <Icon
          size={15}
          strokeWidth={1.6}
          aria-hidden={true}
        />
      </span>

      <div className="min-w-0">
        <p className="font-mono text-[7px] font-black uppercase tracking-[0.16em] text-white/28">
          {label}
        </p>

        <p
          className={[
            "mt-1 truncate font-black uppercase tracking-[-0.03em] text-white",
            compact
              ? "text-sm"
              : "text-lg",
          ].join(" ")}
        >
          {value}
        </p>
      </div>
    </div>
  );
}