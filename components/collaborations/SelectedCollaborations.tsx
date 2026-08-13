import {
  ArrowUpRight,
  Building2,
  Camera,
  Landmark,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";

import {
  CollaborationPartnerType,
} from "@/generated/prisma/client";

import {
  listPublishedCollaborations,
} from "@/lib/services/collaboration.service";


function getCollaborationIcon(
  partnerType: CollaborationPartnerType,
) {
  switch (partnerType) {
    case CollaborationPartnerType.TENNIS_BRAND:
      return Trophy;

    case CollaborationPartnerType.CLUB_EVENT:
      return Landmark;

    case CollaborationPartnerType.CREATIVE_STUDIO:
      return Camera;

    case CollaborationPartnerType.COLLECTOR:
      return Users;

    case CollaborationPartnerType.OTHER:
    default:
      return Building2;
  }
}


function getCategoryLabel(
  partnerType: CollaborationPartnerType,
): string {
  switch (partnerType) {
    case CollaborationPartnerType.TENNIS_BRAND:
      return "Brand Heritage";

    case CollaborationPartnerType.CLUB_EVENT:
      return "Club & Event";

    case CollaborationPartnerType.CREATIVE_STUDIO:
      return "Creative Studio";

    case CollaborationPartnerType.COLLECTOR:
      return "Collector Archive";

    case CollaborationPartnerType.OTHER:
    default:
      return "AGE202 Partnership";
  }
}


export default async function SelectedCollaborations() {
  const collaborations =
    await listPublishedCollaborations();


  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-[#071020]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(204,255,0,.08),transparent_28%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[#ccff00]" />

              <p className="text-[10px] font-black uppercase tracking-[.3em] text-[#ccff00]">
                Selected collaborations
              </p>
            </div>

            <h2 className="mt-6 max-w-xl text-4xl font-black uppercase leading-[.9] tracking-[-.05em] sm:text-6xl">
              Partnerships
              <span className="block text-[#ccff00]">
                become history.
              </span>
            </h2>
          </div>

          <div className="lg:pb-1">
            <p className="max-w-2xl text-base leading-8 text-white/55">
              AGE202 collaborations are conceived as part of the archive itself.
              Each project connects tennis culture, objects, places and people
              through a shared museum perspective.
            </p>

            <div className="mt-6 flex items-center gap-3 text-[9px] font-black uppercase tracking-[.24em] text-white/30">
              <Sparkles
                size={14}
                className="text-[#ccff00]"
              />
              AGE202 Partnership Archive
            </div>
          </div>
        </div>


        {collaborations.length > 0 ? (
          <div className="mt-16 border-t border-white/10">
            {collaborations.map(
              (
                collaboration,
                index,
              ) => {
                const Icon =
                  getCollaborationIcon(
                    collaboration.partnerType,
                  );

                const mediaUrl =
                  collaboration.media?.url ??
                  collaboration.imageUrl ??
                  null;

                const number =
                  String(
                    index + 1,
                  ).padStart(
                    2,
                    "0",
                  );

                const year =
                  collaboration.year
                    ? String(
                        collaboration.year,
                      )
                    : collaboration.period ??
                      "AGE202";

                const category =
                  collaboration.projectTitle ??
                  getCategoryLabel(
                    collaboration.partnerType,
                  );

                const target =
                  collaboration.href ??
                  collaboration.websiteUrl ??
                  null;

                const external =
                  Boolean(
                    collaboration.websiteUrl &&
                    target ===
                      collaboration.websiteUrl,
                  );

                return (
                  <article
                    key={collaboration.id}
                    id={collaboration.slug}
                    className="group relative overflow-hidden border-b border-white/10 py-8 lg:py-10"
                  >
                    <div className="grid overflow-hidden rounded-[2rem] border border-white/10 bg-[#08111f] shadow-[0_24px_70px_rgba(0,0,0,.28)] transition duration-500 hover:-translate-y-1 hover:border-[#ccff00]/35 lg:grid-cols-[.9fr_1.1fr]">
                      <div className="relative min-h-[280px] overflow-hidden border-b border-white/10 bg-[#050b18] sm:min-h-[340px] lg:min-h-[390px] lg:border-b-0 lg:border-r">
                        {mediaUrl ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={mediaUrl}
                              alt={
                                collaboration.media?.alt ??
                                collaboration.title
                              }
                              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]"
                            />

                            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(5,11,24,.9)_0%,rgba(5,11,24,.28)_40%,rgba(5,11,24,.04)_74%)]" />
                          </>
                        ) : (
                          <div className="absolute inset-0 grid place-items-center">
                            <Sparkles className="h-10 w-10 text-[#ccff00]/30" />
                          </div>
                        )}

                        <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-[#ccff00]/25 bg-[#050b18]/80 px-3 py-2 backdrop-blur">
                          <Icon
                            size={13}
                            className="text-[#ccff00]"
                          />

                          <span className="text-[8px] font-black uppercase tracking-[.22em] text-[#ccff00]">
                            {getCategoryLabel(
                              collaboration.partnerType,
                            )}
                          </span>
                        </div>

                        <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-[.2em] text-white/45">
                              {collaboration.partnerName}
                            </p>

                            <p className="mt-1 text-[8px] font-bold uppercase tracking-[.18em] text-[#ccff00]">
                              {year}
                            </p>
                          </div>

                          <span className="font-mono text-xs font-black tracking-[.2em] text-white/45">
                            {number}
                          </span>
                        </div>
                      </div>

                      <div className="relative flex flex-col p-6 sm:p-8 lg:p-10">
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_12%,rgba(204,255,0,.08),transparent_28%)]" />

                        <div className="relative">
                          <div className="flex items-center gap-3">
                            <span className="h-px w-8 bg-[#ccff00]" />

                            <p className="text-[9px] font-black uppercase tracking-[.26em] text-[#ccff00]">
                              {category}
                            </p>
                          </div>

                          <h3 className="mt-6 text-[clamp(2.2rem,4.5vw,4.7rem)] font-black uppercase leading-[.86] tracking-[-.055em]">
                            {collaboration.title}
                          </h3>

                          {collaboration.subtitle ? (
                            <p className="mt-4 text-sm font-black uppercase tracking-[.16em] text-white/42">
                              {collaboration.subtitle}
                            </p>
                          ) : null}

                          {collaboration.description ? (
                            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/52 sm:text-base sm:leading-8">
                              {collaboration.description}
                            </p>
                          ) : null}

                          <div className="mt-8 flex flex-wrap gap-2">
                            {collaboration.location ? (
                              <span className="rounded-full border border-white/10 bg-white/[.03] px-3 py-2 text-[8px] font-black uppercase tracking-[.18em] text-white/35">
                                {collaboration.location}
                              </span>
                            ) : null}

                            {collaboration.projectType ? (
                              <span className="rounded-full border border-white/10 bg-white/[.03] px-3 py-2 text-[8px] font-black uppercase tracking-[.18em] text-white/35">
                                {collaboration.projectType
                                  .replaceAll("_", " ")
                                  .toLowerCase()
                                  .replace(
                                    /\b\w/g,
                                    (letter) =>
                                      letter.toUpperCase(),
                                  )}
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <div className="relative mt-auto flex items-center justify-between gap-4 border-t border-white/10 pt-6">
                          <p className="text-[8px] font-black uppercase tracking-[.2em] text-white/25">
                            AGE202 · Partnership Archive
                          </p>

                          {target ? (
                            <a
                              href={target}
                              target={
                                external
                                  ? "_blank"
                                  : undefined
                              }
                              rel={
                                external
                                  ? "noreferrer"
                                  : undefined
                              }
                              aria-label={`Open ${collaboration.title}`}
                              className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/10 text-white/35 transition duration-300 hover:border-[#ccff00]/40 hover:bg-[#ccff00] hover:text-[#050B18]"
                            >
                              <ArrowUpRight
                                size={17}
                              />
                            </a>
                          ) : (
                            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/10 text-white/15">
                              <ArrowUpRight
                                size={17}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              },
            )}
          </div>
        ) : (
          <div className="mt-16 rounded-[2rem] border border-white/10 bg-white/[0.025] px-6 py-14 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-[#ccff00]/45" />

            <p className="mt-5 text-sm font-black uppercase tracking-[.18em] text-white/55">
              Partnership archive in progress
            </p>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/30">
              Published AGE202 collaborations will appear here automatically.
            </p>
          </div>
        )}


        <div className="mt-10 flex flex-wrap items-center justify-between gap-5">
          <p className="text-[8px] font-black uppercase tracking-[.22em] text-white/25">
            Selected projects · AGE202 Museum Partnership Archive
          </p>

          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-[#ccff00]/40" />

            <span className="text-[8px] font-black uppercase tracking-[.22em] text-[#ccff00]">
              Culture · Craft · Legacy
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}