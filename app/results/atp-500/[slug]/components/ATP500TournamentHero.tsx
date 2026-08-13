import Link from "next/link";

import {
  ArrowDown,
  ArrowLeft,
  CalendarDays,
  MapPin,
  Trophy,
} from "lucide-react";

import type {
  Atp500Tournament,
} from "@/lib/data/atp-500";

import type {
  Atp500PublicIdentity,
} from "@/lib/mappers/atp-500-cms.mapper";

type ATP500TournamentHeroProps = {
  tournament: Atp500Tournament;
  identity: Atp500PublicIdentity;
};

export default function ATP500TournamentHero({
  tournament,
  identity,
}: ATP500TournamentHeroProps) {
  const backgroundImage = [
    "linear-gradient(90deg, rgba(5,11,24,0.98) 0%, rgba(5,11,24,0.90) 34%, rgba(5,11,24,0.46) 70%, rgba(5,11,24,0.22) 100%)",
    "linear-gradient(180deg, rgba(5,11,24,0.18) 0%, rgba(5,11,24,0.20) 52%, rgba(5,11,24,0.96) 100%)",
    `url("${identity.heroImage}")`,
  ].join(", ");

  return (
    <section
      id="tournament-top"
      className="relative isolate min-h-[720px] overflow-hidden border-b border-white/10"
    >
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage,
        }}
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 -z-10 opacity-70"
        style={{
          background:
            `radial-gradient(circle at 74% 25%, ${tournament.colors.glow}, transparent 30%)`,
        }}
        aria-hidden="true"
      />

      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            `linear-gradient(90deg, transparent, ${tournament.colors.primary}, transparent)`,
        }}
        aria-hidden="true"
      />

      <div className="mx-auto flex min-h-[720px] max-w-[1500px] flex-col px-5 pb-10 pt-24 sm:px-8 lg:px-12 lg:pb-12 lg:pt-28">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/results/atp-500"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#050B18]/55 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/60 backdrop-blur-md transition hover:border-white/25 hover:text-white"
          >
            <ArrowLeft
              className="h-4 w-4"
              aria-hidden="true"
            />
            ATP 500 archive
          </Link>

          <div
            className="hidden rounded-full border px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] sm:block"
            style={{
              borderColor:
                `${tournament.colors.primary}55`,
              color:
                tournament.colors.primary,
              backgroundColor:
                `${tournament.colors.primary}10`,
            }}
          >
            AGE202 · Tournament Archive
          </div>
        </div>

        <div className="mt-auto grid gap-10 pb-10 pt-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <div
              className="mb-5 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.28em]"
              style={{
                color:
                  tournament.colors.primary,
              }}
            >
              <span>
                ATP 500
              </span>

              <span
                className="h-px w-10"
                style={{
                  backgroundColor:
                    tournament.colors.primary,
                }}
              />

              <span>
                {identity.countryCode}
              </span>
            </div>

            <h1 className="max-w-5xl text-5xl font-black uppercase leading-[0.88] tracking-[-0.055em] sm:text-7xl lg:text-[7rem]">
              {identity.name}
            </h1>

            <p className="mt-7 max-w-3xl text-base leading-7 text-white/68 sm:text-lg">
              {identity.introduction}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <HeroFact
                icon={
                  <MapPin
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                }
                label="City"
                value={identity.city}
                accent={
                  tournament.colors.primary
                }
              />

              <HeroFact
                icon={
                  <Trophy
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                }
                label="Surface"
                value={identity.surface}
                accent={
                  tournament.colors.primary
                }
              />

              <HeroFact
                icon={
                  <CalendarDays
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                }
                label="Founded"
                value={identity.founded}
                accent={
                  tournament.colors.primary
                }
              />
            </div>
          </div>

          <div className="lg:justify-self-end">
            <div className="max-w-md rounded-3xl border border-white/10 bg-[#050B18]/58 p-6 backdrop-blur-xl sm:p-7">
              <div className="text-[9px] font-black uppercase tracking-[0.22em] text-white/35">
                Tournament identity
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                <IdentityRow
                  label="Official name"
                  value={
                    identity.officialName
                  }
                  accent={
                    tournament.colors.primary
                  }
                />

                <IdentityRow
                  label="Venue"
                  value={identity.venue}
                  accent={
                    tournament.colors.primary
                  }
                />

                <IdentityRow
                  label="Location"
                  value={`${identity.city}, ${identity.country}`}
                  accent={
                    tournament.colors.primary
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <a
          href="#tournament-identity"
          className="mt-auto inline-flex w-fit items-center gap-2 text-[9px] font-black uppercase tracking-[0.18em] text-white/35 transition hover:text-white"
        >
          Explore tournament

          <ArrowDown
            className="h-4 w-4"
            aria-hidden="true"
          />
        </a>
      </div>
    </section>
  );
}

type HeroFactProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
};

function HeroFact({
  icon,
  label,
  value,
  accent,
}: HeroFactProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#050B18]/52 px-4 py-3 backdrop-blur-md">
      <span
        style={{
          color: accent,
        }}
      >
        {icon}
      </span>

      <span>
        <span className="block text-[8px] font-black uppercase tracking-[0.17em] text-white/30">
          {label}
        </span>

        <span className="mt-0.5 block text-xs font-bold text-white/75">
          {value}
        </span>
      </span>
    </div>
  );
}

type IdentityRowProps = {
  label: string;
  value: string;
  accent: string;
};

function IdentityRow({
  label,
  value,
  accent,
}: IdentityRowProps) {
  return (
    <div className="border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
      <div
        className="text-[8px] font-black uppercase tracking-[0.18em]"
        style={{
          color: accent,
        }}
      >
        {label}
      </div>

      <div className="mt-1.5 text-sm font-bold leading-5 text-white/76">
        {value}
      </div>
    </div>
  );
}