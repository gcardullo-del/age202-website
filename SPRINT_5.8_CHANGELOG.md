# AGE202 — Sprint 5.8

## Artifact form validation cleanup

### Modified files
- `app/admin/artifacts/actions/createArtifact.ts`
- `app/admin/artifacts/actions/updateArtifact.ts`
- `app/admin/artifacts/actions/utils/artifactForm.utils.ts`

### Changes
- Centralized artifact availability parsing and validation.
- Centralized tag normalization and duplicate removal.
- Removed duplicated helper logic from create and update Server Actions.
- Invalid availability values now produce a clear server-side validation error instead of silently falling back.

### Verification
- Static source inspection completed.
- `npm run lint` could not run because dependencies (`node_modules`) are not included in the uploaded project archive.
