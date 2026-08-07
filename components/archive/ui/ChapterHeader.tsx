import type {
  ReactNode,
} from "react";

type ChapterHeaderProps = {
  chapter: string;
  title: ReactNode;
  subtitle?: ReactNode;
  accent: string;
  align?: "left" | "center";
  aside?: ReactNode;
  className?: string;
};

export default function ChapterHeader({
  chapter,
  title,
  subtitle,
  accent,
  align = "left",
  aside,
  className = "",
}: ChapterHeaderProps) {
  const isCentered =
    align === "center";

  return (
    <header
      className={[
        aside
          ? "grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end lg:gap-16"
          : "",
        className,
      ].join(" ")}
    >
      <div
        className={[
          "max-w-5xl",
          isCentered
            ? "mx-auto text-center"
            : "",
        ].join(" ")}
      >
        <div
          className={[
            "flex items-center gap-4",
            isCentered
              ? "justify-center"
              : "",
          ].join(" ")}
        >
          <span
            aria-hidden="true"
            className="h-px w-10 sm:w-14"
            style={{
              backgroundColor:
                accent,
              boxShadow:
                `0 0 14px ${accent}`,
            }}
          />

          <p
            className="text-[10px] font-black uppercase tracking-[0.32em]"
            style={{
              color: accent,
            }}
          >
            {chapter}
          </p>

          {isCentered ? (
            <span
              aria-hidden="true"
              className="h-px w-10 sm:w-14"
              style={{
                backgroundColor:
                  accent,
                boxShadow:
                  `0 0 14px ${accent}`,
              }}
            />
          ) : null}
        </div>

        <h2 className="mt-6 text-5xl font-black leading-[0.92] tracking-[-0.055em] text-white sm:text-6xl lg:text-8xl">
          {title}
        </h2>

        {subtitle ? (
          <div
            className={[
              "mt-8 max-w-3xl text-base leading-8 text-white/45 sm:text-lg sm:leading-9",
              isCentered
                ? "mx-auto"
                : "",
            ].join(" ")}
          >
            {subtitle}
          </div>
        ) : null}
      </div>

      {aside ? (
        <div
          className={[
            "lg:pb-2",
            isCentered
              ? "text-center"
              : "lg:text-right",
          ].join(" ")}
        >
          {aside}
        </div>
      ) : null}
    </header>
  );
}