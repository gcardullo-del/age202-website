"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import type { PlayerProfile } from "@/data/players";

type Props = {
  player: PlayerProfile;
};

type MuseumSection = {
  id: string;
  label: string;
  shortLabel: string;
};

const museumSections: MuseumSection[] = [
  {
    id: "hero",
    label: "Introduction",
    shortLabel: "Intro",
  },
  {
    id: "biography",
    label: "Biography",
    shortLabel: "Bio",
  },
  {
    id: "timeline",
    label: "Timeline",
    shortLabel: "Timeline",
  },
  {
    id: "achievements",
    label: "Achievements",
    shortLabel: "Records",
  },
  {
    id: "trophy-cabinet",
    label: "Trophy Cabinet",
    shortLabel: "Trophies",
  },
  {
    id: "player-archive",
    label: "Player Archive",
    shortLabel: "Archive",
  },
  {
    id: "related-legends",
    label: "Related Legends",
    shortLabel: "Legends",
  },
];

function ChevronIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="h-4 w-4"
      fill="none"
    >
      <path
        d="M7 5L12 10L7 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function MuseumNavigation({
  player,
}: Props) {
  const [activeSection, setActiveSection] =
    useState<string>("hero");
  const [scrollProgress, setScrollProgress] =
    useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const availableSections = useMemo(
    () =>
      museumSections.filter((section) =>
        typeof document === "undefined"
          ? true
          : Boolean(document.getElementById(section.id)),
      ),
    [],
  );

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop =
        window.scrollY ||
        document.documentElement.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;

      const nextProgress =
        scrollHeight > 0
          ? Math.min(
              Math.max(scrollTop / scrollHeight, 0),
              1,
            )
          : 0;

      setScrollProgress(nextProgress);
      setIsVisible(scrollTop > window.innerHeight * 0.45);
    };

    updateScrollProgress();

    window.addEventListener(
      "scroll",
      updateScrollProgress,
      {
        passive: true,
      },
    );

    window.addEventListener(
      "resize",
      updateScrollProgress,
    );

    return () => {
      window.removeEventListener(
        "scroll",
        updateScrollProgress,
      );
      window.removeEventListener(
        "resize",
        updateScrollProgress,
      );
    };
  }, []);

  useEffect(() => {
    const sectionElements = museumSections
      .map((section) =>
        document.getElementById(section.id),
      )
      .filter(
        (
          section,
        ): section is HTMLElement => Boolean(section),
      );

    if (sectionElements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (firstEntry, secondEntry) =>
              secondEntry.intersectionRatio -
              firstEntry.intersectionRatio,
          );

        if (visibleEntries.length > 0) {
          setActiveSection(
            visibleEntries[0].target.id,
          );
        }
      },
      {
        rootMargin: "-24% 0px -58% 0px",
        threshold: [0.05, 0.15, 0.3, 0.5],
      },
    );

    sectionElements.forEach((section) =>
      observer.observe(section),
    );

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section =
      document.getElementById(sectionId);

    if (!section) {
      return;
    }

    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    window.history.replaceState(
      null,
      "",
      `#${sectionId}`,
    );

    setActiveSection(sectionId);
  };

  return (
    <motion.aside
      aria-label={`${player.name} museum navigation`}
      initial={false}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : 22,
        pointerEvents: isVisible
          ? "auto"
          : "none",
      }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="fixed inset-x-0 bottom-4 z-50 px-4 md:bottom-6 md:px-6"
    >
      <div className="mx-auto w-full max-w-[1480px]">
        <div
          className="relative overflow-hidden rounded-[26px] border border-white/12 bg-[#06101D]/88 shadow-[0_24px_80px_rgba(0,0,0,0.48)] backdrop-blur-2xl"
          style={{
            boxShadow: `0 24px 80px rgba(0,0,0,0.48), 0 0 55px ${player.theme.glow}14`,
          }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${player.theme.accent}, transparent)`,
              opacity: 0.65,
            }}
          />

          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/8">
            <motion.div
              aria-hidden="true"
              className="h-full origin-left"
              style={{
                background: `linear-gradient(90deg, ${player.theme.accent}, ${player.theme.secondary})`,
                scaleX: scrollProgress,
              }}
            />
          </div>

          <div className="flex items-center gap-3 px-3 py-3 md:gap-5 md:px-5">
            <button
              type="button"
              onClick={() => scrollToSection("hero")}
              className="hidden shrink-0 items-center gap-3 border-r border-white/10 pr-5 text-left transition-opacity duration-300 hover:opacity-100 lg:flex"
              aria-label={`Return to the beginning of ${player.name}'s exhibition`}
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full border text-[10px] font-black uppercase tracking-[0.18em]"
                style={{
                  borderColor: `${player.theme.accent}55`,
                  color: player.theme.accent,
                  backgroundColor: `${player.theme.accent}0D`,
                }}
              >
                {player.initials}
              </span>

              <span>
                <span className="block text-[8px] font-black uppercase tracking-[0.28em] text-white/28">
                  AGE202 Museum
                </span>

                <span className="mt-1 block max-w-[150px] truncate text-[11px] font-black uppercase tracking-[0.18em] text-white/78">
                  {player.name}
                </span>
              </span>
            </button>

            <nav
              aria-label="Exhibition sections"
              className="min-w-0 flex-1"
            >
              <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:justify-center">
                {availableSections.map(
                  (section, index) => {
                    const isActive =
                      activeSection === section.id;

                    return (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() =>
                          scrollToSection(section.id)
                        }
                        aria-current={
                          isActive
                            ? "location"
                            : undefined
                        }
                        className="group relative flex shrink-0 items-center gap-2 rounded-full px-3 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] transition duration-400 md:px-4"
                        style={{
                          color: isActive
                            ? player.theme.accent
                            : "rgba(255,255,255,0.38)",
                          backgroundColor: isActive
                            ? `${player.theme.accent}12`
                            : "transparent",
                        }}
                      >
                        <span
                          className="flex h-5 w-5 items-center justify-center rounded-full border text-[8px] transition duration-400"
                          style={{
                            borderColor: isActive
                              ? `${player.theme.accent}70`
                              : "rgba(255,255,255,0.12)",
                            backgroundColor: isActive
                              ? `${player.theme.accent}18`
                              : "rgba(255,255,255,0.02)",
                          }}
                        >
                          {String(index + 1).padStart(
                            2,
                            "0",
                          )}
                        </span>

                        <span className="md:hidden">
                          {section.shortLabel}
                        </span>

                        <span className="hidden md:inline">
                          {section.label}
                        </span>

                        {isActive && (
                          <motion.span
                            layoutId="museum-navigation-active"
                            aria-hidden="true"
                            className="absolute inset-x-3 -bottom-0.5 h-px rounded-full"
                            style={{
                              backgroundColor:
                                player.theme.accent,
                              boxShadow: `0 0 16px ${player.theme.glow}`,
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 360,
                              damping: 32,
                            }}
                          />
                        )}
                      </button>
                    );
                  },
                )}
              </div>
            </nav>

            <button
              type="button"
              onClick={() => {
                const currentIndex =
                  availableSections.findIndex(
                    (section) =>
                      section.id === activeSection,
                  );

                const nextSection =
                  availableSections[
                    Math.min(
                      currentIndex + 1,
                      availableSections.length - 1,
                    )
                  ];

                if (nextSection) {
                  scrollToSection(nextSection.id);
                }
              }}
              className="hidden shrink-0 items-center gap-3 rounded-full border border-white/10 bg-white/[0.035] px-4 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-white/58 transition duration-400 hover:border-white/25 hover:bg-white/[0.07] hover:text-white xl:flex"
            >
              Next Gallery

              <span
                style={{
                  color: player.theme.accent,
                }}
              >
                <ChevronIcon />
              </span>
            </button>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}