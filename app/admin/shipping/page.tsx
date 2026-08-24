import {
  CheckCircle2,
  Globe2,
  MapPinned,
  Save,
  ShieldCheck,
  Truck,
} from "lucide-react";

import {
  revalidatePath,
} from "next/cache";

import {
  redirect,
} from "next/navigation";

import AdminShell from "@/components/admin/AdminShell";
import AdminPanel from "@/components/admin/ui/AdminPanel";
import { prisma } from "@/lib/prisma";

export const dynamic =
  "force-dynamic";

const SHIPPING_COUNTRIES_SETTING_KEY =
  "commerce.shipping.allowedCountries";

const SHIPPING_COUNTRIES = [
  {
    code: "IT",
    name: "Italy",
    flag: "🇮🇹",
  },
  {
    code: "FR",
    name: "France",
    flag: "🇫🇷",
  },
  {
    code: "ES",
    name: "Spain",
    flag: "🇪🇸",
  },
  {
    code: "PT",
    name: "Portugal",
    flag: "🇵🇹",
  },
  {
    code: "BE",
    name: "Belgium",
    flag: "🇧🇪",
  },
  {
    code: "NL",
    name: "Netherlands",
    flag: "🇳🇱",
  },
  {
    code: "LU",
    name: "Luxembourg",
    flag: "🇱🇺",
  },
  {
    code: "PL",
    name: "Poland",
    flag: "🇵🇱",
  },
  {
    code: "DE",
    name: "Germany",
    flag: "🇩🇪",
  },
  {
    code: "AT",
    name: "Austria",
    flag: "🇦🇹",
  },
  {
    code: "CZ",
    name: "Czech Republic",
    flag: "🇨🇿",
  },
  {
    code: "SK",
    name: "Slovakia",
    flag: "🇸🇰",
  },
  {
    code: "SI",
    name: "Slovenia",
    flag: "🇸🇮",
  },
  {
    code: "HR",
    name: "Croatia",
    flag: "🇭🇷",
  },
  {
    code: "HU",
    name: "Hungary",
    flag: "🇭🇺",
  },
  {
    code: "RO",
    name: "Romania",
    flag: "🇷🇴",
  },
  {
    code: "BG",
    name: "Bulgaria",
    flag: "🇧🇬",
  },
  {
    code: "DK",
    name: "Denmark",
    flag: "🇩🇰",
  },
  {
    code: "SE",
    name: "Sweden",
    flag: "🇸🇪",
  },
  {
    code: "FI",
    name: "Finland",
    flag: "🇫🇮",
  },
  {
    code: "IE",
    name: "Ireland",
    flag: "🇮🇪",
  },
  {
    code: "GR",
    name: "Greece",
    flag: "🇬🇷",
  },
  {
    code: "EE",
    name: "Estonia",
    flag: "🇪🇪",
  },
  {
    code: "LV",
    name: "Latvia",
    flag: "🇱🇻",
  },
  {
    code: "LT",
    name: "Lithuania",
    flag: "🇱🇹",
  },
  {
    code: "GB",
    name: "United Kingdom",
    flag: "🇬🇧",
  },
] as const;

type SearchParams =
  Promise<{
    saved?: string;
    error?: string;
  }>;

function parseAllowedCountries(
  value: unknown,
): string[] {
  if (!Array.isArray(value)) {
    return ["IT"];
  }

  const validCodes =
    new Set<string>(
      SHIPPING_COUNTRIES.map(
        (country) =>
          country.code,
      ),
    );

  const countries =
    value.filter(
      (
        item,
      ): item is string =>
        typeof item === "string" &&
        validCodes.has(item),
    );

  return countries.length > 0
    ? countries
    : ["IT"];
}

async function updateShippingCountries(
  formData: FormData,
) {
  "use server";

  const allowedCountries =
    SHIPPING_COUNTRIES
      .filter(
        (country) =>
          formData.get(
            `country_${country.code}`,
          ) === "on",
      )
      .map(
        (country) =>
          country.code,
      );

  if (
    allowedCountries.length === 0
  ) {
    redirect(
      "/admin/shipping?error=no-countries",
    );
  }

  await prisma.museumSetting.upsert({
    where: {
      key:
        SHIPPING_COUNTRIES_SETTING_KEY,
    },

    update: {
      group:
        "commerce",

      label:
        "Allowed shipping countries",

      description:
        "Countries enabled for AGE202 checkout and shipping.",

      value:
        allowedCountries,
    },

    create: {
      key:
        SHIPPING_COUNTRIES_SETTING_KEY,

      group:
        "commerce",

      label:
        "Allowed shipping countries",

      description:
        "Countries enabled for AGE202 checkout and shipping.",

      value:
        allowedCountries,
    },
  });

  revalidatePath(
    "/admin/shipping",
  );

  revalidatePath(
    "/admin",
  );

  redirect(
    "/admin/shipping?saved=shipping",
  );
}

