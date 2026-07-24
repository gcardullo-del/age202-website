"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Badge from "@/components/ui/Badge";

type Props = {
  id: string;
  image: string;
  player: string;
  brand: string;
  title: string;
  tournament: string;
  year: number;
  price?: number | null;
  available?: boolean;
};

export default function ProductCard({
  id,
  image,
  player,
  brand,
  title,
  tournament,
  year,
  price,
  available = true,
}: Props) {
  return (
    <motion.article
      whileHover={{
        y: -10,
        scale: 1.01,
      }}
      transition={{ duration: 0.35 }}
      className="group overflow-hidden rounded-[32px] border border-white/5 bg-[#111B2E] shadow-xl transition-all duration-500 hover:border-[#C8FF00]/40 hover:shadow-[0_25px_60px_rgba(0,0,0,.45)]"
    >
      {/* IMAGE */}

      <div className="relative h-[420px] overflow-hidden">

        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Overlay */}

        <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-[#050B18]/20 to-transparent" />

        <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Badge */}

        <div className="absolute left-5 top-5">
          <Badge color={available ? "#C8FF00" : "#FF4D4D"}>
            {available ? "Verified Archive" : "Sold"}
          </Badge>
        </div>

      </div>

      {/* CONTENT */}

      <div className="space-y-5 p-7">

        <div>

          <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#C8FF00]">
            {player}
          </p>

          <p className="mt-1 text-xs uppercase tracking-[0.25em] text-gray-500">
            Digital Archive
          </p>

        </div>

        <h3 className="text-2xl xl:text-3xl font-black leading-tight text-white">
          {title}
        </h3>

        <p className="text-lg text-gray-300">
          {brand}
        </p>

        <div className="space-y-1">

          <p className="text-sm font-semibold text-gray-300">
            {tournament}
          </p>

          <p className="text-sm uppercase tracking-[0.25em] text-gray-500">
            {year} Collection
          </p>

        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-6">

          <span className="text-5xl font-black text-white">
            €{price}
          </span>

          <Link
            href={`/product/${id}`}
            className="rounded-full bg-[#C8FF00] px-6 py-3 font-bold text-black transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(200,255,0,.35)]"
          >
            View Archive →
          </Link>

        </div>

      </div>
    </motion.article>
  );
}