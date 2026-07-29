import Link from "next/link";

import {
  ArrowRight,
  CalendarDays,
  CircleDot,
  Globe2,
  Map,
  MapPin,
  Navigation,
  Plane,
  Route,
} from "lucide-react";

import {
  getMasters1000Href,
  masters1000List,
  type Masters1000Data,
} from "@/lib/data/masters-1000";

const MAP_WIDTH = 1200;
const MAP_HEIGHT = 600;

type ProjectedTournament = {
  tournament: Masters1000Data;
  x: number;
  y: number;
};

export default function MastersWorldTourMap() {
  const projectedTournaments: ProjectedTournament[] =
    masters1000List.map((tournament) => ({
      tournament,
      x: longitudeToX(tournament.longitude),
      y: latitudeToY(tournament.latitude),
    }));

  return (
    <section
      id="world-tour"
      className="scroll-mt-16 border-t border-white/10 px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading />

        <div className="mt-12 overflow-hidden rounded-[2.2rem] border border-white/10 bg-[#06101D] shadow-[0_30px_100px_rgba(0,0,0,0.25)]">
          <MapHeader />

          <div className="relative overflow-hidden">
            <div className="relative aspect-[2/1] min-h-[420px] w-full sm:min-h-[560px] lg:min-h-[680px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(41,132,184,0.18),transparent_60%)]" />

              <div className="absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:60px_60px]" />

              <WorldMapBackground />

              <TournamentRoute points={projectedTournaments} />

              <TournamentMarkers points={projectedTournaments} />

              <MapCornerLabel />

              <MapLegend />
            </div>

            <MobileTournamentList />
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeading() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_470px] lg:items-end">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#55C9FF]">
          World Tour Map
        </p>

        <h2 className="mt-5 max-w-5xl text-4xl font-black uppercase leading-[0.9] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
          Follow the Masters route
        </h2>
      </div>

      <p className="text-sm leading-7 text-white/43 lg:text-right">
        Follow the season from the American spring through the European clay
        campaign, the North American summer, Asia and the final indoor Masters
        in Paris.
      </p>
    </div>
  );
}

