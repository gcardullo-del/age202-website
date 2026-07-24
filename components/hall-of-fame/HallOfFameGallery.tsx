import Image from "next/image";
import Link from "next/link";

import {
  players,
  productMatchesPlayer,
} from "@/data/players";
import { products } from "@/data/products";

export default function HallOfFameGallery() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      {/* BACKGROUND EFFECTS */}

      <div className="pointer-events-none absolute -left-48 top-20 h-[620px] w-[620px] rounded-full bg-[#C8FF00]/[0.04] blur-[200px]" />

      <div className="pointer-events-none absolute -right-48 bottom-20 h-[620px] w-[620px] rounded-full bg-blue-500/[0.04] blur-[200px]" />

      <div className="relative mx-auto w-full max-w-[1700px] px-6 md:px-10">
        <div className="grid gap-6 lg:grid-cols-2">
          {players.map((player, index) => {
            const archivePieces = products.filter((product) =>
              productMatchesPlayer(product, player)
            ).length;

            return (
              <PlayerGalleryCard
                key={player.slug}
                player={player}
                archivePieces={archivePieces}
                index={index}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

type PlayerGalleryCardProps = {
  player: (typeof players)[number];
  archivePieces: number;
  index: number;
};

function PlayerGalleryCard({
  player,
  archivePieces,
  index,
}: PlayerGalleryCardProps) {
  const status =
    player.status === "active"
      ? "Active"
      : `Retired ${player.retiredYear ?? ""}`.trim();

  return (
    <Link
      href={`/hall-of-fame/${player.slug}`}
      className="group relative min-h-[620px] overflow-hidden rounded-[38px] border border-white/10 bg-[#0A1425] transition-all duration-700 hover:-translate-y-2 hover:border-[#C8FF00]/35 hover:shadow-[0_40px_120px_rgba(0,0,0,0.45)] md:min-h-[700px]"
    >
      {/* PLAYER IMAGE */}

      <Image
        src={player.heroImage}
        alt={player.name}
        fill
        priority={index < 2}
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover object-top transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
      />

      {/* DARK OVERLAYS */}

      <div className="absolute inset-0 bg-gradient-to-b from-[#050B18]/10 via-[#050B18]/30 to-[#050B18]/95" />

      <div className="absolute inset-0 bg-gradient-to-r from-[#050B18]/75 via-transparent to-transparent opacity-80" />

      <div className="absolute inset-0 bg-[#050B18]/10 transition-colors duration-700 group-hover:bg-transparent" />

      {/* HOVER GLOW */}

      <div className="pointer-events-none absolute -right-28 -top-28 h-96 w-96 rounded-full bg-[#C8FF00]/0 blur-[130px] transition-all duration-700 group-hover:bg-[#C8FF00]/[0.1]" />

      {/* LARGE INITIALS */}

      <p className="pointer-events-none absolute -right-4 top-10 text-[150px] font-black leading-none tracking-[-0.1em] text-white/[0.04] transition-all duration-700 group-hover:-translate-y-3 group-hover:text-white/[0.07] md:text-[220px]">
        {player.initials}
      </p>

      {/* CONTENT */}

      <div className="relative flex min-h-[620px] flex-col justify-between p-7 md:min-h-[700px] md:p-10">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.34em] text-[#C8FF00]">
              {String(index + 1).padStart(2, "0")} · Hall of Fame
            </p>

            <p className="mt-3 text-xs font-bold uppercase tracking-[0.22em] text-white/60">
              {player.country}
            </p>
          </div>

          <span className="rounded-full border border-white/15 bg-[#050B18]/50 px-4 py-2 text-[9px] font-black uppercase tracking-[0.25em] text-white backdrop-blur-xl">
            {status}
          </span>
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.32em] text-[#C8FF00]">
            {player.signature}
          </p>

          <h2 className="mt-5 text-5xl font-black leading-[0.9] tracking-[-0.06em] text-white md:text-7xl">
            <span className="block">
              {player.firstName}
            </span>

            <span className="block text-white/55 transition-colors duration-500 group-hover:text-white">
              {player.lastName}
            </span>
          </h2>

          <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-[24px] border border-white/10 bg-white/10 backdrop-blur-xl sm:grid-cols-4">
            <GalleryStat
              value={player.careerTitles}
              label="Titles"
            />

            <GalleryStat
              value={player.grandSlamTitles}
              label="Majors"
            />

            <GalleryStat
              value={player.weeksAtNumberOne}
              label="Weeks #1"
            />

            <GalleryStat
              value={archivePieces}
              label="Archive"
            />
          </div>

          <div className="mt-8 flex items-center justify-between gap-5 border-t border-white/15 pt-7">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70 transition-colors group-hover:text-[#C8FF00]">
              Enter the gallery
            </span>

            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-[#050B18]/60 text-xl text-white backdrop-blur-xl transition-all duration-500 group-hover:rotate-[-10deg] group-hover:border-[#C8FF00] group-hover:bg-[#C8FF00] group-hover:text-black">
              →
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-[#C8FF00] transition-all duration-700 group-hover:w-full" />
    </Link>
  );
}

function GalleryStat({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="min-h-[108px] bg-[#07101F]/75 p-5 backdrop-blur-xl">
      <p className="text-3xl font-black tracking-[-0.05em] text-white">
        {value}
      </p>

      <p className="mt-2 text-[8px] font-black uppercase tracking-[0.25em] text-white/45">
        {label}
      </p>
    </div>
  );
}