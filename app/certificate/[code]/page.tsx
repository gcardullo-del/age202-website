import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { products } from "@/data/products";
import type { Product } from "@/data/product.types";

type PageProps = {
  params: Promise<{
    code: string;
  }>;
};

function normalizeCode(code: string) {
  return decodeURIComponent(code).trim().toUpperCase();
}

function getProductByCertificate(code: string): Product | undefined {
  const normalizedCode = normalizeCode(code);

  return products.find(
    (product) => product.authenticityCode.toUpperCase() === normalizedCode,
  );
}

export function generateStaticParams() {
  return products.map((product) => ({
    code: product.authenticityCode,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { code } = await params;
  const product = getProductByCertificate(code);

  if (!product) {
    return {
      title: "Certificate not found | AGE202",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `${product.authenticityCode} verified | AGE202`,
    description: `Public verification record for ${product.title}, archive number ${product.archiveNumber}.`,
  };
}

export default async function CertificateRecordPage({
  params,
}: PageProps) {
  const { code } = await params;
  const product = getProductByCertificate(code);

  if (!product) {
    notFound();
  }

  const verified = product.authentic;

  return (
    <main className="min-h-screen bg-[#050B18] px-6 pb-24 pt-36 text-white md:px-8">
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/certificate"
            className="text-[10px] font-black uppercase tracking-[0.28em] text-white/38 transition-colors hover:text-[#C8FF00]"
          >
            ← Verify another code
          </Link>

          <Link
            href={`/product/${product.id}`}
            className="text-[10px] font-black uppercase tracking-[0.28em] text-white/38 transition-colors hover:text-[#C8FF00]"
          >
            Open museum piece →
          </Link>
        </div>

        <article className="mt-10 overflow-hidden rounded-[42px] border border-white/10 bg-[#08101F] shadow-[0_40px_130px_rgba(0,0,0,0.4)]">
          <header className="relative overflow-hidden border-b border-white/10 p-8 md:p-14">
            <div
              aria-hidden="true"
              className="absolute -right-12 -top-20 text-[260px] font-black leading-none tracking-[-0.12em] text-white/[0.025]"
            >
              ✓
            </div>

            <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={[
                      "rounded-full border px-4 py-2 text-[9px] font-black uppercase tracking-[0.23em]",
                      verified
                        ? "border-[#C8FF00]/30 bg-[#C8FF00]/10 text-[#C8FF00]"
                        : "border-amber-300/25 bg-amber-300/10 text-amber-200",
                    ].join(" ")}
                  >
                    {verified ? "Verified record" : "Verification pending"}
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-[9px] font-black uppercase tracking-[0.23em] text-white/45">
                    Public certificate
                  </span>
                </div>

                <p className="mt-8 text-[10px] font-black uppercase tracking-[0.35em] text-[#C8FF00]">
                  AGE202 Digital Tennis Museum
                </p>

                <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-[-0.045em] sm:text-5xl md:text-7xl">
                  Certificate of authenticity
                </h1>

                <p className="mt-6 max-w-3xl text-base leading-8 text-white/48 md:text-lg">
                  This public record links an AGE202 authenticity code to its
                  archive identity and museum classification.
                </p>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-black/20 p-6 md:min-w-80">
                <p className="text-[9px] font-black uppercase tracking-[0.28em] text-white/30">
                  Authenticity code
                </p>
                <p className="mt-3 break-all font-mono text-lg font-black tracking-[0.1em] text-white">
                  {product.authenticityCode}
                </p>
              </div>
            </div>
          </header>

          <div className="grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            <CertificateField
              label="Archive number"
              value={product.archiveNumber}
              mono
            />
            <CertificateField label="Player" value={product.player} />
            <CertificateField label="Tournament" value={product.tournament} />
            <CertificateField label="Year" value={String(product.year)} />
            <CertificateField label="Brand" value={product.brand} />
            <CertificateField label="Category" value={product.category} />
            <CertificateField label="Collection" value={product.collection} />
            <CertificateField
              label="Record status"
              value={verified ? "Verified" : "Pending"}
            />
          </div>

          <footer className="flex flex-col gap-5 border-t border-white/10 p-8 text-sm leading-7 text-white/38 md:flex-row md:items-center md:justify-between md:p-10">
            <p className="max-w-3xl">
              Verification confirms that this code is present in the AGE202
              public archive. It does not replace independent physical
              inspection, provenance documentation or third-party appraisal.
            </p>

            <span className="shrink-0 font-mono text-xs font-bold uppercase tracking-[0.15em] text-white/58">
              AGE202 · {product.archiveNumber}
            </span>
          </footer>
        </article>
      </section>
    </main>
  );
}

function CertificateField({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="min-h-32 bg-[#0A1425] p-6">
      <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/28">
        {label}
      </p>
      <p
        className={[
          "mt-5 break-words text-sm font-bold capitalize leading-6 text-white/82",
          mono ? "font-mono tracking-[0.08em]" : "",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}
