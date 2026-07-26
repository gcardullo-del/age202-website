"use client";

import { motion, useReducedMotion } from "framer-motion";

import type { Champion } from "@/data/champions";

type DigitalCertificateProps = {
  champion: Champion;
};

export default function DigitalCertificate({
  champion,
}: DigitalCertificateProps) {
  const shouldReduceMotion = useReducedMotion();

  const archiveDate = "July 2026";

  return (
    <section className="relative overflow-hidden bg-[#050b18] py-24 sm:py-28 lg:py-40">
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.75) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.75) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[760px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.08] blur-[220px]"
        style={{
          backgroundColor: champion.accent,
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 h-[420px] w-[420px] rounded-full border border-white/[0.035]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-44 -right-44 h-[560px] w-[560px] rounded-full border border-white/[0.035]"
      />

      <div className="relative mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <motion.div
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 32,
                }
          }
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.75,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <div className="flex items-center gap-4">
              <span
                aria-hidden="true"
                className="h-px w-10 sm:w-14"
                style={{
                  backgroundColor: champion.accent,
                  boxShadow: `0 0 14px ${champion.accent}`,
                }}
              />

              <p
                className="text-[10px] font-black uppercase tracking-[0.32em]"
                style={{
                  color: champion.accent,
                }}
              >
                Digital Certificate
              </p>
            </div>

            <h2 className="mt-6 max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.055em] text-white sm:text-6xl lg:text-8xl">
              Officially preserved.
              <span className="block text-white/25">
                Permanently recorded.
              </span>
            </h2>
          </div>

          <div className="lg:max-w-sm lg:pb-2 lg:text-right">
            <p className="font-mono text-[8px] uppercase leading-6 tracking-[0.22em] text-white/25">
              AGE202 archive authentication
              <br />
              Digital museum registry
            </p>
          </div>
        </motion.div>

        {/* =====================================================
            CERTIFICATE
        ====================================================== */}

        <motion.article
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 48,
                  scale: 0.985,
                }
          }
          whileInView={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          viewport={{
            once: true,
            amount: 0.16,
          }}
          transition={{
            duration: 0.9,
            delay: 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative mt-20 overflow-hidden rounded-[36px] border border-white/10 bg-[#09111f]/95 shadow-2xl sm:mt-24 lg:rounded-[44px]"
        >
          {/* Outer glow */}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-[12%] top-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${champion.accent}, transparent)`,
              boxShadow: `0 0 28px ${champion.accent}`,
            }}
          />

          {/* Decorative watermark */}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 top-10 select-none text-[100px] font-black uppercase leading-none tracking-[-0.08em] text-white/[0.018] sm:text-[170px] lg:text-[260px]"
          >
            AGE202
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-52 -left-48 h-[520px] w-[520px] rounded-full opacity-[0.1] blur-[150px]"
            style={{
              backgroundColor: champion.accent,
            }}
          />

          <div className="relative p-5 sm:p-8 lg:p-10">
            <div
              className="rounded-[28px] border p-1 sm:rounded-[34px]"
              style={{
                borderColor: `${champion.accent}45`,
              }}
            >
              <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.018] px-6 py-10 sm:rounded-[30px] sm:px-10 sm:py-14 lg:px-16 lg:py-16 xl:px-20">
                {/* Corner ornaments */}

                <CertificateCorner
                  position="left-5 top-5"
                  accent={champion.accent}
                />

                <CertificateCorner
                  position="right-5 top-5 rotate-90"
                  accent={champion.accent}
                />

                <CertificateCorner
                  position="bottom-5 right-5 rotate-180"
                  accent={champion.accent}
                />

                <CertificateCorner
                  position="bottom-5 left-5 -rotate-90"
                  accent={champion.accent}
                />

                {/* Certificate heading */}

                <div className="relative text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/[0.025] sm:h-24 sm:w-24">
                    <Age202Seal accent={champion.accent} />
                  </div>

                  <p className="mt-8 font-mono text-[9px] font-bold uppercase tracking-[0.34em] text-white/40">
                    AGE202 Digital Tennis Museum
                  </p>

                  <h3 className="mt-5 text-3xl font-black uppercase tracking-[-0.035em] text-white sm:text-4xl lg:text-5xl">
                    Certificate of Archive
                  </h3>

                  <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/40 sm:text-base sm:leading-8">
                    This document certifies the permanent digital
                    cataloguing of the athlete and the related historical
                    archive within the AGE202 Digital Tennis Museum.
                  </p>
                </div>

                {/* Divider */}

                <div className="my-12 flex items-center gap-4 sm:my-14">
                  <span className="h-px flex-1 bg-white/10" />

                  <span
                    className="h-2.5 w-2.5 rotate-45"
                    style={{
                      backgroundColor: champion.accent,
                      boxShadow: `0 0 14px ${champion.accent}`,
                    }}
                  />

                  <span className="h-px flex-1 bg-white/10" />
                </div>

                {/* Certificate data */}

                <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                  <CertificateField
                    label="Athlete"
                    value={champion.name}
                    accent={champion.accent}
                    featured
                  />

                  <CertificateField
                    label="Nationality"
                    value={champion.nationality}
                  />
<CertificateField
  label="Professional debut"
  value={String(champion.debutYear)}
/>

<CertificateField
  label="Primary brand"
  value={champion.mainBrand}
/>

<CertificateField
  label="Archive pieces"
  value={String(champion.archivePieces)}
/>

                  <CertificateField
                    label="Archive status"
                    value="Verified"
                    accent={champion.accent}
                  />

                  <CertificateField
                    label="Certificate ID"
                    value={champion.certificateId}
                    accent={champion.accent}
                    wide
                  />

                  <CertificateField
                    label="Archive date"
                    value={archiveDate}
                  />

                  <CertificateField
                    label="Collection"
                    value="Permanent"
                  />
                </div>

                {/* Verification block */}

                <div className="mt-14 grid gap-8 border-t border-white/10 pt-10 lg:grid-cols-[1fr_auto] lg:items-end">
                  <div>
                    <p className="font-mono text-[8px] uppercase tracking-[0.24em] text-white/25">
                      Archive declaration
                    </p>

                    <p className="mt-4 max-w-3xl text-sm leading-7 text-white/45 sm:text-base sm:leading-8">
                      The information presented in this digital record has
                      been catalogued for historical, cultural and
                      educational purposes. The certificate identifies the
                      official AGE202 archive page dedicated to{" "}
                      {champion.name}.
                    </p>
                  </div>

                  <div className="flex items-center gap-5 lg:justify-end">
                    <div className="text-right">
                      <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-white/25">
                        Authentication
                      </p>

                      <p
                        className="mt-2 text-[11px] font-black uppercase tracking-[0.18em]"
                        style={{
                          color: champion.accent,
                        }}
                      >
                        AGE202 Verified
                      </p>
                    </div>

                    <div
                      className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border bg-white/[0.025]"
                      style={{
                        borderColor: `${champion.accent}70`,
                        boxShadow: `0 0 30px ${champion.accent}15`,
                      }}
                    >
                      <VerificationMark accent={champion.accent} />
                    </div>
                  </div>
                </div>

                {/* Signature */}

                <div className="mt-12 flex flex-col gap-7 border-t border-white/10 pt-8 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div
                      className="h-px w-44"
                      style={{
                        background: `linear-gradient(90deg, ${champion.accent}, transparent)`,
                      }}
                    />

                    <p className="mt-3 font-mono text-[8px] uppercase tracking-[0.22em] text-white/25">
                      Digital archive curator
                    </p>

                    <p className="mt-2 text-[10px] font-black uppercase tracking-[0.16em] text-white/60">
                      AGE202 Museum Registry
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-white/25">
                      Registered reference
                    </p>

                    <p
                      className="mt-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em]"
                      style={{
                        color: champion.accent,
                      }}
                    >
                      {champion.certificateId}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.article>

        {/* =====================================================
            FOOTER
        ====================================================== */}

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-6 font-mono text-[8px] uppercase tracking-[0.22em] text-white/25 sm:flex-row sm:items-center sm:justify-between lg:mt-24">
          <span>AGE202 Digital Certificate Registry</span>

          <span>
            Archived {archiveDate} · {champion.certificateId}
          </span>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   CERTIFICATE FIELD
========================================================= */

type CertificateFieldProps = {
  label: string;
  value: string;
  accent?: string;
  featured?: boolean;
  wide?: boolean;
};

function CertificateField({
  label,
  value,
  accent,
  featured = false,
  wide = false,
}: CertificateFieldProps) {
  return (
    <div className={wide ? "lg:col-span-1" : undefined}>
      <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-white/25">
        {label}
      </p>

      <p
        className={`mt-3 font-black uppercase leading-tight ${
          featured
            ? "text-xl tracking-[-0.02em] sm:text-2xl"
            : "text-sm tracking-[0.08em]"
        }`}
        style={{
          color: accent ?? "rgba(255,255,255,0.72)",
        }}
      >
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   CERTIFICATE CORNER
========================================================= */

type CertificateCornerProps = {
  position: string;
  accent: string;
};

function CertificateCorner({
  position,
  accent,
}: CertificateCornerProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute ${position} h-10 w-10`}
    >
      <span
        className="absolute left-0 top-0 h-px w-10"
        style={{
          backgroundColor: `${accent}80`,
        }}
      />

      <span
        className="absolute left-0 top-0 h-10 w-px"
        style={{
          backgroundColor: `${accent}80`,
        }}
      />
    </div>
  );
}

