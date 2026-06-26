/**
 * Scorer audio configuration
 *
 * Register all sounds used in the scorer app here.
 * To add a new sound in the future:
 *   1. Add the MP3 to src/assets/audio/
 *   2. Import it below
 *   3. Add a new SoundDefinition entry
 */

import type { SoundDefinition } from '@ecokids/ui'

import clickSrc from '@/assets/audio/click.mp3'
import musicSrc from '@/assets/audio/music.mp3'
import successSrc from '@/assets/audio/success.mp3'

export const scorerSounds: SoundDefinition[] = [
  {
    key: 'background',
    src: musicSrc,
    category: 'music',
    loop: true,
    volume: 0.35,
  },
  {
    key: 'success',
    src: successSrc,
    category: 'sfx',
    volume: 1,
  },
  {
    key: 'click',
    src: clickSrc,
    category: 'sfx',
    volume: 1,
  },
]
