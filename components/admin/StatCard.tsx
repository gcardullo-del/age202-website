import { ArrowUpRight, LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: number | string;
  icon: LucideIcon;
  accent?: "lime" | "blue" | "purple" | "orange";
  subtitle?: string;
};

const accents = {
  lime: {
    border: "border-lime-300/20",
    bg: "bg-lime-300/10",
    icon: "bg-lime-300 text-[#050B18]",
    glow: "shadow-[0_0_30px_rgba(190,242,100,0.15)]",
  },
  blue: {
    border: "border-cyan-400/20",
    bg: "bg-cyan-400/10",
    icon: "bg-cyan-400 text-[#050B18]",
    glow: "shadow-[0_0_30px_rgba(34,211,238,0.15)]",
  },
  purple: {
    border: "border-violet-400/20",
    bg: "bg-violet-400/10",
    icon: "bg-violet-400 text-white",
    glow: "shadow-[0_0_30px_rgba(167,139,250,0.15)]",
  },
  orange: {
    border: "border-orange-400/20",
    bg: "bg-orange-400/10",
    icon: "bg-orange-400 text-[#050B18]",
    glow: "shadow-[0_0_30px_rgba(251,146,60,0.15)]",
  },
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  accent = "lime",
  subtitle,
}: StatCardProps) {
  const theme = accents[accent];

  return (
    <div
      className={`group rounded-3xl border ${theme.border} ${theme.bg} ${theme.glow} transition-all duration-300 hover:-translate-y-1`}
    >
      <div className="p-6">

        <div className="flex items-start justify-between">

          <div>

            <p className="text-sm font-medium text-white/45">
              {title}
            </p>

            <h2 className="mt-3 text-5xl font-bold tracking-tight text-white">
              {value}
            </h2>

            {subtitle && (
              <p className="mt-2 text-sm text-white/35">
                {subtitle}
              </p>
            )}

          </div>

          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${theme.icon}`}
          >
            <Icon size={22} />
          </div>

        </div>

        <div className="mt-6 flex items-center gap-2 text-sm text-white/40 transition-colors group-hover:text-white/70">
          <ArrowUpRight size={16} />
          Live data
        </div>

      </div>
    </div>
  );
}