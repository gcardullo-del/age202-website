"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import {
  AccentLine,
  Divider,
  Label,
  MuseumButton,
} from "@/components/museum-ui";

import { vaultItems } from "@/data/vaultItems";

import VaultBadge from "./VaultBadge";

export default function VaultSpotlight() {
  const shouldReduceMotion = useReducedMotion();

  const featured =
    vaultItems.find((item) => item.featured) ??
    vaultItems[0];

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-[1840px] px-6 lg:px-10 xl:px-16">

        <motion.div
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 40,
                }
          }
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.8,
          }}
          className="overflow-hidden rounded-[36px] border border-white/10 bg-[#050B18]"
        >

          <div className="grid xl:grid-cols-[1.15fr_0.85fr]">

            <div className="relative min-h-[620px] overflow-hidden">

              <Image
                src={featured.image}
                alt={featured.title}
                fill
                priority
                sizes="100vw"
                className="object-cover transition duration-[1800ms] hover:scale-[1.03]"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-[#050B18]/15 via-transparent to-[#050B18]/75" />

              <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-transparent to-transparent" />

              <div
                className="absolute inset-x-[20%] bottom-[-15%] h-48 rounded-full blur-[100px]"
                style={{
                  backgroundColor: featured.accent,
                  opacity: .25,
                }}
              />

            </div>

            <div className="relative flex flex-col justify-center px-8 py-12 lg:px-14 xl:px-16">

              <div className="flex items-center gap-4">

                <AccentLine
                  color={featured.accent}
                />

                <Label color={featured.accent}>
                  Featured Archive Piece
                </Label>

              </div>

              <div className="mt-8">
                <VaultBadge rarity={featured.rarity} />
              </div>

              <h2 className="mt-10 text-[clamp(2.8rem,5vw,5rem)] font-black leading-[0.92] tracking-[-0.05em] text-white">
                {featured.title}
              </h2>

              <p className="mt-4 text-sm uppercase tracking-[0.25em] text-white/45">
                {featured.player}
              </p>

              <p className="mt-10 max-w-xl text-lg leading-9 text-white/55">
                {featured.description}
              </p>

              <Divider
                accent
                color={featured.accent}
                className="my-10"
              />

              <div className="grid grid-cols-3 gap-6">

                <SpotlightStat
                  label="Brand"
                  value={featured.brand}
                />

                <SpotlightStat
                  label="Season"
                  value={String(featured.year)}
                />

                <SpotlightStat
                  label="Collection"
                  value={featured.collection}
                />

              </div>

              <div className="mt-12 flex flex-wrap gap-4">

                <MuseumButton
                  href={`/vault/${featured.slug}`}
                  icon="→"
                >
                  Explore Piece
                </MuseumButton>

                <Link
                  href="/vault"
                  className="inline-flex items-center text-sm uppercase tracking-[0.22em] text-white/45 transition hover:text-white"
                >
                  View Entire Collection
                </Link>

              </div>

            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
}

type SpotlightStatProps = {
  label: string;
  value: string;
};

function SpotlightStat({
  label,
  value,
}: SpotlightStatProps) {
  return (
    <div>

      <p className="text-[8px] font-black uppercase tracking-[0.22em] text-white/25">
        {label}
      </p>

      <p className="mt-3 text-lg font-black uppercase text-white">
        {value}
      </p>

    </div>
  );
}