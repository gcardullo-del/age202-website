# AGE202 — Sprint 5.4 Admin Audit & Enhancement

## Obiettivo

Migliorare l'inventario admin esistente senza sostituire pagine, rotte o flussi già approvati.

## Modifiche

- Ricerca server-side per titolo, numero archivio, giocatore, brand, torneo e collezione.
- Filtri per stato, disponibilità, giocatore, brand e rarità.
- Pulsante per azzerare tutti i filtri.
- Conteggio risultati filtrati rispetto al totale del catalogo.
- Stato vuoto dedicato quando nessun reperto corrisponde ai filtri.
- KPI principali calcolati sull'intero archivio e non limitati ai risultati filtrati.
- Immagine di copertina aggiornata a `next/image` senza cambiare il layout.

## Preservato

- Dashboard admin.
- CRUD reperti.
- Form di creazione e modifica.
- Gestione immagini.
- Certificati.
- Rotte pubbliche e navigazione.
- Design e struttura visiva dell'inventario.

## Verifiche

- `npm run lint`: completato, 0 errori e 0 warning.
- `npm run build`: non completabile nell'ambiente di consegna perché Next.js riceve errore 503 durante il download del binario SWC Linux. Nessun errore TypeScript del progetto è stato rilevato prima di questo blocco infrastrutturale.
