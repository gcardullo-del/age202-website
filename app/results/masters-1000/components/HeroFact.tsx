type HeroFactProps = {
  value: string;
  label: string;
  index: number;
};

export default function HeroFact({
  value,
  label,
  index,
}: HeroFactProps) {
  return (
    <div className="flex min-h-[112px] items-center justify-between bg-[#071021]/94 px-6 py-5">
      <div>
        <span className="block text-2xl font-black uppercase tracking-[-0.045em]">
          {value}
        </span>

        <span className="mt-2 block font-mono text-[7px] uppercase tracking-[0.18em] text-white/36">
          {label}
        </span>
      </div>

      <span className="font-mono text-[8px] font-black text-[#55C9FF]">
        0{index}
      </span>
    </div>
  );
}
