import dayjs from 'dayjs'
import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { signOut } from '@/auth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useUserProfile } from '@/hooks/use-user-profile'

import { AvatarForm } from './avatar-form'
import { PasswordForm } from './password-form'
import { ProfileForm } from './profile-form'

export function Profile() {
  const navigate = useNavigate()

  const { user } = useUserProfile()

  if (!user) return null

  return (
    <div className="grid w-full grid-cols-12 gap-8 py-4">
      <Card className="col-span-3">
        <CardContent className="flex h-full flex-col justify-between">
          <div className="space-y-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <AvatarForm initialData={user} />

              <div className="space-y-0.5">
                <h1 className="font-medium">{user.name}</h1>
                <p className="text-muted-foreground text-xs">{user.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-muted-foreground text-xs">
                <strong>CPF: </strong>
                {user.cpf}
              </p>

              <p className="text-muted-foreground text-xs">
                Usuário cadastrado em{' '}
                {dayjs(user.createdAt).format(
                  'DD [de] MMMM [de] YYYY[, às] hh:mm',
                )}
              </p>
            </div>

            <Separator />
          </div>

          <div className="flex justify-center">
            <Button
              onClick={() => signOut(navigate)}
              variant="destructive"
              className="cursor-pointer"
            >
              <LogOut className="size-4" />
              Sair
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="col-span-9 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Meus dados</CardTitle>
            <CardDescription>
              Atualize as informações do seu perfil
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ProfileForm initialData={user} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alteração de senha</CardTitle>
            <CardDescription>
              Informe a senha atual e nova senha abaixo
            </CardDescription>
          </CardHeader>

          <CardContent>
            <PasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
