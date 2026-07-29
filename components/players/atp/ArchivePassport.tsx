import { BadgeCheck, Database } from "lucide-react";

type ArchivePassportProps = {
  player: {
    slug: string;
  };

  ranking: {
    rank: number;
  } | null;

  collectionLabel: string;
  artifactCount: number;
  availableArtifacts: number;
  soldArtifacts: number;
  reservedArtifacts: number;
  brandCount: number;
  certifiedArtifacts: number;
  archiveScore: number;
  archiveScoreLabel: string;
};

export default function ArchivePassport({
  player,
  ranking,
  collectionLabel,
  artifactCount,
  availableArtifacts,
  soldArtifacts,
  reservedArtifacts,
  brandCount,
  certifiedArtifacts,
  archiveScore,
  archiveScoreLabel,
}: ArchivePassportProps) {
  return (
    <section
      id="archive-passport"
      className="scroll-mt-16 border-t border-white/10 px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_430px]">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#D7FF00]">
              AGE202 archive statistics
            </p>

            <h2 className="mt-5 text-4xl font-black uppercase leading-[0.92] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
              Collection intelligence
            </h2>

            <div className="mt-10 grid gap-px overflow-hidden rounded-[1.9rem] border border-white/10 bg-white/10 sm:grid-cols-2 xl:grid-cols-3">
              <ArchiveMetric label="Published" value={artifactCount} />
              <ArchiveMetric label="Available" value={availableArtifacts} />
              <ArchiveMetric label="Sold" value={soldArtifacts} />
              <ArchiveMetric label="Other status" value={reservedArtifacts} />
              <ArchiveMetric label="Brands" value={brandCount} />
              <ArchiveMetric
                label="Certificates"
                value={certifiedArtifacts}
                muted
              />
            </div>

            <p className="mt-5 text-xs leading-6 text-white/30">
              Certificate totals will remain at zero until certificate data is
              included in the player repository query.
            </p>
          </div>

          <aside className="relative overflow-hidden rounded-[2rem] border border-[#D7FF00]/20 bg-[#08111F] p-7 sm:p-8">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#D7FF00]/[0.08] blur-3xl" />

            <div className="relative">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#D7FF00]">
                    AGE202 digital passport
                  </p>

                  <h3 className="mt-4 text-3xl font-black uppercase tracking-[-0.045em]">
                    Player archive ID
                  </h3>
                </div>

                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[#D7FF00]/25 bg-[#D7FF00]/[0.08] text-[#D7FF00]">
                  <Database
                    size={20}
                    strokeWidth={1.4}
                    aria-hidden="true"
                  />
                </span>
              </div>

              <dl className="mt-9 space-y-5">
                <PassportRow
                  label="Player ID"
                  value={player.slug.toUpperCase()}
                />
                <PassportRow
                  label="Archive status"
                  value={collectionLabel}
                />
                <PassportRow
                  label="ATP connection"
                  value={
                    ranking
                      ? `ACTIVE · #${ranking.rank}`
                      : "NOT CONNECTED"
                  }
                />
                <PassportRow
                  label="Published records"
                  value={String(artifactCount).padStart(2, "0")}
                />
                <PassportRow
                  label="Archive completeness"
                  value={`${archiveScore}/100 · ${archiveScoreLabel}`}
                />
                <PassportRow
                  label="Profile standard"
                  value="AGE202 PLAYER DOSSIER V1"
                />
              </dl>

              <div className="mt-8 rounded-[1.3rem] border border-white/10 bg-black/20 p-5">
                <div className="flex items-center gap-3">
                  <BadgeCheck
                    size={17}
                    className="text-[#D7FF00]"
                    aria-hidden="true"
                  />

                  <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/60">
                    Dynamic archive record
                  </span>
                </div>

                <p className="mt-4 text-xs leading-6 text-white/35">
                  Ranking, profile and collection information update from the
                  connected AGE202 repositories.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

type ArchiveMetricProps = {
  label: string;
  value: number;
  muted?: boolean;
};

function ArchiveMetric({
  label,
  value,
  muted = false,
}: ArchiveMetricProps) {
  return (
    <div className="bg-[#07101D] px-6 py-7">
      <span
        className={`block text-4xl font-black tracking-[-0.06em] ${
          muted ? "text-white/30" : "text-white/88"
        }`}
      >
        {String(value).padStart(2, "0")}
      </span>

      <span className="mt-4 block font-mono text-[8px] uppercase tracking-[0.18em] text-white/35">
        {label}
      </span>
    </div>
  );
}

type PassportRowProps = {
  label: string;
  value: string;
};

function PassportRow({
  label,
  value,
}: PassportRowProps) {
  return (
    <div className="flex items-start justify-between gap-5 border-b border-white/10 pb-5 last:border-b-0 last:pb-0">
      <dt className="font-mono text-[7px] uppercase tracking-[0.18em] text-white/30">
        {label}
      </dt>

      <dd className="max-w-[13rem] text-right text-xs font-black uppercase tracking-[0.08em] text-white/70">
        {value}
      </dd>
    </div>
  );
}