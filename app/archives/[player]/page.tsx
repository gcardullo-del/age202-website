import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import ProductCard from "@/components/products/ProductCard";
import {
  champions,
  type Champion,
} from "@/data/champions";
import { products } from "@/data/products";

type ArchivePageProps = {
  params: Promise<{
    player: string;
  }>;
};

function findChampion(player: string): Champion | undefined {
  return champions.find(
    (champion) =>
      champion.id === player ||
      champion.slug === player
  );
}

export function generateStaticParams() {
  return champions.map((champion) => ({
    player: champion.id,
  }));
}

export async function generateMetadata({
  params,
}: ArchivePageProps): Promise<Metadata> {
  const { player } = await params;
  const champion = findChampion(player);

  if (!champion) {
    return {
      title: "Archive Not Found | AGE202",
    };
  }

  return {
    title: `${champion.name} Archive | AGE202`,
    description: champion.description,
  };
}

export default async function ArchivePage({
  params,
}: ArchivePageProps) {
  const { player } = await params;
  const champion = findChampion(player);

  if (!champion) {
    notFound();
  }

  const playerProducts = products.filter(
    (product) => product.player === champion.id
  );

  return (
    <main className="min-h-screen overflow-hidden bg-[#050B18] text-white">
      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative min-h-[720px] overflow-hidden lg:h-[88vh]">
        <Image
          src={champion.image}
          alt={champion.name}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[75%_center] md:object-[82%_center]"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#050B18] via-[#050B18]/95 to-[#050B18]/10 lg:via-50%" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-transparent to-black/25" />

        <div
          aria-hidden="true"
          className="absolute -left-32 top-1/3 h-80 w-80 rounded-full opacity-20 blur-[140px]"
          style={{
            backgroundColor: champion.accent,
          }}
        />

        <div className="relative z-10 flex min-h-[720px] items-center pt-24 lg:h-full">
          <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-8 lg:px-12">
            <span
              className="inline-flex rounded-full border px-4 py-2 text-[9px] font-black uppercase tracking-[0.3em] backdrop-blur-xl sm:text-[10px]"
              style={{
                color: champion.accent,
                borderColor: `${champion.accent}66`,
                backgroundColor: `${champion.accent}12`,
              }}
            >
              AGE202 Digital Archive
            </span>

            <p
              className="mt-8 text-xs font-black uppercase tracking-[0.3em]"
              style={{
                color: champion.accent,
              }}
            >
              {champion.nickname}
            </p>

            <h1 className="mt-5 max-w-5xl text-[clamp(4rem,10vw,9rem)] font-black leading-[0.82] tracking-[-0.07em]">
              <span className="block">
                {champion.firstName}
              </span>

              <span className="block text-white/70">
                {champion.lastName}
              </span>
            </h1>

            <p className="mt-10 max-w-2xl text-base leading-8 text-white/55 sm:text-lg sm:leading-9 lg:text-xl">
              {champion.description}
            </p>

            <div className="mt-14 grid max-w-3xl grid-cols-1 overflow-hidden rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl sm:grid-cols-3">
              <HeroStat
                label="Archive Pieces"
                value={String(champion.archivePieces)}
                accent={champion.accent}
              />

              <HeroStat
                label="Professional Debut"
                value={String(champion.debutYear)}
                accent={champion.accent}
                className="border-t border-white/10 sm:border-l sm:border-t-0"
              />

              <HeroStat
                label="Main Brand"
                value={champion.mainBrand}
                accent={champion.accent}
                className="border-t border-white/10 sm:border-l sm:border-t-0"
              />
            </div>
          </div>
        </div>

        <span
          aria-hidden="true"
          className="absolute -bottom-8 right-4 text-[150px] font-black leading-none tracking-[-0.1em] text-white/[0.025] sm:text-[220px] lg:right-12 lg:text-[300px]"
        >
          {String(champion.debutYear).slice(-2)}
        </span>
      </section>

      {/* =====================================================
          ARCHIVE PROFILE
      ====================================================== */}

      <section className="relative mx-auto max-w-[1440px] px-6 py-24 sm:px-8 lg:px-12 lg:py-36">
        <div
          aria-hidden="true"
          className="absolute right-0 top-1/4 h-72 w-72 rounded-full opacity-10 blur-[130px]"
          style={{
            backgroundColor: champion.accent,
          }}
        />

        <div className="relative">
          <span
            className="text-[10px] font-black uppercase tracking-[0.32em]"
            style={{
              color: champion.accent,
            }}
          >
            Archive Profile
          </span>

          <h2 className="mt-5 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
            The visual identity of{" "}
            <span className="text-white/45">
              {champion.lastName}
            </span>
          </h2>

          <div className="mt-10 flex flex-wrap gap-3">
            <ProfileTag>
              {champion.nationality}
            </ProfileTag>

            <ProfileTag>
              Professional debut {champion.debutYear}
            </ProfileTag>

            <ProfileTag>
              Main brand {champion.mainBrand}
            </ProfileTag>

            <ProfileTag>
              {champion.archivePieces} archive pieces
            </ProfileTag>
          </div>

          <div className="mt-20 grid items-center gap-14 lg:grid-cols-[1fr_0.82fr] lg:gap-24">
            <div>
              <p className="max-w-3xl text-xl leading-[1.9] text-white/55 sm:text-2xl sm:leading-[1.85]">
                {champion.description}
              </p>

              <div className="mt-12 h-px max-w-xl bg-gradient-to-r from-white/20 to-transparent" />

              <div className="mt-10 grid max-w-xl grid-cols-2 gap-8">
                <ProfileDetail
                  label="Nationality"
                  value={champion.nationality}
                />

                <ProfileDetail
                  label="Era"
                  value={`Since ${champion.debutYear}`}
                />

                <ProfileDetail
                  label="Primary Brand"
                  value={champion.mainBrand}
                />

                <ProfileDetail
                  label="Archive Index"
                  value={`${champion.archivePieces} pieces`}
                />
              </div>
            </div>

            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -inset-8 rounded-full opacity-20 blur-[90px]"
                style={{
                  backgroundColor: champion.accent,
                }}
              />

              <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#08101F] shadow-[0_40px_120px_rgba(0,0,0,0.5)]">
                <div className="relative aspect-[4/5]">
                  <Image
                    src={champion.image}
                    alt={`${champion.name} archive portrait`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover object-top"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#050B18]/85 via-transparent to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
                    <p
                      className="text-[9px] font-black uppercase tracking-[0.28em]"
                      style={{
                        color: champion.accent,
                      }}
                    >
                      AGE202 Collection
                    </p>

                    <p className="mt-3 text-2xl font-black tracking-[-0.03em] text-white">
                      {champion.name}
                    </p>
                  </div>
                </div>

                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 h-px w-full"
                  style={{
                    backgroundColor: champion.accent,
                    boxShadow: `0 0 24px ${champion.accent}`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SIGNATURE QUOTE
      ====================================================== */}

      <section className="relative overflow-hidden border-y border-white/10 bg-[#08101F] py-28 lg:py-40">
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 blur-[140px]"
          style={{
            backgroundColor: champion.accent,
          }}
        />

        <div className="relative mx-auto max-w-5xl px-6 text-center sm:px-8">
          <span
            className="text-[10px] font-black uppercase tracking-[0.32em]"
            style={{
              color: champion.accent,
            }}
          >
            Signature Quote
          </span>

          <blockquote className="mt-12 text-4xl font-light italic leading-[1.35] tracking-[-0.035em] text-white sm:text-5xl lg:text-7xl">
            “{champion.quote}”
          </blockquote>

          <div className="mx-auto mt-12 h-px w-24 bg-white/15" />

          <p
            className="mt-9 text-[10px] font-black uppercase tracking-[0.32em]"
            style={{
              color: champion.accent,
            }}
          >
            {champion.name}
          </p>
        </div>
      </section>

      {/* =====================================================
          CURATED COLLECTION
      ====================================================== */}

      <section className="mx-auto max-w-[1440px] px-6 py-24 sm:px-8 lg:px-12 lg:py-36">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <span
              className="text-[10px] font-black uppercase tracking-[0.32em]"
              style={{
                color: champion.accent,
              }}
            >
              Curated Collection
            </span>

            <h2 className="mt-5 text-5xl font-black tracking-[-0.05em] text-white sm:text-6xl">
              Archive Pieces
            </h2>

            <p className="mt-6 max-w-3xl text-base leading-8 text-white/45 sm:text-lg">
              Authentic apparel carefully selected for the AGE202
              Digital Archive.
            </p>
          </div>

          <div className="lg:text-right">
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/25">
              Current archive
            </p>

            <p
              className="mt-2 text-4xl font-black"
              style={{
                color: champion.accent,
              }}
            >
              {playerProducts.length}
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {playerProducts.length > 0 ? (
            playerProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                image={product.image}
                player={champion.name}
                brand={product.brand}
                title={product.title}
                tournament={product.tournament}
                year={product.year}
                price={product.price}
                available={product.available}
              />
            ))
          ) : (
            <div className="col-span-full overflow-hidden rounded-[32px] border border-white/10 bg-[#08101F]">
              <div className="px-8 py-16 text-center sm:px-14 sm:py-20">
                <span
                  className="text-[10px] font-black uppercase tracking-[0.3em]"
                  style={{
                    color: champion.accent,
                  }}
                >
                  Archive Update
                </span>

                <h3 className="mt-6 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
                  No archive pieces available
                </h3>

                <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/45">
                  New authenticated pieces dedicated to{" "}
                  <span className="font-semibold text-white">
                    {champion.name}
                  </span>{" "}
                  will be added to the AGE202 Digital Archive soon.
                </p>
              </div>

              <div
                className="h-px w-full"
                style={{
                  backgroundColor: champion.accent,
                  boxShadow: `0 0 24px ${champion.accent}`,
                }}
              />
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

type HeroStatProps = {
  label: string;
  value: string;
  accent: string;
  className?: string;
};

function HeroStat({
  label,
  value,
  accent,
  className = "",
}: HeroStatProps) {
  return (
    <div
      className={[
        "min-w-0 px-6 py-6 sm:px-7",
        className,
      ].join(" ")}
    >
      <p
        className="truncate text-2xl font-black tracking-[-0.03em] sm:text-3xl"
        style={{
          color: accent,
        }}
      >
        {value}
      </p>

      <p className="mt-2 text-[8px] font-black uppercase tracking-[0.24em] text-white/35">
        {label}
      </p>
    </div>
  );
}

type ProfileTagProps = {
  children: React.ReactNode;
};

function ProfileTag({
  children,
}: ProfileTagProps) {
  return (
    <div className="rounded-full border border-white/10 bg-white/[0.035] px-5 py-3 text-[9px] font-bold uppercase tracking-[0.2em] text-white/55 backdrop-blur-xl">
      {children}
    </div>
  );
}

type ProfileDetailProps = {
  label: string;
  value: string;
};

function ProfileDetail({
  label,
  value,
}: ProfileDetailProps) {
  return (
    <div>
      <p className="text-[8px] font-black uppercase tracking-[0.22em] text-white/25">
        {label}
      </p>

      <p className="mt-3 text-sm font-black uppercase tracking-[0.08em] text-white/75">
        {value}
      </p>
    </div>
  );
}
        