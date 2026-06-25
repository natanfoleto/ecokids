import { AlertTriangle, Check, Info, Loader2, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { type ToastActive, toastStore } from './toast-store'

interface ToastItemProps {
  toast: ToastActive
}

export function ToastItem({ toast }: ToastItemProps) {
  const { id, message, type, duration, closable, pauseOnHover, description } =
    toast
  const [isHovered, setIsHovered] = useState(false)
  const [progress, setProgress] = useState(100)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  )
  const remainingTimeRef = useRef<number>(duration)
  const startTimeRef = useRef<number>(Date.now())

  useEffect(() => {
    if (duration <= 0 || duration === Infinity) return

    if (!isHovered) {
      startTimeRef.current = Date.now()

      timerRef.current = setTimeout(() => {
        toastStore.dismiss(id)
      }, remainingTimeRef.current)

      const intervalMs = 16 // ~60fps
      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current
        const left = Math.max(0, remainingTimeRef.current - elapsed)
        setProgress((left / duration) * 100)
      }, intervalMs)
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current)

      if (isHovered && duration > 0) {
        const elapsed = Date.now() - startTimeRef.current
        remainingTimeRef.current = Math.max(
          0,
          remainingTimeRef.current - elapsed,
        )
      }
    }
  }, [id, duration, isHovered])

  function handleDismiss() {
    toastStore.dismiss(id)
  }

  // Get icons and styles by type
  const config = {
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/20',
      border: 'border-emerald-500',
      text: 'text-emerald-900 dark:text-emerald-200',
      shadow: 'shadow-[0_4px_0_0_#10b981]',
      progressBg: 'bg-emerald-500',
      icon: (
        <div className="flex size-7 animate-bounce items-center justify-center rounded-full bg-emerald-500 text-white">
          <Check className="size-4 stroke-[3px]" />
        </div>
      ),
    },
    error: {
      bg: 'bg-rose-50 dark:bg-rose-950/20',
      border: 'border-rose-500',
      text: 'text-rose-900 dark:text-rose-200',
      shadow: 'shadow-[0_4px_0_0_#f43f5e]',
      progressBg: 'bg-rose-500',
      icon: (
        <div className="flex size-7 items-center justify-center rounded-full bg-rose-500 text-white">
          <X className="size-4 stroke-[3px]" />
        </div>
      ),
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-950/20',
      border: 'border-amber-500',
      text: 'text-amber-900 dark:text-amber-200',
      shadow: 'shadow-[0_4px_0_0_#f59e0b]',
      progressBg: 'bg-amber-500',
      icon: (
        <div className="flex size-7 items-center justify-center rounded-full bg-amber-500 text-white">
          <AlertTriangle className="size-4 stroke-[2.5px]" />
        </div>
      ),
    },
    info: {
      bg: 'bg-sky-50 dark:bg-sky-950/20',
      border: 'border-sky-500',
      text: 'text-sky-900 dark:text-sky-200',
      shadow: 'shadow-[0_4px_0_0_#0ea5e9]',
      progressBg: 'bg-sky-500',
      icon: (
        <div className="flex size-7 items-center justify-center rounded-full bg-sky-500 text-white">
          <Info className="size-4 stroke-[2.5px]" />
        </div>
      ),
    },
    loading: {
      bg: 'bg-zinc-50 dark:bg-zinc-900/40',
      border: 'border-zinc-400 dark:border-zinc-700',
      text: 'text-zinc-900 dark:text-zinc-200',
      shadow: 'shadow-[0_4px_0_0_#71717a]',
      progressBg: 'bg-zinc-500',
      icon: (
        <div className="flex size-7 items-center justify-center rounded-full bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
          <Loader2 className="size-4 animate-spin stroke-[3px]" />
        </div>
      ),
    },
    default: {
      bg: 'bg-zinc-50 dark:bg-zinc-900/40',
      border: 'border-zinc-400 dark:border-zinc-700',
      text: 'text-zinc-900 dark:text-zinc-200',
      shadow: 'shadow-[0_4px_0_0_#71717a]',
      progressBg: 'bg-zinc-500',
      icon: (
        <div className="flex size-7 items-center justify-center rounded-full bg-zinc-500 text-white">
          <Info className="size-4 stroke-[2.5px]" />
        </div>
      ),
    },
  }[type]

  return (
    <div
      onMouseEnter={() => pauseOnHover && setIsHovered(true)}
      onMouseLeave={() => pauseOnHover && setIsHovered(false)}
      className={`
        relative flex w-full max-w-sm flex-col overflow-hidden rounded-2xl border-2
        ${config.bg} ${config.border} ${config.text} ${config.shadow}
        pointer-events-auto select-none transition-all duration-300
        [animation:toast-enter_0.35s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]
      `}
      style={{
        transformOrigin: 'bottom center',
      }}
    >
      <div className="flex items-start gap-3.5 p-4 pr-10">
        <div className="mt-0.5 shrink-0">{config.icon}</div>
        <div className="font-primary flex flex-1 flex-col gap-0.5">
          <div className="text-sm font-semibold tracking-wide">{message}</div>
          {description && (
            <div className="text-xs font-normal opacity-80">{description}</div>
          )}
        </div>
      </div>

      {closable && (
        <button
          onClick={handleDismiss}
          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-full p-1 text-current opacity-60 transition-opacity hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/5"
          aria-label="Fechar notificação"
        >
          <X className="size-4" />
        </button>
      )}

      {/* Playful flat progress bar */}
      {duration > 0 && duration !== Infinity && (
        <div className="h-1.5 w-full bg-black/5 dark:bg-white/5">
          <div
            className={`h-full ${config.progressBg} transition-all duration-[16ms] ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}
