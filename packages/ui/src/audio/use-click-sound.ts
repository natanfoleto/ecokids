import { useCallback, useRef } from 'react'

import { useAudioContext } from './audio-provider'
import { audioStore } from './audio-store'

const DEBOUNCE_MS = 50

/**
 * useClickSound — Specialized hook for button click sounds.
 *
 * Returns an `onClick` handler that plays the 'click' sound with
 * debouncing to allow rapid sequential clicks without cutting off audio,
 * while preventing sound spam.
 *
 * @example
 * const { onClick } = useClickSound()
 * <button onClick={onClick}>Press me</button>
 *
 * // Compose with your own handler:
 * <button onClick={(e) => { onClick(e); myHandler() }}>Press me</button>
 */
export function useClickSound() {
  const { manager } = useAudioContext()
  const lastPlayedAt = useRef(0)

  const onClick = useCallback(() => {
    const prefs = audioStore.getState()
    if (prefs.muted) return

    const now = Date.now()
    if (now - lastPlayedAt.current < DEBOUNCE_MS) return
    lastPlayedAt.current = now

    manager.playSound('click')
  }, [manager])

  return { onClick }
}
