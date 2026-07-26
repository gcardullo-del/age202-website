"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type HeroBackgroundProps = {
  image: string;
};

export default function HeroBackground({
  image,
}: HeroBackgroundProps) {
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ scale: 1 }}
      animate={{ scale: 1.05 }}
      transition={{
        duration: 20,
        ease: "linear",
      }}
    >
      <Image
        src={image}
        alt=""
        fill
        priority
        quality={100}
        sizes="100vw"
        className="object-cover object-center select-none"
      />

      <div className="absolute inset-0 bg-black/18" />
    </motion.div>
  );
}