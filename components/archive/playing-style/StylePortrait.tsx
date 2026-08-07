import {
  CircleGauge,
  Ruler,
  Sparkles,
} from "lucide-react";

import type {
  PlayerMuseumData,
} from "@/lib/types/player-museum";

import StyleBadge from "./StyleBadge";

type StylePortraitProps = {
  player: PlayerMuseumData;
};

export default function StylePortrait({
  player,
}: StylePortraitProps) {
  const profile = player.profile;

  if (!profile) {
    return null;
  }

  const hasPlayingStyle =
    Boolean(
      profile.playingStyle?.trim(),
    );

  return (
    <article className="relative min-w-0 rounded-[2rem] border border-white/10 bg-[#09111f] px-7 py-9 sm:px-10 sm:py-12 lg:px-14 lg:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]"
      >
        <div
          className="absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full opacity-[0.09] blur-[100px]"
          style={{
            backgroundColor:
              player.accent,
          }}
        />
      </div>

      <div className="relative min-w-0">
        <div className="flex items-center gap-3">
          <span
            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border"
            style={{
              borderColor:
                `${player.accent}40`,
              backgroundColor:
                `${player.accent}0d`,
              color:
                player.accent,
            }}
          >
            <CircleGauge
              className="h-5 w-5"
              aria-hidden="true"
            />
          </span>

          <div className="min-w-0">
            <p className="break-words py-1 font-mono text-[8px] font-black uppercase leading-[1.7] tracking-[0.2em] text-white/25">
              Technical portrait
            </p>

            <p
              className="mt-1 break-words py-1 text-[10px] font-black uppercase leading-[1.7] tracking-[0.16em]"
              style={{
                color:
                  player.accent,
              }}
            >
              AGE202 analysis
            </p>
          </div>
        </div>

        {hasPlayingStyle ? (
          <p className="mt-9 max-w-5xl break-words text-2xl font-medium leading-[1.55] tracking-[-0.025em] text-white/85 sm:text-3xl">
            {
              profile.playingStyle
            }
          </p>
        ) : (
          <div className="mt-9 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6">
            <p className="text-base leading-8 text-white/40">
              The playing-style
              portrait has not yet
              been completed in the
              AGE202 CMS.
            </p>
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-3 border-t border-white/10 pt-8">
          {profile.height ? (
            <StyleBadge
              icon={Ruler}
              label="Height"
              value={`${profile.height} cm`}
              accent={
                player.accent
              }
            />
          ) : null}

          {profile.turnedPro ? (
            <StyleBadge
              icon={Sparkles}
              label="Turned professional"
              value={String(
                profile.turnedPro,
              )}
              accent={
                player.accent
              }
            />
          ) : null}
        </div>
      </div>
    </article>
  );
}
