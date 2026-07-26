import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";
import MuseumContainer from "./MuseumContainer";

type MuseumSectionProps = {
  children: ReactNode;
  as?: ElementType;
  id?: string;
  container?: "reading" | "content" | "wide" | false;
  tone?: "default" | "deep" | "elevated";
  className?: string;
  containerClassName?: string;
};

const toneClasses = {
  default: "bg-transparent",
  deep: "bg-[var(--age-bg-deep)]",
  elevated: "bg-[var(--age-bg-elevated)]",
};

export default function MuseumSection({
  children,
  as: Component = "section",
  id,
  container = "content",
  tone = "default",
  className,
  containerClassName,
}: MuseumSectionProps) {
  const content = container ? (
    <MuseumContainer size={container} className={containerClassName}>
      {children}
    </MuseumContainer>
  ) : (
    children
  );

  return (
    <Component
      id={id}
      className={cn(
        "relative scroll-mt-28 py-20 sm:py-24 lg:py-32",
        toneClasses[tone],
        className,
      )}
    >
      {content}
    </Component>
  );
}
