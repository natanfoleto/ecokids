import { AsyncLocalStorage } from 'node:async_hooks'

export interface RequestContextStore {
  actorId?: string | null
  actorType?: 'USER' | 'STUDENT' | 'SYSTEM'
  schoolId?: string | null
  ipAddress?: string | null
  userAgent?: string | null
}

export const requestContextStorage =
  new AsyncLocalStorage<RequestContextStore>()
