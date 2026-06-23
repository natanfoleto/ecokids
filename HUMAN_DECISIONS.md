# HUMAN_DECISIONS.md

This file documents core architectural decisions made by the development team and permanently enforces them across the repository.

---

## Decision 1: Prisma Database Migration Policy

**Date**: June 2026

**Decision**:
We enforce a strict database migration flow. Schema synchronization commands like `prisma db push` and `prisma db reset` are strictly forbidden for production and local development, as they risk breaking schema history.

**Enforced Rules**:
- NEVER run `prisma db push` or `prisma db reset`.
- Always generate migrations using `pnpm db:migrate` (which runs `prisma migrate dev` internally).
- Verify and commit all files generated under the `prisma/migrations` folder to preserve the database schema history.

---

## Decision 2: Mandatory Final Validation Workflow (Zero Warnings Policy)

**Date**: June 2026

**Decision**:
To maintain high code quality and prevent regressions, all features must be verified programmatically before task completion.

**Enforced Rules**:
- Every task must pass `pnpm lint` and `pnpm build` cleanly.
- ESLint warnings are treated as blocker errors (Zero Warnings Policy).
- If lint issues are found, the developer/agent must automatically run `pnpm lint:fix` (or `eslint --fix`) and recheck until clean.
- The build must compile with 0 warnings and 0 errors.
