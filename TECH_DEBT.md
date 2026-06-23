# TECH_DEBT.md

> Technical debt analysis, duplicated logic, oversized files, performance issues, and bad abstractions.
>
> Organized by severity: 🔴 High | 🟡 Medium | 🟢 Low

---

## Summary

| Category | 🔴 High | 🟡 Medium | 🟢 Low |
|---|---|---|---|
| Code Duplication | 2 | 3 | 1 |
| Architecture | 1 | 2 | 1 |
| Security | 2 | 1 | - |
| Performance | - | 2 | 2 |
| Code Quality | 1 | 3 | 2 |
| Missing Features | 1 | 1 | - |

---

## Code Duplication

### 🔴 TD-01: Frontend apps duplicate entire modules

**Files affected**: All three frontend apps (`manager`, `scorer`, `viewer`)

The following modules are **copy-pasted identically** across apps:

| Module | Files |
|---|---|
| HTTP client | `src/http/api.ts` (identical in all 3 apps) |
| Auth utilities | `src/auth/index.ts` (identical in manager/scorer) |
| `useAction` hook | `src/hooks/use-actions.ts` (identical in all 3 apps) |
| `useMetadata` hook | `src/hooks/use-metadata.ts` (identical in manager/scorer, simplified in viewer) |
| `App.tsx` | Nearly identical entry component in all 3 apps |
| `main.tsx` | Identical in all 3 apps |
| Not Found page | `src/pages/not-found.tsx` (identical in all 3 apps) |
| Layout files | `_layouts/app.tsx`, `auth.tsx`, `global.tsx` (near-identical) |

**Impact**: Bug fixes or improvements must be applied 3 times. Risk of divergence.

**Recommended improvement**: Extract shared frontend code into a `@ecokids/ui` or `@ecokids/shared` package within the monorepo.

---

### 🔴 TD-02: Action files follow identical boilerplate pattern

**Files affected**: Every `actions.ts` / `actions.tsx` file across manager pages

Every action function follows this exact pattern:

```typescript
try {
  await httpFunction({ params, body })
  toast.success('...')
  return { success: true, message: '...' }
} catch (error) {
  if (error instanceof HTTPError) {
    const { message } = await error.response.json()
    toast.error(message)
    return { success: false, message }
  }
  toast.error('Erro inesperado...')
  return { success: false, message: 'Erro inesperado...' }
}
```

This boilerplate is repeated **20+ times** across the codebase.

**Recommended improvement**: Create a generic `createAction()` utility that wraps the try/catch pattern:
```typescript
export function createAction<T>(fn: () => Promise<T>, successMsg: string) { ... }
```

---

### 🟡 TD-03: Award and Item entities are structurally identical

**Files affected**:
- `prisma/schema.prisma` (Award and Item models)
- `routes/awards/*` and `routes/items/*`
- `http/awards/*` and `http/items/*`
- `types/models/awards/*` and `types/models/items/*`

Award and Item have identical fields (`name`, `description`, `value`, `photoUrl`, `schoolId`) and identical CRUD operations. Their route handlers, HTTP client functions, type definitions, and frontend pages are near-identical copies.

**Impact**: Any change to one entity (e.g., adding pagination) must be duplicated in the other.

**Recommended improvement**: Consider whether these can share a base abstraction, or at minimum, ensure any feature added to one is also added to the other.

---

### 🟡 TD-04: List components (student-list, class-list, award-list, item-list, member-list) are structurally similar

**Files affected**:
- `student-list.tsx` (245 lines)
- `award-list.tsx` (approx. 240 lines)
- `item-list.tsx` (approx. 240 lines)
- `class-list.tsx` (approx. 220 lines)
- `member-list.tsx` (approx. 175 lines)

All follow the same pattern: search bar + filter button + Table + Skeleton loading + DropdownMenu (edit/delete) + AlertDialog (confirm delete).

**Recommended improvement**: Extract a generic `DataTable` component that accepts columns configuration and action handlers.

---

### 🟡 TD-05: Skeleton components duplicated inline

**Files affected**: Every list component file

