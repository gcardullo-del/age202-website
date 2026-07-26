# AGE202 — Architecture Audit

## Executive summary

AGE202 already contains a substantial public museum experience and a functional administration area. The next phase should not rebuild either one. The highest-value work is hardening security, reducing architectural duplication and establishing reliable release checks.

No visual redesign is recommended by this audit.

## What is already well structured

### Domain model

The Prisma model is coherent for the current product:

- `Player` and `Brand` are normalized entities.
- `Artifact` contains museum, commerce, publication and SEO fields.
- `ArtifactImage` supports ordering and cover selection.
- `Certificate` has a one-to-one relationship with an artifact.
- Foreign-key deletion policies are deliberate: player/brand deletion is restricted, while images and certificates cascade with an artifact.
- Useful indexes exist for archive filtering and publication queries.

### Service and repository direction

The project already has a good foundation in:

- `lib/repositories/`
- `lib/services/`
- `lib/archive/`
- `lib/museum/`

This is the right direction and should become the only data-access path for pages and actions.

### Public/admin separation

`SiteChrome` detects admin routes and removes the public navbar/footer, while `AdminShell` supplies the admin navigation. This preserves a distinct admin experience without creating a second root layout.

## Critical findings

### A-01 — Admin area has no access protection

**Severity:** Critical

No `proxy.ts`, `middleware.ts`, route guard, session check or authorization helper was found protecting `/admin`.

The admin pages query the database directly and the server actions can create/update records. Hiding links is not security; every admin page and mutation must verify an authenticated, authorized administrator on the server.

**Recommended solution:**

- implement Supabase Auth server-side;
- add a Next.js 16 `proxy.ts` only for coarse route redirection;
- add a reusable `requireAdmin()` server function;
- call `requireAdmin()` inside every admin page and every mutation action;
- never rely only on the proxy because server actions can be invoked independently.

### A-02 — Environment files were included in the uploaded project

**Severity:** Critical

The archive contains `.env` and `.env.local`. Their values are intentionally not reproduced in this report.

**Required action:**

- remove environment files from all deliverable ZIPs;
- verify `.gitignore` covers them;
- rotate any credentials that have been shared outside the trusted local environment;
- provide `.env.example` containing variable names only.

### A-03 — Data access is inconsistent

**Severity:** High

Some code uses repositories/services, while `app/admin/artifacts/page.tsx` queries `prisma.artifact` directly. This creates two sources of truth for relation includes, ordering, filtering and future authorization rules.

**Recommended solution:**

Create repository methods specifically for admin inventory and dashboard needs, with narrow `select` clauses. Pages should call services/repositories instead of Prisma directly.

### A-04 — Duplicate and legacy component structures exist

**Severity:** Medium

The project contains:

- `components/design-system/`
- `components/museum-ui/`
- `components/ui/`
- a separate `src/components/` tree

Duplicate file names include `Hero`, `Navbar`, `MuseumButton`, `MuseumStatistics`, `SectionHeader`, `Timeline`, `LatestArrivals` and `ArtifactPassport`.

This does not prove every pair is redundant, but it raises the risk of editing the wrong component and creating inconsistent pages.

**Recommended solution:**

- identify the imported/active version of each duplicate;
- mark unused files as legacy;
- delete legacy files only in a dedicated cleanup release after route-level visual checks;
- maintain one canonical UI layer.

### A-05 — Public test route is present

**Severity:** Medium

`app/test/page.tsx` creates a public `/test` route. It should be removed, moved behind admin authentication or disabled outside development before beta.

### A-06 — Release validation is incomplete

**Severity:** Medium

`package.json` defines only `dev`, `build`, `start` and `lint`. No automated test, typecheck-only, smoke-test or migration-check command is present.

**Recommended minimum scripts:**

- `typecheck`: `tsc --noEmit`
- `check`: lint + typecheck + build
- database migration status check in deployment CI
- a small route smoke test for critical public/admin routes

## Additional findings

### SEO

Global metadata is comprehensive, but the root canonical is `/`. Dynamic routes should generate their own canonical URLs and metadata. No `app/sitemap.ts` or `app/robots.ts` was found in the audited source.

### Next.js configuration

`next.config.ts` is effectively empty. This is not inherently wrong, but remote image hosts, security headers and deployment-specific behavior should be explicitly reviewed before launch.

### Client component footprint

The project contains many client components. Some are necessary for Framer Motion and interactive UI, but future performance work should keep database fetching and static presentation in server components whenever possible.

### Admin inventory scalability

The admin inventory currently fetches the complete archive and calculates counts in memory. This is acceptable for a small catalog, but should move to database counts, pagination and query-string filters before the archive becomes large.

### Generated and debug artifacts

The shared project contains generated Prisma code and a large debugging HTML export. Generated Prisma output may be intentional because of the configured generator path, but debug exports should not be part of production delivery archives.

## Recommended next release

### Sprint 5.5 — Admin Security Foundation

Scope only:

1. Add authenticated admin access.
2. Add `requireAdmin()` to every admin page and mutation.
3. Add a login route and safe redirect behavior.
4. Add `.env.example`; exclude real environment files from delivery.
5. Preserve every existing public page and all admin layouts.
6. Do not alter the Prisma schema unless an admin-role model is explicitly chosen.

### Acceptance criteria

- unauthenticated requests cannot render `/admin` pages;
- unauthenticated callers cannot invoke create/update/certificate actions;
- authenticated non-admin users are rejected;
- public routes remain unchanged;
- no secrets exist in the delivered ZIP;
- lint, typecheck and build succeed on the exact delivered files.

## Files that should not be redesigned in the next release

- `components/layout/SiteChrome.tsx`
- existing public navigation components
- Hall of Fame visual components
- product-page visual sections
- certificate visual components
- `components/admin/AdminShell.tsx`
- admin sidebar/header visual styling

Security can be added around these components without replacing them.
