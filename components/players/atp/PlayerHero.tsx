import Image from "next/image";
import Link from "next/link";

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Crown,
  Flag,
  Globe2,
  Layers3,
  Medal,
  ShieldCheck,
  Shirt,
  Star,
  Trophy,
} from "lucide-react";

type PlayerHeroProfile = {
  careerHigh: number | null;
  atpTitles: number;
  grandSlams: number;
  masters1000: number;
  atpFinals: number;
  playingStyle: string | null;
  favouriteSurface: string | null;
};

type PlayerHeroPlayer = {
  name: string;
  firstName: string | null;
  lastName: string | null;
  quote: string | null;
  collectionType: string;
  playerProfile: PlayerHeroProfile | null;
};

type PlayerHeroRanking = {
  rank: number;
  points: number | null;
  age: number | null;
  country: string | null;
};

type PlayerHeroProps = {
  player: PlayerHeroPlayer;
  ranking: PlayerHeroRanking | null;
  heroImage: string | null;
  portraitImage: string | null;
  countryLabel: string;
  collectionLabel: string;
  artifactCount: number;
  brandCount: number;
};

function formatPoints(
  points: number | null | undefined,
): string {
  if (
    points === null ||
    points === undefined
  ) {
    return "—";
  }

  return new Intl.NumberFormat(
    "it-IT",
  ).format(points);
}

function formatCount(
  value: number | null | undefined,
): string {
  return String(value ?? 0).padStart(
    2,
    "0",
  );
}

