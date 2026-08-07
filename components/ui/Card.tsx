import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

type CardProps = {
  title: string;
  description: string;
  href?: string;
  badge?: string;
  icon?: ReactNode;
  status?: "open" | "coming-soon";
  accent?: string;
  className?: string;
  children?: ReactNode;
};

export default function Card({
  title,
  description,
  href,
  badge,
  icon,
  status = "open",
  accent = "#C8FF00",
  className = "",
  children,
}: CardProps) {
  const content = (
    <div
      className={`
        group relative overflow-hidden rounded-3xl
        border border-white/10
        bg-white/[0.02]
        p-8
        transition-all duration-500
        hover:-translate-y-1
        hover:border-white/20
        hover:bg-white/[0.04]
        ${className}
      `}
    >
      <div
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{
          background: accent,
        }}
      />

      {(badge || status) && (
        <div className="mb-6 flex items-center justify-between">
          {badge ? (
            <span
              className="text-[10px] font-bold uppercase tracking-[0.25em]"
              style={{
                color: accent,
              }}
            >
              {badge}
            </span>
          ) : (
            <span />
          )}

          <span
            className={`rounded-full border px-3 py-1 text-[9px] font-bold uppercase tracking-[0.18em] ${
              status === "open"
                ? "border-[#C8FF00]/40 text-[#C8FF00]"
                : "border-orange-500/30 text-orange-400"
            }`}
          >
            {status === "open"
              ? "Open"
              : "Coming Soon"}
          </span>
        </div>
      )}

      {icon && (
        <div
          className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{
            background: `${accent}15`,
            color: accent,
          }}
        >
          {icon}
        </div>
      )}

      <h3 className="text-3xl font-black text-white">
        {title}
      </h3>

      <p className="mt-4 leading-7 text-white/60">
        {description}
      </p>

      {children}

      {href && (
        <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-white transition-all duration-300 group-hover:gap-4">
          Explore
          <ArrowRight size={16} />
        </div>
      )}
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <Link
      href={href}
      className="block"
    >
      {content}
    </Link>
  );
}