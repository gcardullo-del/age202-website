import Link from "next/link";
import {
  ArrowDown,
  BadgeCheck,
  CalendarDays,
  ImageIcon,
  Landmark,
  Shirt,
  Trophy,
} from "lucide-react";

import AgeImage from "@/components/media/AgeImage";
import type { getPublishedArtifactBySlug } from "@/lib/repositories/artifact.repository";

type PublishedArtifact = NonNullable<
  Awaited<
    ReturnType<
      typeof getPublishedArtifactBySlug
    >
  >
>;

type ArtifactHeroProps = {
  artifact: PublishedArtifact;
};

function getAvailabilityLabel(
  availability:
    | PublishedArtifact["availability"]
    | null
    | undefined,
) {
  const labels: Record<string, string> = {
    AVAILABLE: "Disponibile",
    SOLD: "Venduto",
    COMING_SOON: "Prossimamente",
    NOT_FOR_SALE: "Non in vendita",
  };

  if (!availability) {
    return "Archivio AGE202";
  }

  return labels[availability] ?? availability;
}

function getRarityLabel(
  rarity:
    | PublishedArtifact["rarity"]
    | null
    | undefined,
) {
  const labels: Record<string, string> = {
    COMMON: "Comune",
    RARE: "Raro",
    VERY_RARE: "Molto raro",
    LEGENDARY: "Leggendario",
  };

  if (!rarity) {
    return "Archivio";
  }

  return labels[rarity] ?? rarity;
}

function getRarityStyle(
  rarity:
    | PublishedArtifact["rarity"]
    | null
    | undefined,
) {
  switch (rarity) {
    case "LEGENDARY":
      return "border-amber-300/40 bg-amber-300/15 text-amber-100";

    case "VERY_RARE":
      return "border-violet-300/40 bg-violet-300/15 text-violet-100";

    case "RARE":
      return "border-sky-300/40 bg-sky-300/15 text-sky-100";

    default:
      return "border-white/15 bg-white/10 text-white/80";
  }
}

export default function ArtifactHero({
  artifact,
}: ArtifactHeroProps) {
  const coverImage =
    artifact.images.find(
      (image) => image.isCover,
    ) ?? artifact.images[0];

  const metaCards = [
    {
      label: "Campione",
      value: artifact.player.name,
      icon: Trophy,
    },
    {
      label: "Brand",
      value: artifact.brand.name,
      icon: Shirt,
    },
    artifact.year
      ? {
          label: "Anno",
          value: artifact.year.toString(),
          icon: CalendarDays,
        }
      : null,
    artifact.tournament
      ? {
          label: "Torneo",
          value: artifact.tournament,
          icon: Landmark,
        }
      : null,
  ].filter(
    (
      item,
    ): item is {
      label: string;
      value: string;
      icon: typeof Trophy;
    } => Boolean(item),
  );

  return (
    <section className="relative isolate min-h-[calc(100svh-72px)] overflow-hidden border-b border-white/10 bg-[#050b18]">
      {coverImage ? (
        <AgeImage
          src={
  coverImage.heroUrl ??
  coverImage.url
}
          alt={
            coverImage.alt ??
            artifact.title
          }
          preset="hero"
          fill
          priority
          className="object-cover object-center"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#172033] via-[#08101f] to-black" />
      )}

      <div className="absolute inset-0 bg-black/20" />

      <div className="absolute inset-0 bg-gradient-to-r from-[#030711]/95 via-[#030711]/75 to-[#030711]/10" />

      <div className="absolute inset-0 bg-gradient-to-t from-[#050b18] via-transparent to-black/40" />

      <div className="absolute inset-y-0 left-0 w-full bg-[radial-gradient(circle_at_18%_55%,rgba(190,242,100,0.11),transparent_28%)]" />

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-lime-300/40 to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-72px)] max-w-7xl items-center px-6 py-24 sm:px-8 lg:px-12">
        <div className="w-full max-w-6xl">
          <Link
            href={`/archives/${artifact.player.slug}`}
            className="inline-flex w-fit items-center gap-3 text-[0.68rem] font-bold uppercase tracking-[0.3em] text-white/55 transition hover:text-lime-300"
          >
            <span
              aria-hidden="true"
              className="text-lime-300"
            >
              ←
            </span>

            Archivio {artifact.player.name}
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-lime-300/30 bg-lime-300/10 px-4 py-2 text-[0.66rem] font-bold uppercase tracking-[0.24em] text-lime-300 backdrop-blur-md">
              AGE202 Museum
            </span>

            <span
              className={`rounded-full border px-4 py-2 text-[0.66rem] font-bold uppercase tracking-[0.24em] backdrop-blur-md ${getRarityStyle(
                artifact.rarity,
              )}`}
            >
              {getRarityLabel(
                artifact.rarity,
              )}
            </span>

            <span className="rounded-full border border-white/15 bg-black/30 px-4 py-2 text-[0.66rem] font-bold uppercase tracking-[0.24em] text-white/70 backdrop-blur-md">
              {getAvailabilityLabel(
                artifact.availability,
              )}
            </span>

            {artifact.authentic && (
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-[0.66rem] font-bold uppercase tracking-[0.24em] text-amber-100 backdrop-blur-md">
                <BadgeCheck className="h-3.5 w-3.5" />

                Autenticità verificata
              </span>
            )}
          </div>

          {artifact.archiveNumber && (
            <p className="mt-8 font-mono text-[0.68rem] uppercase tracking-[0.32em] text-white/45">
              Reperto{" "}
              <span className="text-white/85">
                {artifact.archiveNumber}
              </span>
            </p>
          )}

          <h1 className="mt-5 max-w-5xl text-5xl font-black leading-[0.88] tracking-[-0.055em] text-white drop-shadow-[0_14px_40px_rgba(0,0,0,0.6)] sm:text-7xl lg:text-[7rem]">
            {artifact.title}
          </h1>

          {artifact.subtitle && (
            <p className="mt-7 max-w-3xl text-base leading-8 text-white/70 sm:text-xl">
              {artifact.subtitle}
            </p>
          )}

          <div className="mt-10 grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {metaCards.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-black/35 p-4 backdrop-blur-md transition duration-300 hover:border-lime-300/30 hover:bg-black/50"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-lime-300" />

                    <p className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-white/40">
                      {item.label}
                    </p>
                  </div>

                  <p className="mt-3 truncate text-sm font-semibold text-white sm:text-base">
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href="#museum-story"
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-lime-300 px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#050b18] transition hover:-translate-y-0.5 hover:bg-lime-200"
            >
              Esplora la storia

              <ArrowDown className="h-4 w-4" />
            </a>

            {artifact.images.length > 0 && (
              <a
                href="#artifact-gallery"
                className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/15 bg-black/30 px-6 py-4 text-sm font-bold uppercase tracking-[0.14em] text-white/80 backdrop-blur-md transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10 hover:text-white"
              >
                <ImageIcon className="h-4 w-4" />

                Guarda la galleria
              </a>
            )}
          </div>

          <div className="mt-12 hidden items-center gap-4 sm:flex">
            <span className="h-px w-16 bg-gradient-to-r from-lime-300/70 to-transparent" />

            <p className="text-[0.62rem] font-bold uppercase tracking-[0.28em] text-white/35">
              Scorri per esplorare
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
