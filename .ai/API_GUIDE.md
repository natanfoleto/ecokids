# API_GUIDE.md

> API patterns, route organization, service patterns, validation rules, and endpoint catalog.

---

## Technology Stack

| Component | Technology |
|---|---|
| Framework | Fastify 4.x |
| Validation | Zod + `fastify-type-provider-zod` |
| Database | PostgreSQL via Prisma 5.x |
| Auth | `@fastify/jwt` + `@fastify/cookie` |
| File Upload | `@fastify/multipart` |
| Documentation | `@fastify/swagger` + `@fastify/swagger-ui` |
| CORS | `@fastify/cors` |
| Object Storage | `@aws-sdk/client-s3` (Cloudflare R2) |
| Build | tsup |
| Dev | tsx watch |

---

## Server Bootstrap

The API boots in `src/http/server.ts`:

```
1. Load .env via dotenv
2. Create Fastify instance with ZodTypeProvider
3. Initialize S3ClientWrapper
4. Set serializer/validator compilers (Zod)
5. Set error handler
6. Register plugins: Swagger, JWT, Cookie, CORS
7. Decorate app with s3Client
8. Register all routes
9. Listen on SERVER_PORT (default: 3333)
```

---

## Route Organization

### Directory Structure

```
src/http/routes/
├── _errors/          # Custom error classes
│   ├── bad-request-error.ts
│   └── unauthorized-error.ts
├── auth/             # Authentication endpoints
├── users/            # User management
├── schools/          # School CRUD
├── invites/          # School invitations
├── members/          # School membership
├── classes/          # Class management
├── students/         # Student CRUD
├── points/           # Scoring
├── awards/           # Awards management
├── items/            # Recyclable items management
├── viewers/          # Student-facing read endpoints
└── index.ts          # Route registration barrel
```

### Registration Pattern

Each domain folder has an `index.ts` barrel:

```typescript
// routes/schools/index.ts
import { FastifyInstance } from 'fastify'
import { createSchool } from './create-school'
import { getSchool } from './get-school'
// ...

export async function registerSchoolRoutes(app: FastifyInstance) {
  app.register(createSchool)
  app.register(getSchool)
  // ...
}
```

All domain registrars are imported and called in `routes/index.ts`:

```typescript
export default async function (app: FastifyInstance) {
  await registerAuthRoutes(app)
  await registerUserRoutes(app)
  await registerSchoolRoutes(app)
  // ...
}
```

---

## Route Handler Pattern

Every route handler follows this exact structure:

```typescript
import { someBodySchema, someResponseSchema } from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function createSomething(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)                          // Auth middleware (if protected)
    .post(                                   // HTTP method
      '/schools/:schoolSlug/somethings',     // URL pattern
      {
        schema: {
          tags: ['Tag Name'],                // Swagger tag
          summary: 'Description',            // Swagger summary
          security: [{ bearerAuth: [] }],    // Swagger auth indicator
          params: someParamsSchema,          // Zod params validation
          body: someBodySchema,              // Zod body validation
          response: {
            201: someResponseSchema,         // Zod response schema
          },
        },
      },
      async (request, reply) => {
        // 1. Extract validated params/body
        const { schoolSlug } = request.params
        const { name } = request.body

        // 2. Auth + Authorization
        const userId = await request.getCurrentEntityId()
        const { membership, school } = await request.getUserMembership(schoolSlug)
        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('create', 'Something')) {
          throw new UnauthorizedError('...')
        }

        // 3. Business logic + Database
        const result = await prisma.something.create({ ... })

        // 4. Response
        return reply.status(201).send({ id: result.id })
      },
    )
}
```

---

## Authentication Middleware

Located at `src/http/middlewares/auth.ts`. Implemented as a Fastify plugin via `fastify-plugin`.

### Provided Methods

