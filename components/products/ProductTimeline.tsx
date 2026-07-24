type Props = {
  year: number;
  tournament: string;
  collection: string;
  playerName: string;
  archiveNumber: string;
};

export default function ProductTimeline({
  year,
  tournament,
  collection,
  playerName,
  archiveNumber,
}: Props) {
  const timeline = [
    {
      label: String(year),
      title: "Collection Release",
      description: `${collection} enters the official tennis apparel season.`,
    },
    {
      label: String(year),
      title: "Tournament Era",
      description: `${playerName} competes during the ${tournament} period associated with this collection.`,
    },
    {
      label: "Archive",
      title: "Piece Preserved",
      description:
        "The garment is selected, documented and preserved as part of the AGE202 archive.",
    },
    {
      label: archiveNumber,
      title: "Digital Registration",
      description:
        "A unique archive number and authenticity reference are assigned to the piece.",
    },
  ];

  return (
    <section className="border-y border-white/10 bg-[#08101F] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="grid gap-14 lg:grid-cols-[0.7fr_1.3fr]">
          {/* INTRO */}

          <div>
            <p className="text-sm font-black uppercase tracking-[0.4em] text-[#C8FF00]">
              Archive Timeline
            </p>

            <h2 className="mt-5 text-4xl font-black leading-tight text-white md:text-6xl">
              From the court
              <br />
              to the archive.
            </h2>

            <p className="mt-7 max-w-lg text-lg leading-8 text-gray-400">
              Every collectible piece has a journey. AGE202 documents its
              sporting context, collection identity and archival preservation.
            </p>
          </div>

          {/* TIMELINE */}

          <div className="relative">
            <div className="absolute bottom-0 left-[11px] top-0 w-px bg-white/10 md:left-[15px]" />

            <div className="space-y-10">
              {timeline.map((item, index) => (
                <div
                  key={`${item.title}-${index}`}
                  className="relative pl-12 md:pl-16"
                >
                  <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border border-[#C8FF00]/40 bg-[#08101F] md:h-8 md:w-8">
                    <span className="h-2 w-2 rounded-full bg-[#C8FF00] shadow-[0_0_14px_rgba(200,255,0,.8)]" />
                  </div>

                  <div className="rounded-[28px] border border-white/10 bg-[#111B2E] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#C8FF00]/25 md:p-9">
                    <p className="font-mono text-xs font-black uppercase tracking-[0.25em] text-[#C8FF00]">
                      {item.label}
                    </p>

                    <h3 className="mt-4 text-2xl font-black text-white md:text-3xl">
                      {item.title}
                    </h3>

                    <p className="mt-4 text-base leading-7 text-gray-400 md:text-lg md:leading-8">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}