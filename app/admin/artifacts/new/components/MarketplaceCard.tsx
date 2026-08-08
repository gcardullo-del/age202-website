"use client";

import {
  ExternalLink,
  ShoppingBag,
} from "lucide-react";

import type {
  ArtifactAvailability,
} from "@/generated/prisma/client";

import FormSection from "@/components/admin/FormSection";

import {
  useArtifactStudio,
} from "./ArtifactStudioContext";

export type MarketplaceInitialValues = {
  availability?: ArtifactAvailability | null;
  price?: number | string | null;
  currency?: string | null;
  vintedUrl?: string | null;
};

type MarketplaceCardProps = {
  initialValues?: MarketplaceInitialValues;
};

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-[#0A1222] px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-lime-300/40";

const labelClass =
  "mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-white/45";

export default function MarketplaceCard({
  initialValues,
}: MarketplaceCardProps) {
  const {
    updatePreview,
  } = useArtifactStudio();

  return (
    <FormSection
      title="Marketplace"
      description="Manage the commercial availability of this museum piece without affecting its permanent archival record."
      icon={<ShoppingBag size={20} />}
    >
      <div className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="availability"
              className={labelClass}
            >
              Availability
            </label>

            <select
              id="availability"
              name="availability"
              className={inputClass}
              defaultValue={
                initialValues?.availability ??
                "COMING_SOON"
              }
              onChange={(event) =>
                updatePreview({
                  availability:
                    event.target.value,
                })
              }
            >
              <option value="COMING_SOON">
                Coming Soon
              </option>

              <option value="AVAILABLE">
                Available
              </option>

              <option value="SOLD">
                Sold
              </option>

              <option value="NOT_FOR_SALE">
                Not for Sale
              </option>
            </select>

            <p className="mt-3 text-sm leading-6 text-white/35">
              This status controls how the piece is
              presented in the public AGE202 archive.
            </p>
          </div>

          <div>
            <label
              htmlFor="price"
              className={labelClass}
            >
              Price
            </label>

            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              inputMode="decimal"
              className={inputClass}
              placeholder="249.00"
              defaultValue={
                initialValues?.price != null
                  ? String(initialValues.price)
                  : ""
              }
              onChange={(event) =>
                updatePreview({
                  price:
                    event.target.value ||
                    null,
                })
              }
            />

            <p className="mt-3 text-sm leading-6 text-white/35">
              Leave this field empty when the piece
              does not currently have a public price.
            </p>
          </div>

          <div>
            <label
              htmlFor="currency"
              className={labelClass}
            >
              Currency
            </label>

            <select
              id="currency"
              name="currency"
              className={inputClass}
              defaultValue={
                initialValues?.currency ??
                "EUR"
              }
              onChange={(event) =>
                updatePreview({
                  currency:
                    event.target.value,
                })
              }
            >
              <option value="EUR">
                EUR — Euro (€)
              </option>

              <option value="USD">
                USD — US Dollar ($)
              </option>

              <option value="GBP">
                GBP — British Pound (£)
              </option>

              <option value="CHF">
                CHF — Swiss Franc
              </option>
            </select>

            <p className="mt-3 text-sm leading-6 text-white/35">
              The currency used for the displayed
              marketplace price.
            </p>
          </div>

          <div>
            <label
              htmlFor="vintedUrl"
              className={labelClass}
            >
              Vinted URL
            </label>

            <div className="relative">
              <input
                id="vintedUrl"
                name="vintedUrl"
                type="url"
                inputMode="url"
                autoComplete="url"
                className={`${inputClass} pr-12`}
                placeholder="https://www.vinted.it/items/..."
                defaultValue={
                  initialValues?.vintedUrl ??
                  ""
                }
              />

              <ExternalLink
                size={18}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/25"
              />
            </div>

            <p className="mt-3 text-sm leading-6 text-white/35">
              Visitors will use this link to complete
              the purchase directly on Vinted.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-lime-300/15 bg-lime-300/[0.04] p-6">
          <h3 className="text-base font-semibold text-lime-300">
            Permanent Museum Record
          </h3>

          <p className="mt-3 text-sm leading-6 text-white/45">
            Selling a piece never removes it from the
            AGE202 archive. Its photographs, historical
            information and museum story remain
            permanently preserved even after the
            commercial status changes to sold.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-sky-300/20 bg-sky-300/[0.04] p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
              Coming Soon
            </div>

            <p className="mt-3 text-sm leading-6 text-white/50">
              The piece is being prepared for a future
              marketplace release.
            </p>
          </div>

          <div className="rounded-2xl border border-lime-300/20 bg-lime-300/[0.04] p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">
              Available
            </div>

            <p className="mt-3 text-sm leading-6 text-white/50">
              The piece is currently available for
              purchase.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.04] p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
              Sold
            </div>

            <p className="mt-3 text-sm leading-6 text-white/50">
              The item has been sold but remains visible
              in the museum.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
              Not for Sale
            </div>

            <p className="mt-3 text-sm leading-6 text-white/50">
              The piece belongs to the archive and has
              no active sales listing.
            </p>
          </div>
        </div>
      </div>
    </FormSection>
  );
}