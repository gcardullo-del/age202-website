"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  PackageCheck,
  Search,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Tag,
} from "lucide-react";
import type { Product } from "@/data/product.types";

type Props = {
  products: Product[];
};

type AvailabilityFilter = "All pieces" | "Available" | "Sold" | "Coming soon";
type SortOption = "Featured" | "Newest" | "Oldest" | "Player A–Z";

const availabilityOptions: AvailabilityFilter[] = [
  "All pieces",
  "Available",
  "Sold",
  "Coming soon",
];

const sortOptions: SortOption[] = ["Featured", "Newest", "Oldest", "Player A–Z"];

const categoryLabels: Record<Product["category"], string> = {
  shirt: "Shirts",
  polo: "Polos",
  jacket: "Jackets",
  shorts: "Shorts",
  shoes: "Shoes",
  cap: "Caps",
  accessory: "Accessories",
};

const rarityLabels: Record<Product["rarity"], string> = {
  common: "Archive piece",
  rare: "Rare",
  "very-rare": "Very rare",
  legendary: "Legendary",
};

function formatPrice(price: number | null) {
  if (price === null) return "Price on request";

  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

function ProductArtwork({ product }: { product: Product }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_25%,rgba(215,255,0,.15),transparent_34%),linear-gradient(145deg,#101b31,#050b18)]">
        <div className="text-center">
          <ShoppingBag className="mx-auto text-[#d7ff00]/75" size={38} strokeWidth={1.4} />
          <p className="mt-4 text-[9px] font-black uppercase tracking-[.28em] text-white/35">
            AGE202 archive image
          </p>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={product.image}
      alt={product.title}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
      className="object-cover transition duration-700 group-hover:scale-[1.045]"
      onError={() => setFailed(true)}
    />
  );
}

