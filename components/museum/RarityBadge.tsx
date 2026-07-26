import type { ProductRarity } from "@/data/product.types";

const rarityStyles: Record<
  ProductRarity,
  { label: string; description: string; className: string }
> = {
  common: {
    label: "Archive",
    description: "Documented museum piece",
    className: "border-white/15 bg-white/[0.05] text-white/70",
  },
  rare: {
    label: "Rare",
    description: "Limited archive presence",
    className: "border-sky-300/30 bg-sky-300/10 text-sky-200",
  },
  "very-rare": {
    label: "Very Rare",
    description: "Exceptional collector relevance",
    className: "border-violet-300/30 bg-violet-300/10 text-violet-200",
  },
  legendary: {
    label: "Legendary",
    description: "Hall of Fame archive piece",
    className: "border-amber-300/35 bg-amber-300/10 text-amber-200",
  },
};

type RarityBadgeProps = {
  rarity: ProductRarity;
  compact?: boolean;
};

export default function RarityBadge({
  rarity,
  compact = false,
}: RarityBadgeProps) {
  const style = rarityStyles[rarity];

  return (
    <div
      className={`inline-flex items-center gap-3 rounded-full border backdrop-blur-xl ${style.className} ${
        compact ? "px-4 py-2" : "px-5 py-3"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current shadow-[0_0_14px_currentColor]" />

      <div>
        <p className="text-[9px] font-black uppercase tracking-[0.24em]">
          {style.label}
        </p>

        {!compact && (
          <p className="mt-1 text-[9px] font-semibold tracking-wide opacity-65">
            {style.description}
          </p>
        )}
      </div>
    </div>
  );
}
