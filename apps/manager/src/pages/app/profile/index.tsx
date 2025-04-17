import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useUserProfile } from '@/hooks/use-user-profile'
import { getInitialsName } from '@/utils/get-initials-name'

import { ProfileForm } from './profile-form'

export function Profile() {
  const { user } = useUserProfile()

  if (!user) return null

  return (
    <div className="grid w-full grid-cols-12 p-4">
      <div className="col-span-3 flex flex-col gap-4">
        <Avatar className="size-32">
          {user.avatarUrl && <AvatarImage src={user.avatarUrl} />}
          {user.name && (
            <AvatarFallback>{getInitialsName(user.name)}</AvatarFallback>
          )}
        </Avatar>

        <div className="space-y-0.5">
          <h1 className="font-medium">{user.name}</h1>
          <p className="text-muted-foreground text-xs">{user.email}</p>
        </div>
      </div>

      <div className="col-span-9 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Meus dados</CardTitle>
            <CardDescription>
              Atualize as informações do seu perfil
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ProfileForm />
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
            <ProfileForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
