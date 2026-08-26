import {
  WTA_RANKING_LIMIT,
  type WtaLiveRankingEntry,
  type WtaRankingValidationResult,
} from "./wta-ranking-types";


export function validateWtaLiveRanking(
  entries: WtaLiveRankingEntry[],
): WtaRankingValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];


  /*
   * 1.
   * NUMERO RECORD
   *
   * Il dataset deve contenere esattamente
   * WTA_RANKING_LIMIT giocatrici.
   */
  if (
    entries.length !==
    WTA_RANKING_LIMIT
  ) {
    errors.push(
      `Attese ${WTA_RANKING_LIMIT} giocatrici, trovate ${entries.length}.`,
    );
  }


  /*
   * 2.
   * RANK UNICI
   */
  const ranks =
    entries.map(
      (entry) =>
        entry.rank,
    );


  const uniqueRanks =
    new Set(
      ranks,
    );


  if (
    uniqueRanks.size !==
    entries.length
  ) {
    errors.push(
      "Sono presenti rank WTA duplicati.",
    );
  }


  /*
   * 3.
   * SEQUENZA COMPLETA 1 → LIMIT
   */
  for (
    let rank = 1;
    rank <= WTA_RANKING_LIMIT;
    rank += 1
  ) {
    if (
      !uniqueRanks.has(
        rank,
      )
    ) {
      errors.push(
        `Rank WTA ${rank} mancante.`,
      );
    }
  }


  /*
   * 4.
   * PROFILE SLUG UNICI
   *
   * Due giocatrici differenti non devono
   * condividere lo stesso profileSlug.
   */
  const profileSlugs =
    entries
      .map(
        (entry) =>
          entry.profileSlug,
      )
      .filter(
        (
          value,
        ): value is string =>
          Boolean(
            value,
          ),
      );


  if (
    new Set(
      profileSlugs,
    ).size !==
    profileSlugs.length
  ) {
    errors.push(
      "Sono presenti profileSlug WTA duplicati.",
    );
  }


  /*
   * 5.
   * VALIDAZIONE SINGOLI RECORD
   */
  for (
    const entry
    of entries
  ) {
    if (
      !Number.isInteger(
        entry.rank,
      ) ||
      entry.rank < 1
    ) {
      errors.push(
        `Rank ${entry.rank}: posizione WTA non valida.`,
      );
    }


    if (
      !entry.profileSlug
    ) {
      errors.push(
        `Rank ${entry.rank}: profileSlug WTA mancante.`,
      );
    }


    if (
      !entry.name.trim()
    ) {
      errors.push(
        `Rank ${entry.rank}: nome giocatrice mancante.`,
      );
    }


    if (
      !Number.isInteger(
        entry.points,
      ) ||
      entry.points < 0
    ) {
      errors.push(
        `Rank ${entry.rank}: punti WTA non validi.`,
      );
    }


    if (
      entry.points === 0
    ) {
      warnings.push(
        `Rank ${entry.rank}: punti WTA pari a 0.`,
      );
    }


    /*
     * Il countryCode non è bloccante qui.
     *
     * La risoluzione completa della nazione
     * viene effettuata successivamente dal
     * preflight dello script di sync.
     *
     * Questo mantiene la stessa separazione
     * di responsabilità utilizzata dal
     * sistema ATP.
     */
    if (
      !entry.countryCode
    ) {
      warnings.push(
        `Rank ${entry.rank}: countryCode WTA non disponibile dal parser.`,
      );
    }


    /*
     * Anche firstName, lastName e age possono
     * legittimamente essere null.
     *
     * Non inventiamo mai questi dati.
     */
  }


  /*
   * 6.
   * RISULTATO
   */
  return {
    valid:
      errors.length === 0,

    errors,

    warnings,
  };
}