import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionHeaderProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  size?: "default" | "hero";
  className?: string;
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  size = "default",
  className,
}: SectionHeaderProps) {
  const centered = align === "center";

  return (
    <header
      className={cn(
        "flex flex-col gap-7",
        centered
          ? "mx-auto max-w-5xl items-center text-center"
          : "lg:flex-row lg:items-end lg:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-5xl", centered && "flex flex-col items-center")}>
        {eyebrow ? (
          <div className={cn("flex items-center gap-4", centered && "justify-center")}>
            <span className="h-px w-10 bg-[var(--age-lime)]" aria-hidden="true" />
            <p className="text-[9px] font-black uppercase tracking-[0.34em] text-[var(--age-lime)] sm:text-[10px]">
              {eyebrow}
            </p>
            {centered ? (
              <span className="h-px w-10 bg-[var(--age-lime)]" aria-hidden="true" />
            ) : null}
          </div>
        ) : null}

        <h2
          className={cn(
            "font-black leading-[0.96] tracking-[-0.055em] text-white",
            size === "hero"
              ? "text-5xl sm:text-7xl lg:text-8xl xl:text-9xl"
              : "text-4xl sm:text-5xl lg:text-7xl",
            eyebrow && "mt-6",
          )}
        >
          {title}
        </h2>
      </div>

      {description ? (
        <div
          className={cn(
            "max-w-lg text-sm leading-7 text-white/48 sm:text-base",
            centered ? "text-center" : "lg:text-right",
          )}
        >
          {description}
        </div>
      ) : null}
    </header>
  );
}
