import {
  CalendarDays,
  ExternalLink,
  Globe2,
  Layers3,
  Medal,
  Orbit,
  PackageSearch,
  Shirt,
  Sparkles,
  Trophy,
} from "lucide-react";

type PlayerOverviewPlayer = {
  name: string;
  biography: string | null;
  debutYear: number | null;
  collectionType: string;
};

type PlayerOverviewRanking = {
  rank: number;
  points: number | null;
  age: number | null;
};

type PlayerOverviewProps = {
  player: PlayerOverviewPlayer;
  ranking: PlayerOverviewRanking | null;
  countryLabel: string;
  collectionLabel: string;
  brands: string[];
  artifactCount: number;
  availableArtifacts: number;
};

function formatPoints(points: number | null | undefined): string {
  if (points === null || points === undefined) {
    return "—";
  }

  return new Intl.NumberFormat("it-IT").format(points);
}

export default function PlayerOverview({
  player,
  ranking,
  countryLabel,
  collectionLabel,
  brands,
  artifactCount,
  availableArtifacts,
}: PlayerOverviewProps) {
  return (
    <section
      id="career-overview"
      className="scroll-mt-16 relative px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <div className="pointer-events-none absolute left-[-12rem] top-10 h-[28rem] w-[28rem] rounded-full bg-[#D7FF00]/[0.035] blur-3xl" />

      <div className="relative mx-auto grid max-w-[1440px] gap-14 lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-20">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#D7FF00]">
            Career overview
          </p>

          <h2 className="mt-5 max-w-4xl text-4xl font-black uppercase leading-[0.9] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
            Beyond the baseline
          </h2>

          <p className="mt-8 max-w-4xl whitespace-pre-line text-base leading-8 text-white/58 sm:text-lg">
            {player.biography ??
              `${player.name} is represented within the expanding AGE202 digital tennis archive. This profile will grow with historical information, authenticated apparel and collectible artifacts.`}
          </p>

          <div className="mt-12 grid gap-px overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/10 sm:grid-cols-2 xl:grid-cols-4">
            <EditorialFact
              label="Current position"
              value={ranking ? `ATP #${ranking.rank}` : "Unranked"}
            />
            <EditorialFact
              label="Ranking points"
              value={
                ranking?.points !== null &&
                ranking?.points !== undefined
                  ? `${formatPoints(ranking.points)} pts`
                  : "—"
              }
            />
            <EditorialFact
              label="Professional debut"
              value={player.debutYear ? String(player.debutYear) : "—"}
            />
            <EditorialFact
              label="Archive status"
              value={
                player.collectionType === "FEATURED"
                  ? "Champion Collection"
                  : "ATP Archive"
              }
            />
          </div>

          <div className="mt-8 rounded-[1.8rem] border border-white/10 bg-white/[0.025] p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#D7FF00]">
                  AGE202 archive note
                </p>
                <h3 className="mt-4 text-2xl font-black uppercase tracking-[-0.04em] sm:text-3xl">
                  A profile designed to evolve
                </h3>
              </div>

              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[#D7FF00]/20 bg-[#D7FF00]/[0.06] text-[#D7FF00]">
                <Orbit size={19} strokeWidth={1.4} aria-hidden="true" />
              </span>
            </div>

            <p className="mt-5 max-w-4xl text-sm leading-7 text-white/48">
              Ranking data, player information and AGE202 artifacts are
              connected in one dynamic profile. New archive entries will
              appear here automatically as they are published.
            </p>
          </div>
        </div>

        <aside className="h-fit rounded-[1.9rem] border border-white/10 bg-[#07101D]/82 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:p-7 lg:sticky lg:top-28">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#D7FF00]">
                Profile details
              </p>
              <p className="mt-2 text-xs leading-5 text-white/36">
                Live archive information
              </p>
            </div>

            <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.035] text-[#D7FF00]">
              <Layers3 size={17} strokeWidth={1.4} aria-hidden="true" />
            </span>
          </div>

          <dl className="mt-7 space-y-5">
            <DetailRow
              icon={Globe2}
              label="Country"
              value={countryLabel}
            />
            <DetailRow
              icon={Trophy}
              label="ATP ranking"
              value={ranking ? `#${ranking.rank}` : "—"}
            />
            <DetailRow
              icon={Medal}
              label="ATP points"
              value={formatPoints(ranking?.points)}
            />
            <DetailRow
              icon={CalendarDays}
              label="Age"
              value={ranking?.age ? String(ranking.age) : "—"}
            />
            <DetailRow
              icon={CalendarDays}
              label="Professional debut"
              value={player.debutYear ? String(player.debutYear) : "—"}
            />
            <DetailRow
              icon={Sparkles}
              label="Collection"
              value={collectionLabel}
            />
            <DetailRow
              icon={Shirt}
              label="Brands"
              value={brands.length > 0 ? brands.join(", ") : "—"}
            />
            <DetailRow
              icon={PackageSearch}
              label="Published artifacts"
              value={String(artifactCount)}
            />
            <DetailRow
              icon={ExternalLink}
              label="Available now"
              value={String(availableArtifacts)}
            />
          </dl>
        </aside>
      </div>
    </section>
  );
}

type EditorialFactProps = {
  label: string;
  value: string;
};

function EditorialFact({
  label,
  value,
}: EditorialFactProps) {
  return (
    <div className="bg-[#07101D] px-5 py-6 sm:px-6">
      <span className="block text-lg font-black uppercase tracking-[-0.035em] text-white/88">
        {value}
      </span>
      <span className="mt-3 block font-mono text-[7px] uppercase tracking-[0.19em] text-white/32">
        {label}
      </span>
    </div>
  );
}

type DetailRowProps = {
  icon: typeof Globe2;
  label: string;
  value: string;
};

function DetailRow({
  icon: Icon,
  label,
  value,
}: DetailRowProps) {
  return (
    <div className="flex gap-4 border-b border-white/10 pb-5 last:border-b-0 last:pb-0">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 text-[#D7FF00]">
        <Icon size={15} strokeWidth={1.5} aria-hidden="true" />
      </span>

      <div>
        <dt className="font-mono text-[7px] uppercase tracking-[0.18em] text-white/30">
          {label}
        </dt>
        <dd className="mt-2 text-sm font-bold uppercase tracking-[0.04em] text-white/75">
          {value}
        </dd>
      </div>
    </div>
  );
}