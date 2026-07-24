"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  images: string[];
  alt: string;
};

export default function ImageGallery({
  images,
  alt,
}: Props) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="grid gap-6 lg:grid-cols-[110px_1fr]">

      {/* MINIATURE */}

      <div className="order-2 flex gap-4 lg:order-1 lg:flex-col">

        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelected(index)}
            className={`group relative h-24 w-24 overflow-hidden rounded-2xl border transition-all duration-300 ${
              selected === index
                ? "border-[#C8FF00] shadow-[0_0_25px_rgba(200,255,0,.35)]"
                : "border-white/10 hover:border-white/30"
            }`}
          >
            <Image
              src={image}
              alt={`${alt} ${index + 1}`}
              fill
              className="object-cover transition duration-500 group-hover:scale-110"
            />
          </button>
        ))}

      </div>

      {/* FOTO PRINCIPALE */}

      <div className="relative order-1 overflow-hidden rounded-[36px] border border-white/10 bg-[#08101F]">

        <div className="relative h-[760px]">

          <AnimatePresence mode="wait">

            <motion.div
              key={selected}
              initial={{
                opacity: 0,
                scale: 1.04,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.45,
              }}
              className="absolute inset-0"
            >
              <Image
                src={images[selected]}
                alt={alt}
                fill
                priority
                className="object-cover transition duration-700 hover:scale-110"
              />
            </motion.div>

          </AnimatePresence>

        </div>

        {/* BADGE */}

        <div className="absolute left-6 top-6 rounded-full bg-black/60 px-5 py-2 backdrop-blur">

          <span className="text-xs font-bold uppercase tracking-[0.35em] text-[#C8FF00]">
            AGE202 Archive
          </span>

        </div>

        {/* CONTATORE */}

        <div className="absolute bottom-6 right-6 rounded-full bg-black/60 px-4 py-2 backdrop-blur">

          <span className="text-sm font-semibold text-white">
            {selected + 1} / {images.length}
          </span>

        </div>

      </div>

    </div>
  );
}