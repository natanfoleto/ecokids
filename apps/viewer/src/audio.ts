/**
 * Viewer audio configuration
 *
 * Register all sounds used in the viewer app here.
 * To add a new sound in the future:
 *   1. Add the MP3 to src/assets/audio/
 *   2. Import it below
 *   3. Add a new SoundDefinition entry
 */

import type { SoundDefinition } from '@ecokids/ui'

import clickSrc from '@/assets/audio/click.mp3'

export const viewerSounds: SoundDefinition[] = [
  {
    key: 'click',
    src: clickSrc,
    category: 'sfx',
    volume: 1,
  },
]
