# Custom Toast Notification System - Ecokids

This document describes the design, architecture, and API usage of the custom, gamified Toast Notification System built for the Ecokids platform.

---

## 1. Chosen Architecture

We chose **Opção C: Sistema imperativo integrado via event emitter**.

### Rationale:
1. **Context-Free Calling**: The platform registers asynchronous server operations inside `actions.ts` files (pure TS/JS files, e.g. `apps/manager/src/pages/app/profile/actions.ts`), which are outside React's context tree. An imperative API (like `toast.success()`) allows us to dispatch toast notifications directly from these action files without introducing complex prop-drilling or hook dependencies.
2. **React Integration**: The system registers a React-based `<Toaster />` component in each application root (`App.tsx`). This component subscribes to the imperative `toastStore` using an event-driven listener, synchronizing state additions, updates, and dismissals to trigger smooth React render lifecycles.
3. **Decoupled Business Logic**: Separation of concerns is preserved — the store handles state transitions, while the React components focus solely on animations, micro-interactions, timers, and styling.

---

## 2. File Structure

All toast code resides inside the shared `@ecokids/ui` package:

```text
packages/ui/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts                           # Global barrel export
    └── components/
        └── toast/
            ├── index.ts                   # Toast barrel export
            ├── toast-store.ts             # State container and helper APIs
            ├── toast.tsx                  # ToastItem rendering, animations, hover pause, & progress
            └── toaster.tsx                # Toaster container portal layout
```

---

## 3. Toast API

Import `toast` directly from the shared `@ecokids/ui` package:

```typescript
import { toast } from '@ecokids/ui'
```

### Examples of Usage:

```typescript
// Basic Default Toast
toast("Bem-vindo de volta!")

// Success Toast
toast.success("Turma criada com sucesso!")

// Error Toast with Description
toast.error("Ocorreu um erro", {
  description: "Verifique os dados informados e tente novamente."
})

// Warning Toast
toast.warning("Limite de pontos atingido para esta temporada.")

// Info Toast with custom duration
toast.info("A temporada de inverno encerra amanhã.", {
  duration: 6000
})

// Loading & Dynamic Update Flow
const toastId = toast.loading("Salvando alterações...")
try {
  await saveChanges()
  toast.update(toastId, {
    type: "success",
    message: "Alterações salvas com sucesso!",
    duration: 3000
  })
} catch (err) {
  toast.update(toastId, {
    type: "error",
    message: "Falha ao salvar",
    duration: 4000
  })
}

// Manual Dismissal
toast.dismiss(toastId)
```

---

## 4. Toast Types

The following types are supported:

| Type | Aesthetic | Icon | Auto-close Default |
|---|---|---|---|
| `success` | Emerald soft green background, thick borders, bouncy tactile feel | Checkmark | 4000ms |
| `error` | Rose soft red background, warning border, bold error emphasis | Cross / X | 4000ms |
| `warning` | Amber soft yellow background, warning emphasis | Alert Triangle | 4000ms |
| `info` | Sky soft blue background, neutral info borders | Info Circle | 4000ms |
| `loading` | Neutral background, spinning indicator | Loader 2 (spin) | None (Infinity) |
| `default` | Slate/zinc neutral | Info Circle | 4000ms |

---

## 5. Configurations & Options

Toast configurations are passed as an optional secondary object:

```typescript
toast.success("Mensagem", {
  duration: 3000,
  closable: true,
  pauseOnHover: true,
  description: "Sub-texto"
})
```

- **`duration`**: Time in milliseconds before the toast auto-closes. Passing `0` or `Infinity` prevents the toast from auto-closing (used automatically in `toast.loading`).
- **`closable`**: If `true`, renders a close icon on the top-right of the toast allowing the user to dismiss it manually.
- **`pauseOnHover`**: If `true`, hovering over the toast item pauses the auto-dismiss timer.
- **`description`**: Custom secondary text printed below the main message in a smaller font, top-aligning the status icon.

Toaster Container props in `App.tsx`:
- **`position`**: Anchor position. Supports `'top-right'`, `'top-left'`, `'bottom-right'`, `'bottom-left'`, `'top-center'`, and `'bottom-center'`.
- **`maxVisible`**: Maximum number of concurrent active notifications (default is `3`). Older toasts are automatically dismissed when the limit is exceeded.

---

## 6. Extensibility (Adding New Styles)

To add a new toast type (e.g. `security` or `achievement`):

