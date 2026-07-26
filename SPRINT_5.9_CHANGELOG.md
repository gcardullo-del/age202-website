# AGE202 — Sprint 5.9

## Safe artifact deletion

### Modified files
- `app/admin/artifacts/page.tsx`
- `app/admin/artifacts/actions/deleteArtifact.ts`
- `components/admin/artifacts/DeleteArtifactButton.tsx`

### Changes
- Added artifact deletion directly from the admin inventory.
- Added a two-step confirmation flow to prevent accidental deletion.
- Deletion removes the artifact and its database-related images/certificate through Prisma cascade rules.
- Stored artifact images are cleaned up after the database deletion.
- Admin dashboard, inventory and public archive routes are revalidated automatically.
- Added success and error feedback through the existing Sonner toast system.

### Packaging
- `.env` and `.env.local` are excluded from the delivery archive.
- `node_modules`, `.next`, `.git` and build cache files are excluded.
