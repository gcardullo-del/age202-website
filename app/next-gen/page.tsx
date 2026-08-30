import {
  ArrowDown,
  Camera,
  Quote,
  Trophy,
} from "lucide-react";

import type {
  ReactNode,
} from "react";


type NextGenPlayer = {
  number: string;
  name: string;
  country: string;
  flag: string;
  age: number;
  birthDate: string;
  plays: string;
  ranking: string;
  careerHigh: string;
  story: string[];
  highlights: {
    title: string;
    detail?: string;
    year: string;
  }[];
  contribution?: {
    dedicatedPhoto?: boolean;
    personalMessage?: boolean;
    signedMemorabilia?: boolean;
  };
};


const players: NextGenPlayer[] = [
  {
    number: "01",
    name: "Moïse Kouamé",
    country: "France",
    flag: "🇫🇷",
    age: 17,
    birthDate: "06 Mar 2009",
    plays:
      "Right-handed · Two-handed backhand",
    ranking: "#200",
    careerHigh: "#200",
    story: [
      "Born in Sarcelles, France, on 6 March 2009, Moïse Kouamé emerged as one of the most precocious talents of his generation.",
      "His breakthrough accelerated in 2026, when he collected three ITF professional titles and began making his mark on the ATP Tour.",
      "At Roland Garros 2026, he reached the third round and produced one of the standout runs of the tournament, confirming his place among the most closely watched young players in men's tennis.",
    ],
    highlights: [
      {
        title:
          "Roland Garros — Third Round",
        detail:
          "Youngest Frenchman to reach the third round at Roland Garros in the Open Era.",
        year: "2026",
      },
      {
        title:
          "Historic Win over Marin Čilić",
        detail:
          "Youngest player in the Open Era to defeat a Grand Slam champion at Roland Garros.",
        year: "2026",
      },
      {
        title:
          "Three ITF Professional Titles",
        detail:
          "Won three ITF World Tennis Tour singles titles during the 2026 season.",
        year: "2026",
      },
      {
        title:
          "Next Gen ATP Race — No. 6",
        detail:
          "Ranked sixth in the Next Gen ATP Race on 4 August 2026.",
        year: "2026",
      },
      {
        title: "ATP Career High",
        detail:
          "Reached a career-high ranking of No. 200 on 24 August 2026.",
        year: "2026",
      },
    ],
  },
];


function PortraitPlaceholder({
  playerName,
}: {
  playerName: string;
}) {
  return (
    <div className="relative min-h-[340px] overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(145deg,#0b1220,#050914)] sm:min-h-[480px] lg:min-h-[580px] lg:rounded-[28px]">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(200,255,0,0.08),transparent_32%)]"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center sm:px-8">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#C8FF00]/25 bg-[#C8FF00]/5 text-[#C8FF00] sm:h-20 sm:w-20">
          <Camera
            size={30}
            aria-hidden="true"
          />
        </div>

        <p className="font-mono text-[8px] font-bold uppercase tracking-[0.24em] text-[#C8FF00] sm:text-[10px]">
          Official Player Portrait
        </p>

        <p className="mt-3 max-w-xs text-xl font-semibold uppercase leading-tight tracking-tight text-white sm:max-w-sm sm:text-2xl">
          To be selected with{" "}
          {playerName}
        </p>

        <p className="mt-4 max-w-sm text-xs leading-6 text-white/45 sm:max-w-md sm:text-sm sm:leading-7">
          The final portrait will be
          selected together with the
          player or their management.
        </p>
      </div>
    </div>
  );
}


function ContributionOption({
  icon,
  title,
  active,
}: {
  icon: ReactNode;
  title: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center gap-4 border-t border-white/10 py-4 first:border-t-0 sm:border-t-0 sm:py-0">
      <div
        className={[
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border",
          active
            ? "border-[#C8FF00]/70 bg-[#C8FF00]/10 text-[#C8FF00]"
            : "border-white/10 bg-white/[0.025] text-[#C8FF00]/65",
        ].join(" ")}
      >
        {icon}
      </div>

      <span className="text-xs font-bold uppercase leading-5 tracking-[0.08em] text-white/70">
        {title}
      </span>
    </div>
  );
}


