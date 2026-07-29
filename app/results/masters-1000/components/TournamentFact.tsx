type TournamentFactProps = {
  label: string;
  value: string;
};

export default function TournamentFact({
  label,
  value,
}: TournamentFactProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/15 px-4 py-4">
      <span className="block font-mono text-[7px] uppercase tracking-[0.16em] text-white/25">
        {label}
      </span>

      <span className="mt-2 block text-[10px] font-black uppercase leading-5 text-white/62">
        {value}
      </span>
    </div>
  );
}