| Method | Signature | Description |
|---|---|---|
| `getCurrentEntityId` | `() => Promise<string>` | Verifies JWT, returns `sub` claim (user or student ID) |
| `getUserMembership` | `(schoolSlug: string) => Promise<{ school, membership }>` | Finds member record, throws if not a member |

### Usage

```typescript
// Protected route — register auth middleware
app.withTypeProvider<ZodTypeProvider>()
  .register(auth)
  .get('/protected', { ... }, async (request, reply) => {
    const userId = await request.getCurrentEntityId()
    const { membership, school } = await request.getUserMembership(schoolSlug)
  })

// Unprotected route — do NOT register auth
app.withTypeProvider<ZodTypeProvider>()
  .post('/authenticate/users/password', { ... }, async (request, reply) => { ... })
```

---

## Authorization Pattern

```typescript
import { getUserPermissions } from '@/utils/get-user-permissions'

// Inside route handler:
const userId = await request.getCurrentEntityId()
const { membership } = await request.getUserMembership(schoolSlug)
const { cannot } = getUserPermissions(userId, membership.role)

if (cannot('create', 'Student')) {
  throw new UnauthorizedError('Você não tem permissão para criar alunos.')
}
```

### Permission Matrix

| Subject | ADMIN | MEMBER |
|---|---|---|
| School | manage (all), transfer_ownership + update (if owner) | — |
| Member | manage | get |
| Invite | manage | get |
| Class | manage | — |
| Student | manage | **get** (required for Scorer: identify student by code + search by name) |
| Point | manage | **create** (required for Scorer: register a scoring session) |
| Award | manage | — |
| Item | manage | **get** (required for Scorer: load recyclable items list) |
| SchoolSeason | manage | get |

---

## Error Handling

### Custom Error Classes

```typescript
// Bad Request (400) — validation/business rule violations
export class BadRequestError extends Error {}

// Unauthorized (401) — auth/permission failures
export class UnauthorizedError extends Error {
  constructor(message?: string) {
    super(message ?? 'Unauthorized.')
  }
}
```

### Error Handler (`error-handler.ts`)

```
ZodError        → 400 { message: 'Erro de validação', errors: fieldErrors }
BadRequestError → 400 { message: error.message }
UnauthorizedError → 401 { message: error.message }
Unknown         → 500 { message: 'Internal server error' }
```

---

## Validation Rules

### Schema Location

All Zod schemas are defined in `packages/types/src/models/[domain]/`:

```
packages/types/src/models/
├── auth/           # authenticate-user-with-password, etc.
├── schools/        # create-school, get-school, update-school, etc.
├── students/       # create-student, get-students, etc.
├── classes/        # create-class, get-classes, etc.
├── members/        # get-membership, etc.
├── invites/        # create-invite, accept-invite, etc.
├── points/         # create-point, etc.
├── awards/         # create-award, get-awards, etc.
├── items/          # create-item, get-items, etc.
├── users/          # create-user, get-user-profile, etc.
└── viewers/        # get-school-ranking, get-student-profile, etc.
```

### Schema Naming Convention

| Schema | Naming Pattern |
|---|---|
| Body | `createSchoolBodySchema` / `CreateSchoolBody` |
| Params | `getSchoolParamsSchema` / `GetSchoolParams` |
| Request | `createSchoolRequestSchema` / `CreateSchoolRequest` |
| Response | `createSchoolResponseSchema` / `CreateSchoolResponse` |

### Validation Flow

```
HTTP Request
    │
    ▼
Fastify validates params/body against Zod schema
    │
    ├── Valid → Handler executes
    └── Invalid → ZodError thrown → error-handler returns 400
```

---

## File Upload Pattern

Used for school logos, award photos, and item photos.

```typescript
// Route with multipart
app.post('/schools/:schoolSlug/logo', {
  schema: { ... }
}, async (request, reply) => {
  const file = await request.file()

  // Upload to R2
  await app.s3Client.uploadFile(
    process.env.R2_BUCKET_NAME,
    `schools/${schoolId}/logo/${filename}`,
    buffer,
    contentType,
  )

  // Save URL in database
  const logoUrl = getS3PathURL({ objectName: `schools/${schoolId}/logo/${filename}` })
  await prisma.school.update({ where: { id: schoolId }, data: { logoUrl } })
})
```

