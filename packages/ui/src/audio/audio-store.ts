/**
 * AudioStore — Reactive preferences state (no external deps)
 *
 * Manages muted/volume state with localStorage persistence
 * and subscriber notification (pub/sub pattern).
 */

const STORAGE_KEY = 'ecokids:audio-preferences'

export interface AudioPreferences {
  muted: boolean
  volume: number // 0–100
  musicVolume: number // 0–100 (relative category multiplier)
  sfxVolume: number // 0–100 (relative category multiplier)
}

const DEFAULT_PREFERENCES: AudioPreferences = {
  muted: false,
  volume: 50,
  musicVolume: 40,
  sfxVolume: 100,
}

type Listener = (prefs: AudioPreferences) => void

function loadFromStorage(): AudioPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_PREFERENCES }
    const parsed = JSON.parse(raw) as Partial<AudioPreferences>
    return {
      muted: parsed.muted ?? DEFAULT_PREFERENCES.muted,
      volume: parsed.volume ?? DEFAULT_PREFERENCES.volume,
      musicVolume: parsed.musicVolume ?? DEFAULT_PREFERENCES.musicVolume,
      sfxVolume: parsed.sfxVolume ?? DEFAULT_PREFERENCES.sfxVolume,
    }
  } catch {
    return { ...DEFAULT_PREFERENCES }
  }
}

function saveToStorage(prefs: AudioPreferences) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
  } catch {
    // Storage unavailable — silently ignore
  }
}

class AudioStore {
  private prefs: AudioPreferences = loadFromStorage()
  private listeners = new Set<Listener>()

  getState(): AudioPreferences {
    return { ...this.prefs }
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notify() {
    for (const listener of this.listeners) {
      listener({ ...this.prefs })
    }
  }

  private commit(patch: Partial<AudioPreferences>) {
    this.prefs = { ...this.prefs, ...patch }
    saveToStorage(this.prefs)
    this.notify()
  }

  setMuted(muted: boolean) {
    this.commit({ muted })
  }

  toggleMute() {
    this.commit({ muted: !this.prefs.muted })
  }

  setVolume(volume: number) {
    this.commit({ volume: Math.max(0, Math.min(100, Math.round(volume))) })
  }

  setMusicVolume(value: number) {
    this.commit({ musicVolume: Math.max(0, Math.min(100, Math.round(value))) })
  }

  setSfxVolume(value: number) {
    this.commit({ sfxVolume: Math.max(0, Math.min(100, Math.round(value))) })
  }
}

export const audioStore = new AudioStore()
