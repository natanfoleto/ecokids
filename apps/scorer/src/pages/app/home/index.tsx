import { useAudio } from '@ecokids/ui'
import { Leaf } from 'lucide-react'
import { useEffect } from 'react'

import { useMetadata } from '@/hooks/use-metadata'

import { Logout } from './logout'
import { SchoolList } from './school-list'

export function Home() {
  useMetadata('Escolas - Ecokids')

  const { playMusic } = useAudio()

  useEffect(() => {
    playMusic('background')
  }, [playMusic])

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-between overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 p-8">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 size-96 rounded-full bg-teal-300/20 blur-3xl" />

      {/* Header — Logo + Branding */}
      <div className="flex w-full flex-col items-center gap-2 pt-4">
        <div className="flex items-center gap-3 rounded-2xl bg-white/15 px-6 py-3 backdrop-blur-sm">
          <div className="flex size-10 items-center justify-center rounded-xl bg-white/25">
            <Leaf className="size-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            Ecokids
          </span>
        </div>

        <div className="mt-4 space-y-1 text-center">
          <h1 className="text-3xl font-bold text-white drop-shadow-sm">
            Pontuador
          </h1>
          <p className="text-base font-medium text-emerald-100">
            Selecione a escola para começar a pontuar
          </p>
        </div>
      </div>

      {/* School list */}
      <div className="flex w-full flex-1 items-center justify-center py-6">
        <SchoolList />
      </div>

      {/* Footer — logout */}
      <div className="pb-4">
        <Logout />
      </div>
    </div>
  )
}
