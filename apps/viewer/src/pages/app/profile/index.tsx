import { Power } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import mascoteSvg from '@/assets/mascote.svg'
import { signOut } from '@/auth'
import { LoadingPage } from '@/components/loading-page'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth'
import { useMetadata } from '@/hooks/use-metadata'
import { getInitialsName } from '@/utils/get-initials-name'

export function Profile() {
  useMetadata('Ecokids - Perfil')

  const { student } = useAuth()

  const navigate = useNavigate()

  if (!student) return <LoadingPage message="Carregando dados do estudante" />

  return (
    <div className="flex min-h-screen flex-col items-center gap-6 p-4">
      <div className="bg-muted flex w-full items-center gap-3 space-y-2 rounded-xl border-t-4 border-emerald-400 p-3">
        <Avatar className="size-20 rounded-lg">
          <AvatarImage
            src={mascoteSvg}
            alt="Mascote"
            className="bg-background"
          />
          <AvatarFallback>{getInitialsName(student.name)}</AvatarFallback>
        </Avatar>

        <div>
          <h1 className="font-medium">{student.name}</h1>
          <p className="text-muted-foreground text-sm">{student.email}</p>
        </div>
      </div>

      <div className="w-full space-y-3">
        <div className="bg-muted space-y-2 rounded-xl border-t-4 border-emerald-400 p-3 text-xs">
          <div className="space-y-0.5">
            <p className="text-muted-foreground">Seu código</p>
            <p className="text-sm">#{student.code}</p>
          </div>

          {student.cpf && (
            <div className="space-y-0.5">
              <p className="text-muted-foreground">CPF</p>
              <p className="text-sm">{student.cpf}</p>
            </div>
          )}

          <div className="space-y-0.5">
            <p className="text-muted-foreground">Escola</p>
            <p className="text-sm">{student.school.name}</p>
          </div>

          <div className="space-y-0.5">
            <p className="text-muted-foreground">Classe</p>
            <p className="text-sm">
              {student.class.name} - {student.class.year}
            </p>
          </div>
        </div>

        <Button
          onClick={() => signOut(navigate)}
          variant="secondary"
          size="lg"
          className="w-full rounded-xl border-t-4 border-emerald-400"
        >
          <Power className="size-5" />
        </Button>
      </div>
    </div>
  )
}
