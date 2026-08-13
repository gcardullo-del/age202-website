import {
  MuseumPageStatus,
  TennisHistoryEntryType,
  TennisHistoryEra,
  TennisHistoryGender,
} from "@/generated/prisma/client";

import {
  createTennisHistoryEntry,
  deleteTennisHistoryEntry,
  getAllTennisHistoryEntries,
  getPublishedTennisHistoryEntries,
  getTennisHistoryEntryById,
  getTennisHistoryEntryBySlug,
  getTennisHistoryStatistics,
  publishTennisHistoryEntry,
  setTennisHistorySortOrder,
  unpublishTennisHistoryEntry,
  updateTennisHistoryEntry,
  type CreateTennisHistoryEntryInput,
  type TennisHistoryFilters,
  type UpdateTennisHistoryEntryInput,
} from "@/lib/repositories/tennis-history.repository";

/* =========================================================
 * TYPES
 * ======================================================= */

export type TennisHistoryListInput = {
  query?: string;
  type?: TennisHistoryEntryType;
  era?: TennisHistoryEra;
  gender?: TennisHistoryGender;
  status?: MuseumPageStatus;
  featured?: boolean;
  year?: number;
  mediaId?: string | null;
};

export type TennisHistoryCreateInput =
  CreateTennisHistoryEntryInput;

export type TennisHistoryUpdateInput =
  UpdateTennisHistoryEntryInput;

/* =========================================================
 * HELPERS
 * ======================================================= */

function normalizeOptionalString(
  value: string | undefined,
): string | undefined {
  const normalized = value?.trim();

  return normalized || undefined;
}

function normalizeRequiredId(
  value: string,
): string {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error(
      "Tennis History entry id is required.",
    );
  }

  return normalized;
}

function normalizeRequiredSlug(
  value: string,
): string {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error(
      "Tennis History entry slug is required.",
    );
  }

  return normalized;
}

function normalizeListInput(
  input: TennisHistoryListInput = {},
): TennisHistoryFilters {
  return {
    query:
      normalizeOptionalString(
        input.query,
      ),

    type:
      input.type,

    era:
      input.era,

    gender:
      input.gender,

    status:
      input.status,

    featured:
      input.featured,

    year:
      input.year,

    mediaId:
      input.mediaId,
  };
}

/* =========================================================
 * READ
 * ======================================================= */

/**
 * Restituisce tutte le entry Tennis History.
 *
 * Pensato principalmente per il CMS Admin.
 */
export async function listTennisHistoryEntries(
  input: TennisHistoryListInput = {},
) {
  return getAllTennisHistoryEntries(
    normalizeListInput(input),
  );
}

/**
 * Restituisce soltanto le entry pubblicate
 * destinate alla pagina pubblica Tennis History.
 */
export async function listPublishedTennisHistoryEntries() {
  return getPublishedTennisHistoryEntries();
}

/**
 * Restituisce una singola entry tramite id.
 */
export async function findTennisHistoryEntryById(
  id: string,
) {
  return getTennisHistoryEntryById(
    normalizeRequiredId(id),
  );
}

/**
 * Restituisce una singola entry tramite slug.
 */
export async function findTennisHistoryEntryBySlug(
  slug: string,
) {
  return getTennisHistoryEntryBySlug(
    normalizeRequiredSlug(slug),
  );
}

/* =========================================================
 * CREATE
 * ======================================================= */

/**
 * Crea una nuova entry Tennis History.
 *
 * Le normalizzazioni definitive dei campi
 * vengono effettuate dal repository.
 */
export async function createTennisHistory(
  input: TennisHistoryCreateInput,
) {
  return createTennisHistoryEntry(
    input,
  );
}

/* =========================================================
 * UPDATE
 * ======================================================= */

/**
 * Aggiorna una entry Tennis History.
 */
export async function updateTennisHistory(
  id: string,
  input: TennisHistoryUpdateInput,
) {
  return updateTennisHistoryEntry(
    normalizeRequiredId(id),
    input,
  );
}

/* =========================================================
 * DELETE
 * ======================================================= */

/**
 * Elimina una entry Tennis History.
 *
 * L'eventuale MediaAsset associato rimane
 * disponibile nella Media Library.
 */
export async function deleteTennisHistory(
  id: string,
) {
  return deleteTennisHistoryEntry(
    normalizeRequiredId(id),
  );
}

/* =========================================================
 * PUBLICATION
 * ======================================================= */

/**
 * Pubblica una entry Tennis History.
 */
export async function publishTennisHistory(
  id: string,
) {
  return publishTennisHistoryEntry(
    normalizeRequiredId(id),
  );
}

/**
 * Riporta una entry Tennis History in bozza.
 */
export async function unpublishTennisHistory(
  id: string,
) {
  return unpublishTennisHistoryEntry(
    normalizeRequiredId(id),
  );
}

/* =========================================================
 * SORT ORDER
 * ======================================================= */

/**
 * Aggiorna l'ordine di visualizzazione
 * di una singola entry.
 */
export async function updateTennisHistorySortOrder(
  id: string,
  sortOrder: number,
) {
  if (!Number.isFinite(sortOrder)) {
    throw new Error(
      "Tennis History sortOrder must be a valid number.",
    );
  }

  return setTennisHistorySortOrder(
    normalizeRequiredId(id),
    sortOrder,
  );
}

/* =========================================================
 * STATISTICS
 * ======================================================= */

/**
 * Restituisce le statistiche utilizzate
 * dalla dashboard Tennis History del CMS.
 */
export async function getTennisHistoryStats() {
  return getTennisHistoryStatistics();
}