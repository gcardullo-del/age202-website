import Link from "next/link";
import type {
  LucideIcon,
} from "lucide-react";
import {
  ArrowRight,
} from "lucide-react";

type AdminPageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  actionLabel?: string;
  actionHref?: string;
  actionIcon?: LucideIcon;
};

export default function AdminPageHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  actionLabel,
  actionHref,
  actionIcon: ActionIcon = ArrowRight,
}: AdminPageHeaderProps) {
  const hasAction =
    Boolean(
      actionLabel &&
        actionHref,
    );

  return (
    <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
      <div className="max-w-2xl">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-lime-200/70">
          <Icon
            className="h-4 w-4"
            aria-hidden="true"
          />
          {eyebrow}
        </div>

        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {title}
        </h2>

        <p className="mt-3 max-w-xl text-sm leading-6 text-white/45">
          {description}
        </p>
      </div>

      {hasAction ? (
        <Link
          href={actionHref!}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-lime-300 px-5 py-3.5 text-sm font-semibold text-[#050B18] transition hover:bg-lime-200 focus:outline-none focus:ring-2 focus:ring-lime-200/70 sm:w-auto"
        >
          <ActionIcon
            className="h-4 w-4"
            aria-hidden="true"
          />
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
