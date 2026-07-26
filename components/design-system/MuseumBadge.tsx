import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type MuseumBadgeProps = {
  children: ReactNode;
  tone?: "lime" | "neutral" | "success" | "warning" | "danger";
  size?: "small" | "default";
  className?: string;
};

const toneClasses = {
  lime: "border-[var(--age-lime)]/35 bg-[var(--age-lime)]/10 text-[var(--age-lime)]",
  neutral: "border-white/10 bg-white/[0.035] text-white/65",
  success: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  warning: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  danger: "border-red-400/30 bg-red-400/10 text-red-300",
};

const sizeClasses = {
  small: "min-h-7 px-3 text-[8px] tracking-[0.2em]",
  default: "min-h-9 px-4 text-[9px] tracking-[0.24em]",
};

export default function MuseumBadge({
  children,
  tone = "lime",
  size = "default",
  className,
}: MuseumBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full border font-black uppercase",
        toneClasses[tone],
        sizeClasses[size],
        className,
      )}
    >
      {children}
    </span>
  );
}
