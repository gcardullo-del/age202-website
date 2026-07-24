import type {
  ElementType,
  ReactNode,
} from "react";

type MuseumPanelProps = {
  children: ReactNode;
  as?: ElementType;
  hover?: boolean;
  className?: string;
};

export default function MuseumPanel({
  children,
  as: Component = "div",
  hover = false,
  className = "",
}: MuseumPanelProps) {
  return (
    <Component
      className={[
        "relative overflow-hidden rounded-[32px]",
        "border border-white/10",
        "bg-[#08101F]/80 backdrop-blur-xl",
        "shadow-[0_30px_100px_rgba(0,0,0,0.3)]",
        hover
          ? "transition duration-500 hover:-translate-y-1 hover:border-[#C8FF00]/25 hover:shadow-[0_35px_110px_rgba(0,0,0,0.42)]"
          : "",
        className,
      ].join(" ")}
    >
      {children}
    </Component>
  );
}