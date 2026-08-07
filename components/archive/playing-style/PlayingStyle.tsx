import type {
  PlayerMuseumData,
} from "@/lib/types/player-museum";

import ChapterTransition from "../ui/ChapterTransition";
import StyleFacts from "./StyleFacts";
import StylePortrait from "./StylePortrait";

type PlayingStyleProps = {
  player: PlayerMuseumData;
};

export default function PlayingStyle({
  player,
}: PlayingStyleProps) {
  if (!player.profile) {
    return null;
  }

  const playerDisplayName =
    player.firstName ??
    player.name;

  return (
    <section
      id="playing-style"
      className="relative scroll-mt-20 overflow-hidden border-y border-white/[0.07] bg-[#050b18] px-6 py-24 sm:px-8 sm:py-28 lg:px-12 lg:py-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.022]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.65) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.65) 1px, transparent 1px)",
          backgroundSize:
            "88px 88px",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-44 top-20 h-[440px] w-[440px] rounded-full opacity-[0.08] blur-[155px]"
        style={{
          backgroundColor:
            player.accent,
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 bottom-[-100px] h-[520px] w-[520px] rounded-full opacity-[0.06] blur-[170px]"
        style={{
          backgroundColor:
            player.accent,
        }}
      />

      <div className="relative mx-auto w-full max-w-[1440px]">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end lg:gap-16">
          <div>
            <div className="flex items-center gap-4">
              <span
                aria-hidden="true"
                className="h-px w-10 sm:w-14"
                style={{
                  backgroundColor:
                    player.accent,
                  boxShadow:
                    `0 0 14px ${player.accent}`,
                }}
              />

              <p
                className="py-1 text-[10px] font-black uppercase leading-[1.7] tracking-[0.28em]"
                style={{
                  color:
                    player.accent,
                }}
              >
                Chapter III · Playing Style
              </p>
            </div>

            <h2 className="mt-6 max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.055em] text-white sm:text-6xl lg:text-8xl">
              The art behind

              <span className="block text-white/25">
                the performance.
              </span>
            </h2>
          </div>

          <div className="lg:pb-2">
            <p className="max-w-xl text-base leading-8 text-white/45 sm:text-lg sm:leading-9">
              Technique, movement and
              tactical identity define
              how{" "}
              <span className="font-semibold text-white/75">
                {player.name}
              </span>{" "}
              expressed tennis on court.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-6 lg:mt-20 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px]">
          <StylePortrait
            player={player}
          />

          <StyleFacts
            player={player}
          />
        </div>

        <ChapterTransition
          chapterLabel="End of Chapter III"
          title="Technique becomes equipment."
          description={`Discover the racquets, apparel, strings and technical equipment that helped define ${playerDisplayName}'s identity on court.`}
          href="#equipment-section"
          buttonLabel="Explore the Equipment"
          accent={player.accent}
        />
      </div>
    </section>
  );
}
