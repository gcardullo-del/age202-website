import type { ReactNode } from "react";

type SectionHeaderProps = {
  eyebrow?: string;
  title: ReactNode;

  /**
   * Testo descrittivo principale.
   */
  description?: ReactNode;

  /**
   * Alias compatibile con i componenti che utilizzano
   * la proprietà "subtitle".
   */
  subtitle?: ReactNode;

  align?: "left" | "center";
  className?: string;
  accent?: string;
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
  subtitle,
  align = "left",
  className = "",
  accent = "#C8FF00",
}: SectionHeaderProps) {
  const isCentered = align === "center";

  const supportingText =
    description ?? subtitle;

  return (
    <header
      className={[
        "flex flex-col gap-7",
        isCentered
          ? "mx-auto items-center text-center"
          : "lg:flex-row lg:items-end lg:justify-between",
        className,
      ].join(" ")}
    >
      <div
        className={
          isCentered
            ? "flex max-w-4xl flex-col items-center"
            : "max-w-4xl"
        }
      >
        {eyebrow && (
          <div
            className={[
              "flex items-center gap-4",
              isCentered ? "justify-center" : "",
            ].join(" ")}
          >
            <span
              className="h-px w-10"
              style={{
                backgroundColor: accent,
              }}
            />

            <p
              className="text-[10px] font-black uppercase tracking-[0.34em]"
              style={{
                color: accent,
              }}
            >
              {eyebrow}
            </p>

            {isCentered && (
              <span
                className="h-px w-10"
                style={{
                  backgroundColor: accent,
                }}
              />
            )}
          </div>
        )}

        <h2
          className={[
            "text-4xl font-black leading-[0.98]",
            "tracking-[-0.05em] text-white",
            "sm:text-5xl lg:text-7xl",
            eyebrow ? "mt-6" : "",
          ].join(" ")}
        >
          {title}
        </h2>
      </div>

      {supportingText && (
        <div
          className={[
            "max-w-md text-sm leading-7 text-gray-500",
            isCentered
              ? "text-center"
              : "lg:text-right",
          ].join(" ")}
        >
          {supportingText}
        </div>
      )}
    </header>
  );
}