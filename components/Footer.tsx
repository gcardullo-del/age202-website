"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const collections = [
  { href: "/archives/federer", label: "Roger Federer" },
  { href: "/archives/nadal", label: "Rafael Nadal" },
  { href: "/archives/djokovic", label: "Novak Djokovic" },
  { href: "/archives/sinner", label: "Jannik Sinner" },
  { href: "/archives/alcaraz", label: "Carlos Alcaraz" },
];

const museumLinks = [
  { href: "/about", label: "About AGE202" },
  { href: "/brands", label: "Curated Brands" },
  { href: "/vault", label: "The Vault" },
  { href: "/hall-of-fame", label: "Hall of Fame" },
  { href: "/slams", label: "Grand Slams" },
];

const communityLinks = [
  {
    href: "https://www.instagram.com",
    label: "Instagram",
    external: true,
  },
  {
    href: "https://www.age202.com",
    label: "AGE202.com",
    external: true,
  },
  {
    href: "mailto:info@age202.com",
    label: "Contact",
    external: true,
  },
];

export default function Footer() {
  const shouldReduceMotion = useReducedMotion();

  const reveal = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.08] bg-[#050B18] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(200,255,0,0.08),transparent_30%),radial-gradient(circle_at_90%_45%,rgba(255,255,255,0.035),transparent_22%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[16%] -translate-x-1/2 select-none whitespace-nowrap text-[32vw] font-black leading-none tracking-[-0.09em] text-white/[0.018]"
      >
        AGE202
      </div>

      <section className="relative border-b border-white/[0.08]">
        <div className="mx-auto max-w-[1450px] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40">
          <motion.div {...reveal} className="mx-auto max-w-5xl text-center">
            <div className="mb-8 flex items-center justify-center gap-4">
              <span className="h-px w-10 bg-[#C8FF00]/60 sm:w-20" />

              <span className="text-[9px] font-black uppercase tracking-[0.38em] text-[#C8FF00] sm:text-[10px]">
                AGE202 Digital Museum
              </span>

              <span className="h-px w-10 bg-[#C8FF00]/60 sm:w-20" />
            </div>

            <h2 className="text-balance text-[clamp(3rem,8vw,8.8rem)] font-black uppercase leading-[0.86] tracking-[-0.065em] text-white">
              Every garment
              <span className="block text-white/28">tells a story.</span>
            </h2>

            <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-white/48 sm:mt-10 sm:text-lg sm:leading-9">
              A curated digital museum preserving tennis history through
              authentic apparel, iconic collections and legendary moments.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/archive"
                className={[
                  "group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#C8FF00] px-8",
                  "text-[10px] font-black uppercase tracking-[0.2em] text-black",
                  "transition duration-300 hover:-translate-y-1 hover:bg-white",
                  "hover:shadow-[0_18px_50px_rgba(200,255,0,0.2)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8FF00]",
                  "focus-visible:ring-offset-4 focus-visible:ring-offset-[#050B18]",
                ].join(" ")}
              >
                Explore the Archive

                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                >
                  ↗
                </span>
              </Link>

              <Link
                href="/about"
                className={[
                  "inline-flex min-h-14 items-center justify-center rounded-full border border-white/12 px-8",
                  "text-[10px] font-black uppercase tracking-[0.2em] text-white/70",
                  "transition duration-300 hover:border-white/25 hover:bg-white/[0.06] hover:text-white",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8FF00]",
                  "focus-visible:ring-offset-4 focus-visible:ring-offset-[#050B18]",
                ].join(" ")}
              >
                Discover Our Story
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative">
        <div className="mx-auto max-w-[1450px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
          <motion.div
            {...reveal}
            className="grid gap-14 border-b border-white/[0.08] pb-20 sm:grid-cols-2 lg:grid-cols-[1.45fr_1fr_1fr_1fr] lg:gap-12 lg:pb-24"
          >
            <div className="sm:col-span-2 lg:col-span-1">
              <Link
                href="/"
                aria-label="AGE202 home"
                className="inline-flex rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8FF00] focus-visible:ring-offset-4 focus-visible:ring-offset-[#050B18]"
              >
                <Image
                  src="/logo/age202-logo-white.png"
                  alt="AGE202"
                  width={230}
                  height={90}
                  className="h-auto w-[190px] drop-shadow-[0_0_28px_rgba(200,255,0,0.12)] sm:w-[230px]"
                />
              </Link>

              <p className="mt-8 max-w-md text-[15px] leading-8 text-white/42">
                Founded by passion. Curated for collectors. Built to preserve
                the cultural legacy of tennis through the apparel that defined
                its greatest eras.
              </p>

              <div className="mt-10 flex items-center gap-4">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#C8FF00]">
                  1970
                </span>

                <span className="h-px flex-1 bg-gradient-to-r from-[#C8FF00]/60 to-white/10" />

                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/35">
                  2026
                </span>
              </div>

              <p className="mt-4 text-[9px] font-bold uppercase tracking-[0.24em] text-white/22">
                More than fifty years of tennis culture
              </p>
            </div>

            <FooterColumn
              symbol="◎"
              title="Collections"
              links={collections}
            />

            <FooterColumn
              symbol="◉"
              title="Museum"
              links={museumLinks}
            />

            <FooterColumn
              symbol="◌"
              title="Community"
              links={communityLinks}
            />
          </motion.div>

          <motion.div
            {...reveal}
            className="grid gap-10 border-b border-white/[0.08] py-16 lg:grid-cols-[1fr_auto] lg:items-end"
          >
            <div>
              <span className="text-[9px] font-black uppercase tracking-[0.34em] text-[#C8FF00]">
                Our Manifesto
              </span>

              <p className="mt-5 max-w-3xl text-2xl font-black leading-tight tracking-[-0.035em] text-white sm:text-3xl lg:text-4xl">
                We do not collect clothing.
                <span className="block text-white/28">
                  We preserve moments that shaped tennis history.
                </span>
              </p>
            </div>

            <Link
              href="/about"
              className="group inline-flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.24em] text-white/45 transition hover:text-[#C8FF00]"
            >
              Read the philosophy

              <span
                aria-hidden="true"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition duration-300 group-hover:translate-x-1 group-hover:border-[#C8FF00]/40"
              >
                →
              </span>
            </Link>
          </motion.div>

          <motion.div {...reveal} className="pt-16 sm:pt-20">
            <p className="text-center text-[9px] font-black uppercase tracking-[0.36em] text-[#C8FF00]">
              Digital Museum of Tennis Apparel
            </p>

            <div
              aria-label="Preserving Tennis History"
              className="mt-7 select-none text-center text-[clamp(3.2rem,11vw,10.5rem)] font-black uppercase leading-[0.78] tracking-[-0.075em]"
            >
              <span className="block text-white">Preserving</span>
              <span className="block text-white/12">Tennis History</span>
            </div>

            <div className="mt-14 flex flex-col gap-5 border-t border-white/[0.08] pt-7 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/28">
                © 2026 AGE202. All rights reserved.
              </p>

              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/48">
                Second Hand <span className="mx-2 text-[#C8FF00]">•</span> First Set
              </p>

              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/28">
                Designed for tennis history
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </footer>
  );
}

type FooterLink = {
  href: string;
  label: string;
  external?: boolean;
};

type FooterColumnProps = {
  symbol: string;
  title: string;
  links: FooterLink[];
};

function FooterColumn({ symbol, title, links }: FooterColumnProps) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="text-sm leading-none text-[#C8FF00]"
        >
          {symbol}
        </span>

        <h3 className="text-[10px] font-black uppercase tracking-[0.26em] text-white">
          {title}
        </h3>
      </div>

      <div className="mt-7 flex flex-col items-start gap-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noreferrer" : undefined}
            className={[
              "group relative text-sm text-white/42 transition duration-300",
              "hover:translate-x-1 hover:text-[#C8FF00]",
              "focus-visible:rounded focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-[#C8FF00] focus-visible:ring-offset-4 focus-visible:ring-offset-[#050B18]",
            ].join(" ")}
          >
            <span className="mr-3 inline-block text-[#C8FF00]/0 transition duration-300 group-hover:text-[#C8FF00]/80">
              —
            </span>

            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}