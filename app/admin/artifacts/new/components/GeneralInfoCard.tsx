"use client";

import type {
  ArtifactCategory,
  ArtifactCondition,
  ArtifactRarity,
  Brand,
  Player,
  Tournament,
} from "@/generated/prisma/client";

import {
  useArtifactStudio,
} from "./ArtifactStudioContext";

export type GeneralInfoInitialValues = {
  title?: string | null;
  subtitle?: string | null;
  archiveNumber?: string | null;

  year?: number | null;
  season?: string | null;
  tournament?: string | null;
  collection?: string | null;
  edition?: string | null;

  playerId?: string | null;
  brandId?: string | null;

  category?: ArtifactCategory | null;
  rarity?: ArtifactRarity | null;

  size?: string | null;
  condition?: ArtifactCondition | null;
  colour?: string | null;
  material?: string | null;
};

type Props = {
  players: Player[];
  brands: Brand[];
  tournaments: Tournament[];
  initialValues?: GeneralInfoInitialValues;
};

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-[#0A1222] px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-lime-300/40";

const labelClass =
  "mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-white/45";

const helperClass =
  "mt-2 text-sm leading-6 text-white/30";

export default function GeneralInfoCard({
  players,
  brands,
  tournaments,
  initialValues,
}: Props) {
  const {
    updatePreview,
  } = useArtifactStudio();

  function updatePlayerPreview(
    playerId: string,
  ) {
    const player =
      players.find(
        (item) =>
          item.id === playerId,
      );

    updatePreview({
      playerName:
        player?.name ?? null,
    });
  }

  function updateBrandPreview(
    brandId: string,
  ) {
    const brand =
      brands.find(
        (item) =>
          item.id === brandId,
      );

    updatePreview({
      brandName:
        brand?.name ?? null,
    });
  }

  function updateTournamentPreview(
    tournamentId: string,
  ) {
    const tournament =
      tournaments.find(
        (item) =>
          item.id === tournamentId,
      );

    updatePreview({
      tournament:
        tournament?.name ?? null,
    });
  }

  const initialTournament =
    tournaments.find(
      (tournament) =>
        tournament.name ===
          initialValues?.tournament ||
        tournament.shortName ===
          initialValues?.tournament,
    ) ?? null;

  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
      <div className="border-b border-white/10 px-8 py-6">
        <h2 className="text-xl font-semibold text-white">
          General Information
        </h2>

        <p className="mt-2 text-sm text-white/40">
          Basic identification, historical classification and physical details
          for this museum artifact.
        </p>
      </div>

      <div className="grid gap-6 p-8 md:grid-cols-2">
        <div className="md:col-span-2">
          <label
            htmlFor="artifact-title"
            className={labelClass}
          >
            Title
          </label>

          <input
            id="artifact-title"
            name="title"
            required
            className={inputClass}
            placeholder="Nike Federer Wimbledon Polo 2017"
            defaultValue={
              initialValues?.title ?? ""
            }
            onChange={(event) =>
              updatePreview({
                title:
                  event.target.value,
              })
            }
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="artifact-subtitle"
            className={labelClass}
          >
            Subtitle
          </label>

          <input
            id="artifact-subtitle"
            name="subtitle"
            className={inputClass}
            placeholder="The championship look from Federer's eighth Wimbledon title"
            defaultValue={
              initialValues?.subtitle ?? ""
            }
            onChange={(event) =>
              updatePreview({
                subtitle:
                  event.target.value ||
                  null,
              })
            }
          />

          <p className={helperClass}>
            A short editorial line displayed beneath the main artifact title.
          </p>
        </div>

        <div>
          <label
            htmlFor="artifact-archive-number"
            className={labelClass}
          >
            Archive Number
          </label>

          <input
            id="artifact-archive-number"
            name="archiveNumber"
            className={inputClass}
            placeholder="AGE202-0001"
            defaultValue={
              initialValues?.archiveNumber ??
              ""
            }
            onChange={(event) =>
              updatePreview({
                archiveNumber:
                  event.target.value ||
                  null,
              })
            }
          />
        </div>

        <div>
          <label
            htmlFor="artifact-year"
            className={labelClass}
          >
            Year
          </label>

          <input
            id="artifact-year"
            name="year"
            type="number"
            min="1800"
            max="2100"
            className={inputClass}
            placeholder="2017"
            defaultValue={
              initialValues?.year != null
                ? String(
                    initialValues.year,
                  )
                : ""
            }
            onChange={(event) => {
              const value =
                event.target.value.trim();

              updatePreview({
                year: value
                  ? Number(value)
                  : null,
              });
            }}
          />
        </div>

        <div>
          <label
            htmlFor="artifact-player"
            className={labelClass}
          >
            Player
          </label>

          <select
            id="artifact-player"
            name="playerId"
            required
            className={inputClass}
            defaultValue={
              initialValues?.playerId ??
              ""
            }
            onChange={(event) =>
              updatePlayerPreview(
                event.target.value,
              )
            }
          >
            <option
              value=""
              disabled
            >
              Select player...
            </option>

            {players.map((player) => (
              <option
                key={player.id}
                value={player.id}
              >
                {player.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="artifact-brand"
            className={labelClass}
          >
            Brand
          </label>

          <select
            id="artifact-brand"
            name="brandId"
            required
            className={inputClass}
            defaultValue={
              initialValues?.brandId ??
              ""
            }
            onChange={(event) =>
              updateBrandPreview(
                event.target.value,
              )
            }
          >
            <option
              value=""
              disabled
            >
              Select brand...
            </option>

            {brands.map((brand) => (
              <option
                key={brand.id}
                value={brand.id}
              >
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="artifact-season"
            className={labelClass}
          >
            Season
          </label>

          <input
            id="artifact-season"
            name="season"
            className={inputClass}
            placeholder="Spring/Summer 2017"
            defaultValue={
              initialValues?.season ??
              ""
            }
          />
        </div>

        <div>
          <label
            htmlFor="artifact-tournament-id"
            className={labelClass}
          >
            Tournament
          </label>

          <select
            id="artifact-tournament-id"
            name="tournamentId"
            className={inputClass}
            defaultValue={
              initialTournament?.id ??
              ""
            }
            onChange={(event) =>
              updateTournamentPreview(
                event.target.value,
              )
            }
          >
            <option value="">
              No tournament
            </option>

            {tournaments.map(
              (tournament) => (
                <option
                  key={tournament.id}
                  value={tournament.id}
                >
                  {tournament.name}
                  {tournament.shortName &&
                  tournament.shortName !==
                    tournament.name
                    ? ` (${tournament.shortName})`
                    : ""}
                </option>
              ),
            )}
          </select>

          <input
            type="hidden"
            name="tournament"
            value={
              initialTournament?.name ??
              initialValues?.tournament ??
              ""
            }
            readOnly
          />

          <p className={helperClass}>
            Select a tournament from the AGE202 Tournament Archive. The relation
            will be stored using its unique database record.
          </p>
        </div>

        <div>
          <label
            htmlFor="artifact-collection"
            className={labelClass}
          >
            Collection
          </label>

          <input
            id="artifact-collection"
            name="collection"
            className={inputClass}
            placeholder="NikeCourt Roger Federer Collection"
            defaultValue={
              initialValues?.collection ??
              ""
            }
            onChange={(event) =>
              updatePreview({
                collection:
                  event.target.value ||
                  null,
              })
            }
          />
        </div>

        <div>
          <label
            htmlFor="artifact-edition"
            className={labelClass}
          >
            Edition
          </label>

          <input
            id="artifact-edition"
            name="edition"
            className={inputClass}
            placeholder="Championship Edition"
            defaultValue={
              initialValues?.edition ??
              ""
            }
          />
        </div>

        <div>
          <label
            htmlFor="artifact-category"
            className={labelClass}
          >
            Category
          </label>

          <select
            id="artifact-category"
            name="category"
            className={inputClass}
            defaultValue={
              initialValues?.category ??
              ""
            }
            onChange={(event) =>
              updatePreview({
                category:
                  event.target.value ||
                  null,
              })
            }
          >
            <option value="">
              Select category...
            </option>

            <option value="SHIRT">
              Shirt
            </option>

            <option value="POLO">
              Polo
            </option>

            <option value="JACKET">
              Jacket
            </option>

            <option value="SHORTS">
              Shorts
            </option>

            <option value="SHOES">
              Shoes
            </option>

            <option value="CAP">
              Cap
            </option>

            <option value="ACCESSORY">
              Accessory
            </option>
          </select>
        </div>

        <div>
          <label
            htmlFor="artifact-rarity"
            className={labelClass}
          >
            Rarity
          </label>

          <select
            id="artifact-rarity"
            name="rarity"
            className={inputClass}
            defaultValue={
              initialValues?.rarity ??
              "COMMON"
            }
            onChange={(event) =>
              updatePreview({
                rarity:
                  event.target.value ||
                  null,
              })
            }
          >
            <option value="COMMON">
              Common
            </option>

            <option value="RARE">
              Rare
            </option>

            <option value="VERY_RARE">
              Very Rare
            </option>

            <option value="LEGENDARY">
              Legendary
            </option>
          </select>
        </div>

        <div>
          <label
            htmlFor="artifact-size"
            className={labelClass}
          >
            Size
          </label>

          <select
            id="artifact-size"
            name="size"
            className={inputClass}
            defaultValue={
              initialValues?.size ??
              ""
            }
          >
            <option value="">
              Unknown
            </option>

            <option value="XS">
              XS
            </option>

            <option value="S">
              S
            </option>

            <option value="M">
              M
            </option>

            <option value="L">
              L
            </option>

            <option value="XL">
              XL
            </option>

            <option value="XXL">
              XXL
            </option>
          </select>
        </div>

        <div>
          <label
            htmlFor="artifact-condition"
            className={labelClass}
          >
            Condition
          </label>

          <select
            id="artifact-condition"
            name="condition"
            className={inputClass}
            defaultValue={
              initialValues?.condition ??
              "EXCELLENT"
            }
            onChange={(event) =>
              updatePreview({
                condition:
                  event.target.value ||
                  null,
              })
            }
          >
            <option value="MINT">
              Mint
            </option>

            <option value="EXCELLENT">
              Excellent
            </option>

            <option value="VERY_GOOD">
              Very Good
            </option>

            <option value="GOOD">
              Good
            </option>

            <option value="FAIR">
              Fair
            </option>
          </select>
        </div>

        <div>
          <label
            htmlFor="artifact-colour"
            className={labelClass}
          >
            Colour
          </label>

          <input
            id="artifact-colour"
            name="colour"
            className={inputClass}
            placeholder="White, gold and black"
            defaultValue={
              initialValues?.colour ??
              ""
            }
          />
        </div>

        <div>
          <label
            htmlFor="artifact-material"
            className={labelClass}
          >
            Material
          </label>

          <input
            id="artifact-material"
            name="material"
            className={inputClass}
            placeholder="100% polyester"
            defaultValue={
              initialValues?.material ??
              ""
            }
          />
        </div>
      </div>
    </section>
  );
}