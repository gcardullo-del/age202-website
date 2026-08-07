import type {
  ReactNode,
} from "react";

type MuseumHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  accent: string;
  aside?: ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

export default function MuseumHeading({
  eyebrow,
  title,
  description,
  accent,
  aside,
  className = "",
  titleClassName = "",
  descriptionClassName = "",
}: MuseumHeadingProps) {
  return (
    <header
      className={[
        "grid min-w-0 gap-10",
        aside
          ? "lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end lg:gap-16"
          : "",
        className,
      ].join(" ")}
    >
      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-4">
          <span
            aria-hidden="true"
            className="h-px w-10 shrink-0 sm:w-14"
            style={{
              backgroundColor:
                accent,

              boxShadow:
                `0 0 14px ${accent}`,
            }}
          />

          <p
            className="min-w-0 break-words py-1 text-[10px] font-black uppercase leading-[1.7] tracking-[0.28em]"
            style={{
              color:
                accent,
            }}
          >
            {eyebrow}
          </p>
        </div>

        <h2
          className={[
            "mt-6 min-w-0 max-w-5xl break-words text-5xl font-black leading-[0.92] tracking-[-0.055em] text-white sm:text-6xl lg:text-8xl",
            titleClassName,
          ].join(" ")}
        >
          {title}
        </h2>

        {description ? (
          <div
            className={[
              "mt-7 max-w-2xl break-words text-base leading-8 text-white/45 sm:text-lg sm:leading-9",
              descriptionClassName,
            ].join(" ")}
          >
            {description}
          </div>
        ) : null}
      </div>

      {aside ? (
        <div className="min-w-0 lg:pb-2">
          {aside}
        </div>
      ) : null}
    </header>
  );
}