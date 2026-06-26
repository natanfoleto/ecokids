import { useAudio, useClickSound } from '@ecokids/ui'
import { Volume2, VolumeX } from 'lucide-react'
import { useState } from 'react'

import logo from '@/assets/logo.svg'

export function HeaderPage() {
  const { isMuted, volume, toggleMute, setVolume } = useAudio()
  const { onClick: playClick } = useClickSound()
  const [showSlider, setShowSlider] = useState(false)

  return (
    <div className="bg-gradient-to-r from-emerald-400 to-teal-500 shadow-md">
      <div className="relative flex items-center justify-center p-4">
        {/* Center — Logo */}
        <img src={logo} alt="Logo" className="h-16 drop-shadow-sm" />

        {/* Right — Audio Controls */}
        <div
          className="absolute right-4 top-[30px] z-50 flex flex-col items-center gap-1"
          onMouseEnter={() => setShowSlider(true)}
          onMouseLeave={() => setShowSlider(false)}
        >
          {/* Mute toggle */}
          <button
            type="button"
            onClick={() => {
              playClick()
              toggleMute()
            }}
            aria-label={isMuted ? 'Ativar som' : 'Silenciar'}
            className={`flex size-9 items-center justify-center rounded-xl transition-all active:scale-95 ${
              isMuted
                ? 'bg-red-100 text-red-500 hover:bg-red-200'
                : 'bg-white/20 text-white backdrop-blur-sm hover:bg-white/30'
            }`}
          >
            {isMuted ? (
              <VolumeX className="size-4" />
            ) : (
              <Volume2 className="size-4" />
            )}
          </button>

          {/* Volume slider — shown on hover */}
          {showSlider && (
            <div className="mt-1 flex w-8 flex-col items-center gap-1 rounded-xl bg-white/20 py-2 backdrop-blur-sm">
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="h-16 cursor-pointer accent-white"
                style={{
                  WebkitAppearance: 'slider-vertical',
                  writingMode: 'vertical-lr',
                  direction: 'rtl',
                }}
                aria-label="Volume"
              />
              <span className="text-[10px] font-semibold text-white">
                {volume}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
