"use client";
import Image from "next/image";
import Link from "next/link";

import {
  Check,
  ImageIcon,
  Search,
  Upload,
  X,
} from "lucide-react";

import {
  useMemo,
  useState,
  useTransition,
} from "react";

import type {
  MediaAssetWithFolder,
} from "@/lib/repositories/media.repository";

import {
  uploadNextGenMedia,
} from "@/app/admin/next-gen/actions/uploadNextGenMedia";

type NextGenPlayerFormValues = {
  archiveNumber?: number | null;
  playerKey?: string | null;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  country?: string | null;
  countryCode?: string | null;
  flag?: string | null;
  birthDate?: string | null;
  birthPlace?: string | null;
  plays?: string | null;
  backhand?: string | null;
  story?: string | null;
  highlights?: string[];
  portraitImage?: string | null;
  portraitAlt?: string | null;
  atpProfileUrl?: string | null;
  contributionStatus?:
    | "AWAITING"
    | "RECEIVED"
    | "PUBLISHED";
  contributionTitle?: string | null;
  contributionText?: string | null;
  contributionImage?: string | null;
  contributionDate?: string | null;
  contributionSource?: string | null;
  status?:
    | "DRAFT"
    | "PUBLISHED"
    | "ARCHIVED";
  featured?: boolean;
};

type NextGenPlayerFormProps = {
  mode: "create" | "edit";
  action:
    | ((
        formData: FormData,
      ) => void)
    | ((
        formData: FormData,
      ) => Promise<void>);
  initialValues?: NextGenPlayerFormValues;
  libraryAssets: MediaAssetWithFolder[];
};

type MediaTarget =
  | "portrait"
  | "contribution";

const inputClassName =
  "w-full rounded-xl border border-white/10 bg-[#08111F] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-[#C8FF00]/60 focus:ring-1 focus:ring-[#C8FF00]/20";

const textareaClassName =
  `${inputClassName} min-h-32 resize-y`;

function FieldLabel({
  children,
  required = false,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
      {children}
      {required ? (
        <span className="ml-1 text-[#C8FF00]">
          *
        </span>
      ) : null}
    </span>
  );
}

