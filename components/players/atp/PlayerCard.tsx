import Image from "next/image";
import Link from "next/link";

import {
  ChevronRight,
  Crown,
  Shirt,
} from "lucide-react";

import type { AtpArchivePlayer } from "./types";

import {
  formatPoints,
  getCollectionLabel,
} from "./utils";

type PlayerCardProps = {
  player: AtpArchivePlayer;
};

export default function PlayerCard({
  player,
}: PlayerCardProps) {
  const image =
    player.portraitImage?.trim() ||
    player.heroImage?.trim() ||
    `/players/other-players/top-50/${player.slug}.webp`;

  const collectionLabel = getCollectionLabel(
    player.collectionType,
  );

  return (
    <Link
      href={`/players/${player.slug}`}
      className="group relative block h-full w-full min-h-[460px] overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#09111f] transition-all duration-500 hover:-translate-y-1.5 hover:border-[#D7FF00]/45 hover:shadow-[0_24px_70px_rgba(0,0,0,0.34)] md:min-h-[500px] xl:min-h-[480px] 2xl:min-h-[440px]"
    >
      <Image
        src={image}
        alt={player.name}
        fill
        sizes="(max-width: 768px) 100vw,
               (max-width: 1024px) 50vw,
               (max-width: 1280px) 33vw,
               (max-width: 1536px) 25vw,
               20vw"
        className="object-cover object-top transition duration-700 group-hover:scale-[1.045]"
      />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,7,17,.18)_0%,rgba(2,7,17,.02)_36%,rgba(2,7,17,.78)_74%,#020711_100%)]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_28%,rgba(215,255,0,.10),transparent_28%)] opacity-0 transition duration-500 group-hover:opacity-100" />

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D7FF00]/55 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

      <div className="absolute left-5 top-5">
        <span className="rounded-full border border-[#D7FF00]/30 bg-black/45 px-3 py-2 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-[#D7FF00] backdrop-blur-md">
          ATP #{player.ranking ?? "—"}
        </span>
      </div>

      <div className="absolute right-5 top-5 flex max-w-[58%] flex-wrap justify-end gap-2">
        {player.collectionType === "FEATURED" ? (
          <span className="inline-flex items-center gap-2 rounded-full border border-[#D7FF00]/35 bg-[#D7FF00] px-3 py-2 font-mono text-[7px] font-black uppercase tracking-[0.13em] text-[#050B18]">
            <Crown
              size={11}
              aria-hidden="true"
            />

            Champion
          </span>
        ) : (
          <span className="rounded-full border border-white/10 bg-black/40 px-3 py-2 font-mono text-[7px] uppercase tracking-[0.14em] text-white/58 backdrop-blur-md">
            {collectionLabel}
          </span>
        )}

        <span className="rounded-full border border-white/10 bg-black/40 px-3 py-2 font-mono text-[7px] uppercase tracking-[0.14em] text-white/58 backdrop-blur-md">
          {player.country ?? "International"}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-[#D7FF00]">
            {formatPoints(player.points)}
          </p>

          <span className="font-mono text-[7px] uppercase tracking-[0.17em] text-white/32">
            AGE202 Index
          </span>
        </div>

        <h2 className="mt-4 text-3xl font-black uppercase leading-[0.86] tracking-[-0.055em] sm:text-4xl">
          {player.name}
        </h2>

        <div className="mt-6 grid grid-cols-[1fr_auto] items-center gap-4 border-t border-white/10 pt-5">
          <span className="inline-flex items-center gap-2 font-mono text-[7px] uppercase tracking-[0.16em] text-white/38">
            <Shirt
              size={12}
              className="text-[#D7FF00]"
              aria-hidden="true"
            />

            {player.artifactCount}

            {player.artifactCount === 1
              ? " artifact"
              : " artifacts"}
          </span>

          <span className="inline-flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.18em] text-white/58 transition group-hover:text-[#D7FF00]">
            Enter profile

            <span className="grid h-7 w-7 place-items-center rounded-full border border-white/10 transition group-hover:border-[#D7FF00]/35 group-hover:bg-[#D7FF00]/[0.08]">
              <ChevronRight
                size={13}
                aria-hidden="true"
              />
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
