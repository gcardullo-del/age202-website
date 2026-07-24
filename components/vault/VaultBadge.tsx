"use client";

import { motion } from "framer-motion";

import type { VaultRarity } from "@/data/vaultItems";

type VaultBadgeProps = {
  rarity: VaultRarity;
  className?: string;
};

const rarityStyles: Record<
  VaultRarity,
  {
    color: string;
    bg: string;
    border: string;
    glow: string;
  }
> = {
  Common: {
    color: "#D5D7DA",
    bg: "rgba(255,255,255,0.06)",
    border: "rgba(255,255,255,0.10)",
    glow: "rgba(255,255,255,0.18)",
  },

  Rare: {
    color: "#5CB8FF",
    bg: "rgba(92,184,255,0.12)",
    border: "rgba(92,184,255,0.28)",
    glow: "rgba(92,184,255,0.45)",
  },

  "Match Worn": {
    color: "#89F38D",
    bg: "rgba(137,243,141,0.12)",
    border: "rgba(137,243,141,0.28)",
    glow: "rgba(137,243,141,0.45)",
  },

  Signed: {
    color: "#D88CFF",
    bg: "rgba(216,140,255,0.12)",
    border: "rgba(216,140,255,0.28)",
    glow: "rgba(216,140,255,0.45)",
  },

  Prototype: {
    color: "#FFB454",
    bg: "rgba(255,180,84,0.12)",
    border: "rgba(255,180,84,0.28)",
    glow: "rgba(255,180,84,0.45)",
  },
};

export default function VaultBadge({
  rarity,
  className = "",
}: VaultBadgeProps) {
  const style = rarityStyles[rarity];

  return (
    <motion.div
      whileHover={{
        scale: 1.04,
      }}
      transition={{
        duration: 0.2,
      }}
      className={[
        "inline-flex items-center gap-2",
        "rounded-full border",
        "px-3 py-1.5",
        "backdrop-blur-xl",
        className,
      ].join(" ")}
      style={{
        background: style.bg,
        borderColor: style.border,
        boxShadow: `0 0 18px ${style.glow}`,
      }}
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{
          backgroundColor: style.color,
          boxShadow: `0 0 10px ${style.color}`,
        }}
      />

      <span
        className="text-[10px] font-bold uppercase tracking-[0.18em]"
        style={{
          color: style.color,
        }}
      >
        {rarity}
      </span>
    </motion.div>
  );
}