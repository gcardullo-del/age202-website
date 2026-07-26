import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type MuseumContainerProps = {
  children: ReactNode;
  as?: ElementType;
  size?: "reading" | "content" | "wide";
  className?: string;
};

const sizeClasses = {
  reading: "max-w-[850px]",
  content: "max-w-[1480px]",
  wide: "max-w-[1700px]",
};

export default function MuseumContainer({
  children,
  as: Component = "div",
  size = "content",
  className,
}: MuseumContainerProps) {
  return (
    <Component
      className={cn(
        "mx-auto w-full px-5 sm:px-8 lg:px-12",
        sizeClasses[size],
        className,
      )}
    >
      {children}
    </Component>
  );
}
