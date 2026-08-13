import {
  CalendarDays,
  CircleDot,
  Crown,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";

import type {
  GrandSlamRecord,
  GrandSlamSlug,
} from "@/lib/data/grand-slams";

import {
  getMuseumTournamentBySlug,
} from "@/lib/services/museum/tournament.service";

type GrandSlamRecordsSectionProps = {
  slug: GrandSlamSlug;
  cmsSlug?: string;
  fallbackRecords?: GrandSlamRecord[];
};

type DisplayRecord = {
  label: string;
  value: string;
  description: string;
};

function formatSurface(
  surface: string,
): string {
  return surface
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    );
}

function buildCmsRecords(
  tournament: NonNullable<
    Awaited<
      ReturnType<
        typeof getMuseumTournamentBySlug
      >
    >
  >,
): DisplayRecord[] {
  const {
    firstRecordedYear,
    latestRecordedYear,
    recordTitles,
    uniqueChampions,
  } = tournament.statistics;

  const recordHolders =
    recordTitles > 0
      ? tournament.champions
          .filter(
            (champion) =>
              champion.titles ===
              recordTitles,
          )
          .map(
            (champion) =>
              champion.player?.name ||
              champion.name,
          )
          .filter(
            (
              name,
            ): name is string =>
              Boolean(name),
          )
      : [];

  const archiveSpan =
    firstRecordedYear !== null &&
    latestRecordedYear !== null
      ? `${firstRecordedYear}–${latestRecordedYear}`
      : firstRecordedYear !== null
        ? String(firstRecordedYear)
        : latestRecordedYear !== null
          ? String(latestRecordedYear)
          : "—";

  const recordHolderDescription =
    recordHolders.length > 0
      ? `${recordHolders.join(" · ")} ${
          recordHolders.length === 1
            ? "holds"
            : "share"
        } the current men’s singles record.`
      : "The all-time title benchmark will appear here as the championship archive grows.";

  return [
    {
      label: "Record titles",
      value:
        recordTitles > 0
          ? `${recordTitles} titles`
          : "—",
      description:
        recordHolderDescription,
    },
    {
      label: "Unique champions",
      value:
        uniqueChampions > 0
          ? String(
              uniqueChampions,
            )
          : "—",
      description:
        "Different men’s singles champions currently represented in the AGE202 tournament archive.",
    },
    {
      label: "Archive span",
      value:
        archiveSpan,
      description:
        "The year range currently represented by the live Tournament Studio archive.",
    },
    {
      label: "Court identity",
      value:
        formatSurface(
          tournament.surface,
        ),
      description:
        "The playing surface that defines movement, rhythm and competitive identity at this Grand Slam.",
    },
  ];
}