### S3 Client Methods

| Method | Description |
|---|---|
| `uploadFile(bucket, key, content, contentType)` | Upload a file to R2 |
| `deleteFolder(bucket, folderKey)` | Delete all objects under a prefix |
| `listBuckets()` | List available buckets |

---

## Endpoint Catalog

### Authentication (`/authenticate`)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/authenticate/users/password` | ❌ | Login user with email + password |
| POST | `/authenticate/students/password` | ❌ | Login student with code + password |
| POST | `/users/password/recover` | ❌ | Request password recovery |
| POST | `/users/password/reset` | ❌ | Reset password with token |
| POST | `/students/password/recover` | ❌ | Student password recovery |
| POST | `/students/password/reset` | ❌ | Student password reset |

### Users (`/users`)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/users` | ❌ | Register new user |
| GET | `/users/profile` | ✅ | Get current user profile |
| PUT | `/users` | ✅ | Update user data |
| PATCH | `/users/password` | ✅ | Update user password |
| PATCH | `/users/avatar` | ✅ | Upload user avatar |

### Schools (`/schools`)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/schools` | ✅ | Create school |
| GET | `/schools` | ✅ | List user's schools |
| GET | `/schools/:schoolSlug` | ✅ | Get school details |
| PUT | `/schools/:schoolSlug` | ✅ | Update school |
| PATCH | `/schools/:schoolSlug/logo` | ✅ | Upload school logo |
| GET | `/schools/:schoolSlug/membership` | ✅ | Get current user's membership |
| DELETE | `/schools/:schoolSlug` | ✅ | Delete (shutdown) school |

### Classes (`/schools/:schoolSlug/classes`)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/schools/:schoolSlug/classes` | ✅ | Create class |
| GET | `/schools/:schoolSlug/classes` | ✅ | List classes |
| GET | `/schools/:schoolSlug/classes/:classId` | ✅ | Get class |
| PUT | `/schools/:schoolSlug/classes/:classId` | ✅ | Update class |
| DELETE | `/schools/:schoolSlug/classes/:classId` | ✅ | Delete class |

### Students (`/schools/:schoolSlug/students`)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/schools/:schoolSlug/students` | ✅ | Create student |
| GET | `/schools/:schoolSlug/students` | ✅ | List students |
| GET | `/schools/:schoolSlug/students/:studentId` | ✅ | Get student |
| GET | `/schools/:schoolSlug/students/code/:code` | ✅ | Get student by code |
| PUT | `/schools/:schoolSlug/students/:studentId` | ✅ | Update student |
| DELETE | `/schools/:schoolSlug/students/:studentId` | ✅ | Delete student |

### Points (`/schools/:schoolSlug/students/:studentId/points`)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/schools/:schoolSlug/students/:studentId/points` | ✅ | Create point scoring |

### Awards (`/schools/:schoolSlug/awards`)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/schools/:schoolSlug/awards` | ✅ | Create award |
| GET | `/schools/:schoolSlug/awards` | ✅ | List awards |
| GET | `/schools/:schoolSlug/awards/:awardId` | ✅ | Get award |
| PUT | `/schools/:schoolSlug/awards/:awardId` | ✅ | Update award |
| PATCH | `/schools/:schoolSlug/awards/:awardId/photo` | ✅ | Upload award photo |
| DELETE | `/schools/:schoolSlug/awards/:awardId` | ✅ | Delete award |

