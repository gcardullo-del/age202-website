# AGE202 — Project Roadmap

## Project objective

AGE202 is a digital tennis museum and curated archive for collectible tennis apparel. The application combines a public archive with a private administration area used to manage artifacts, players, brands, images, publication status, marketplace information and certificates.

## Current technical foundation

- Next.js 16 with App Router and Turbopack
- React 19 and TypeScript
- Prisma 7 with PostgreSQL
- Supabase for database/storage integration
- Tailwind CSS 4
- Server Actions for administrative mutations
- Production build verified successfully after Sprint 1 stabilization

## Current data model

### Player

Stores the player name, slug, country, biography, hero image and portrait image.

### Brand

Stores the brand name, slug, logo and history.

### Artifact

The central museum record. It currently includes:

- archive number, title, subtitle and slug
- description, museum story, historical context and curator note
- year, season, tournament, collection and edition
- category, size, colour, material, condition and rarity
- authenticity flag, authenticity code, vintage flag and tags
- publication status, availability, featured flag and publication date
- price, currency and Vinted URL
- SEO title and SEO description
- required Player and Brand relations
- image gallery
- optional one-to-one Certificate relation

### ArtifactImage

Stores image URL, alternative text, order and cover status.

### Certificate

Stores unique code, issue date, verification status, curator, notes, QR URL and one-to-one Artifact relation.

## Existing administration area

### Dashboard

Route: `/admin`

Already present:

- museum statistics service
- dashboard cards
- links to the main administrative sections
- dynamic server rendering

### Artifacts

Routes:

- `/admin/artifacts`
- `/admin/artifacts/new`
- `/admin/artifacts/[id]`

Already present:

- artifact list
- create form
- edit form
- create and update Server Actions
- artifact repository
- image repository
- storage service
- certificate issuing action and repository

The Artifact form is already divided into:

- General information
- Media
- Story
- Marketplace
- Authenticity
- Publication

### Shared admin components

Already present:

- AdminShell
- AdminSidebar
- AdminHeader
- DataTable
- FormSection
- StatCard / StatsCard

## Frozen Sprint 1 — Stabilization

Status: **completed**

Completed work:

- Prisma schema validation
- Prisma Client generation
- PostgreSQL schema synchronization
- TypeScript corrections in museum statistics
- Suspense boundaries for pages using `useSearchParams`
- successful optimized production build

This sprint is frozen. Changes are permitted only for confirmed regressions.

## Sprint 2 — Complete Artifact administration

Goal: finish the existing Artifact workflow without redesigning it or adding unrelated features.

### Required checks

- verify creation of an artifact from the admin form
- verify editing of every existing field
- verify unique archive number and slug handling
- verify Player and Brand selection
- verify image upload, cover selection, ordering and deletion
- verify marketplace values and decimal price handling
- verify authenticity values and tag persistence
- verify draft, published and archived states
- verify featured and availability values
- verify redirect, cache revalidation and error reporting
- verify artifact deletion only if an existing delete control is intended
- verify certificate action does not break the Artifact workflow

### Definition of done

- create and edit operations work against the real database
- all fields round-trip correctly from form to database and back
- validation messages are understandable
- image operations are stable
- `npm run build` succeeds
- Sprint 2 receives a Git commit and tag

## Sprint 3 — Players administration

Goal: create the missing administrative CRUD for Player using the existing Prisma model.

Scope:

- player list
- create player
- edit player
- delete protection when artifacts are related
- name, slug, country, biography, hero image and portrait image
- build verification

No new Player fields will be introduced during this sprint.

## Sprint 4 — Brands administration

Goal: create the missing administrative CRUD for Brand using the existing Prisma model.

Scope:

- brand list
- create brand
- edit brand
- delete protection when artifacts are related
- name, slug, logo and history
- build verification

No new Brand fields will be introduced during this sprint.

## Sprint 5 — Certificates administration

Goal: complete the existing Certificate foundation.

Scope:

- certificate list
- issue one certificate per artifact
- view certificate details
- update curator, notes and verification status
- stable unique code generation
- optional QR URL persistence using the existing field
- public verification page only after the admin workflow is stable
- build verification

No PDF generation or additional certificate redesign will be added during this sprint.

## Sprint 6 — Dashboard completion

Goal: connect the dashboard only to completed modules.

Scope:

- total artifacts
- drafts, published and archived
- players and brands
- certificates and verified certificates
- authentic and vintage artifacts
- availability and rarity summaries
- recent artifacts

This sprint will reuse the existing museum statistics service rather than replacing the dashboard architecture.

## Sprint 7 — Final review and improvements

Only after all functional modules are complete:

- interface consistency
- responsive behavior
- accessibility
- performance
- SEO
- code cleanup
- duplication removal
- improved loading, empty and error states
- optional new features approved as a separate roadmap

## Working rules

1. One sprint at a time.
2. No unrelated feature additions during a sprint.
3. Preserve the existing public website unless a confirmed bug requires a fix.
4. Deliver complete files, not partial patches.
5. Run the production build before closing every sprint.
6. Commit and tag every stable sprint.
7. Improvements and redesign decisions are deferred to the final review.

## Git checkpoints

Recommended convention:

```bash
git add .
git commit -m "Sprint N - <completed module>"
git tag sprint-N
```

## Immediate next action

Begin Sprint 2 by testing the complete Artifact create/edit workflow against the current database and correcting only defects found in that workflow.
