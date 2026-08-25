import Link from "next/link";
import type { ReactNode } from "react";

import {
  ArrowUpRight,
  BadgeCheck,
  CircleCheck,
  FileCheck2,
  Fingerprint,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

type ArtifactCollectingPanelProps = {
  title: string;
  availability: string | null;
  formattedPrice: string | null;
  vintedUrl: string | null;
  archiveNumber: string | null;
  authentic: boolean;
  certificateVerified?: boolean | null;
};

function getCollectionStatus(
  availability: string | null,
) {
  switch (availability) {
    case "AVAILABLE":
      return {
        eyebrow: "Available to Collect",
        title: "Available to Collect",
        badge: "1 specimen available",
        description:
          "Questo Artifact è attualmente disponibile per entrare in una collezione privata. Un solo esemplare è registrato come disponibile nell’archivio AGE202.",
      };

    case "SOLD":
      return {
        eyebrow: "Private Collection",
        title: "Collected",
        badge: "Archive preserved",
        description:
          "Questo Artifact non è più disponibile per l’acquisizione. La sua identità, documentazione e storia rimangono preservate nell’archivio digitale AGE202.",
      };

    case "RESERVED":
      return {
        eyebrow: "Collection Status",
        title: "Reserved",
        badge: "Acquisition pending",
        description:
          "Questo Artifact è attualmente riservato. La scheda museale rimane consultabile mentre l’acquisizione è in corso.",
      };

    case "COMING_SOON":
      return {
        eyebrow: "Collection Status",
        title: "Coming Soon",
        badge: "Archive preparation",
        description:
          "Questo Artifact è in fase di preparazione e sarà presto disponibile per la consultazione o l’acquisizione.",
      };

    case "NOT_FOR_SALE":
      return {
        eyebrow: "Museum Collection",
        title: "Archive Only",
        badge: "Not for acquisition",
        description:
          "Questo Artifact appartiene alla collezione museale AGE202 e non è attualmente disponibile per l’acquisizione.",
      };

    default:
      return {
        eyebrow: "Collection Status",
        title: "Archive Record",
        badge: "AGE202 Museum",
        description:
          "Questo Artifact è conservato e documentato nell’archivio digitale AGE202.",
      };
  }
}

export default function ArtifactCollectingPanel({
  title,
  availability,
  formattedPrice,
  vintedUrl,
  archiveNumber,
  authentic,
  certificateVerified,
}: ArtifactCollectingPanelProps) {
  const status =
    getCollectionStatus(availability);

  const isAvailable =
    availability === "AVAILABLE";

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#050b18]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_38%,rgba(190,242,100,0.10),transparent_31%),radial-gradient(circle_at_12%_85%,rgba(255,255,255,0.025),transparent_30%)]" />

      <div className="relative mx-auto max-w-[1440px] px-6 py-20 sm:px-8 lg:px-12 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_480px] lg:items-stretch lg:gap-20">
          <div className="flex flex-col justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-lime-300/25 bg-lime-300/[0.07] shadow-[0_0_50px_rgba(190,242,100,0.05)]">
              <ShoppingBag className="h-7 w-7 text-lime-300" />
            </div>

            <p className="mt-9 text-xs font-bold uppercase tracking-[0.34em] text-lime-300">
              {status.eyebrow}
            </p>

            <h2 className="mt-5 max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
              {status.title}
            </h2>

            <p className="mt-8 max-w-2xl text-base leading-8 text-white/55 sm:text-lg">
              {status.description}
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-lime-300/20 bg-lime-300/[0.06] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-lime-200">
                <CircleCheck className="h-3.5 w-3.5" />
                {status.badge}
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white/55">
                <Sparkles className="h-3.5 w-3.5 text-lime-300" />
                AGE202 Archive
              </span>
            </div>

            {isAvailable && (
              <div className="mt-12 grid max-w-3xl gap-px overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/10 sm:grid-cols-2">
                <CollectingFact
                  icon={
                    <FileCheck2 className="h-4 w-4" />
                  }
                  title="Archive Record"
                  description="Scheda museale AGE202 registrata"
                />

                {archiveNumber && (
                  <CollectingFact
                    icon={
                      <Fingerprint className="h-4 w-4" />
                    }
                    title="Unique Identity"
                    description="Numero archivio univoco"
                  />
                )}

                {authentic && (
                  <CollectingFact
                    icon={
                      <BadgeCheck className="h-4 w-4" />
                    }
                    title="Authenticity"
                    description={
                      certificateVerified
                        ? "Identità verificata"
                        : "Autenticità registrata"
                    }
                  />
                )}

                {authentic && (
                  <CollectingFact
                    icon={
                      <Sparkles className="h-4 w-4" />
                    }
                    title="Digital Certificate"
                    description="Certificato digitale AGE202"
                  />
                )}
              </div>
            )}
          </div>

          <aside className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-[#08101f] shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_90%_5%,rgba(190,242,100,0.10),transparent_28%)]" />

            <div className="relative flex h-full flex-col p-7 sm:p-9 lg:p-10">
              <div className="flex items-start justify-between gap-6 border-b border-white/10 pb-7">
                <div>
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-white/35">
                    AGE202 Collection
                  </p>

                  <p className="mt-3 max-w-xs text-lg font-bold leading-7 text-white/85">
                    {title}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.17em] ${
                    isAvailable
                      ? "border-lime-300/25 bg-lime-300/[0.08] text-lime-300"
                      : "border-white/10 bg-white/[0.035] text-white/45"
                  }`}
                >
                  {isAvailable
                    ? "Available"
                    : status.title}
                </span>
              </div>

              {archiveNumber && (
                <div className="border-b border-white/10 py-7">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.26em] text-white/30">
                    Archive reference
                  </p>

                  <p className="mt-3 break-all font-mono text-xs leading-6 tracking-[0.08em] text-lime-200/65">
                    {archiveNumber}
                  </p>
                </div>
              )}

              <div className="py-8">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.26em] text-white/35">
                  Collection value
                </p>

                {formattedPrice ? (
                  <p className="mt-4 text-5xl font-black tracking-[-0.055em] text-white sm:text-6xl">
                    {formattedPrice}
                  </p>
                ) : (
                  <p className="mt-4 text-xl font-semibold text-white/60">
                    Valore non indicato
                  </p>
                )}

                {isAvailable && (
                  <p className="mt-4 text-sm leading-7 text-white/40">
                    Un solo esemplare attualmente
                    disponibile.
                  </p>
                )}
              </div>

              <div className="mt-auto">
                {isAvailable &&
                formattedPrice ? (
                  vintedUrl ? (
                    <>
                      <Link
                        href={vintedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-lime-300 bg-lime-300 px-6 py-5 text-sm font-black uppercase tracking-[0.17em] text-[#050b18] transition duration-300 hover:bg-lime-200"
                      >
                        Collect this Artifact
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </Link>

                      <div className="mt-5 border-t border-white/10 pt-5 text-center">
                        <p className="text-xs leading-6 text-white/35">
                          L’acquisizione viene
                          completata tramite Vinted.
                        </p>

                        <p className="mt-1 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-white/25">
                          External secure marketplace
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 px-6 py-5 text-sm leading-7 text-white/45">
                      Questo Artifact è disponibile,
                      ma non è ancora associato a un
                      link di acquisizione.
                    </div>
                  )
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-black/20 px-6 py-6">
                    <p className="text-sm font-semibold text-white/65">
                      {availability === "SOLD"
                        ? "Artifact collected."
                        : "Acquisizione non disponibile."}
                    </p>

                    <p className="mt-2 text-sm leading-7 text-white/35">
                      La scheda museale continuerà a
                      essere preservata nell’archivio
                      AGE202.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function CollectingFact({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-[#07101d] p-6">
      <div className="flex items-center gap-3 text-lime-300">
        {icon}

        <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em]">
          {title}
        </p>
      </div>

      <p className="mt-3 text-sm leading-6 text-white/45">
        {description}
      </p>
    </div>
  );
}