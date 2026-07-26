import type { Product } from "@/data/product.types";

const rarityPoints: Record<Product["rarity"], number> = {
  common: 12,
  rare: 22,
  "very-rare": 30,
  legendary: 38,
};

function getMuseumScore(product: Product): number {
  const yearPoints = product.year <= 2010 ? 18 : product.year <= 2018 ? 14 : 10;
  const conditionPoints = /excellent|mint|new/i.test(product.condition) ? 18 : 12;
  const authenticityPoints = product.authentic ? 16 : 5;
  const storyPoints = product.museumStory.length >= 50 ? 10 : 7;

  return Math.min(
    100,
    rarityPoints[product.rarity] +
      yearPoints +
      conditionPoints +
      authenticityPoints +
      storyPoints,
  );
}

type MuseumScoreProps = {
  product: Product;
};

export default function MuseumScore({ product }: MuseumScoreProps) {
  const score = getMuseumScore(product);
  const classification =
    score >= 90
      ? "Hall of Fame Piece"
      : score >= 80
        ? "Exceptional Archive Piece"
        : score >= 70
          ? "Significant Archive Piece"
          : "Documented Archive Piece";

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:px-8 lg:py-28">
      <div className="overflow-hidden rounded-[38px] border border-white/10 bg-[radial-gradient(circle_at_18%_25%,rgba(200,255,0,0.12),transparent_32%),linear-gradient(135deg,#0D182A,#07101F)] p-8 md:p-12">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.35em] text-[#C8FF00]">
              Museum score
            </p>
            <h2 className="mt-5 text-4xl font-black md:text-5xl">
              Curatorial significance at a glance.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-400">
              A non-commercial AGE202 indicator based on rarity, period,
              preservation, authentication and documented museum context.
            </p>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-black/20 p-7 md:p-9">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-7xl font-black tracking-[-0.08em] text-white md:text-8xl">
                  {score}
                </p>
                <p className="mt-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                  out of 100
                </p>
              </div>
              <span className="mb-2 rounded-full border border-[#C8FF00]/25 bg-[#C8FF00]/10 px-4 py-2 text-[9px] font-black uppercase tracking-[0.22em] text-[#C8FF00]">
                {classification}
              </span>
            </div>

            <div className="mt-8 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[#C8FF00] shadow-[0_0_22px_rgba(200,255,0,0.45)]"
                style={{ width: `${score}%` }}
              />
            </div>

            <div className="mt-7 grid grid-cols-2 gap-3 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 sm:grid-cols-4">
              <span>Rarity</span>
              <span>Period</span>
              <span>Condition</span>
              <span>Authenticity</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
