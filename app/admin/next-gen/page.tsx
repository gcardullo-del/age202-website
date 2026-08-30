import Link from "next/link";

import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Clock3,
  ExternalLink,
  ImageIcon,
  Minus,
  Plus,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";

import AdminShell from "@/components/admin/AdminShell";

import {
  getNextGenRankings,
  type NextGenRankingView,
} from "@/lib/next-gen/next-gen-ranking.service";

import {
  prisma,
} from "@/lib/prisma";


export const dynamic = "force-dynamic";


type NextGenAdminPlayer = {
  id: string;
  playerKey: string;
  archiveNumber: number;
  name: string;
  country: string;
  flag: string | null;
  portraitImage: string | null;
  contributionStatus: string;
  status: string;
  ranking: NextGenRankingView | null;
};


function formatArchiveNumber(
  value: number,
) {
  return String(value).padStart(2, "0");
}


function formatDate(
  value: Date | null,
) {
  if (!value) {
    return "Never";
  }

  return new Intl.DateTimeFormat(
    "it-IT",
    {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Europe/Rome",
    },
  ).format(value);
}


function getMovement(
  currentRank: number | null,
  previousRank: number | null,
) {
  if (
    currentRank === null ||
    previousRank === null ||
    currentRank === previousRank
  ) {
    return {
      direction: "neutral" as const,
      amount: null,
    };
  }

  if (currentRank < previousRank) {
    return {
      direction: "up" as const,
      amount:
        previousRank - currentRank,
    };
  }

  return {
    direction: "down" as const,
    amount:
      currentRank - previousRank,
  };
}


function getStatusLabel(
  status: string,
) {
  switch (status) {
    case "PUBLISHED":
      return "Published";

    case "ARCHIVED":
      return "Archived";

    default:
      return "Draft";
  }
}


function getContributionLabel(
  status: string,
) {
  switch (status) {
    case "RECEIVED":
      return "Received";

    case "PUBLISHED":
      return "Published";

    default:
      return "Awaiting Contribution";
  }
}


function MetricCard({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.035] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
            {label}
          </p>

          <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
            {value}
          </p>

          <p className="mt-2 text-sm text-white/45">
            {detail}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#C8FF00]/20 bg-[#C8FF00]/10 text-[#C8FF00]">
          {icon}
        </div>
      </div>
    </div>
  );
}


function Movement({
  currentRank,
  previousRank,
}: {
  currentRank: number | null;
  previousRank: number | null;
}) {
  const movement =
    getMovement(
      currentRank,
      previousRank,
    );

  if (
    movement.direction === "up"
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-400">
        <ArrowUp className="h-4 w-4" />
        {movement.amount}
      </span>
    );
  }

  if (
    movement.direction === "down"
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-400">
        <ArrowDown className="h-4 w-4" />
        {movement.amount}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-white/35">
      <Minus className="h-4 w-4" />
      —
    </span>
  );
}


