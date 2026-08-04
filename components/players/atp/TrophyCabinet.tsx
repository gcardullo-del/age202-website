import type { LucideIcon } from "lucide-react";
import {
  Award,
  Crown,
  Medal,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";

type TrophyCabinetProfile = {
  atpTitles: number;
  australianOpen: number;
  rolandGarros: number;
  wimbledon: number;
  usOpen: number;
  grandSlams: number;
  masters1000: number;
  atpFinals: number;
  olympicGold: number;
  davisCup: number;
};

type TrophyCabinetProps = {
  playerName: string;
  profile: TrophyCabinetProfile | null;
  profileCompletionLabel: string;
};

type TrophyFactProps = {
  label: string;
  value: number;
  icon: LucideIcon;
  featured?: boolean;
};

function formatTitleCount(value: number | null | undefined): string {
  return String(value ?? 0).padStart(2, "0");
}

export default function TrophyCabinet({
  playerName,
  profile,
  profileCompletionLabel,
}: TrophyCabinetProps) {
  const grandSlamTotal =
    profile?.grandSlams ??
    (
      (profile?.australianOpen ?? 0) +
      (profile?.rolandGarros ?? 0) +
      (profile?.wimbledon ?? 0) +
      (profile?.usOpen ?? 0)
    );

  const trophyFacts: TrophyFactProps[] = [
    {
      label: "Australian Open",
      value: profile?.australianOpen ?? 0,
      icon: Trophy,
    },
    {
      label: "Roland Garros",
      value: profile?.rolandGarros ?? 0,
      icon: Trophy,
    },
    {
      label: "Wimbledon",
      value: profile?.wimbledon ?? 0,
      icon: Crown,
    },
    {
      label: "US Open",
      value: profile?.usOpen ?? 0,
      icon: Trophy,
    },
    {
      label: "ATP Finals",
      value: profile?.atpFinals ?? 0,
      icon: Sparkles,
    },
    {
      label: "Masters 1000",
      value: profile?.masters1000 ?? 0,
      icon: Award,
    },
    {
      label: "Olympic Gold",
      value: profile?.olympicGold ?? 0,
      icon: Medal,
    },
    {
      label: "Davis Cup",
      value: profile?.davisCup ?? 0,
      icon: ShieldCheck,
    },
  ];

  return (
    <section
      id="trophy-cabinet"
      className="scroll-mt-16 border-t border-white/10 px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#D7FF00]">
              Career honours
            </p>

            <h2 className="mt-5 text-4xl font-black uppercase leading-[0.92] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
              Trophy cabinet
            </h2>
          </div>

          <p className="text-sm leading-7 text-white/45 lg:text-right">
            Verified titles and international honours recorded across
            {` ${playerName}'s`} professional career.
          </p>
        </div>

        <div className="mt-10 grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="grid gap-px overflow-hidden rounded-[1.9rem] border border-white/10 bg-white/10 sm:grid-cols-2 xl:grid-cols-3">
            {trophyFacts.slice(0, 6).map((fact) => (
              <TrophyFact
                key={fact.label}
                {...fact}
              />
            ))}
          </div>

          <aside className="relative overflow-hidden rounded-[1.9rem] border border-[#D7FF00]/20 bg-[linear-gradient(145deg,rgba(215,255,0,0.08),rgba(7,16,29,0.98)_58%)] p-7 shadow-[0_24px_80px_rgba(215,255,0,0.055)]">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full border border-[#D7FF00]/10" />

            <div className="relative">
              <span className="grid h-12 w-12 place-items-center rounded-2xl border border-[#D7FF00]/25 bg-[#D7FF00]/10 text-[#D7FF00]">
                <Crown size={20} strokeWidth={1.4} aria-hidden="true" />
              </span>

              <p className="mt-7 font-mono text-[8px] font-black uppercase tracking-[0.2em] text-[#D7FF00]">
                Career totals
              </p>

              <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/10">
                <CareerTotal
                  label="ATP titles"
                  value={profile?.atpTitles ?? 0}
                />

                <CareerTotal
                  label="Grand Slams"
                  value={grandSlamTotal}
                />

                <CareerTotal
                  label="Olympic gold"
                  value={profile?.olympicGold ?? 0}
                />

                <CareerTotal
                  label="Davis Cup"
                  value={profile?.davisCup ?? 0}
                />
              </div>

              <p className="mt-6 text-xs leading-6 text-white/38">
                Totals are displayed only from records stored in the AGE202
                player profile.
              </p>
            </div>
          </aside>
        </div>

        <div className="mt-5 grid gap-px overflow-hidden rounded-[1.7rem] border border-white/10 bg-white/10 sm:grid-cols-2">
          {trophyFacts.slice(6).map((fact) => (
            <TrophyFact
              key={fact.label}
              {...fact}
              featured
            />
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.025] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/35">
              Profile completeness
            </span>

            <p className="mt-2 text-xs leading-6 text-white/32">
              Missing honours remain at zero until verified records are added.
            </p>
          </div>

          <span className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-[#D7FF00]">
            {profileCompletionLabel}
          </span>
        </div>
      </div>
    </section>
  );
}

function TrophyFact({
  label,
  value,
  icon: Icon,
  featured = false,
}: TrophyFactProps) {
  return (
    <article
      className={[
        "group flex min-h-[150px] items-center justify-between px-6 py-7 transition",
        featured
          ? "bg-[linear-gradient(135deg,rgba(215,255,0,0.055),#07101D_60%)] hover:bg-[linear-gradient(135deg,rgba(215,255,0,0.09),#091421_60%)]"
          : "bg-[#07101D] hover:bg-[#091421]",
      ].join(" ")}
    >
      <div>
        <span
          className={[
            "block text-3xl font-black tracking-[-0.05em]",
            value > 0
              ? "text-white"
              : "text-white/28",
          ].join(" ")}
        >
          {formatTitleCount(value)}
        </span>

        <span className="mt-4 block font-mono text-[8px] uppercase tracking-[0.18em] text-white/35">
          {label}
        </span>
      </div>

      <span
        className={[
          "grid h-12 w-12 place-items-center rounded-2xl border transition",
          value > 0 || featured
            ? "border-[#D7FF00]/25 bg-[#D7FF00]/[0.07] text-[#D7FF00] group-hover:border-[#D7FF00]/45"
            : "border-white/10 bg-white/[0.025] text-white/25",
        ].join(" ")}
      >
        <Icon size={18} strokeWidth={1.4} aria-hidden="true" />
      </span>
    </article>
  );
}

type CareerTotalProps = {
  label: string;
  value: number;
};

function CareerTotal({
  label,
  value,
}: CareerTotalProps) {
  return (
    <div className="bg-[#07101D]/92 p-4">
      <span className="block text-2xl font-black tracking-[-0.045em] text-white">
        {formatTitleCount(value)}
      </span>

      <span className="mt-2 block font-mono text-[7px] uppercase tracking-[0.15em] text-white/30">
        {label}
      </span>
    </div>
  );
}