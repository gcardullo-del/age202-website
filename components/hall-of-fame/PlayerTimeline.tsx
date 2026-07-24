"use client";

import { motion } from "framer-motion";

import type {
  PlayerProfile,
  PlayerTimelineEvent,
} from "@/data/players";

type PlayerTimelineProps = {
  player: PlayerProfile;
};

export default function PlayerTimeline({
  player,
}: PlayerTimelineProps) {
  const accentColor = player.theme.accent;

  return (
    <section
      id="timeline"
      className="relative isolate scroll-mt-28 overflow-hidden border-y border-white/10 bg-[#050B18] py-24 md:py-32 lg:py-40"
      style={
        {
          "--player-accent": accentColor,
        } as React.CSSProperties
      }
    >
      <div className="pointer-events-none absolute inset-0 -z-20">
        <div
          className="absolute -left-48 top-20 h-[560px] w-[560px] rounded-full opacity-[0.065] blur-[190px]"
          style={{ backgroundColor: accentColor }}
        />

        <div
          className="absolute -right-48 bottom-0 h-[560px] w-[560px] rounded-full opacity-[0.04] blur-[190px]"
          style={{ backgroundColor: player.theme.secondary }}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:90px_90px] opacity-30" />

      <motion.p
        initial={{ opacity: 0, x: 80 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
        className="pointer-events-none absolute -right-[0.04em] top-[4%] -z-10 hidden select-none text-[22vw] font-black leading-none tracking-[-0.12em] text-white/[0.022] lg:block"
      >
        {player.lastName.toUpperCase()}
      </motion.p>

      <div className="relative mx-auto w-full max-w-[1700px] px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-10 border-b border-white/10 pb-10 sm:pb-12 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.42fr)] lg:items-end"
        >
          <div className="max-w-5xl">
            <div className="flex items-center gap-4">
              <span
                className="h-px w-10 sm:w-16"
                style={{ backgroundColor: accentColor }}
              />

              <p
                className="text-[9px] font-black uppercase tracking-[0.4em] sm:text-[10px]"
                style={{ color: accentColor }}
              >
                Career Timeline
              </p>
            </div>

            <h2 className="mt-7 text-[clamp(3.4rem,7vw,7.5rem)] font-black leading-[0.84] tracking-[-0.07em] text-white">
              Defining moments of
              <span className="block text-white/24">{player.lastName}.</span>
            </h2>

            <p className="mt-8 max-w-3xl text-base leading-8 text-white/45 md:text-lg md:leading-9">
              A chronological journey through the milestones that shaped{" "}
              {player.name} and secured his place in tennis history.
            </p>
          </div>

          <aside className="border-t border-white/10 pt-7 lg:border-l lg:border-t-0 lg:pl-9 lg:pt-0">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/28">
              Recorded Milestones
            </p>

            <p
              className="mt-4 font-mono text-5xl font-bold tracking-[-0.06em] sm:text-6xl"
              style={{ color: accentColor }}
            >
              {String(player.timeline.length).padStart(2, "0")}
            </p>

            <p className="mt-3 text-[9px] font-bold uppercase leading-5 tracking-[0.22em] text-white/28">
              Selected chapters from a career preserved by AGE202
            </p>
          </aside>
        </motion.div>

        <div className="relative mt-20 md:mt-28 lg:mt-32">
          <div
            className="absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 lg:block"
            style={{
              background: `linear-gradient(to bottom, ${accentColor}, rgba(255,255,255,0.18), transparent)`,
            }}
          />

          <div
            className="absolute bottom-0 left-[19px] top-0 w-px lg:hidden"
            style={{
              background: `linear-gradient(to bottom, ${accentColor}, rgba(255,255,255,0.18), transparent)`,
            }}
          />

          <div className="w-full space-y-8 lg:space-y-0">
            {player.timeline.map((event, index) => (
              <TimelineItem
                key={`${event.year}-${event.title}`}
                event={event}
                index={index}
                accentColor={accentColor}
              />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-24 sm:mt-32 lg:mt-40"
        >
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/16 to-transparent" />

          <div className="mt-8 flex flex-col items-center justify-between gap-7 text-center sm:flex-row sm:text-left">
            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/28">
                Continue the Exhibition
              </p>

              <p className="mt-3 text-xl font-black tracking-[-0.035em] text-white sm:text-2xl">
                Records and achievements
              </p>
            </div>

            <a
              href="#achievements"
              className="group flex items-center gap-5 rounded-full border border-white/12 bg-white/[0.04] px-6 py-4 transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.07]"
            >
              <span className="text-[9px] font-black uppercase tracking-[0.27em] text-white/60 transition-colors duration-300 group-hover:text-white">
                Continue
              </span>

              <span
                className="flex h-9 w-9 items-center justify-center rounded-full text-base text-black transition-transform duration-500 group-hover:translate-y-1"
                style={{ backgroundColor: accentColor }}
              >
                ↓
              </span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

type TimelineItemProps = {
  event: PlayerTimelineEvent;
  index: number;
  accentColor: string;
};

function TimelineItem({
  event,
  index,
  accentColor,
}: TimelineItemProps) {
  const isLeft = index % 2 === 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.85,
        delay: Math.min(index * 0.06, 0.3),
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`group relative grid gap-6 pl-14 lg:min-h-[280px] lg:grid-cols-[1fr_120px_1fr] lg:items-center lg:gap-10 lg:pl-0 ${
        index > 0 ? "lg:-mt-9" : ""
      }`}
    >
      <div
        className="absolute left-0 top-8 flex h-10 w-10 items-center justify-center rounded-full border bg-[#07101F] lg:hidden"
        style={{
          borderColor: `${accentColor}66`,
          boxShadow: `0 0 30px ${accentColor}14`,
        }}
      >
        <div
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
      </div>

      <div
        className={
          isLeft
            ? "lg:col-start-1 lg:text-right"
            : "lg:col-start-3 lg:row-start-1"
        }
      >
        <TimelineCard
          event={event}
          index={index}
          alignment={isLeft ? "right" : "left"}
          accentColor={accentColor}
        />
      </div>

      <div className="relative hidden h-full items-center justify-center lg:col-start-2 lg:row-start-1 lg:flex">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-[#07101F] transition-all duration-500 group-hover:scale-110">
          <div className="absolute inset-[7px] rounded-full border border-white/[0.06]" />

          <span
            className="relative text-[10px] font-black tracking-[0.25em]"
            style={{ color: accentColor }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>

          <div
            className="absolute -bottom-1 h-2.5 w-2.5 rounded-full"
            style={{
              backgroundColor: accentColor,
              boxShadow: `0 0 16px ${accentColor}`,
            }}
          />
        </div>
      </div>

      <div
        className={`hidden lg:block ${
          isLeft
            ? "lg:col-start-3 lg:row-start-1"
            : "lg:col-start-1 lg:row-start-1"
        }`}
      >
        <p
          className={`text-7xl font-black tracking-[-0.07em] text-white/[0.025] transition-colors duration-500 group-hover:text-white/[0.05] ${
            isLeft ? "text-left" : "text-right"
          }`}
        >
          {event.year}
        </p>
      </div>
    </motion.article>
  );
}

type TimelineCardProps = {
  event: PlayerTimelineEvent;
  index: number;
  alignment: "left" | "right";
  accentColor: string;
};

function TimelineCard({
  event,
  index,
  alignment,
  accentColor,
}: TimelineCardProps) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-[30px] border border-white/10 bg-[#0A1425]/88 p-7 backdrop-blur-xl transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_25px_80px_rgba(0,0,0,0.35)] md:p-9 lg:max-w-[620px] ${
        alignment === "right" ? "lg:ml-auto" : "lg:mr-auto"
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-0 blur-[70px] transition-opacity duration-500 group-hover:opacity-[0.08]"
        style={{ backgroundColor: accentColor }}
      />

      <div className="relative flex items-start justify-between gap-6">
        <div>
          <p className="text-4xl font-black tracking-[-0.05em] text-white md:text-5xl">
            {event.year}
          </p>

          <p
            className="mt-2 text-[9px] font-black uppercase tracking-[0.3em]"
            style={{ color: accentColor }}
          >
            {event.category ?? "Career milestone"}
          </p>
        </div>

        <span className="text-[10px] font-black tracking-[0.28em] text-white/16">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <h3 className="relative mt-8 text-2xl font-black tracking-[-0.025em] text-white md:text-3xl">
        {event.title}
      </h3>

      <p className="relative mt-5 text-sm leading-7 text-white/42 md:text-base md:leading-8">
        {event.description}
      </p>

      <div
        className="absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-700 group-hover:w-full"
        style={{ backgroundColor: accentColor }}
      />
    </div>
  );
}