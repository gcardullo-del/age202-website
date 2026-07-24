"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type Props = {
  image: string;
};

export default function HeroBackground({ image }: Props) {
  return (
   <motion.div
  className="absolute inset-0 overflow-hidden"
  initial={{ scale: 1.02 }}
  animate={{ scale: 1.12 }}
  transition={{
    duration: 18,
    ease: "linear",
  }}
>
  <Image
    src={image}
    alt=""
    fill
    priority
    quality={100}
    className="object-cover"
  />
</motion.div>
  );
}