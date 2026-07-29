import type { LucideIcon } from "lucide-react";
import { Trophy, UserRound } from "lucide-react";

type PlayerDossierPlayer = {
  name: string;
  firstName: string | null;
  lastName: string | null;
  debutYear: number | null;
};

type PlayerDossierRanking = {
  rank: number;
  points: number | null;
  age: number | null;
};

type PlayerDossierProps = {
  player: PlayerDossierPlayer;
  ranking: PlayerDossierRanking | null;
  countryLabel: string;
  collectionLabel: string;
  artifactCount: number;
  brands: string[];
};

function formatPoints(points: number | null | undefined): string {
  if (points === null || points === undefined) {
    return "—";
  }

  return new Intl.NumberFormat("it-IT").format(points);
}

function displayValue(
  value: string | number | null | undefined,
): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  return String(value);
}

export default function PlayerDossier({
  player,
  ranking,
  countryLabel,
  collectionLabel,
  artifactCount,
  brands,
}: PlayerDossierProps) {
  return (
    <section
      id="player-dossier"
      className="scroll-mt-16 border-t border-white/10 px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#D7FF00]">
              Player dossier
            </p>

            <h2 className="mt-5 max-w-4xl text-4xl font-black uppercase leading-[0.92] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
              Identity and career record
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-7 text-white/45 lg:text-right">
            Only information currently supported by the AGE202 data model is
            displayed. Unsupported fields remain marked with an em dash.
          </p>
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-2">
          <DossierPanel
            title="Personal"
            icon={UserRound}
            items={[
              ["Full name", player.name],
              ["First name", player.firstName ?? "—"],
              ["Last name", player.lastName ?? "—"],
              ["Country", countryLabel],
              ["Age", ranking?.age ? String(ranking.age) : "—"],
              ["Birth date", "—"],
              ["Birth place", "—"],
              ["Height", "—"],
              ["Weight", "—"],
              ["Plays", "—"],
              ["Backhand", "—"],
              ["Coach", "—"],
            ]}
          />

          <DossierPanel
            title="Career"
            icon={Trophy}
            items={[
              ["Current ranking", ranking ? `ATP #${ranking.rank}` : "—"],
              ["ATP points", formatPoints(ranking?.points)],
              ["Career high", "—"],
              [
                "Turned pro",
                player.debutYear ? String(player.debutYear) : "—",
              ],
              ["ATP titles", "—"],
              ["Grand Slams", "—"],
              ["ATP Finals", "—"],
              ["Masters 1000", "—"],
              ["Prize money", "—"],
              ["Collection", collectionLabel],
              ["Artifacts", String(artifactCount)],
              ["Brands", brands.length > 0 ? brands.join(", ") : "—"],
            ]}
          />
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#D7FF00]">
              Career timeline
            </p>

            <h3 className="mt-5 text-3xl font-black uppercase leading-[0.95] tracking-[-0.045em] sm:text-4xl">
              Verified milestones
            </h3>

            <p className="mt-5 text-sm leading-7 text-white/42">
              The timeline intentionally includes only milestones that can be
              derived from the current profile and ranking records.
            </p>
          </div>

          <div className="relative rounded-[2rem] border border-white/10 bg-[#07101D]/75 p-6 sm:p-8">
            <div className="absolute bottom-8 left-[2.05rem] top-8 w-px bg-white/10 sm:left-[2.55rem]" />

            <div className="space-y-8">
              <TimelineItem
                year={player.debutYear ? String(player.debutYear) : "—"}
                title="Professional debut"
                description={
                  player.debutYear
                    ? `${player.name} entered the professional circuit.`
                    : "Professional debut year has not yet been recorded."
                }
                active={Boolean(player.debutYear)}
              />

              <TimelineItem
                year={ranking ? `#${ranking.rank}` : "—"}
                title="Current ATP position"
                description={
                  ranking
                    ? `${formatPoints(
                        ranking.points,
                      )} ATP points currently connected to the archive.`
                    : "No live ATP ranking is currently connected."
                }
                active={Boolean(ranking)}
              />

              <TimelineItem
                year="AGE202"
                title="Digital archive profile"
                description={`${artifactCount} published artifact${
                  artifactCount === 1 ? "" : "s"
                } and ${brands.length} connected brand${
                  brands.length === 1 ? "" : "s"
                } form the current archive record.`}
                active
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type DossierPanelProps = {
  title: string;
  icon: LucideIcon;
  items: Array<[string, string]>;
};

function DossierPanel({
  title,
  icon: Icon,
  items,
}: DossierPanelProps) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#07101D]/80">
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 sm:px-7">
        <div>
          <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#D7FF00]">
            Dossier section
          </p>

          <h3 className="mt-2 text-2xl font-black uppercase tracking-[-0.04em]">
            {title}
          </h3>
        </div>

        <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-[#D7FF00]">
          <Icon size={18} strokeWidth={1.4} aria-hidden="true" />
        </span>
      </div>

      <dl className="grid sm:grid-cols-2">
        {items.map(([label, value]) => (
          <div
            key={label}
            className="border-b border-white/10 px-6 py-5 last:border-b-0 sm:odd:border-r sm:[&:nth-last-child(-n+2)]:border-b-0"
          >
            <dt className="font-mono text-[7px] uppercase tracking-[0.18em] text-white/30">
              {label}
            </dt>

            <dd className="mt-2 text-sm font-bold uppercase tracking-[0.04em] text-white/72">
              {displayValue(value)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

type TimelineItemProps = {
  year: string;
  title: string;
  description: string;
  active: boolean;
};

function TimelineItem({
  year,
  title,
  description,
  active,
}: TimelineItemProps) {
  return (
    <article className="relative grid grid-cols-[52px_minmax(0,1fr)] gap-5 sm:grid-cols-[64px_minmax(0,1fr)] sm:gap-6">
      <div className="relative z-10 flex justify-center">
        <span
          className={`mt-1 grid h-5 w-5 place-items-center rounded-full border ${
            active
              ? "border-[#D7FF00]/60 bg-[#D7FF00]/15"
              : "border-white/15 bg-[#07101D]"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              active ? "bg-[#D7FF00]" : "bg-white/25"
            }`}
          />
        </span>
      </div>

      <div className="pb-1">
        <p
          className={`font-mono text-[8px] font-black uppercase tracking-[0.2em] ${
            active ? "text-[#D7FF00]" : "text-white/28"
          }`}
        >
          {year}
        </p>

        <h4 className="mt-3 text-lg font-black uppercase tracking-[-0.025em] text-white/82 sm:text-xl">
          {title}
        </h4>

        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/42">
          {description}
        </p>
      </div>
    </article>
  );
}