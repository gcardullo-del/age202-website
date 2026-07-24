import type { Product } from "@/data/products";
import { getMuseumStats } from "@/lib/museumStats";

type MuseumStatisticsProps = {
  products: Product[];
  className?: string;
};

type StatisticCardProps = {
  label: string;
  value: string | number;
  description: string;
  index: string;
};

export default function MuseumStatistics({
  products,
  className = "",
}: MuseumStatisticsProps) {
  const stats = getMuseumStats(products);

  const archivePeriod =
    stats.oldestYear && stats.newestYear
      ? stats.oldestYear === stats.newestYear
        ? stats.oldestYear.toString()
        : `${stats.oldestYear} — ${stats.newestYear}`
      : "Not documented";

  const statistics: StatisticCardProps[] = [
    {
      index: "01",
      label: "Archive Pieces",
      value: stats.totalPieces,
      description:
        "Collectible tennis garments documented inside the AGE202 archive.",
    },
    {
      index: "02",
      label: "Available Pieces",
      value: stats.availablePieces,
      description:
        "Archive records currently available for acquisition.",
    },
    {
      index: "03",
      label: "Grand Slam Pieces",
      value: stats.grandSlamPieces,
      description:
        "Items connected to the four major tournaments in tennis history.",
    },
    {
      index: "04",
      label: "Players",
      value: stats.players,
      description:
        "Tennis legends and modern champions represented in the collection.",
    },
    {
      index: "05",
      label: "Brands",
      value: stats.brands,
      description:
        "Historic sportswear manufacturers represented across the archive.",
    },
    {
      index: "06",
      label: "Collections",
      value: stats.collections,
      description:
        "Distinct seasons, tournament editions and player collections.",
    },
    {
      index: "07",
      label: "Availability",
      value: `${stats.availabilityPercentage}%`,
      description:
        `${stats.availablePieces} available and ${stats.archivedPieces} archived pieces.`,
    },
    {
      index: "08",
      label: "Archive Period",
      value: archivePeriod,
      description:
        "The documented historical range covered by the AGE202 collection.",
    },
  ];

  return (
    <section
      className={`relative overflow-hidden rounded-[42px] border border-white/10 bg-[#07101F] ${className}`}
    >
      {/* BACKGROUND EFFECTS */}

      <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-[#C8FF00]/[0.06] blur-[120px]" />

      <div className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-blue-500/[0.05] blur-[140px]" />

      {/* HEADER */}

      <div className="relative border-b border-white/10 px-6 py-10 md:px-10 md:py-14 xl:px-14">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-[10px] font-black uppercase tracking-[0.38em] text-[#C8FF00] md:text-xs">
              AGE202 Museum Intelligence
            </p>

            <h2 className="mt-5 max-w-2xl text-4xl font-black leading-[0.95] tracking-[-0.04em] text-white md:text-6xl">
              The archive,
              <span className="block text-gray-500">
                measured in history.
              </span>
            </h2>

            <p className="mt-7 max-w-2xl text-base leading-8 text-gray-400">
              Every statistic is generated automatically
              from the AGE202 archive. Add a new piece and
              the museum updates instantly.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C8FF00] opacity-50" />

              <span className="relative inline-flex h-3 w-3 rounded-full bg-[#C8FF00]" />
            </span>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-gray-500">
                Museum database
              </p>

              <p className="mt-1 text-sm font-bold text-white">
                Live and synchronized
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* STATISTICS GRID */}

      <div className="relative grid sm:grid-cols-2 xl:grid-cols-4">
        {statistics.map((statistic) => (
          <StatisticCard
            key={statistic.index}
            {...statistic}
          />
        ))}
      </div>
    </section>
  );
}

function StatisticCard({
  label,
  value,
  description,
  index,
}: StatisticCardProps) {
  return (
    <article className="group relative min-h-[290px] border-b border-white/10 p-7 transition-colors duration-500 hover:bg-white/[0.025] sm:p-9 sm:[&:nth-child(odd)]:border-r xl:border-b-0 xl:border-r xl:[&:nth-child(4n)]:border-r-0 xl:[&:nth-child(n+5)]:border-t">
      <div className="flex items-start justify-between gap-5">
        <p className="text-[10px] font-black tracking-[0.28em] text-gray-700 transition-colors duration-300 group-hover:text-[#C8FF00]">
          {index}
        </p>

        <span className="h-px w-10 bg-white/10 transition-all duration-500 group-hover:w-16 group-hover:bg-[#C8FF00]/70" />
      </div>

      <div className="mt-12">
        <p className="break-words text-4xl font-black leading-none tracking-[-0.05em] text-white md:text-5xl">
          {value}
        </p>

        <h3 className="mt-5 text-[11px] font-black uppercase tracking-[0.26em] text-[#C8FF00]">
          {label}
        </h3>

        <p className="mt-5 max-w-xs text-sm leading-7 text-gray-500">
          {description}
        </p>
      </div>

      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#C8FF00] transition-all duration-500 group-hover:w-full" />
    </article>
  );
}