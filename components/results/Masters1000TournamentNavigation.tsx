import { Trophy } from "lucide-react";

import type { TournamentConfig } from "@/lib/data/tournaments/types";

type Masters1000TournamentNavigationProps = {
  tournament: TournamentConfig;
};

export default function Masters1000TournamentNavigation({
  tournament,
}: Masters1000TournamentNavigationProps) {
  return (
    <nav
      aria-label={`${tournament.name} page sections`}
      className="sticky top-0 z-40 border-b border-white/10 bg-[#050B18]/88 px-4 py-2.5 shadow-[0_12px_36px_rgba(0,0,0,0.18)] backdrop-blur-2xl sm:px-8 lg:px-12"
    >
      <div className="mx-auto flex max-w-[1440px] items-center gap-2.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <span className="hidden shrink-0 items-center gap-2 border-r border-white/10 pr-4 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-[var(--tournament-primary)] sm:inline-flex">
          <Trophy size={13} aria-hidden="true" />
          {tournament.code}
        </span>

        <SectionLink href="#gallery" label="Gallery" />
        <SectionLink href="#overview" label="Overview" />
        <SectionLink href="#facts" label="Facts" />
        <SectionLink href="#champions" label="Champions" />
        <SectionLink href="#champions-timeline" label="Finals" />
        <SectionLink href="#legends" label="Legends" />
        <SectionLink href="#editions" label="Editions" />
        <SectionLink href="#history" label="History" />
        <SectionLink href="#timeline" label="Milestones" />
        <SectionLink href="#records" label="Records" />
        <SectionLink href="#moments" label="Moments" />
        <SectionLink href="#archive" label="Archive" />
      </div>
    </nav>
  );
}

type SectionLinkProps = {
  href: string;
  label: string;
};

function SectionLink({ href, label }: SectionLinkProps) {
  return (
    <a
      href={href}
      className="shrink-0 rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/42 transition hover:-translate-y-px hover:border-[var(--tournament-primary)] hover:bg-[var(--tournament-primary)]/10 hover:text-[var(--tournament-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tournament-primary)] sm:text-[8px]"
    >
      {label}
    </a>
  );
}