export default async function GrandSlamRecordsSection({
  slug,
  cmsSlug,
  fallbackRecords = [],
}: GrandSlamRecordsSectionProps) {
  const tournament =
    await getMuseumTournamentBySlug(
      cmsSlug ?? slug,
    );

  const hasCmsArchive =
    Boolean(
      tournament &&
      (
        tournament.statistics
          .totalEditions > 0 ||
        tournament.statistics
          .recordTitles > 0
      ),
    );

  const records: DisplayRecord[] =
    tournament &&
    hasCmsArchive
      ? buildCmsRecords(
          tournament,
        )
      : fallbackRecords;

  if (records.length === 0) {
    return null;
  }

  const tournamentName =
    tournament?.shortName?.trim() ||
    tournament?.name?.trim() ||
    slug
      .replaceAll(
        "-",
        " ",
      )
      .replace(
        /\b\w/g,
        (letter) =>
          letter.toUpperCase(),
      );

  const icons = [
    Crown,
    Trophy,
    CalendarDays,
    CircleDot,
  ];

  return (
    <section
      id="records"
      className="relative isolate scroll-mt-24 overflow-hidden border-t border-white/10 px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <div className="pointer-events-none absolute -right-48 top-20 h-[34rem] w-[34rem] rounded-full bg-[var(--tournament-glow)] opacity-25 blur-3xl" />

      <div className="pointer-events-none absolute -left-48 bottom-12 h-[28rem] w-[28rem] rounded-full bg-[var(--tournament-glow)] opacity-10 blur-3xl" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="relative mx-auto max-w-[1440px]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_470px] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-3">
              <span className="h-px w-10 bg-[var(--tournament-primary)]" />

              <p className="font-mono text-[9px] font-black uppercase tracking-[0.24em] text-[var(--tournament-primary)]">
                Tournament records
              </p>
            </div>

            <h2 className="mt-6 max-w-5xl text-4xl font-black uppercase leading-[0.9] tracking-[-0.06em] sm:text-5xl lg:text-7xl">
              Archive profile.
            </h2>
          </div>

          <p className="text-sm leading-7 text-white/43 lg:text-right">
            The defining competitive and historical markers of {tournamentName},
            generated from the live championship archive whenever Tournament
            Studio data is available.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {records.map(
            (
              record,
              index,
            ) => {
              const Icon =
                icons[
                  index %
                  icons.length
                ];

              const isPrimary =
                index === 0;

              return (
                <article
                  key={`${record.label}-${record.value}`}
                  className={`group relative overflow-hidden rounded-[1.95rem] border p-7 transition duration-300 hover:-translate-y-1 ${
                    isPrimary
                      ? "min-h-[330px] border-[var(--tournament-primary)]/25 bg-[linear-gradient(145deg,#0A1726_0%,#07101D_62%,#050B18_100%)] shadow-[0_24px_70px_rgba(0,0,0,0.2)]"
                      : "min-h-[310px] border-white/10 bg-[#07101D] hover:border-[var(--tournament-primary)]"
                  }`}
                >
                  <div className="pointer-events-none absolute -right-5 -top-8 text-[7rem] font-black leading-none tracking-[-0.08em] text-white/[0.025]">
                    0
                    {index + 1}
                  </div>

                  <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-[var(--tournament-glow)] opacity-20 blur-3xl" />

                  <div className="relative flex h-full flex-col">
                    <span
                      className={`grid place-items-center rounded-2xl border text-[var(--tournament-primary)] ${
                        isPrimary
                          ? "h-12 w-12 border-[var(--tournament-primary)]/20 bg-[var(--tournament-primary)]/8"
                          : "h-11 w-11 border-white/10 bg-white/[0.03]"
                      }`}
                    >
                      <Icon
                        size={
                          isPrimary
                            ? 20
                            : 18
                        }
                        strokeWidth={1.4}
                        aria-hidden="true"
                      />
                    </span>

                    <p className="mt-8 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/28">
                      {record.label}
                    </p>

                    <h3
                      className={`mt-4 font-black uppercase leading-[0.95] tracking-[-0.045em] text-[var(--tournament-primary)] ${
                        isPrimary
                          ? "text-4xl"
                          : "text-3xl"
                      }`}
                    >
                      {record.value}
                    </h3>

                    <p className="mt-auto pt-8 text-xs leading-6 text-white/38">
                      {record.description}
                    </p>
                  </div>
                </article>
              );
            },
          )}
        </div>

        <div className="mt-6 rounded-[1.7rem] border border-white/10 bg-white/[0.02] p-6 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-[var(--tournament-primary)]">
                <ShieldCheck
                  size={17}
                  strokeWidth={1.4}
                  aria-hidden="true"
                />
              </span>

              <div>
                <h3 className="text-base font-black uppercase tracking-[-0.02em]">
                  Live archive metrics
                </h3>

                <p className="mt-2 max-w-3xl text-xs leading-6 text-white/36">
                  Tournament Studio remains the source for editions and championship leaders.
                  Static Grand Slam records are retained only as a fallback while the archive is completed.
                </p>
              </div>
            </div>

            <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2.5 font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/30">
              <Sparkles
                size={11}
                className="text-[var(--tournament-primary)]"
                aria-hidden="true"
              />

              {hasCmsArchive
                ? "Tournament Studio"
                : "Fallback active"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}