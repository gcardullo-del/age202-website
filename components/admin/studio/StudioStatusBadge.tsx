type StudioStatus =
  | "draft"
  | "published"
  | "active"
  | "inactive"
  | "verified"
  | "sold"
  | "archived";

type StudioStatusBadgeProps = {
  status: StudioStatus;
};

const styles = {
  draft:
    "border-white/10 bg-white/5 text-white/65",

  published:
    "border-lime-300/20 bg-lime-300/10 text-lime-200",

  active:
    "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",

  inactive:
    "border-orange-400/20 bg-orange-400/10 text-orange-300",

  verified:
    "border-sky-400/20 bg-sky-400/10 text-sky-300",

  sold:
    "border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-300",

  archived:
    "border-red-400/20 bg-red-400/10 text-red-300",
};

const labels = {
  draft: "Draft",

  published: "Published",

  active: "Active",

  inactive: "Inactive",

  verified: "Verified",

  sold: "Sold",

  archived: "Archived",
};

export default function StudioStatusBadge({
  status,
}: StudioStatusBadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em]",
        styles[status],
      ].join(" ")}
    >
      {labels[status]}
    </span>
  );
}