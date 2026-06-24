import { Power } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import mascoteSvg from '@/assets/mascote.svg'
import { signOut } from '@/auth'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth'
import { useMetadata } from '@/hooks/use-metadata'

import { ProfileLoading } from './loading'

export function Profile() {
  useMetadata('Ecokids - Perfil')

  const { student } = useAuth()

  const navigate = useNavigate()

  if (!student) return <ProfileLoading />

  return (
    <div className="flex min-h-screen flex-col items-center gap-6 p-4">
      <div className="flex w-full flex-col items-center gap-4 rounded-3xl border-2 border-emerald-100 bg-white p-6 text-center shadow-sm shadow-emerald-50">
        <div className="flex size-24 items-center justify-center rounded-full border-4 border-emerald-100 bg-emerald-50 p-1 shadow-sm">
          <img
            src={mascoteSvg}
            alt="Mascote"
            className="size-full object-contain"
          />
        </div>

        <div>
          <h1 className="text-xl font-bold text-gray-800">{student.name}</h1>
          <p className="text-xs font-medium text-gray-400">
            {student.email || 'Estudante Ecokids'}
          </p>
        </div>
      </div>

      <div className="w-full space-y-4">
        <div className="w-full space-y-4 rounded-3xl border-2 border-emerald-100 bg-white p-5 text-xs font-semibold text-gray-700 shadow-sm shadow-emerald-50">
          <div className="flex items-center justify-between border-b border-gray-50 pb-2">
            <span className="text-gray-400">Código do Aluno</span>
            <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-0.5 text-sm font-bold text-emerald-700">
              #{student.code}
            </span>
          </div>

          {student.cpf && (
            <div className="flex items-center justify-between border-b border-gray-50 pb-2">
              <span className="text-gray-400">CPF</span>
              <span className="text-sm text-gray-700">{student.cpf}</span>
            </div>
          )}

          <div className="flex items-center justify-between border-b border-gray-50 pb-2">
            <span className="text-gray-400">Escola</span>
            <span className="max-w-[200px] truncate text-right text-sm text-gray-700">
              {student.school.name}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400">Turma</span>
            <span className="text-sm text-gray-700">
              {student.class.name} - {student.class.year}
            </span>
          </div>
        </div>

        <Button
          onClick={() => signOut(navigate)}
          variant="outline"
          className="flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-red-100 font-bold text-red-600 transition-all hover:bg-red-50 hover:text-red-700 active:scale-95"
        >
          <Power className="size-5" />
          Sair do Aplicativo
        </Button>
      </div>
    </div>
  )
}
