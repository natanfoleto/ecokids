# Backend & API Development Guide

This manual defines the technical architecture, coding standards, route conventions, security middleware, and database integration guidelines for the Fastify REST API.

---

## 1. Technology Stack

- **Web Framework**: Fastify 4.x (with Zod Type Provider)
- **Database ORM**: Prisma 5.x + PostgreSQL
- **Authentication**: JWT (`@fastify/jwt`) & Cookies (`@fastify/cookie`)
- **Authorization**: CASL (Abilities & Permissions checks)
- **Object Storage**: S3 API (Cloudflare R2 wrapper)
- **Documentation**: Swagger (`@fastify/swagger` + `@fastify/swagger-ui`) at `/docs`
- **Compiler**: `tsup` (build) & `tsx watch` (development)

---

## 2. Server Lifecycle & Bootstrap

The API entry point is [server.ts](file:///Users/natanfoleto/Desktop/github/ecokids/apps/api/src/http/server.ts):
1. **Context Init**: Registers a Fastify `onRequest` hook to bootstrap `requestContextStorage` (AsyncLocalStorage) with metadata (IP Address, User Agent).
2. **Plugins Registration**: Registers CORS, Cookies, JWT, Swagger, and Multipart.
3. **Database Client**: Decorates the app with `s3Client` and initializes the Prisma client extension.
4. **Error Handling**: Attaches the centralized `errorHandler`.
5. **Route Mapping**: Automatically registers all domain route groups.

---

## 3. Directory & Route Organization

All backend source files are structured inside `apps/api/src/`:

```text
src/
├── @types/            # TS Module augmentations (Fastify, process.env)
├── http/
│   ├── middlewares/   # Fastify plugins (auth.ts)
│   ├── routes/        # Route controllers grouped by domain folder
│   │   ├── auth/      # Login, password reset
│   │   ├── schools/   # School CRUD & membership
│   │   ├── students/  # Student CRUD & code lookup
│   │   ├── points/    # Kiosk scoring registrations
│   │   ├── _errors/   # Custom HTTP error classes
│   │   └── index.ts   # Route registrar barrel
│   ├── error-handler.ts
│   └── server.ts      # Main app entry
├── lib/               # Singletons (prisma client, aws s3 wrapper)
└── utils/             # CASL permissions resolver, slug generator
```

### Route Registration Barrel Pattern
Each route handler is in its own file and registers itself. The domain's `index.ts` barrels register them to the app:

```typescript
// http/routes/schools/index.ts
import { FastifyInstance } from 'fastify'
import { createSchool } from './create-school'
import { getSchool } from './get-school'

export async function registerSchoolRoutes(app: FastifyInstance) {
  app.register(createSchool)
  app.register(getSchool)
}
```

---

## 4. Route Controller Pattern

Every controller follows a strict, single-endpoint pattern:

```typescript
import { someBodySchema, someResponseSchema } from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { ForbiddenError } from '@/http/routes/_errors/forbidden-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function createSomething(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/schools/:schoolSlug/somethings',
      {
        schema: {
          tags: ['Somethings'],
          summary: 'Cria um novo item no ciclo',
          security: [{ bearerAuth: [] }],
          params: someParamsSchema,
          body: someBodySchema,
          response: {
            201: someResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug } = request.params
        const { name } = request.body

        // 1. Resolve Auth Context & CASL Permissions
        const userId = await request.getCurrentEntityId()
        const { membership } = await request.getUserMembership(schoolSlug)
        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('create', 'Something')) {
          throw new ForbiddenError('Acesso negado para este recurso.')
        }

        // 2. Perform Mutation
        const result = await prisma.something.create({
          data: { name, schoolId: membership.schoolId }
        })

        return reply.status(201).send({ id: result.id })
      }
    )
}
```

---

## 5. Security, Authorization & CASL

### Auth Middleware (`auth.ts`)
The `auth` plugin decorates `request` with helpers to fetch session information:
- **`request.getCurrentEntityId()`**: Verifies JWT, returns ID (resolves `USER` or `STUDENT` based on path prefix `/viewers` or `/authenticate/students`), and registers `actorId` / `actorType` context.
- **`request.getUserMembership(schoolSlug)`**: Queries membership table, verifying if the user belongs to the requested school slug. Throws 401 if not.

### CASL Authorization Matrix
Only `ADMIN` has full write access. `MEMBER` is restricted to read-only dashboard actions.

| Action | Subject | ADMIN | MEMBER |
|---|---|---|---|
| `manage` | `all` | ✅ | ❌ |
| `get` | `Student`, `Item`, `SchoolSeason`, `Member`, `Invite` | ✅ | ✅ |
| `create` | `Point` (Kiosk Scoring) | ✅ | ✅ |

Route handlers must enforce these checks manually using `getUserPermissions(userId, role).cannot(action, subject)` and throw `ForbiddenError` (HTTP 403) on violation.

---

## 6. Pagination, Filtering & Search

API pagination relies on `@ecokids/types` shared schemas.

### Query and Meta Schemas (`packages/types/src/models/pagination.ts`)
```typescript
export const paginationQuerySchema = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  search: z.string().optional(),
})

export const paginationMetaSchema = z.object({
  page: z.number(),
  limit: z.number(),
  totalCount: z.number(),
  pageCount: z.number(),
})
```

### Prisma Pagination Implementation
When querying lists, perform case-insensitive searches and count matching rows first:

```typescript
const { page, limit, search } = request.query

const where = {
  schoolId: school.id,
  ...(search ? { OR: [{ name: { contains: search, mode: 'insensitive' } as const }] } : {})
}

const totalCount = await prisma.item.count({ where })
const limitVal = limit ? Number(limit) : totalCount
const pageVal = page ? Number(page) : 1
const skip = page && limit ? (Number(page) - 1) * Number(limit) : undefined

const items = await prisma.item.findMany({
  where,
  orderBy: { name: 'asc' },
  take: limit ? Number(limit) : undefined,
  skip,
})

return reply.send({
  items,
  meta: {
    page: pageVal,
    limit: limitVal,
    totalCount,
    pageCount: limitVal > 0 ? Math.ceil(totalCount / limitVal) : 1,
  }
})
```

---

## 7. Error Handling & Logging

All errors are handled centrally in [error-handler.ts](file:///Users/natanfoleto/Desktop/github/ecokids/apps/api/src/http/error-handler.ts).

### Centralized Mapping
- **`ZodError`** ➔ Status `400 Bad Request` `{ message: 'Erro de validação.', errors: fieldErrors }`
- **`BadRequestError`** ➔ Status `400 Bad Request` `{ message: error.message }`
- **`UnauthorizedError`** ➔ Status `401 Unauthorized` `{ message: error.message }`
- **`ForbiddenError`** ➔ Status `403 Forbidden` `{ message: error.message }` (also automatically triggers a `SECURITY_VIOLATION` log).
- **Unhandled Errors** ➔ Status `500 Internal Server Error`

---

## 8. S3 Object Storage & File Uploads

File uploads (logos, photo files) use `@fastify/multipart`.
- Wraps uploads using a custom class singleton `s3Client` (`S3ClientWrapper`).
- Upload path template: `schools/{schoolId}/{resource}/{filename}`.
- Public URLs use Cloudflare R2 subdomain structure.

```typescript
const file = await request.file()
const fileBuffer = await file.toBuffer()

await app.s3Client.uploadFile(
  process.env.R2_BUCKET_NAME,
  `schools/${schoolId}/logo/${filename}`,
  fileBuffer,
  file.mimetype,
)
```

---

## 9. Database Query Audit System

The project uses a **Prisma Query Extension** (`$extends`) configured in [prisma.ts](file:///Users/natanfoleto/Desktop/github/ecokids/apps/api/src/lib/prisma.ts) to audit mutations.

### Interceptor Logic
1. Hook interceptor intercepts writes (`create`, `update`, `delete`, `upsert`) on models in `AUDITED_MODELS`.
2. Reads the `actorId`, `actorType`, `schoolId`, `ipAddress`, and `userAgent` from `requestContextStorage` (AsyncLocalStorage).
3. For updates and deletes, performs a `findUnique` query to capture the `oldData` state before committing the mutation.
4. Executes the database command, captures the `newData` output.
5. Saves the audit payload to the `audit_logs` table using a **base/clean** prisma client connection (`basePrisma` to prevent recursive event loops).

### Manual Audits Helper (`recordAuditLog`)
For actions that do not change database state (e.g. login failures, security violations):
```typescript
import { recordAuditLog } from '@/lib/audit-service'

await recordAuditLog({
  schoolId,
  actorId,
  actorType: 'USER',
  entityType: 'User',
  entityId: actorId,
  action: 'LOGIN',
  description: `Usuário ${email} fez login.`,
  ipAddress,
  userAgent,
})
```