export default function PlayerHero({
  player,
  ranking,
  heroImage,
  portraitImage,
  countryLabel,
  collectionLabel,
  artifactCount,
  brandCount: _brandCount,
}: PlayerHeroProps) {
  const profile =
    player.playerProfile;

  const rankingLabel =
    ranking
      ? `#${ranking.rank}`
      : "—";

  const rankingWatermark =
    ranking
      ? String(ranking.rank).padStart(
          2,
          "0",
        )
      : "ATP";

  const visualImage =
    heroImage ??
    portraitImage;

  const hasDedicatedHero =
    Boolean(heroImage);

  return (
    <section
      aria-labelledby="player-profile-title"
      className="relative isolate overflow-hidden border-b border-white/10 bg-[#020611] sm:min-h-[100svh]"
    >
      <div className="absolute inset-0">
        {visualImage ? (
          <Image
            src={visualImage}
            alt={player.name}
            fill
            priority
            sizes="100vw"
            className={[
              "scale-[1.02]",
              hasDedicatedHero
                ? "object-cover object-top"
                : "object-contain object-right-bottom opacity-70",
            ].join(" ")}
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_28%,rgba(215,255,0,0.18),transparent_36%)]" />
        )}

        <div className="absolute inset-0 bg-[#020611]/20" />

        <div className="absolute inset-0 bg-[linear-gradient(90deg,#020611_0%,rgba(2,6,17,0.99)_20%,rgba(2,6,17,0.9)_43%,rgba(2,6,17,0.42)_70%,rgba(2,6,17,0.12)_100%)]" />

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,17,0.52)_0%,rgba(2,6,17,0.02)_44%,#020611_100%)]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_32%,rgba(215,255,0,0.2),transparent_26%)]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_84%_58%,rgba(125,211,252,0.08),transparent_26%)]" />

        <div className="absolute inset-0 opacity-[0.055] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[3vw] top-[10%] hidden select-none text-right font-black uppercase leading-[0.78] tracking-[-0.09em] text-white/[0.028] lg:block"
      >
        <span className="block text-[clamp(9rem,18vw,19rem)]">
          AGE202
        </span>

        <span className="block text-[clamp(5rem,10vw,11rem)]">
          ATP Archive
        </span>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[1.5vw] top-[12%] hidden select-none font-black leading-none tracking-[-0.12em] text-white/[0.045] md:block"
      >
        <span className="text-[clamp(18rem,38vw,42rem)]">
          {rankingWatermark}
        </span>
      </div>

      <div className="relative mx-auto flex max-w-[1540px] flex-col px-5 pb-0 pt-6 sm:min-h-[100svh] sm:px-8 sm:pb-8 sm:pt-10 lg:px-12 lg:pb-48 xl:px-16">
        <div className="flex items-center justify-between gap-6">
          <Link
            href="/players/other-players"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3.5 py-2 font-mono text-[7px] font-black uppercase tracking-[0.18em] text-white/48 backdrop-blur-xl transition hover:border-[#D7FF00]/35 hover:text-[#D7FF00] sm:px-4 sm:text-[8px] sm:tracking-[0.2em]"
          >
            <ArrowLeft
              size={13}
              aria-hidden="true"
            />

            ATP Archive
          </Link>

          <div className="hidden items-center gap-3 sm:flex">
            <span className="h-px w-12 bg-[#D7FF00]/45" />

            <span className="font-mono text-[8px] font-black uppercase tracking-[0.24em] text-[#D7FF00]">
              Premium player dossier
            </span>
          </div>
        </div>

        <div className="relative py-8 sm:my-auto sm:py-14 lg:py-20">
          <div className="relative max-w-5xl border-l border-[#D7FF00]/60 pl-4 sm:pl-8">
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              {ranking ? (
                <HeroBadge featured>
                  <Trophy
                    size={11}
                    aria-hidden="true"
                  />

                  ATP #{ranking.rank}
                </HeroBadge>
              ) : null}

              <HeroBadge>
                <Flag
                  size={11}
                  aria-hidden="true"
                />

                {countryLabel}
              </HeroBadge>

              <HeroBadge>
                <ShieldCheck
                  size={11}
                  aria-hidden="true"
                />

                AGE202 verified
              </HeroBadge>

              <HeroBadge>
                <BadgeCheck
                  size={11}
                  aria-hidden="true"
                />

                Active player
              </HeroBadge>

              <HeroBadge
                featured={
                  player.collectionType ===
                  "FEATURED"
                }
              >
                {player.collectionType ===
                "FEATURED" ? (
                  <Crown
                    size={11}
                    aria-hidden="true"
                  />
                ) : (
                  <Layers3
                    size={11}
                    aria-hidden="true"
                  />
                )}

                {collectionLabel}
              </HeroBadge>
            </div>

            <p className="mt-5 font-mono text-[7px] font-black uppercase tracking-[0.24em] text-white/35 sm:mt-7 sm:text-[9px] sm:tracking-[0.3em]">
              AGE202 premium player profile
            </p>

            <h1
              id="player-profile-title"
              className="mt-4 max-w-5xl text-[clamp(3.35rem,10vw,9.6rem)] font-black uppercase leading-[0.76] tracking-[-0.08em] sm:mt-5"
            >
              {player.firstName ? (
                <span className="block text-white/34">
                  {player.firstName}
                </span>
              ) : null}

              <span className="block text-white">
                {player.lastName ??
                  player.name}
              </span>
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2.5 border-t border-white/10 pt-4 sm:mt-7 sm:gap-x-6 sm:gap-y-3 sm:pt-5">
              <HeroIdentity
                label="Ranking"
                value={rankingLabel}
              />

              <HeroIdentity
                label="Career high"
                value={
                  profile?.careerHigh
                    ? `#${profile.careerHigh}`
                    : "—"
                }
              />

              <HeroIdentity
                label="Country"
                value={countryLabel}
              />

              <HeroIdentity
                label="Archive"
                value={collectionLabel}
              />
            </div>

            {player.quote ? (
              <blockquote className="mt-5 max-w-3xl text-sm italic leading-6 text-white/62 sm:mt-7 sm:text-lg sm:leading-8">
                “{player.quote}”
              </blockquote>
            ) : (
              <p className="mt-5 max-w-2xl text-sm leading-6 text-white/55 sm:mt-7 sm:text-lg sm:leading-8">
                A premium AGE202 dossier dedicated
                to the player, his ranking, career
                story and collectible tennis archive.
              </p>
            )}

            <div className="mt-5 flex flex-wrap gap-2.5 sm:mt-8 sm:gap-3">
              <a
                href="#career-overview"
                className="inline-flex items-center gap-2 rounded-full bg-[#D7FF00] px-4 py-2.5 text-[7px] font-black uppercase tracking-[0.16em] text-[#050B18] transition hover:-translate-y-0.5 hover:bg-[#E4FF58] sm:px-5 sm:py-3 sm:text-[8px] sm:tracking-[0.18em]"
              >
                Discover player

                <ArrowDown
                  size={13}
                  aria-hidden="true"
                />
              </a>

              <Link
                href="/players/other-players"
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/25 px-4 py-2.5 text-[7px] font-black uppercase tracking-[0.16em] text-white/65 backdrop-blur-md transition hover:border-[#D7FF00]/40 hover:text-[#D7FF00] sm:px-5 sm:py-3 sm:text-[8px] sm:tracking-[0.18em]"
              >
                Explore archive

                <ArrowRight
                  size={13}
                  aria-hidden="true"
                />
              </Link>
            </div>

            <aside className="relative mt-8 hidden max-w-3xl overflow-hidden rounded-[1.65rem] border border-white/10 bg-[#07101D]/82 p-5 shadow-[0_24px_75px_rgba(0,0,0,0.38)] backdrop-blur-2xl sm:block">
              <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full border border-[#D7FF00]/10" />

              <div className="relative">
                <div className="flex items-center justify-between gap-5">
                  <div>
                    <p className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-[#D7FF00]">
                      Player intelligence
                    </p>

                    <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.04em]">
                      Career snapshot
                    </h2>
                  </div>

                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-[#D7FF00]/20 bg-[#D7FF00]/[0.07] text-[#D7FF00]">
                    <Star
                      size={16}
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-4 gap-px overflow-hidden rounded-[1.15rem] border border-white/10 bg-white/10">
                  <SnapshotFact
                    label="ATP titles"
                    value={formatCount(
                      profile?.atpTitles,
                    )}
                  />

                  <SnapshotFact
                    label="Grand Slams"
                    value={formatCount(
                      profile?.grandSlams,
                    )}
                  />

                  <SnapshotFact
                    label="Masters 1000"
                    value={formatCount(
                      profile?.masters1000,
                    )}
                  />

                  <SnapshotFact
                    label="ATP Finals"
                    value={formatCount(
                      profile?.atpFinals,
                    )}
                  />
                </div>

                <div className="mt-4 grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-3">
                  <SnapshotRow
                    label="Playing style"
                    value={
                      profile?.playingStyle ??
                      "Not recorded"
                    }
                  />

                  <SnapshotRow
                    label="Preferred surface"
                    value={
                      profile?.favouriteSurface ??
                      "Not recorded"
                    }
                  />

                  <SnapshotRow
                    label="Profile status"
                    value={collectionLabel}
                  />
                </div>
              </div>
            </aside>
          </div>
        </div>

        <div className="relative mt-4 sm:mb-8 sm:mt-8 lg:absolute lg:bottom-8 lg:left-12 lg:right-12 lg:mb-0 lg:mt-0 xl:left-16 xl:right-16">
          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-t-[1.2rem] border border-b-0 border-white/10 bg-white/10 shadow-[0_28px_90px_rgba(0,0,0,0.48)] backdrop-blur-2xl sm:grid-cols-2 sm:rounded-[1.75rem] sm:border-b lg:grid-cols-3 xl:grid-cols-6">
            <HeroStat
              icon={Trophy}
              label="ATP ranking"
              value={rankingLabel}
            />

            <HeroStat
              icon={Medal}
              label="ATP points"
              value={formatPoints(
                ranking?.points,
              )}
            />

            <HeroStat
              icon={CalendarDays}
              label="Age"
              value={
                ranking?.age
                  ? String(ranking.age)
                  : "—"
              }
            />

            <HeroStat
              icon={Crown}
              label="Career high"
              value={
                profile?.careerHigh
                  ? `#${profile.careerHigh}`
                  : "—"
              }
            />

            <HeroStat
              icon={Globe2}
              label="Country"
              value={countryLabel}
              compact
            />

            <HeroStat
              icon={Shirt}
              label="Artifacts"
              value={String(
                artifactCount,
              ).padStart(2, "0")}
            />
          </div>
        </div>
      </div>

      <a
        href="#career-overview"
        aria-label="Scroll to player profile"
        className="absolute bottom-9 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/45 transition hover:text-[#D7FF00] 2xl:flex"
      >
        <span className="font-mono text-[8px] font-black uppercase tracking-[0.32em]">
          Discover profile
        </span>

        <span className="h-10 w-px overflow-hidden bg-white/15">
          <span className="block h-5 w-px animate-pulse bg-[#D7FF00]" />
        </span>
      </a>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-40 bg-gradient-to-t from-[#020611] to-transparent sm:block" />
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
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 font-mono text-[6px] font-black uppercase tracking-[0.13em] backdrop-blur-xl sm:gap-2 sm:px-3.5 sm:py-2 sm:text-[8px] sm:tracking-[0.16em] ${
        featured
          ? "border border-[#D7FF00]/40 bg-[#D7FF00] text-[#050B18]"
          : "border border-white/10 bg-black/35 text-white/58"
      }`}
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
    <div className="flex items-baseline gap-1.5 sm:gap-2">
      <span className="font-mono text-[6px] uppercase tracking-[0.14em] text-white/28 sm:text-[7px] sm:tracking-[0.18em]">
        {label}
      </span>

      <span className="text-[10px] font-black uppercase tracking-[0.06em] text-white/72 sm:text-xs sm:tracking-[0.08em]">
        {value}
      </span>
    </div>
  );
}

type HeroStatProps = {
  icon: typeof Trophy;
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
    <div className="group flex min-h-[58px] min-w-0 flex-col justify-between bg-[#071021]/92 px-2.5 py-2 transition hover:bg-[#0A1629] sm:min-h-[104px] sm:flex-row sm:items-center sm:px-6 sm:py-5">
      <div className="min-w-0">
        <span
          className={`block truncate font-black tracking-[-0.05em] text-white ${
            compact
              ? "max-w-full text-[9px] uppercase leading-3 sm:max-w-[9rem] sm:text-base sm:leading-5"
              : "text-base sm:text-3xl"
          }`}
        >
          {value}
        </span>

        <span className="mt-0.5 block truncate font-mono text-[5px] uppercase tracking-[0.08em] text-white/35 sm:mt-2 sm:text-[8px] sm:tracking-[0.18em]">
          {label}
        </span>
      </div>

      <span className="mt-1.5 grid h-6 w-6 shrink-0 place-items-center self-end rounded-md border border-[#D7FF00]/20 bg-[#D7FF00]/[0.07] text-[#D7FF00] transition group-hover:border-[#D7FF00]/40 group-hover:bg-[#D7FF00]/[0.11] sm:ml-4 sm:mt-0 sm:h-10 sm:w-10 sm:self-auto sm:rounded-xl">
        <Icon
          size={12}
          strokeWidth={1.5}
          aria-hidden="true"
        />
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
    <div className="min-w-0 bg-[#07101D]/92 px-2 py-2.5 sm:px-4 sm:py-3.5">
      <span className="block text-base font-black tracking-[-0.045em] text-white sm:text-2xl">
        {value}
      </span>

      <span className="mt-1.5 block font-mono text-[5px] uppercase leading-3 tracking-[0.08em] text-white/30 sm:mt-2 sm:text-[7px] sm:tracking-[0.15em]">
        {label}
      </span>
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
    <div className="flex min-w-0 items-start justify-between gap-3 sm:block">
      <span className="font-mono text-[6px] uppercase tracking-[0.13em] text-white/28 sm:text-[7px] sm:tracking-[0.16em]">
        {label}
      </span>

      <span className="max-w-[11rem] text-right text-[9px] font-black uppercase leading-4 text-white/65 sm:mt-1 sm:block sm:max-w-none sm:text-left sm:text-[10px] sm:leading-5">
        {value}
      </span>
    </div>
  );
}