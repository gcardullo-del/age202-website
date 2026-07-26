import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

type RarityStarsProps = {
  value: number;
  max?: number;
  label?: string;
  className?: string;
};

export default function RarityStars({
  value,
  max = 5,
  label = "Rarità",
  className,
}: RarityStarsProps) {
  const normalizedValue = Math.max(0, Math.min(value, max));

  return (
    <div
      className={cn("inline-flex items-center gap-2", className)}
      aria-label={`${label}: ${normalizedValue} su ${max}`}
    >
      <div className="flex gap-1" aria-hidden="true">
        {Array.from({ length: max }, (_, index) => {
          const active = index < normalizedValue;
          return (
            <Star
              key={index}
              className={cn(
                "h-3.5 w-3.5",
                active
                  ? "fill-[var(--age-lime)] text-[var(--age-lime)]"
                  : "text-white/15",
              )}
            />
          );
        })}
      </div>
      <span className="text-[8px] font-black uppercase tracking-[0.22em] text-white/35">
        {label}
      </span>
    </div>
  );
}
