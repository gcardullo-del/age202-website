import { cn } from "@/lib/cn";

type ArchiveNumberProps = {
  value: string;
  label?: string;
  className?: string;
};

export default function ArchiveNumber({
  value,
  label = "Archive ID",
  className,
}: ArchiveNumberProps) {
  return (
    <div className={cn("inline-flex flex-col gap-1", className)}>
      <span className="text-[8px] font-black uppercase tracking-[0.28em] text-white/35">
        {label}
      </span>
      <span className="font-mono text-sm font-bold tracking-[0.08em] text-white">
        {value}
      </span>
    </div>
  );
}
