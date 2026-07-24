"use client";

import { useRouter } from "next/navigation";

type TimelinePlayer = {
  name: string;
  shortName: string;
  value: string;
  year: string;
  era: string;
  description: string;
};

const timelinePlayers: TimelinePlayer[] = [
  {
    name: "Roger Federer",
    shortName: "Federer",
    value: "federer",
    year: "1998",
    era: "The Maestro",
    description:
      "Elegance, precision and one of the most influential wardrobes in tennis history.",
  },
  {
    name: "Rafael Nadal",
    shortName: "Nadal",
    value: "nadal",
    year: "2001",
    era: "The Warrior",
    description:
      "Clay-court dominance, unmistakable energy and iconic Nike collections.",
  },
  {
    name: "Novak Djokovic",
    shortName: "Djokovic",
    value: "djokovic",
    year: "2003",
    era: "The Champion",
    description:
      "Technical perfection, historic consistency and a career across multiple eras.",
  },
  {
    name: "Jannik Sinner",
    shortName: "Sinner",
    value: "sinner",
    year: "2018",
    era: "New Generation",
    description:
      "Modern Italian tennis represented through speed, control and distinctive style.",
  },
  {
    name: "Carlos Alcaraz",
    shortName: "Alcaraz",
    value: "alcaraz",
    year: "2018",
    era: "Future Legacy",
    description:
      "Explosive athleticism and a new generation of collectible tennis apparel.",
  },
];

export default function ArchiveTimeline() {
  const router = useRouter();

  function selectPlayer(player: string) {
    router.push(
      `/archive?player=${encodeURIComponent(
        player
      )}#archive-explorer`
    );
  }

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#050B18]">
      {/* Background */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[#C8FF00]/[0.04] blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "100% 72px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-20 md:px-8 lg:py-28">
        {/* Heading */}

        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#C8FF00]">
              Collection timeline
            </p>

            <h2 className="mt-5 max-w-3xl text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
              Five champions.
              <span className="block text-gray-600">
                One evolving legacy.
              </span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-gray-500 lg:text-right">
            Explore the AGE202 collection through the players who
            transformed tennis history and influenced generations
            of performance apparel.
          </p>
        </div>

        {/* Desktop timeline */}

        <div className="relative mt-20 hidden lg:block">
          <div className="absolute left-0 right-0 top-[31px] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <div className="grid grid-cols-5 gap-5">
            {timelinePlayers.map((player, index) => (
              <TimelineItem
                key={player.value}
                player={player}
                index={index}
                onSelect={selectPlayer}
              />
            ))}
          </div>
        </div>

        {/* Mobile timeline */}

        <div className="relative mt-14 lg:hidden">
          <div className="absolute bottom-0 left-[7px] top-0 w-px bg-gradient-to-b from-[#C8FF00]/50 via-white/15 to-transparent" />

          <div className="space-y-5">
            {timelinePlayers.map((player, index) => (
              <MobileTimelineItem
                key={player.value}
                player={player}
                index={index}
                onSelect={selectPlayer}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

type TimelineItemProps = {
  player: TimelinePlayer;
  index: number;
  onSelect: (player: string) => void;
};

function TimelineItem({
  player,
  index,
  onSelect,
}: TimelineItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(player.value)}
      className="group relative text-left"
      aria-label={`Explore ${player.name} archive`}
    >
      <div className="relative flex h-16 items-start">
        <span className="relative z-10 mt-5 block h-6 w-6 rounded-full border border-white/20 bg-[#08101F] transition duration-300 group-hover:border-[#C8FF00] group-hover:bg-[#C8FF00]">
          <span className="absolute inset-1.5 rounded-full bg-white/20 transition group-hover:bg-[#050B18]" />
        </span>

        <span className="ml-3 mt-[19px] text-[9px] font-black uppercase tracking-[0.22em] text-gray-600 transition group-hover:text-[#C8FF00]">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <article className="min-h-[280px] rounded-[26px] border border-white/10 bg-[#08101F] p-6 transition duration-300 group-hover:-translate-y-2 group-hover:border-[#C8FF00]/30 group-hover:bg-[#0A1425]">
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#C8FF00]">
          {player.year}
        </p>

        <h3 className="mt-5 text-2xl font-black tracking-[-0.03em] text-white">
          {player.shortName}
        </h3>

        <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">
          {player.era}
        </p>

        <p className="mt-6 text-sm leading-7 text-gray-500">
          {player.description}
        </p>

        <div className="mt-7 flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.2em] text-white transition group-hover:text-[#C8FF00]">
          Explore archive

          <span
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </div>
      </article>
    </button>
  );
}

type MobileTimelineItemProps = {
  player: TimelinePlayer;
  index: number;
  onSelect: (player: string) => void;
};

function MobileTimelineItem({
  player,
  index,
  onSelect,
}: MobileTimelineItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(player.value)}
      className="group relative w-full pl-10 text-left"
      aria-label={`Explore ${player.name} archive`}
    >
      <span className="absolute left-0 top-7 z-10 block h-4 w-4 rounded-full border border-[#C8FF00]/50 bg-[#050B18] transition group-hover:bg-[#C8FF00]" />

      <article className="rounded-[24px] border border-white/10 bg-[#08101F] p-6 transition group-hover:border-[#C8FF00]/30">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.23em] text-[#C8FF00]">
              {player.year}
            </p>

            <h3 className="mt-3 text-2xl font-black text-white">
              {player.name}
            </h3>

            <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.2em] text-gray-600">
              {player.era}
            </p>
          </div>

          <span className="text-4xl font-black text-white/[0.04]">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <p className="mt-5 text-sm leading-7 text-gray-500">
          {player.description}
        </p>

        <p className="mt-5 text-[9px] font-black uppercase tracking-[0.2em] text-white transition group-hover:text-[#C8FF00]">
          Explore archive →
        </p>
      </article>
    </button>
  );
}