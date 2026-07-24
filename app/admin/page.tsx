import Link from "next/link";

import StatsCard from "@/components/admin/dashboard/StatsCard";
import {
  getMuseumStatistics,
} from "@/lib/services/museum.service";

export const dynamic = "force-dynamic";

type IconProps = {
  className?: string;
  "aria-hidden"?: boolean;
};

function MuseumIcon({
  className,
}: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M3 9h18M5 9v9m4-9v9m6-9v9m4-9v9M3 18h18M2 21h20M12 3l9 4H3l9-4Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function CertificateIcon({
  className,
}: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M7 3h10a2 2 0 0 1 2 2v14l-3-2-4 3-4-3-3 2V5a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="M8 8h8M8 12h6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function PlayerIcon({
  className,
}: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        cx="12"
        cy="8"
        r="4"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M4.5 21a7.5 7.5 0 0 1 15 0"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function BrandIcon({
  className,
}: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="m4 7 8-4 8 4-8 4-8-4Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="m4 12 8 4 8-4M4 17l8 4 8-4"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function VerifiedIcon({
  className,
}: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="m9 12 2 2 4-5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M12 3 15 5l3.5.5L19 9l2 3-2 3-.5 3.5L15 19l-3 2-3-2-3.5-.5L5 15l-2-3 2-3 .5-3.5L9 5l3-2Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function VintageIcon({
  className,
}: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M12 7v5l3 2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function AuthenticIcon({
  className,
}: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M12 3 5 6v5c0 4.6 2.9 8 7 10 4.1-2 7-5.4 7-10V6l-7-3Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="m9 12 2 2 4-5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function WarningIcon({
  className,
}: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M12 4 3 20h18L12 4Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="M12 9v5M12 17.5v.1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function formatLabel(
  value: string,
): string {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

function getCount(
  groups: Record<string, number>,
  keys: string[],
): number {
  return keys.reduce(
    (total, key) =>
      total + (groups[key] ?? 0),
    0,
  );
}

function getPercentage(
  value: number,
  total: number,
): number {
  if (total === 0) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

export default async function AdminDashboardPage() {
  const statistics =
    await getMuseumStatistics();

  const availableArtifacts = getCount(
    statistics.artifactsByAvailability,
    [
      "AVAILABLE",
      "Available",
      "available",
    ],
  );

  const soldArtifacts = getCount(
    statistics.artifactsByAvailability,
    [
      "SOLD",
      "Sold",
      "sold",
    ],
  );

  const verifiedPercentage = getPercentage(
    statistics.verifiedCertificates,
    statistics.certificates,
  );

  const certifiedPercentage = getPercentage(
    statistics.certifiedArtifacts,
    statistics.artifacts,
  );

  const authenticPercentage = getPercentage(
    statistics.authenticArtifacts,
    statistics.artifacts,
  );

  const collectionGroups = Object.entries(
    statistics.artifactsByCategory,
  ).sort(([, firstCount], [, secondCount]) =>
    secondCount - firstCount,
  );

  const alerts = [
    {
      label: "Cimeli senza certificato",
      value: statistics.uncertifiedArtifacts,
      href: "/admin/artifacts",
    },
    {
      label: "Certificati da verificare",
      value: statistics.unverifiedCertificates,
      href: "/admin/certificates",
    },
  ].filter((alert) => alert.value > 0);

  return (
    <main className="min-h-screen bg-[#050b18] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 sm:p-8">
          <div
            aria-hidden="true"
            className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/[0.06] blur-3xl"
          />

          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"
          />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
                AGE202 Digital Tennis Museum
              </p>

              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
                Museum Dashboard
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
                Controlla la crescita dell&apos;archivio,
                l&apos;autenticità dei cimeli e lo stato dei
                certificati da un unico centro di comando.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                className="rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.1]"
                href="/"
              >
                Visita il museo
              </Link>

              <Link
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#050b18] transition hover:bg-white/90"
                href="/admin/artifacts/new"
              >
                Nuovo cimelio
              </Link>
            </div>
          </div>
        </header>

        <section
          aria-labelledby="museum-overview-title"
          className="mt-8"
        >
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">
                Overview
              </p>

              <h2
                className="mt-2 text-2xl font-semibold"
                id="museum-overview-title"
              >
                Il museo in numeri
              </h2>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatsCard
              description="Cimeli presenti nell'archivio"
              icon={MuseumIcon}
              title="Cimeli"
              value={statistics.artifacts}
            />

            <StatsCard
              description={`${statistics.verifiedCertificates} verificati`}
              icon={CertificateIcon}
              title="Certificati"
              tone="premium"
              value={statistics.certificates}
            />

            <StatsCard
              description="Campioni rappresentati"
              icon={PlayerIcon}
              title="Giocatori"
              tone="info"
              value={statistics.players}
            />

            <StatsCard
              description="Marchi presenti nel museo"
              icon={BrandIcon}
              title="Brand"
              value={statistics.brands}
            />

            <StatsCard
              description={`${verifiedPercentage}% dei certificati`}
              icon={VerifiedIcon}
              title="Verificati"
              tone="success"
              value={statistics.verifiedCertificates}
            />

            <StatsCard
              description={`${authenticPercentage}% dell'archivio`}
              icon={AuthenticIcon}
              title="Autentici"
              tone="success"
              value={statistics.authenticArtifacts}
            />

            <StatsCard
              description="Cimeli identificati come vintage"
              icon={VintageIcon}
              title="Vintage"
              tone="warning"
              value={statistics.vintageArtifacts}
            />

            <StatsCard
              description={`${certifiedPercentage}% dell'archivio`}
              icon={CertificateIcon}
              title="Certificati"
              tone="info"
              value={statistics.certifiedArtifacts}
            />
          </div>
        </section>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <section
            aria-labelledby="collection-title"
            className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/10"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">
                  Collection overview
                </p>

                <h2
                  className="mt-2 text-2xl font-semibold"
                  id="collection-title"
                >
                  Distribuzione per categoria
                </h2>
              </div>

              <p className="text-sm text-white/45">
                {statistics.artifacts} cimeli totali
              </p>
            </div>

            <div className="mt-7 space-y-5">
              {collectionGroups.length > 0 ? (
                collectionGroups.map(
                  ([category, count]) => {
                    const percentage =
                      getPercentage(
                        count,
                        statistics.artifacts,
                      );

                    return (
                      <div key={category}>
                        <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                          <span className="font-medium text-white/80">
                            {formatLabel(category)}
                          </span>

                          <span className="text-white/45">
                            {count} · {percentage}%
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                          <div
                            aria-label={`${formatLabel(category)}: ${percentage}%`}
                            className="h-full rounded-full bg-white/70"
                            role="progressbar"
                            style={{
                              width: `${percentage}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  },
                )
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-white/45">
                  Nessuna categoria disponibile.
                </div>
              )}
            </div>
          </section>

          <section
            aria-labelledby="health-title"
            className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/10"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">
              Museum health
            </p>

            <h2
              className="mt-2 text-2xl font-semibold"
              id="health-title"
            >
              Stato dell&apos;archivio
            </h2>

            <div className="mt-6 space-y-3">
              <HealthRow
                label="Database"
                status="Operativo"
              />

              <HealthRow
                label="Archivio"
                status={`${statistics.artifacts} record`}
              />

              <HealthRow
                label="Certificazione"
                status={`${certifiedPercentage}% coperto`}
                warning={
                  statistics.uncertifiedArtifacts >
                  0
                }
              />

              <HealthRow
                label="Verifica"
                status={`${verifiedPercentage}% verificato`}
                warning={
                  statistics.unverifiedCertificates >
                  0
                }
              />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <MiniMetric
                label="Disponibili"
                value={availableArtifacts}
              />

              <MiniMetric
                label="Venduti"
                value={soldArtifacts}
              />
            </div>
          </section>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section
            aria-labelledby="alerts-title"
            className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/10 text-amber-300">
                <WarningIcon className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                  Controlli
                </p>

                <h2
                  className="mt-1 text-xl font-semibold"
                  id="alerts-title"
                >
                  Attività richieste
                </h2>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {alerts.length > 0 ? (
                alerts.map((alert) => (
                  <Link
                    className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 transition hover:border-white/20 hover:bg-white/[0.06]"
                    href={alert.href}
                    key={alert.label}
                  >
                    <span className="text-sm text-white/70">
                      {alert.label}
                    </span>

                    <span className="rounded-full bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
                      {alert.value}
                    </span>
                  </Link>
                ))
              ) : (
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-5 text-sm text-emerald-200">
                  Il museo è perfettamente aggiornato.
                </div>
              )}
            </div>
          </section>

          <section
            aria-labelledby="quick-actions-title"
            className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">
              Quick actions
            </p>

            <h2
              className="mt-2 text-xl font-semibold"
              id="quick-actions-title"
            >
              Gestisci il museo
            </h2>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <QuickAction
                description="Aggiungi un nuovo pezzo all'archivio."
                href="/admin/artifacts/new"
                label="Nuovo cimelio"
              />

              <QuickAction
                description="Inserisci un nuovo campione."
                href="/admin/players/new"
                label="Nuovo giocatore"
              />

              <QuickAction
                description="Registra un marchio."
                href="/admin/brands/new"
                label="Nuovo brand"
              />

              <QuickAction
                description="Controlla tutti i certificati."
                href="/admin/certificates"
                label="Certificati"
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function HealthRow({
  label,
  status,
  warning = false,
}: {
  label: string;
  status: string;
  warning?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className={[
            "h-2.5 w-2.5 rounded-full",
            warning
              ? "bg-amber-400"
              : "bg-emerald-400",
          ].join(" ")}
        />

        <span className="text-sm font-medium text-white/75">
          {label}
        </span>
      </div>

      <span className="text-xs text-white/45">
        {status}
      </span>
    </div>
  );
}

function MiniMetric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs uppercase tracking-[0.15em] text-white/35">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold">
        {value}
      </p>
    </div>
  );
}

function QuickAction({
  label,
  description,
  href,
}: {
  label: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      className="group rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.07]"
      href={href}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-semibold text-white">
          {label}
        </span>

        <span
          aria-hidden="true"
          className="text-white/35 transition group-hover:translate-x-1 group-hover:text-white"
        >
          →
        </span>
      </div>

      <p className="mt-2 text-sm leading-6 text-white/45">
        {description}
      </p>
    </Link>
  );
}