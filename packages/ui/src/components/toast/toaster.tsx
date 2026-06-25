import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { ToastItem } from './toast'
import { type ToastActive, toastStore } from './toast-store'

export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center'

interface ToasterProps {
  position?: ToastPosition
  maxVisible?: number
  theme?: string
  richColors?: boolean
}

// Inline CSS injector for standalone animations
const INLINE_CSS = `
@keyframes toast-enter {
  0% {
    transform: scale(0.9) translateY(12px);
    opacity: 0;
  }
  70% {
    transform: scale(1.03) translateY(-2px);
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}
`

export function Toaster({
  position = 'bottom-right',
  maxVisible = 3,
}: ToasterProps) {
  const [toasts, setToasts] = useState<ToastActive[]>([])

  useEffect(() => {
    toastStore.setMaxVisible(maxVisible)
    const unsubscribe = toastStore.subscribe(setToasts)
    return () => unsubscribe()
  }, [maxVisible])

  // Dynamically inject stylesheet on mount
  useEffect(() => {
    const styleId = 'ecokids-toast-styles'
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = INLINE_CSS
      document.head.appendChild(style)
    }
  }, [])

  if (toasts.length === 0) return null

  // Resolve container styles based on position
  const containerClasses = {
    'top-right': 'top-4 right-4 items-end',
    'top-left': 'top-4 left-4 items-start',
    'bottom-right': 'bottom-4 right-4 items-end',
    'bottom-left': 'bottom-4 left-4 items-start',
    'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
  }[position]

  const toasterDom = (
    <div
      className={`
        pointer-events-none fixed z-50 flex w-full max-w-sm flex-col gap-3.5 px-4 md:px-0
        ${containerClasses}
      `}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  )

  return createPortal(toasterDom, document.body)
}
