# AGENT.md

> **This file is the permanent source of truth for all development in this repository.**
> Before making any code change, read and follow this document strictly.
> If future instructions conflict with AGENT.md, AGENT.md takes priority unless explicitly overridden by the user.

---

## Project Overview

**Ecokids** is a monorepo-based full-stack application for an eco-friendly recycling rewards system in schools. Students earn points by recycling items, and can redeem awards. The system has three frontend apps (manager, scorer, viewer) and one backend API.

- **Architecture**: Turborepo monorepo with pnpm workspaces
- **Backend**: Fastify + Prisma + Zod + JWT (Node.js)
- **Frontend**: React 19 + Vite + TailwindCSS v4 + shadcn/ui (New York style) + TanStack Query + React Hook Form + Ky
- **Database**: PostgreSQL (via Docker)
- **Storage**: Cloudflare R2 (S3-compatible)
- **Authorization**: CASL (role-based: ADMIN / MEMBER)
- **Language**: TypeScript throughout (strict mode)
- **Package Manager**: pnpm 8.9.0
- **Node Version**: 20.18.0

---

## Project Structure

```
ecokids/
├── apps/
│   ├── api/              # Fastify backend API
│   │   ├── @types/       # Module augmentations (Fastify, env)
│   │   ├── prisma/       # Schema, migrations, seed
│   │   └── src/
│   │       ├── http/
│   │       │   ├── middlewares/   # Fastify plugins (auth)
│   │       │   ├── routes/       # Route handlers grouped by domain
│   │       │   │   ├── _errors/  # Custom error classes
│   │       │   │   ├── auth/
│   │       │   │   ├── schools/
│   │       │   │   ├── students/
│   │       │   │   ├── classes/
│   │       │   │   ├── members/
│   │       │   │   ├── invites/
│   │       │   │   ├── points/
│   │       │   │   ├── awards/
│   │       │   │   ├── items/
│   │       │   │   ├── viewers/
│   │       │   │   └── index.ts  # Route registration barrel
│   │       │   ├── error-handler.ts
│   │       │   └── server.ts     # App bootstrap
│   │       ├── lib/              # Singletons (prisma, aws)
│   │       └── utils/            # Pure utility functions
│   ├── manager/          # Admin/teacher dashboard (Vite + React)
│   ├── scorer/           # Scoring kiosk app (Vite + React)
│   └── viewer/           # Student-facing app (Vite + React)
├── packages/
│   ├── auth/             # CASL authorization (roles, permissions, subjects)
│   ├── env/              # Zod-validated environment variables (T3 Env)
│   └── types/            # Shared Zod schemas & TypeScript types
├── config/
│   ├── eslint-config/    # Shared ESLint configs (node, react, library)
│   ├── prettier/         # Shared Prettier config
│   └── typescript-config/ # Shared tsconfig bases (node, library)
├── docker-compose.yml    # PostgreSQL container
├── turbo.json            # Turborepo task config
├── pnpm-workspace.yaml   # Workspace definitions
└── .env / .example.env   # Root environment variables
```

### Frontend App Internal Structure (manager/scorer/viewer)

All three frontend apps follow the **same folder convention**:

```
src/
├── App.tsx               # Root component (providers)
├── main.tsx              # Entry point (StrictMode + createRoot)
├── routes.tsx            # Router definition (createBrowserRouter)
├── index.css             # Global CSS + TailwindCSS v4 theme tokens
├── vite-env.d.ts         # Vite type reference
├── auth/                 # Auth utilities (isAuthenticated, ability, signOut, getCurrentSchool)
├── components/
│   ├── ui/               # shadcn/ui primitives (DO NOT manually edit)
│   └── form/             # Reusable form components (FormInput, FormError, FormSelect)
├── contexts/             # React Context providers
│   └── auth/             # Auth context (createContext pattern with types.ts)
├── hooks/                # Custom hooks (use-actions, use-metadata, use-permissions, use-school, use-user-profile)
├── http/                 # API request functions grouped by domain
│   ├── api.ts            # Ky client instance (base config, interceptors)
│   └── [domain]/         # One folder per domain (auth/, schools/, students/, etc.)
├── lib/                  # Library wrappers (react-query, utils, compressorjs)
├── pages/
│   ├── _layouts/         # Layout wrappers (app.tsx, auth.tsx, global.tsx)
│   ├── app/              # Authenticated pages
│   │   └── [feature]/    # Feature pages with index.tsx + actions.ts
│   ├── auth/             # Authentication pages (sign-in/, sign-up/)
│   ├── middleware.tsx     # Route middleware (cookie management)
│   └── not-found.tsx     # 404 redirect
├── utils/                # Pure utility functions (formatCPF, getInitialsName)
└── assets/               # Static assets (SVG logos, images)
```

