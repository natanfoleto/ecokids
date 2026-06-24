# DOMAIN.md

> Business entities, domain relationships, business rules inferred from code.

---

## Domain Overview

Ecokids is a **recycling rewards platform for schools**. Schools register students who earn points by recycling items (measured in quantity × value). Students can view their ranking and redeem accumulated points for awards in a shop. Teachers/administrators manage the system via a dashboard.

---

## Entity Map

```mermaid
erDiagram
    User ||--o{ Member : "member_on"
    User ||--o{ School : "owns"
    User ||--o{ Invite : "authored"
    User ||--o{ UserToken : "tokens"

    School ||--o{ Member : "members"
    School ||--o{ Class : "classes"
    School ||--o{ Student : "students"
    School ||--o{ Award : "awards"
    School ||--o{ Item : "items"
    School ||--o{ Invite : "invites"
    School ||--|| SchoolSettings : "settings"

    Class ||--o{ Student : "students"

    Student ||--o{ Point : "points"
    Student ||--o{ StudentToken : "tokens"

    Point ||--o{ ScoreItems : "score_items"

    Item ||--o{ ScoreItems : "score_items"
```

---

## Entities

### User

The human administrator/teacher who manages schools.

| Field | Type | Constraints |
|---|---|---|
| id | UUID | PK, auto-generated |
| name | string | Required |
| email | string | Unique |
| cpf | string | Required (Brazilian tax ID) |
| avatarUrl | string? | Optional, S3/R2 URL |
| passwordHash | string | bcrypt hashed |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |

**Business rules**:
- A user can own multiple schools
- A user can be a member of multiple schools (via `Member`)
- Authentication via email + password → JWT cookie
- Password recovery via `UserToken` (type: `PASSWORD_RECOVER`)

---

### School

The organizational unit. All domain resources belong to a school.

| Field | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| name | string | Required |
| slug | string | Unique, auto-generated from name |
| city | string? | Optional |
| state | string? | Optional |
| domain | string? | Unique, optional |
| shouldAttachUsersByDomain | boolean | Default: false |
| logoUrl | string? | S3/R2 URL |
| ownerId | string | FK → User |
| createdAt / updatedAt | DateTime | Auto |

**Business rules**:
- Slug is generated from the name via `createSlug()`. If duplicate, a 4-char random hash is appended.
- Domain must be unique across all schools (validated server-side).
- On creation, the creating user is automatically added as an `ADMIN` member.
- A `SchoolSettings` record is automatically created alongside the school (inside a transaction).
- Shutting down a school deletes it permanently (cascade deletes all related entities).
- Logo is uploaded to R2 as `schools/{schoolId}/logo/{filename}`.

---

### SchoolSettings

Per-school configuration. Currently tracks only auto-incrementing student codes.

| Field | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| lastStudentCode | int | Default: 0 |
| schoolId | string | FK → School, unique |

**Business rules**:
- `lastStudentCode` is auto-incremented when a new student is created without an explicit code.

---

### Member

Junction entity linking Users to Schools with a role.

| Field | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| role | Role (enum) | Default: MEMBER |
| schoolId | string | FK → School |
| userId | string | FK → User |

**Unique constraint**: `[schoolId, userId]` — a user can only be a member of a school once.

**Business rules**:
- Two roles: `ADMIN` (full management) and `MEMBER` (limited operational access).
- The school owner is always an `ADMIN`.
- Role can be changed via the members management page.
- **MEMBER permissions**:
  - `get Member`, `get Invite` — read access to membership/invites (Manager app)
  - `get SchoolSeason` — check active scoring season
  - `get Student` — identify students by code or search by name (Scorer app)
  - `get Item` — view recyclable items available for scoring (Scorer app)
  - `create Point` — register a scoring session (Scorer app)

---

### Invite

Invitation to join a school, sent via email.

| Field | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| email | string | Indexed |
| role | Role (enum) | Required |
| authorId | string? | FK → User (nullable, set null on delete) |
| schoolId | string | FK → School |
| createdAt | DateTime | Auto |

**Unique constraint**: `[email, schoolId]` — only one pending invite per email per school.

**Business rules**:
- Only `ADMIN` members can create invites.
- A user can accept or reject pending invites.
- An admin can revoke an invite.
- On accept: a new `Member` record is created with the invite's role.
- On reject/revoke: the invite is deleted.

---

### Class

A school class (e.g., "5th Grade", "Turma A").

| Field | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| name | string | Required |
| year | string | Required (e.g., "2024") |
| schoolId | string | FK → School |
| createdAt / updatedAt | DateTime | Auto |

**Unique constraint**: `[name, year, schoolId]` — no duplicate class name+year within a school.