function MapHeader() {
  return (
    <div className="relative z-20 flex flex-wrap items-center justify-between gap-5 border-b border-white/10 bg-[#071421]/90 px-6 py-5 backdrop-blur-xl sm:px-8">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-[#55C9FF]">
          <Map size={18} strokeWidth={1.4} aria-hidden="true" />
        </span>

        <div>
          <p className="font-mono text-[8px] font-black uppercase tracking-[0.18em] text-[#55C9FF]">
            ATP Masters 1000
          </p>

          <h3 className="mt-1 text-sm font-black uppercase tracking-[-0.02em]">
            Global tournament route
          </h3>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2 font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/34">
          <CalendarDays size={12} aria-hidden="true" />
          March · November
        </span>

        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2 font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/34">
          <Globe2 size={12} aria-hidden="true" />
          3 continents
        </span>
      </div>
    </div>
  );
}

function WorldMapBackground() {
  return (
    <svg
      viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
      preserveAspectRatio="xMidYMid meet"
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="continent-fill"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="rgba(255,255,255,0.115)" />

          <stop offset="100%" stopColor="rgba(255,255,255,0.045)" />
        </linearGradient>

        <filter id="continent-shadow">
          <feGaussianBlur stdDeviation="7" />
        </filter>

        <radialGradient id="map-ocean-glow">
          <stop offset="0%" stopColor="rgba(85,201,255,0.09)" />

          <stop offset="100%" stopColor="rgba(85,201,255,0)" />
        </radialGradient>
      </defs>

      <rect
        width={MAP_WIDTH}
        height={MAP_HEIGHT}
        fill="url(#map-ocean-glow)"
      />

      <MapGrid />

      <g
        fill="rgba(24,75,108,0.12)"
        filter="url(#continent-shadow)"
        transform="translate(0 8)"
      >
        <WorldContinents />
      </g>

      <g
        fill="url(#continent-fill)"
        stroke="rgba(117,190,227,0.16)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      >
        <WorldContinents />
      </g>

      <g
        fill="none"
        stroke="rgba(85,201,255,0.12)"
        strokeWidth="1"
        strokeDasharray="5 9"
      >
        <path d="M0 300H1200" />
        <path d="M600 0V600" />
      </g>

      <g
        fill="rgba(255,255,255,0.14)"
        fontFamily="monospace"
        fontSize="10"
        letterSpacing="2"
      >
        <text x="175" y="195">
          NORTH AMERICA
        </text>

        <text x="315" y="440">
          SOUTH AMERICA
        </text>

        <text x="575" y="185">
          EUROPE
        </text>

        <text x="590" y="375">
          AFRICA
        </text>

        <text x="815" y="205">
          ASIA
        </text>

        <text x="1000" y="465">
          OCEANIA
        </text>
      </g>
    </svg>
  );
}

function MapGrid() {
  const verticalLines = Array.from(
    {
      length: 13,
    },
    (_, index) => index * 100,
  );

  const horizontalLines = Array.from(
    {
      length: 7,
    },
    (_, index) => index * 100,
  );

  return (
    <g
      fill="none"
      stroke="rgba(255,255,255,0.035)"
      strokeWidth="1"
    >
      {verticalLines.map((x) => (
        <path key={`vertical-${x}`} d={`M${x} 0V${MAP_HEIGHT}`} />
      ))}

      {horizontalLines.map((y) => (
        <path key={`horizontal-${y}`} d={`M0 ${y}H${MAP_WIDTH}`} />
      ))}
    </g>
  );
}

function WorldContinents() {
  return (
    <>
      {/* North America */}
      <path d="M51 172 L78 126 L120 91 L175 73 L235 78 L278 98 L321 102 L350 128 L341 154 L310 169 L294 198 L263 207 L241 236 L209 246 L188 278 L150 269 L127 246 L105 232 L82 201 Z" />

      {/* Greenland */}
      <path d="M321 62 L353 45 L388 55 L394 85 L373 111 L339 105 L322 84 Z" />

      {/* Central America */}
      <path d="M209 246 L230 256 L241 276 L258 287 L254 303 L234 299 L221 284 L201 274 Z" />

      {/* South America */}
      <path d="M255 303 L286 300 L318 319 L337 350 L337 386 L324 420 L311 458 L287 505 L263 532 L248 503 L251 467 L234 434 L228 395 L238 363 L227 334 Z" />

      {/* Europe */}
      <path d="M530 148 L548 125 L576 119 L592 130 L612 119 L635 130 L645 151 L628 163 L611 159 L598 174 L579 169 L562 181 L544 170 Z" />

      {/* Scandinavia */}
      <path d="M579 119 L584 84 L604 59 L623 68 L625 98 L612 119 L592 130 Z" />

      {/* United Kingdom and Ireland */}
      <path d="M528 145 L519 132 L522 115 L533 110 L541 127 L537 141 Z" />

      <path d="M512 145 L504 136 L506 125 L515 122 L519 134 Z" />

      {/* Africa */}
      <path d="M536 187 L571 173 L611 181 L641 207 L653 249 L640 295 L622 336 L597 382 L570 370 L554 338 L531 314 L516 276 L507 235 Z" />

      {/* Asia */}
      <path d="M634 131 L681 102 L742 89 L810 93 L860 112 L911 119 L967 147 L1017 171 L1036 203 L1007 220 L969 216 L945 240 L906 239 L880 265 L846 255 L815 234 L785 239 L759 219 L724 217 L699 192 L670 186 L645 151 Z" />

      {/* Arabian Peninsula */}
      <path d="M642 224 L676 230 L697 258 L685 286 L657 276 L642 250 Z" />

      {/* India */}
      <path d="M764 229 L790 242 L803 279 L786 321 L769 305 L758 267 Z" />

      {/* Southeast Asia */}
      <path d="M837 258 L859 274 L868 301 L886 320 L880 343 L860 327 L846 302 L827 284 Z" />

      {/* Japan */}
      <path d="M973 206 L986 217 L983 238 L973 249 L969 231 Z" />

      {/* Australia */}
      <path d="M961 397 L998 370 L1045 372 L1082 400 L1090 442 L1066 474 L1024 483 L984 466 L955 438 Z" />

      {/* New Zealand */}
      <path d="M1122 462 L1135 472 L1130 491 L1117 483 Z" />

      <path d="M1137 497 L1147 507 L1141 522 L1130 514 Z" />

      {/* Madagascar */}
      <path d="M665 355 L677 371 L674 405 L661 418 L656 389 Z" />

      {/* Iceland */}
      <path d="M496 91 L508 85 L518 92 L510 101 L498 100 Z" />
    </>
  );
}

type TournamentRouteProps = {
  points: ProjectedTournament[];
};

function TournamentRoute({ points }: TournamentRouteProps) {
  const routePath = buildCurvedRoute(points);

  return (
    <svg
      viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
      preserveAspectRatio="xMidYMid meet"
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="route-gradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#C69BFF" />
          <stop offset="18%" stopColor="#44D7FF" />
          <stop offset="40%" stopColor="#FF9A62" />
          <stop offset="58%" stopColor="#7EE7C4" />
          <stop offset="78%" stopColor="#D95CFF" />
          <stop offset="100%" stopColor="#FF7FC8" />
        </linearGradient>

        <filter id="route-glow">
          <feGaussianBlur stdDeviation="5" result="blur" />

          <feMerge>
            <feMergeNode in="blur" />

            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        d={routePath}
        fill="none"
        stroke="rgba(85,201,255,0.12)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#route-glow)"
      />

      <path
        id="masters-route-path"
        d={routePath}
        fill="none"
        stroke="url(#route-gradient)"
        strokeWidth="2.6"
        strokeDasharray="8 9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <g>
        <circle
          r="7"
          fill="#55C9FF"
          stroke="#06101D"
          strokeWidth="3"
          filter="url(#route-glow)"
        >
          <animateMotion
            dur="15s"
            repeatCount="indefinite"
            rotate="auto"
            path={routePath}
          />
        </circle>

        <Plane
          size={15}
          fill="#06101D"
          stroke="#06101D"
          strokeWidth={2}
        />
      </g>
    </svg>
  );
}

type TournamentMarkersProps = {
  points: ProjectedTournament[];
};

function TournamentMarkers({ points }: TournamentMarkersProps) {
  return (
    <div className="absolute inset-0">
      {points.map(({ tournament, x, y }, index) => {
        const left = (x / MAP_WIDTH) * 100;
        const top = (y / MAP_HEIGHT) * 100;

        return (
          <Link
            key={tournament.slug}
            href={getMasters1000Href(tournament.slug)}
            aria-label={`Explore ${tournament.name}`}
            className="group absolute z-20 -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${left}%`,
              top: `${top}%`,
            }}
          >
            <span
              className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full blur-xl"
              style={{
                backgroundColor: tournament.colors.glow,
              }}
            />

            <span
              className="relative grid h-8 w-8 place-items-center rounded-full border-[3px] border-[#06101D] text-[8px] font-black text-[#050B18] shadow-[0_0_0_1px_rgba(255,255,255,0.25)] transition duration-300 group-hover:scale-125"
              style={{
                backgroundColor: tournament.colors.primary,
                boxShadow: `0 0 24px ${tournament.colors.glow}`,
              }}
            >
              {index + 1}
            </span>

            <TournamentTooltip
              tournament={tournament}
              index={index}
              left={left}
            />
          </Link>
        );
      })}
    </div>
  );
}

