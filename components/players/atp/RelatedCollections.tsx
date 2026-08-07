import Link from "next/link";

import {
  ArrowRight,
  Gem,
  ImageIcon,
  Layers3,
  Shirt,
  Star,
  Users,
} from "lucide-react";

export type RelatedCollection = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  eyebrow: string | null;
  heroImageUrl: string | null;
  heroMedia: {
    url: string;
    alt: string | null;
    title: string;
  } | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  featured: boolean;
  _count: {
    players: number;
    artifacts: number;
    originals: number;
  };
};

type RelatedCollectionsProps = {
  playerName: string;
  collections: RelatedCollection[];
};

function getReadableTextColor(
  hexColor: string,
): string {
  const normalized = hexColor
    .replace("#", "")
    .trim();

  if (
    !/^[0-9a-fA-F]{6}$/.test(
      normalized,
    )
  ) {
    return "#050B18";
  }

  const red = Number.parseInt(
    normalized.slice(0, 2),
    16,
  );

  const green = Number.parseInt(
    normalized.slice(2, 4),
    16,
  );

  const blue = Number.parseInt(
    normalized.slice(4, 6),
    16,
  );

  const luminance =
    (0.299 * red +
      0.587 * green +
      0.114 * blue) /
    255;

  return luminance > 0.58
    ? "#050B18"
    : "#FFFFFF";
}

export default function RelatedCollections({
  playerName,
  collections,
}: RelatedCollectionsProps) {
  if (collections.length === 0) {
    return null;
  }

  return (
    <section
      id="related-collections"
      className="scroll-mt-16 border-t border-white/10 px-5 py-20 sm:px-8 lg:px-12 lg:py-24"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#D7FF00]">
              Museum connections
            </p>

            <h2 className="mt-4 text-4xl font-black uppercase leading-[0.92] tracking-[-0.05em] sm:text-5xl">
              Related collections
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-white/42 sm:text-right">
            Explore the published AGE202 museum collections connected to{" "}
            {playerName}.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {collections.map(
            (collection) => (
              <RelatedCollectionCard
                key={collection.id}
                collection={
                  collection
                }
              />
            ),
          )}
        </div>
      </div>
    </section>
  );
}

type RelatedCollectionCardProps = {
  collection: RelatedCollection;
};

function RelatedCollectionCard({
  collection,
}: RelatedCollectionCardProps) {
  const heroImage =
    collection.heroMedia?.url ??
    collection.heroImageUrl;

  const imageAlt =
    collection.heroMedia?.alt ??
    collection.heroMedia?.title ??
    collection.title;

  const primaryTextColor =
    getReadableTextColor(
      collection.primaryColor,
    );

  return (
    <Link
      href={`/collections/${collection.slug}`}
      className="group overflow-hidden rounded-[2rem] border border-white/10 bg-[#08111F] outline-none transition hover:-translate-y-1 hover:border-[#D7FF00]/35 focus-visible:border-[#D7FF00]/60 focus-visible:ring-2 focus-visible:ring-[#D7FF00]/20 motion-reduce:transform-none motion-reduce:transition-none"
    >
      <div
        className="relative aspect-[16/9] overflow-hidden"
        style={{
          background:
            `radial-gradient(circle at 72% 18%, ${collection.primaryColor}30, transparent 34%), linear-gradient(145deg, ${collection.secondaryColor}, #050B18)`,
        }}
      >
        {heroImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroImage}
            alt={imageAlt}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035] motion-reduce:transition-none"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <ImageIcon
              className="h-12 w-12 opacity-35"
              style={{
                color:
                  collection.primaryColor,
              }}
              aria-hidden="true"
            />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-[#050B18]/15 to-transparent" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span
            className="rounded-full border px-3 py-1.5 font-mono text-[7px] font-black uppercase tracking-[0.18em] backdrop-blur"
            style={{
              borderColor:
                `${collection.primaryColor}55`,
              backgroundColor:
                `${collection.primaryColor}18`,
              color:
                collection.primaryColor,
            }}
          >
            {collection.eyebrow ??
              "Museum Collection"}
          </span>

          {collection.featured ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/15 px-3 py-1.5 font-mono text-[7px] font-black uppercase tracking-[0.18em] text-amber-200 backdrop-blur">
              <Star
                className="h-3 w-3 fill-current"
                aria-hidden="true"
              />
              Featured
            </span>
          ) : null}
        </div>
      </div>

      <div className="p-6 sm:p-7">
        <h3
          className="text-3xl font-black uppercase leading-[0.95] tracking-[-0.05em] transition group-hover:text-[#D7FF00]"
          style={{
            color:
              collection.accentColor,
          }}
        >
          {collection.title}
        </h3>

        <p className="mt-4 line-clamp-2 min-h-12 text-sm leading-6 text-white/42">
          {collection.subtitle ??
            "Explore this curated AGE202 digital museum collection."}
        </p>

        <div className="mt-6 grid grid-cols-3 gap-2 border-y border-white/10 py-4">
          <CollectionMetric
            icon={Users}
            label="Players"
            value={
              collection._count
                .players
            }
          />

          <CollectionMetric
            icon={Gem}
            label="Artifacts"
            value={
              collection._count
                .artifacts
            }
          />

          <CollectionMetric
            icon={Shirt}
            label="Originals"
            value={
              collection._count
                .originals
            }
          />
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <span className="inline-flex items-center gap-2 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/35">
            <Layers3
              className="h-4 w-4"
              aria-hidden="true"
            />
            AGE202 Museum
          </span>

          <span
            className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-mono text-[8px] font-black uppercase tracking-[0.18em] transition group-hover:scale-[1.02]"
            style={{
              backgroundColor:
                collection.primaryColor,
              color:
                primaryTextColor,
            }}
          >
            Explore collection

            <ArrowRight
              className="h-4 w-4"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}

type CollectionMetricProps = {
  icon: typeof Users;
  label: string;
  value: number;
};

function CollectionMetric({
  icon: Icon,
  label,
  value,
}: CollectionMetricProps) {
  return (
    <div className="text-center">
      <Icon
        className="mx-auto h-4 w-4 text-white/25"
        aria-hidden="true"
      />

      <p className="mt-2 text-xl font-black text-white">
        {value}
      </p>

      <p className="mt-1 font-mono text-[7px] font-black uppercase tracking-[0.14em] text-white/25">
        {label}
      </p>
    </div>
  );
}