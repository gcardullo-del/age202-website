"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
} from "framer-motion";

import HeroBackground from "./HeroBackground";
import { heroSlides } from "@/data/heroSlides";


const SLIDE_DURATION = 12_000;


export default function Hero() {
  const [
    currentSlide,
    setCurrentSlide,
  ] = useState(0);


  useEffect(() => {
    if (
      heroSlides.length <= 1
    ) {
      return;
    }


    const interval =
      window.setInterval(() => {
        setCurrentSlide(
          (previousSlide) => {
            return (
              previousSlide + 1
            ) % heroSlides.length;
          },
        );
      }, SLIDE_DURATION);


    return () => {
      window.clearInterval(
        interval,
      );
    };
  }, []);


  const slide =
    heroSlides[currentSlide];


  if (!slide) {
    return null;
  }


  const archiveHref =
    `/archives/${slide.player
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")}`;


  return (
    <section
      aria-label="AGE202 featured collections"
      className="
        relative isolate flex
        min-h-[78svh]
        overflow-hidden
        bg-[#050b18]
        sm:min-h-[calc(100svh-96px)]
      "
    >
      <HeroBackground
        image={slide.image}
      />


      <div
        className="
          absolute inset-0
          bg-gradient-to-r
          from-[#050b18]/95
          via-[#050b18]/75
          to-[#050b18]/25
          sm:via-[#050b18]/72
          sm:to-[#050b18]/15
        "
      />

      <div
        className="
          absolute inset-0
          bg-gradient-to-t
          from-[#050b18]/90
          via-[#050b18]/15
          to-[#050b18]/25
          sm:from-[#050b18]/85
          sm:via-transparent
          sm:to-[#050b18]/20
        "
      />


      <AnimatePresence
        mode="wait"
      >
        <motion.div
          key={slide.id}
          initial={{
            opacity: 0,
            y: 32,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: -24,
          }}
          transition={{
            duration: 0.7,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
          className="
            relative z-10
            flex w-full
            items-center
          "
        >
          <div
            className="
              mx-auto w-full
              max-w-[1480px]
              px-5
              pb-24
              pt-14
              sm:px-8
              sm:py-24
              lg:px-12
              lg:py-28
            "
          >
            <span
              className="
                inline-flex
                rounded-full
                border
                px-3.5 py-2
                text-[9px]
                font-black
                uppercase
                tracking-[0.24em]
                sm:px-4
                sm:text-xs
                sm:tracking-[0.28em]
              "
              style={{
                color:
                  slide.accent,
                borderColor:
                  slide.accent,
              }}
            >
              {slide.player} Collection
            </span>


            <h1
              className="
                mt-5
                max-w-5xl
                text-[clamp(3rem,14vw,4.8rem)]
                font-black
                uppercase
                leading-[0.84]
                tracking-[-0.06em]
                text-white
                sm:mt-8
                sm:text-[clamp(3.5rem,8vw,8.5rem)]
                sm:tracking-[-0.065em]
              "
            >
              {slide.title}
            </h1>


            <p
              className="
                mt-5
                max-w-xl
                text-[15px]
                font-medium
                leading-7
                text-white/75
                sm:mt-8
                sm:max-w-2xl
                sm:text-lg
                sm:leading-9
                sm:text-white/65
                lg:text-xl
              "
            >
              {slide.description}
            </p>


            <div
              className="
                mt-7
                flex flex-col
                gap-3
                sm:mt-12
                sm:flex-row
                sm:flex-wrap
                sm:gap-5
              "
            >
              <Link
                href={archiveHref}
                className="
                  inline-flex
                  min-h-[58px]
                  w-full
                  items-center
                  justify-center
                  rounded-full
                  px-7 py-4
                  text-[13px]
                  font-black
                  uppercase
                  tracking-[0.09em]
                  text-black
                  transition
                  duration-300
                  active:scale-[0.98]
                  sm:min-h-14
                  sm:w-auto
                  sm:px-8
                  sm:text-sm
                  sm:hover:-translate-y-0.5
                  sm:hover:shadow-[0_0_35px_rgba(200,255,0,.25)]
                "
                style={{
                  backgroundColor:
                    slide.accent,
                }}
              >
                Explore archive

                <span
                  className="ml-3"
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>


              <Link
                href="/vault"
                className="
                  inline-flex
                  min-h-[54px]
                  w-full
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/20
                  bg-black/10
                  px-7 py-4
                  text-[12px]
                  font-bold
                  uppercase
                  tracking-[0.09em]
                  text-white
                  backdrop-blur-sm
                  transition
                  duration-300
                  active:scale-[0.98]
                  sm:min-h-14
                  sm:w-auto
                  sm:bg-transparent
                  sm:px-8
                  sm:text-sm
                  sm:hover:-translate-y-0.5
                  sm:hover:border-[#c8ff00]
                  sm:hover:text-[#c8ff00]
                "
              >
                The Vault
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>


      {heroSlides.length > 1 && (
        <div
          className="
            absolute
            bottom-5
            left-1/2
            z-20
            flex
            -translate-x-1/2
            items-center
            gap-2.5
            sm:bottom-9
            sm:gap-3
          "
          aria-label="Select featured collection"
        >
          {heroSlides.map(
            (
              heroSlide,
              index,
            ) => {
              const active =
                currentSlide ===
                index;


              return (
                <button
                  key={
                    heroSlide.id
                  }
                  type="button"
                  onClick={() =>
                    setCurrentSlide(
                      index,
                    )
                  }
                  aria-label={`Show ${heroSlide.player} collection`}
                  aria-current={
                    active
                      ? "true"
                      : undefined
                  }
                  className={`
                    h-2.5
                    rounded-full
                    transition-all
                    duration-300
                    ${
                      active
                        ? "w-9 bg-[#c8ff00] sm:w-10"
                        : "w-2.5 bg-white/35 hover:bg-white/70"
                    }
                  `}
                />
              );
            },
          )}
        </div>
      )}
    </section>
  );
}