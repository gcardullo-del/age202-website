import Link from "next/link";

import {
  ArrowRight,
  CircleCheck,
  Sparkles,
} from "lucide-react";

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
  const availableArtifacts =
    player.artifacts.filter(
      (artifact) =>
        artifact.availability ===
        "AVAILABLE",
    );

  const firstAvailableArtifact =
    availableArtifacts[0] ??
    null;

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

      {availableArtifacts.length >
      0 ? (
        <div
          className="mt-10 overflow-hidden rounded-[1.8rem] border bg-[#08101f]"
          style={{
            borderColor:
              `${player.accent}35`,
          }}
        >
          <div
            className="h-0.5 w-full"
            style={{
              backgroundColor:
                player.accent,
            }}
          />

          <div className="grid gap-6 p-6 sm:p-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:p-8">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-2 font-mono text-[7px] font-black uppercase tracking-[0.16em]"
                  style={{
                    color:
                      player.accent,

                    borderColor:
                      `${player.accent}35`,

                    backgroundColor:
                      `${player.accent}0D`,
                  }}
                >
                  <CircleCheck
                    size={10}
                    aria-hidden="true"
                  />

                  Available to collect
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-3 py-2 font-mono text-[7px] uppercase tracking-[0.14em] text-white/35">
                  <Sparkles
                    size={10}
                    style={{
                      color:
                        player.accent,
                    }}
                    aria-hidden="true"
                  />

                  {availableArtifacts.length}{" "}
                  {availableArtifacts.length ===
                  1
                    ? "specimen"
                    : "specimens"}
                </span>
              </div>

              <h3 className="mt-5 text-2xl font-black uppercase leading-[1] tracking-[-0.04em] text-white sm:text-3xl">
                From the{" "}
                {player.name} Archive
              </h3>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/42">
                Selected Artifact
                {availableArtifacts.length ===
                1
                  ? ""
                  : "s"}{" "}
                connected to {player.name}{" "}
                {availableArtifacts.length ===
                1
                  ? "is"
                  : "are"}{" "}
                currently available to enter
                a private collection.
              </p>

              <p className="mt-3 font-mono text-[7px] uppercase tracking-[0.14em] text-white/25">
                One physical piece · AGE202
                archive record
              </p>
            </div>

            {firstAvailableArtifact ? (
              <Link
                href={`/artifacts/${firstAvailableArtifact.slug}`}
                className="group inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full border px-6 py-4 text-center font-mono text-[8px] font-black uppercase tracking-[0.17em] transition hover:brightness-110 lg:w-auto"
                style={{
                  color:
                    player.accent,

                  borderColor:
                    `${player.accent}60`,

                  backgroundColor:
                    `${player.accent}0F`,
                }}
              >
                Explore available artifact

                <ArrowRight
                  size={13}
                  className="transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}

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