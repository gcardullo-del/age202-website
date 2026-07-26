import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

type Feature = {
  title: string;
  description: string;
  href?: string;
  image?: string;
  label?: string;
  period?: string;
};

type PlatformPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  icon: LucideIcon;
  features: Feature[];

  sectionEyebrow?: string;
  sectionTitle?: string;
  sectionDescription?: string;
  status?: string | null;
};

export default function PlatformPage({
  eyebrow,
  title,
  intro,
  icon: Icon,
  features,
  sectionEyebrow = "Museum collections",
  sectionTitle = "Explore the galleries",
  sectionDescription,
  status = null,
}: PlatformPageProps) {
  return (
    <div className="min-h-screen bg-[#050b18] text-white">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10 px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(215,255,0,.10),transparent_34%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(5,11,24,.5)_100%)]" />

        <div className="relative mx-auto max-w-[1440px]">
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[.3em] text-[#d7ff00]">
            <span className="h-px w-9 bg-[#d7ff00]" />
            {eyebrow}
          </div>

          <div className="mt-9 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="max-w-5xl text-5xl font-black uppercase leading-[.88] tracking-[-.06em] sm:text-7xl lg:text-8xl">
                {title}
              </h1>

              <p className="mt-8 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
                {intro}
              </p>
            </div>

            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[#d7ff00]/35 bg-[#d7ff00]/[.06] text-[#d7ff00] sm:h-28 sm:w-28">
              <Icon size={38} strokeWidth={1.35} />
            </div>
          </div>
        </div>
      </section>

      {/* COLLECTIONS */}
      <section className="px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-10 flex flex-col justify-between gap-6 border-t border-white/10 pt-6 md:flex-row md:items-end">
            <div>
              <div className="mb-4 h-0.5 w-8 bg-[#d7ff00]" />

              <p className="text-[10px] font-black uppercase tracking-[.28em] text-[#d7ff00]">
                {sectionEyebrow}
              </p>

              <h2 className="mt-3 text-3xl font-black uppercase tracking-[-.045em] sm:text-5xl">
                {sectionTitle}
              </h2>
            </div>

            {(sectionDescription || status) && (
              <div className="max-w-md md:text-right">
                {sectionDescription && (
                  <p className="text-sm leading-7 text-white/50">
                    {sectionDescription}
                  </p>
                )}

                {status && (
                  <p className="mt-3 text-[9px] font-black uppercase tracking-[.2em] text-[#d7ff00]">
                    {status}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature, index) => {
              const card = (
                <article className="group relative min-h-[430px] overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#0b132b] transition duration-500 hover:-translate-y-1 hover:border-[#d7ff00]/45">
                  {feature.image ? (
                    <>
                      <Image
                        src={feature.image}
                        alt=""
                        fill
                        aria-hidden="true"
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="scale-110 object-cover opacity-35 blur-2xl transition duration-700 group-hover:scale-[1.16] group-hover:opacity-45"
                      />

                      <div className="absolute inset-0 bg-[#071021]/25" />

                      <Image
                        src={feature.image}
                        alt={`${feature.title} collection`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-contain p-4 pb-36 transition duration-700 group-hover:scale-[1.035]"
                      />
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(215,255,0,.10),transparent_38%)]" />
                  )}

                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,11,24,.04)_10%,rgba(5,11,24,.20)_50%,rgba(5,11,24,.98)_100%)]" />

                  <div className="absolute inset-x-0 top-0 flex items-start justify-between p-6">
                    <span className="text-[10px] font-black uppercase tracking-[.22em] text-[#d7ff00]">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {feature.label && (
                      <span className="rounded-full border border-white/15 bg-[#050b18]/60 px-3 py-2 text-[8px] font-black uppercase tracking-[.18em] text-white/70 backdrop-blur">
                        {feature.label}
                      </span>
                    )}
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-6">
                    {(feature.period || feature.label) && (
                      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
                        <p className="text-[9px] font-black uppercase tracking-[.2em] text-[#d7ff00]">
                          {feature.label ?? "AGE202 gallery"}
                        </p>

                        {feature.period && (
                          <p className="text-[8px] font-bold uppercase tracking-[.16em] text-white/45">
                            {feature.period}
                          </p>
                        )}
                      </div>
                    )}

                    <h3 className="text-2xl font-black uppercase leading-[.9] tracking-[-.04em] sm:text-3xl">
                      {feature.title}
                    </h3>

                    <p className="mt-4 line-clamp-3 text-sm leading-7 text-white/55">
                      {feature.description}
                    </p>

                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase tracking-[.2em] text-white/70 transition group-hover:text-white">
                        Enter gallery
                      </span>

                      {feature.href && (
                        <span className="grid h-10 w-10 place-items-center rounded-full border border-[#d7ff00]/70 text-[#d7ff00] transition duration-300 group-hover:bg-[#d7ff00] group-hover:text-[#030812]">
                          <ArrowRight
                            size={16}
                            className="transition-transform group-hover:translate-x-0.5"
                          />
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="absolute left-0 top-0 h-1 w-0 bg-[#d7ff00] transition-all duration-700 group-hover:w-full" />
                </article>
              );

              return feature.href ? (
                <Link
                  key={feature.title}
                  href={feature.href}
                  className="block"
                >
                  {card}
                </Link>
              ) : (
                <div key={feature.title}>{card}</div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}