import type { Product } from "@/data/product.types";
import { getArchiveStatistics } from "@/lib/archive/statistics";

type ArchiveOverviewProps = {
  products: Product[];
};

export default function ArchiveOverview({
  products,
}: ArchiveOverviewProps) {
  const statistics = getArchiveStatistics(products);

  const items = [
    {
      label: "Archive Pieces",
      value: statistics.total,
      description: "Curated museum records",
    },
    {
      label: "Available",
      value: statistics.available,
      description: "Currently accessible",
    },
    {
      label: "Sold",
      value: statistics.sold,
      description: "Preserved in the archive",
    },
    {
      label: "Coming Soon",
      value: statistics.comingSoon,
      description: "New acquisitions",
    },
    {
      label: "Authenticated",
      value: statistics.authentic,
      description: "Verified archive pieces",
    },
    {
      label: "Featured",
      value: statistics.featured,
      description: "Museum highlights",
    },
  ];

  return (
    <section className="border-b border-white/10 bg-[#08101F]">
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-8 lg:py-14">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[28px] border border-white/10 bg-white/10 md:grid-cols-3 xl:grid-cols-6">
          {items.map((item, index) => (
            <article
              key={item.label}
              className="relative min-h-40 overflow-hidden bg-[#0A1425] p-5 md:p-6"
            >
              <span className="absolute right-4 top-2 text-6xl font-black text-white/[0.025]">
                {String(index + 1).padStart(2, "0")}
              </span>

              <p className="relative text-[9px] font-black uppercase tracking-[0.25em] text-[#C8FF00]">
                {item.label}
              </p>

              <p className="relative mt-5 text-4xl font-black text-white">
                {String(item.value).padStart(2, "0")}
              </p>

              <p className="relative mt-3 text-xs leading-5 text-gray-500">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}