export default async function AdminNextGenPage() {
  const [
    dbPlayers,
    rankings,
  ] = await Promise.all([
    prisma.nextGenPlayer.findMany({
      select: {
        id: true,
        playerKey: true,
        archiveNumber: true,
        name: true,
        country: true,
        flag: true,
        portraitImage: true,
        contributionStatus: true,
        status: true,
      },
    }),

    getNextGenRankings(),
  ]);

  const players: NextGenAdminPlayer[] =
    dbPlayers
      .map((player) => ({
        ...player,
        ranking:
          rankings.get(
            player.playerKey,
          ) ?? null,
      }))
      .sort((a, b) => {
        const rankA =
          a.ranking?.currentRank ??
          Number.POSITIVE_INFINITY;

        const rankB =
          b.ranking?.currentRank ??
          Number.POSITIVE_INFINITY;

        if (rankA !== rankB) {
          return rankA - rankB;
        }

        return (
          a.archiveNumber -
          b.archiveNumber
        );
      });

  const syncedPlayers =
    players.filter(
      (player) =>
        player.ranking?.currentRank !==
        null &&
        player.ranking?.currentRank !==
        undefined,
    ).length;

  const top200Players =
    players.filter((player) => {
      const rank =
        player.ranking?.currentRank;

      return (
        rank !== null &&
        rank !== undefined &&
        rank <= 200
      );
    }).length;

  const careerHighRanks =
    players
      .map(
        (player) =>
          player.ranking
            ?.careerHighRank ?? null,
      )
      .filter(
        (rank): rank is number =>
          rank !== null,
      );

  const bestCareerHigh =
    careerHighRanks.length > 0
      ? Math.min(...careerHighRanks)
      : null;

  const lastSyncDates =
    players
      .map(
        (player) =>
          player.ranking
            ?.lastSyncedAt ?? null,
      )
      .filter(
        (date): date is Date =>
          date !== null,
      );

  const lastSync =
    lastSyncDates.length > 0
      ? new Date(
          Math.max(
            ...lastSyncDates.map(
              (date) =>
                date.getTime(),
            ),
          ),
        )
      : null;

  return (
    <AdminShell
      title="NEXT GEN"
      description="Manage the AGE202 NEXT GEN archive, player dossiers and automatic ATP ranking data."
    >
      <div className="space-y-6">
        <section className="overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(200,255,0,0.10),transparent_34%),rgba(255,255,255,0.025)] p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-[#C8FF00]">
                <Sparkles className="h-4 w-4" />

                <span className="text-[11px] font-semibold uppercase tracking-[0.22em]">
                  AGE202 Archive
                </span>
              </div>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                NEXT GEN Player Management
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">
                Player identity and editorial content are managed from the CMS. ATP Rank, movement and Career High remain synchronized automatically and are read-only here.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/next-gen"
                target="_blank"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-white/75 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
              >
                View public archive
                <ExternalLink className="h-4 w-4" />
              </Link>

              <Link
                href="/admin/next-gen/new"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#C8FF00] px-4 text-sm font-bold text-[#07100A] transition hover:brightness-95"
              >
                <Plus className="h-4 w-4" />
                New Player
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Archive Players"
            value={String(
              players.length,
            )}
            detail="Players stored in NEXT GEN CMS"
            icon={
              <Users className="h-5 w-5" />
            }
          />

          <MetricCard
            label="Ranking Synced"
            value={`${syncedPlayers}/${players.length}`}
            detail="Players with a current ATP rank"
            icon={
              <Sparkles className="h-5 w-5" />
            }
          />

          <MetricCard
            label="Top 200"
            value={String(
              top200Players,
            )}
            detail="Current ATP ranking"
            icon={
              <Trophy className="h-5 w-5" />
            }
          />

          <MetricCard
            label="Best Career High"
            value={
              bestCareerHigh === null
                ? "—"
                : `#${bestCareerHigh}`
            }
            detail="Best recorded ATP career high"
            icon={
              <ArrowUp className="h-5 w-5" />
            }
          />
        </section>

        <section className="rounded-[28px] border border-white/10 bg-white/[0.025]">
          <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h3 className="text-lg font-semibold text-white">
                NEXT GEN Players
              </h3>

              <p className="mt-1 text-sm text-white/40">
                Display order follows the current ATP ranking. Archive numbers remain permanent.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 text-xs text-white/35">
              <Clock3 className="h-4 w-4" />
              Last ranking sync: {formatDate(lastSync)}
            </div>
          </div>

          {players.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#C8FF00]/20 bg-[#C8FF00]/10 text-[#C8FF00]">
                <Users className="h-6 w-6" />
              </div>

              <h4 className="mt-5 text-lg font-semibold text-white">
                No NEXT GEN players yet
              </h4>

              <p className="mt-2 max-w-md text-sm leading-6 text-white/45">
                Create the first player dossier from the CMS. Ranking information will appear after the ATP profile has been synchronized.
              </p>

              <Link
                href="/admin/next-gen/new"
                className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#C8FF00] px-4 text-sm font-bold text-[#07100A]"
              >
                <Plus className="h-4 w-4" />
                New Player
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[1180px] w-full">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30 sm:px-6">
                      Archive
                    </th>
                    <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                      Player
                    </th>
                    <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                      ATP Rank
                    </th>
                    <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                      Movement
                    </th>
                    <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                      Career High
                    </th>
                    <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                      Portrait
                    </th>
                    <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                      Contribution
                    </th>
                    <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                      Status
                    </th>
                    <th className="px-5 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30 sm:px-6">
                      Manage
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {players.map((player) => {
                    const currentRank =
                      player.ranking
                        ?.currentRank ?? null;

                    const previousRank =
                      player.ranking
                        ?.previousRank ?? null;

                    const careerHigh =
                      player.ranking
                        ?.careerHighRank ?? null;

                    return (
                      <tr
                        key={player.id}
                        className="border-b border-white/[0.06] last:border-b-0 hover:bg-white/[0.025]"
                      >
                        <td className="px-5 py-5 sm:px-6">
                          <span className="font-mono text-sm font-semibold text-[#C8FF00]">
                            {formatArchiveNumber(
                              player.archiveNumber,
                            )}
                          </span>
                        </td>

                        <td className="px-4 py-5">
                          <div className="flex items-center gap-3">
                            <span className="text-xl leading-none">
                              {player.flag ?? "🏳️"}
                            </span>

                            <div>
                              <p className="font-semibold text-white">
                                {player.name}
                              </p>

                              <p className="mt-1 text-xs text-white/35">
                                {player.country}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-5">
                          <span className="text-lg font-semibold text-white">
                            {currentRank === null
                              ? "—"
                              : `#${currentRank}`}
                          </span>
                        </td>

                        <td className="px-4 py-5">
                          <Movement
                            currentRank={
                              currentRank
                            }
                            previousRank={
                              previousRank
                            }
                          />
                        </td>

                        <td className="px-4 py-5">
                          <span className="text-sm font-semibold text-white/75">
                            {careerHigh === null
                              ? "—"
                              : `#${careerHigh}`}
                          </span>
                        </td>

                        <td className="px-4 py-5">
                          {player.portraitImage ? (
                            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                              <ImageIcon className="h-3.5 w-3.5" />
                              Added
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs font-semibold text-white/40">
                              <ImageIcon className="h-3.5 w-3.5" />
                              Awaiting
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-5">
                          <span className="text-xs font-medium text-white/50">
                            {getContributionLabel(
                              player.contributionStatus,
                            )}
                          </span>
                        </td>

                        <td className="px-4 py-5">
                          <span className="inline-flex rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs font-semibold text-white/55">
                            {getStatusLabel(
                              player.status,
                            )}
                          </span>
                        </td>

                        <td className="px-5 py-5 text-right sm:px-6">
                          <Link
                            href={`/admin/next-gen/${player.playerKey}`}
                            className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-xs font-semibold text-white/70 transition hover:border-[#C8FF00]/30 hover:bg-[#C8FF00]/10 hover:text-[#C8FF00]"
                          >
                            Open
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-[24px] border border-[#C8FF00]/15 bg-[#C8FF00]/[0.04] px-5 py-4">
          <p className="text-sm leading-6 text-white/50">
            <span className="font-semibold text-[#C8FF00]">
              Ranking protection:
            </span>{" "}
            ATP ranking fields are not edited manually from the CMS. They remain controlled by the dedicated NEXT GEN ranking sync.
          </p>
        </section>
      </div>
    </AdminShell>
  );
}
