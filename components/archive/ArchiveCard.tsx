import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/data/product.types";

type ArchiveCardProps = {
  product: Product;
  priority?: boolean;
};

type ExtendedProduct = Product & {
  image?: string;
  images?: string[];
  player?: string;
  title?: string;
  name?: string;
  brand?: string;
  tournament?: string;
  year?: string | number;
  status?: string;
  rarity?: string;
  archiveNumber?: string | number;
  story?: string;
  historicalContext?: string;
  curatorNote?: string;
  price?: number | string;
};

export default function ArchiveCard({
  product,
  priority = false,
}: ArchiveCardProps) {
  const item = product as ExtendedProduct;

  const title =
    item.title?.trim() ||
    item.name?.trim() ||
    "Untitled archive piece";

  const player =
    item.player?.trim() ||
    "AGE202 Collection";

  const image =
    item.images?.[0] ||
    item.image ||
    "/images/product-age202-logo-white.png";

  const archiveNumber = formatArchiveNumber(
    item.archiveNumber,
    product.id
  );

  const rarity = getRarityDetails(item.rarity);
  const status = getStatusDetails(item.status);

  const description = getDescription(item);
  const metadata = getMetadata(item);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[30px] border border-white/10 bg-[#08101F] transition duration-500 hover:-translate-y-2 hover:border-[#C8FF00]/30 hover:shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
      {/* Museum glow */}

      <div className="pointer-events-none absolute inset-0 z-10 rounded-[30px] opacity-0 transition duration-500 group-hover:opacity-100">
        <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#C8FF00]/[0.08] blur-[70px]" />
      </div>

      {/* Product image */}

      <Link
        href={`/product/${product.id}`}
        className="relative block aspect-[4/5] overflow-hidden bg-[#0A1425]"
        aria-label={`Explore ${title}`}
      >
        <Image
          src={image}
          alt={`${title} — ${player}`}
          fill
          priority={priority}
          sizes="
            (max-width: 640px) 100vw,
            (max-width: 1024px) 50vw,
            33vw
          "
          className="object-cover object-center transition duration-700 group-hover:scale-[1.045]"
        />

        {/* Image overlays */}

        <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-transparent to-black/20" />

        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#08101F] to-transparent" />

        {/* Status */}

        <div className="absolute left-5 top-5 z-20">
          <span
            className={[
              "inline-flex items-center gap-2 rounded-full border px-3.5 py-2",
              "text-[8px] font-black uppercase tracking-[0.22em]",
              status.className,
            ].join(" ")}
          >
            <span
              className={[
                "h-1.5 w-1.5 rounded-full",
                status.dotClassName,
              ].join(" ")}
            />

            {status.label}
          </span>
        </div>

        {/* Rarity */}

        <div className="absolute right-5 top-5 z-20">
          <span
            className={[
              "inline-flex rounded-full border px-3.5 py-2",
              "text-[8px] font-black uppercase tracking-[0.22em]",
              rarity.badgeClassName,
            ].join(" ")}
          >
            {rarity.label}
          </span>
        </div>

        {/* Archive watermark */}

        <div className="absolute bottom-5 left-5 right-5 z-20 flex items-end justify-between gap-4">
          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.28em] text-gray-400">
              Archive number
            </p>

            <p className="mt-1 font-mono text-sm font-bold tracking-[0.18em] text-white">
              {archiveNumber}
            </p>
          </div>

          <span className="text-5xl font-black leading-none text-white/[0.07]">
            A
          </span>
        </div>
      </Link>

      {/* Card content */}

      <div className="relative z-20 flex flex-1 flex-col p-6 md:p-7">
        {/* Player */}

        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.28em] text-[#C8FF00]">
              {player}
            </p>

            <h3 className="mt-3 text-2xl font-black leading-tight tracking-[-0.035em] text-white transition group-hover:text-[#C8FF00]">
              <Link href={`/product/${product.id}`}>
                {title}
              </Link>
            </h3>
          </div>

          <span
            className="mt-1 shrink-0 font-mono text-[10px] text-gray-600"
            aria-hidden="true"
          >
            {archiveNumber}
          </span>
        </div>

        {/* Rarity score */}

        <div className="mt-5 flex items-center gap-3">
          <div
            className="flex gap-1"
            aria-label={`${rarity.score} out of 5 rarity`}
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <span
                key={index}
                className={[
                  "text-xs",
                  index < rarity.score
                    ? "text-[#C8FF00]"
                    : "text-white/10",
                ].join(" ")}
                aria-hidden="true"
              >
                ★
              </span>
            ))}
          </div>

          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">
            {rarity.label}
          </span>
        </div>

        {/* Metadata */}

        {metadata.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
            {metadata.map((value, index) => (
              <div
                key={`${value}-${index}`}
                className="flex items-center gap-3"
              >
                {index > 0 && (
                  <span
                    className="h-1 w-1 rounded-full bg-[#C8FF00]/40"
                    aria-hidden="true"
                  />
                )}

                <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-gray-500">
                  {value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Museum description */}

        <p className="mt-6 line-clamp-3 text-sm leading-7 text-gray-500">
          {description}
        </p>

        {/* Footer */}

        <div className="mt-auto pt-7">
          <div className="border-t border-white/10 pt-5">
            <Link
              href={`/product/${product.id}`}
              className="flex items-center justify-between gap-5"
            >
              <span className="text-[9px] font-black uppercase tracking-[0.24em] text-white transition group-hover:text-[#C8FF00]">
                Explore piece
              </span>

              <span
                aria-hidden="true"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-sm text-white transition duration-300 group-hover:translate-x-1 group-hover:border-[#C8FF00]/40 group-hover:bg-[#C8FF00] group-hover:text-[#050B18]"
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom museum accent */}

      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#C8FF00]/0 to-transparent transition duration-500 group-hover:via-[#C8FF00]/60" />
    </article>
  );
}

function getDescription(product: ExtendedProduct): string {
  return (
    product.curatorNote?.trim() ||
    product.story?.trim() ||
    product.historicalContext?.trim() ||
    "A collectible tennis garment preserved within the AGE202 digital archive."
  );
}

function getMetadata(product: ExtendedProduct): string[] {
  const values = [
    product.tournament,
    product.year ? String(product.year) : "",
    product.brand,
  ];

  return values.filter(
    (value): value is string =>
      typeof value === "string" &&
      value.trim().length > 0
  );
}

function formatArchiveNumber(
  archiveNumber: string | number | undefined,
  productId: string | number
): string {
  if (
    archiveNumber !== undefined &&
    archiveNumber !== null &&
    String(archiveNumber).trim() !== ""
  ) {
    const value = String(archiveNumber).trim();

    if (value.toUpperCase().startsWith("AGE")) {
      return value.toUpperCase();
    }

    const numericValue = value.replace(/\D/g, "");

    if (numericValue) {
      return `AGE-${numericValue.padStart(5, "0")}`;
    }

    return value.toUpperCase();
  }

  const numericId = String(productId).replace(/\D/g, "");

  if (numericId) {
    return `AGE-${numericId.padStart(5, "0")}`;
  }

  return `AGE-${String(productId)
    .slice(0, 5)
    .toUpperCase()}`;
}

function getStatusDetails(status?: string) {
  const normalizedStatus = status
    ?.toLowerCase()
    .replaceAll("_", "-")
    .replaceAll(" ", "-")
    .trim();

  switch (normalizedStatus) {
    case "sold":
      return {
        label: "Sold",
        className:
          "border-red-400/20 bg-red-400/10 text-red-300",
        dotClassName: "bg-red-300",
      };

    case "coming-soon":
    case "comingsoon":
      return {
        label: "Coming soon",
        className:
          "border-amber-300/20 bg-amber-300/10 text-amber-200",
        dotClassName: "bg-amber-200",
      };

    case "reserved":
      return {
        label: "Reserved",
        className:
          "border-blue-300/20 bg-blue-300/10 text-blue-200",
        dotClassName: "bg-blue-200",
      };

    default:
      return {
        label: "Available",
        className:
          "border-[#C8FF00]/25 bg-[#C8FF00]/10 text-[#C8FF00]",
        dotClassName: "bg-[#C8FF00]",
      };
  }
}

function getRarityDetails(rarity?: string) {
  const normalizedRarity = rarity
    ?.toLowerCase()
    .replaceAll("_", "-")
    .replaceAll(" ", "-")
    .trim();

  switch (normalizedRarity) {
    case "museum-grade":
    case "grail":
      return {
        label: "Museum Grade",
        score: 5,
        badgeClassName:
          "border-purple-300/25 bg-purple-300/10 text-purple-200",
      };

    case "ultra-rare":
    case "ultrarare":
      return {
        label: "Ultra Rare",
        score: 5,
        badgeClassName:
          "border-[#C8FF00]/25 bg-[#C8FF00]/10 text-[#C8FF00]",
      };

    case "very-rare":
    case "veryrare":
      return {
        label: "Very Rare",
        score: 4,
        badgeClassName:
          "border-cyan-300/25 bg-cyan-300/10 text-cyan-200",
      };

    case "rare":
      return {
        label: "Rare",
        score: 3,
        badgeClassName:
          "border-blue-300/25 bg-blue-300/10 text-blue-200",
      };

    case "uncommon":
      return {
        label: "Uncommon",
        score: 2,
        badgeClassName:
          "border-white/15 bg-white/[0.06] text-gray-300",
      };

    default:
      return {
        label: "Archive Piece",
        score: 1,
        badgeClassName:
          "border-white/15 bg-black/20 text-gray-300",
      };
  }
}