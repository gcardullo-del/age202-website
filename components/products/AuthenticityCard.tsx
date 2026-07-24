type Props = {
  code: string;
  player: string;
  brand: string;
  tournament: string;
  year: number;
  condition: string;
};

export default function AuthenticityCard({
  code,
  player,
  brand,
  tournament,
  year,
  condition,
}: Props) {
  return (
    <section className="overflow-hidden rounded-[32px] border border-[#C8FF00]/20 bg-gradient-to-br from-[#0D1628] to-[#08101F]">

      {/* Header */}
      <div className="border-b border-white/10 p-8">

        <span className="text-xs font-bold uppercase tracking-[0.45em] text-[#C8FF00]">
          AGE202
        </span>

        <h3 className="mt-4 text-3xl font-black text-white">
          Archive Certificate
        </h3>

        <div className="mt-6 inline-flex rounded-full border border-[#C8FF00]/30 bg-[#C8FF00]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-[#C8FF00]">
          ✓ Verified Archive Piece
        </div>

      </div>

      {/* Body */}
      <div className="space-y-6 p-8">

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
            Archive Code
          </p>

          <p className="mt-2 font-mono text-lg font-bold text-[#C8FF00]">
            {code}
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">

          <Info label="Player" value={player} />

          <Info label="Brand" value={brand} />

          <Info label="Tournament" value={tournament} />

          <Info label="Year" value={String(year)} />

          <Info label="Condition" value={condition} />

        </div>

      </div>

      {/* Footer */}
      <div className="border-t border-white/10 bg-white/5 px-8 py-6">

        <p className="text-sm leading-7 text-gray-400">
          Every piece archived by <span className="font-semibold text-white">AGE202</span> is individually documented and catalogued to preserve its history and collectability.
        </p>

      </div>

    </section>
  );
}

type InfoProps = {
  label: string;
  value: string;
};

function Info({ label, value }: InfoProps) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.25em] text-gray-500">
        {label}
      </p>

      <p className="mt-2 text-lg font-semibold text-white">
        {value}
      </p>
    </div>
  );
}