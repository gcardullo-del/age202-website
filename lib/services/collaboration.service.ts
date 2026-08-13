import {
  CollaborationPartnerType,
  CollaborationProjectType,
  MuseumPageStatus,
} from "@/generated/prisma/client";

import {
  createCollaboration,
  deleteCollaboration,
  getAllCollaborations,
  getCollaborationById,
  getCollaborationBySlug,
  getCollaborationStatistics,
  getPublishedCollaborations,
  publishCollaboration,
  setCollaborationSortOrder,
  unpublishCollaboration,
  updateCollaboration,
  type CollaborationFilters,
  type CreateCollaborationInput,
  type UpdateCollaborationInput,
} from "@/lib/repositories/collaboration.repository";


/* =========================================================
 * TYPES
 * ======================================================= */

export type CollaborationListInput = {
  query?: string;
  partnerType?: CollaborationPartnerType;
  projectType?: CollaborationProjectType;
  status?: MuseumPageStatus;
  featured?: boolean;
  year?: number;
  mediaId?: string | null;
};

export type CollaborationCreateInput =
  CreateCollaborationInput;

export type CollaborationUpdateInput =
  UpdateCollaborationInput;


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
      "Collaboration id is required.",
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
      "Collaboration slug is required.",
    );
  }

  return normalized;
}

function normalizeListInput(
  input: CollaborationListInput = {},
): CollaborationFilters {
  return {
    query:
      normalizeOptionalString(
        input.query,
      ),

    partnerType:
      input.partnerType,

    projectType:
      input.projectType,

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
 * Restituisce tutte le collaborazioni.
 *
 * Pensato principalmente per il CMS Admin.
 */
export async function listCollaborations(
  input: CollaborationListInput = {},
) {
  return getAllCollaborations(
    normalizeListInput(input),
  );
}

/**
 * Restituisce soltanto le collaborazioni pubblicate
 * destinate alla pagina pubblica Collaborations.
 */
export async function listPublishedCollaborations() {
  return getPublishedCollaborations();
}

/**
 * Restituisce una singola collaborazione tramite id.
 */
export async function findCollaborationById(
  id: string,
) {
  return getCollaborationById(
    normalizeRequiredId(id),
  );
}

/**
 * Restituisce una singola collaborazione tramite slug.
 */
export async function findCollaborationBySlug(
  slug: string,
) {
  return getCollaborationBySlug(
    normalizeRequiredSlug(slug),
  );
}


/* =========================================================
 * CREATE
 * ======================================================= */

/**
 * Crea una nuova collaborazione.
 *
 * Le normalizzazioni definitive dei campi
 * vengono effettuate dal repository.
 */
export async function createCollaborationEntry(
  input: CollaborationCreateInput,
) {
  return createCollaboration(
    input,
  );
}


/* =========================================================
 * UPDATE
 * ======================================================= */

/**
 * Aggiorna una collaborazione.
 */
export async function updateCollaborationEntry(
  id: string,
  input: CollaborationUpdateInput,
) {
  return updateCollaboration(
    normalizeRequiredId(id),
    input,
  );
}


/* =========================================================
 * DELETE
 * ======================================================= */

/**
 * Elimina una collaborazione.
 *
 * L'eventuale MediaAsset associato rimane
 * disponibile nella Media Library.
 */
export async function deleteCollaborationEntry(
  id: string,
) {
  return deleteCollaboration(
    normalizeRequiredId(id),
  );
}


/* =========================================================
 * PUBLICATION
 * ======================================================= */

/**
 * Pubblica una collaborazione.
 */
export async function publishCollaborationEntry(
  id: string,
) {
  return publishCollaboration(
    normalizeRequiredId(id),
  );
}

/**
 * Riporta una collaborazione in bozza.
 */
export async function unpublishCollaborationEntry(
  id: string,
) {
  return unpublishCollaboration(
    normalizeRequiredId(id),
  );
}


/* =========================================================
 * SORT ORDER
 * ======================================================= */

/**
 * Aggiorna l'ordine di visualizzazione
 * di una singola collaborazione.
 */
export async function updateCollaborationSortOrder(
  id: string,
  sortOrder: number,
) {
  if (!Number.isFinite(sortOrder)) {
    throw new Error(
      "Collaboration sortOrder must be a valid number.",
    );
  }

  return setCollaborationSortOrder(
    normalizeRequiredId(id),
    sortOrder,
  );
}


/* =========================================================
 * STATISTICS
 * ======================================================= */

/**
 * Restituisce le statistiche utilizzate
 * dalla dashboard Collaborations del CMS.
 */
export async function getCollaborationStats() {
  return getCollaborationStatistics();
}