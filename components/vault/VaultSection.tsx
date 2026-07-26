"use client";

import { memo } from "react";
import {
  motion,
  useReducedMotion,
} from "framer-motion";
import Image from "next/image";
import type { CSSProperties } from "react";

import MuseumButton from "@/components/ui/MuseumButton";
import { products } from "@/data/products";
import { age202Theme } from "@/lib/theme";

const vaultPiece =
  products.find((product) => product.featured) ??
  products.find(
    (product) => product.rarity === "legendary",
  ) ??
  products[0];

const vaultTheme = {
  "--vault-background":
    age202Theme.colors.background.primary,
  "--vault-accent":
    age202Theme.colors.brand.lime,
  "--vault-panel": "#08101F",
} as CSSProperties;

function VaultSection() {
  const shouldReduceMotion = useReducedMotion();

  if (!vaultPiece) {
    return null;
  }

  return (
    <section
      aria-labelledby="vault-heading"
      style={vaultTheme}
      className="relative overflow-hidden border-y border-white/10 bg-[var(--vault-background)] py-24 sm:py-28 lg:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[color:var(--vault-accent)]/[0.045] blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.65) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.65) 1px, transparent 1px)",
            backgroundSize: "96px 96px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <header className="mx-auto mb-14 max-w-3xl text-center lg:mb-16">
          <div className="flex items-center justify-center gap-4">
            <span
              aria-hidden="true"
              className="h-px w-10 bg-[var(--vault-accent)]"
            />

            <p className="text-[10px] font-black uppercase tracking-[0.34em] text-[var(--vault-accent)]">
              The Vault
            </p>

            <span
              aria-hidden="true"
              className="h-px w-10 bg-[var(--vault-accent)]"
            />
          </div>

          <h2
            id="vault-heading"
            className="mt-6 text-4xl font-black tracking-[-0.045em] text-white sm:text-5xl lg:text-7xl"
          >
            Rare tennis treasures
            <span className="block text-white/25">
              preserved beyond the match.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base sm:leading-8">
            The rarest authenticated pieces preserved in the AGE202 Digital
            Archive. Each item represents a defining moment in modern tennis
            history.
          </p>
        </header>

        <motion.article
          aria-labelledby="vault-piece-title"
          whileHover={
            shouldReduceMotion
              ? undefined
              : { y: -6 }
          }
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : {
                  duration: 0.35,
                  ease: [0.22, 1, 0.36, 1],
                }
          }
          className="group overflow-hidden rounded-[32px] border border-white/10 bg-[var(--vault-panel)] shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:rounded-[36px]"
        >
          <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
            <div className="relative min-h-[440px] overflow-hidden sm:min-h-[540px] lg:min-h-[680px]">
              <Image
                src={vaultPiece.image}
                alt={`${vaultPiece.title} — ${vaultPiece.brand}`}
                fill
                sizes="(max-width: 1024px) 100vw, 54vw"
                className={[
                  "object-cover object-center",
                  shouldReduceMotion
                    ? ""
                    : "transition-transform duration-1000 group-hover:scale-[1.035]",
                ].join(" ")}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[var(--vault-background)] via-transparent to-black/20 lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[var(--vault-panel)]" />

              <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[var(--vault-background)] to-transparent lg:hidden" />

              <div className="absolute left-6 top-6 flex flex-wrap gap-3 sm:left-8 sm:top-8">
                <span className="inline-flex rounded-full border border-[color:var(--vault-accent)]/30 bg-[color:var(--vault-accent)]/10 px-4 py-2 text-[8px] font-black uppercase tracking-[0.22em] text-[var(--vault-accent)] backdrop-blur-md">
                  ★ Legendary Archive
                </span>

                <span className="inline-flex rounded-full border border-white/15 bg-black/20 px-4 py-2 text-[8px] font-black uppercase tracking-[0.22em] text-white backdrop-blur-md">
                  Curator selection
                </span>
              </div>
            </div>

            <div className="relative flex flex-col justify-center px-7 py-14 sm:px-10 lg:px-14 lg:py-20">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute right-0 top-0 text-[150px] font-black leading-none text-white/[0.018] sm:text-[210px]"
              >
                V
              </div>

              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--vault-accent)]">
                  Legendary Archive
                </p>

                <h3
                  id="vault-piece-title"
                  className="mt-6 max-w-xl text-4xl font-black leading-[0.96] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl"
                >
                  {vaultPiece.title}
                </h3>

                <div className="mt-7 flex flex-wrap gap-x-7 gap-y-4">
                  <MetadataItem
                    label="Brand"
                    value={vaultPiece.brand}
                  />

                  <MetadataItem
                    label="Tournament"
                    value={vaultPiece.tournament}
                  />

                  <MetadataItem
                    label="Year"
                    value={String(vaultPiece.year)}
                  />
                </div>

                <div
                  aria-hidden="true"
                  className="my-9 h-px bg-gradient-to-r from-white/15 to-transparent"
                />

                <p className="max-w-xl text-sm leading-7 text-gray-400 sm:text-base sm:leading-8">
                  {vaultPiece.story}
                </p>

                <div className="mt-10 flex flex-col gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.28em] text-gray-600">
                      Museum classification
                    </p>

                    <p className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white sm:text-3xl">
                      Legendary Archive
                    </p>
                  </div>

                  <MuseumButton
                    href={`/product/${vaultPiece.id}`}
                    aria-label={`Explore ${vaultPiece.title}`}
                    icon="→"
                  >
                    Explore archive
                  </MuseumButton>
                </div>
              </div>
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  );
}

type MetadataItemProps = {
  label: string;
  value: string;
};

function MetadataItem({
  label,
  value,
}: MetadataItemProps) {
  return (
    <div>
      <p className="text-[8px] font-black uppercase tracking-[0.24em] text-gray-600">
        {label}
      </p>

      <p
        title={value}
        className="mt-2 text-xs font-bold uppercase tracking-[0.13em] text-white"
      >
        {value}
      </p>
    </div>
  );
}

export default memo(VaultSection);