"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { motion, useInView } from "framer-motion";

import type { PlayerProfile } from "@/data/players";

type PlayerAchievementsProps = {
  player: PlayerProfile;
};

type Achievement = {
  index: string;
  label: string;
  value: string;
  numericValue?: number;
  prefix?: string;
  suffix?: string;
  description: string;
  classification: string;
};

export default function PlayerAchievements({
  player,
}: PlayerAchievementsProps) {
  const accentColor = player.theme.accent;

  const achievements: Achievement[] = [
    {
      index: "01",
      label: "Career Titles",
      value: player.careerTitles.toString(),
      numericValue: player.careerTitles,
      description:
        "ATP singles titles won across the player’s professional career.",
      classification: "Competition Record",
    },
    {
      index: "02",
      label: "Grand Slam Titles",
      value: player.grandSlamTitles.toString(),
      numericValue: player.grandSlamTitles,
      description:
        "Major singles championships won across the four Grand Slam tournaments.",
      classification: "Major Championship",
    },
    {
      index: "03",
      label: "Highest Ranking",
      value: `No. ${player.highestRanking}`,
      numericValue: player.highestRanking,
      prefix: "No. ",
      description:
        "The highest position reached in the official ATP singles ranking.",
      classification: "World Ranking",
    },
    {
      index: "04",
      label: "Weeks at No. 1",
      value: player.weeksAtNumberOne.toString(),
      numericValue: player.weeksAtNumberOne,
      description:
        "Total number of weeks spent at the summit of the ATP ranking.",
      classification: "Ranking Record",
    },
    {
      index: "05",
      label: "Turned Professional",
      value: player.turnedPro.toString(),
      numericValue: player.turnedPro,
      description:
        "The year in which the player officially began his professional career.",
      classification: "Career Archive",
    },
    {
      index: "06",
      label: "Playing Hand",
      value: getShortPlayingHand(player.playingHand),
      description: `${player.playingHand} with a ${player.backhand.toLowerCase()} backhand.`,
      classification: "Technical Profile",
    },
  ];

  return (
    <section
      id="achievements"
      className="relative isolate scroll-mt-28 overflow-hidden border-b border-white/10 bg-[#050B18] py-24 sm:py-32 lg:py-40"
      style={
        {
          "--player-accent": accentColor,
        } as CSSProperties
      }
    >
      <div className="pointer-events-none absolute inset-0 -z-20">
        <div
          className="absolute -left-72 top-[4%] h-[680px] w-[680px] rounded-full opacity-[0.065] blur-[220px]"
          style={{
            backgroundColor: accentColor,
          }}
        />

        <div
          className="absolute -right-72 bottom-[-10%] h-[650px] w-[650px] rounded-full opacity-[0.05] blur-[220px]"
          style={{
            backgroundColor: accentColor,
          }}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:92px_92px] opacity-35" />

      <motion.p
        initial={{
          opacity: 0,
          x: 100,
        }}
        whileInView={{
          opacity: 1,
          x: 0,
        }}
        viewport={{
          once: true,
          amount: 0.1,
        }}
        transition={{
          duration: 1.2,
          ease: [0.22, 1, 0.36, 1],
        }}
        aria-hidden="true"
        className="pointer-events-none absolute -right-[0.04em] top-[7%] -z-10 hidden select-none text-[25vw] font-black leading-none tracking-[-0.12em] text-white/[0.022] lg:block"
      >
        {player.initials}
      </motion.p>

      <div className="relative mx-auto w-full max-w-[1700px] px-6 md:px-10">
        <motion.div
          initial={{
            opacity: 0,
            y: 34,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="grid gap-10 border-b border-white/10 pb-12 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end lg:gap-16"
        >
          <div className="max-w-5xl">
            <div className="flex items-center gap-4">
              <span
                className="h-px w-10"
                style={{
                  backgroundColor: accentColor,
                }}
              />

              <p
                className="text-[9px] font-black uppercase tracking-[0.38em] sm:text-[10px]"
                style={{
                  color: accentColor,
                }}
              >
                Hall of Achievements
              </p>
            </div>

            <h2 className="mt-7 text-[clamp(3.5rem,7vw,7.8rem)] font-black leading-[0.84] tracking-[-0.075em] text-white">
              The numbers
              <span className="block text-white/28">
                behind greatness.
              </span>
            </h2>
          </div>

          <div className="max-w-xl lg:justify-self-end">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/28">
              Legacy Record
            </p>

            <p className="mt-4 text-sm leading-7 text-white/48 sm:text-base sm:leading-8">
              A museum overview of the victories, rankings and defining
              statistics that shaped {player.name}&apos;s place in tennis
              history.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            y: 28,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.35,
          }}
          transition={{
            duration: 0.85,
            delay: 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-10 grid overflow-hidden rounded-[28px] border border-white/10 bg-[#07101F]/80 backdrop-blur-xl sm:grid-cols-3"
        >
          <LegacySummaryItem
            label="Career Titles"
            value={player.careerTitles.toString()}
            accentColor={accentColor}
          />

          <LegacySummaryItem
            label="Grand Slams"
            value={player.grandSlamTitles.toString()}
            accentColor={accentColor}
          />

          <LegacySummaryItem
            label="Weeks at No. 1"
            value={player.weeksAtNumberOne.toString()}
            accentColor={accentColor}
          />
        </motion.div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {achievements.map((achievement, index) => (
            <AchievementCard
              key={achievement.label}
              achievement={achievement}
              accentColor={accentColor}
              animationDelay={index * 0.06}
            />
          ))}
        </div>

        <motion.div
          initial={{
            opacity: 0,
            y: 35,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.35,
          }}
          transition={{
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-24 overflow-hidden rounded-[32px] border border-white/10 bg-[#07101F]/78 sm:mt-32"
        >
          <div className="grid lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="relative overflow-hidden p-8 sm:p-12 lg:p-16">
              <div
                className="pointer-events-none absolute -left-32 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full opacity-[0.08] blur-[120px]"
                style={{
                  backgroundColor: accentColor,
                }}
              />

              <p className="relative text-[8px] font-black uppercase tracking-[0.32em] text-white/28">
                Curator&apos;s Conclusion
              </p>

              <p className="relative mt-7 max-w-4xl text-3xl font-black leading-[1.05] tracking-[-0.055em] text-white sm:text-5xl lg:text-6xl">
                Records measure achievement.
                <span className="block text-white/28">
                  Legacy gives it permanence.
                </span>
              </p>
            </div>

            <div className="flex flex-col justify-between border-t border-white/10 p-8 lg:border-l lg:border-t-0 lg:p-10">
              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/25">
                  Exhibition Progress
                </p>

                <div className="mt-5 flex items-end gap-3">
                  <span
                    className="text-5xl font-black tracking-[-0.06em]"
                    style={{
                      color: accentColor,
                    }}
                  >
                    06
                  </span>

                  <span className="pb-1 text-sm font-black tracking-[0.16em] text-white/25">
                    / 08
                  </span>
                </div>
              </div>

              <a
                href="#trophy-cabinet"
                className="group mt-12 flex items-center justify-between rounded-full border border-white/12 bg-white/[0.035] px-5 py-4 transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.07]"
              >
                <div>
                  <p className="text-[8px] font-black uppercase tracking-[0.28em] text-white/28">
                    Continue
                  </p>

                  <p className="mt-1 text-xs font-black uppercase tracking-[0.2em] text-white/70 transition-colors group-hover:text-white">
                    Trophy Cabinet
                  </p>
                </div>

                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full text-lg text-black transition-transform duration-500 group-hover:translate-y-1"
                  style={{
                    backgroundColor: accentColor,
                  }}
                >
                  ↓
                </span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

type AchievementCardProps = {
  achievement: Achievement;
  accentColor: string;
  animationDelay: number;
};

function AchievementCard({
  achievement,
  accentColor,
  animationDelay,
}: AchievementCardProps) {
  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 38,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.22,
      }}
      transition={{
        duration: 0.8,
        delay: animationDelay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative min-h-[360px] overflow-hidden rounded-[30px] border border-white/10 bg-[#08111F] transition-all duration-500 hover:-translate-y-2 hover:border-white/20 hover:shadow-[0_32px_100px_rgba(0,0,0,0.42)]"
    >
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-60 w-60 rounded-full opacity-0 blur-[90px] transition-opacity duration-700 group-hover:opacity-[0.1]"
        style={{
          backgroundColor: accentColor,
        }}
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-5 -top-12 select-none text-[170px] font-black leading-none tracking-[-0.1em] text-white/[0.025] transition-all duration-700 group-hover:-translate-y-2"
      >
        {achievement.index}
      </span>

      <div className="relative flex min-h-[360px] flex-col p-7 sm:p-9">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/25">
              Museum Record
            </p>

            <p
              className="mt-2 text-[8px] font-black uppercase tracking-[0.26em]"
              style={{
                color: accentColor,
              }}
            >
              {achievement.classification}
            </p>
          </div>

          <span className="text-[9px] font-black tracking-[0.28em] text-white/18 transition-colors duration-500 group-hover:text-white/50">
            {achievement.index}
          </span>
        </div>

        <div className="mt-auto pt-16">
          <AchievementValue
            value={achievement.value}
            numericValue={achievement.numericValue}
            prefix={achievement.prefix}
            suffix={achievement.suffix}
          />

          <h3 className="mt-6 text-[11px] font-black uppercase tracking-[0.23em] text-white/78">
            {achievement.label}
          </h3>

          <div className="mt-5 h-px bg-gradient-to-r from-white/15 via-white/5 to-transparent" />

          <p className="mt-5 max-w-md text-sm leading-7 text-white/38">
            {achievement.description}
          </p>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-700 group-hover:w-full"
        style={{
          backgroundColor: accentColor,
          boxShadow: `0 0 22px ${accentColor}`,
        }}
      />
    </motion.article>
  );
}

type AchievementValueProps = {
  value: string;
  numericValue?: number;
  prefix?: string;
  suffix?: string;
};

function AchievementValue({
  value,
  numericValue,
  prefix = "",
  suffix = "",
}: AchievementValueProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const isInView = useInView(containerRef, {
    once: true,
    amount: 0.6,
  });

  const animatedValue = useAnimatedNumber(
    numericValue,
    isInView,
    1300,
  );

  return (
    <div ref={containerRef}>
      <p className="break-words text-5xl font-black leading-none tracking-[-0.065em] text-white sm:text-6xl">
        {numericValue !== undefined
          ? `${prefix}${animatedValue}${suffix}`
          : value}
      </p>
    </div>
  );
}

type LegacySummaryItemProps = {
  label: string;
  value: string;
  accentColor: string;
};

function LegacySummaryItem({
  label,
  value,
  accentColor,
}: LegacySummaryItemProps) {
  return (
    <div className="group relative border-b border-white/10 p-7 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 sm:p-8">
      <p className="text-[8px] font-black uppercase tracking-[0.29em] text-white/25">
        {label}
      </p>

      <p className="mt-4 text-3xl font-black tracking-[-0.05em] text-white">
        {value}
      </p>

      <div
        className="absolute bottom-0 left-0 h-px w-0 transition-all duration-700 group-hover:w-full"
        style={{
          backgroundColor: accentColor,
        }}
      />
    </div>
  );
}

function useAnimatedNumber(
  target: number | undefined,
  shouldAnimate: boolean,
  duration: number,
): number {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (target === undefined || !shouldAnimate) {
      return;
    }

    let animationFrame = 0;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      const easedProgress = 1 - Math.pow(1 - progress, 4);
      const nextValue = Math.round(target * easedProgress);

      setDisplayValue(nextValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [duration, shouldAnimate, target]);

  return displayValue;
}

function getShortPlayingHand(
  playingHand: string,
): string {
  const normalizedValue = playingHand.toLowerCase();

  if (normalizedValue.includes("left")) {
    return "Left";
  }

  if (normalizedValue.includes("right")) {
    return "Right";
  }

  return playingHand;
}