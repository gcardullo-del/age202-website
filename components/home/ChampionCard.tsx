"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Badge from "@/components/ui/Badge";

type Champion = {
  id: string;
  name: string;
  title: string;
  image: string;
  accent: string;
};

type Props = {
  champion: Champion;
  wide?: boolean;
};

export default function ChampionCard({
  champion,
  wide = false,
}: Props) {
  return (
    <Link href={`/archives/${champion.id}`} className="block">
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.35 }}
        className={`group relative overflow-hidden rounded-[32px] border border-white/10 ${
          wide ? "h-[520px]" : "h-[460px]"
        }`}
        style={{
          boxShadow: "0 0 0 rgba(0,0,0,0)",
        }}
      >
        {/* Immagine */}
        <Image
          src={champion.image}
          alt={champion.name}
          fill
          priority={wide}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-[#050B18]/35 to-transparent" />

        <div className="absolute inset-0 bg-gradient-to-r from-[#08101F]/90 via-[#08101F]/45 to-transparent" />

        {/* Bordo luminoso */}
        <div
          className="absolute inset-0 rounded-[32px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            boxShadow: `inset 0 0 0 2px ${champion.accent}`,
          }}
        />

        {/* Contenuto */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 z-10 p-10"
          initial={false}
          whileHover={{ y: -6 }}
        >
          <Badge color={champion.accent}>
            COLLECTION
          </Badge>

          <h3 className="mt-6 text-5xl font-black text-white">
            {champion.name}
          </h3>

          <p className="mt-3 max-w-md text-lg text-gray-300">
            {champion.title}
          </p>

          <div
            className="mt-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em] transition-all duration-300 group-hover:translate-x-2"
            style={{
              color: champion.accent,
            }}
          >
            View Archive →
          </div>
        </motion.div>
      </motion.div>
    </Link>
  );
}