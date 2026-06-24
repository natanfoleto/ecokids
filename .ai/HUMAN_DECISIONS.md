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
To maintain high code quality and prevent regressions, all features must be verified programmatically. However, to avoid system blockage and infinite loops, we enforce strict bounds on execution checks.

**Enforced Rules**:
- The validation workflow is: Run lint once, run lint fix once if needed, re-run lint once again, and run build once.
- NEVER wait indefinitely for command completion.
- NEVER create scheduled timers to poll or repeatedly check commands.
- NEVER retry commands automatically in loops or enter infinite waiting loops.
- If any command hangs, stalls, does not return output, or execution is blocked: Stop execution immediately, report the failure/limitation, and do not retry automatically.
- ESLint warnings are treated as blocker errors (Zero Warnings Policy) unless the environment is blocked/limited.
- If validation cannot complete due to system limitations, report the limitation instead of retrying.

---

## Decision 3: Permanent UI Consistency Rules

**Date**: June 2026

**Decision**:
To maintain professional UI design standards and avoid custom formatting styling that compromises typography cohesion, we enforce strict visual layout rules.

**Enforced Rules**:
- **Button Icon Spacing**: NEVER use manual spacing utility classes (`mr-*` or `ml-*`) on icons inside buttons. All spacing must be handled natively by the Button's own layout/styles.
- **No Italic Typography**: Italic text is NOT part of the design system. Do not use the `italic` Tailwind class, `font-style: italic` styling, or `<em>` HTML tags anywhere in the codebase. All texts must be standard/normal styles or predefined weights (medium, semibold, bold).
