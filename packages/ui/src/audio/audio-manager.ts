/**
 * AudioManager — Ecokids Global Audio System
 *
 * Manages all audio playback via:
 * - HTMLAudioElement for music tracks (loop, streaming)
 * - AudioContext + AudioBuffer for low-latency SFX clicks
 *
 * Handles mobile/tablet autoplay restrictions by resuming
 * AudioContext only after the first user interaction.
 */

export type AudioCategory = 'music' | 'sfx'

export interface SoundDefinition {
  key: string
  src: string
  category: AudioCategory
  loop?: boolean
  volume?: number
}

export interface AudioManagerOptions {
  sounds: SoundDefinition[]
  onFirstInteraction?: () => void
}

interface TrackState {
  element: HTMLAudioElement
  definition: SoundDefinition
  fadeIntervalId?: ReturnType<typeof setInterval>
}

const FADE_DURATION_MS = 400

export class AudioManager {
  private tracks = new Map<string, TrackState>()
  private audioContext: AudioContext | null = null
  private sfxBuffers = new Map<string, AudioBuffer>()
  private activeMusic: string | null = null
  private pendingMusicKey: string | null = null // tracks music that was blocked by autoplay
  private isMuted = false
  private globalVolume = 0.5
  private musicVolume = 0.8
  private sfxVolume = 1.0
  private interactionListenerAdded = false
  private onFirstInteraction?: () => void
  private isInteracted = false

