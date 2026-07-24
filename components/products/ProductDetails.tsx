import Link from "next/link";

type Props = {
  product: {
    title: string;
    player: string;
    brand: string;
    tournament: string;
    year: number;
    size: string;
    condition: string;
    price: number;
    available: boolean;
    rarity: string;
    authenticityCode: string;
    description: string;
    story: string;
    vintedUrl: string;
  };
};

export default function ProductDetails({ product }: Props) {
  return (
    <div className="space-y-10">

      {/* HEADER */}

      <div>

        <span className="inline-flex rounded-full border border-[#C8FF00] bg-[#C8FF00]/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.35em] text-[#C8FF00]">
          Verified Archive
        </span>

        <h1 className="mt-6 text-5xl xl:text-6xl font-black leading-tight text-white">
          {product.title}
        </h1>

        <p className="mt-4 text-xl text-gray-400">
          {product.player} • {product.brand}
        </p>

      </div>

      {/* PRICE */}

      <div className="border-y border-white/10 py-8">

        <p className="text-sm uppercase tracking-[0.35em] text-gray-500">
          Archive Value
        </p>

        <p className="mt-3 text-6xl font-black text-white">
          €{product.price}
        </p>

      </div>

      {/* DETAILS */}

      <div className="grid grid-cols-2 gap-6 rounded-[32px] bg-[#111B2E] p-8">

        <Info label="Tournament" value={product.tournament} />

        <Info label="Year" value={String(product.year)} />

        <Info label="Size" value={product.size} />

        <Info label="Condition" value={product.condition} />

        <Info label="Rarity" value={product.rarity} />

        <Info
          label="Status"
          value={product.available ? "Available" : "Sold"}
        />

      </div>

      {/* AUTHENTICITY */}

      <div className="rounded-[32px] border border-[#2A354C] bg-[#0F1728] p-8">

        <p className="text-xs font-bold uppercase tracking-[0.35em] text-gray-500">
          AGE202 DIGITAL ARCHIVE
        </p>

        <p className="mt-5 text-sm uppercase tracking-[0.3em] text-[#C8FF00]">
          Authenticity Code
        </p>

        <p className="mt-3 font-mono text-xl text-[#C8FF00]">
          {product.authenticityCode}
        </p>

      </div>

      {/* CTA */}

      <Link
        href={product.vintedUrl}
        target="_blank"
        className="block rounded-full bg-[#C8FF00] py-5 text-center text-lg font-black text-black transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(200,255,0,.30)]"
      >
        View on AGE202 →
      </Link>

      {/* DESCRIPTION */}

      <div className="space-y-10">

        <div>

          <h2 className="text-2xl font-black text-white">
            Description
          </h2>

          <p className="mt-4 leading-8 text-gray-400">
            {product.description}
          </p>

        </div>

        <div>

          <h2 className="text-2xl font-black text-white">
            Story
          </h2>

          <p className="mt-4 leading-8 text-gray-400">
            {product.story}
          </p>

        </div>

      </div>

    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>

      <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500">
        {label}
      </p>

      <p className="mt-3 text-lg font-bold text-white">
        {value}
      </p>

    </div>
  );
}