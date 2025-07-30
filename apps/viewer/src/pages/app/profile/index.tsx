import { Loader2, Power } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import mascoteSvg from '@/assets/mascote.svg'
import { signOut } from '@/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth'
import { getInitialsName } from '@/utils/get-initials-name'

export function Profile() {
  const { student } = useAuth()

  const navigate = useNavigate()

  if (!student)
    return (
      <div className="text-muted-foreground flex min-h-[calc(100vh-64px)] flex-col items-center justify-center gap-2">
        <Loader2 className="animate-spin" />
        Carregando dados do estudante
      </div>
    )

  return (
    <div className="flex flex-col items-center justify-between gap-6 p-4">
      <div className="flex flex-col items-center gap-3">
        <Avatar className="size-24">
          <AvatarImage src={mascoteSvg} alt="Mascote" className="bg-muted" />
          <AvatarFallback>{getInitialsName(student.name)}</AvatarFallback>
        </Avatar>

        <div className="text-center">
          <h1 className="font-medium">{student.name}</h1>
          <p className="text-muted-foreground text-sm">{student.email}</p>
        </div>
      </div>

      <div className="w-full space-y-3">
        <div className="bg-muted space-y-2 rounded-md p-3 text-xs">
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
          className="w-full"
        >
          <Power className="size-5" />
        </Button>
      </div>
    </div>
  )
}