export default async function AdminShippingPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const resolvedSearchParams =
    await searchParams;

  const shippingSetting =
    await prisma.museumSetting.findUnique({
      where: {
        key:
          SHIPPING_COUNTRIES_SETTING_KEY,
      },

      select: {
        value: true,
        updatedAt: true,
      },
    });

  const allowedCountries =
    parseAllowedCountries(
      shippingSetting?.value,
    );

  const allowedCountrySet =
    new Set(
      allowedCountries,
    );

  const saved =
    resolvedSearchParams.saved ===
    "shipping";

  const noCountriesError =
    resolvedSearchParams.error ===
    "no-countries";

  return (
    <AdminShell
      title="Shipping"
      description="Configure AGE202 shipping zones and checkout availability."
    >
      <div className="space-y-7">
        {saved ? (
          <div
            role="status"
            className="rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.08] px-5 py-4"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-300" />

              <div>
                <p className="font-semibold text-emerald-200">
                  Shipping settings saved
                </p>

                <p className="mt-1 text-sm text-white/45">
                  AGE202 ha aggiornato i
                  Paesi autorizzati per
                  checkout e spedizione.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {noCountriesError ? (
          <div
            role="alert"
            className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.08] px-5 py-4"
          >
            <p className="font-semibold text-amber-200">
              Seleziona almeno un Paese.
            </p>

            <p className="mt-1 text-sm text-white/45">
              AGE202 non può avere una
              zona di spedizione vuota.
            </p>
          </div>
        ) : null}

        <section className="relative overflow-hidden rounded-[2rem] border border-lime-300/15 bg-gradient-to-br from-lime-300/[0.08] via-white/[0.025] to-transparent p-6 sm:p-8">
          <div
            aria-hidden="true"
            className="absolute -right-24 -top-24 size-72 rounded-full bg-lime-300/[0.08] blur-3xl"
          />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-lime-300/70">
                <Globe2 className="size-4" />

                AGE202 Shipping Zone
              </div>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">
                Where AGE202 can ship.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50 sm:text-base">
                Attiva solamente i Paesi
                verso i quali AGE202 può
                garantire una spedizione.
                I Paesi disattivati non
                saranno disponibili nel
                checkout Stripe.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/15 px-5 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
                Active markets
              </p>

              <p className="mt-2 text-3xl font-semibold text-lime-300">
                {
                  allowedCountries.length
                }
              </p>
            </div>
          </div>
        </section>

        <form
          action={
            updateShippingCountries
          }
        >
          <AdminPanel className="p-6 sm:p-7">
            <div className="flex flex-col gap-5 border-b border-white/[0.07] pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <MapPinned className="size-5 text-sky-300" />

                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                    Shipping countries
                  </p>
                </div>

                <h2 className="mt-2 text-2xl font-semibold text-white">
                  European markets
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
                  Abilita un Paese solo
                  dopo aver verificato che
                  il servizio logistico
                  scelto supporti quella
                  destinazione.
                </p>
              </div>

              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-lime-300 px-5 text-sm font-semibold text-[#050B18] transition hover:bg-lime-200"
              >
                <Save className="size-4" />

                Save shipping zone
              </button>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {SHIPPING_COUNTRIES.map(
                (country) => {
                  const enabled =
                    allowedCountrySet.has(
                      country.code,
                    );

                  return (
                    <label
                      key={
                        country.code
                      }
                      className={[
                        "group flex cursor-pointer items-center justify-between gap-4 rounded-2xl border px-4 py-4 transition",
                        enabled
                          ? "border-lime-300/20 bg-lime-300/[0.06]"
                          : "border-white/[0.07] bg-white/[0.025] hover:border-white/15 hover:bg-white/[0.04]",
                      ].join(" ")}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          aria-hidden="true"
                          className="text-2xl"
                        >
                          {
                            country.flag
                          }
                        </span>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white/80">
                            {
                              country.name
                            }
                          </p>

                          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
                            {
                              country.code
                            }
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={[
                            "text-[10px] font-bold uppercase tracking-[0.16em]",
                            enabled
                              ? "text-lime-300"
                              : "text-white/25",
                          ].join(
                            " ",
                          )}
                        >
                          {enabled
                            ? "ON"
                            : "OFF"}
                        </span>

                        <input
                          type="checkbox"
                          name={`country_${country.code}`}
                          defaultChecked={
                            enabled
                          }
                          className="size-5 accent-lime-300"
                        />
                      </div>
                    </label>
                  );
                },
              )}
            </div>
          </AdminPanel>
        </form>

        <div className="grid gap-6 lg:grid-cols-2">
          <AdminPanel className="p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <ShieldCheck className="size-5 text-emerald-300" />

              <h2 className="text-lg font-semibold text-white">
                Checkout protection
              </h2>
            </div>

            <p className="mt-4 text-sm leading-7 text-white/45">
              Stripe utilizzerà questa
              configurazione per mostrare
              solamente le destinazioni
              autorizzate. Un cliente di
              un Paese disattivato non
              potrà selezionare quel Paese
              come indirizzo di
              spedizione.
            </p>
          </AdminPanel>

          <AdminPanel className="p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <Truck className="size-5 text-sky-300" />

              <h2 className="text-lg font-semibold text-white">
                Logistics provider
              </h2>
            </div>

            <p className="mt-4 text-sm leading-7 text-white/45">
              InPost sarà il provider
              logistico principale. In
              futuro potremo associare
              altri corrieri ai Paesi non
              coperti senza modificare il
              sistema ordini AGE202.
            </p>
          </AdminPanel>
        </div>

        {shippingSetting?.updatedAt ? (
          <p className="text-right text-xs text-white/25">
            Last shipping update:{" "}
            {new Intl.DateTimeFormat(
              "it-IT",
              {
                dateStyle:
                  "medium",

                timeStyle:
                  "short",
              },
            ).format(
              shippingSetting.updatedAt,
            )}
          </p>
        ) : null}
      </div>
    </AdminShell>
  );
}