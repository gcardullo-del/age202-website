import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { products } from "@/data/products";
import type { Product } from "@/data/product.types";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const playerSlugs: Record<string, string> = {
  "Roger Federer": "federer",
  "Rafael Nadal": "nadal",
  "Novak Djokovic": "djokovic",
  "Jannik Sinner": "sinner",
  "Carlos Alcaraz": "alcaraz",
};

const rarityLabels: Record<Product["rarity"], string> = {
  common: "Common",
  rare: "Rare",
  "very-rare": "Very Rare",
  legendary: "Legendary",
};

const statusLabels: Record<Product["status"], string> = {
  available: "Available",
  sold: "Sold",
  "coming-soon": "Coming soon",
};

function getProduct(id: string): Product | undefined {
  const decodedId = decodeURIComponent(id);

  return products.find(
    (product) =>
      product.id === decodedId ||
      product.slug === decodedId
  );
}

export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(id);

  if (!product) {
    return {
      title: "Archive piece not found | AGE202",
    };
  }

  return {
    title: `${product.title} | AGE202`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: PageProps) {
  const { id } = await params;
  const product = getProduct(id);

  if (!product) {
    notFound();
  }

  const playerSlug = playerSlugs[product.player];

  const productImages = Array.from(
    new Set(
      [
        product.image,
        ...(product.images ?? []),
        ...(product.gallery ?? []),
      ].filter(Boolean)
    )
  );

  const relatedProducts = products
    .filter(
      (item) =>
        item.id !== product.id &&
        (
          item.player === product.player ||
          item.tournament === product.tournament ||
          item.brand === product.brand
        )
    )
    .slice(0, 3);

  const isRare =
    product.rarity === "rare" ||
    product.rarity === "very-rare" ||
    product.rarity === "legendary";

  return (
    <main className="min-h-screen bg-[#050B18] text-white">
      {/* HERO / BREADCRUMBS */}

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 pb-12 pt-32 md:px-8">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-gray-500"
          >
            <Link
              href="/"
              className="transition-colors hover:text-[#C8FF00]"
            >
              Home
            </Link>

            <span>/</span>

            <Link
              href="/archive"
              className="transition-colors hover:text-[#C8FF00]"
            >
              Archive
            </Link>

            <span>/</span>

            <span className="text-gray-300">
              {product.archiveNumber}
            </span>
          </nav>
        </div>
      </section>

      {/* PRODUCT */}

      <section className="mx-auto grid max-w-7xl gap-14 px-6 py-16 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:py-24">
        {/* IMAGE GALLERY */}

        <div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[36px] border border-white/10 bg-[#0A1425]">
            <Image
              src={productImages[0] ?? product.image}
              alt={product.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 52vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#050B18]/45 via-transparent to-transparent" />

            <div className="absolute left-5 top-5 flex flex-wrap gap-3">
              <span
                className={`rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-xl ${
                  product.available
                    ? "border-[#C8FF00]/40 bg-[#050B18]/80 text-[#C8FF00]"
                    : "border-white/15 bg-[#050B18]/80 text-gray-300"
                }`}
              >
                {statusLabels[product.status]}
              </span>

              {isRare && (
                <span className="rounded-full border border-amber-300/30 bg-[#050B18]/80 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-amber-200 backdrop-blur-xl">
                  {rarityLabels[product.rarity]}
                </span>
              )}
            </div>

            <div className="absolute bottom-5 left-5 rounded-full border border-white/10 bg-[#050B18]/80 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 backdrop-blur-xl">
              {product.archiveNumber}
            </div>
          </div>

          {productImages.length > 1 && (
            <div className="mt-5 grid grid-cols-3 gap-4">
              {productImages.slice(1, 4).map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-[#0A1425]"
                >
                  <Image
                    src={image}
                    alt={`${product.title} detail ${index + 2}`}
                    fill
                    sizes="(max-width: 1024px) 33vw, 16vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PRODUCT DETAILS */}

        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-[#C8FF00]">
            AGE202 Digital Archive
          </p>

          <h1 className="mt-5 text-4xl font-black leading-tight md:text-6xl">
            {product.title}
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-400">
            {product.description}
          </p>

          <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-[28px] border border-white/10 bg-white/10">
            <DetailItem label="Player" value={product.player} />
            <DetailItem label="Tournament" value={product.tournament} />
            <DetailItem label="Year" value={String(product.year)} />
            <DetailItem label="Brand" value={product.brand} />
            <DetailItem label="Category" value={product.category} />
            <DetailItem label="Collection" value={product.collection} />
            <DetailItem label="Size" value={product.size} />
            <DetailItem label="Condition" value={product.condition} />
            <DetailItem label="Color" value={product.color} />
            <DetailItem
              label="Authenticity"
              value={product.authentic ? "Verified" : "Not verified"}
            />
          </div>

          <div className="mt-8 rounded-[28px] border border-white/10 bg-[#0A1425] p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-gray-500">
                  Archive price
                </p>

                <p className="mt-2 text-3xl font-black">
                  {product.price !== null
                    ? `€${product.price.toFixed(2)}`
                    : "On request"}
                </p>
              </div>

              {product.vintedUrl ? (
                <a
                  href={product.vintedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#C8FF00] px-8 text-xs font-black uppercase tracking-[0.2em] text-black transition-transform hover:scale-[1.03]"
                >
                  Buy on Vinted
                </a>
              ) : (
                <span className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-8 text-center text-xs font-black uppercase tracking-[0.2em] text-gray-500">
                  Not currently listed
                </span>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {playerSlug && (
              <Link
                href={`/hall-of-fame/${playerSlug}`}
                className="rounded-full border border-white/10 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-gray-300 transition-colors hover:border-[#C8FF00]/40 hover:text-[#C8FF00]"
              >
                Explore {product.player}
              </Link>
            )}

            <Link
              href="/archive"
              className="rounded-full border border-white/10 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-gray-300 transition-colors hover:border-[#C8FF00]/40 hover:text-[#C8FF00]"
            >
              Back to archive
            </Link>
          </div>
        </div>
      </section>

      {/* MUSEUM STORY */}

      <section className="border-y border-white/10 bg-[#08101F]">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 md:px-8 lg:grid-cols-2 lg:py-28">
          <article>
            <p className="text-xs font-black uppercase tracking-[0.35em] text-[#C8FF00]">
              Museum story
            </p>

            <h2 className="mt-5 text-4xl font-black">
              The story behind the piece
            </h2>

            <p className="mt-7 text-lg leading-9 text-gray-300">
              {product.museumStory}
            </p>

            <p className="mt-6 leading-8 text-gray-500">
              {product.story}
            </p>
          </article>

          <article className="rounded-[34px] border border-white/10 bg-[#0A1425] p-8 md:p-10">
            <p className="text-xs font-black uppercase tracking-[0.35em] text-[#C8FF00]">
              Historical context
            </p>

            <p className="mt-6 text-lg leading-9 text-gray-300">
              {product.historicalContext}
            </p>

            <div className="mt-10 border-t border-white/10 pt-8">
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-gray-500">
                Curator note
              </p>

              <p className="mt-4 leading-8 text-gray-400">
                {product.curatorNote}
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* CERTIFICATE */}

      <section className="mx-auto max-w-7xl px-6 py-20 md:px-8 lg:py-28">
        <div className="overflow-hidden rounded-[38px] border border-[#C8FF00]/20 bg-gradient-to-br from-[#111B2E] to-[#08101F] p-8 md:p-12">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.35em] text-[#C8FF00]">
                Digital certificate
              </p>

              <h2 className="mt-5 text-4xl font-black">
                Archive authentication record
              </h2>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-400">
                This record identifies the piece inside the AGE202
                Digital Tennis Museum archive.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/20 px-7 py-6">
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-gray-500">
                Authenticity code
              </p>

              <p className="mt-3 font-mono text-lg font-bold text-white">
                {product.authenticityCode}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RELATED PRODUCTS */}

      {relatedProducts.length > 0 && (
        <section className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-20 md:px-8 lg:py-28">
            <p className="text-xs font-black uppercase tracking-[0.35em] text-[#C8FF00]">
              Related archive pieces
            </p>

            <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <h2 className="text-4xl font-black">
                Continue exploring
              </h2>

              <Link
                href="/archive"
                className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 transition-colors hover:text-[#C8FF00]"
              >
                View complete archive →
              </Link>
            </div>

            <div className="mt-12 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
              {relatedProducts.map((item) => (
                <RelatedProductCard
                  key={item.id}
                  product={item}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="bg-[#0A1425] p-5">
      <p className="text-[9px] font-black uppercase tracking-[0.26em] text-gray-600">
        {label}
      </p>

      <p className="mt-2 text-sm font-bold capitalize text-gray-200">
        {value}
      </p>
    </div>
  );
}

function RelatedProductCard({
  product,
}: {
  product: Product;
}) {
  return (
    <article className="group overflow-hidden rounded-[30px] border border-white/10 bg-[#0A1425] transition-all duration-500 hover:-translate-y-2 hover:border-[#C8FF00]/30">
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#050B18]/85 via-transparent to-transparent" />

          <span className="absolute left-5 top-5 rounded-full border border-white/10 bg-[#050B18]/75 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-xl">
            {product.year}
          </span>
        </div>

        <div className="p-6">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#C8FF00]">
            {product.player}
          </p>

          <h3 className="mt-3 text-xl font-black leading-tight">
            {product.title}
          </h3>

          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5 text-xs text-gray-500">
            <span>{product.tournament}</span>
            <span>{product.brand}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}