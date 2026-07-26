# AGE202 — Sprint 6.1

## Safe artifact deletion

### Added
- Server Action for deleting an artifact from the admin inventory.
- Two-step confirmation control to reduce accidental deletions.
- Success, warning and error feedback through the existing Sonner toaster.
- Revalidation of the admin dashboard, inventory and public archive routes.

### Data and storage behavior
- Prisma cascade rules remove linked `ArtifactImage` and `Certificate` records.
- Supabase image files are removed after the database deletion.
- A storage cleanup failure does not falsely report the database deletion as failed; the admin receives a warning instead.

### Files
- `app/admin/artifacts/actions/deleteArtifact.ts`
- `app/admin/artifacts/page.tsx`
- `components/admin/artifacts/DeleteArtifactButton.tsx`
- `lib/services/artifactStorage.service.ts`
- `SPRINT_6.1_CHANGELOG.md`