/* =========================================================
   AGE202 SEAL
========================================================= */

type Age202SealProps = {
  accent: string;
};

function Age202Seal({
  accent,
}: Age202SealProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 96 96"
      className="h-14 w-14 sm:h-16 sm:w-16"
      fill="none"
    >
      <circle
        cx="48"
        cy="48"
        r="39"
        stroke={accent}
        strokeWidth="1.8"
      />

      <circle
        cx="48"
        cy="48"
        r="31"
        stroke={accent}
        strokeWidth="1"
        opacity="0.45"
      />

      <path
        d="M31 58L42 32H50L61 58H54.5L52.2 52H39.5L37.2 58H31ZM41.5 46.5H50.2L45.9 35.5L41.5 46.5Z"
        fill={accent}
      />

      <path
        d="M65 34V58"
        stroke={accent}
        strokeWidth="4"
        strokeLinecap="round"
      />

      <circle
        cx="48"
        cy="13"
        r="2.5"
        fill={accent}
      />

      <circle
        cx="48"
        cy="83"
        r="2.5"
        fill={accent}
      />
    </svg>
  );
}

/* =========================================================
   VERIFICATION MARK
========================================================= */

type VerificationMarkProps = {
  accent: string;
};

function VerificationMark({
  accent,
}: VerificationMarkProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      className="h-8 w-8"
      fill="none"
    >
      <circle
        cx="24"
        cy="24"
        r="18"
        stroke={accent}
        strokeWidth="2"
      />

      <path
        d="M15.5 24.5L21 30L32.5 18.5"
        stroke={accent}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}