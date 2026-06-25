# AGENT.md

> **This file is the primary entry point and source of truth for all AI-assisted development in this repository.**
> Before making any code change, read and follow this document strictly.
> If future instructions conflict with AGENT.md, AGENT.md takes priority unless explicitly overridden by the user.

---

## 1. Required Documentation Reference

The repository's architecture and design rules are structured in 6 core documentation manuals located inside the `.ai/` directory. You MUST refer to them based on your current task:

1. **`AGENT.md`** (This file): Development lifecycle, lint validations, and final validation checklist.
2. **`ARCHITECTURE.md`**: Monorepo package graphs, layout patterns, data flow sequence, ER diagrams, and storage schemas.
3. **`BUSINESS_RULES.md`**: Plain-text business logic, RBAC permissions matrix, and audit constraints.
4. **`BACKEND_API.md`**: Fastify controllers, Zod request schemas, Prisma queries, auth middleware, file storage, and the audit extension.
5. **`FRONTEND_UI.md`**: shadcn/ui custom inputs, layout outlets, client-side pagination, custom toasts, and visual formatting rules.
6. **`TECH_DEBT.md`**: Catalog of known code quality issues, duplication, and pending improvements.

---

## 2. Project Overview

**Ecokids** is a monorepo-based full-stack application for an eco-friendly recycling rewards system in schools. Students earn points by recycling items and redeem awards. It comprises three Vite/React frontend apps (`manager`, `scorer`, `viewer`) and a Fastify backend REST API.

- **Stack**: Fastify + Prisma + Zod + React 19 + TailwindCSS v4 + shadcn/ui + TanStack Query + Ky
- **Tooling**: Turborepo + pnpm workspaces + tsup

---

## 3. Strict Coding Conventions

### Database Migrations Policy
Preserving database schema history is critical. Direct schema synchronization is strictly forbidden.
- ❌ **Forbidden**: NEVER run `prisma db push`, `prisma db reset`, or manually delete migration files.
- ✅ **Mandatory**: Always generate migrations using `pnpm db:migrate` (internally runs `prisma migrate dev`) and commit all generated files under `prisma/migrations`.

### Prettier & Import Ordering
- Prettier is configured centrally in `config/prettier/index.mjs` (semicolons: false, singleQuotes: true, trailingComma: es5).
- Imports are auto-sorted via `eslint-plugin-simple-import-sort`:
  1. React and third-party packages.
  2. Workspace packages (`@ecokids/ui`, `@ecokids/types`, etc.).
  3. App path aliases (`@/...`).
  4. Relative files (`./...`).

### Export Conventions
- Use **named exports** for all components, hooks, utilities, routes, and actions.
- Use **default export** only for the root `App` component (`export default App`).
- Package entry points must use barrel re-exports (`export * from './...'`).

---

## 4. UI Consistency & Typography Rules

To preserve visual layout cohesion:
1. **Button Icon Spacing**: **NEVER** use manual spacing utility classes (`mr-*` or `ml-*`) on icons inside buttons. All spacing must be handled natively by the Button's own layout/styles.
2. **No Italic Typography**: Italic text is NOT part of the design system. Do not use the `italic` Tailwind class, `font-style: italic` styling, or `<em>` HTML tags anywhere in the codebase. All texts must be standard or predefined bold weights.

---

## 5. Mandatory Final Validation Workflow

Before declaring any implementation task as completed, you must run validation **only on the app/package(s) that were modified**.

### Scoped Lint Rules (MANDATORY)
The root `pnpm lint` and `turbo lint` take 3+ minutes and must **never** be used for verifying a single app change. Use only the scoped scripts:

```bash
pnpm lint:viewer   # eslint apps/viewer/src/
pnpm lint:api      # eslint apps/api/src/
pnpm lint:manager  # eslint apps/manager/src/
pnpm lint:scorer   # eslint apps/scorer/src/
```

- **Zero Warnings Policy**: ESLint warnings are treated as compilation blocker errors. Every change must compile with zero errors and zero warnings.
- **One Attempt Only**: Do not poll command status repeatedly or run lint/build commands in infinite loops. If the first validation attempt stalls or fails, stop and report the failure details immediately.

---

## 6. Before Every Commit Checklist

- [ ] All database changes implemented via migrations and history files preserved.
- [ ] Direct schema synchronization (`db push` / `db reset`) completely avoided.
- [ ] Button check: No manual margin utility classes (`mr-*`, `ml-*`) on icons inside buttons.
- [ ] Typography check: No italic text styling (`italic`, `font-style: italic`, `<em>` tag) anywhere.
- [ ] Lint check: Scoped lint command executed and passes with zero warnings or errors.
- [ ] Build check: Modifying app compiles cleanly without any TypeScript or Vite build errors.
- [ ] No unused imports, variables, console logs, or dead code remains.
- [ ] Zod schemas placed in `@ecokids/types`, CASL rules in `@ecokids/auth`, and UI components in `@ecokids/ui`.
- [ ] Import ordering follows simple-import-sort.
