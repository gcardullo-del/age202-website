# AGE202 — Sprint 6.0

## Admin inventory deletion

### Added
- Server Action for deleting an artifact from the admin inventory.
- Two-step confirmation button to reduce accidental deletions.
- Success and error notifications through the existing Sonner toaster.

### Data handling
- Artifact deletion relies on the existing Prisma cascade rules for linked images and certificates.
- Stored Supabase images are removed after the database record is deleted.
- Storage cleanup failures are logged without restoring an already deleted database record.

### Cache updates
- Revalidates the admin dashboard, admin inventory, public archive and deleted artifact route.

### Files
- `app/admin/artifacts/actions/deleteArtifact.ts`
- `components/admin/artifacts/DeleteArtifactButton.tsx`
- `app/admin/artifacts/page.tsx`
