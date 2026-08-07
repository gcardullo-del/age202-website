import type {
  ElementType,
  ReactNode,
} from "react";

type MuseumCardProps<T extends ElementType = "div"> = {
  as?: T;
  children: ReactNode;
  accent?: string;
  className?: string;
  contentClassName?: string;
  radiusClassName?: string;
  hover?: boolean;
  glow?: boolean;
  decorativeNumber?: string;
};

export default function MuseumCard<
  T extends ElementType = "div",
>({
  as,
  children,
  accent,
  className = "",
  contentClassName = "",
  radiusClassName = "rounded-[30px]",
  hover = true,
  glow = true,
  decorativeNumber,
}: MuseumCardProps<T>) {
  const Component =
    as ?? "div";

  return (
    <Component
      className={[
        "group relative min-w-0 border border-white/10 bg-white/[0.025]",
        "transition-all duration-500",
        hover
          ? "hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.045]"
          : "",
        radiusClassName,
        className,
      ].join(" ")}
    >
      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-0 overflow-hidden",
          radiusClassName,
        ].join(" ")}
      >
        {glow && accent ? (
          <div
            className="absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-0 blur-[70px] transition-opacity duration-500 group-hover:opacity-[0.16]"
            style={{
              backgroundColor:
                accent,
            }}
          />
        ) : null}

        {decorativeNumber ? (
          <span className="absolute -bottom-7 -right-3 select-none text-[110px] font-black leading-none tracking-[-0.09em] text-white/[0.018] transition duration-500 group-hover:text-white/[0.035] sm:text-[140px]">
            {decorativeNumber}
          </span>
        ) : null}
      </div>

      <div
        className={[
          "relative z-10 min-w-0",
          contentClassName,
        ].join(" ")}
      >
        {children}
      </div>

      {accent ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px opacity-60"
          style={{
            background:
              `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          }}
        />
      ) : null}
    </Component>
  );
}