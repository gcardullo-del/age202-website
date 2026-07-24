import Link from "next/link";
import { Archive, Plus } from "lucide-react";

type AdminEmptyStateProps = {
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
};

export default function AdminEmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: AdminEmptyStateProps) {
  return (
    <div className="px-6 py-20 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04] text-white/45">
        <Archive className="h-7 w-7" aria-hidden="true" />
      </div>

      <h2 className="mt-6 text-2xl font-semibold tracking-tight text-white">
        {title}
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/45">
        {description}
      </p>

      <Link
        href={actionHref}
        className="mt-7 inline-flex items-center justify-center gap-2 rounded-2xl bg-lime-300 px-5 py-3 text-sm font-semibold text-[#050B18] transition hover:bg-lime-200 focus:outline-none focus:ring-2 focus:ring-lime-200/70"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        {actionLabel}
      </Link>
    </div>
  );
}
