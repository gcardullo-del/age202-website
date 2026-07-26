# AGE202 — Release Checklist

## Source integrity

- [ ] Work started from the latest user-confirmed project archive.
- [ ] No existing public route was removed.
- [ ] No frozen visual component was replaced.
- [ ] Changed files are listed in the changelog.
- [ ] Database migrations are listed explicitly.

## Security

- [ ] `.env` and `.env.local` are not included in the ZIP.
- [ ] No service-role key or database password appears in source files.
- [ ] Every admin page checks authorization server-side.
- [ ] Every admin server action checks authorization server-side.
- [ ] Public test/debug routes are disabled for production.

## Quality

- [ ] `npm run lint`
- [ ] `npm run typecheck` (once added)
- [ ] `npm run build`
- [ ] Critical routes checked manually.
- [ ] Responsive behavior checked at mobile, tablet and desktop widths.

## Data and deployment

- [ ] Prisma client generated from the delivered schema.
- [ ] Migration status verified.
- [ ] Required environment variable names documented in `.env.example`.
- [ ] Storage permissions and Supabase policies verified.
- [ ] Rollback procedure documented.