type TournamentTooltipProps = {
  tournament: Masters1000Data;
  index: number;
  left: number;
};

function TournamentTooltip({
  tournament,
  index,
  left,
}: TournamentTooltipProps) {
  const horizontalPosition =
    left < 25
      ? "left-0"
      : left > 75
        ? "right-0"
        : "left-1/2 -translate-x-1/2";

  return (
    <span
      className={`pointer-events-none absolute bottom-full mb-4 hidden w-60 rounded-[1.4rem] border border-white/10 bg-[#07101D]/96 p-5 text-left opacity-0 shadow-[0_24px_70px_rgba(0,0,0,0.48)] backdrop-blur-xl transition duration-200 group-hover:-translate-y-1 group-hover:opacity-100 lg:block ${horizontalPosition}`}
    >
      <span className="flex items-center justify-between gap-4">
        <span
          className="font-mono text-[7px] font-black uppercase tracking-[0.18em]"
          style={{
            color: tournament.colors.primary,
          }}
        >
          Stage 0{index + 1}
        </span>

        <span className="font-mono text-[7px] uppercase tracking-[0.16em] text-white/25">
          {tournament.code}
        </span>
      </span>

      <span className="mt-3 block text-base font-black uppercase leading-tight">
        {tournament.name}
      </span>

      <span className="mt-3 flex items-center gap-2 text-[10px] leading-5 text-white/42">
        <MapPin
          size={11}
          style={{
            color: tournament.colors.primary,
          }}
          aria-hidden="true"
        />

        {tournament.city} · {tournament.country}
      </span>

      <span className="mt-2 flex items-center gap-2 text-[10px] leading-5 text-white/42">
        <CalendarDays
          size={11}
          style={{
            color: tournament.colors.primary,
          }}
          aria-hidden="true"
        />

        {tournament.calendar}
      </span>

      <span className="mt-2 flex items-center gap-2 text-[10px] leading-5 text-white/42">
        <CircleDot
          size={11}
          style={{
            color: tournament.colors.primary,
          }}
          aria-hidden="true"
        />

        {tournament.surface}
      </span>

      <span
        className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 font-mono text-[7px] font-black uppercase tracking-[0.16em]"
        style={{
          color: tournament.colors.primary,
        }}
      >
        Enter archive
        <ArrowRight size={12} aria-hidden="true" />
      </span>
    </span>
  );
}

