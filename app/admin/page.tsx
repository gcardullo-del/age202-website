import {
  Archive,
  BadgeCheck,
  Boxes,
  CheckCircle2,
  CircleAlert,
  Clock3,
  CreditCard,
  Gem,
  PackageCheck,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Tags,
  Truck,
  Users,
} from "lucide-react";
import Link from "next/link";

import AdminShell from "@/components/admin/AdminShell";
import StatsCard from "@/components/admin/dashboard/StatsCard";
import AdminPanel from "@/components/admin/ui/AdminPanel";
import { prisma } from "@/lib/prisma";
import { getMuseumStatistics } from "@/lib/services/museum.service";

export const dynamic = "force-dynamic";

function formatLabel(value: string): string {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency,
  }).format(value);
}

function getCount(groups: Record<string, number>, keys: string[]): number {
  return keys.reduce((total, key) => total + (groups[key] ?? 0), 0);
}

function getPercentage(value: number, total: number): number {
  if (total <= 0) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

type ProgressItemProps = {
  label: string;
  value: number;
  total: number;
};

function ProgressItem({ label, value, total }: ProgressItemProps) {
  const percentage = getPercentage(value, total);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4 text-sm">
        <span className="font-medium text-white/75">{label}</span>

        <span className="tabular-nums text-white/40">
          {value} · {percentage}%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          aria-label={`${label}: ${percentage}%`}
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={percentage}
          className="h-full rounded-full bg-gradient-to-r from-lime-300 to-emerald-300"
          role="progressbar"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

type StatusRowProps = {
  label: string;
  value: string;
  warning?: boolean;
};

function StatusRow({ label, value, warning = false }: StatusRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4 py-3.5">
      <div className="flex items-center gap-3">
        <span
          className={[
            "flex size-8 items-center justify-center rounded-xl border",
            warning
              ? "border-amber-300/20 bg-amber-300/10 text-amber-200"
              : "border-emerald-300/20 bg-emerald-300/10 text-emerald-200",
          ].join(" ")}
        >
          {warning ? (
            <CircleAlert className="size-4" aria-hidden="true" />
          ) : (
            <CheckCircle2 className="size-4" aria-hidden="true" />
          )}
        </span>

        <span className="text-sm font-medium text-white/70">{label}</span>
      </div>

      <span className="text-right text-xs font-semibold uppercase tracking-[0.14em] text-white/40">
        {value}
      </span>
    </div>
  );
}

type CommerceMetricProps = {
  label: string;
  value: string | number;
  description: string;
  icon: typeof ShoppingBag;
  tone?: "lime" | "emerald" | "sky" | "amber";
};

function CommerceMetric({
  label,
  value,
  description,
  icon: Icon,
  tone = "lime",
}: CommerceMetricProps) {
  const toneClasses = {
    lime: "border-lime-300/20 bg-lime-300/[0.07] text-lime-300",
    emerald:
      "border-emerald-300/20 bg-emerald-300/[0.07] text-emerald-300",
    sky: "border-sky-300/20 bg-sky-300/[0.07] text-sky-300",
    amber: "border-amber-300/20 bg-amber-300/[0.07] text-amber-300",
  };

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
            {label}
          </p>

          <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">
            {value}
          </p>
        </div>

        <span
          className={[
            "flex size-10 shrink-0 items-center justify-center rounded-xl border",
            toneClasses[tone],
          ].join(" ")}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </div>

      <p className="mt-3 text-xs leading-5 text-white/35">{description}</p>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const [statistics, orders] = await Promise.all([
    getMuseumStatistics(),

    prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        status: true,
        paymentStatus: true,
        shippingStatus: true,
        total: true,
        currency: true,
      },
    }),
  ]);

  const availableArtifacts = getCount(statistics.artifactsByAvailability, [
    "AVAILABLE",
    "Available",
    "available",
  ]);

  const soldArtifacts = getCount(statistics.artifactsByAvailability, [
    "SOLD",
    "Sold",
    "sold",
  ]);

  const certifiedPercentage = getPercentage(
    statistics.certifiedArtifacts,
    statistics.artifacts,
  );

  const verifiedPercentage = getPercentage(
    statistics.verifiedCertificates,
    statistics.certificates,
  );

  const authenticPercentage = getPercentage(
    statistics.authenticArtifacts,
    statistics.artifacts,
  );

  const categoryGroups = Object.entries(statistics.artifactsByCategory).sort(
    ([, first], [, second]) => second - first,
  );

  const rarityGroups = Object.entries(statistics.artifactsByRarity).sort(
    ([, first], [, second]) => second - first,
  );

  const paidOrders = orders.filter(
    (order) => order.paymentStatus === "PAID",
  );

  const paidOrdersCount = paidOrders.length;

  const totalRevenue = paidOrders.reduce(
    (total, order) => total + Number(order.total),
    0,
  );

  const preparingOrders = orders.filter(
    (order) =>
      order.paymentStatus === "PAID" &&
      order.status === "PROCESSING",
  ).length;

  const waitingShipment = orders.filter(
    (order) =>
      order.paymentStatus === "PAID" &&
      order.shippingStatus !== "DELIVERED" &&
      order.shippingStatus !== "CANCELLED",
  ).length;

  const commerceCurrency =
    paidOrders.find((order) => order.currency)?.currency ?? "EUR";

  return (
    <AdminShell
      title="Museum Dashboard"
      description="The AGE202 archive command centre."
    >
      <div className="space-y-7">
        <section className="relative overflow-hidden rounded-[2rem] border border-lime-300/15 bg-gradient-to-br from-lime-300/[0.09] via-white/[0.035] to-transparent p-6 shadow-2xl shadow-black/20 sm:p-8">
          <div
            aria-hidden="true"
            className="absolute -right-24 -top-28 size-80 rounded-full bg-lime-300/10 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime-200/80 to-transparent"
          />

          <div className="relative flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-lime-200/70">
                <Sparkles className="size-4" aria-hidden="true" />
                AGE202 Museum Control Room
              </div>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-white sm:text-5xl">
                Preserve the story.
                <span className="block text-white/45">
                  Manage the archive.
                </span>
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50 sm:text-base">
                Monitor artifacts, authenticity, availability and certificates
                from one focused workspace built for the AGE202 digital museum.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3.5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.09]"
              >
                Visit museum
              </Link>

              <Link
                href="/admin/artifacts/new"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-lime-300 px-5 py-3.5 text-sm font-semibold text-[#050B18] transition hover:bg-lime-200"
              >
                <Plus className="size-4" aria-hidden="true" />
                New artifact
              </Link>
            </div>
          </div>
        </section>

        <section aria-labelledby="overview-title">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/35">
              Live overview
            </p>

            <h2
              id="overview-title"
              className="mt-2 text-2xl font-semibold text-white"
            >
              Museum at a glance
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatsCard
              title="Artifacts"
              value={statistics.artifacts}
              description="Records in the archive"
              icon={Archive}
            />

            <StatsCard
              title="Players"
              value={statistics.players}
              description="Champions represented"
              icon={Users}
              tone="info"
            />

            <StatsCard
              title="Brands"
              value={statistics.brands}
              description="Historic manufacturers"
              icon={Tags}
              tone="premium"
            />

            <StatsCard
              title="Certificates"
              value={statistics.certificates}
              description={`${statistics.verifiedCertificates} verified`}
              icon={BadgeCheck}
              tone="success"
            />
          </div>
        </section>

        <section aria-labelledby="commerce-title">
          <AdminPanel className="overflow-hidden p-0">
            <div className="relative border-b border-white/[0.07] p-6 sm:p-7">
              <div
                aria-hidden="true"
                className="absolute right-0 top-0 size-56 rounded-full bg-lime-300/[0.05] blur-3xl"
              />

              <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <ShoppingBag
                      className="size-4 text-lime-300"
                      aria-hidden="true"
                    />

                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lime-300/70">
                      Commerce operations
                    </p>
                  </div>

                  <h2
                    id="commerce-title"
                    className="mt-2 text-2xl font-semibold text-white"
                  >
                    Order fulfillment
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
                    Live Stripe orders and logistics status from the AGE202
                    commerce workflow.
                  </p>
                </div>

                <Link
                  href="/admin/orders"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-lime-300 px-5 py-3 text-sm font-semibold text-[#050B18] transition hover:bg-lime-200"
                >
                  Open Orders
                  <ShoppingBag className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-7 xl:grid-cols-4">
              <CommerceMetric
                label="Paid orders"
                value={paidOrdersCount}
                description="Successfully confirmed payments"
                icon={CheckCircle2}
                tone="emerald"
              />

              <CommerceMetric
                label="Revenue"
                value={formatCurrency(totalRevenue, commerceCurrency)}
                description="Revenue from paid AGE202 orders"
                icon={CreditCard}
                tone="lime"
              />

              <CommerceMetric
                label="Preparing"
                value={preparingOrders}
                description="Orders currently being prepared"
                icon={PackageCheck}
                tone="amber"
              />

              <CommerceMetric
                label="Waiting shipment"
                value={waitingShipment}
                description="Paid orders not yet delivered"
                icon={Truck}
                tone="sky"
              />
            </div>

            {waitingShipment > 0 ? (
              <div className="border-t border-white/[0.07] px-6 py-4 sm:px-7">
                <div className="flex items-center gap-3 text-sm text-white/45">
                  <Clock3
                    className="size-4 shrink-0 text-sky-300"
                    aria-hidden="true"
                  />

                  <span>
                    {waitingShipment === 1
                      ? "1 paid order requires logistics attention."
                      : `${waitingShipment} paid orders require logistics attention.`}
                  </span>
                </div>
              </div>
            ) : null}
          </AdminPanel>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <AdminPanel className="p-6 sm:p-7">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                  Collection intelligence
                </p>

                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Archive composition
                </h2>
              </div>

              <span className="text-sm text-white/35">
                {statistics.artifacts} total records
              </span>
            </div>

            <div className="mt-7 space-y-5">
              {categoryGroups.length > 0 ? (
                categoryGroups.map(([category, count]) => (
                  <ProgressItem
                    key={category}
                    label={formatLabel(category)}
                    value={count}
                    total={statistics.artifacts}
                  />
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 px-5 py-10 text-center text-sm text-white/40">
                  No categories are available yet.
                </div>
              )}
            </div>
          </AdminPanel>

          <AdminPanel className="p-6 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
              Museum health
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-white">
              Archive integrity
            </h2>

            <div className="mt-6 space-y-3">
              <StatusRow label="Database" value="Operational" />

              <StatusRow
                label="Certification coverage"
                value={`${certifiedPercentage}%`}
                warning={statistics.uncertifiedArtifacts > 0}
              />

              <StatusRow
                label="Certificate verification"
                value={`${verifiedPercentage}%`}
                warning={statistics.unverifiedCertificates > 0}
              />

              <StatusRow
                label="Authenticity records"
                value={`${authenticPercentage}%`}
                warning={
                  statistics.authenticArtifacts < statistics.artifacts
                }
              />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-white/30">
                  Available
                </p>

                <p className="mt-2 text-2xl font-semibold text-white">
                  {availableArtifacts}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-white/30">
                  Sold
                </p>

                <p className="mt-2 text-2xl font-semibold text-white">
                  {soldArtifacts}
                </p>
              </div>
            </div>
          </AdminPanel>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <AdminPanel className="p-6 lg:col-span-2 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                  Rarity profile
                </p>

                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Collection value map
                </h2>
              </div>

              <Gem
                className="size-6 text-yellow-100/70"
                aria-hidden="true"
              />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {rarityGroups.length > 0 ? (
                rarityGroups.map(([rarity, count]) => (
                  <div
                    key={rarity}
                    className="flex items-center justify-between rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4 py-4"
                  >
                    <span className="text-sm font-medium text-white/65">
                      {formatLabel(rarity)}
                    </span>

                    <span className="rounded-full bg-white/[0.06] px-3 py-1 text-sm font-semibold tabular-nums text-white">
                      {count}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-white/40">
                  No rarity data available.
                </p>
              )}
            </div>
          </AdminPanel>

          <AdminPanel className="p-6 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
              Quick actions
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-white">
              Keep moving
            </h2>

            <div className="mt-6 space-y-3">
              {[
                {
                  href: "/admin/orders",
                  label: "Manage orders",
                  icon: ShoppingBag,
                },
                {
                  href: "/admin/artifacts",
                  label: "Manage artifacts",
                  icon: Boxes,
                },
                {
                  href: "/admin/artifacts/new",
                  label: "Add new artifact",
                  icon: Plus,
                },
                {
                  href: "/admin/media",
                  label: "Open media library",
                  icon: ShoppingBag,
                },
              ].map((action) => {
                const Icon = action.icon;

                return (
                  <Link
                    key={action.href + action.label}
                    href={action.href}
                    className="group flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4 py-3.5 text-sm font-medium text-white/65 transition hover:border-lime-300/20 hover:bg-lime-300/[0.06] hover:text-white"
                  >
                    <span className="flex size-9 items-center justify-center rounded-xl bg-white/[0.05] text-white/50 transition group-hover:bg-lime-300 group-hover:text-[#050B18]">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>

                    {action.label}
                  </Link>
                );
              })}
            </div>
          </AdminPanel>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            title="Authentic"
            value={statistics.authenticArtifacts}
            description={`${authenticPercentage}% of archive`}
            icon={ShieldCheck}
            tone="success"
          />

          <StatsCard
            title="Vintage"
            value={statistics.vintageArtifacts}
            description="Historic pieces"
            icon={Sparkles}
            tone="warning"
          />

          <StatsCard
            title="Certified"
            value={statistics.certifiedArtifacts}
            description={`${certifiedPercentage}% coverage`}
            icon={PackageCheck}
            tone="info"
          />

          <StatsCard
            title="To certify"
            value={statistics.uncertifiedArtifacts}
            description="Records requiring attention"
            icon={CircleAlert}
            tone={
              statistics.uncertifiedArtifacts > 0
                ? "danger"
                : "success"
            }
          />
        </section>
      </div>
    </AdminShell>
  );
}