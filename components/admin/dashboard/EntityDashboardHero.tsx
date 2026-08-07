"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { ImageIcon } from "lucide-react";

export type EntityDashboardHeroProps = {
  title: string;
  subtitle?: string;
  image?: string | null;
  badge?: ReactNode;
  status?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
};

export default function EntityDashboardHero({
  title,
  subtitle,
  image,
  badge,
  status,
  meta,
  actions,
}: EntityDashboardHeroProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#050B18]">
      <div className="grid lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="relative aspect-[4/3] lg:aspect-auto min-h-[280px] bg-[#08111F]">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              sizes="320px"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-white/25">
              <ImageIcon className="h-10 w-10" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-transparent to-transparent" />
        </div>

        <div className="flex flex-col justify-between p-6 lg:p-8">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              {badge}
              {status}
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-[-0.05em] text-white">
              {title}
            </h1>

            {subtitle ? (
              <p className="mt-3 text-base text-white/45">
                {subtitle}
              </p>
            ) : null}

            {meta ? (
              <div className="mt-6">
                {meta}
              </div>
            ) : null}
          </div>

          {actions ? (
            <div className="mt-8 border-t border-white/10 pt-6">
              {actions}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}