"use client";

import {
  motion,
  useReducedMotion,
} from "framer-motion";

import type {
  Champion,
} from "@/data/champions";

import ChapterTransition from "../ui/ChapterTransition";
import MuseumHeading from "../ui/MuseumHeading";
import MuseumSection from "../ui/MuseumSection";

import Age202Seal from "./Age202Seal";
import CertificateCorner from "./CertificateCorner";
import CertificateField from "./CertificateField";
import VerificationMark from "./VerificationMark";

type DigitalCertificateProps = {
  champion: Champion;
};

export default function DigitalCertificate({
  champion,
}: DigitalCertificateProps) {
  const shouldReduceMotion =
    useReducedMotion();

  const archiveDate =
    "July 2026";

  return (
    <MuseumSection
      id="digital-certificate"
      accent={champion.accent}
      className="border-y-0 bg-[#050b18] py-24 sm:py-28 lg:py-40"
      withGrid={false}
      withGlow={false}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.75) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.75) 1px, transparent 1px)",
          backgroundSize:
            "72px 72px",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[760px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.08] blur-[220px]"
        style={{
          backgroundColor:
            champion.accent,
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
          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
      >
        <MuseumHeading
          eyebrow="Digital Certificate"
          accent={champion.accent}
          title={
            <>
              Officially preserved.

              <span className="block text-white/25">
                Permanently recorded.
              </span>
            </>
          }
          aside={
            <p className="font-mono text-[8px] uppercase leading-6 tracking-[0.22em] text-white/25 lg:text-right">
              AGE202 archive authentication
              <br />
              Digital museum registry
            </p>
          }
        />
      </motion.div>

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
          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
        className="relative mt-20 overflow-hidden rounded-[36px] border border-white/10 bg-[#09111f]/95 shadow-2xl sm:mt-24 lg:rounded-[44px]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[12%] top-0 h-px"
          style={{
            background:
              `linear-gradient(90deg, transparent, ${champion.accent}, transparent)`,
            boxShadow:
              `0 0 28px ${champion.accent}`,
          }}
        />

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
            backgroundColor:
              champion.accent,
          }}
        />

        <div className="relative p-5 sm:p-8 lg:p-10">
          <div
            className="rounded-[28px] border p-1 sm:rounded-[34px]"
            style={{
              borderColor:
                `${champion.accent}45`,
            }}
          >
            <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.018] px-6 py-10 sm:rounded-[30px] sm:px-10 sm:py-14 lg:px-16 lg:py-16 xl:px-20">
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

              <div className="relative text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/[0.025] sm:h-24 sm:w-24">
                  <Age202Seal
                    accent={
                      champion.accent
                    }
                  />
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

              <div className="my-12 flex items-center gap-4 sm:my-14">
                <span className="h-px flex-1 bg-white/10" />

                <span
                  className="h-2.5 w-2.5 rotate-45"
                  style={{
                    backgroundColor:
                      champion.accent,
                    boxShadow:
                      `0 0 14px ${champion.accent}`,
                  }}
                />

                <span className="h-px flex-1 bg-white/10" />
              </div>

              <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                <CertificateField
                  label="Athlete"
                  value={champion.name}
                  accent={champion.accent}
                  featured
                />

                <CertificateField
                  label="Nationality"
                  value={
                    champion.nationality
                  }
                />

                <CertificateField
                  label="Professional debut"
                  value={String(
                    champion.debutYear,
                  )}
                />

                <CertificateField
                  label="Primary brand"
                  value={
                    champion.mainBrand
                  }
                />

                <CertificateField
                  label="Archive pieces"
                  value={String(
                    champion.archivePieces,
                  )}
                />

                <CertificateField
                  label="Archive status"
                  value="Verified"
                  accent={champion.accent}
                />

                <CertificateField
                  label="Certificate ID"
                  value={
                    champion.certificateId
                  }
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
                        color:
                          champion.accent,
                      }}
                    >
                      AGE202 Verified
                    </p>
                  </div>

                  <div
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border bg-white/[0.025]"
                    style={{
                      borderColor:
                        `${champion.accent}70`,
                      boxShadow:
                        `0 0 30px ${champion.accent}15`,
                    }}
                  >
                    <VerificationMark
                      accent={
                        champion.accent
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="mt-12 flex flex-col gap-7 border-t border-white/10 pt-8 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div
                    className="h-px w-44"
                    style={{
                      background:
                        `linear-gradient(90deg, ${champion.accent}, transparent)`,
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
                    className="mt-2 break-words font-mono text-[10px] font-bold uppercase tracking-[0.16em]"
                    style={{
                      color:
                        champion.accent,
                    }}
                  >
                    {
                      champion.certificateId
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.article>

      <ChapterTransition
        chapterLabel="End of Museum Experience"
        title="One legend leads to another."
        description="Continue your journey through the AGE202 Digital Tennis Museum and discover the next champion."
        href="#next-champion"
        buttonLabel="Meet the Next Champion"
        accent={champion.accent}
      />
    </MuseumSection>
  );
}
