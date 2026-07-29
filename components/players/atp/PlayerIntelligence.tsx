import { BadgeCheck, Gauge } from "lucide-react";

type PlayerIntelligencePlayer = {
  biography: string | null;
  debutYear: number | null;
};

type PlayerIntelligenceRanking = {
  rank: number;
  points: number | null;
  age: number | null;
};

type PlayerIntelligenceProps = {
  player: PlayerIntelligencePlayer;
  ranking: PlayerIntelligenceRanking | null;
  artifactCount: number;
  availableArtifacts: number;
  brands: string[];
  archiveScore: number;
  archiveScoreLabel: string;
  hasHeroImage: boolean;
};

function formatPoints(points: number | null | undefined): string {
  if (points === null || points === undefined) {
    return "—";
  }

  return new Intl.NumberFormat("it-IT").format(points);
}

export default function PlayerIntelligence({
  player,
  ranking,
  artifactCount,
  availableArtifacts,
  brands,
  archiveScore,
  archiveScoreLabel,
  hasHeroImage,
}: PlayerIntelligenceProps) {
  return (
    <section
      id="atp-intelligence"
      className="scroll-mt-16 border-t border-white/10 px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-stretch">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#D7FF00]">
              ATP intelligence
            </p>

            <h2 className="mt-5 max-w-4xl text-4xl font-black uppercase leading-[0.92] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
              Career snapshot
            </h2>

            <p className="mt-7 max-w-3xl text-sm leading-7 text-white/45 sm:text-base">
              A concise view of the player&apos;s current ATP position and the
              information already connected to the AGE202 archive.
            </p>

            <div className="mt-10 grid gap-px overflow-hidden rounded-[1.9rem] border border-white/10 bg-white/10 sm:grid-cols-2 xl:grid-cols-3">
              <CareerMetric
                label="Current ranking"
                value={ranking ? `ATP #${ranking.rank}` : "—"}
                note="Live ranking position"
              />

              <CareerMetric
                label="Ranking points"
                value={
                  ranking?.points !== null &&
                  ranking?.points !== undefined
                    ? formatPoints(ranking.points)
                    : "—"
                }
                note="Current ATP points"
              />

              <CareerMetric
                label="Professional debut"
                value={player.debutYear ? String(player.debutYear) : "—"}
                note="Recorded debut year"
              />

              <CareerMetric
                label="Age"
                value={ranking?.age ? String(ranking.age) : "—"}
                note="Current player age"
              />

              <CareerMetric
                label="Archive artifacts"
                value={String(artifactCount).padStart(2, "0")}
                note={`${availableArtifacts} currently available`}
              />

              <CareerMetric
                label="Archive brands"
                value={String(brands.length).padStart(2, "0")}
                note={
                  brands.length > 0
                    ? brands.slice(0, 2).join(" · ")
                    : "No brand connected"
                }
              />
            </div>
          </div>

          <aside className="relative overflow-hidden rounded-[2rem] border border-[#D7FF00]/20 bg-[#08111F] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-8">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#D7FF00]/[0.08] blur-3xl" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:42px_42px]" />

            <div className="relative">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#D7FF00]">
                    AGE202 archive score
                  </p>

                  <h3 className="mt-4 text-3xl font-black uppercase tracking-[-0.045em]">
                    {archiveScoreLabel}
                  </h3>
                </div>

                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[#D7FF00]/25 bg-[#D7FF00]/[0.08] text-[#D7FF00]">
                  <Gauge size={20} strokeWidth={1.4} aria-hidden="true" />
                </span>
              </div>

              <div className="mt-10 flex items-end gap-3">
                <span className="text-7xl font-black leading-none tracking-[-0.08em]">
                  {archiveScore}
                </span>

                <span className="pb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                  / 100
                </span>
              </div>

              <div
                className="mt-7 h-2 overflow-hidden rounded-full bg-white/[0.08]"
                role="progressbar"
                aria-label="AGE202 archive completeness score"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={archiveScore}
              >
                <div
                  className="h-full rounded-full bg-[#D7FF00]"
                  style={{ width: `${archiveScore}%` }}
                />
              </div>

              <div className="mt-8 space-y-4">
                <ScoreCheck
                  label="Player imagery"
                  completed={hasHeroImage}
                />

                <ScoreCheck
                  label="Editorial biography"
                  completed={Boolean(player.biography)}
                />

                <ScoreCheck
                  label="Live ATP connection"
                  completed={Boolean(ranking)}
                />

                <ScoreCheck
                  label="Collectible artifacts"
                  completed={artifactCount > 0}
                />
              </div>

              <p className="mt-8 border-t border-white/10 pt-6 text-xs leading-6 text-white/38">
                This internal AGE202 indicator measures archive completeness,
                not player performance.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

type CareerMetricProps = {
  label: string;
  value: string;
  note: string;
};

function CareerMetric({
  label,
  value,
  note,
}: CareerMetricProps) {
  return (
    <article className="min-h-[150px] bg-[#07101D] px-6 py-6">
      <p className="font-mono text-[7px] uppercase tracking-[0.18em] text-white/30">
        {label}
      </p>

      <p className="mt-5 text-2xl font-black uppercase tracking-[-0.045em] text-white/88 sm:text-3xl">
        {value}
      </p>

      <p className="mt-3 text-xs leading-5 text-white/35">
        {note}
      </p>
    </article>
  );
}

type ScoreCheckProps = {
  label: string;
  completed: boolean;
};

function ScoreCheck({
  label,
  completed,
}: ScoreCheckProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm font-semibold text-white/58">
        {label}
      </span>

      <span
        className={`inline-flex h-7 w-7 items-center justify-center rounded-full border ${
          completed
            ? "border-[#D7FF00]/35 bg-[#D7FF00]/10 text-[#D7FF00]"
            : "border-white/10 bg-white/[0.03] text-white/20"
        }`}
        aria-label={completed ? "Completed" : "Not completed"}
      >
        <BadgeCheck size={14} strokeWidth={1.7} aria-hidden="true" />
      </span>
    </div>
  );
}