Each list file defines its own `XSkeleton` component (e.g., `StudentSkeleton`, `ClassSkeleton`) inline at the bottom. These are simple `TableRow` + `Skeleton` combinations.

**Recommended improvement**: Create a reusable `TableRowSkeleton` component that accepts column count.

---

### 🟢 TD-06: `Tabs` component has highly repetitive NavLink blocks

**File**: `apps/manager/src/pages/app/school/tabs.tsx` (149 lines)

The `Tabs` component repeats the exact same `isLoading ? Skeleton : NavLink` pattern 7 times, differing only in path, icon, and label.

**Recommended improvement**: Define tabs as a data array and map over them.

---

## Architecture

### 🔴 TD-07: No service layer in the API

**Files affected**: All route handlers in `apps/api/src/http/routes/`

Business logic (validation, authorization, database queries) is embedded directly in route handlers. This makes:
- Unit testing impossible without HTTP infrastructure
- Business logic reuse across routes difficult
- Routes oversized (50-100 lines each)

**Current pattern (existing)**: This is the established architecture. Do not introduce a service layer without explicit approval.

**Note**: This is documented here as technical debt, but it is also the current intentional pattern. Changing this would be an architectural shift.

---

### 🟡 TD-08: `@ecokids/env` uses Next.js dependency in non-Next.js apps

**Files affected**: `packages/env/package.json`, `packages/env/env.server.ts`, `packages/env/env.client.ts`

The `@t3-oss/env-nextjs` package is designed for Next.js but is used here with Vite frontend apps. While it works, it introduces an unnecessary conceptual mismatch and unused Next.js-specific runtime checks.

**Recommended improvement**: Migrate to `@t3-oss/env-core` which is framework-agnostic, or simply use plain Zod validation.

---

### 🟡 TD-09: AuthContext exists but is unused

**Files affected**: `apps/manager/src/contexts/auth/index.tsx`, `apps/manager/src/contexts/auth/types.ts`

The `AuthContext`/`AuthProvider` is defined but never mounted in `App.tsx` or any layout. Authentication is handled entirely via cookies and the `auth/index.ts` utility module. The context has a generic `user: [] | null` type that is clearly a placeholder.

**Recommended improvement**: Remove the unused `contexts/auth/` directory, or integrate it properly if client-side auth state is needed.

---

### 🟢 TD-10: No error boundary implementation

**Files affected**: All frontend apps

React error boundaries are not implemented anywhere. Runtime errors in components will crash the entire app.

**Recommended improvement**: Add error boundaries at the layout level.

---

## Security

### 🔴 TD-11: Secrets exposed in `.env` file tracked in git history

**File**: `.env` (root)

The `.env` file contains real credentials (R2 access keys, JWT secret, database URL). While `.env` is in `.gitignore`, if it was ever committed, secrets are in git history.

**Recommended improvement**: Verify git history for exposed secrets. Rotate R2 keys and JWT secret. Use a secret manager in production.

---

### 🔴 TD-12: JWT secret and cookie secret are hardcoded as "ecokids"

**File**: `.env`

```
JWT_SECRET="ecokids"
COOKIE_SECRET="ecokids"
```

These are weak, predictable secrets used for development. If deployed without changing, they are trivially exploitable.

**Recommended improvement**: Use cryptographically random secrets (256+ bits) in all environments. Add validation in `@ecokids/env` to reject weak secrets.

---

### 🟡 TD-13: CORS origin is hardcoded with local IPs

**File**: `.env`

```
CORS_ORIGIN="http://localhost:5173,http://localhost:5174,http://localhost:5175,http://192.168.4.2:5173"
```

Local IP addresses in CORS configuration. This is development-appropriate but must not reach production.

---

## Performance

### 🟡 TD-14: No pagination on list endpoints

**Files affected**: All `getX` (list) routes — `get-students.ts`, `get-awards.ts`, `get-items.ts`, `get-classes.ts`, etc.

All list endpoints return **all records** without pagination, filtering, or limits. For schools with hundreds of students, this will cause:
- Slow API responses
- Large payloads
- Frontend rendering bottlenecks