export default function ShopExperience({ products }: Props) {
  const [query, setQuery] = useState("");
  const [player, setPlayer] = useState("All players");
  const [category, setCategory] = useState("All categories");
  const [availability, setAvailability] = useState<AvailabilityFilter>("All pieces");
  const [sort, setSort] = useState<SortOption>("Featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const players = useMemo(
    () => ["All players", ...Array.from(new Set(products.map((product) => product.player))).sort()],
    [products]
  );

  const categories = useMemo(
    () => [
      "All categories",
      ...Array.from(new Set(products.map((product) => categoryLabels[product.category]))).sort(),
    ],
    [products]
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        [
          product.title,
          product.player,
          product.brand,
          product.tournament,
          product.year,
          product.archiveNumber,
          ...product.tags,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      const matchesPlayer = player === "All players" || product.player === player;
      const matchesCategory =
        category === "All categories" || categoryLabels[product.category] === category;
      const matchesAvailability =
        availability === "All pieces" ||
        (availability === "Available" && product.status === "available") ||
        (availability === "Sold" && product.status === "sold") ||
        (availability === "Coming soon" && product.status === "coming-soon");

      return matchesQuery && matchesPlayer && matchesCategory && matchesAvailability;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "Newest") return b.year - a.year;
      if (sort === "Oldest") return a.year - b.year;
      if (sort === "Player A–Z") return a.player.localeCompare(b.player);
      return Number(b.featured) - Number(a.featured) || b.year - a.year;
    });
  }, [availability, category, player, products, query, sort]);

  const availableCount = products.filter((product) => product.status === "available").length;
  const authenticatedCount = products.filter((product) => product.authentic).length;
  const featuredProduct = products.find((product) => product.featured) ?? products[0];

  const resetFilters = () => {
    setQuery("");
    setPlayer("All players");
    setCategory("All categories");
    setAvailability("All pieces");
    setSort("Featured");
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#050b18] text-white">
      <section className="relative border-b border-white/10 px-5 pb-16 pt-28 sm:px-8 lg:px-12 lg:pb-24 lg:pt-36">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_79%_20%,rgba(215,255,0,.14),transparent_29%)]" />
        <div className="absolute -right-28 top-20 h-80 w-80 rounded-full border border-[#d7ff00]/10" />
        <div className="absolute right-10 top-48 h-52 w-52 rounded-full border border-white/[.04]" />

        <div className="relative mx-auto max-w-[1500px]">
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[.32em] text-[#d7ff00]">
            <span className="h-px w-10 bg-[#d7ff00]" /> Curated tennis apparel
          </div>

          <div className="mt-9 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end">
            <div>
              <h1 className="max-w-6xl text-[clamp(3.8rem,9vw,9.2rem)] font-black uppercase leading-[.78] tracking-[-.075em]">
                The<br />
                <span className="text-[#d7ff00]">Shop.</span>
              </h1>
              <p className="mt-8 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
                Collectible tennis clothing, documented archive pieces and authentic stories from the game’s defining eras.
              </p>
            </div>

            <div className="rounded-[1.8rem] border border-white/10 bg-white/[.035] p-6 backdrop-blur">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-[.23em] text-white/45">
                  AGE202 selection
                </span>
                <Sparkles size={17} className="text-[#d7ff00]" />
              </div>
              <p className="mt-8 text-2xl font-black uppercase tracking-[-.04em]">
                Second hand.<br />First set.
              </p>
              <p className="mt-3 text-sm leading-7 text-white/48">
                Every piece connects apparel, player, tournament and year inside the AGE202 digital museum.
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5 text-[9px] font-bold uppercase tracking-[.18em]">
                <span className="text-white/38">Available now</span>
                <span className="text-[#d7ff00]">{availableCount} pieces</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto grid max-w-[1500px] gap-4 md:grid-cols-3">
          {[
            [BadgeCheck, "Curated archive", `${products.length} catalogued pieces`],
            [ShieldCheck, "Authenticity first", `${authenticatedCount} documented items`],
            [PackageCheck, "Marketplace ready", "Direct link when available"],
          ].map(([Icon, title, detail]) => {
            const FeatureIcon = Icon as typeof BadgeCheck;
            return (
              <article
                key={String(title)}
                className="flex items-center gap-4 rounded-[1.35rem] border border-white/10 bg-white/[.025] p-5"
              >
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#d7ff00]/20 bg-[#d7ff00]/[.06]">
                  <FeatureIcon size={18} className="text-[#d7ff00]" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[.12em]">{String(title)}</p>
                  <p className="mt-1 text-xs text-white/40">{String(detail)}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {featuredProduct && (
        <section className="px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
          <div className="mx-auto max-w-[1500px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a1425]">
            <div className="grid lg:grid-cols-[1.12fr_.88fr]">
              <div className="relative min-h-[430px] overflow-hidden lg:min-h-[590px]">
                <ProductArtwork product={featuredProduct} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050b18]/75 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#0a1425]/35" />
                <div className="absolute left-5 top-5 rounded-full border border-[#d7ff00]/30 bg-[#050b18]/75 px-4 py-2 text-[9px] font-black uppercase tracking-[.22em] text-[#d7ff00] backdrop-blur">
                  Curator’s selection
                </div>
              </div>

              <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
                <p className="text-[10px] font-black uppercase tracking-[.28em] text-[#d7ff00]">
                  {featuredProduct.player} · {featuredProduct.year}
                </p>
                <h2 className="mt-5 text-4xl font-black uppercase leading-[.92] tracking-[-.055em] sm:text-6xl">
                  {featuredProduct.title}
                </h2>
                <p className="mt-6 max-w-xl text-sm leading-7 text-white/50 sm:text-base">
                  {featuredProduct.museumStory || featuredProduct.description}
                </p>

                <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/10">
                  {[
                    ["Brand", featuredProduct.brand],
                    ["Tournament", featuredProduct.tournament],
                    ["Rarity", rarityLabels[featuredProduct.rarity]],
                    ["Archive", featuredProduct.archiveNumber],
                  ].map(([label, value]) => (
                    <div key={label} className="bg-[#0a1425] p-4">
                      <p className="text-[8px] font-black uppercase tracking-[.2em] text-white/30">{label}</p>
                      <p className="mt-2 text-xs font-bold text-white/80">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <Link
                    href={`/product/${featuredProduct.id}`}
                    className="inline-flex items-center gap-3 rounded-full bg-[#d7ff00] px-6 py-4 text-[10px] font-black uppercase tracking-[.18em] text-[#050b18] transition hover:scale-[1.02]"
                  >
                    View archive piece <ArrowRight size={15} />
                  </Link>
                  <span className="text-sm font-black text-white/75">
                    {formatPrice(featuredProduct.price)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-white/10 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[.28em] text-[#d7ff00]">
                The complete selection
              </p>
              <h2 className="mt-3 text-4xl font-black uppercase tracking-[-.05em] sm:text-6xl">
                Browse the archive
              </h2>
            </div>
            <p className="max-w-lg text-sm leading-7 text-white/43">
              Search by champion, category or status. Each card opens the complete museum record before any marketplace action.
            </p>
          </div>

          <div className="mt-10 rounded-[1.55rem] border border-white/10 bg-white/[.025] p-4 sm:p-5">
            <div className="flex flex-col gap-3 lg:flex-row">
              <label className="relative flex-1">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search player, tournament, brand or archive number"
                  className="h-12 w-full rounded-full border border-white/10 bg-[#050b18]/70 pl-11 pr-5 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#d7ff00]/55"
                />
              </label>

              <button
                type="button"
                onClick={() => setFiltersOpen((open) => !open)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[.035] px-5 text-[9px] font-black uppercase tracking-[.18em] text-white/65 transition hover:border-white/25 lg:hidden"
              >
                <SlidersHorizontal size={15} /> Filters
              </button>

              <div className={`${filtersOpen ? "grid" : "hidden"} gap-3 sm:grid-cols-2 lg:grid lg:grid-cols-4`}>
                <FilterSelect value={player} onChange={setPlayer} options={players} label="Player" />
                <FilterSelect value={category} onChange={setCategory} options={categories} label="Category" />
                <FilterSelect
                  value={availability}
                  onChange={(value) => setAvailability(value as AvailabilityFilter)}
                  options={availabilityOptions}
                  label="Status"
                />
                <FilterSelect
                  value={sort}
                  onChange={(value) => setSort(value as SortOption)}
                  options={sortOptions}
                  label="Sort"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <p className="text-[9px] font-black uppercase tracking-[.2em] text-white/35">
              {filteredProducts.length} {filteredProducts.length === 1 ? "piece" : "pieces"} shown
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="text-[9px] font-black uppercase tracking-[.18em] text-[#d7ff00] transition hover:text-white"
            >
              Reset filters
            </button>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <article
                  key={product.id}
                  className="group overflow-hidden rounded-[1.65rem] border border-white/10 bg-white/[.025] transition duration-500 hover:-translate-y-1 hover:border-[#d7ff00]/28"
                >
                  <Link href={`/product/${product.id}`} className="block">
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#0a1425]">
                      <ProductArtwork product={product} />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050b18]/92 via-transparent to-[#050b18]/10" />

                      <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
                        <span className="rounded-full border border-white/15 bg-[#050b18]/70 px-3 py-2 text-[8px] font-black uppercase tracking-[.18em] text-white/70 backdrop-blur">
                          {rarityLabels[product.rarity]}
                        </span>
                        <span
                          className={`rounded-full border px-3 py-2 text-[8px] font-black uppercase tracking-[.18em] backdrop-blur ${
                            product.status === "available"
                              ? "border-[#d7ff00]/30 bg-[#050b18]/70 text-[#d7ff00]"
                              : "border-white/15 bg-[#050b18]/70 text-white/55"
                          }`}
                        >
                          {product.status === "coming-soon" ? "Coming soon" : product.status}
                        </span>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <p className="text-[9px] font-black uppercase tracking-[.22em] text-[#d7ff00]">
                          {product.player}
                        </p>
                        <h3 className="mt-2 text-2xl font-black uppercase leading-[.95] tracking-[-.045em]">
                          {product.title}
                        </h3>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-5">
                        <div>
                          <p className="text-[8px] font-black uppercase tracking-[.2em] text-white/30">
                            {product.brand} · {categoryLabels[product.category]}
                          </p>
                          <p className="mt-2 text-xs font-semibold text-white/58">
                            {product.tournament} · {product.year}
                          </p>
                        </div>
                        <Tag size={16} className="shrink-0 text-white/25" />
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5">
                        <span className="text-sm font-black text-white/78">{formatPrice(product.price)}</span>
                        <span className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[.16em] text-[#d7ff00]">
                          View piece <ArrowRight size={13} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[1.7rem] border border-dashed border-white/15 px-6 py-20 text-center">
              <ShoppingBag className="mx-auto text-white/20" size={38} strokeWidth={1.3} />
              <h3 className="mt-5 text-2xl font-black uppercase tracking-[-.04em]">No pieces found</h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-white/40">
                Try a different player, category or availability filter.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-6 rounded-full bg-[#d7ff00] px-6 py-3 text-[9px] font-black uppercase tracking-[.18em] text-[#050b18]"
              >
                Show all pieces
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-white/10 px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-[1500px] gap-8 rounded-[2rem] border border-[#d7ff00]/18 bg-[radial-gradient(circle_at_84%_15%,rgba(215,255,0,.12),transparent_34%),rgba(255,255,255,.025)] p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:p-14">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[.24em] text-[#d7ff00]">Beyond the shop</p>
            <h2 className="mt-4 text-3xl font-black uppercase tracking-[-.05em] sm:text-5xl">
              Discover AGE202 Originals
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/45">
              Explore the dedicated collection where the visual identity of the museum becomes original AGE202 apparel.
            </p>
          </div>
          <Link
            href="/age202-originals"
            className="inline-flex items-center justify-center gap-3 rounded-full border border-white/15 bg-white/[.045] px-6 py-4 text-[9px] font-black uppercase tracking-[.18em] transition hover:border-[#d7ff00]/45 hover:text-[#d7ff00]"
          >
            Enter Originals <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </main>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  label: string;
}) {
  return (
    <label className="relative block min-w-[155px]">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full appearance-none rounded-full border border-white/10 bg-[#050b18]/70 pl-4 pr-10 text-[9px] font-black uppercase tracking-[.12em] text-white/60 outline-none transition focus:border-[#d7ff00]/55"
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-[#08101f] text-white">
            {option}
          </option>
        ))}
      </select>
      <ChevronDown size={14} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/35" />
    </label>
  );
}
