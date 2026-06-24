import { useCallback, useRef } from 'react'

interface UseHoldButtonOptions {
  onSingleClick: () => void
  onHoldTick: () => void
  holdDelay?: number
  holdInterval?: number
}

interface UseHoldButtonResult {
  onMouseDown: () => void
  onMouseUp: () => void
  onMouseLeave: () => void
  onTouchStart: () => void
  onTouchEnd: () => void
  onTouchCancel: () => void
}

export function useHoldButton({
  onSingleClick,
  onHoldTick,
  holdDelay = 400,
  holdInterval = 150,
}: UseHoldButtonOptions): UseHoldButtonResult {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isHoldingRef = useRef(false)

  const clear = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    isHoldingRef.current = false

    timeoutRef.current = setTimeout(() => {
      isHoldingRef.current = true

      intervalRef.current = setInterval(() => {
        onHoldTick()
      }, holdInterval)
    }, holdDelay)
  }, [onHoldTick, holdDelay, holdInterval])

  const stop = useCallback(() => {
    if (!isHoldingRef.current) {
      onSingleClick()
    }

    clear()
    isHoldingRef.current = false
  }, [onSingleClick, clear])

  const cancel = useCallback(() => {
    clear()
    isHoldingRef.current = false
  }, [clear])

  return {
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: cancel,
    onTouchStart: start,
    onTouchEnd: stop,
    onTouchCancel: cancel,
  }
}
