import ChapterTransition from "@/components/archive/ui/ChapterTransition";
import MuseumHeading from "@/components/archive/ui/MuseumHeading";
import MuseumSection from "@/components/archive/ui/MuseumSection";

import ArtifactCard from "./ArtifactCard";
import EmptyCollection from "./EmptyCollection";

import type {
  PlayerArtifactsProps,
} from "./types";

export default function PlayerArtifacts({
  player,
}: PlayerArtifactsProps) {
  return (
    <MuseumSection
      id="player-artifacts"
      accent={player.accent}
      className="border-t border-white/10 bg-[#050b18] px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
      scrollMarginClassName="scroll-mt-16"
      withGrid={false}
      withGlow={false}
    >
      <MuseumHeading
        eyebrow="AGE202 collection"
        accent={player.accent}
        title={
          <>
            Player artifacts
          </>
        }
        titleClassName="text-4xl uppercase sm:text-5xl lg:text-6xl"
        aside={
          <p className="text-sm leading-7 text-white/45 lg:text-right">
            Authenticated garments,
            collectible pieces and
            historical references connected
            to {player.name}.
          </p>
        }
      />

      {player.artifacts.length > 0 ? (
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {player.artifacts.map(
            (artifact) => (
              <ArtifactCard
                key={artifact.id}
                artifact={artifact}
                accent={player.accent}
              />
            ),
          )}
        </div>
      ) : (
        <EmptyCollection
          playerName={player.name}
          accent={player.accent}
        />
      )}

      <ChapterTransition
        chapterLabel="End of Chapter VII"
        title="Collection becomes authenticity."
        description="Every authenticated artifact is preserved by the AGE202 archive. Continue to the official Digital Certificate for this museum experience."
        href="#digital-certificate"
        buttonLabel="View the Digital Certificate"
        accent={player.accent}
      />
    </MuseumSection>
  );
}
