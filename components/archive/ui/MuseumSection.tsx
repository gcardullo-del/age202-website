import type {
  ElementType,
  ReactNode,
} from "react";

type MuseumSectionProps<T extends ElementType = "section"> = {
  as?: T;
  id?: string;
  children: ReactNode;
  accent?: string;
  className?: string;
  containerClassName?: string;
  withGrid?: boolean;
  withGlow?: boolean;
  scrollMarginClassName?: string;
};

export default function MuseumSection<
  T extends ElementType = "section",
>({
  as,
  id,
  children,
  accent,
  className = "",
  containerClassName = "",
  withGrid = true,
  withGlow = true,
  scrollMarginClassName = "scroll-mt-20",
}: MuseumSectionProps<T>) {
  const Component =
    as ?? "section";

  return (
    <Component
      id={id}
      className={[
        "relative overflow-hidden border-y border-white/[0.07]",
        "bg-[#050b18] px-6 py-24 sm:px-8 sm:py-28 lg:px-12 lg:py-36",
        scrollMarginClassName,
        className,
      ].join(" ")}
    >
      {withGrid ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.65) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.65) 1px, transparent 1px)",
            backgroundSize:
              "88px 88px",
          }}
        />
      ) : null}

      {withGlow && accent ? (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-44 top-24 h-[440px] w-[440px] rounded-full opacity-[0.08] blur-[155px]"
            style={{
              backgroundColor:
                accent,
            }}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-52 bottom-[-120px] h-[560px] w-[560px] rounded-full opacity-[0.06] blur-[180px]"
            style={{
              backgroundColor:
                accent,
            }}
          />
        </>
      ) : null}

      <div
        className={[
          "relative mx-auto w-full max-w-[1440px] min-w-0",
          containerClassName,
        ].join(" ")}
      >
        {children}
      </div>
    </Component>
  );
}