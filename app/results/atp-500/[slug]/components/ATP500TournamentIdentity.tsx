import {
  Building2,
  CalendarDays,
  CircleDot,
  Landmark,
  MapPin,
} from "lucide-react";

import type {
  Atp500Tournament,
} from "@/lib/data/atp-500";

import type {
  Atp500PublicIdentity,
} from "@/lib/mappers/atp-500-cms.mapper";

type ATP500TournamentIdentityProps = {
  tournament: Atp500Tournament;
  identity: Atp500PublicIdentity;
};

export default function ATP500TournamentIdentity({
  tournament,
  identity,
}: ATP500TournamentIdentityProps) {
  return (
    <section
      id="tournament-identity"
      className="border-b border-white/10 px-5 py-16 sm:px-8 lg:px-12 lg:py-20"
    >
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-10 flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div
              className="text-[9px] font-black uppercase tracking-[0.24em]"
              style={{
                color:
                  tournament.colors.primary,
              }}
            >
              01 · Tournament identity
            </div>

            <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.045em] sm:text-5xl">
              {identity.name}
            </h2>
          </div>

          <p className="max-w-2xl text-sm leading-6 text-white/45">
            A compact AGE202 dossier with the essential identity,
            setting and historical context of the tournament.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-3xl border border-white/10 bg-[#08101F] p-6 sm:p-7">
            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">
              Tournament dossier
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <IdentityCard
                icon={
                  <MapPin
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                }
                label="Location"
                value={`${identity.city}, ${identity.country}`}
                accent={
                  tournament.colors.primary
                }
              />

              <IdentityCard
                icon={
                  <Landmark
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                }
                label="Venue"
                value={identity.venue}
                accent={
                  tournament.colors.primary
                }
              />

              <IdentityCard
                icon={
                  <CircleDot
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

              <IdentityCard
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

            <div
              className="mt-6 rounded-2xl border p-5"
              style={{
                borderColor:
                  `${tournament.colors.primary}33`,
                backgroundColor:
                  `${tournament.colors.primary}0D`,
              }}
            >
              <div
                className="text-[8px] font-black uppercase tracking-[0.18em]"
                style={{
                  color:
                    tournament.colors.primary,
                }}
              >
                Official name
              </div>

              <div className="mt-2 text-lg font-black uppercase tracking-[-0.03em] text-white">
                {identity.officialName}
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#07101D] p-7 sm:p-8">
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-3xl"
              style={{
                backgroundColor:
                  `${tournament.colors.primary}16`,
              }}
              aria-hidden="true"
            />

            <div className="relative">
              <div className="flex items-center gap-3">
                <Building2
                  className="h-4 w-4"
                  style={{
                    color:
                      tournament.colors.primary,
                  }}
                  aria-hidden="true"
                />

                <span
                  className="text-[9px] font-black uppercase tracking-[0.22em]"
                  style={{
                    color:
                      tournament.colors.primary,
                  }}
                >
                  A short history
                </span>
              </div>

              <h3 className="mt-5 max-w-3xl text-3xl font-black uppercase leading-[0.95] tracking-[-0.04em] sm:text-4xl">
                The story behind
                {" "}
                {identity.name}.
              </h3>

              <div className="mt-7 space-y-5">
                {identity.history.map(
                  (
                    paragraph,
                    index,
                  ) => (
                    <p
                      key={`${paragraph}-${index}`}
                      className="max-w-3xl text-sm leading-7 text-white/58 sm:text-[15px]"
                    >
                      {paragraph}
                    </p>
                  ),
                )}
              </div>

              <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-5">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor:
                      tournament.colors.primary,
                    boxShadow:
                      `0 0 18px ${tournament.colors.glow}`,
                  }}
                  aria-hidden="true"
                />

                <span className="text-[9px] font-black uppercase tracking-[0.18em] text-white/30">
                  AGE202 · Tournament story
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type IdentityCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
};

function IdentityCard({
  icon,
  label,
  value,
  accent,
}: IdentityCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
      <div className="flex items-center gap-2">
        <span
          style={{
            color: accent,
          }}
        >
          {icon}
        </span>

        <span className="text-[8px] font-black uppercase tracking-[0.18em] text-white/30">
          {label}
        </span>
      </div>

      <div className="mt-3 text-sm font-bold leading-5 text-white/78">
        {value}
      </div>
    </div>
  );
}