function MapCornerLabel() {
  return (
    <div className="pointer-events-none absolute left-5 top-5 hidden rounded-2xl border border-white/10 bg-[#050B18]/72 px-4 py-3 backdrop-blur-lg sm:block lg:left-8 lg:top-8">
      <p className="font-mono text-[7px] font-black uppercase tracking-[0.18em] text-[#55C9FF]">
        AGE202 coordinates
      </p>

      <p className="mt-2 text-[10px] font-black uppercase tracking-[0.05em] text-white/42">
        Geographic projection · Tournament order
      </p>
    </div>
  );
}

function MapLegend() {
  return (
    <div className="absolute bottom-5 left-5 right-5 z-20 hidden gap-2 rounded-[1.5rem] border border-white/10 bg-[#050B18]/88 p-4 backdrop-blur-xl sm:grid sm:grid-cols-3 lg:bottom-8 lg:left-8 lg:right-auto lg:w-[660px]">
      <MapLegendItem
        icon={Navigation}
        label="Route"
        value="Official calendar order"
      />

      <MapLegendItem
        icon={MapPin}
        label="Locations"
        value="Geographic coordinates"
      />

      <MapLegendItem
        icon={CircleDot}
        label="Interaction"
        value="Select a tournament"
      />
    </div>
  );
}

type MapLegendItemProps = {
  icon: typeof Navigation;
  label: string;
  value: string;
};

function MapLegendItem({
  icon: Icon,
  label,
  value,
}: MapLegendItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-3">
      <Icon size={13} className="text-[#55C9FF]" aria-hidden="true" />

      <div>
        <span className="block font-mono text-[6px] uppercase tracking-[0.16em] text-white/24">
          {label}
        </span>

        <span className="mt-1 block text-[9px] font-black uppercase tracking-[0.02em] text-white/52">
          {value}
        </span>
      </div>
    </div>
  );
}

function MobileTournamentList() {
  return (
    <div className="border-t border-white/10 bg-[#07101D] p-4 sm:hidden">
      <div className="mb-4 flex items-center gap-3 px-1">
        <Route size={15} className="text-[#55C9FF]" aria-hidden="true" />

        <p className="font-mono text-[8px] font-black uppercase tracking-[0.18em] text-[#55C9FF]">
          Tournament route
        </p>
      </div>

      <div className="grid gap-2">
        {masters1000List.map((tournament, index) => (
          <Link
            key={tournament.slug}
            href={getMasters1000Href(tournament.slug)}
            className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/15 px-4 py-4 transition active:scale-[0.99]"
          >
            <div className="flex min-w-0 items-center gap-4">
              <span
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[8px] font-black text-[#050B18]"
                style={{
                  backgroundColor: tournament.colors.primary,
                }}
              >
                {index + 1}
              </span>

              <div className="min-w-0">
                <h3 className="truncate text-sm font-black uppercase tracking-[-0.02em]">
                  {tournament.name}
                </h3>

                <p className="mt-1 truncate font-mono text-[7px] uppercase tracking-[0.15em] text-white/30">
                  {tournament.calendar} · {tournament.surface}
                </p>
              </div>
            </div>

            <ArrowRight
              size={14}
              style={{
                color: tournament.colors.primary,
              }}
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

function longitudeToX(longitude: number): number {
  return ((longitude + 180) / 360) * MAP_WIDTH;
}

function latitudeToY(latitude: number): number {
  return ((90 - latitude) / 180) * MAP_HEIGHT;
}

function buildCurvedRoute(points: ProjectedTournament[]): string {
  if (points.length === 0) {
    return "";
  }

  const firstPoint = points[0];
  let path = `M ${firstPoint.x.toFixed(2)} ${firstPoint.y.toFixed(2)}`;

  for (let index = 1; index < points.length; index += 1) {
    const previousPoint = points[index - 1];
    const currentPoint = points[index];

    const middleX = (previousPoint.x + currentPoint.x) / 2;
    const distance = Math.abs(currentPoint.x - previousPoint.x);

    const arcHeight = Math.min(72, Math.max(22, distance * 0.12));
    const controlY =
      Math.min(previousPoint.y, currentPoint.y) - arcHeight;

    path += ` Q ${middleX.toFixed(2)} ${controlY.toFixed(
      2,
    )} ${currentPoint.x.toFixed(2)} ${currentPoint.y.toFixed(2)}`;
  }

  return path;
}