import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react'

import { AudioManager, type SoundDefinition } from './audio-manager'
import { audioStore } from './audio-store'

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

export interface AudioContextValue {
  manager: AudioManager
}

const AudioCtx = createContext<AudioContextValue | null>(null)

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────

export interface AudioProviderProps {
  sounds: SoundDefinition[]
  children: ReactNode
}

function applyPrefs(mgr: AudioManager) {
  const prefs = audioStore.getState()
  mgr.setGlobalVolume(prefs.volume / 100)
  mgr.setMusicVolume(prefs.musicVolume / 100)
  mgr.setSfxVolume(prefs.sfxVolume / 100)
  if (prefs.muted) mgr.mute()
  else mgr.unmute()
}

export function AudioProvider({ sounds, children }: AudioProviderProps) {
  const managerRef = useRef<AudioManager | null>(null)

  const getManager = useCallback(() => {
    if (!managerRef.current) {
      managerRef.current = new AudioManager({
        sounds,
        onFirstInteraction: () => {
          if (managerRef.current) applyPrefs(managerRef.current)
        },
      })
      applyPrefs(managerRef.current)
    }
    return managerRef.current
  }, [sounds])

  // Ensure created on first render
  getManager()

  useEffect(() => {
    // If destroyed by cleanup, recreate on remount
    const mgr = getManager()

    const unsub = audioStore.subscribe((prefs) => {
      mgr.setGlobalVolume(prefs.volume / 100)
      mgr.setMusicVolume(prefs.musicVolume / 100)
      mgr.setSfxVolume(prefs.sfxVolume / 100)
      if (prefs.muted) mgr.mute()
      else mgr.unmute()
    })

    return () => {
      unsub()
      mgr.destroy()
      managerRef.current = null
    }
  }, [getManager])

  // A stable proxy wrapper that delegates to the current managerRef.current
  const proxyManager = useRef<AudioManager>({
    playSound: (key: string) => managerRef.current?.playSound(key),
    playMusic: (key: string) => managerRef.current?.playMusic(key),
    pauseMusic: (key?: string) => managerRef.current?.pauseMusic(key),
    resumeMusic: () => managerRef.current?.resumeMusic(),
    setGlobalVolume: (val: number) => managerRef.current?.setGlobalVolume(val),
    setMusicVolume: (val: number) => managerRef.current?.setMusicVolume(val),
    setSfxVolume: (val: number) => managerRef.current?.setSfxVolume(val),
    mute: () => managerRef.current?.mute(),
    unmute: () => managerRef.current?.unmute(),
    getMuted: () => managerRef.current?.getMuted() ?? false,
    getGlobalVolume: () => managerRef.current?.getGlobalVolume() ?? 0.5,
    getMusicVolume: () => managerRef.current?.getMusicVolume() ?? 0.8,
    getSfxVolume: () => managerRef.current?.getSfxVolume() ?? 1.0,
    destroy: () => managerRef.current?.destroy(),
  } as unknown as AudioManager).current

  return (
    <AudioCtx.Provider value={{ manager: proxyManager }}>
      {children}
    </AudioCtx.Provider>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal hook — used by use-audio and use-click-sound
// ─────────────────────────────────────────────────────────────────────────────

export function useAudioContext(): AudioContextValue {
  const ctx = useContext(AudioCtx)
  if (!ctx) {
    throw new Error('useAudioContext must be used inside <AudioProvider>')
  }
  return ctx
}
