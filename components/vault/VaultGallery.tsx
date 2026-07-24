"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import {
  Divider,
  Label,
  SectionHeader,
  SectionNumber,
} from "@/components/museum-ui";

import {
  vaultItems,
  type VaultItem,
} from "@/data/vaultItems";

import VaultCard from "./VaultCard";

const filters = [
  "All",
  "Roger Federer",
  "Rafael Nadal",
  "Novak Djokovic",
  "Jannik Sinner",
  "Carlos Alcaraz",
];

export default function VaultGallery() {
  const [selectedFilter, setSelectedFilter] =
    useState("All");

  const items = useMemo(() => {
    if (selectedFilter === "All") {
      return vaultItems;
    }

    return vaultItems.filter(
      (item) => item.player === selectedFilter
    );
  }, [selectedFilter]);

  return (
    <section className="relative overflow-hidden py-32">
      <SectionNumber
        value={5}
        className="top-8"
      />

      <div className="mx-auto max-w-[1840px] px-6 lg:px-10 xl:px-16">
        <div className="max-w-3xl">
          <Label
            color="#C8FF00"
            dot
          >
            Museum Vault
          </Label>

          <SectionHeader
            title="Archive Collection"
            subtitle="Every piece tells part of tennis history. Discover iconic garments carefully selected for the AGE202 digital museum."
            className="mt-6"
          />

          <Divider
            accent
            className="mt-10"
          />
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          {filters.map((filter) => {
            const active =
              selectedFilter === filter;

            return (
              <button
                key={filter}
                onClick={() =>
                  setSelectedFilter(filter)
                }
                className={[
                  "rounded-full border px-5 py-3",
                  "text-xs font-bold uppercase tracking-[0.18em]",
                  "transition-all duration-300",
                  active
                    ? "border-white/20 bg-white/10 text-white"
                    : "border-white/10 text-white/45 hover:border-white/20 hover:bg-white/[0.04] hover:text-white",
                ].join(" ")}
              >
                {filter}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedFilter}
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -20,
            }}
            transition={{
              duration: 0.45,
            }}
            className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3"
          >
            {items.map(
              (
                item: VaultItem,
                index: number
              ) => (
                <VaultCard
                  key={item.id}
                  item={item}
                  index={index}
                  priority={index < 3}
                />
              )
            )}
          </motion.div>
        </AnimatePresence>

        {items.length === 0 && (
          <div className="mt-20 rounded-3xl border border-white/10 bg-white/[0.02] py-20 text-center">
            <p className="text-lg text-white/60">
              No archive pieces available.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}