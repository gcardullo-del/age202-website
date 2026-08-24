"use client";

import {
  CheckCircle2,
  Crown,
  Trophy,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useLegendStudio,
} from "@/components/admin/legend-studio/LegendStudioForm";

type SlamField =
  | "australianOpen"
  | "rolandGarros"
  | "wimbledon"
  | "usOpen";

type SlamValues = Record<
  SlamField,
  number
>;

type GrandSlamsSectionProps = {
  initialAustralianOpen?: number | null;
  initialRolandGarros?: number | null;
  initialWimbledon?: number | null;
  initialUsOpen?: number | null;
};

export default function GrandSlamsSection({
  initialAustralianOpen = 0,
  initialRolandGarros = 0,
  initialWimbledon = 0,
  initialUsOpen = 0,
}: GrandSlamsSectionProps) {
  const {
    preview,
    updatePreview,
  } = useLegendStudio();

  const [
    values,
    setValues,
  ] =
    useState<SlamValues>(
      () => ({
        australianOpen:
          initialAustralianOpen ?? 0,
        rolandGarros:
          initialRolandGarros ?? 0,
        wimbledon:
          initialWimbledon ?? 0,
        usOpen:
          initialUsOpen ?? 0,
      }),
    );

  const total =
    useMemo(
      () =>
        Object.values(values).reduce(
          (
            sum,
            value,
          ) => sum + value,
          0,
        ),
      [values],
    );

  useEffect(() => {
    if (
      preview.grandSlams !==
      total
    ) {
      updatePreview({
        grandSlams: total,
      });
    }
  }, [
    preview.grandSlams,
    total,
    updatePreview,
  ]);

  const matchesTotal =
    preview.grandSlams === total;

  function updateSlam(
    field: SlamField,
    value: number,
  ) {
    setValues((current) => {
      const next = {
        ...current,
        [field]: value,
      };

      const nextTotal =
        Object.values(next).reduce(
          (
            sum,
            item,
          ) => sum + item,
          0,
        );

      updatePreview({
        grandSlams:
          nextTotal,
      });

      return next;
    });
  }

  return (
    <section className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-lime-300/75">
          <Trophy className="size-4" />

          <p className="text-[10px] font-black uppercase tracking-[0.22em]">
            Grand Slam record
          </p>
        </div>

        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-white">
          Major championship legacy
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/40">
          Record the player&apos;s singles
          titles across the four Grand Slam
          tournaments. Legend Studio keeps the
          total synchronized automatically.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <SlamCard
          label="Australian Open"
          name="australianOpen"
          value={values.australianOpen}
          onChange={(value) =>
            updateSlam(
              "australianOpen",
              value,
            )
          }
        />

        <SlamCard
          label="Roland Garros"
          name="rolandGarros"
          value={values.rolandGarros}
          onChange={(value) =>
            updateSlam(
              "rolandGarros",
              value,
            )
          }
        />

        <SlamCard
          label="Wimbledon"
          name="wimbledon"
          value={values.wimbledon}
          onChange={(value) =>
            updateSlam(
              "wimbledon",
              value,
            )
          }
        />

        <SlamCard
          label="US Open"
          name="usOpen"
          value={values.usOpen}
          onChange={(value) =>
            updateSlam(
              "usOpen",
              value,
            )
          }
        />
      </div>

      <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#07101D]/55">
        <div className="grid gap-0 lg:grid-cols-[1fr_auto]">
          <div className="p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-2xl border border-lime-300/15 bg-lime-300/[0.06]">
                <Crown className="size-6 text-lime-300" />
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-lime-300/70">
                  Grand Slam total
                </p>

                <p className="mt-1 text-4xl font-semibold tracking-[-0.04em] text-white">
                  {total}
                </p>
              </div>
            </div>

            <p className="mt-4 max-w-2xl text-xs leading-6 text-white/35">
              This total is calculated from the
              four tournament fields and is used
              by the live Legend preview.
            </p>
          </div>

          <div className="flex items-center border-t border-white/10 p-6 lg:border-l lg:border-t-0">
            <div
              className={[
                "rounded-2xl border px-5 py-4",
                matchesTotal
                  ? "border-emerald-300/15 bg-emerald-300/[0.05]"
                  : "border-amber-300/15 bg-amber-300/[0.05]",
              ].join(" ")}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2
                  className={[
                    "size-4",
                    matchesTotal
                      ? "text-emerald-300"
                      : "text-amber-300",
                  ].join(" ")}
                />

                <p
                  className={[
                    "text-xs font-semibold",
                    matchesTotal
                      ? "text-emerald-100"
                      : "text-amber-100",
                  ].join(" ")}
                >
                  {matchesTotal
                    ? "Grand Slam total synchronized"
                    : "Updating Grand Slam total"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <input
        type="hidden"
        name="grandSlams"
        value={total}
        readOnly
      />
    </section>
  );
}

function SlamCard({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: SlamField;
  value: number;
  onChange: (
    value: number,
  ) => void;
}) {
  return (
    <label className="block rounded-[26px] border border-white/10 bg-white/[0.02] p-5 transition focus-within:border-lime-300/25">
      <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/35">
        {label}
      </span>

      <div className="mt-4 flex items-end gap-3">
        <input
          name={name}
          type="number"
          min={0}
          value={value}
          onChange={(event) => {
            const parsed =
              Number(
                event.target.value,
              );

            onChange(
              Number.isFinite(parsed)
                ? Math.max(
                    0,
                    parsed,
                  )
                : 0,
            );
          }}
          className="w-full rounded-2xl border border-white/10 bg-[#050B18]/75 px-4 py-3.5 text-2xl font-semibold text-white outline-none transition focus:border-lime-300/35 focus:ring-2 focus:ring-lime-300/10"
        />

        <span className="pb-3 text-xs font-semibold text-white/25">
          titles
        </span>
      </div>
    </label>
  );
}