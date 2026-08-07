"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";

type MuseumChapter = {
  id: string;
  label: string;
  shortLabel: string;
};

type MuseumNavigationProps = {
  accent: string;
  playerName: string;
};

const chapters: MuseumChapter[] = [
  {
    id: "champion-story",
    label: "The Story",
    shortLabel: "Story",
  },
  {
    id: "career-timeline",
    label: "The Career",
    shortLabel: "Career",
  },
  {
    id: "playing-style",
    label: "Playing Style",
    shortLabel: "Style",
  },
  {
    id: "equipment-section",
    label: "Equipment",
    shortLabel: "Equipment",
  },
  {
    id: "legacy-section",
    label: "The Legacy",
    shortLabel: "Legacy",
  },
  {
    id: "player-artifacts",
    label: "The Collection",
    shortLabel: "Collection",
  },
  {
    id: "digital-certificate",
    label: "Certificate",
    shortLabel: "Certificate",
  },
];

export default function MuseumNavigation({
  accent,
  playerName,
}: MuseumNavigationProps) {
  const [activeChapter, setActiveChapter] =
    useState<string>(
      chapters[0].id,
    );

  useEffect(() => {
    const availableSections =
      chapters
        .map((chapter) =>
          document.getElementById(
            chapter.id,
          ),
        )
        .filter(
          (
            section,
          ): section is HTMLElement =>
            section !== null,
        );

    if (
      availableSections.length === 0
    ) {
      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          const visibleEntries =
            entries
              .filter(
                (entry) =>
                  entry.isIntersecting,
              )
              .sort(
                (first, second) =>
                  second.intersectionRatio -
                  first.intersectionRatio,
              );

          const activeEntry =
            visibleEntries[0];

          if (activeEntry) {
            setActiveChapter(
              activeEntry.target.id,
            );
          }
        },
        {
          rootMargin:
            "-28% 0px -58% 0px",
          threshold: [
            0,
            0.1,
            0.25,
            0.5,
          ],
        },
      );

    availableSections.forEach(
      (section) => {
        observer.observe(section);
      },
    );

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <nav
      aria-label={`${playerName} museum chapters`}
      className="sticky top-0 z-40 border-y border-white/[0.07] bg-[#050B18]/90 backdrop-blur-2xl"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <div className="flex items-center gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="mr-2 hidden shrink-0 border-r border-white/10 pr-5 xl:block">
            <p className="font-mono text-[7px] font-black uppercase leading-[1.7] tracking-[0.2em] text-white/25">
              Museum journey
            </p>

            <p className="mt-1 max-w-36 truncate text-[10px] font-black uppercase leading-[1.6] tracking-[0.12em] text-white/60">
              {playerName}
            </p>
          </div>

          {chapters.map(
            (chapter, index) => {
              const isActive =
                activeChapter ===
                chapter.id;

              return (
                <Link
                  key={chapter.id}
                  href={`#${chapter.id}`}
                  aria-current={
                    isActive
                      ? "location"
                      : undefined
                  }
                  className={[
                    "group relative flex shrink-0 items-center gap-2.5 rounded-full border px-3.5 py-2.5 transition duration-300 sm:gap-3 sm:px-4",
                    isActive
                      ? "border-white/15 bg-white/[0.07]"
                      : "border-transparent text-white/35 hover:border-white/10 hover:bg-white/[0.035] hover:text-white/70",
                  ].join(" ")}
                >
                  <span
                    className="grid h-5 w-5 shrink-0 place-items-center rounded-full border font-mono text-[7px] font-black leading-none"
                    style={
                      isActive
                        ? {
                            color:
                              accent,
                            borderColor:
                              `${accent}65`,
                            backgroundColor:
                              `${accent}12`,
                            boxShadow:
                              `0 0 18px ${accent}18`,
                          }
                        : {
                            borderColor:
                              "rgba(255,255,255,0.10)",
                            color:
                              "rgba(255,255,255,0.25)",
                          }
                    }
                  >
                    {String(
                      index + 1,
                    ).padStart(
                      2,
                      "0",
                    )}
                  </span>

                  <span
                    className={[
                      "whitespace-nowrap py-0.5 text-[8px] font-black uppercase leading-[1.6] tracking-[0.14em] sm:text-[9px] sm:tracking-[0.15em]",
                      isActive
                        ? "text-white"
                        : "",
                    ].join(" ")}
                  >
                    <span className="sm:hidden">
                      {
                        chapter.shortLabel
                      }
                    </span>

                    <span className="hidden sm:inline">
                      {chapter.label}
                    </span>
                  </span>

                  {isActive ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-4 -bottom-[13px] h-px"
                      style={{
                        backgroundColor:
                          accent,
                        boxShadow:
                          `0 0 12px ${accent}`,
                      }}
                    />
                  ) : null}
                </Link>
              );
            },
          )}
        </div>
      </div>
    </nav>
  );
}