### Items (`/schools/:schoolSlug/items`)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/schools/:schoolSlug/items` | ✅ | Create item |
| GET | `/schools/:schoolSlug/items` | ✅ | List items |
| GET | `/schools/:schoolSlug/items/:itemId` | ✅ | Get item |
| PUT | `/schools/:schoolSlug/items/:itemId` | ✅ | Update item |
| PATCH | `/schools/:schoolSlug/items/:itemId/photo` | ✅ | Upload item photo |
| DELETE | `/schools/:schoolSlug/items/:itemId` | ✅ | Delete item |

### Invites (`/schools/:schoolSlug/invites`)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/schools/:schoolSlug/invites` | ✅ | Create invite |
| GET | `/schools/:schoolSlug/invites` | ✅ | List school invites |
| GET | `/invites/pending` | ✅ | List current user's pending invites |
| GET | `/invites/:inviteId` | ✅ | Get invite details |
| POST | `/invites/:inviteId/accept` | ✅ | Accept invite |
| POST | `/invites/:inviteId/reject` | ✅ | Reject invite |
| DELETE | `/schools/:schoolSlug/invites/:inviteId` | ✅ | Revoke invite |

### Members (`/schools/:schoolSlug/members`)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/schools/:schoolSlug/members` | ✅ | List members |
| PUT | `/schools/:schoolSlug/members/:memberId` | ✅ | Update member role |
| DELETE | `/schools/:schoolSlug/members/:memberId` | ✅ | Remove member |

### Viewers (Student-facing endpoints)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/viewers/schools/:schoolSlug/classes` | ✅ | List school classes (student view) |
| GET | `/viewers/schools/:schoolSlug/ranking` | ✅ | Get school ranking |
| GET | `/viewers/schools/:schoolSlug/shop` | ✅ | Get school shop (awards list) |
| GET | `/viewers/students/profile` | ✅ | Get student profile |
| GET | `/viewers/students/points` | ✅ | Get student's point history |

---

## URL Pattern Conventions

### Base Patterns

| Pattern | Meaning |
|---|---|
| `/:schoolSlug` | School-scoped routes use slug |
| `/:entityId` | Entity-specific routes use UUID |
| `/schools/:schoolSlug/[resource]` | All school-scoped resources |
| `/viewers/...` | Student-facing read-only endpoints |

### HTTP Method Conventions

| Method | Usage | Status Code |
|---|---|---|
| GET | Read operations | 200 |
| POST | Create operations | 201 |
| PUT | Full update operations | 200 or 204 |
| PATCH | Partial update (files, passwords) | 200 or 204 |
| DELETE | Delete operations | 200 or 204 |

---

## Swagger / OpenAPI

- **URL**: `http://localhost:3333/docs`
- **Tags**: Each domain has a Portuguese-language tag (Autenticação, Escolas, Alunos, etc.)
- **Security**: Bearer auth scheme defined globally
- **Transform**: `jsonSchemaTransform` from `fastify-type-provider-zod` converts Zod schemas to JSON Schema

---

## Creating New Endpoints

### Checklist

1. Define Zod schemas in `packages/types/src/models/[domain]/`
   - Body schema + type
   - Params schema + type (if needed)
   - Request schema + type
   - Response schema + type
   - Export from domain `index.ts` and models `index.ts`

2. Create route handler in `apps/api/src/http/routes/[domain]/`
   - One file, one endpoint
   - Register `auth` middleware if protected
   - Use `withTypeProvider<ZodTypeProvider>()`
   - Include `schema.tags`, `schema.summary`, `schema.security`
   - Validate authorization with `getUserPermissions`
   - Call Prisma directly
   - Return via `reply.status(code).send(data)`

3. Register in domain `index.ts`
   - Import handler function
   - Call `app.register(handler)` in `registerXRoutes`

4. If new domain: register in `routes/index.ts`
   - Import `registerXRoutes` from new domain
   - Call `await registerXRoutes(app)`

5. If new CASL subject needed: update `packages/auth`
   - Add subject in `src/subjects/`
   - Add model in `src/models/` (if needed)
   - Update `src/index.ts` union
   - Update `src/permissions.ts` for each role
