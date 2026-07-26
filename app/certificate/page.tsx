import type { Metadata } from "next";
import Link from "next/link";

import CertificateLookupForm from "@/components/certificate/CertificateLookupForm";

export const metadata: Metadata = {
  title: "Certificate verification | AGE202",
  description:
    "Verify the authenticity code of an AGE202 digital tennis museum archive piece.",
};

export default function CertificateVerificationPage() {
  return (
    <main className="min-h-screen bg-[#050B18] px-6 pb-24 pt-36 text-white md:px-8">
      <section className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="text-[10px] font-black uppercase tracking-[0.28em] text-white/38 transition-colors hover:text-[#C8FF00]"
        >
          ← Back to AGE202
        </Link>

        <div className="mt-10 overflow-hidden rounded-[42px] border border-white/10 bg-[#08101F] shadow-[0_40px_130px_rgba(0,0,0,0.4)]">
          <div className="relative border-b border-white/10 p-8 md:p-14">
            <div
              aria-hidden="true"
              className="absolute -right-8 -top-14 text-[220px] font-black leading-none tracking-[-0.12em] text-white/[0.025]"
            >
              C
            </div>

            <div className="relative max-w-3xl">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#C8FF00]">
                AGE202 Certificate Engine
              </p>

              <h1 className="mt-6 text-4xl font-black tracking-[-0.045em] sm:text-5xl md:text-7xl">
                Verify an archive certificate.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-white/48 md:text-lg">
                Enter the authenticity code printed on the AGE202 museum
                passport to open its public verification record.
              </p>

              <CertificateLookupForm />
            </div>
          </div>

          <div className="grid gap-px bg-white/10 sm:grid-cols-3">
            <VerificationStep
              number="01"
              title="Enter the code"
              text="Use the exact AGE202 authenticity code assigned to the archive piece."
            />
            <VerificationStep
              number="02"
              title="Match the identity"
              text="Compare the archive number, player, tournament and item details."
            />
            <VerificationStep
              number="03"
              title="Confirm the record"
              text="A verified result confirms that the code exists in the public AGE202 archive."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function VerificationStep({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <article className="bg-[#0A1425] p-7 md:p-9">
      <p className="font-mono text-xs font-bold tracking-[0.18em] text-[#C8FF00]">
        {number}
      </p>
      <h2 className="mt-5 text-xl font-black">{title}</h2>
      <p className="mt-4 text-sm leading-7 text-white/42">{text}</p>
    </article>
  );
}
