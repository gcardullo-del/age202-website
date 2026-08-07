import type {
  PlayerDashboardCareerEvent,
  PlayerDashboardData,
} from "@/lib/types/player-dashboard";

type PlayerTimelineProps = {
  player: PlayerDashboardData;
};

const MONTH_FORMATTER = new Intl.DateTimeFormat("it-IT", {
  month: "long",
});

function getEventDateLabel(
  event: PlayerDashboardCareerEvent,
): string {
  if (!event.month) {
    return String(event.year);
  }

  const month = MONTH_FORMATTER.format(
    new Date(
      Date.UTC(
        event.year,
        event.month - 1,
        event.day ?? 1,
      ),
    ),
  );

  if (!event.day) {
    return `${month} ${event.year}`;
  }

  return `${event.day} ${month} ${event.year}`;
}

function getEventContext(
  event: PlayerDashboardCareerEvent,
): string | null {
  const details = [
    event.tournament,
    event.location,
  ].filter(
    (
      value,
    ): value is string =>
      Boolean(value?.trim()),
  );

  if (details.length === 0) {
    return null;
  }

  return details.join(" · ");
}

function sortCareerEvents(
  events: PlayerDashboardCareerEvent[],
): PlayerDashboardCareerEvent[] {
  return [...events].sort(
    (firstEvent, secondEvent) => {
      if (
        firstEvent.sortOrder !==
        secondEvent.sortOrder
      ) {
        return (
          firstEvent.sortOrder -
          secondEvent.sortOrder
        );
      }

      if (
        firstEvent.year !==
        secondEvent.year
      ) {
        return (
          secondEvent.year -
          firstEvent.year
        );
      }

      if (
        firstEvent.month !==
        secondEvent.month
      ) {
        return (
          (secondEvent.month ?? 0) -
          (firstEvent.month ?? 0)
        );
      }

      return (
        (secondEvent.day ?? 0) -
        (firstEvent.day ?? 0)
      );
    },
  );
}

export default function PlayerTimeline({
  player,
}: PlayerTimelineProps) {
  const careerEvents = sortCareerEvents(
    player.careerEvents,
  );

  return (
    <section
      aria-labelledby="player-timeline-title"
      className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/10"
    >
      <header className="border-b border-white/10 px-5 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
              Career archive
            </p>

            <h2
              id="player-timeline-title"
              className="mt-2 text-2xl font-semibold tracking-tight text-white"
            >
              Player Timeline
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">
              Le tappe fondamentali della carriera
              di {player.name}, organizzate
              cronologicamente nel museo AGE202.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor:
                  player.accent,
              }}
            />

            <span className="text-xs font-medium text-white/65">
              {careerEvents.length}{" "}
              {careerEvents.length === 1
                ? "evento"
                : "eventi"}
            </span>
          </div>
        </div>
      </header>

      {careerEvents.length === 0 ? (
        <div className="px-5 py-14 text-center sm:px-6 lg:px-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-white/15 bg-white/[0.03]">
            <span
              aria-hidden="true"
              className="text-xl text-white/45"
            >
              ◷
            </span>
          </div>

          <h3 className="mt-4 text-base font-semibold text-white">
            Nessun evento registrato
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/50">
            La timeline di {player.name} è
            ancora vuota. Gli eventi inseriti
            nel CMS appariranno qui
            automaticamente.
          </p>
        </div>
      ) : (
        <div className="px-5 py-6 sm:px-6 lg:px-8 lg:py-8">
          <ol className="relative space-y-0">
            {careerEvents.map(
              (event, index) => {
                const context =
                  getEventContext(event);

                const isLastEvent =
                  index ===
                  careerEvents.length - 1;

                return (
                  <li
                    key={event.id}
                    className="relative grid gap-4 pb-8 pl-9 sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-6 sm:pl-10"
                  >
                    {!isLastEvent ? (
                      <span
                        aria-hidden="true"
                        className="absolute bottom-0 left-[11px] top-6 w-px bg-white/10 sm:left-[13px]"
                      />
                    ) : null}

                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border border-white/15 bg-[#090d16] sm:h-7 sm:w-7"
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{
                          backgroundColor:
                            event.featured
                              ? player.accent
                              : "rgba(255, 255, 255, 0.35)",
                          boxShadow:
                            event.featured
                              ? `0 0 18px ${player.accent}`
                              : undefined,
                        }}
                      />
                    </span>

                    <div className="pt-0.5">
                      <time className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                        {getEventDateLabel(
                          event,
                        )}
                      </time>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55">
                          {event.category}
                        </span>

                        {event.featured ? (
                          <span
                            className="rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]"
                            style={{
                              borderColor: `${player.accent}55`,
                              backgroundColor: `${player.accent}16`,
                              color:
                                player.accent,
                            }}
                          >
                            Featured
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <article
                      className={[
                        "overflow-hidden rounded-2xl border bg-black/20 transition-colors",
                        event.featured
                          ? "border-white/15"
                          : "border-white/10",
                      ].join(" ")}
                    >
                      {event.imageUrl ? (
                        <div className="relative aspect-[16/7] overflow-hidden border-b border-white/10 bg-black/25">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={event.imageUrl}
                            alt=""
                            className="h-full w-full object-cover"
                          />

                          <div
                            aria-hidden="true"
                            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
                          />
                        </div>
                      ) : null}

                      <div className="p-5 sm:p-6">
                        {event.subtitle ? (
                          <p
                            className="text-xs font-semibold uppercase tracking-[0.18em]"
                            style={{
                              color:
                                player.accent,
                            }}
                          >
                            {event.subtitle}
                          </p>
                        ) : null}

                        <h3
                          className={[
                            "text-lg font-semibold leading-snug text-white sm:text-xl",
                            event.subtitle
                              ? "mt-2"
                              : "",
                          ].join(" ")}
                        >
                          {event.title}
                        </h3>

                        {context ? (
                          <p className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-white/40">
                            {context}
                          </p>
                        ) : null}

                        {event.description ? (
                          <p className="mt-4 text-sm leading-6 text-white/60">
                            {event.description}
                          </p>
                        ) : null}
                      </div>
                    </article>
                  </li>
                );
              },
            )}
          </ol>
        </div>
      )}
    </section>
  );
}