  constructor(options: AudioManagerOptions) {
    this.onFirstInteraction = options.onFirstInteraction
    this.registerSounds(options.sounds)
    this.addInteractionListeners()
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Registration & Loading
  // ─────────────────────────────────────────────────────────────────────────

  private registerSounds(sounds: SoundDefinition[]) {
    for (const def of sounds) {
      if (def.category === 'music') {
        const el = new Audio(def.src)
        el.loop = def.loop ?? false
        el.preload = 'auto'
        el.volume = 0
        this.tracks.set(def.key, { element: el, definition: def })
      }
    }

    // SFX: create HTMLAudioElement with src for immediate fallback playback
    // while the AudioContext buffer loads asynchronously after first interaction
    for (const def of sounds) {
      if (def.category === 'sfx') {
        const el = new Audio(def.src)
        el.preload = 'auto'
        this.tracks.set(def.key, { element: el, definition: def })
      }
    }
  }

  private async loadSfxBuffers() {
    if (!this.audioContext) return

    const sfxDefs = [...this.tracks.values()].filter(
      (t) => t.definition.category === 'sfx',
    )

    await Promise.all(
      sfxDefs.map(async (track) => {
        if (this.sfxBuffers.has(track.definition.key)) return
        try {
          const response = await fetch(track.definition.src)
          const arrayBuffer = await response.arrayBuffer()
          const audioBuffer =
            await this.audioContext!.decodeAudioData(arrayBuffer)
          this.sfxBuffers.set(track.definition.key, audioBuffer)
        } catch {
          // Silently fail — audio is enhancement, not critical
        }
      }),
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Autoplay / Interaction Handling
  // ─────────────────────────────────────────────────────────────────────────

  private interactionHandler = () => {
    if (this.isInteracted) return
    this.isInteracted = true
    this.resumeAudioContext()
    this.removeInteractionListeners()
  }

  private addInteractionListeners() {
    if (this.interactionListenerAdded) return
    this.interactionListenerAdded = true

    document.addEventListener('click', this.interactionHandler, true)
    document.addEventListener('touchstart', this.interactionHandler, true)
    document.addEventListener('keydown', this.interactionHandler, true)
  }

  private removeInteractionListeners() {
    document.removeEventListener('click', this.interactionHandler, true)
    document.removeEventListener('touchstart', this.interactionHandler, true)
    document.removeEventListener('keydown', this.interactionHandler, true)
  }

  private async resumeAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new AudioContext()
    }

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
    }

    await this.loadSfxBuffers()
    this.onFirstInteraction?.()

    // Retry any music that was blocked by autoplay policy before first interaction
    if (this.pendingMusicKey && !this.isMuted) {
      const key = this.pendingMusicKey
      this.pendingMusicKey = null
      this.playMusic(key)
    } else if (this.activeMusic && !this.isMuted) {
      this.playMusic(this.activeMusic)
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Music Playback
  // ─────────────────────────────────────────────────────────────────────────

  playMusic(key: string) {
    const track = this.tracks.get(key)
    if (!track || track.definition.category !== 'music') return

    // If it is already playing AND there is no fade interval running, do nothing
    if (
      this.activeMusic === key &&
      !track.element.paused &&
      !track.fadeIntervalId
    )
      return

    // Fade out any currently playing music
    if (this.activeMusic && this.activeMusic !== key) {
      this.fadeOut(this.activeMusic)
    }

    this.activeMusic = key

    if (this.isMuted) return

    const targetVolume = this.computeVolume(track.definition)
    track.element
      .play()
      .then(() => {
        // Playback started — clear any pending retry
        this.pendingMusicKey = null
        this.fadeIn(key, targetVolume)
      })
      .catch(() => {
        // Autoplay blocked — mark as pending to retry on first user interaction
        this.pendingMusicKey = key
      })
  }

  pauseMusic(key?: string) {
    const targetKey = key ?? this.activeMusic
    if (!targetKey) return
    const track = this.tracks.get(targetKey)
    if (!track || track.element.paused) return

    this.fadeOut(targetKey, () => {
      track.element.pause()
    })
  }

  resumeMusic() {
    if (!this.activeMusic) return
    this.playMusic(this.activeMusic)
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SFX Playback
  // ─────────────────────────────────────────────────────────────────────────

  playSound(key: string, onEnded?: () => void) {
    if (this.isMuted) {
      onEnded?.()
      return
    }

    const buffer = this.sfxBuffers.get(key)
    if (!buffer || !this.audioContext) {
      // Fall back to HTMLAudioElement for immediate playback before buffers load
      this.playFallback(key, onEnded)
      return
    }

    const source = this.audioContext.createBufferSource()
    source.buffer = buffer

    const gainNode = this.audioContext.createGain()
    const track = this.tracks.get(key)
    gainNode.gain.value = this.computeVolume(track?.definition)

    source.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    if (onEnded) {
      source.onended = onEnded
    }
    source.start(0)
  }

  private playFallback(key: string, onEnded?: () => void) {
    const track = this.tracks.get(key)
    if (!track) {
      onEnded?.()
      return
    }

    // Create a new instance so concurrent plays don't interfere
    const audio = new Audio(track.definition.src)
    audio.volume = this.isMuted ? 0 : this.computeVolume(track.definition)
    if (onEnded) {
      audio.addEventListener('ended', onEnded, { once: true })
    }
    audio.play().catch(() => {
      onEnded?.()
    })
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Volume & Mute
  // ─────────────────────────────────────────────────────────────────────────

  setGlobalVolume(value: number) {
    this.globalVolume = Math.max(0, Math.min(1, value))
    this.applyVolumes()
  }

  setMusicVolume(value: number) {
    this.musicVolume = Math.max(0, Math.min(1, value))
    this.applyVolumes()
  }

  setSfxVolume(value: number) {
    this.sfxVolume = Math.max(0, Math.min(1, value))
  }

  mute() {
    this.isMuted = true
    this.applyVolumes()
  }

  unmute() {
    this.isMuted = false
    this.applyVolumes()
  }

  getMuted() {
    return this.isMuted
  }

  getGlobalVolume() {
    return this.globalVolume
  }

  getMusicVolume() {
    return this.musicVolume
  }

  getSfxVolume() {
    return this.sfxVolume
  }

  private computeVolume(definition?: SoundDefinition) {
    if (!definition) return 0
    const categoryMultiplier =
      definition.category === 'music' ? this.musicVolume : this.sfxVolume
    return this.globalVolume * categoryMultiplier * (definition.volume ?? 1)
  }

  private applyVolumes() {
    for (const [, track] of this.tracks) {
      if (track.definition.category === 'music') {
        const vol = this.isMuted ? 0 : this.computeVolume(track.definition)
        track.element.volume = vol
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Fade Utilities
  // ─────────────────────────────────────────────────────────────────────────

  private fadeIn(key: string, targetVolume: number) {
    const track = this.tracks.get(key)
    if (!track) return

    if (track.fadeIntervalId) {
      clearInterval(track.fadeIntervalId)
    }

    const el = track.element
    el.volume = 0
    const steps = 20
    const interval = FADE_DURATION_MS / steps
    const step = targetVolume / steps
    let current = 0

    track.fadeIntervalId = setInterval(() => {
      current += step
      el.volume = Math.min(current, targetVolume)
      if (current >= targetVolume) {
        clearInterval(track.fadeIntervalId)
        track.fadeIntervalId = undefined
      }
    }, interval)
  }

  private fadeOut(key: string, onComplete?: () => void) {
    const track = this.tracks.get(key)
    if (!track) {
      onComplete?.()
      return
    }

    if (track.fadeIntervalId) {
      clearInterval(track.fadeIntervalId)
    }

    const el = track.element
    const startVolume = el.volume
    const steps = 20
    const interval = FADE_DURATION_MS / steps
    const step = startVolume / steps
    let current = startVolume

    track.fadeIntervalId = setInterval(() => {
      current -= step
      el.volume = Math.max(current, 0)
      if (current <= 0) {
        clearInterval(track.fadeIntervalId)
        track.fadeIntervalId = undefined
        onComplete?.()
      }
    }, interval)
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Cleanup
  // ─────────────────────────────────────────────────────────────────────────

  destroy() {
    this.removeInteractionListeners()
    for (const [, track] of this.tracks) {
      if (track.fadeIntervalId) {
        clearInterval(track.fadeIntervalId)
      }
      track.element.pause()
      track.element.src = ''
    }
    this.tracks.clear()
    this.sfxBuffers.clear()
    this.pendingMusicKey = null
    this.activeMusic = null
    this.audioContext?.close().catch(() => {})
    this.audioContext = null
  }
}
