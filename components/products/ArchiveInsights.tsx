type Props = {
  year: number;
  tournament: string;
  player: string;
  collection: string;
  archiveNumber: string;
  rarity: string;
  curatorNote: string;
};

export default function ArchiveInsights({
  year,
  tournament,
  player,
  collection,
  archiveNumber,
  rarity,
  curatorNote,
}: Props) {
  return (
    <section className="card p-10">

      <span className="badge">
        Archive Insights
      </span>

      <h2 className="mt-6 text-3xl font-black">
        Curator Information
      </h2>

      <div className="mt-10 grid gap-6 md:grid-cols-2">

        <Info title="Archive Number" value={archiveNumber} />

        <Info title="Player" value={player} />

        <Info title="Tournament" value={tournament} />

        <Info title="Collection" value={collection} />

        <Info title="Year" value={year.toString()} />

        <Info title="Rarity" value={rarity} />

      </div>

      <div className="mt-12 rounded-[24px] border border-white/10 bg-[#08101F] p-8">

        <div className="text-sm font-bold uppercase tracking-[0.25em] text-[#C8FF00]">
          Curator&apos;s Note
        </div>

        <p className="mt-5 text-lg leading-8 text-gray-300 italic">
          &ldquo;{curatorNote}&rdquo;
        </p>

      </div>

    </section>
  );
}

function Info({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div>

      <div className="text-xs uppercase tracking-[0.25em] text-gray-500">
        {title}
      </div>

      <div className="mt-2 text-xl font-bold">
        {value}
      </div>

    </div>
  );
}