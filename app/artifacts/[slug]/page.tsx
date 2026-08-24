import ArtifactGallery from "@/components/artifacts/ArtifactGallery";
import ArtifactHero from "@/components/artifacts/ArtifactHero";
import MuseumQrCode from "@/components/certificate/MuseumQrCode";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import {
  ArrowUpRight,
  Award,
  BadgeCheck,
  CalendarDays,
  ChevronRight,
  CircleCheck,
  FileCheck2,
  Fingerprint,
  LockKeyhole,
  ScanLine,
  ShoppingBag,
  Sparkles,
  UserRound,
} from "lucide-react";

import {
  getPublishedArtifactBySlug,
  getPublishedArtifactSlugs,
  getRelatedArtifacts,
} from "@/lib/repositories/artifact.repository";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatPrice(
  price: unknown,
  currency: string | null,
) {
  if (
    price === null ||
    price === undefined
  ) {
    return null;
  }

  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice)) {
    return null;
  }

  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: currency ?? "EUR",
  }).format(numericPrice);
}

function getAvailabilityLabel(
  availability: string | null | undefined,
) {
  if (!availability) {
    return "Non specificata";
  }

  const labels: Record<string, string> = {
    AVAILABLE: "Disponibile",
    SOLD: "Venduto",
    RESERVED: "Riservato",
    NOT_FOR_SALE: "Non in vendita",
    COMING_SOON: "Prossimamente",
  };

  return labels[availability] ?? availability;
}

function getConditionLabel(
  condition: string | null | undefined,
) {
  if (!condition) {
    return "Non specificate";
  }

  const labels: Record<string, string> = {
    NEW_WITH_TAGS:
      "Nuovo con cartellino",
    NEW_WITHOUT_TAGS:
      "Nuovo senza cartellino",
    EXCELLENT:
      "Condizioni eccellenti",
    VERY_GOOD:
      "Condizioni molto buone",
    GOOD: "Buone condizioni",
    FAIR: "Condizioni discrete",
  };

  return labels[condition] ?? condition;
}

function getRarityLabel(
  rarity: string | null | undefined,
) {
  if (!rarity) {
    return "Non specificata";
  }

  const labels: Record<string, string> = {
    COMMON: "Comune",
    UNCOMMON: "Non comune",
    RARE: "Raro",
    VERY_RARE: "Molto raro",
    LEGENDARY: "Leggendario",
    ICONIC: "Iconico",
    UNIQUE: "Pezzo unico",
  };

  return labels[rarity] ?? rarity;
}

function getCategoryLabel(
  category: string | null | undefined,
) {
  if (!category) {
    return "Altro";
  }

  const labels: Record<string, string> = {
    SHIRT: "Maglia",
    SHORTS: "Pantaloncini",
    JACKET: "Giacca",
    POLO: "Polo",
    SWEATSHIRT: "Felpa",
    TRACKSUIT: "Tuta",
    SHOES: "Scarpe",
    ACCESSORY: "Accessorio",
    OTHER: "Altro",
  };

  return labels[category] ?? category;
}

