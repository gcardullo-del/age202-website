import Link from "next/link";

type ArchiveConnection = {
  slug: string;
  name: string;
  heroImage: string | null;
  country: string;
  ranking: number | null;
};

type RelatedPlayersProps = {
  playerName: string;
  archiveConnections: ArchiveConnection[];
};

export default function RelatedPlayers({
  playerName,
  archiveConnections,
}: RelatedPlayersProps) {
  return (
    <section
      id="related-players"
      className="scroll-mt-16 border-t border-white/10 px-5 py-20 sm:px-8 lg:px-12 lg:py-24"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#D7FF00]">
              Archive connections
            </p>

            <h2 className="mt-4 text-4xl font-black uppercase leading-[0.92] tracking-[-0.05em] sm:text-5xl">
              Continue exploring
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-white/42 sm:text-right">
            Move through the live ATP Archive and discover the players
            positioned around {playerName}.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {archiveConnections.map((connectedPlayer) => (
            <RelatedPlayerCard
              key={connectedPlayer.slug}
              player={connectedPlayer}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

type RelatedPlayerCardProps = {
  player: ArchiveConnection;
};

function RelatedPlayerCard({ player }: RelatedPlayerCardProps) {
  return (
    <Link
      href={`/players/${player.slug}`}
      className="group rounded-[1.75rem] border border-white/10 bg-[#08111F] p-6 transition hover:border-[#D7FF00]/35"
    >
      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#D7FF00]">
        {player.country}
      </p>

      <h3 className="mt-4 text-3xl font-black uppercase tracking-[-0.05em] transition group-hover:text-[#D7FF00]">
        {player.name}
      </h3>

      <p className="mt-6 font-mono text-[8px] uppercase tracking-[0.18em] text-white/35">
        {player.ranking ? `ATP #${player.ranking}` : "Former ATP Player"}
      </p>
    </Link>
  );
}