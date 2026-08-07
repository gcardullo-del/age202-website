import type {
  ReactNode,
} from "react";

type MuseumPanelProps = {
  children: ReactNode;
  decoration?: ReactNode;
  footerDecoration?: ReactNode;
  className?: string;
  contentClassName?: string;
  radiusClassName?: string;
};

export default function MuseumPanel({
  children,
  decoration,
  footerDecoration,
  className = "",
  contentClassName = "",
  radiusClassName = "rounded-[30px]",
}: MuseumPanelProps) {
  return (
    <div
      className={[
        "group relative min-w-0 border border-white/10 bg-white/[0.025]",
        radiusClassName,
        className,
      ].join(" ")}
    >
      {decoration ? (
        <div
          aria-hidden="true"
          className={[
            "pointer-events-none absolute inset-0 overflow-hidden",
            radiusClassName,
          ].join(" ")}
        >
          {decoration}
        </div>
      ) : null}

      <div
        className={[
          "relative z-10 min-w-0",
          contentClassName,
        ].join(" ")}
      >
        {children}
      </div>

      {footerDecoration ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20"
        >
          {footerDecoration}
        </div>
      ) : null}
    </div>
  );
}