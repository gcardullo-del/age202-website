import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type MuseumCardProps = {
  children: ReactNode;
  as?: ElementType;
  interactive?: boolean;
  accent?: boolean;
  padding?: "none" | "small" | "default" | "large";
  className?: string;
};

const paddingClasses = {
  none: "",
  small: "p-5",
  default: "p-7 sm:p-8",
  large: "p-8 sm:p-10 lg:p-12",
};

export default function MuseumCard({
  children,
  as: Component = "div",
  interactive = false,
  accent = false,
  padding = "default",
  className,
}: MuseumCardProps) {
  return (
    <Component
      className={cn(
        "group relative isolate overflow-hidden rounded-[var(--age-radius-large)] border border-white/10 bg-white/[0.025] shadow-[var(--age-shadow-card)] backdrop-blur-xl",
        "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
        interactive &&
          "transition duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.045] hover:shadow-[var(--age-shadow-floating)]",
        accent &&
          "after:pointer-events-none after:absolute after:-right-20 after:-top-20 after:h-52 after:w-52 after:rounded-full after:bg-[var(--age-lime)]/10 after:blur-[90px]",
        paddingClasses[padding],
        className,
      )}
    >
      <div className="relative z-10">{children}</div>
    </Component>
  );
}
