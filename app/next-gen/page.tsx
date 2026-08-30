import Image from "next/image";
import {
  ArrowDown,
  Camera,
  Quote,
  Trophy,
} from "lucide-react";

import type {
  ReactNode,
} from "react";

import {
  getNextGenRankings,
} from "@/lib/next-gen/next-gen-ranking.service";

import {
  prisma,
} from "@/lib/prisma";


type NextGenPlayer = {
  playerKey: string;
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
  portraitImage?: string | null;
  portraitAlt?: string | null;
  contributionImage?: string | null;
  contributionTitle?: string | null;
  contributionText?: string | null;
  contributionSource?: string | null;
  contributionStatus?:
    | "AWAITING"
    | "RECEIVED"
    | "PUBLISHED";
  contribution?: {
    dedicatedPhoto?: boolean;
    personalMessage?: boolean;
    signedMemorabilia?: boolean;
  };
};


const players: NextGenPlayer[] = [
  {
    playerKey: "moise-kouame",
    number: "01",
    name: "Moïse Kouamé",
    country: "France",
    flag: "🇫🇷",
    age: 17,
    birthDate: "06 Mar 2009",
    plays: "Right-handed · Two-handed backhand",
    ranking: "#200",
    careerHigh: "#200",
    story: [
      "Born in Sarcelles, France, on 6 March 2009, Moïse Kouamé emerged as one of the most precocious talents of his generation.",
      "His breakthrough accelerated in 2026, when he collected three ITF professional titles and began making his mark on the ATP Tour.",
      "At Roland Garros 2026, he reached the third round and produced one of the standout runs of the tournament, confirming his place among the most closely watched young players in men's tennis.",
    ],
    highlights: [
      { title: "Roland Garros — Third Round", detail: "Reached the third round of his home Grand Slam at just 17.", year: "2026" },
      { title: "Miami — Historic Match Win", detail: "Became the youngest match winner in Miami tournament history.", year: "2026" },
      { title: "Three ITF Professional Titles", detail: "Won three ITF World Tennis Tour singles titles during the 2026 season.", year: "2026" },
      { title: "Next Gen ATP Race — No. 6", detail: "Moved firmly into the qualification picture during the 2026 season.", year: "2026" },
      { title: "ATP Career High", detail: "Reached World No. 200 in August 2026.", year: "2026" },
    ],
  },
  {
    playerKey: "federico-cina",
    number: "02",
    name: "Federico Cinà",
    country: "Italy",
    flag: "🇮🇹",
    age: 19,
    birthDate: "30 Mar 2007",
    plays: "Right-handed · Two-handed backhand",
    ranking: "#174",
    careerHigh: "#174",
    story: [
      "Born in Palermo on 30 March 2007, Federico Cinà grew up immersed in tennis under the guidance of his father and coach, Francesco Cinà.",
      "A former junior World No. 4, Cinà began translating his junior pedigree into professional results early, becoming the first player born in 2007 or later to win an ATP Masters 1000 match when he defeated Francisco Comesaña in Miami in 2025.",
      "His 2026 season marked another step forward: a first ATP Challenger title in Pune, a Roland Garros main-draw debut and qualification for his first US Open main draw.",
    ],
    highlights: [
      { title: "US Open — Main Draw Qualification", detail: "Qualified for his first US Open main draw after coming through qualifying in New York.", year: "2026" },
      { title: "Pune Challenger — Champion", detail: "Won his first ATP Challenger title, saving five championship points in the final.", year: "2026" },
      { title: "Roland Garros — Main Draw Debut", detail: "Qualified for his first Grand Slam main draw in Paris.", year: "2026" },
      { title: "Miami Masters 1000 — First ATP Win", detail: "First player born in 2007 or later to win an ATP Masters 1000 match.", year: "2025" },
      { title: "Junior World No. 4", detail: "Reached No. 4 in the ITF junior rankings.", year: "2024" },
    ],
  },
  {
    playerKey: "diego-dedura",
    number: "03",
    name: "Diego Dedura",
    country: "Germany",
    flag: "🇩🇪",
    age: 18,
    birthDate: "12 Mar 2008",
    plays: "Left-handed · Two-handed backhand",
    ranking: "#194",
    careerHigh: "#194",
    story: [
      "Born in Berlin on 12 March 2008, Diego Dedura is one of the youngest players already establishing himself on the professional circuit.",
      "His first major ATP milestone arrived in Munich in 2025, where he became the first player born in 2008 or later to compete on the ATP Tour and advanced past Denis Shapovalov.",
      "In July 2026, Dedura captured his maiden ATP Challenger title in Tampere, becoming the youngest Challenger champion of the season and breaking into the world's Top 200.",
    ],
    highlights: [
      { title: "Tampere Challenger — Champion", detail: "Won his maiden Challenger title and became the youngest champion at that level in 2026.", year: "2026" },
      { title: "ATP Top 200 Debut", detail: "Broke into the world's Top 200 following his Tampere title run.", year: "2026" },
      { title: "Munich — ATP Breakthrough", detail: "Advanced past Denis Shapovalov in his first ATP Tour appearance.", year: "2025" },
      { title: "Historic 2008 Milestone", detail: "First player born in 2008 or later to compete on the ATP Tour.", year: "2025" },
    ],
  },
  {
    playerKey: "nicolai-budkov-kjaer",
    number: "04",
    name: "Nicolai Budkov Kjær",
    country: "Norway",
    flag: "🇳🇴",
    age: 19,
    birthDate: "01 Sep 2006",
    plays: "Right-handed · Two-handed backhand",
    ranking: "#155",
    careerHigh: "#124",
    story: [
      "Born in Oslo on 1 September 2006, Nicolai Budkov Kjær became one of Norway's most accomplished junior players before making a rapid transition to the professional game.",
      "He reached junior World No. 1 in 2024 and won the Wimbledon boys' singles title, becoming the first Norwegian man to win a Grand Slam singles title at any level.",
      "Four Challenger titles in 2025 carried him into the Top 150 and to the Next Gen ATP Finals, where he reached the semi-finals before making his Grand Slam main-draw debut at the 2026 Australian Open.",
    ],
    highlights: [
      { title: "Australian Open — Main Draw Debut", detail: "Qualified for his first Grand Slam main draw.", year: "2026" },
      { title: "Next Gen ATP Finals — Semi-finalist", detail: "Reached the semi-finals on his debut at the season-ending event.", year: "2025" },
      { title: "Four ATP Challenger Titles", detail: "Won Challenger titles in Glasgow, Tampere, Astana and Mouilleron-le-Captif.", year: "2025" },
      { title: "Wimbledon Boys' Singles — Champion", detail: "First Norwegian man to win a Grand Slam singles title at any level.", year: "2024" },
      { title: "Junior World No. 1", detail: "Reached the top of the ITF junior rankings.", year: "2024" },
    ],
  },
  {
    playerKey: "henry-searle",
    number: "05",
    name: "Henry Searle",
    country: "Great Britain",
    flag: "🇬🇧",
    age: 20,
    birthDate: "29 Mar 2006",
    plays: "Left-handed · Two-handed backhand",
    ranking: "#220",
    careerHigh: "#220",
    story: [
      "Born in Wolverhampton on 29 March 2006, Henry Searle announced himself internationally by winning the Wimbledon boys' singles title in 2023 without dropping a set.",
      "The British left-hander has since moved steadily into the professional game, building his ranking through the ITF and ATP Challenger circuits while retaining the grass-court strengths that defined his junior breakthrough.",
      "In 2026 he captured his first Challenger crown in Dublin and added another title in Nottingham, pushing himself firmly into the Next Gen ATP Finals qualification race.",
    ],
    highlights: [
      { title: "Dublin Challenger — Champion", detail: "Won his maiden ATP Challenger title and became the youngest grass-court Challenger champion since Alex de Minaur in 2018.", year: "2026" },
      { title: "Nottingham Challenger — Champion", detail: "Added a second grass-court Challenger title during his 2026 rise.", year: "2026" },
      { title: "Wimbledon Boys' Singles — Champion", detail: "First British boy since 1962 to lift the Wimbledon boys' singles trophy.", year: "2023" },
      { title: "Junior World No. 3", detail: "Reached a career-high junior ranking of No. 3.", year: "2023" },
    ],
  },
  {
    playerKey: "joel-schwaerzler",
    number: "06",
    name: "Joel Schwärzler",
    country: "Austria",
    flag: "🇦🇹",
    age: 20,
    birthDate: "27 Jan 2006",
    plays: "Left-handed · Two-handed backhand",
    ranking: "#171",
    careerHigh: "#171",
    story: [
      "Born on 27 January 2006, Joel Schwärzler developed into one of Austria's leading young prospects after a standout junior career.",
      "The powerful left-hander reached junior World No. 1 and won the 2024 Roland Garros boys' singles title before establishing himself on the ATP Challenger Tour.",
      "His progress continued in 2026 with Challenger titles in Kigali and at the Mazovia Open in Poland, taking his career total to three and keeping him in contention in the Next Gen ATP Race.",
    ],
    highlights: [
      { title: "Mazovia Open — Champion", detail: "Claimed his second Challenger title of the 2026 season and third overall.", year: "2026" },
      { title: "Kigali Challenger — Champion", detail: "Opened his 2026 Challenger title account in Rwanda.", year: "2026" },
      { title: "Roland Garros Boys' Singles — Champion", detail: "Won his first junior Grand Slam singles title in Paris.", year: "2024" },
      { title: "Junior World No. 1", detail: "Reached the top of the ITF junior rankings.", year: "2024" },
    ],
  },
  {
    playerKey: "maxim-mrva",
    number: "07",
    name: "Maxim Mrva",
    country: "Czechia",
    flag: "🇨🇿",
    age: 19,
    birthDate: "02 Aug 2007",
    plays: "Right-handed · Two-handed backhand",
    ranking: "#211",
    careerHigh: "#211",
    story: [
      "Born in Prostějov on 2 August 2007, Maxim Mrva emerged from the Czech junior system as one of the country's most promising young players.",
      "His junior years included major team and Grand Slam success, highlighted by the 2024 US Open boys' doubles title alongside Rei Sakamoto.",
      "Mrva's professional development accelerated in 2026. In August he won his first ATP Challenger title in Todi without dropping a set, moving rapidly toward the world's Top 200 and into the Next Gen ATP Race conversation.",
    ],
    highlights: [
      { title: "Todi Challenger — Champion", detail: "Won his maiden ATP Challenger title without dropping a set during the tournament.", year: "2026" },
      { title: "Next Gen ATP Race — Top 12", detail: "Moved into the leading group of the 2026 Next Gen qualification race.", year: "2026" },
      { title: "US Open Boys' Doubles — Champion", detail: "Won the junior doubles title alongside Rei Sakamoto.", year: "2024" },
      { title: "First Professional Title", detail: "Captured his first professional singles title as a teenager.", year: "2024" },
    ],
  },
  {
    playerKey: "cruz-hewitt",
    number: "08",
    name: "Cruz Hewitt",
    country: "Australia",
    flag: "🇦🇺",
    age: 17,
    birthDate: "11 Dec 2008",
    plays: "Right-handed · Two-handed backhand",
    ranking: "#376",
    careerHigh: "#376",
    story: [
      "Born on 11 December 2008, Cruz Hewitt is beginning to build a professional identity of his own while carrying one of Australian tennis's most recognisable surnames.",
      "Still only 17, Hewitt has moved rapidly from junior competition into professional events and earned increasingly significant opportunities on the ATP Tour during 2026.",
      "His breakthrough arrived in Washington, where he defeated Marcos Giron for his first ATP Tour victory, becoming the youngest match winner at the tournament since Kei Nishikori in 2007.",
    ],
    highlights: [
      { title: "Washington — First ATP Tour Win", detail: "Defeated Marcos Giron in straight sets for his first tour-level victory.", year: "2026" },
      { title: "Washington Youth Milestone", detail: "Youngest player to win a match at the event since Kei Nishikori in 2007.", year: "2026" },
      { title: "ATP Top 400", detail: "Continued his rapid ranking rise during his first sustained professional season.", year: "2026" },
    ],
  },
  {
    playerKey: "max-schoenhaus",
    number: "09",
    name: "Max Schönhaus",
    country: "Germany",
    flag: "🇩🇪",
    age: 19,
    birthDate: "01 Aug 2007",
    plays: "Right-handed · One-handed backhand",
    ranking: "#317",
    careerHigh: "#310",
    story: [
      "Born in Soest on 1 August 2007, Max Schönhaus built a strong junior résumé before beginning his climb through the professional rankings.",
      "His junior career included the 2024 Wimbledon boys' doubles title, a run to the 2025 Roland Garros boys' singles final and a Wimbledon boys' singles semi-final later that summer.",
      "Schönhaus closed his junior chapter by winning the 2025 ITF Junior Finals in Chengdu and has since focused on the professional circuit, where his ranking accelerated sharply during 2026.",
    ],
    highlights: [
      { title: "ITF Junior Finals — Champion", detail: "Won the season-ending junior title in Chengdu.", year: "2025" },
      { title: "Roland Garros Boys' Singles — Finalist", detail: "Reached an all-German junior final in Paris.", year: "2025" },
      { title: "Wimbledon Boys' Singles — Semi-finalist", detail: "Became the first German boy since 2013 to reach the Wimbledon semi-finals.", year: "2025" },
      { title: "Wimbledon Boys' Doubles — Champion", detail: "Captured a junior Grand Slam doubles title.", year: "2024" },
    ],
  },
  {
    playerKey: "ognjen-milic",
    number: "10",
    name: "Ognjen Milić",
    country: "Serbia",
    flag: "🇷🇸",
    age: 19,
    birthDate: "22 Jun 2007",
    plays: "Left-handed",
    ranking: "#343",
    careerHigh: "#336",
    story: [
      "Born on 22 June 2007, Ognjen Milić is part of the next wave of Serbian players making the transition from junior tennis into the professional game.",
      "His rise has been built primarily through the ITF World Tennis Tour and ATP Challenger circuit, with results on both clay and hard courts steadily pushing him up the rankings.",
      "During 2026 he began appearing regularly at Challenger level, including a quarter-final run in Plovdiv, while reaching a new career-high ranking inside the world's Top 350.",
    ],
    highlights: [
      { title: "ATP Top 350", detail: "Reached a new career-high ranking during the 2026 season.", year: "2026" },
      { title: "Plovdiv Challenger — Quarter-finalist", detail: "Reached the last eight on clay after consecutive main-draw victories.", year: "2026" },
      { title: "Challenger Transition", detail: "Established a regular presence across ATP Challenger events during his professional rise.", year: "2026" },
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


function PlayerPortrait({
  player,
}: {
  player: NextGenPlayer;
}) {
  if (!player.portraitImage) {
    return (
      <PortraitPlaceholder
        playerName={player.name}
      />
    );
  }

  return (
    <div className="relative min-h-[340px] overflow-hidden rounded-[24px] border border-white/10 bg-[#050914] sm:min-h-[480px] lg:min-h-[580px] lg:rounded-[28px]">
      <Image
        src={player.portraitImage}
        alt={
          player.portraitAlt ??
          `Official portrait of ${player.name}`
        }
        fill
        priority={false}
        sizes="(max-width: 1024px) 100vw, 42vw"
        className="object-cover object-center"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[#030914]/35 via-transparent to-transparent"
      />

      <div className="absolute bottom-4 left-4 rounded-full border border-[#C8FF00]/25 bg-[#030914]/75 px-3 py-2 backdrop-blur sm:bottom-5 sm:left-5">
        <p className="font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-[#C8FF00] sm:text-[9px]">
          Official Player Portrait
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
    Boolean(
      player.contributionImage,
    ) ||
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
          <div className="relative flex min-h-[145px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[#C8FF00]/35 bg-black/20 px-5 py-6 text-center sm:min-h-[180px] lg:h-full lg:min-h-[230px]">
            {player.contributionImage ? (
              <>
                <Image
                  src={player.contributionImage}
                  alt={
                    player.contributionTitle ??
                    `Contribution from ${player.name}`
                  }
                  fill
                  sizes="(max-width: 1024px) 100vw, 440px"
                  className="object-cover object-center"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#030914]/80 via-transparent to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-4 text-left sm:p-5">
                  <p className="font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-[#C8FF00]">
                    Contribution Received
                  </p>

                  {player.contributionTitle ? (
                    <p className="mt-1 text-sm font-bold uppercase tracking-wide text-white">
                      {player.contributionTitle}
                    </p>
                  ) : null}
                </div>
              </>
            ) : hasContribution ? (
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
            <PlayerPortrait
              player={player}
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


export const dynamic =
  "force-dynamic";

export default async function NextGenPage() {
  const [
    rankingByPlayerKey,
    cmsPlayers,
  ] = await Promise.all([
    getNextGenRankings(),

    prisma.nextGenPlayer.findMany({
      where: {
        status: "PUBLISHED",
      },
      select: {
        playerKey: true,
        portraitImage: true,
        portraitAlt: true,
        contributionImage: true,
        contributionTitle: true,
        contributionText: true,
        contributionSource: true,
        contributionStatus: true,
      },
    }),
  ]);

  const cmsByPlayerKey =
    new Map(
      cmsPlayers.map(
        (player) => [
          player.playerKey,
          player,
        ],
      ),
    );

  const rankedPlayers =
    players
      .map((player) => {
        const liveRanking =
          rankingByPlayerKey.get(
            player.playerKey,
          );

        const cmsPlayer =
          cmsByPlayerKey.get(
            player.playerKey,
          );

        return {
          ...player,

          portraitImage:
            cmsPlayer?.portraitImage ??
            null,

          portraitAlt:
            cmsPlayer?.portraitAlt ??
            null,

          contributionImage:
            cmsPlayer?.contributionImage ??
            null,

          contributionTitle:
            cmsPlayer?.contributionTitle ??
            null,

          contributionText:
            cmsPlayer?.contributionText ??
            null,

          contributionSource:
            cmsPlayer?.contributionSource ??
            null,

          contributionStatus:
            cmsPlayer?.contributionStatus ??
            "AWAITING",

          ranking:
            liveRanking?.currentRank != null
              ? `#${liveRanking.currentRank}`
              : player.ranking,

          careerHigh:
            liveRanking?.careerHighRank != null
              ? `#${liveRanking.careerHighRank}`
              : player.careerHigh,

          currentRankValue:
            liveRanking?.currentRank ??
            Number.POSITIVE_INFINITY,
        };
      })
      .sort(
        (a, b) =>
          a.currentRankValue -
          b.currentRankValue,
      );

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

      <section className="border-b border-white/10 px-5 py-6 sm:px-8 sm:py-8 lg:px-12">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex items-center justify-between gap-4">
            <p className="font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-[#C8FF00] sm:text-[9px]">
              Founding Players · 2026 Archive
            </p>

            <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/30 sm:text-[9px]">
              10 Careers in Progress
            </p>
          </div>

          <nav
            aria-label="Next Gen player index"
            className="mt-5 flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible sm:pb-0"
          >
            {rankedPlayers.map((player) => (
              <a
                key={`index-${player.number}`}
                href={`#player-${player.number}`}
                className="group flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-3 py-2 transition hover:border-[#C8FF00]/50 hover:bg-[#C8FF00]/5 sm:px-4"
              >
                <span className="font-mono text-[8px] font-bold text-[#C8FF00]/70 group-hover:text-[#C8FF00]">
                  {player.number}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-white/65 group-hover:text-white sm:text-xs">
                  {player.name}
                </span>
              </a>
            ))}
          </nav>
        </div>
      </section>

      {rankedPlayers.map(
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