export async function generateStaticParams() {
  const artifacts =
    await getPublishedArtifactSlugs();

  return artifacts.map((artifact) => ({
    slug: artifact.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const artifact =
    await getPublishedArtifactBySlug(slug);

  if (!artifact) {
    return {
      title:
        "Artifact non trovato | AGE202",
    };
  }

  const coverImage =
    artifact.images.find(
      (image) => image.isCover,
    ) ?? artifact.images[0];

  const description =
    artifact.subtitle ??
    artifact.description ??
    `${artifact.title}, reperto dell’archivio digitale AGE202 dedicato a ${artifact.player.name}.`;

  return {
    title: `${artifact.title} | AGE202 Museum`,
    description,
    alternates: {
      canonical: `/artifacts/${artifact.slug}`,
    },
    openGraph: {
      title: artifact.title,
      description,
      type: "article",
      images: coverImage
        ? [
            {
              url: coverImage.url,
              alt:
                coverImage.alt ??
                artifact.title,
            },
          ]
        : [],
    },
  };
}

export default async function ArtifactPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const artifact =
    await getPublishedArtifactBySlug(slug);

  if (!artifact) {
    notFound();
  }

  const relatedArtifacts =
    await getRelatedArtifacts({
      artifactId: artifact.id,
      playerId: artifact.playerId,
      limit: 3,
    });

  const formattedPrice = formatPrice(
    artifact.price,
    artifact.currency,
  );

  const details = [
    {
      label: "Campione",
      value: artifact.player.name,
    },
    {
      label: "Brand",
      value: artifact.brand.name,
    },
    {
      label: "Categoria",
      value: getCategoryLabel(
        artifact.category,
      ),
    },
    {
      label: "Anno",
      value: artifact.year?.toString(),
    },
    {
      label: "Stagione",
      value: artifact.season,
    },
    {
      label: "Torneo",
      value: artifact.tournament,
    },
    {
      label: "Collezione",
      value: artifact.collection,
    },
    {
      label: "Edizione",
      value: artifact.edition,
    },
    {
      label: "Taglia",
      value: artifact.size,
    },
    {
      label: "Colore",
      value: artifact.colour,
    },
    {
      label: "Materiale",
      value: artifact.material,
    },
    {
      label: "Condizioni",
      value: getConditionLabel(
        artifact.condition,
      ),
    },
    {
      label: "Rarità",
      value: getRarityLabel(
        artifact.rarity,
      ),
    },
  ].filter(
    (
      detail,
    ): detail is {
      label: string;
      value: string;
    } =>
      Boolean(
        detail.value &&
          detail.value.trim().length > 0,
      ),
  );

  const hasStoryContent = Boolean(
    artifact.description ||
      artifact.museumStory ||
      artifact.historicalContext ||
      artifact.curatorNote ||
      artifact.tags.length > 0,
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: artifact.title,
    description:
      artifact.description ??
      artifact.subtitle ??
      `Reperto dell’archivio digitale AGE202 dedicato a ${artifact.player.name}.`,
    identifier:
      artifact.archiveNumber ?? artifact.id,
    image: artifact.images.map((image) => image.url),
    creator: {
      "@type": "Organization",
      name: "AGE202 Digital Museum",
    },
    about: [
      artifact.player.name,
      artifact.brand.name,
      getCategoryLabel(artifact.category),
    ],
    dateCreated: artifact.year
      ? String(artifact.year)
      : undefined,
    url: `/artifacts/${artifact.slug}`,
  };

  return (
    <main className="min-h-screen bg-[#050b18] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <ArtifactHero artifact={artifact} />

      <nav
        aria-label="Breadcrumb"
        className="border-b border-white/10 bg-[#040914]"
      >
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-white/35 sm:px-8 lg:px-12">
          <Link href="/" className="transition hover:text-lime-300">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <Link
            href={`/archives/${artifact.player.slug}`}
            className="whitespace-nowrap transition hover:text-lime-300"
          >
            {artifact.player.name}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <span className="whitespace-nowrap text-white/65">
            {artifact.title}
          </span>
        </div>
      </nav>

      {hasStoryContent && (
        <section
          id="museum-story"
          className="scroll-mt-20 border-b border-white/10"
        >
          <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-32">
            <div className="grid gap-14 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-20">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.32em] text-lime-300">
                  Museum Story
                </p>

                <h2 className="mt-5 text-3xl font-black leading-tight tracking-[-0.035em] sm:text-4xl">
                  La storia del reperto
                </h2>

                <div className="mt-8 hidden h-px w-20 bg-lime-300/60 lg:block" />

                <p className="mt-6 max-w-xs text-sm leading-7 text-white/40">
                  Un frammento autentico della
                  storia del tennis conservato
                  nell’archivio digitale AGE202.
                </p>
              </div>

              <article className="min-w-0">
                {artifact.description && (
                  <div className="border-b border-white/10 pb-14">
                    <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/35">
                      Il reperto
                    </p>

                    <p className="mt-7 max-w-4xl whitespace-pre-line text-xl leading-9 text-white/75 sm:text-2xl sm:leading-10">
                      {artifact.description}
                    </p>
                  </div>
                )}

                {artifact.museumStory && (
                  <div
                    className={`${
                      artifact.description
                        ? "pt-14"
                        : ""
                    } border-b border-white/10 pb-14`}
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.28em] text-lime-300">
                      Racconto museale
                    </p>

                    <div className="relative mt-8 overflow-hidden rounded-[2rem] border border-lime-300/20 bg-gradient-to-br from-lime-300/[0.08] via-white/[0.03] to-transparent p-7 sm:p-10">
                      <div className="absolute left-0 top-10 h-20 w-1 rounded-r-full bg-lime-300" />

                      <p className="max-w-4xl whitespace-pre-line pl-3 text-lg leading-9 text-white/75 sm:pl-5 sm:text-xl sm:leading-10">
                        {artifact.museumStory}
                      </p>
                    </div>
                  </div>
                )}

                {artifact.historicalContext && (
                  <div className="border-b border-white/10 py-14">
                    <div className="grid gap-7 md:grid-cols-[190px_minmax(0,1fr)] md:gap-12">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/35">
                          Archivio storico
                        </p>

                        <h3 className="mt-4 text-2xl font-black tracking-tight">
                          Contesto storico
                        </h3>
                      </div>

                      <p className="whitespace-pre-line text-lg leading-9 text-white/65">
                        {
                          artifact.historicalContext
                        }
                      </p>
                    </div>
                  </div>
                )}

                {artifact.curatorNote && (
                  <div className="border-b border-white/10 py-14">
                    <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-7 sm:p-10">
                      <p className="text-xs font-bold uppercase tracking-[0.3em] text-lime-300">
                        Nota del curatore
                      </p>

                      <blockquote className="mt-7 max-w-4xl text-2xl font-medium leading-10 tracking-[-0.02em] text-white/90 sm:text-3xl sm:leading-[1.45]">
                        “{artifact.curatorNote}”
                      </blockquote>

                      <div className="mt-8 flex items-center gap-4">
                        <span className="h-px w-12 bg-lime-300/60" />

                        <p className="text-[0.65rem] font-bold uppercase tracking-[0.26em] text-white/35">
                          AGE202 Digital Museum
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {artifact.tags.length > 0 && (
                  <div className="pt-14">
                    <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/35">
                      Catalogazione archivio
                    </p>

                    <div className="mt-7 flex flex-wrap gap-3">
                      {artifact.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/60 transition hover:border-lime-300/30 hover:text-lime-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            </div>
          </div>
        </section>
      )}

      {artifact.images.length > 0 && (
        <section
          id="artifact-gallery"
          className="scroll-mt-20 overflow-hidden border-b border-white/10 bg-[#070e1c]"
        >
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,rgba(190,242,100,0.08),transparent_32%)]" />

            <div className="relative mx-auto max-w-[1440px] px-6 py-20 sm:px-8 lg:px-12 lg:py-28">
              <div className="mb-12 flex flex-col gap-8 border-b border-white/10 pb-10 lg:flex-row lg:items-end lg:justify-between">
                <SectionHeading
                  eyebrow="Dettagli visivi"
                  title="Galleria del reperto"
                  description="Esplora il reperto da vicino e osserva materiali, finiture e particolari della collezione."
                />

                <div className="flex items-center gap-4 lg:pb-1">
                  <span className="font-mono text-4xl font-black tracking-[-0.06em] text-white">
                    {String(artifact.images.length).padStart(2, "0")}
                  </span>

                  <div>
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-lime-300">
                      Immagini
                    </p>

                    <p className="mt-1 text-sm text-white/40">
                      Archivio fotografico
                    </p>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black/20 p-3 shadow-2xl shadow-black/30 sm:p-5">
                <ArtifactGallery
                  artifactTitle={artifact.title}
                  images={artifact.images.map(
                    (image) => ({
                      id: image.id,
                      url: image.url,
                      alt: image.alt,
                    }),
                  )}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="border-b border-white/10 bg-[#050b18]">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start lg:gap-16 xl:grid-cols-[400px_minmax(0,1fr)] xl:gap-20">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-lime-300">
                Catalogo AGE202
              </p>

              <h2 className="mt-5 max-w-md text-4xl font-black leading-[0.95] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
                Scheda archivio
              </h2>

              <p className="mt-7 max-w-md text-base leading-8 text-white/50">
                I dati identificativi, storici e
                tecnici registrati per questo
                reperto nella collezione digitale
                AGE202.
              </p>

              {artifact.archiveNumber && (
                <div className="mt-10 border-l-2 border-lime-300 pl-5">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-white/35">
                    Numero archivio
                  </p>

                  <p className="mt-3 break-all font-mono text-sm tracking-[0.1em] text-lime-200">
                    {artifact.archiveNumber}
                  </p>
                </div>
              )}
            </div>

            <div className="min-w-0 overflow-hidden rounded-[2rem] border border-white/10 bg-[#08101f] shadow-2xl shadow-black/20">
              <div className="border-b border-white/10 bg-white/[0.025] px-6 py-5 sm:px-8">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/40">
                    Informazioni del reperto
                  </p>

                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-lime-300">
                    {details.length} dati registrati
                  </p>
                </div>
              </div>

              <dl>
                {details.map((detail, index) => (
                  <div
                    key={detail.label}
                    className={`group flex flex-col gap-3 px-6 py-5 transition-colors hover:bg-white/[0.025] sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-8 sm:py-6 ${
                      index !== details.length - 1
                        ? "border-b border-white/10"
                        : ""
                    }`}
                  >
                    <dt className="shrink-0 text-xs font-bold uppercase tracking-[0.18em] text-white/35 transition-colors group-hover:text-lime-300/80 sm:w-44">
                      {detail.label}
                    </dt>

                    <dd className="min-w-0 flex-1 break-words text-left text-base font-semibold leading-7 text-white/90 sm:text-right sm:text-lg">
                      {detail.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {artifact.authentic && (
        <section className="relative overflow-hidden border-b border-white/10 bg-[#080d18]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(251,191,36,0.12),transparent_34%),radial-gradient(circle_at_88%_82%,rgba(190,242,100,0.06),transparent_28%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.35)_1px,transparent_1px)] [background-size:44px_44px]" />

          <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-32">
            <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <SectionHeading
                eyebrow="Certificazione museale"
                title="Digital Certificate"
                description="Documento digitale associato in modo univoco al reperto e conservato nell’archivio AGE202."
              />

              <div className="inline-flex w-fit items-center gap-3 rounded-full border border-amber-300/20 bg-amber-300/[0.07] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-100">
                <LockKeyhole className="h-4 w-4" />
                Record protetto
              </div>
            </div>

            <article className="relative overflow-hidden rounded-[2.5rem] border border-amber-300/25 bg-[#0a101d] shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
              <div className="pointer-events-none absolute -right-10 top-6 select-none font-mono text-[9rem] font-black leading-none tracking-[-0.12em] text-white/[0.025] sm:text-[14rem] lg:text-[18rem]">
                202
              </div>
              <div className="pointer-events-none absolute bottom-8 left-8 select-none text-5xl font-black tracking-[-0.06em] text-white/[0.025] sm:text-7xl">
                AGE202
              </div>

              <div className="relative grid lg:grid-cols-[minmax(0,1fr)_390px] xl:grid-cols-[minmax(0,1fr)_430px]">
                <div className="p-7 sm:p-10 lg:p-14 xl:p-16">
                  <div className="flex flex-col gap-8 border-b border-white/10 pb-10 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-5">
                      <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-amber-300/30 bg-amber-300/10 shadow-[0_0_45px_rgba(251,191,36,0.09)]">
                        <Award className="h-8 w-8 text-amber-200" />
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.32em] text-amber-200">
                          Certificate of authenticity
                        </p>
                        <h2 className="mt-3 max-w-3xl text-3xl font-black leading-[1.02] tracking-[-0.04em] text-white sm:text-5xl">
                          Autenticità registrata
                        </h2>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/[0.07] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-200">
                      <CircleCheck className="h-4 w-4" />
                      {artifact.certificate?.verified ? "Verificato" : "Registrato"}
                    </div>
                  </div>

                  <div className="py-10">
                    <p className="max-w-3xl text-base leading-8 text-white/55 sm:text-lg">
                      AGE202 attesta che il reperto descritto in questa pagina è stato catalogato con i propri dati identificativi, storici e fotografici. Il certificato collega il bene alla sua scheda museale digitale.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                      <CertificateBadge>
                        <BadgeCheck className="h-4 w-4" />
                        Reperto autenticato
                      </CertificateBadge>
                      <CertificateBadge>
                        <FileCheck2 className="h-4 w-4" />
                        Scheda catalogata
                      </CertificateBadge>
                      <CertificateBadge>
                        <Sparkles className="h-4 w-4" />
                        Collezione AGE202
                      </CertificateBadge>
                    </div>
                  </div>

                  <div className="rounded-[1.75rem] border border-amber-300/20 bg-amber-300/[0.045] p-6 sm:p-8">
                    <div className="flex items-center gap-3">
                      <Fingerprint className="h-5 w-5 text-amber-200" />
                      <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-amber-100/70">
                        Codice univoco di autenticità
                      </p>
                    </div>
                    <p className="mt-5 break-all font-mono text-lg font-semibold leading-8 tracking-[0.08em] text-amber-100 sm:text-2xl">
                      {artifact.authenticityCode ?? artifact.certificate?.code ?? "CERTIFICATO-REGISTRATO"}
                    </p>
                  </div>

                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <CertificateInfo
                      icon={BadgeCheck}
                      label="Stato certificazione"
                      value={
                        artifact.certificate
                          ? artifact.certificate.verified
                            ? "Identità verificata"
                            : "Verifica in lavorazione"
                          : "Registrazione museale attiva"
                      }
                    />
                    {artifact.certificate && (
                      <CertificateInfo
                        icon={CalendarDays}
                        label="Data emissione"
                        value={new Intl.DateTimeFormat("it-IT", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        }).format(new Date(artifact.certificate.issuedAt))}
                      />
                    )}
                    <CertificateInfo
                      icon={UserRound}
                      label="Curatore"
                      value={artifact.certificate?.curator ?? "AGE202 Digital Museum"}
                    />
                    <CertificateInfo
                      icon={Fingerprint}
                      label="Numero archivio"
                      value={artifact.archiveNumber ?? artifact.id}
                      mono
                    />
                  </div>

                  {artifact.certificate?.notes && (
                    <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/[0.025] p-6 sm:p-7">
                      <p className="text-[0.65rem] font-bold uppercase tracking-[0.26em] text-white/35">
                        Note del certificato
                      </p>
                      <p className="mt-4 whitespace-pre-line text-sm leading-7 text-white/55">
                        {artifact.certificate.notes}
                      </p>
                    </div>
                  )}

                  <div className="mt-12 flex flex-col gap-8 border-t border-white/10 pt-9 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="font-serif text-3xl italic text-white/85">
                        AGE202 Museum
                      </p>
                      <div className="mt-3 h-px w-52 bg-gradient-to-r from-amber-200/60 to-transparent" />
                      <p className="mt-3 text-[0.62rem] font-bold uppercase tracking-[0.25em] text-white/30">
                        Firma digitale del curatore
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/30">
                        Reperto
                      </p>
                      <p className="mt-2 max-w-sm text-sm font-semibold leading-6 text-white/70">
                        {artifact.title}
                      </p>
                    </div>
                  </div>
                </div>

                <aside className="flex flex-col border-t border-amber-300/15 bg-amber-300/[0.035] p-7 sm:p-9 lg:border-l lg:border-t-0 lg:p-10">
                  <div className="flex flex-1 flex-col items-center justify-center rounded-[2rem] border border-dashed border-amber-300/25 bg-black/20 p-7 text-center sm:p-9">
                    <div className="relative">
                      <div className="absolute -inset-4 rounded-[2rem] border border-amber-300/10" />
                      {artifact.certificate?.qrCodeUrl ? (
                        <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-2xl shadow-black/35">
                          <Image
                            src={artifact.certificate.qrCodeUrl}
                            alt={`QR Code del certificato ${artifact.title}`}
                            width={230}
                            height={230}
                            className="h-auto w-full max-w-[230px]"
                          />
                        </div>
                      ) : (
                        <MuseumQrCode
                          value={`${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/artifacts/${artifact.slug}`}
                          title={`QR Code ${artifact.title}`}
                        />
                      )}
                    </div>

                    <div className="mt-9 flex items-center gap-2 text-amber-200">
                      <ScanLine className="h-4 w-4" />
                      <p className="text-xs font-bold uppercase tracking-[0.28em]">
                        Identità digitale
                      </p>
                    </div>
                    <p className="mt-4 max-w-xs text-sm leading-7 text-white/45">
                      Scansiona il codice per associare il certificato alla scheda ufficiale conservata nell’archivio AGE202.
                    </p>
                  </div>

                  <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/20 p-6">
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.26em] text-white/35">
                      Archive reference
                    </p>
                    <p className="mt-4 break-all font-mono text-sm leading-7 text-amber-100">
                      {artifact.archiveNumber ?? artifact.id}
                    </p>
                  </div>
                </aside>
              </div>
            </article>
          </div>
        </section>
      )}

      <section className="relative overflow-hidden border-b border-white/10 bg-[#050b18]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(190,242,100,0.08),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-stretch">
            <div className="flex flex-col justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-lime-300/25 bg-lime-300/[0.08]">
                <ShoppingBag className="h-8 w-8 text-lime-300" />
              </div>

              <p className="mt-9 text-xs font-bold uppercase tracking-[0.32em] text-lime-300">
                Marketplace
              </p>

              <h2 className="mt-4 max-w-3xl text-4xl font-black leading-[0.95] tracking-[-0.045em] sm:text-6xl">
                {getAvailabilityLabel(artifact.availability)}
              </h2>

              <p className="mt-7 max-w-2xl text-base leading-8 text-white/55 sm:text-lg">
                Durante l’attivazione del nuovo sistema di spedizione AGE202,
                il checkout diretto con Stripe è temporaneamente sospeso.
                Se presente, puoi completare l’acquisto tramite Vinted.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <span className="rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white/55">
                  Vinted disponibile
                </span>

                <span className="rounded-full border border-amber-300/15 bg-amber-300/[0.05] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-100/55">
                  Stripe temporaneamente sospeso
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-[2rem] border border-white/10 bg-[#08101f] p-7 shadow-2xl shadow-black/25 sm:p-9">
              <div>
                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-6">
                  <p className="text-xs font-bold uppercase tracking-[0.26em] text-white/35">
                    Stato vendita
                  </p>

                  <span className="rounded-full border border-lime-300/25 bg-lime-300/[0.08] px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-lime-300">
                    {getAvailabilityLabel(artifact.availability)}
                  </span>
                </div>

                <div className="py-8">
                  <p className="text-xs font-bold uppercase tracking-[0.26em] text-white/35">
                    Prezzo
                  </p>

                  {formattedPrice ? (
                    <p className="mt-4 text-5xl font-black tracking-[-0.05em] text-white">
                      {formattedPrice}
                    </p>
                  ) : (
                    <p className="mt-4 text-xl font-semibold text-white/65">
                      Non ancora indicato
                    </p>
                  )}
                </div>
              </div>

              {artifact.availability === "AVAILABLE" && formattedPrice ? (
                <div className="space-y-3">
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.035] px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-white/35"
                  >
                    <LockKeyhole className="h-4 w-4" />
                    Stripe temporaneamente sospeso
                  </button>

                  {artifact.vintedUrl ? (
                    <Link
                      href={artifact.vintedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-lime-300/30 bg-lime-300 px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-[#050b18] transition hover:bg-lime-200"
                    >
                      Acquista su Vinted
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 px-6 py-5 text-sm leading-7 text-white/45">
                      Il checkout AGE202 è temporaneamente sospeso e questo reperto non ha ancora un link Vinted associato.
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 px-6 py-5 text-sm leading-7 text-white/45">
                  {artifact.availability === "SOLD"
                    ? "Questo reperto è stato venduto e non è più disponibile per l’acquisto."
                    : "Questo reperto non è attualmente disponibile per l’acquisto online."}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {relatedArtifacts.length > 0 && (
        <section className="relative overflow-hidden border-b border-white/10 bg-white/[0.018]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(190,242,100,0.07),transparent_30%)]" />

          <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-28">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <SectionHeading
                eyebrow={artifact.player.name}
                title="Altri reperti dell’archivio"
                description={`Continua l’esplorazione della collezione dedicata a ${artifact.player.name}.`}
              />

              <Link
                href={`/archives/${artifact.player.slug}`}
                className="inline-flex w-fit items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-white/55 transition hover:text-lime-300"
              >
                Vedi tutta la collezione
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedArtifacts.map((relatedArtifact, index) => {
                const relatedCover =
                  relatedArtifact.images.find((image) => image.isCover) ??
                  relatedArtifact.images[0];

                return (
                  <Link
                    key={relatedArtifact.id}
                    href={`/artifacts/${relatedArtifact.slug}`}
                    className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#08101f] shadow-xl shadow-black/20 transition duration-500 hover:-translate-y-1.5 hover:border-lime-300/30 hover:shadow-2xl hover:shadow-black/35"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
                      {relatedCover ? (
                        <Image
                          src={relatedCover.url}
                          alt={relatedCover.alt ?? relatedArtifact.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition duration-700 group-hover:scale-[1.06]"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-black" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050b18] via-black/10 to-transparent" />

                      <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 backdrop-blur-md">
                        <span className="h-1.5 w-1.5 rounded-full bg-lime-300" />
                        <span className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-white/80">
                          Museum artifact
                        </span>
                      </div>

                      <div className="absolute bottom-5 right-5 font-mono text-4xl font-black tracking-[-0.06em] text-white/20">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                    </div>

                    <div className="p-6 sm:p-7">
                      <p className="truncate text-[0.65rem] font-bold uppercase tracking-[0.24em] text-lime-300">
                        {relatedArtifact.archiveNumber ?? "AGE202 Archive"}
                      </p>
                      <h3 className="mt-4 text-xl font-bold leading-snug text-white transition group-hover:text-lime-200">
                        {relatedArtifact.title}
                      </h3>

                      <div className="mt-6 flex items-center justify-between gap-5 border-t border-white/10 pt-5">
                        <p className="text-sm text-white/40">
                          {relatedArtifact.year ?? "AGE202 Archive"}
                          {relatedArtifact.tournament ? ` · ${relatedArtifact.tournament}` : ""}
                        </p>
                        <span className="inline-flex shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-white/50 transition group-hover:text-lime-300">
                          Esplora
                          <ArrowUpRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <footer className="relative overflow-hidden bg-[#040914]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(190,242,100,0.06),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12 lg:py-20">
          <div className="grid gap-12 border-b border-white/10 pb-12 md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)_minmax(0,0.7fr)]">
            <div>
              <p className="text-3xl font-black tracking-[-0.05em] text-white">
                AGE202
              </p>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.2em] text-lime-300">
                Second Hand. First Set.
              </p>
              <p className="mt-6 max-w-md text-sm leading-7 text-white/40">
                Archivio digitale dedicato all’abbigliamento autentico e ai reperti che raccontano la storia del tennis.
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/30">
                Esplora
              </p>
              <div className="mt-5 flex flex-col gap-3 text-sm text-white/55">
                <Link href="/archive" className="transition hover:text-lime-300">Archivio</Link>
                <Link href={`/archives/${artifact.player.slug}`} className="transition hover:text-lime-300">Collezione {artifact.player.name}</Link>
                <Link href="/" className="transition hover:text-lime-300">Homepage</Link>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/30">
                Reperto corrente
              </p>
              <p className="mt-5 text-sm font-semibold leading-6 text-white/70">
                {artifact.title}
              </p>
              <p className="mt-3 break-all font-mono text-xs leading-6 text-white/30">
                {artifact.archiveNumber ?? artifact.id}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-8 text-xs uppercase tracking-[0.18em] text-white/25 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} AGE202 Digital Museum</p>
            <p>Preserving tennis history, one artifact at a time.</p>
          </div>
        </div>
      </footer>

    </main>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-lime-300">
        {eyebrow}
      </p>

      <h2 className="mt-4 text-3xl font-black tracking-[-0.035em] sm:text-5xl">
        {title}
      </h2>

      {description && (
        <p className="mt-5 max-w-2xl text-base leading-8 text-white/50">
          {description}
        </p>
      )}
    </div>
  );
}

function CertificateInfo({
  icon: Icon,
  label,
  value,
  mono = false,
}: {
  icon: typeof Fingerprint;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="bg-[#0a101d] p-6 sm:p-7">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-amber-200" />

        <p className="text-[0.65rem] font-bold uppercase tracking-[0.24em] text-white/35">
          {label}
        </p>
      </div>

      <p
        className={`mt-4 break-words text-sm leading-7 text-white/80 ${
          mono ? "font-mono" : "font-semibold"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function CertificateBadge({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/[0.07] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-amber-100">
      {children}
    </span>
  );
}