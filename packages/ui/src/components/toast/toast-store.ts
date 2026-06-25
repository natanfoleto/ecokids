export type ToastType =
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'loading'
  | 'default'

export interface ToastOptions {
  id?: string
  type?: ToastType
  duration?: number // duration in ms, 0/Infinity means no auto-close
  closable?: boolean
  pauseOnHover?: boolean
  description?: string
}

export interface ToastActive {
  id: string
  message: string
  type: ToastType
  duration: number
  closable: boolean
  pauseOnHover: boolean
  description?: string
  createdAt: number
}

type Listener = (toasts: ToastActive[]) => void

class ToastStore {
  private toasts: ToastActive[] = []
  private listeners: Set<Listener> = new Set()
  private maxVisible = 3

  subscribe(listener: Listener) {
    this.listeners.add(listener)
    listener(this.toasts)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private notify() {
    const activeToasts = [...this.toasts]
    this.listeners.forEach((listener) => listener(activeToasts))
  }

  setMaxVisible(max: number) {
    this.maxVisible = max
    if (this.toasts.length > this.maxVisible) {
      this.toasts = this.toasts.slice(-this.maxVisible)
      this.notify()
    }
  }

  add(message: string | null | undefined, options?: ToastOptions): string {
    const id = options?.id || Math.random().toString(36).substring(2, 9)
    const type = options?.type || 'default'
    const duration = options?.duration !== undefined ? options.duration : 4000
    const closable = options?.closable !== undefined ? options.closable : true
    const pauseOnHover =
      options?.pauseOnHover !== undefined ? options.pauseOnHover : true
    const description = options?.description
    const msg = message || ''

    const existingIndex = this.toasts.findIndex((t) => t.id === id)
    if (existingIndex > -1) {
      // Update existing toast
      this.toasts[existingIndex] = {
        ...this.toasts[existingIndex],
        message: msg,
        type,
        duration,
        closable,
        pauseOnHover,
        description,
      }
    } else {
      // Add new toast
      const newToast: ToastActive = {
        id,
        message: msg,
        type,
        duration,
        closable,
        pauseOnHover,
        description,
        createdAt: Date.now(),
      }

      this.toasts = [...this.toasts, newToast]
      if (this.toasts.length > this.maxVisible) {
        // Remove the oldest toast
        this.toasts = this.toasts.slice(-this.maxVisible)
      }
    }

    this.notify()
    return id
  }

  update(id: string, options: Partial<Omit<ToastActive, 'id'>>) {
    this.toasts = this.toasts.map((t) =>
      t.id === id ? { ...t, ...options } : t,
    )
    this.notify()
  }

  dismiss(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id)
    this.notify()
  }

  clear() {
    this.toasts = []
    this.notify()
  }

  getToasts() {
    return this.toasts
  }
}

export const toastStore = new ToastStore()

// Helper API
export const toast = (
  message: string | null | undefined,
  options?: ToastOptions,
) => {
  return toastStore.add(message, options)
}

toast.success = (
  message: string | null | undefined,
  options?: Omit<ToastOptions, 'type'>,
) => {
  return toastStore.add(message, { ...options, type: 'success' })
}

toast.error = (
  message: string | null | undefined,
  options?: Omit<ToastOptions, 'type'>,
) => {
  return toastStore.add(message, { ...options, type: 'error' })
}

toast.warning = (
  message: string | null | undefined,
  options?: Omit<ToastOptions, 'type'>,
) => {
  return toastStore.add(message, { ...options, type: 'warning' })
}

toast.info = (
  message: string | null | undefined,
  options?: Omit<ToastOptions, 'type'>,
) => {
  return toastStore.add(message, { ...options, type: 'info' })
}

toast.loading = (
  message: string | null | undefined,
  options?: Omit<ToastOptions, 'type'>,
) => {
  return toastStore.add(message, {
    ...options,
    type: 'loading',
    duration: options?.duration !== undefined ? options.duration : 0, // 0 means infinity by default for loading
  })
}

toast.dismiss = (id: string) => {
  toastStore.dismiss(id)
}

toast.update = (
  id: string,
  options: {
    type?: ToastType
    message?: string
    duration?: number
    closable?: boolean
    pauseOnHover?: boolean
    description?: string
  },
) => {
  toastStore.update(id, options)
}