1. **Extend Types**: Add your type to the `ToastType` union in [toast-store.ts](file:///Users/natanfoleto/Desktop/github/ecokids/packages/ui/src/components/toast/toast-store.ts):
   ```typescript
   export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading' | 'default' | 'achievement'
   ```
2. **Define Styles**: Add visual mappings for classes (background, border, text, custom shadow, and icons) inside the `config` object in [toast.tsx](file:///Users/natanfoleto/Desktop/github/ecokids/packages/ui/src/components/toast/toast.tsx):
   ```typescript
   achievement: {
     bg: 'bg-violet-50 dark:bg-violet-950/20',
     border: 'border-violet-500',
     text: 'text-violet-900',
     shadow: 'shadow-[0_4px_0_0_#8b5cf6]',
     progressBg: 'bg-violet-500',
     icon: <Trophy className="size-4" />
   }
   ```
3. **Expose Helper**: Expose the helper function in `toast` object exports:
   ```typescript
   toast.achievement = (message: string | null | undefined, options?: Omit<ToastOptions, 'type'>) => {
     return toastStore.add(message, { ...options, type: 'achievement' })
   }
   ```

---

## 7. Migration Details (Files Modified)

`sonner` library has been replaced and removed in the following files:

### Shared Packages Configured:
- Created package [packages/ui](file:///Users/natanfoleto/Desktop/github/ecokids/packages/ui/package.json) containing the custom Toast notification source code.
- Added `@ecokids/ui` to workspace dependencies.

### Apps Root Mounts:
- Removed `./components/ui/sonner.tsx` from `manager`, `scorer`, and `viewer`.
- Modified `App.tsx` inside all three frontend apps to render our custom `<Toaster />` from `@ecokids/ui` instead:
  - [manager/App.tsx](file:///Users/natanfoleto/Desktop/github/ecokids/apps/manager/src/App.tsx)
  - [scorer/App.tsx](file:///Users/natanfoleto/Desktop/github/ecokids/apps/scorer/src/App.tsx)
  - [viewer/App.tsx](file:///Users/natanfoleto/Desktop/github/ecokids/apps/viewer/src/App.tsx)

### Toast Usages Migrated:
- [scorer/sign-in/actions.ts](file:///Users/natanfoleto/Desktop/github/ecokids/apps/scorer/src/pages/auth/sign-in/actions.ts)
- [viewer/my-redemptions/index.tsx](file:///Users/natanfoleto/Desktop/github/ecokids/apps/viewer/src/pages/app/my-redemptions/index.tsx)
- [manager/sign-in/index.tsx](file:///Users/natanfoleto/Desktop/github/ecokids/apps/manager/src/pages/auth/sign-in/index.tsx)
- [manager/sign-up/index.tsx](file:///Users/natanfoleto/Desktop/github/ecokids/apps/manager/src/pages/auth/sign-up/index.tsx)
- [manager/profile/actions.ts](file:///Users/natanfoleto/Desktop/github/ecokids/apps/manager/src/pages/app/profile/actions.ts)
- [manager/school/items/actions.tsx](file:///Users/natanfoleto/Desktop/github/ecokids/apps/manager/src/pages/app/school/items/actions.tsx)
- [manager/school/members/actions.ts](file:///Users/natanfoleto/Desktop/github/ecokids/apps/manager/src/pages/app/school/members/actions.ts)
- [viewer/profile/actions.ts](file:///Users/natanfoleto/Desktop/github/ecokids/apps/viewer/src/pages/app/profile/actions.ts)
- [manager/school/actions.ts](file:///Users/natanfoleto/Desktop/github/ecokids/apps/manager/src/pages/app/school/actions.ts)
- [manager/school/settings/season-actions.ts](file:///Users/natanfoleto/Desktop/github/ecokids/apps/manager/src/pages/app/school/settings/season-actions.ts)
- [manager/school/settings/school-season-actions.ts](file:///Users/natanfoleto/Desktop/github/ecokids/apps/manager/src/pages/app/school/settings/school-season-actions.ts)
- [manager/school/redemptions/actions.ts](file:///Users/natanfoleto/Desktop/github/ecokids/apps/manager/src/pages/app/school/redemptions/actions.ts)
- [manager/school/classes/actions.ts](file:///Users/natanfoleto/Desktop/github/ecokids/apps/manager/src/pages/app/school/classes/actions.ts)
- [manager/school/awards/actions.tsx](file:///Users/natanfoleto/Desktop/github/ecokids/apps/manager/src/pages/app/school/awards/actions.tsx)
- [manager/school/index.tsx](file:///Users/natanfoleto/Desktop/github/ecokids/apps/manager/src/pages/app/school/index.tsx)
- [viewer/shop/item.tsx](file:///Users/natanfoleto/Desktop/github/ecokids/apps/viewer/src/pages/app/shop/item.tsx)
- [manager/school/students/actions.ts](file:///Users/natanfoleto/Desktop/github/ecokids/apps/manager/src/pages/app/school/students/actions.ts)
- [scorer/stepper/code-entry.tsx](file:///Users/natanfoleto/Desktop/github/ecokids/apps/scorer/src/pages/app/school/stepper/code-entry.tsx)