**Business rules**:
- Each student belongs to exactly one class.
- Classes are scoped to a school.
- Deleting a class cascades to all students in that class.

---

### Student

A school student who earns and redeems points.

| Field | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| code | int | Required |
| name | string | Required |
| cpf | string? | Unique (optional) |
| email | string? | Unique (optional) |
| passwordHash | string | bcrypt hashed |
| active | boolean | Default: true |
| schoolId | string | FK → School |
| classId | string | FK → Class |
| createdAt / updatedAt | DateTime | Auto |

**Unique constraint**: `[code, schoolId]` — student codes are unique within a school.

**Business rules**:
- Students have their own authentication flow (separate from Users).
- Student codes are used for quick login at scoring kiosks.
- Students can be deactivated (`active: false`) without deletion.
- Password recovery via `StudentToken`.
- Students are scoped to both a school and a class.

---

### Point

A scoring event recording points earned by a student.

| Field | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| amount | int | Total points for this scoring |
| studentId | string | FK → Student |
| createdAt | DateTime | Auto |

**Business rules**:
- `amount` is calculated as the sum of `item.value × scoreItem.amount` for all items in the scoring.
- Points are immutable — they cannot be edited or deleted once created.
- Each point has associated `ScoreItems` that detail which items were recycled.

---

### ScoreItems

Line items within a Point event, detailing what was recycled.

| Field | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| amount | int | Quantity recycled |
| value | int | Point value per unit (snapshot at scoring time) |
| pointId | string | FK → Point |
| itemId | string | FK → Item |

**Business rules**:
- `value` is a snapshot of the item's point value at the time of scoring (not a live reference).
- Total points for a scoring: `Σ(amount × value)` across all score items.

---

### Item

A recyclable item type that can be scored (e.g., "Plastic Bottle", "Aluminum Can").

| Field | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| name | string | Required |
| description | string? | Optional |
| value | int | Points per unit |
| photoUrl | string? | S3/R2 URL |
| schoolId | string | FK → School |
| createdAt / updatedAt | DateTime | Auto |

**Business rules**:
- Items are scoped to a school — each school defines its own recyclable items.
- `value` is the current point value; changes do NOT retroactively affect past scorings.
- Photos are uploaded to R2.

---

### Award

A redeemable reward that students can exchange points for.

| Field | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| name | string | Required |
| description | string? | Optional |
| value | int | Point cost |
| photoUrl | string? | S3/R2 URL |
| schoolId | string | FK → School |
| createdAt / updatedAt | DateTime | Auto |

**Business rules**:
- Awards are scoped to a school.
- `value` is the cost in points to redeem the award.
- Photos uploaded to R2.
- ⚠️ **No redemption tracking exists** — there is no `Redemption` or `Order` entity. The shop/awards display exists in the viewer frontend, but the backend does not yet implement the redemption flow.

---

### Enums

| Enum | Values | Usage |
|---|---|---|
| `Role` | `ADMIN`, `MEMBER` | Member roles, invite roles |
| `TokenType` | `PASSWORD_RECOVER` | Token purpose for password reset |

---

## Domain Relationships Summary

```
School (top-level aggregate)
├── Members (Users with roles)
├── Invites (pending join requests)
├── Classes
│   └── Students
│       ├── Points
│       │   └── ScoreItems → Items
│       └── StudentTokens
├── Items (recyclable item definitions)
├── Awards (redeemable rewards)
└── SchoolSettings (config)
```

---

## Business Flows

### 1. School Onboarding

```
User signs up → Creates school → Auto-becomes ADMIN member → Invites other users
```

### 2. Student Registration

```
Admin creates class → Admin creates student (with auto-generated code + password) → Student can log in
```

### 3. Scoring Flow

```
Scorer operator identifies student (by code) → Selects recycled items + quantities
→ API calculates total points (Σ item.value × quantity)
→ Creates Point + ScoreItems records
```

### 4. Award Redemption (Incomplete)

```
Student views ranking/shop in Viewer app → [Redemption not yet implemented]
```

> ⚠️ **Assumption**: The award redemption flow is designed but not yet implemented in the backend. The Viewer frontend has a `/shop` route and the API has viewer-specific endpoints, but no `POST` endpoint exists for redeeming awards.

---

## Multi-Tenancy Model

The system uses a **school-scoped tenant model**:

- Every resource (class, student, item, award, point) belongs to exactly one school.
- API routes use `:schoolSlug` as a URL parameter to scope all operations.
- Membership verification happens on every school-scoped request via `request.getUserMembership(schoolSlug)`.
- Users can be members of multiple schools and switch between them.
- The current school context is persisted in a `school` cookie on the frontend.