### Folder Organization Rules

1. **Domain-driven grouping** — Both API routes and frontend HTTP modules are grouped by business domain (schools, students, classes, etc.)
2. **Co-located actions** — Page action functions live alongside the page in an `actions.ts` file
3. **Barrel exports** — Each route domain folder and package has an `index.ts` barrel file
4. **Layouts prefixed with underscore** — `_layouts/` folder for layout components
5. **Dialogs/Sheets prefixed with @** — `@dialog/`, `@sheet/` folders for modal components in the manager app
6. **UI primitives isolated** — shadcn/ui components in `components/ui/`, custom form wrappers in `components/form/`

---

## Coding Standards

### Formatting (Prettier)

| Rule | Value |
|---|---|
| Print Width | 80 |
| Tab Width | 2 |
| Use Tabs | No |
| Semicolons | No |
| Quote Style | Single quotes |
| JSX Quote Style | Double quotes |
| Trailing Comma | ES5 |
| Bracket Spacing | Yes |
| Arrow Parens | Always |
| End of Line | Auto |
| Bracket Same Line | No |

- **Plugin**: `prettier-plugin-tailwindcss` (auto-sorts Tailwind classes)
- **Config location**: `config/prettier/index.mjs`
- **Applied via**: `"prettier": "@ecokids/prettier"` in each package.json

### Import Ordering

Enforced by `eslint-plugin-simple-import-sort` (`simple-import-sort/imports: error`).

Pattern observed:
1. External packages (React, libraries)
2. Blank line
3. Internal path aliases (`@/...`)
4. Blank line
5. Relative imports (`./...`)

### Export Conventions

- **Named exports** for all components, hooks, utilities, and actions
- **Default export** only for `App` component (`export default App`)
- **Barrel re-exports** (`export * from`) in package index files and route domain index files

---

## TypeScript Rules

### Strict Mode

