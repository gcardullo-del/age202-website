import { Trophy } from "lucide-react";

type StatCardProps = {
  icon: typeof Trophy;
  value: number;
  label: string;
};

export default function StatCard({
  icon: Icon,
  value,
  label,
}: StatCardProps) {
  return (
    <div className="flex min-h-[104px] items-center justify-between bg-[#071021]/92 px-5 py-5 sm:px-6">
      <div>
        <span className="block text-2xl font-black tracking-[-0.04em] sm:text-3xl">
          {String(value).padStart(2, "0")}
        </span>

        <span className="mt-2 block font-mono text-[7px] uppercase tracking-[0.18em] text-white/38 sm:text-[8px]">
          {label}
        </span>
      </div>

      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#D7FF00]/18 bg-[#D7FF00]/10 text-[#D7FF00]">
        <Icon
          size={17}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}