export default function NextGenPlayerForm({
  mode,
  action,
  initialValues = {},
  libraryAssets,
}: NextGenPlayerFormProps) {
  const isEdit =
    mode === "edit";

  const [
    portraitImage,
    setPortraitImage,
  ] =
    useState(
      initialValues.portraitImage ??
        "",
    );

  const [
    portraitAlt,
    setPortraitAlt,
  ] =
    useState(
      initialValues.portraitAlt ??
        "",
    );

  const [
    contributionImage,
    setContributionImage,
  ] =
    useState(
      initialValues.contributionImage ??
        "",
    );

  const [
    mediaTarget,
    setMediaTarget,
  ] =
    useState<MediaTarget>(
      "portrait",
    );

  const [
    mediaQuery,
    setMediaQuery,
  ] =
    useState("");

  const [
    uploadError,
    setUploadError,
  ] =
    useState<string | null>(
      null,
    );

  const [
    isUploading,
    startUploadTransition,
  ] =
    useTransition();

  const filteredAssets =
    useMemo(() => {
      const query =
        mediaQuery
          .trim()
          .toLowerCase();

      if (!query) {
        return libraryAssets;
      }

      return libraryAssets.filter(
        (asset) =>
          [
            asset.title,
            asset.alt ?? "",
            asset.originalName,
            asset.extension,
            asset.folder?.name ??
              "",
            ...(asset.tags ?? []),
          ]
            .join(" ")
            .toLowerCase()
            .includes(query),
      );
    }, [
      libraryAssets,
      mediaQuery,
    ]);

  const selectedMediaUrl =
    mediaTarget ===
    "portrait"
      ? portraitImage
      : contributionImage;

  function selectMedia(
    url: string,
    alt?: string | null,
  ) {
    if (
      mediaTarget ===
      "portrait"
    ) {
      setPortraitImage(
        url,
      );

      if (
        !portraitAlt &&
        alt
      ) {
        setPortraitAlt(
          alt,
        );
      }

      return;
    }

    setContributionImage(
      url,
    );
  }

  function handleUpload(
    file: File,
  ) {
    setUploadError(
      null,
    );

    startUploadTransition(
      async () => {
        try {
          const formData =
            new FormData();

          formData.set(
            "file",
            file,
          );

          const result =
            await uploadNextGenMedia(
              formData,
            );

          selectMedia(
            result.url,
            result.alt,
          );
        } catch (
          error
        ) {
          setUploadError(
            error instanceof
              Error
              ? error.message
              : "Upload non riuscito.",
          );
        }
      },
    );
  }

  return (
    <form
      action={action}
      className="space-y-6"
    >
      <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C8FF00]">
            Player Identity
          </p>

          <h2 className="mt-2 text-xl font-semibold text-white">
            Archive identity
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Archive Number e Player Key sono gli identificatori permanenti del dossier NEXT GEN.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label>
            <FieldLabel required>
              Archive Number
            </FieldLabel>

            <input
              className={inputClassName}
              defaultValue={
                initialValues.archiveNumber ??
                ""
              }
              min="1"
              name="archiveNumber"
              required
              type="number"
            />
          </label>

          <label>
            <FieldLabel>
              Player Key
            </FieldLabel>

            <input
              className={inputClassName}
              defaultValue={
                initialValues.playerKey ??
                ""
              }
              name="playerKey"
              placeholder="es. moise-kouame"
              readOnly={isEdit}
              type="text"
            />

            <span className="mt-2 block text-xs leading-5 text-slate-500">
              Se vuoto in creazione viene generato dal nome.
              {isEdit
                ? " In modifica resta bloccato per proteggere ranking e URL."
                : ""}
            </span>
          </label>

          <label className="md:col-span-2">
            <FieldLabel required>
              Full Name
            </FieldLabel>

            <input
              className={inputClassName}
              defaultValue={
                initialValues.name ??
                ""
              }
              name="name"
              required
              type="text"
            />
          </label>

          <label>
            <FieldLabel>
              First Name
            </FieldLabel>

            <input
              className={inputClassName}
              defaultValue={
                initialValues.firstName ??
                ""
              }
              name="firstName"
              type="text"
            />
          </label>

          <label>
            <FieldLabel>
              Last Name
            </FieldLabel>

            <input
              className={inputClassName}
              defaultValue={
                initialValues.lastName ??
                ""
              }
              name="lastName"
              type="text"
            />
          </label>

          <label>
            <FieldLabel required>
              Country
            </FieldLabel>

            <input
              className={inputClassName}
              defaultValue={
                initialValues.country ??
                ""
              }
              name="country"
              placeholder="France"
              required
              type="text"
            />
          </label>

          <label>
            <FieldLabel>
              Country Code
            </FieldLabel>

            <input
              className={inputClassName}
              defaultValue={
                initialValues.countryCode ??
                ""
              }
              maxLength={3}
              name="countryCode"
              placeholder="FRA"
              type="text"
            />
          </label>

          <label>
            <FieldLabel>
              Flag
            </FieldLabel>

            <input
              className={inputClassName}
              defaultValue={
                initialValues.flag ??
                ""
              }
              name="flag"
              placeholder="🇫🇷"
              type="text"
            />
          </label>

          <label>
            <FieldLabel>
              Birth Date
            </FieldLabel>

            <input
              className={inputClassName}
              defaultValue={
                initialValues.birthDate ??
                ""
              }
              name="birthDate"
              type="date"
            />
          </label>

          <label>
            <FieldLabel>
              Birth Place
            </FieldLabel>

            <input
              className={inputClassName}
              defaultValue={
                initialValues.birthPlace ??
                ""
              }
              name="birthPlace"
              type="text"
            />
          </label>

          <label>
            <FieldLabel>
              Plays
            </FieldLabel>

            <input
              className={inputClassName}
              defaultValue={
                initialValues.plays ??
                ""
              }
              name="plays"
              placeholder="Right-handed"
              type="text"
            />
          </label>

          <label>
            <FieldLabel>
              Backhand
            </FieldLabel>

            <input
              className={inputClassName}
              defaultValue={
                initialValues.backhand ??
                ""
              }
              name="backhand"
              placeholder="Two-handed"
              type="text"
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C8FF00]">
            AGE202 Dossier
          </p>

          <h2 className="mt-2 text-xl font-semibold text-white">
            Editorial archive
          </h2>
        </div>

        <div className="space-y-5">
          <label>
            <FieldLabel>
              Story
            </FieldLabel>

            <textarea
              className={textareaClassName}
              defaultValue={
                initialValues.story ??
                ""
              }
              name="story"
              placeholder="Editorial introduction for the player dossier..."
              rows={7}
            />
          </label>

          <label>
            <FieldLabel>
              Highlights
            </FieldLabel>

            <textarea
              className={textareaClassName}
              defaultValue={
                initialValues.highlights?.join(
                  "\n",
                ) ?? ""
              }
              name="highlights"
              placeholder={"One highlight per line\nRoland Garros 2026 — Third Round\nThree ITF professional titles"}
              rows={6}
            />

            <span className="mt-2 block text-xs text-slate-500">
              Inserisci un highlight per riga.
            </span>
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C8FF00]">
            ATP Sync
          </p>

          <h2 className="mt-2 text-xl font-semibold text-white">
            Official ATP profile
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Questo URL alimenta il ranking automatico NEXT GEN. Il ranking non viene inserito manualmente nel CMS.
          </p>
        </div>

        <label>
          <FieldLabel required>
            ATP Profile URL
          </FieldLabel>

          <input
            className={inputClassName}
            defaultValue={
              initialValues.atpProfileUrl ??
              ""
            }
            name="atpProfileUrl"
            placeholder="https://www.atptour.com/en/players/..."
            required
            type="url"
          />
        </label>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C8FF00]">
            Museum Media
          </p>

          <h2 className="mt-2 text-xl font-semibold text-white">
            Portrait & Contribution Image
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Seleziona un'immagine dalla Media Library oppure caricane una nuova. L'upload viene salvato anche nella Media Library AGE202.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <MediaSlot
            active={
              mediaTarget ===
              "portrait"
            }
            label="Official Portrait"
            value={
              portraitImage
            }
            onActivate={() =>
              setMediaTarget(
                "portrait",
              )
            }
            onClear={() =>
              setPortraitImage(
                "",
              )
            }
          />

          <MediaSlot
            active={
              mediaTarget ===
              "contribution"
            }
            label="Contribution Image"
            value={
              contributionImage
            }
            onActivate={() =>
              setMediaTarget(
                "contribution",
              )
            }
            onClear={() =>
              setContributionImage(
                "",
              )
            }
          />
        </div>

        <input
          name="portraitImage"
          type="hidden"
          value={
            portraitImage
          }
        />

        <input
          name="contributionImage"
          type="hidden"
          value={
            contributionImage
          }
        />

        <label className="mt-5 block">
          <FieldLabel>
            Portrait Alt
          </FieldLabel>

          <input
            className={inputClassName}
            name="portraitAlt"
            onChange={(event) =>
              setPortraitAlt(
                event.target.value,
              )
            }
            placeholder="Portrait of..."
            type="text"
            value={
              portraitAlt
            }
          />
        </label>

        <div className="mt-6 rounded-2xl border border-white/10 bg-[#08111F] p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C8FF00]">
                Upload new image
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Destinazione attiva:{" "}
                <strong className="text-white">
                  {mediaTarget ===
                  "portrait"
                    ? "Official Portrait"
                    : "Contribution Image"}
                </strong>
              </p>
            </div>

            <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#C8FF00]/30 bg-[#C8FF00]/5 px-5 text-sm font-bold text-[#C8FF00] transition hover:bg-[#C8FF00]/10">
              <Upload
                size={17}
              />

              {isUploading
                ? "Uploading..."
                : "Upload Image"}

              <input
                accept="image/*"
                className="sr-only"
                disabled={
                  isUploading
                }
                type="file"
                onChange={(
                  event,
                ) => {
                  const file =
                    event
                      .target
                      .files?.[0];

                  if (file) {
                    handleUpload(
                      file,
                    );
                  }

                  event.target.value =
                    "";
                }}
              />
            </label>
          </div>

          {uploadError ? (
            <p className="mt-3 text-sm text-red-300">
              {uploadError}
            </p>
          ) : null}
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-[#08111F] p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Media Library
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Clicca un'immagine per assegnarla al campo attivo.
              </p>
            </div>

            <div className="inline-flex rounded-xl border border-white/10 p-1">
              <button
                className={[
                  "rounded-lg px-3 py-2 text-xs font-semibold transition",
                  mediaTarget ===
                  "portrait"
                    ? "bg-[#C8FF00] text-[#050B18]"
                    : "text-slate-400 hover:text-white",
                ].join(" ")}
                onClick={() =>
                  setMediaTarget(
                    "portrait",
                  )
                }
                type="button"
              >
                Portrait
              </button>

              <button
                className={[
                  "rounded-lg px-3 py-2 text-xs font-semibold transition",
                  mediaTarget ===
                  "contribution"
                    ? "bg-[#C8FF00] text-[#050B18]"
                    : "text-slate-400 hover:text-white",
                ].join(" ")}
                onClick={() =>
                  setMediaTarget(
                    "contribution",
                  )
                }
                type="button"
              >
                Contribution
              </button>
            </div>
          </div>

          <label className="relative mt-4 block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

            <input
              className={`${inputClassName} pl-11`}
              onChange={(event) =>
                setMediaQuery(
                  event.target.value,
                )
              }
              placeholder="Search title, filename, folder or tags..."
              type="search"
              value={
                mediaQuery
              }
            />
          </label>

          {filteredAssets.length >
          0 ? (
            <div className="mt-4 grid max-h-[520px] grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3 xl:grid-cols-4">
              {filteredAssets.map(
                (asset) => {
                  const selected =
                    selectedMediaUrl ===
                    asset.url;

                  return (
                    <button
                      className={[
                        "group overflow-hidden rounded-xl border text-left transition",
                        selected
                          ? "border-[#C8FF00]/50 bg-[#C8FF00]/5"
                          : "border-white/10 bg-[#050B18] hover:border-white/20",
                      ].join(" ")}
                      key={
                        asset.id
                      }
                      onClick={() =>
                        selectMedia(
                          asset.url,
                          asset.alt ??
                            asset.title,
                        )
                      }
                      type="button"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          alt={
                            asset.alt ??
                            asset.title
                          }
                          className="object-cover"
                          fill
                          sizes="220px"
                          src={
                            asset.url
                          }
                        />

                        {selected ? (
                          <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-[#C8FF00] text-[#050B18]">
                            <Check
                              size={
                                14
                              }
                            />
                          </span>
                        ) : null}
                      </div>

                      <div className="p-3">
                        <p className="truncate text-xs font-semibold text-white">
                          {
                            asset.title
                          }
                        </p>

                        <p className="mt-1 truncate text-[10px] text-slate-500">
                          {asset.folder
                            ?.name ??
                            "Unfiled"}
                        </p>
                      </div>
                    </button>
                  );
                },
              )}
            </div>
          ) : (
            <div className="mt-4 grid min-h-36 place-items-center rounded-xl border border-dashed border-white/10 text-center">
              <div>
                <ImageIcon className="mx-auto h-7 w-7 text-slate-600" />

                <p className="mt-2 text-sm text-slate-500">
                  Nessuna immagine trovata.
                </p>
              </div>
            </div>
          )}

          <div className="mt-4 text-right">
            <Link
              className="text-xs font-semibold text-slate-400 transition hover:text-[#C8FF00]"
              href="/admin/media"
              target="_blank"
            >
              Open full Media Library →
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C8FF00]">
            Archive Contribution
          </p>

          <h2 className="mt-2 text-xl font-semibold text-white">
            Player contribution
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Gestisci il materiale ricevuto direttamente dal giocatore, dal management o da una fonte autorizzata.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label>
            <FieldLabel required>
              Contribution Status
            </FieldLabel>

            <select
              className={inputClassName}
              defaultValue={
                initialValues.contributionStatus ??
                "AWAITING"
              }
              name="contributionStatus"
              required
            >
              <option value="AWAITING">
                Awaiting
              </option>

              <option value="RECEIVED">
                Received
              </option>

              <option value="PUBLISHED">
                Published
              </option>
            </select>
          </label>

          <label>
            <FieldLabel>
              Contribution Date
            </FieldLabel>

            <input
              className={inputClassName}
              defaultValue={
                initialValues.contributionDate ??
                ""
              }
              name="contributionDate"
              type="date"
            />
          </label>

          <label className="md:col-span-2">
            <FieldLabel>
              Contribution Title
            </FieldLabel>

            <input
              className={inputClassName}
              defaultValue={
                initialValues.contributionTitle ??
                ""
              }
              name="contributionTitle"
              placeholder="Archive Contribution · 001"
              type="text"
            />
          </label>

          <label className="md:col-span-2">
            <FieldLabel>
              Contribution Text
            </FieldLabel>

            <textarea
              className={textareaClassName}
              defaultValue={
                initialValues.contributionText ??
                ""
              }
              name="contributionText"
              placeholder="Message, dedication, archive note or description..."
              rows={7}
            />
          </label>

          <label className="md:col-span-2">
            <FieldLabel>
              Source / Provenance
            </FieldLabel>

            <input
              className={inputClassName}
              defaultValue={
                initialValues.contributionSource ??
                ""
              }
              name="contributionSource"
              placeholder="Provided directly by the player / management..."
              type="text"
            />
          </label>
        </div>

        {contributionImage ? (
          <div className="mt-5 rounded-xl border border-[#C8FF00]/20 bg-[#C8FF00]/[0.03] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C8FF00]">
              Contribution image selected
            </p>

            <p className="mt-2 truncate text-xs text-slate-400">
              {
                contributionImage
              }
            </p>
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C8FF00]">
            Publishing
          </p>

          <h2 className="mt-2 text-xl font-semibold text-white">
            Archive status
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label>
            <FieldLabel required>
              Status
            </FieldLabel>

            <select
              className={inputClassName}
              defaultValue={
                initialValues.status ??
                "DRAFT"
              }
              name="status"
              required
            >
              <option value="DRAFT">
                Draft
              </option>

              <option value="PUBLISHED">
                Published
              </option>

              <option value="ARCHIVED">
                Archived
              </option>
            </select>
          </label>

          <label className="flex items-center gap-3 self-end rounded-xl border border-white/10 bg-[#08111F] px-4 py-3">
            <input
              defaultChecked={
                initialValues.featured ??
                false
              }
              name="featured"
              type="checkbox"
            />

            <span className="text-sm text-slate-200">
              Featured NEXT GEN player
            </span>
          </label>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-end">
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 px-5 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
          href="/admin/next-gen"
        >
          Cancel
        </Link>

        <button
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#C8FF00] px-6 text-sm font-bold text-[#050B18] transition hover:brightness-110"
          type="submit"
        >
          {isEdit
            ? "Save Player"
            : "Create Player"}
        </button>
      </div>
    </form>
  );
}

type MediaSlotProps = {
  label: string;
  value: string;
  active: boolean;
  onActivate: () => void;
  onClear: () => void;
};

function MediaSlot({
  label,
  value,
  active,
  onActivate,
  onClear,
}: MediaSlotProps) {
  return (
    <div
      className={[
        "rounded-2xl border p-4 transition",
        active
          ? "border-[#C8FF00]/35 bg-[#C8FF00]/[0.04]"
          : "border-white/10 bg-[#08111F]",
      ].join(" ")}
    >
      <button
        className="w-full text-left"
        onClick={
          onActivate
        }
        type="button"
      >
        <p className="text-sm font-semibold text-white">
          {label}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {active
            ? "Active destination"
            : "Click to select"}
        </p>
      </button>

      <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-[#050B18]">
        {value ? (
          <>
            <Image
              alt={
                label
              }
              className="object-cover"
              fill
              sizes="480px"
              src={
                value
              }
            />

            <button
              aria-label={`Clear ${label}`}
              className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/70 text-white"
              onClick={
                onClear
              }
              type="button"
            >
              <X
                size={15}
              />
            </button>
          </>
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <ImageIcon className="h-8 w-8 text-slate-700" />
          </div>
        )}
      </div>
    </div>
  );
}