**Recommended improvement**: Add cursor-based or offset pagination with `take`/`skip` in Prisma queries. Add search/filter support on the backend.

---

### 🟡 TD-15: Frontend search/filter is not implemented

**Files affected**: All list components (`student-list.tsx`, etc.)

Search inputs and filter buttons exist in the UI but are **non-functional** — they are not wired to any state or API call. The `form` element in search bars has no `onSubmit` handler.

**Recommended improvement**: Implement debounced search with query parameter-based filtering via TanStack Query.

---

### 🟢 TD-16: No code splitting / lazy loading

**Files affected**: All `routes.tsx` files in frontend apps

All page components are eagerly imported at the router level. For larger apps, this increases the initial bundle size.

**Recommended improvement**: Use `React.lazy()` + `Suspense` for route-level code splitting.

---

### 🟢 TD-17: S3 client helper `chunkArray` is a public method

**File**: `apps/api/src/lib/aws.ts`

The `chunkArray` method on `S3ClientWrapper` is a utility but is exposed as a public method on the class.

**Recommended improvement**: Make it `private` or extract to a utility function.

---

## Code Quality

### 🔴 TD-18: `console.log` calls in production code

**Files affected**:
- `apps/api/src/http/error-handler.ts` (line 11: `console.log(error)` for ZodErrors)
- `apps/api/src/http/middlewares/auth.ts` (line 15: `console.log(err)` for JWT errors)
- `apps/api/src/lib/aws.ts` (line 93: `console.log(error)` in deleteFolder)
- `apps/manager/src/pages/auth/sign-in/actions.ts` (line 29: `console.log(message)`)

**Recommended improvement**: Replace with a structured logging library (e.g., `pino`, which Fastify supports natively). Remove frontend `console.log` calls entirely.

---

### 🟡 TD-19: Dashboard page is a placeholder

**File**: `apps/manager/src/pages/app/school/index.tsx`

```tsx
<h1 className="text-xl font-medium">Página em desenvolvimento</h1>
```

The school dashboard page has no content — it's a static placeholder.

**Recommended improvement**: Implement dashboard with student count, points stats, recent activity.

---

### 🟡 TD-20: Inconsistent action file extensions

**Files affected**: Action files across manager pages

Some action files use `.ts` extension, others use `.tsx`:
- `students/actions.ts` ✅
- `classes/actions.ts` ✅
- `awards/actions.tsx` ❌ (no JSX in file)
- `items/actions.tsx` ❌ (no JSX in file)

**Recommended improvement**: Use `.ts` consistently for action files that contain no JSX.

---

### 🟡 TD-21: Mixed import patterns for Fastify types

**Files affected**: All API route files

Some files use `import type { FastifyInstance } from 'fastify'`, others use `import { FastifyInstance } from 'fastify'`, and the error handler imports from `'fastify/types/instance'`.

**Recommended improvement**: Standardize on `import type { FastifyInstance } from 'fastify'` across all route files.

---

### 🟢 TD-22: `save-school.ts` type file in packages/types but unused

**File**: `packages/types/src/models/schools/save-school.ts`

This file exists in the types package but doesn't appear to be used by any route or frontend function. It may be dead code or a planned feature.

**Recommended improvement**: Verify usage. Remove if unused.

---

### 🟢 TD-23: `enums/index.ts` is empty

**File**: `packages/types/src/enums/index.ts`

The enums directory and index file exist but contain no content (empty file).

**Recommended improvement**: Remove the empty directory, or populate if enums were planned.

---

## Missing Features

### 🔴 TD-24: Award redemption flow not implemented

The Viewer app has a `/shop` route and the API has viewer-specific endpoints (`get-school-shop.ts`, `get-school-ranking.ts`), but there is **no redemption endpoint** to actually exchange points for awards. The flow is incomplete.

---

### 🟡 TD-25: No test infrastructure

There are no test files, test configurations, or testing libraries anywhere in the monorepo. The `coverage/` entry in `.gitignore` suggests testing was planned but never implemented.

**Recommended improvement**: Add Vitest for unit testing (aligns with Vite ecosystem). Add API integration tests.