function PlayerContribution({
  player,
}: {
  player: NextGenPlayer;
}) {
  const hasDedicatedPhoto =
    player.contribution
      ?.dedicatedPhoto === true;

  const hasPersonalMessage =
    player.contribution
      ?.personalMessage === true;

  const hasSignedMemorabilia =
    player.contribution
      ?.signedMemorabilia === true;

  const hasContribution =
    hasDedicatedPhoto ||
    hasPersonalMessage ||
    hasSignedMemorabilia;

  return (
    <div className="overflow-hidden rounded-[22px] border border-[#C8FF00]/45 bg-[linear-gradient(135deg,rgba(200,255,0,0.03),rgba(255,255,255,0.012))] lg:rounded-[26px]">
      <div className="lg:grid lg:grid-cols-[230px_minmax(0,1fr)_420px] xl:grid-cols-[250px_minmax(0,1fr)_440px]">
        <div className="flex items-center gap-5 border-b border-white/10 px-5 py-5 sm:px-7 lg:flex-col lg:justify-center lg:border-b-0 lg:border-r lg:px-8 lg:py-8 lg:text-center">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#C8FF00]/45 bg-[#C8FF00]/[0.025] lg:h-24 lg:w-24">
            <Trophy
              size={26}
              strokeWidth={1.4}
              className="text-[#C8FF00] lg:h-[38px] lg:w-[38px]"
              aria-hidden="true"
            />
          </div>

          <div>
            <p className="font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-white/35 lg:hidden">
              Museum Collection
            </p>

            <p className="mt-1 text-base font-black uppercase leading-tight tracking-[0.05em] text-[#C8FF00] lg:mt-5 lg:text-lg">
              The AGE202
              <br className="hidden lg:block" />{" "}
              Archive
            </p>
          </div>
        </div>

        <div className="px-5 py-6 sm:px-7 sm:py-8 lg:p-10">
          <p className="font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-white/45 sm:text-[9px]">
            Reserved for a personal
            contribution
          </p>

          <h3 className="mt-2 text-2xl font-black uppercase tracking-tight text-[#C8FF00] sm:text-3xl">
            From the Player
          </h3>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55">
            This space is reserved for a
            special contribution from{" "}
            <span className="font-bold uppercase text-white">
              {player.name}
            </span>{" "}
            to the AGE202 Archive.
          </p>

          <div className="mt-5 h-px w-10 bg-[#C8FF00]" />

          <div className="mt-5 sm:hidden">
            <ContributionOption
              active={hasDedicatedPhoto}
              icon={
                <Camera
                  size={20}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              }
              title="Dedicated Photograph"
            />

            <ContributionOption
              active={
                hasSignedMemorabilia
              }
              icon={
                <Trophy
                  size={20}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              }
              title="Signed Memorabilia"
            />

            <ContributionOption
              active={hasPersonalMessage}
              icon={
                <Quote
                  size={20}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              }
              title="Personal Message"
            />
          </div>

          <div className="mt-7 hidden grid-cols-3 gap-6 sm:grid">
            <div className="flex items-center gap-4">
              <Camera
                size={28}
                strokeWidth={1.5}
                className={
                  hasDedicatedPhoto
                    ? "shrink-0 text-[#C8FF00]"
                    : "shrink-0 text-[#C8FF00]/70"
                }
                aria-hidden="true"
              />

              <span className="text-xs font-bold uppercase leading-5 tracking-wide text-white/70">
                Dedicated
                <br />
                Photograph
              </span>
            </div>

            <div className="flex items-center gap-4 border-l border-white/10 pl-6">
              <Trophy
                size={28}
                strokeWidth={1.5}
                className={
                  hasSignedMemorabilia
                    ? "shrink-0 text-[#C8FF00]"
                    : "shrink-0 text-[#C8FF00]/70"
                }
                aria-hidden="true"
              />

              <span className="text-xs font-bold uppercase leading-5 tracking-wide text-white/70">
                Signed
                <br />
                Memorabilia
              </span>
            </div>

            <div className="flex items-center gap-4 border-l border-white/10 pl-6">
              <Quote
                size={28}
                strokeWidth={1.5}
                className={
                  hasPersonalMessage
                    ? "shrink-0 text-[#C8FF00]"
                    : "shrink-0 text-[#C8FF00]/70"
                }
                aria-hidden="true"
              />

              <span className="text-xs font-bold uppercase leading-5 tracking-wide text-white/70">
                Personal
                <br />
                Message
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 p-4 sm:p-6 lg:border-l lg:border-t-0">
          <div className="flex min-h-[145px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#C8FF00]/35 bg-black/20 px-5 py-6 text-center sm:min-h-[180px] lg:h-full lg:min-h-[230px]">
            {hasContribution ? (
              <>
                <Trophy
                  size={34}
                  strokeWidth={1.25}
                  className="text-[#C8FF00] sm:h-10 sm:w-10"
                  aria-hidden="true"
                />

                <p className="mt-3 text-xs font-bold uppercase tracking-[0.1em] text-white sm:mt-4 sm:text-sm">
                  Contribution Received
                </p>

                <p className="mt-2 max-w-xs text-xs leading-5 text-[#C8FF00]/75">
                  Preserved in the AGE202
                  Archive.
                </p>
              </>
            ) : (
              <>
                <Camera
                  size={34}
                  strokeWidth={1.2}
                  className="text-white/25 sm:h-11 sm:w-11"
                  aria-hidden="true"
                />

                <p className="mt-3 text-xs font-bold uppercase tracking-[0.1em] text-white/70 sm:mt-4 sm:text-sm">
                  Awaiting Contribution
                </p>

                <p className="mt-2 max-w-xs text-xs leading-5 text-[#C8FF00]/70">
                  This space will be
                  updated when a
                  contribution is
                  received.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


function PlayerSection({
  player,
  index,
}: {
  player: NextGenPlayer;
  index: number;
}) {
  const reverse =
    index % 2 === 1;

  return (
    <section
      id={`player-${player.number}`}
      className="scroll-mt-[110px] border-t border-white/10 px-5 py-14 sm:scroll-mt-[120px] sm:px-8 sm:py-20 lg:scroll-mt-[130px] lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-[1500px]">
        <div
          className={[
            "grid items-start gap-12 sm:gap-12 lg:grid-cols-12 lg:gap-16",
            reverse
              ? "lg:[direction:rtl]"
              : "",
          ].join(" ")}
        >
          <div className="lg:col-span-5 lg:[direction:ltr]">
            <PortraitPlaceholder
              playerName={player.name}
            />
          </div>

          <div className="lg:col-span-7 lg:[direction:ltr]">
            <div className="flex items-start justify-between gap-5">
              <div className="min-w-0">
                <p className="font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-[#C8FF00] sm:text-[9px]">
                  AGE202 Next Gen ·{" "}
                  {player.number}
                </p>

                <div className="mt-4 flex items-center gap-3">
                  <span className="text-xl sm:text-2xl">
                    {player.flag}
                  </span>

                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/45 sm:text-[10px]">
                    {player.country}
                  </span>
                </div>

                <h2 className="mt-4 break-words text-[2.65rem] font-black uppercase leading-[0.9] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl xl:text-8xl">
                  {player.name}
                </h2>
              </div>

              <span className="hidden shrink-0 font-mono text-5xl font-black text-white/10 sm:block">
                {player.number}
              </span>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-4">
              <div className="min-h-[105px] bg-[#07101d] p-4 sm:p-5">
                <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/35">
                  Age
                </p>

                <p className="mt-2 text-xl font-bold text-white">
                  {player.age}
                </p>

                <p className="mt-1 text-[10px] leading-4 text-white/35 sm:text-xs">
                  {player.birthDate}
                </p>
              </div>

              <div className="min-h-[105px] bg-[#07101d] p-4 sm:p-5">
                <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/35">
                  Plays
                </p>

                <p className="mt-2 text-xs font-bold leading-5 text-white sm:text-sm sm:leading-6">
                  {player.plays}
                </p>
              </div>

              <div className="min-h-[105px] bg-[#07101d] p-4 sm:p-5">
                <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/35">
                  ATP Ranking
                </p>

                <p className="mt-2 text-3xl font-black text-[#C8FF00]">
                  {player.ranking}
                </p>
              </div>

              <div className="min-h-[105px] bg-[#07101d] p-4 sm:p-5">
                <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/35">
                  Career High
                </p>

                <p className="mt-2 text-3xl font-black text-[#C8FF00]">
                  {player.careerHigh}
                </p>
              </div>
            </div>

            <div className="mt-10 grid gap-10 xl:grid-cols-2 xl:gap-12">
              <div>
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-[#C8FF00]">
                  The Story
                </p>

                <div className="mt-5 space-y-5">
                  {player.story.map(
                    (paragraph) => (
                      <p
                        key={paragraph}
                        className="text-sm leading-7 text-white/60 sm:text-[15px] sm:leading-8"
                      >
                        {paragraph}
                      </p>
                    ),
                  )}
                </div>
              </div>

              <div>
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-[#C8FF00]">
                  Career to Date
                </p>

                <div className="mt-5 divide-y divide-white/10 border-y border-white/10">
                  {player.highlights.map(
                    (highlight) => (
                      <div
                        key={`${highlight.title}-${highlight.year}`}
                        className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 py-4 sm:gap-6"
                      >
                        <div>
                          <p className="text-xs font-bold uppercase leading-5 tracking-wide text-white sm:text-sm">
                            {
                              highlight.title
                            }
                          </p>

                          {highlight.detail ? (
                            <p className="mt-1 text-xs leading-5 text-white/50">
                              {
                                highlight.detail
                              }
                            </p>
                          ) : null}
                        </div>

                        <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-white/35 sm:text-[9px]">
                          {
                            highlight.year
                          }
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 sm:mt-12 lg:mt-14">
          <PlayerContribution
            player={player}
          />
        </div>
      </div>
    </section>
  );
}


export default function NextGenPage() {
  return (
    <main className="min-h-screen bg-[#030914] text-white">
      <section className="relative overflow-hidden border-b border-white/10 px-5 pb-10 pt-10 sm:px-8 sm:pb-16 sm:pt-16 lg:px-12 lg:pb-28 lg:pt-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_65%_15%,rgba(200,255,0,0.08),transparent_30%)]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
            backgroundSize:
              "88px 88px",
          }}
        />

        <div className="relative mx-auto max-w-[1500px]">
          <p className="font-mono text-[8px] font-bold uppercase tracking-[0.26em] text-[#C8FF00] sm:text-[9px]">
            AGE202 Archive
          </p>

          <h1 className="mt-3 text-[3.35rem] font-black uppercase leading-[0.9] tracking-[-0.06em] text-white sm:mt-4 sm:text-7xl lg:text-8xl">
            Next{" "}
            <span className="text-[#C8FF00]">
              Gen
            </span>
          </h1>

          <p className="mt-4 max-w-3xl text-base font-medium uppercase leading-6 tracking-[0.035em] text-white/75 sm:mt-5 sm:text-2xl sm:leading-normal">
            The next chapter of tennis is
            being written now.
          </p>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/45 sm:mt-6 sm:leading-7">
            AGE202 documents emerging
            professional players while
            their careers are still in
            progress, preserving the
            milestones, stories and
            contributions that define
            their journey.
          </p>

          <div className="mt-6 flex items-center gap-3 font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-white/35 sm:mt-10 sm:text-[9px]">
            Discover the players

            <ArrowDown
              size={14}
              className="text-[#C8FF00]"
              aria-hidden="true"
            />
          </div>
        </div>
      </section>

      {players.map(
        (player, index) => (
          <PlayerSection
            key={player.name}
            player={player}
            index={index}
          />
        ),
      )}

      <section className="border-t border-white/10 px-5 py-10 sm:px-8 sm:py-12 lg:px-12">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/30 sm:text-[9px]">
            AGE202 · The Digital Tennis
            Museum
          </p>

          <p className="font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-[#C8FF00] sm:text-[9px]">
            Careers in progress
          </p>
        </div>
      </section>
    </main>
  );
}