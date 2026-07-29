import Image from "next/image";
import { BadgeCheck, ExternalLink, PackageSearch } from "lucide-react";

type PlayerArtifactsProps = {
  player: {
    name: string;
    artifacts: Array<{
      id: string;
      title: string;
      subtitle: string | null;
      archiveNumber: string;
      availability: string;
      vintedUrl: string | null;
      price: { toString(): string } | null;
      currency: string;
      brand: { name: string };
      images: Array<{
        url: string;
        alt: string | null;
        isCover: boolean;
      }>;
    }>;
  };
};

function getAvailabilityBadgeClass(availability: string): string {
  switch (availability) {
    case "AVAILABLE":
      return "border-[#D7FF00]/35 bg-[#D7FF00]/12 text-[#D7FF00]";
    case "SOLD":
      return "border-white/15 bg-white/[0.08] text-white/62";
    default:
      return "border-[#7DD3FC]/25 bg-[#7DD3FC]/10 text-[#BAE6FD]";
  }
}

function formatPrice(value: { toString(): string } | null, currency: string) {
  if (!value) return null;
  const n = Number(value.toString());
  if (!Number.isFinite(n)) return null;
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency,
  }).format(n);
}

export default function PlayerArtifacts({ player }: PlayerArtifactsProps) {
  return (
    <section id="player-artifacts" className="scroll-mt-16 border-t border-white/10 px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#D7FF00]">AGE202 collection</p>
            <h2 className="mt-5 text-4xl font-black uppercase tracking-[-0.05em] sm:text-5xl lg:text-6xl">Player artifacts</h2>
          </div>
          <p className="text-sm leading-7 text-white/45 lg:text-right">
            Authenticated garments, collectible pieces and historical references connected to {player.name}.
          </p>
        </div>

        {player.artifacts.length > 0 ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {player.artifacts.map((artifact) => {
              const cover = artifact.images.find(i=>i.isCover) ?? artifact.images[0] ?? null;
              const price = formatPrice(artifact.price, artifact.currency);

              return (
                <article key={artifact.id} className="group overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#09111f] transition hover:-translate-y-1.5 hover:border-[#D7FF00]/40">
                  <div className="relative aspect-[4/5]">
                    {cover ? (
                      <Image fill src={cover.url} alt={cover.alt ?? artifact.title} className="object-cover transition duration-700 group-hover:scale-[1.04]" sizes="(max-width:768px)100vw,(max-width:1280px)50vw,33vw"/>
                    ) : (
                      <div className="absolute inset-0 grid place-items-center"><PackageSearch className="text-white/10" size={52}/></div>
                    )}
                    <div className="absolute inset-x-0 top-0 flex justify-between p-5">
                      <span className="rounded-full border border-white/10 bg-black/35 px-3 py-2 font-mono text-[7px]">{artifact.archiveNumber}</span>
                      <span className={`rounded-full border px-3 py-2 font-mono text-[7px] ${getAvailabilityBadgeClass(artifact.availability)}`}>{artifact.availability.replaceAll("_"," ")}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#D7FF00]">{artifact.brand.name}</p>
                    <h3 className="mt-4 text-2xl font-black uppercase">{artifact.title}</h3>
                    {artifact.subtitle && <p className="mt-3 text-sm text-white/45">{artifact.subtitle}</p>}
                    <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                      <div>
                        <span className="block text-sm font-black">{price ?? "Museum record"}</span>
                        <span className="mt-2 inline-flex items-center gap-1 font-mono text-[7px] uppercase text-white/30"><BadgeCheck size={11} className="text-[#D7FF00]"/>AGE202 archive record</span>
                      </div>
                      {artifact.vintedUrl && artifact.availability=="AVAILABLE" ? (
                        <a href={artifact.vintedUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#D7FF00]/25 bg-[#D7FF00]/[0.07] px-3 py-2 text-[8px] font-black uppercase text-[#D7FF00]">Vinted<ExternalLink size={12}/></a>
                      ) : (
                        <span className="font-mono text-[7px] uppercase text-white/30">Archive</span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-10 rounded-[2rem] border border-dashed border-white/10 bg-white/[0.02] px-7 py-20 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-[#D7FF00]/25 bg-[#D7FF00]/[0.05] text-[#D7FF00]">
              <PackageSearch size={28}/>
            </div>
            <h3 className="mt-7 text-2xl font-black uppercase">Collection in preparation</h3>
            <p className="mt-4 text-sm text-white/45">No published artifacts are currently associated with this player.</p>
          </div>
        )}
      </div>
    </section>
  );
}