All tsconfig bases have `strict: true` enabled. Additional strict flags:
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noFallthroughCasesInSwitch: true`
- `noUncheckedSideEffectImports: true` (frontend apps)
- `isolatedModules: true`

### Path Aliases

All apps use `@/` alias pointing to `./src/*`:
```json
{
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

### Type Patterns

1. **Zod schemas** are the single source of truth for types — define the schema, then infer the type:
   ```typescript
   export const createSchoolBodySchema = z.object({ ... })
   export type CreateSchoolBody = z.infer<typeof createSchoolBodySchema>
   ```

2. **Request/Response types** follow a consistent pattern in `@ecokids/types`:
   - `[Action][Entity]BodySchema` + `[Action][Entity]Body` (body)
   - `[Action][Entity]ParamsSchema` + `[Action][Entity]Params` (URL params)
   - `[Action][Entity]RequestSchema` + `[Action][Entity]Request` (combined: `{ params, body }`)
   - `[Action][Entity]ResponseSchema` + `[Action][Entity]Response` (response)

3. **Interface vs Type**: Use `interface` for component props and context types. Use `type` for Zod-inferred types.

4. **Generics**: Used in hooks (`useAction<T>`) and Fastify type providers (`ZodTypeProvider`).

5. **Module augmentation**: Used in `@types/` folder for Fastify (`FastifyInstance`, `FastifyRequest`) and `NodeJS.ProcessEnv`.

6. **Forbidden**: Using `any` is not permitted. Use `unknown` when the type is truly unknown.

---

## Component Rules

### Component Organization

1. **Function declarations** for components (not arrow functions):
   ```typescript
   export function MyComponent() { ... }
   ```

2. **Props typing** via inline `interface`:
   ```typescript
   interface FormInputProps extends React.ComponentProps<'input'> {
     error?: string
   }
   ```

3. **shadcn/ui components** live in `components/ui/` — these are auto-generated and should NOT be manually modified unless adding variants.

4. **Custom form wrappers** live in `components/form/` — they wrap shadcn/ui primitives with error display logic.

5. **Component composition**: Components are composed using children, not render props. Use `ReactNode` for children types.

### Page Structure

Each page feature is a folder containing:
- `index.tsx` — The page component
- `actions.ts` — Server action functions (call HTTP → return `{ success, message }`)

### Layout Pattern

Three nested layouts via React Router `Outlet`:
1. `GlobalLayout` — Middleware (cookie sync) + dayjs config
2. `AppLayout` — Auth guard + Header + main content area
3. `AuthLayout` — Redirect if authenticated + centered content

---

## Hooks Rules

### Naming Convention

All hooks are prefixed with `use-` in filenames (kebab-case) and `use` in function names (camelCase):
- File: `use-actions.ts` → Function: `useAction()`
- File: `use-school.ts` → Function: `useCurrentSchool()`, `useCurrentSchoolSlug()`
- File: `use-metadata.ts` → Function: `useMetadata()`, `useMetadataSchool()`

### Hook Patterns

1. **Data fetching hooks** use TanStack Query:
   ```typescript
   export function useUserProfile() {
     const { data, isLoading, isError } = useQuery({
       queryKey: ['users', 'profile'],
       queryFn: () => getUserProfile(),
     })
     return { user: data?.user, isLoading, isError }
   }
   ```

2. **Query keys** follow hierarchical convention: `['domain', identifier, 'sub-resource']`
   - Example: `['schools', schoolSlug, 'membership']`

3. **`useAction()` hook** wraps `useTransition` for pending state + error handling. Returns `[actionState, handleAction, isPending]`.

4. **`useMetadata()`** sets document title and meta description via `useEffect`.

---

## State Management Rules

- **Server state**: TanStack Query (`@tanstack/react-query`) — used for all API data fetching and caching
- **Client state**: React `useState` within components or Context API for shared state
- **Auth state**: Cookie-based (JWT token in `token` cookie, school slug in `school` cookie)
- **Context**: Used sparingly — only `AuthContext` exists (and is partially legacy/unused)
- **No Redux/Zustand**: The project does not use external state management libraries

---

## API Rules

### Backend (Fastify)

1. **Route handler pattern**: Each route is an `async function` that receives `app: FastifyInstance` and registers a single endpoint:
   ```typescript
   export async function createSchool(app: FastifyInstance) {
     app
       .withTypeProvider<ZodTypeProvider>()
       .register(auth)
       .post('/schools', { schema: { ... } }, async (request, reply) => { ... })
   }
   ```

2. **Route registration**: Each domain folder has an `index.ts` that exports a `registerXRoutes(app)` function. All are registered in `src/http/routes/index.ts`.

3. **Schema validation**: Zod schemas from `@ecokids/types` are used in both `body` and `response` of the Fastify schema.

4. **Authentication**: The `auth` middleware is registered per-route via `.register(auth)`. It provides `request.getCurrentEntityId()` and `request.getUserMembership(schoolSlug)`.

5. **Authorization**: CASL permissions via `getUserPermissions(userId, role)` from `@/utils/get-user-permissions`. Toda nova funcionalidade deve obrigatoriamente considerar permissões. Nenhuma rota nova deve ser criada sem avaliar regras de autorização.

6. **Error handling**: Throw `BadRequestError`, `UnauthorizedError` or `ForbiddenError` from `_errors/`. The centralized `errorHandler` maps these to proper HTTP status codes.


7. **Database access**: Direct Prisma calls within route handlers. No separate service or repository layer.

8. **API documentation**: Swagger/OpenAPI via `@fastify/swagger` + `@fastify/swagger-ui` at `/docs`.

### Frontend (HTTP Client)

1. **Client instance**: `ky` with `beforeRequest` (JWT token injection from cookie) and `afterResponse` (401 → redirect to sign-in) hooks.

2. **Request function pattern**: One file per endpoint, typed with `@ecokids/types`:
   ```typescript
   export async function getSchool({ params: { schoolSlug } }: GetSchoolRequest) {
     const result = await api.get(`schools/${schoolSlug}`).json<GetSchoolResponse>()
     return result
   }
   ```

3. **Action function pattern**: Wraps HTTP request with error handling, returns `{ success, message }`:
   ```typescript
   export async function createSchoolAction({ body }: { body: CreateSchoolBody }) {
     try {
       await createSchool({ body: { ... } })
       toast.success('Escola criada com sucesso!')
       return { success: true, message: '...' }
     } catch (error) {
       if (error instanceof HTTPError) {
         const { message } = await error.response.json()
         toast.error(message)
         return { success: false, message }
       }
       return { success: false, message: 'Erro inesperado...' }
     }
   }
   ```

4. **Error handling in HTTP calls**: Always catch `HTTPError` from `ky`, extract message from response JSON, show toast.

---

## Styling Rules

1. **TailwindCSS v4** with `@tailwindcss/vite` plugin
2. **CSS Variables**: Design tokens defined in `index.css` using `oklch` color space (shadcn/ui convention)
3. **Dark mode**: Supported via CSS class strategy (`@custom-variant dark (&:is(.dark *))`)
4. **Custom fonts**: `Poppins` (primary) and `DM Sans` (secondary) — defined as CSS variables
5. **`cn()` utility**: Combines `clsx` + `tailwind-merge` for conditional/merged class names
6. **shadcn/ui style**: New York variant, zinc base color, CSS variables enabled
7. **Icons**: Lucide React (`lucide-react`)
8. **Toasts**: Sonner (`sonner`)
9. **Scrollbar**: Custom styled via CSS (light/dark variants)

### Styling Conventions

- Use Tailwind utility classes directly in JSX
- Use `cn()` for conditional classes
- Use CSS variables for theme tokens, not hardcoded colors
- Use `cva` (class-variance-authority) for component variants (as seen in Button)

---

## Error Handling Rules

### Backend

1. **Custom error classes** extend `Error`:
   - `BadRequestError` → 400
   - `UnauthorizedError` → 401
2. **Zod validation errors** → 400 with `error.flatten().fieldErrors`
3. **Unhandled errors** → 500 with generic message
4. **Centralized error handler** in `src/http/error-handler.ts`

### Frontend

1. **HTTP errors**: Catch `HTTPError` from ky, extract `message` from response body
2. **Toast notifications**: Use `sonner` for user-facing error/success messages
3. **Form validation**: Zod schemas resolved via `zodResolver` in React Hook Form
4. **Action state**: Tracked via `useAction()` hook — `{ success, message }`

---

## Naming Conventions

### Files & Folders

| Type | Convention | Example |
|---|---|---|
| Component files | kebab-case.tsx | `school-switcher.tsx` |
| Hook files | `use-` prefix, kebab-case | `use-school.ts` |
| HTTP request files | verb-entity, kebab-case | `create-school.ts`, `get-students.ts` |
| Action files | `actions.ts` (co-located with page) | `pages/app/school/actions.ts` |
| Type definition files | verb-entity, kebab-case | `create-school.ts` |
| Utility files | verb-noun, kebab-case | `format-cpf.ts`, `create-slug.ts` |
| Layout files | kebab-case | `app.tsx`, `auth.tsx`, `global.tsx` |
| Config files | kebab-case | `react-query.ts`, `compressorjs.ts` |
| Route domain index | `index.ts` | `routes/schools/index.ts` |

### Functions & Variables

| Type | Convention | Example |
|---|---|---|
| Components | PascalCase | `SchoolSwitcher`, `FormInput` |
| Hooks | camelCase with `use` prefix | `useCurrentSchool`, `useAction` |
| HTTP functions | camelCase verb-entity | `getSchool`, `createStudent` |
| Action functions | camelCase with `Action` suffix | `createSchoolAction` |
| Route registrars (API) | camelCase `register` prefix | `registerSchoolRoutes` |
| Route handlers (API) | camelCase verb-entity | `createSchool`, `getStudents` |
| Utilities | camelCase verb-noun | `createSlug`, `formatCPF` |
| Zod schemas | camelCase with `Schema` suffix | `createSchoolBodySchema` |
| Types (inferred) | PascalCase | `CreateSchoolBody`, `GetSchoolResponse` |
| Constants | camelCase | `queryClient`, `router` |
| Enums (Prisma) | UPPER_SNAKE_CASE | `ADMIN`, `MEMBER`, `PASSWORD_RECOVER` |

### Database

- **Tables**: `@@map("snake_case_plural")` — `users`, `schools`, `members`
- **Columns**: `@map("snake_case")` — `created_at`, `password_hash`, `school_id`
- **Models**: PascalCase — `User`, `School`, `SchoolSettings`
- **Relations**: camelCase — `member_on`, `owns_schools`, `score_items`
- **IDs**: UUID v4 (`@default(uuid())`)
- **Timestamps**: `createdAt` + `updatedAt` pattern

---

## Reusability Rules

1. **Shared types**: ALL Zod schemas and inferred types for API contracts MUST live in `packages/types`. They are used by both API (validation) and frontend (typing).

2. **Shared auth**: ALL authorization logic (roles, permissions, ability definitions, subjects) MUST live in `packages/auth`.

3. **Shared config**: ESLint, Prettier, and TypeScript configs are in `config/` and referenced via workspace packages.

4. **Component reuse**: UI primitives come from shadcn/ui (`components/ui/`). Wrap them in domain components (`components/form/`) when adding project-specific behavior.

5. **Hook reuse**: Hooks that fetch or derive state are centralized in `hooks/`. Do not inline TanStack Query calls in components when a hook already exists.

6. **HTTP layer reuse**: Each API endpoint has exactly one request function. Do not duplicate HTTP calls.

7. **When to abstract**: Create a new abstraction only when the same pattern appears in 3+ places. Prefer explicit repetition over premature abstraction.

---

## Performance Rules

1. **React Query caching**: Use proper `queryKey` hierarchies for automatic cache invalidation
2. **`useMemo`**: Used for derived state (e.g., school slug from URL)
3. **Image compression**: Use `compressorjs` before uploading images to S3/R2
4. **Lazy loading**: Not currently implemented — do not introduce without explicit approval
5. **Build optimization**: `tsup` bundles internal packages (`@ecokids/auth`, `@ecokids/env`, `@ecokids/types`) as non-external
6. **Turbo caching**: Build outputs cached in `.next/**` (excluding cache); dev tasks are non-cacheable and persistent

---

## Forbidden Practices

1. ❌ **Never use `any`** — Use `unknown` or proper typing
2. ❌ **Never leave `console.log` in production code** — Remove before committing (existing ones in error-handler and middleware are exceptions that should be migrated to proper logging)
3. ❌ **Never manually edit `components/ui/` files** — These are shadcn/ui generated
4. ❌ **Never hardcode API URLs** — Use the `api` ky instance from `http/api.ts`
5. ❌ **Never access environment variables without type augmentation** — Declare in `@types/env.d.ts`
6. ❌ **Never define Zod schemas outside `@ecokids/types`** for API contracts
7. ❌ **Never define authorization logic outside `@ecokids/auth`**
8. ❌ **Never create a new pattern when an existing one works** — Follow established patterns
9. ❌ **Never bypass the `useAction()` hook** for form submissions with pending/error state
10. ❌ **Never use inline styles** — Use Tailwind utility classes
11. ❌ **Never import from relative paths when `@/` alias is available**
12. ❌ **Never introduce new state management libraries** without explicit approval
13. ❌ **Never skip Zod validation** on API endpoints
14. ❌ **Never create service/repository layers in the API** — The project uses direct Prisma calls in route handlers

---

## Lint Rules

### ESLint

- **Base**: `@rocketseat/eslint-config` (react for frontend, node for backend)
- **Plugin**: `eslint-plugin-simple-import-sort` — `simple-import-sort/imports: error`
- **React apps**: `camelcase: error` (with `properties: 'never'` to allow Prisma snake_case fields)
- **Node/API**: `camelcase: off` (to allow Prisma model fields)

### Zero Tolerance Policy

The project **MUST NEVER** have:

- ❌ TypeScript errors
- ❌ ESLint errors
- ❌ ESLint warnings
- ❌ Build warnings
- ❌ Build errors
- ❌ Dead code
- ❌ Unused imports
- ❌ Unused variables
- ❌ Temporary debugging code
- ❌ Unfinished TODO comments

**Every modification must leave the project in a fully clean state. Zero warnings.**

---

## Build Rules

### Build Commands

| Scope | Command | Description |
|---|---|---|
| All | `pnpm build` | Turborepo parallel build |
| All | `pnpm dev` | Turborepo parallel dev servers |
| All | `pnpm lint` | Turborepo parallel lint (**DO NOT use for scoped validation**) |
| API | `pnpm lint:api` | Lint only `apps/api/src/` (direct eslint, ~6s) |
| Manager | `pnpm lint:manager` | Lint only `apps/manager/src/` (direct eslint, ~9s) |
| Viewer | `pnpm lint:viewer` | Lint only `apps/viewer/src/` (direct eslint, ~6s) |
| Scorer | `pnpm lint:scorer` | Lint only `apps/scorer/src/` (direct eslint, ~5s) |
| API | `pnpm build` → `tsup` | Bundle with tsup |
| API | `pnpm dev` → `tsx watch` | Dev with hot reload |
| Frontend | `pnpm build` → `tsc -b && vite build` | Type check + Vite build |
| Frontend | `pnpm dev` → `vite` | Vite dev server |
| Database | `pnpm db:migrate` | Run Prisma migrations |
| Database | `pnpm db:studio` | Open Prisma Studio |

### Build Integrity

1. `tsc -b` MUST pass with zero errors before Vite build
2. `tsup` MUST bundle without errors
3. All workspace packages (`@ecokids/*`) must resolve correctly
4. Never commit code that fails to build

---

## Prisma Database Migration Policy

Database schema history is critical and must always be preserved. Direct schema synchronization is strictly forbidden.

### Forbidden Commands
The following commands must **NEVER** be used unless explicitly requested by the repository owner:
- `prisma db push`
- `prisma db reset`
- Manually deleting migration files

### Mandatory Database Workflow
Whenever database changes are necessary:
1. **Modify**: Update the `schema.prisma` file.
2. **Generate Migration**: Run `pnpm db:migrate` (runs `prisma migrate dev` internally). If the script is unavailable, run `npx prisma migrate dev`.
3. **Verify**: Ensure the migration SQL files are generated successfully under the `prisma/migrations` folder.
4. **Commit**: Preserve and commit the migration history folder as part of the repository.

---

## Permanent UI Consistency Rules

This repository follows strict UI consistency standards. All future implementations must follow these rules.

### Rule 1 — Button Icon Spacing Policy
When rendering icons inside buttons, **NEVER** manually add margin utility classes (such as `mr-*` or `ml-*`) to the icons. 
- **Forbidden**: `<Button><Plus className="mr-2 h-4 w-4" /> Create</Button>`
- **Forbidden classes**: `mr-1`, `mr-2`, `mr-3`, `ml-1`, `ml-2`, `ml-3`, etc.
- **Mandatory**: Render icons without spacing utilities: `<Button><Plus className="h-4 w-4" /> Create</Button>`. Spacing behavior must come from the Button component, design system, or internal button layout.

### Rule 2 — Typography Policy (No Italic Text)
Italic text is **NOT** part of the project's visual language.
- **Forbidden**: NEVER use italic text styling anywhere in the application.
- **Forbidden elements**: `italic` class, `font-style: italic`, `em` tags, or any other typography styling that creates italic text.
- **Mandatory**: All text must use standard typography patterns (normal, font-medium, font-semibold, font-bold).

---

## Validation Rules

1. **Frontend forms**: React Hook Form + `zodResolver` + Zod schemas from `@ecokids/types`
2. **Backend endpoints**: Fastify Zod type provider + schemas from `@ecokids/types`
3. **Environment variables**: Zod schemas via `@t3-oss/env-nextjs` in `packages/env`
4. **Single source of truth**: The Zod schema in `@ecokids/types` validates on both client AND server

---

## Mandatory Final Validation Workflow

Before declaring any implementation task as completed, run validation **only on the package(s) that were modified**.

### Scoped Lint Rules (MANDATORY)

| Modified app | Correct lint command |
|---|---|
| `apps/viewer` | `pnpm lint:viewer` |
| `apps/api` | `pnpm lint:api` |
| `apps/manager` | `pnpm lint:manager` |
| `apps/scorer` | `pnpm lint:scorer` |

> ⚠️ **NEVER run `pnpm lint` or `turbo lint` after a scoped change.** These commands lint ALL workspaces via Turborepo and take 3–5+ minutes. They stall background task execution and cause infinite polling loops.

### Validation Steps

1. **Run scoped lint**: Run the scoped lint command once (e.g. `pnpm lint:viewer`).
2. **If lint returns issues**: Fix them. Then run scoped lint once more to confirm clean.
3. **Do NOT run global build** after every change — only when explicitly requested by the user.

### Command Execution Rules (STRICT — NO EXCEPTIONS)

- **Never wait indefinitely** for command completion.
- **Never create scheduled timers** to monitor commands.
- **Never poll command status repeatedly** in loops.
- **Never retry commands automatically** in loops.
- **Maximum 1 attempt per command.** If it stalls or fails, stop, report, and do NOT retry.
- **If any command hangs, stalls, does not return output, or the execution environment becomes blocked**: Stop immediately. Report: _"Lint did not complete. Possible script hang or process issue. No retry attempted."_ Do not loop.
- **Never run `pnpm lint` (global)** when only one app was changed. Always use the scoped command.

---

## Agent Lint & Validation Rules

> These rules exist to permanently prevent the infinite lint-loop problem observed during development sessions.

### Rule 1 — Always use scoped lint

The root `pnpm lint` and `turbo lint` run across **all** workspaces and take 3–5+ minutes. They **must not** be used as a post-implementation validation step for a single app change.

Use only the scoped commands defined in the root `package.json`:
```bash
pnpm lint:viewer   # apps/viewer/src/ --ext .ts,.tsx  (~6s)
pnpm lint:api      # apps/api/src/ --ext .ts          (~6s)
pnpm lint:manager  # apps/manager/src/ --ext .ts,.tsx (~9s)
pnpm lint:scorer   # apps/scorer/src/ --ext .ts,.tsx  (~5s)
```

These commands run `eslint src/ --ext .ts[,.tsx]` directly inside each app directory via `pnpm --dir`, completely bypassing Turborepo orchestration. They complete in **5–10 seconds**.

### Rule 2 — One attempt only

Never run any lint or build command more than once in the same session without an explicit user instruction. If the first attempt stalls or fails, stop and report the issue.

### Rule 3 — No background polling loops

Never schedule timers or poll background tasks in a loop waiting for a lint command to finish. If the lint command does not complete within the `WaitMsBeforeAsync` window (max 30 seconds), treat it as a stall and report it immediately.

### Rule 4 — Report, don't retry

If lint cannot be verified (stall, process hang, environment issue), report clearly:
```
Lint command did not complete. Possible process hang. Recommend running manually:
pnpm lint:viewer
```

Never enter an automatic retry loop.

---

## Authentication & Authorization Flow

### Authentication

1. User submits credentials → API validates → JWT signed with `JWT_SECRET`
2. Token set as HTTP cookie (`token`, 7-day expiry, `sameSite: lax`)
3. Frontend reads cookie, attaches as `Authorization: Bearer <token>` via ky `beforeRequest` hook
4. On 401 response → cookie cleared → redirect to `/sign-in`

### Authorization

1. CASL-based with two roles: `ADMIN` (manage all) and `MEMBER` (read-only)
2. `@ecokids/auth` package defines abilities per role
3. API: `getUserPermissions(userId, role)` returns CASL ability → checked with `can()`/`cannot()`
4. Frontend: `usePermissions()` hook fetches membership, returns CASL ability for conditional UI rendering

---

## Before Every Commit Checklist

- [ ] All database changes implemented via migrations and history preserved
- [ ] Direct schema synchronization (`db push`) avoided completely
- [ ] UI Components check: No manual margin utility classes (`mr-*`, `ml-*`) on icons inside buttons
- [ ] UI Components check: No italic text styling (`italic`, `font-style: italic`, `<em>` tag) anywhere
- [ ] Lint command (`pnpm lint`) executed and passes with zero warnings or errors
- [ ] Automatic fix (`pnpm lint:fix`) executed if lint issues were found
- [ ] Build command (`pnpm build`) compiles and outputs zero warnings/errors
- [ ] All TypeScript files compile without errors (`tsc -b`)
- [ ] Prettier formatting applied (no unformatted code)
- [ ] No unused imports, variables, or dead code remains
- [ ] No `console.log` left in new code
- [ ] No TODO/FIXME comments left unresolved
- [ ] All new Zod schemas placed in `@ecokids/types`
- [ ] All new authorization rules placed in `@ecokids/auth`
- [ ] Import ordering follows `simple-import-sort` rules
- [ ] New components follow established naming and file conventions
- [ ] New hooks follow `use-` prefix naming
- [ ] New HTTP functions follow the established `{ params, body }` pattern
- [ ] New actions follow the `try/catch HTTPError` pattern with toast notifications
- [ ] No new patterns introduced without explicit approval
