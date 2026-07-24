import ExhibitionCard from "@/components/hall-of-fame/ExhibitionCard";

import {
  players,
  productMatchesPlayer,
} from "@/data/players";
import { products } from "@/data/products";

const playerAccentColors: Record<string, string> = {
  federer: "#C8FF00",
  nadal: "#FF7A18",
  djokovic: "#4EA5FF",
  sinner: "#8DFF61",
  alcaraz: "#FFD54A",
};

export default function HallOfFameExhibition() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28 lg:py-36">
      {/* AMBIENT BACKGROUND */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-72 top-[8%] h-[700px] w-[700px] rounded-full bg-[#C8FF00]/[0.035] blur-[220px]" />

        <div className="absolute -right-72 top-[34%] h-[720px] w-[720px] rounded-full bg-[#FF7A18]/[0.03] blur-[230px]" />

        <div className="absolute -left-72 top-[58%] h-[700px] w-[700px] rounded-full bg-[#4EA5FF]/[0.03] blur-[230px]" />

        <div className="absolute -right-72 bottom-[4%] h-[720px] w-[720px] rounded-full bg-[#FFD54A]/[0.03] blur-[230px]" />
      </div>

      {/* MUSEUM GRID */}

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:96px_96px] opacity-25" />

      <div className="relative mx-auto w-full max-w-[1700px] px-5 sm:px-6 md:px-10">
        <div className="mb-16 border-b border-white/10 pb-10 md:mb-24 md:flex md:items-end md:justify-between md:gap-12 md:pb-14">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.38em] text-[#C8FF00]">
              Permanent Exhibition
            </p>

            <h2 className="mt-5 max-w-4xl text-4xl font-black leading-[0.92] tracking-[-0.055em] text-white sm:text-5xl md:text-7xl">
              Five champions.
              <span className="block text-white/35">
                Five defining eras.
              </span>
            </h2>
          </div>

          <p className="mt-7 max-w-lg text-sm leading-7 text-white/45 md:mt-0 md:text-base md:leading-8">
            Explore the careers, achievements and preserved apparel of the
            players who reshaped modern tennis history.
          </p>
        </div>

        <div className="space-y-24 md:space-y-32 lg:space-y-40">
          {players.map((player, index) => {
            const archivePieces = products.filter((product) =>
              productMatchesPlayer(product, player)
            ).length;

            const accentColor =
              playerAccentColors[player.slug] ?? "#C8FF00";

            return (
              <div
                key={player.slug}
                className="relative"
              >
                <div className="pointer-events-none absolute left-1/2 top-[-68px] hidden h-px w-[65%] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent md:block" />

                <ExhibitionCard
                  player={player}
                  exhibitNumber={index + 1}
                  archivePieces={archivePieces}
                  accentColor={accentColor}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}