import { useAudio } from '@ecokids/ui'
import { Volume2, VolumeX } from 'lucide-react'
import { useState } from 'react'

/**
 * AudioControls — Floating audio control panel for the scorer app.
 *
 * Positioned fixed at the bottom-right corner, visible throughout
 * the entire kiosk flow without interfering with the main content.
 *
 * Features:
 * - Mute/unmute toggle with icon feedback
 * - Volume slider (0–100%)
 * - Expands on hover to reveal the slider
 */
export function AudioControls() {
  const { isMuted, volume, toggleMute, setVolume } = useAudio()
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col items-center gap-2"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Volume slider — shown on hover */}
      <div
        className={`flex flex-col items-center gap-1 transition-all duration-200 ${
          expanded ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="flex h-28 w-10 items-center justify-center rounded-2xl bg-white/90 shadow-lg shadow-black/10 backdrop-blur-sm">
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="h-20 cursor-pointer accent-emerald-500"
            style={{
              WebkitAppearance: 'slider-vertical',
              writingMode: 'vertical-lr',
              direction: 'rtl',
            }}
            aria-label="Volume"
          />
        </div>
        <span className="text-xs font-semibold text-gray-600">{volume}%</span>
      </div>

      {/* Mute toggle button */}
      <button
        type="button"
        onClick={toggleMute}
        aria-label={isMuted ? 'Ativar som' : 'Silenciar'}
        className={`flex size-12 items-center justify-center rounded-2xl shadow-lg shadow-black/10 backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95 ${
          isMuted
            ? 'bg-red-100 text-red-500 hover:bg-red-200'
            : 'bg-white/90 text-emerald-600 hover:bg-white'
        }`}
      >
        {isMuted ? (
          <VolumeX className="size-5" />
        ) : (
          <Volume2 className="size-5" />
        )}
      </button>
    </div>
  )
}
