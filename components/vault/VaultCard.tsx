"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  type MouseEvent,
  useRef,
} from "react";

import {
  AccentLine,
  Label,
} from "@/components/museum-ui";
import type { VaultItem } from "@/data/vaultItems";

import VaultBadge from "./VaultBadge";

type VaultCardProps = {
  item: VaultItem;
  index?: number;
  priority?: boolean;
  className?: string;
};

export default function VaultCard({
  item,
  index = 0,
  priority = false,
  className = "",
}: VaultCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const smoothPointerX = useSpring(pointerX, {
    stiffness: 150,
    damping: 22,
    mass: 0.7,
  });

  const smoothPointerY = useSpring(pointerY, {
    stiffness: 150,
    damping: 22,
    mass: 0.7,
  });

  const rotateY = useTransform(
    smoothPointerX,
    [-1, 1],
    shouldReduceMotion ? [0, 0] : [-3.5, 3.5]
  );

  const rotateX = useTransform(
    smoothPointerY,
    [-1, 1],
    shouldReduceMotion ? [0, 0] : [3.5, -3.5]
  );

  const imageX = useTransform(
    smoothPointerX,
    [-1, 1],
    shouldReduceMotion ? [0, 0] : [-7, 7]
  );

  const imageY = useTransform(
    smoothPointerY,
    [-1, 1],
    shouldReduceMotion ? [0, 0] : [-6, 6]
  );

  const reflectionX = useTransform(
    smoothPointerX,
    [-1, 1],
    ["-75%", "75%"]
  );

  function handlePointerMove(
    event: MouseEvent<HTMLElement>
  ) {
    if (
      shouldReduceMotion ||
      !cardRef.current
    ) {
      return;
    }

    const bounds =
      cardRef.current.getBoundingClientRect();

    const normalizedX =
      ((event.clientX - bounds.left) /
        bounds.width) *
        2 -
      1;

    const normalizedY =
      ((event.clientY - bounds.top) /
        bounds.height) *
        2 -
      1;

    pointerX.set(normalizedX);
    pointerY.set(normalizedY);
  }

  function resetPointerPosition() {
    pointerX.set(0);
    pointerY.set(0);
  }

  const archiveNumber = String(index + 1).padStart(
    3,
    "0"
  );

  return (
    <motion.article
      ref={cardRef}
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              y: 40,
              scale: 0.98,
            }
      }
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      viewport={{
        once: true,
        amount: 0.18,
      }}
      transition={{
        duration: 0.75,
        delay: Math.min(index * 0.06, 0.3),
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseMove={handlePointerMove}
      onMouseLeave={resetPointerPosition}
      className={[
        "group relative min-w-0",
        "[perspective:1400px]",
        className,
      ].join(" ")}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative h-full"
      >
        <Link
          href={`/vault/${item.slug}`}
          aria-label={`Explore ${item.title}`}
          className={[
            "relative isolate flex h-full min-h-[640px] flex-col overflow-hidden",
            "rounded-[28px] border border-white/10",
            "bg-[#050B18]",
            "shadow-[0_30px_100px_rgba(0,0,0,0.42)]",
            "transition duration-500",
            "hover:border-white/20",
            "focus-visible:outline-none",
            "focus-visible:ring-2",
            "focus-visible:ring-[#C8FF00]",
            "focus-visible:ring-offset-4",
            "focus-visible:ring-offset-[#030814]",
          ].join(" ")}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-30 rounded-[28px] border border-white/[0.035]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-[8%] top-0 z-20 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 z-0 h-72 w-72 rounded-full opacity-20 blur-[110px] transition duration-700 group-hover:opacity-35"
            style={{
              backgroundColor: item.accent,
            }}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-[12%] bottom-[-12%] z-0 h-52 rounded-full opacity-15 blur-[90px] transition duration-700 group-hover:opacity-30"
            style={{
              backgroundColor: item.accent,
            }}
          />

          <div className="relative min-h-[420px] flex-1 overflow-hidden">
            <motion.div
              className="absolute -inset-3"
              style={{
                x: imageX,
                y: imageY,
              }}
            >
              <Image
                src={item.image}
                alt={`${item.title} — ${item.player}`}
                fill
                priority={priority}
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                className="object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-[1.045]"
              />
            </motion.div>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050B18] via-[#050B18]/15 to-black/25"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,transparent_0%,transparent_30%,rgba(0,0,0,0.24)_70%,rgba(0,0,0,0.62)_100%)]"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='.55'/%3E%3C/svg%3E\")",
              }}
            />

            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-y-[20%] z-20 w-[42%] rotate-[18deg] bg-gradient-to-r from-transparent via-white/[0.09] to-transparent blur-md"
              style={{
                left: reflectionX,
              }}
            />

            <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-4 p-5 sm:p-6">
              <VaultBadge rarity={item.rarity} />

              <div className="rounded-full border border-white/10 bg-black/25 px-3 py-2 backdrop-blur-xl">
                <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-white/45">
                  VAULT-{archiveNumber}
                </p>
              </div>
            </div>

            <div className="absolute bottom-5 left-5 z-20 sm:bottom-6 sm:left-6">
              <Label
                dot
                color={
                  item.available
                    ? item.accent
                    : undefined
                }
              >
                {item.available
                  ? "Available"
                  : "Private collection"}
              </Label>
            </div>

            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-3 right-3 z-10 text-[112px] font-black leading-none tracking-[-0.1em] text-white/[0.035] sm:text-[138px]"
            >
              {String(item.year).slice(-2)}
            </span>
          </div>

          <div className="relative z-20 border-t border-white/10 bg-[#050B18]/92 px-6 pb-6 pt-7 backdrop-blur-2xl sm:px-7 sm:pb-7">
            <div className="flex items-center gap-4">
              <AccentLine
                color={item.accent}
                width={34}
                animated={false}
              />

              <Label color={item.accent}>
                {item.collection}
              </Label>
            </div>

            <div className="mt-6 flex items-start justify-between gap-6">
              <div className="min-w-0">
                <p className="text-[9px] font-black uppercase tracking-[0.22em] text-white/30">
                  {item.player}
                </p>

                <h3 className="mt-3 text-2xl font-black leading-[1.02] tracking-[-0.045em] text-white transition duration-300 group-hover:text-white sm:text-[28px]">
                  {item.title}
                </h3>

                {item.subtitle && (
                  <p className="mt-3 text-xs leading-6 text-white/40">
                    {item.subtitle}
                  </p>
                )}
              </div>

              <div className="shrink-0 text-right">
                <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/25">
                  Year
                </p>

                <p className="mt-2 text-lg font-black text-white">
                  {item.year}
                </p>
              </div>
            </div>

            <p className="mt-6 line-clamp-3 text-sm leading-7 text-white/42">
              {item.description}
            </p>

            <div className="mt-7 grid grid-cols-2 overflow-hidden rounded-xl border border-white/10 bg-white/[0.018]">
              <VaultMetadata
                label="Brand"
                value={item.brand}
              />

              <VaultMetadata
                label="Rarity"
                value={item.rarity}
                className="border-l border-white/10"
              />
            </div>

            <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-6">
              <p className="text-[9px] font-black uppercase tracking-[0.24em] text-white/55 transition duration-300 group-hover:text-white">
                Explore piece
              </p>

              <span
                aria-hidden="true"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.025] text-sm text-white/60 transition duration-500 group-hover:translate-x-1 group-hover:border-white/20 group-hover:bg-white/[0.06] group-hover:text-white"
              >
                ↗
              </span>
            </div>
          </div>

          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-0 z-30 h-px w-0 transition-all duration-700 group-hover:w-full"
            style={{
              backgroundColor: item.accent,
              boxShadow: `0 0 22px ${item.accent}`,
            }}
          />

          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 right-0 z-30 h-20 w-px opacity-60"
            style={{
              background: `linear-gradient(to top, ${item.accent}, transparent)`,
            }}
          />
        </Link>
      </motion.div>
    </motion.article>
  );
}

type VaultMetadataProps = {
  label: string;
  value: string;
  className?: string;
};

function VaultMetadata({
  label,
  value,
  className = "",
}: VaultMetadataProps) {
  return (
    <div
      className={[
        "min-w-0 px-5 py-4",
        className,
      ].join(" ")}
    >
      <p className="text-[7px] font-black uppercase tracking-[0.22em] text-white/25">
        {label}
      </p>

      <p className="mt-2 truncate text-[10px] font-black uppercase tracking-[0.13em] text-white/70">
        {value}
      </p>
    </div>
  );
}