"use client";

import Image from "next/image";
import Link from "next/link";

import {
  motion,
} from "framer-motion";

import {
  ArrowRight,
} from "lucide-react";

import type {
  PublicHomepageSettings,
} from "@/lib/repositories/public/homepage.repository";


const reveal = {
  hidden: {
    opacity: 0,
    y: 28,
  },

  visible: {
    opacity: 1,
    y: 0,
  },
};


type MuseumHeroProps = {
  settings: PublicHomepageSettings;
};


export default function MuseumHero({
  settings,
}: MuseumHeroProps) {
  return (
    <section
      className="
        relative
        min-h-[82svh]
        overflow-hidden
        border-b
        border-white/10
        sm:min-h-[100svh]
      "
    >
      <Image
        src={
          settings.heroImage
        }
        alt="AGE202 Digital Tennis Museum"
        fill
        priority
        sizes="100vw"
        className="
          object-cover
          object-[62%_center]
          sm:object-[58%_center]
          lg:object-center
        "
      />


      <div
        className="
          absolute inset-0
          bg-[linear-gradient(90deg,rgba(3,8,18,.98)_0%,rgba(3,8,18,.94)_22%,rgba(3,8,18,.62)_47%,rgba(3,8,18,.12)_76%,rgba(3,8,18,.35)_100%)]
        "
      />

      <div
        className="
          absolute inset-0
          bg-[linear-gradient(180deg,rgba(3,8,18,.22)_0%,transparent_45%,rgba(3,8,18,.78)_100%)]
          sm:bg-[linear-gradient(180deg,rgba(3,8,18,.22)_0%,transparent_45%,rgba(3,8,18,.72)_100%)]
        "
      />

      <div
        className="
          absolute inset-0
          bg-[radial-gradient(circle_at_65%_32%,rgba(215,255,0,.11),transparent_31%)]
        "
      />


      <div
        className="
          relative
          mx-auto
          flex
          min-h-[82svh]
          max-w-[1500px]
          items-center
          px-5
          pb-12
          pt-8
          sm:min-h-[100svh]
          sm:px-8
          sm:py-14
          lg:px-12
        "
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={
            reveal
          }
          transition={{
            duration: 0.85,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
          className="
            w-full
            max-w-[690px]
            lg:pt-0
          "
        >
          <div
            className="
              mb-4
              flex
              items-center
              gap-3
              text-[9px]
              font-black
              uppercase
              tracking-[0.28em]
              text-[#d7ff00]
              sm:mb-5
              sm:text-xs
              sm:tracking-[0.32em]
            "
          >
            <span
              className="
                h-px
                w-8
                bg-[#d7ff00]
                sm:w-10
              "
            />

            {
              settings.heroEyebrow
            }
          </div>


          <h1
            id="museum-hero-title"
            className="
              max-w-[590px]
              pr-2
              text-[clamp(3rem,13.2vw,4.45rem)]
              font-black
              uppercase
              leading-[0.8]
              tracking-[-0.062em]
              text-white
              sm:max-w-none
              sm:pr-0
              sm:text-[clamp(4rem,8.4vw,8.4rem)]
              sm:leading-[0.78]
              sm:tracking-[-0.07em]
            "
          >
            <span className="block">
              {
                settings.heroTitle
              }
            </span>

            <span
              className="
                mt-3
                block
                text-[clamp(1.85rem,7.3vw,2.4rem)]
                leading-[0.92]
                tracking-[-0.045em]
                text-[#d7ff00]
                sm:mt-5
                sm:whitespace-nowrap
                sm:text-[clamp(2.25rem,3.5vw,3.35rem)]
                sm:leading-[0.9]
                sm:tracking-[-0.05em]
              "
            >
              {
                settings.heroSubtitle
              }
            </span>
          </h1>


          <div
            className="
              mt-5
              h-px
              w-12
              bg-[#d7ff00]
              sm:mt-7
              sm:w-14
            "
          />


          <p
            className="
              mt-5
              max-w-[32rem]
              pr-3
              text-[15px]
              font-medium
              leading-7
              text-white/78
              sm:mt-6
              sm:max-w-lg
              sm:pr-0
              sm:text-base
              sm:leading-8
              sm:text-white/72
            "
          >
            {
              settings.heroDescription
            }
          </p>


          <Link
            href={
              settings.heroCtaHref
            }
            className="
              group
              mt-6
              inline-flex
              min-h-[56px]
              w-full
              items-center
              justify-between
              gap-8
              rounded-lg
              border
              border-[#d7ff00]
              bg-black/20
              px-6
              py-4
              text-[11px]
              font-black
              uppercase
              tracking-[0.18em]
              text-white
              backdrop-blur
              transition
              active:scale-[0.985]
              sm:mt-8
              sm:min-w-[220px]
              sm:w-auto
              sm:tracking-[0.2em]
              sm:hover:bg-[#d7ff00]
              sm:hover:text-[#030812]
            "
          >
            {
              settings.heroCtaLabel
            }

            <ArrowRight
              size={18}
              className="
                shrink-0
                transition-transform
                sm:group-hover:translate-x-1
              "
            />
          </Link>
        </motion.div>
      </div>


      <div
        className="
          absolute
          bottom-5
          right-6
          hidden
          items-center
          gap-5
          lg:flex
        "
      >
        <span
          className="
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.22em]
            text-white/70
          "
        >
          {
            settings.museumTagline
          }
        </span>

        <span
          className="
            h-px
            w-10
            bg-[#d7ff00]
          "
        />
      </div>


      <div
        className="
          absolute
          right-6
          top-1/2
          hidden
          -translate-y-1/2
          flex-col
          gap-3
          2xl:flex
        "
      >
        {[
          0,
          1,
          2,
          3,
        ].map(
          (
            dot,
          ) => (
            <span
              key={
                dot
              }
              className={[
                "h-2 w-2 rounded-full",
                dot === 0
                  ? "bg-[#d7ff00]"
                  : "bg-white/40",
              ].join(
                " ",
              )}
            />
          ),
        )}
      </div>
    </section>
  );
}