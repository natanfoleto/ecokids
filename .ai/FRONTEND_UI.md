# Frontend & UI Development Guide

This manual defines the frontend architecture, styling standards, layout structures, visual patterns, and interactive systems (toast notification, pagination, and authorization guards) for the React Single Page Applications (`manager`, `scorer`, `viewer`).

---

## 1. Technology Stack & Organization

- **Core Framework**: React 19 + Vite
- **CSS Utility**: TailwindCSS v4 with `@tailwindcss/vite`
- **Component Primitives**: `shadcn/ui` (New York style, zinc base)
- **Data Fetching & Cache**: TanStack Query v5 (`@tanstack/react-query`)
- **Routing**: React Router v6 (`createBrowserRouter`)
- **Forms**: React Hook Form + Zod resolvers
- **Icons**: Lucide React (`lucide-react`)
- **Toasts**: Custom `@ecokids/ui` event-emitter notifications

---

## 2. Directory Layout & Routing structure

All three applications follow the same layout model inside `src/`:

```text
src/
├── main.tsx              # Entry point (createRoot)
├── App.tsx               # Root wrapper (TanStack Query + Router + Toaster)
├── routes.tsx            # Route map definition
├── index.css             # Tailwind v4 import & theme config variables
├── auth/                 # Session helper scripts (token/school cookies)
├── components/
│   ├── ui/               # shadcn/ui primitives (DO NOT edit directly)
│   └── form/             # Custom inputs with Zod validation bindings
├── hooks/                # Global hook helpers (useAction, usePermissions)
├── http/                 # Domain API calls via Ky client instance
└── pages/
    ├── _layouts/         # Layout wrappers (global, app, auth)
    └── app/              # Router screens grouped by folder (index.tsx + actions.ts)
```

### Layout Nesting Model
React Router `<Outlet />` wraps views inside nested layouts:
1. **`GlobalLayout`**: Synchronizes tokens and boots the date helper (Day.js).
2. **`AppLayout`**: Verifies login context. Implements the header nav.
3. **`AuthLayout`**: Redirects to home if already authenticated. Centers login forms.

---

## 3. Styling & Typography Guidelines

To maintain visual cohesion, enforce these two absolute design rules:

### Rule 1 — Button Icon Spacing Policy
**NEVER** manually add margin utility classes (such as `mr-*` or `ml-*`) directly to icon components rendered inside buttons.
- ❌ **Forbidden**: `<Button><Plus className="mr-2 size-4" /> Novo</Button>`
- ✅ **Correct**: `<Button><Plus className="size-4" /> Novo</Button>` (spacing is governed natively by the button layout/CSS).

### Rule 2 — Typography Policy (No Italic Text)
Italic text is **NOT** part of the visual language of Ecokids.
- **Forbidden**: Do not use the `italic` Tailwind utility, `font-style: italic` styling, or `<em>` HTML tags anywhere in the code.
- **Enforcement**: All labels, messages, and texts must use standard/normal typography weights (medium, semibold, bold).

---

## 4. Playful Custom Toast Notification System (`@ecokids/ui`)

The project uses a custom, gamified, child-friendly toast system designed to look tactile and interactive (bouncy checkmark icons, Duolingo-style solid color 3D shadows, and big rounded borders).

### Store API (`toast-store.ts`)
Dispatched imperatively from anywhere (React views, custom hooks, or background `actions.ts` files):

```typescript
import { toast } from '@ecokids/ui'

// Simple default
toast('Bem-vindo!')

// Success
toast.success('Aluno cadastrado com sucesso!')

// Error with description
toast.error('Erro ao cadastrar', {
  description: 'Verifique a conexão de rede e tente novamente.'
})

// Warning
toast.warning('Pontuação máxima alcançada.')

// Info
toast.info('Ciclo de pontuação encerrado.')

// Loading with Dynamic Update
const id = toast.loading('Salvando prêmio...')
setTimeout(() => {
  toast.update(id, {
    type: 'success',
    message: 'Salvo com sucesso!',
    duration: 3000
  })
}, 2000)

// Manual Dismissal
toast.dismiss(id)
```

### Option Settings
Passed as the secondary argument object:
- `description`: Secondary sub-text below the title.
- `duration`: Auto-dismiss timeout in ms (default is 4000; loading is Infinity).
- `closable`: Renders a manual X close button (default is true).
- `pauseOnHover`: Pauses the progress timeline when hovered (default is true).

---

## 5. Client-Side Pagination & Search

Synchronizes page indexing, text searching, and filter state with TanStack Query.

### Query State Controllers
Define the current index and search state inside the page component:

```typescript
const [page, setPage] = useState(1)
const [search, setSearch] = useState('')
const [appliedSearch, setAppliedSearch] = useState('')

// TanStack Query cache incorporates search and index variables
const { data, isLoading } = useQuery({
  queryKey: ['schools', schoolSlug, 'students', { page, search: appliedSearch }],
  queryFn: () => getStudents({
    params: { schoolSlug: schoolSlug! },
    query: { page, limit: 10, search: appliedSearch || undefined }
  }),
  placeholderData: keepPreviousData, // Avoids UI layout flicker during queries
})

function handleSearch(e: React.FormEvent) {
  e.preventDefault()
  setAppliedSearch(search)
  setPage(1) // Always reset page index back to 1 on a new search filter
}
```

### Pagination Interface Mount
Render `<Pagination />` from `@/components/pagination` when pages exist:
```tsx
{data?.meta && data.meta.pageCount > 1 && (
  <Pagination
    page={page}
    limit={data.meta.limit}
    totalCount={data.meta.totalCount}
    pageCount={data.meta.pageCount}
    onPageChange={setPage}
  />
)}
```

---

## 6. Frontend CASL Authorization

Protects the interface by hiding elements or routes from unauthorized users (e.g. `MEMBER` role users).

### Hook Verification
Use `usePermissions()` to verify CASL rules inside components:
```typescript
const { permissions, isLoading } = usePermissions()
const canCreateItem = permissions?.can('create', 'Item')

return (
  <>
    {canCreateItem && <Button>Novo Item</Button>}
  </>
)
```

### Route Guard Component (`PermissionGuard`)
Intercepts URL entry points in the router mapping ([`routes.tsx`](file:///Users/natanfoleto/Desktop/github/ecokids/apps/manager/src/routes.tsx)):
```tsx
{
  path: '/school/:slug/items',
  element: (
    <PermissionGuard action="get" subject="Item">
      <Items />
    </PermissionGuard>
  )
}
```
If the role permissions check fails, it blocks render and outputs a formatted "Acesso Proibido" warning.
