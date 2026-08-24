import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import {
  ArrowUpRight,
  Award,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  FileCheck2,
  Fingerprint,
  Gem,
  LockKeyhole,
  ScanLine,
  Sparkles,
  ShieldCheck,
  Star,
  UserRound,
} from "lucide-react";

import StripeCheckoutButton from "@/components/commerce/StripeCheckoutButton";
import MuseumQrCode from "@/components/certificate/MuseumQrCode";

import {
  getPublishedMemorabiliaBySlug,
  getPublishedMemorabiliaSlugs,
  getRelatedMemorabilia,
} from "@/lib/repositories/memorabilia.repository";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatLabel(value: string | null | undefined): string {
  if (!value) return "—";

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatPrice(
  value: unknown,
  currency: string | null,
): string | null {
  if (value === null || value === undefined) return null;

  const amount = Number(value);
  if (!Number.isFinite(amount)) return null;

  try {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: currency ?? "EUR",
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency ?? "EUR"}`;
  }
}

function getAvailabilityLabel(availability: string): string {
  const labels: Record<string, string> = {
    AVAILABLE: "Disponibile",
    RESERVED: "Riservato",
    SOLD: "Venduto",
    COMING_SOON: "Prossimamente",
    NOT_FOR_SALE: "Non in vendita",
  };

  return labels[availability] ?? formatLabel(availability);
}

function getAvailabilityClasses(availability: string): string {
  const classes: Record<string, string> = {
    AVAILABLE: "text-lime-300",
    RESERVED: "text-sky-300",
    SOLD: "text-rose-300",
    COMING_SOON: "text-amber-300",
    NOT_FOR_SALE: "text-white/45",
  };

  return classes[availability] ?? "text-white/45";
}

export async function generateStaticParams() {
  const records = await getPublishedMemorabiliaSlugs();

  return records.map((record) => ({
    slug: record.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const memorabilia =
    await getPublishedMemorabiliaBySlug(slug);

  if (!memorabilia) {
    return {
      title: "Memorabilia non trovato | AGE202",
    };
  }

  const cover =
    memorabilia.images.find((image) => image.isCover) ??
    memorabilia.images[0] ??
    null;

  const description =
    memorabilia.metaDescription ??
    memorabilia.description ??
    memorabilia.subtitle ??
    `${memorabilia.title}, oggetto della collezione Memorabilia AGE202.`;

  return {
    title:
      memorabilia.metaTitle ??
      `${memorabilia.title} | AGE202 Museum`,
    description,
    alternates: {
      canonical: `/memorabilia/${memorabilia.slug}`,
    },
    openGraph: {
      title: memorabilia.title,
      description,
      type: "article",
      images: cover
        ? [
            {
              url: cover.url,
              alt: cover.alt ?? memorabilia.title,
            },
          ]
        : [],
    },
  };
}

export default async function MemorabiliaDetailPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const memorabilia =
    await getPublishedMemorabiliaBySlug(slug);

  if (!memorabilia) {
    notFound();
  }

  const related = await getRelatedMemorabilia({
    memorabiliaId: memorabilia.id,
    playerId: memorabilia.playerId,
    type: memorabilia.type,
    limit: 3,
  });

  const cover =
    memorabilia.images.find((image) => image.isCover) ??
    memorabilia.images[0] ??
    null;

  const formattedPrice = formatPrice(
    memorabilia.price,
    memorabilia.currency,
  );

  const details = [
    { label: "Giocatore", value: memorabilia.player?.name ?? null },
    { label: "Tipologia", value: formatLabel(memorabilia.type) },
    { label: "Anno", value: memorabilia.year?.toString() ?? null },
    { label: "Brand", value: memorabilia.brand },
    { label: "Collezione", value: memorabilia.collection },
    { label: "Edizione", value: memorabilia.edition },
    { label: "Condizione", value: formatLabel(memorabilia.condition) },
    { label: "Rarità", value: formatLabel(memorabilia.rarity) },
    { label: "Materiale", value: memorabilia.material },
    { label: "Dimensione", value: memorabilia.size },
    { label: "Colore", value: memorabilia.colour },
  ].filter(
    (item): item is { label: string; value: string } =>
      Boolean(item.value && item.value.trim().length > 0),
  );

  const cardDetails = [
    { label: "Card set", value: memorabilia.cardSet },
    { label: "Card number", value: memorabilia.cardNumber },
    { label: "Grading company", value: memorabilia.gradingCompany },
    { label: "Grade", value: memorabilia.grade },
    {
      label: "Grading certificate",
      value: memorabilia.gradingCertNumber,
    },
  ].filter(
    (item): item is { label: string; value: string } =>
      Boolean(item.value && item.value.trim().length > 0),
  );

  const authenticityDetails = [
    { label: "Signed", value: memorabilia.signed ? "Sì" : "No" },
    { label: "Signed by", value: memorabilia.signedBy },
    {
      label: "Signature location",
      value: memorabilia.signatureLocation,
    },
    {
      label: "Authentication company",
      value: memorabilia.authenticationCompany,
    },
    {
      label: "Authenticity code",
      value: memorabilia.authenticityCode,
    },
  ].filter(
    (item): item is { label: string; value: string } =>
      Boolean(item.value && item.value.trim().length > 0),
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: memorabilia.title,
    description:
      memorabilia.description ??
      memorabilia.subtitle ??
      undefined,
    identifier: memorabilia.inventoryNumber,
    image: memorabilia.images.map((image) => image.url),
    creator: {
      "@type": "Organization",
      name: "AGE202 Digital Museum",
    },
    about: [
      memorabilia.player?.name,
      memorabilia.brand,
      formatLabel(memorabilia.type),
    ].filter(Boolean),
    dateCreated: memorabilia.year
      ? String(memorabilia.year)
      : undefined,
    url: `/memorabilia/${memorabilia.slug}`,
  };

  return (
    <main className="min-h-screen bg-[#050b18] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <section className="relative overflow-hidden border-b border-white/10 bg-[#050b18]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(204,255,0,0.12),transparent_30%),radial-gradient(circle_at_18%_75%,rgba(56,189,248,0.08),transparent_30%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-12 lg:py-24">
          <div className="flex flex-col justify-center">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-lime-300">
              AGE202 Memorabilia
            </p>

            <h1 className="mt-5 max-w-4xl text-5xl font-black uppercase leading-[0.92] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
              {memorabilia.title}
            </h1>

            {memorabilia.subtitle ? (
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/55">
                {memorabilia.subtitle}
              </p>
            ) : null}

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white/55">
                {formatLabel(memorabilia.type)}
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white/55">
                {formatLabel(memorabilia.rarity)}
              </span>

              <span
                className={[
                  "rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em]",
                  getAvailabilityClasses(memorabilia.availability),
                ].join(" ")}
              >
                {getAvailabilityLabel(memorabilia.availability)}
              </span>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 text-sm text-white/40">
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-white/25">
                  Inventory
                </p>
                <p className="mt-2 font-mono text-white/65">
                  {memorabilia.inventoryNumber}
                </p>
              </div>

              {memorabilia.player ? (
                <div>
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-white/25">
                    Player
                  </p>
                  <p className="mt-2 text-white/65">
                    {memorabilia.player.name}
                  </p>
                </div>
              ) : null}

              {memorabilia.year ? (
                <div>
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-white/25">
                    Year
                  </p>
                  <p className="mt-2 text-white/65">
                    {memorabilia.year}
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 rounded-[2.5rem] bg-lime-300/[0.06] blur-3xl" />

            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#08101f] shadow-2xl shadow-black/40">
              <div className="relative aspect-[4/3]">
                {cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cover.url}
                    alt={cover.alt ?? memorabilia.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_50%_45%,rgba(204,255,0,0.15),transparent_32%),linear-gradient(145deg,rgba(255,255,255,0.05),rgba(255,255,255,0.015))]">
                    <Gem
                      className="h-24 w-24 text-lime-300/70"
                      strokeWidth={1.2}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 border-t border-white/10 text-center">
                <div className="p-5">
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-white/25">
                    Authentic
                  </p>
                  <p className="mt-2 text-sm font-black text-white">
                    {memorabilia.authentic ? "YES" : "N/A"}
                  </p>
                </div>

                <div className="border-x border-white/10 p-5">
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-white/25">
                    Signed
                  </p>
                  <p className="mt-2 text-sm font-black text-white">
                    {memorabilia.signed ? "YES" : "NO"}
                  </p>
                </div>

                <div className="p-5">
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-white/25">
                    Rarity
                  </p>
                  <p className="mt-2 text-sm font-black text-white">
                    {formatLabel(memorabilia.rarity)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
            href="/memorabilia"
            className="transition hover:text-lime-300"
          >
            Memorabilia
          </Link>

          <ChevronRight className="h-3.5 w-3.5 shrink-0" />

          <span className="whitespace-nowrap text-white/65">
            {memorabilia.title}
          </span>
        </div>
      </nav>

      {memorabilia.description ? (
        <section className="border-b border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-28">
            <div className="grid gap-12 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-20">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.32em] text-lime-300">
                  Museum Story
                </p>

                <h2 className="mt-5 text-3xl font-black tracking-[-0.035em] sm:text-4xl">
                  La storia dell’oggetto
                </h2>
              </div>

              <p className="max-w-4xl whitespace-pre-line text-xl leading-9 text-white/70 sm:text-2xl sm:leading-10">
                {memorabilia.description}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {memorabilia.images.length > 0 ? (
        <section className="border-b border-white/10 bg-[#070e1c]">
          <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-28">
            <div className="flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-lime-300">
                  Visual archive
                </p>

                <h2 className="mt-4 text-3xl font-black tracking-[-0.035em] sm:text-5xl">
                  Galleria memorabilia
                </h2>
              </div>

              <p className="font-mono text-3xl font-black text-white/70">
                {String(memorabilia.images.length).padStart(2, "0")}
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {memorabilia.images.map((image, index) => (
                <div
                  key={image.id}
                  className="group overflow-hidden rounded-[2rem] border border-white/10 bg-[#08101f]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.url}
                      alt={
                        image.alt ??
                        `${memorabilia.title} ${index + 1}`
                      }
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                    />

                    {image.isCover ? (
                      <span className="absolute left-5 top-5 rounded-full border border-lime-300/30 bg-black/55 px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-lime-300 backdrop-blur-md">
                        Cover
                      </span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-lime-300">
                Catalogo AGE202
              </p>

              <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                Scheda archivio
              </h2>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#08101f]">
              <dl>
                {details.map((detail, index) => (
                  <div
                    key={detail.label}
                    className={[
                      "flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8",
                      index !== details.length - 1
                        ? "border-b border-white/10"
                        : "",
                    ].join(" ")}
                  >
                    <dt className="text-xs font-bold uppercase tracking-[0.18em] text-white/35">
                      {detail.label}
                    </dt>

                    <dd className="text-base font-semibold text-white/85 sm:text-right">
                      {detail.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {cardDetails.length > 0 ? (
        <section className="border-b border-white/10 bg-white/[0.018]">
          <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-28">
            <div className="grid gap-12 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-16">
              <div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-400/10">
                  <Star className="h-6 w-6 text-violet-300" />
                </div>

                <p className="mt-7 text-xs font-bold uppercase tracking-[0.3em] text-violet-300">
                  Collector data
                </p>

                <h2 className="mt-4 text-4xl font-black tracking-[-0.04em]">
                  Trading card & grading
                </h2>
              </div>

              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#08101f]">
                {cardDetails.map((detail, index) => (
                  <div
                    key={detail.label}
                    className={[
                      "flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8",
                      index !== cardDetails.length - 1
                        ? "border-b border-white/10"
                        : "",
                    ].join(" ")}
                  >
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-white/35">
                      {detail.label}
                    </span>

                    <span className="text-base font-semibold text-white/85">
                      {detail.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {memorabilia.authentic ? (
        <section className="relative overflow-hidden border-b border-white/10 bg-[#080d18]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(251,191,36,0.12),transparent_34%),radial-gradient(circle_at_88%_82%,rgba(190,242,100,0.06),transparent_28%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.35)_1px,transparent_1px)] [background-size:44px_44px]" />

          <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-32">
            <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-200">
                  Certificazione museale
                </p>
                <h2 className="mt-4 text-3xl font-black tracking-[-0.035em] sm:text-5xl">
                  Digital Certificate
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-8 text-white/50">
                  Documento digitale associato in modo univoco all’oggetto e
                  conservato nel registro Memorabilia AGE202.
                </p>
              </div>

              <div className="inline-flex w-fit items-center gap-3 rounded-full border border-amber-300/20 bg-amber-300/[0.07] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-100">
                <LockKeyhole className="h-4 w-4" />
                Record protetto
              </div>
            </div>

            <article className="relative overflow-hidden rounded-[2.5rem] border border-amber-300/25 bg-[#0a101d] shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
              <div className="pointer-events-none absolute -right-10 top-6 select-none font-mono text-[9rem] font-black leading-none tracking-[-0.12em] text-white/[0.025] sm:text-[14rem] lg:text-[18rem]">
                202
              </div>

              <div className="relative grid lg:grid-cols-[minmax(0,1fr)_390px] xl:grid-cols-[minmax(0,1fr)_430px]">
                <div className="p-7 sm:p-10 lg:p-14 xl:p-16">
                  <div className="flex flex-col gap-8 border-b border-white/10 pb-10 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-5">
                      <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-amber-300/30 bg-amber-300/10">
                        <Award className="h-8 w-8 text-amber-200" />
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.32em] text-amber-200">
                          Certificate of authenticity
                        </p>
                        <h3 className="mt-3 max-w-3xl text-3xl font-black leading-[1.02] tracking-[-0.04em] text-white sm:text-5xl">
                          Autenticità registrata
                        </h3>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/[0.07] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-200">
                      <CheckCircle2 className="h-4 w-4" />
                      Registrato
                    </div>
                  </div>

                  <div className="py-10">
                    <p className="max-w-3xl text-base leading-8 text-white/55 sm:text-lg">
                      AGE202 attesta che l’oggetto descritto in questa pagina è
                      stato catalogato con i propri dati identificativi,
                      collezionistici e fotografici. Il certificato collega il
                      bene alla sua scheda museale digitale.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                      <CertificateBadge>
                        <BadgeCheck className="h-4 w-4" />
                        Oggetto autenticato
                      </CertificateBadge>
                      <CertificateBadge>
                        <FileCheck2 className="h-4 w-4" />
                        Scheda catalogata
                      </CertificateBadge>
                      <CertificateBadge>
                        <Sparkles className="h-4 w-4" />
                        Memorabilia AGE202
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
                      {memorabilia.authenticityCode ??
                        memorabilia.inventoryNumber}
                    </p>
                  </div>

                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <CertificateInfo
                      icon={BadgeCheck}
                      label="Stato certificazione"
                      value="Identità registrata"
                    />
                    <CertificateInfo
                      icon={CalendarDays}
                      label="Data registrazione"
                      value={new Intl.DateTimeFormat("it-IT", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }).format(new Date(memorabilia.createdAt))}
                    />
                    <CertificateInfo
                      icon={UserRound}
                      label="Curatore"
                      value="AGE202 Digital Museum"
                    />
                    <CertificateInfo
                      icon={Fingerprint}
                      label="Numero archivio"
                      value={memorabilia.inventoryNumber}
                      mono
                    />
                    {memorabilia.player?.name ? (
                      <CertificateInfo
                        icon={UserRound}
                        label="Giocatore associato"
                        value={memorabilia.player.name}
                      />
                    ) : null}
                    <CertificateInfo
                      icon={ShieldCheck}
                      label="Tipologia"
                      value={formatLabel(memorabilia.type)}
                    />
                    <CertificateInfo
                      icon={Sparkles}
                      label="Rarità"
                      value={formatLabel(memorabilia.rarity)}
                    />
                    {memorabilia.signedBy ? (
                      <CertificateInfo
                        icon={BadgeCheck}
                        label="Firmato da"
                        value={memorabilia.signedBy}
                      />
                    ) : null}
                    {memorabilia.authenticationCompany ? (
                      <CertificateInfo
                        icon={ShieldCheck}
                        label="Ente autenticatore"
                        value={memorabilia.authenticationCompany}
                      />
                    ) : null}
                  </div>

                  {authenticityDetails.length > 1 ? (
                    <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/[0.025] p-6 sm:p-7">
                      <p className="text-[0.65rem] font-bold uppercase tracking-[0.26em] text-white/35">
                        Dati di provenienza
                      </p>

                      <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        {authenticityDetails
                          .filter(
                            (detail) =>
                              detail.label !== "Authenticity code",
                          )
                          .map((detail) => (
                            <div key={detail.label}>
                              <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/25">
                                {detail.label}
                              </p>
                              <p className="mt-2 break-words text-sm font-semibold leading-6 text-white/65">
                                {detail.value}
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : null}

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
                        Memorabilia
                      </p>
                      <p className="mt-2 max-w-sm text-sm font-semibold leading-6 text-white/70">
                        {memorabilia.title}
                      </p>
                    </div>
                  </div>
                </div>

                <aside className="flex flex-col border-t border-amber-300/15 bg-amber-300/[0.035] p-7 sm:p-9 lg:border-l lg:border-t-0 lg:p-10">
                  <div className="flex flex-1 flex-col items-center justify-center rounded-[2rem] border border-dashed border-amber-300/25 bg-black/20 p-7 text-center sm:p-9">
                    <div className="relative">
                      <div className="absolute -inset-4 rounded-[2rem] border border-amber-300/10" />

                      <MuseumQrCode
                        value={`${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/memorabilia/${memorabilia.slug}`}
                        title={`QR Code ${memorabilia.title}`}
                      />
                    </div>

                    <div className="mt-9 flex items-center gap-2 text-amber-200">
                      <ScanLine className="h-4 w-4" />
                      <p className="text-xs font-bold uppercase tracking-[0.28em]">
                        Identità digitale
                      </p>
                    </div>

                    <p className="mt-4 max-w-xs text-sm leading-7 text-white/45">
                      Scansiona il codice per aprire la scheda ufficiale di
                      questo oggetto nel registro Memorabilia AGE202.
                    </p>

                    {memorabilia.certificateUrl ? (
                      <a
                        href={memorabilia.certificateUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-7 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/[0.07] px-4 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-amber-100 transition hover:bg-amber-300/[0.12]"
                      >
                        Apri certificato
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    ) : null}
                  </div>

                  <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/20 p-6">
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.26em] text-white/35">
                      Archive reference
                    </p>
                    <p className="mt-4 break-all font-mono text-sm leading-7 text-amber-100">
                      {memorabilia.inventoryNumber}
                    </p>
                  </div>
                </aside>
              </div>
            </article>
          </div>
        </section>
      ) : null}

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_430px]">
            <div className="flex flex-col justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-lime-300/25 bg-lime-300/[0.08]">
                <CircleDollarSign className="h-8 w-8 text-lime-300" />
              </div>

              <p className="mt-9 text-xs font-bold uppercase tracking-[0.32em] text-lime-300">
                Marketplace
              </p>

              <h2 className="mt-4 text-4xl font-black tracking-[-0.045em] sm:text-6xl">
                {getAvailabilityLabel(memorabilia.availability)}
              </h2>
            </div>

            <div className="flex flex-col justify-between rounded-[2rem] border border-white/10 bg-[#08101f] p-7 sm:p-9">
              <div>
                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-6">
                  <p className="text-xs font-bold uppercase tracking-[0.26em] text-white/35">
                    Stato vendita
                  </p>

                  <span
                    className={[
                      "rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.18em]",
                      getAvailabilityClasses(
                        memorabilia.availability,
                      ),
                    ].join(" ")}
                  >
                    {getAvailabilityLabel(
                      memorabilia.availability,
                    )}
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
                      Non indicato
                    </p>
                  )}
                </div>
              </div>

              {memorabilia.availability ===
                "AVAILABLE" &&
              formattedPrice &&
              memorabilia.stripeActive ? (
                <StripeCheckoutButton
                  itemId={memorabilia.id}
                  itemType="MEMORABILIA"
                  label="Acquista con Stripe"
                />
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 px-6 py-5 text-sm leading-7 text-white/45">
                  {memorabilia.availability === "SOLD"
                    ? "Questo oggetto è stato venduto e non è più disponibile per l’acquisto."
                    : "Questo oggetto non è attualmente disponibile per l’acquisto online."}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="border-b border-white/10 bg-white/[0.018]">
          <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-28">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-lime-300">
                  Related archive
                </p>

                <h2 className="mt-4 text-3xl font-black tracking-[-0.035em] sm:text-5xl">
                  Altri oggetti da esplorare
                </h2>
              </div>

              <Link
                href="/memorabilia"
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-white/50 transition hover:text-lime-300"
              >
                Tutto l’archivio
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item, index) => {
                const relatedCover =
                  item.images.find(
                    (image) => image.isCover,
                  ) ??
                  item.images[0] ??
                  null;

                return (
                  <Link
                    key={item.id}
                    href={`/memorabilia/${item.slug}`}
                    className="group overflow-hidden rounded-[2rem] border border-white/10 bg-[#08101f] transition duration-500 hover:-translate-y-1.5 hover:border-lime-300/30"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
                      {relatedCover ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={relatedCover.url}
                          alt={relatedCover.alt ?? item.title}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Gem className="h-14 w-14 text-lime-300/50" />
                        </div>
                      )}

                      <div className="absolute bottom-5 right-5 font-mono text-4xl font-black text-white/15">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                    </div>

                    <div className="p-6">
                      <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-lime-300">
                        {item.inventoryNumber}
                      </p>

                      <h3 className="mt-3 text-xl font-black uppercase tracking-[-0.02em]">
                        {item.title}
                      </h3>

                      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5 text-sm text-white/40">
                        <span>
                          {item.player?.name ??
                            formatLabel(item.type)}
                        </span>

                        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-white/50 transition group-hover:text-lime-300">
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
      ) : null}

      <footer className="bg-[#040914]">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-6 border-b border-white/10 pb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-3xl font-black tracking-[-0.05em]">
                AGE202
              </p>

              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.2em] text-lime-300">
                Second Hand. First Set.
              </p>
            </div>

            <Link
              href="/memorabilia"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-white/50 transition hover:text-lime-300"
            >
              Memorabilia Archive
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex flex-col gap-4 pt-8 text-xs uppercase tracking-[0.18em] text-white/25 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} AGE202 Digital Museum
            </p>
            <p>
              Preserving tennis history, one object at a time.
            </p>
          </div>
        </div>
      </footer>
    </main>
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