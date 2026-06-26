import { useCallback, useEffect, useState } from 'react'

import { useAudioContext } from './audio-provider'
import { type AudioPreferences, audioStore } from './audio-store'

/**
 * useAudio — Main hook for the Ecokids audio system.
 *
 * Provides imperative methods to play sounds/music and reactive
 * state for UI controls (volume slider, mute button).
 *
 * @example
 * const { playSound, setVolume, isMuted, mute } = useAudio()
 * playSound('click')
 * playMusic('background')
 */
export function useAudio() {
  const { manager } = useAudioContext()
  const [prefs, setPrefs] = useState<AudioPreferences>(() =>
    audioStore.getState(),
  )

  useEffect(() => {
    const unsub = audioStore.subscribe(setPrefs)
    return unsub
  }, [])

  const playSound = useCallback(
    (key: string, onEnded?: () => void) => {
      manager.playSound(key, onEnded)
    },
    [manager],
  )

  const playMusic = useCallback(
    (key: string) => {
      manager.playMusic(key)
    },
    [manager],
  )

  const pauseMusic = useCallback(
    (key?: string) => {
      manager.pauseMusic(key)
    },
    [manager],
  )

  const resumeMusic = useCallback(() => {
    manager.resumeMusic()
  }, [manager])

  const mute = useCallback(() => {
    audioStore.setMuted(true)
  }, [])

  const unmute = useCallback(() => {
    audioStore.setMuted(false)
  }, [])

  const toggleMute = useCallback(() => {
    audioStore.toggleMute()
  }, [])

  const setVolume = useCallback((value: number) => {
    audioStore.setVolume(value)
  }, [])

  const setMusicVolume = useCallback((value: number) => {
    audioStore.setMusicVolume(value)
  }, [])

  const setSfxVolume = useCallback((value: number) => {
    audioStore.setSfxVolume(value)
  }, [])

  return {
    // Playback
    playSound,
    playMusic,
    pauseMusic,
    resumeMusic,

    // Volume control
    setVolume,
    setMusicVolume,
    setSfxVolume,

    // Mute control
    mute,
    unmute,
    toggleMute,

    // State (for UI)
    isMuted: prefs.muted,
    volume: prefs.volume,
    musicVolume: prefs.musicVolume,
    sfxVolume: prefs.sfxVolume,
  }
}
