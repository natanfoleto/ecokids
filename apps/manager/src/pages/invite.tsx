import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import Cookies from 'js-cookie'
import { CheckCircle, Loader2, LogIn, LogOut } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { isAuthenticated, signOut } from '@/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useUserProfile } from '@/hooks/use-user-profile'
import { acceptInvite } from '@/http/invites/accept-invite'
import { getInvite } from '@/http/invites/get-invite'
import { getInitialsName } from '@/utils/get-initials-name'

export function Invite() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { user } = useUserProfile()

  const { data, isLoading } = useQuery({
    queryKey: ['invite', id],
    queryFn: () => getInvite({ params: { inviteId: id! } }),
    enabled: !!id,
  })

  const invite = data?.invite

  const userIsAuthenticated = isAuthenticated()

  let currentUserEmail = null

  if (userIsAuthenticated) currentUserEmail = user?.email

  const userIsAuthenticatedWithSameEmail =
    invite && currentUserEmail === invite.email

  async function enterByInvitation() {
    Cookies.set(`inviteId`, id!)

    navigate(`/sign-in?email=${invite?.email}`)
  }

  async function acceptInviteAction() {
    await acceptInvite({
      params: {
        inviteId: id!,
      },
    })

    navigate('/')
  }

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    )

  return (
    <div className="flex w-full flex-col items-center justify-center p-16">
      {invite ? (
        <div className="flex w-full max-w-sm flex-col items-center space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="size-16">
              {invite.author?.avatarUrl && (
                <AvatarImage src={invite.author.avatarUrl} />
              )}

              {invite.author?.name && (
                <AvatarFallback>
                  {getInitialsName(invite.author.name)}
                </AvatarFallback>
              )}
            </Avatar>

            <p className="text-muted-foreground text-balance text-center leading-relaxed">
              <span className="text-foreground font-medium">
                {invite.author?.name ?? 'Alguém'}
              </span>{' '}
              convidou você para participar de{' '}
              <span className="text-foreground font-medium">
                {invite.school.name}
              </span>
              .{' '}
              <span className="text-xs">
                {dayjs(invite.createdAt).fromNow()}
              </span>
            </p>
          </div>

          <Separator />

          {!userIsAuthenticated && (
            <form action={enterByInvitation}>
              <Button
                type="submit"
                variant="secondary"
                className="cursor-pointer"
              >
                <LogIn className="mr-2 size-4" />
                Entrar para aceitar o convite
              </Button>
            </form>
          )}

          {userIsAuthenticatedWithSameEmail && (
            <form action={acceptInviteAction}>
              <Button
                type="submit"
                variant="secondary"
                className="cursor-pointer"
              >
                <CheckCircle className="mr-2 size-4" />
                Entrar em {invite.school.name}
              </Button>
            </form>
          )}

          {userIsAuthenticated && !userIsAuthenticatedWithSameEmail && (
            <div className="space-y-4">
              <p className="text-muted-foreground text-balance text-center leading-relaxed">
                Este convite foi enviado para{' '}
                <span className="text-muted-foreground font-medium">
                  {invite.email}
                </span>
                , porém você está autenticado com{' '}
                <span className="text-muted-foreground font-medium">
                  {currentUserEmail}.
                </span>
              </p>

              <div className="space-y-2">
                <Button
                  className="w-full cursor-pointer"
                  variant="secondary"
                  onClick={() => signOut(navigate)}
                >
                  <LogOut className="mr-2 size-4" />
                  Deslogar de {currentUserEmail}
                </Button>

                <Button className="w-full" variant="outline" asChild>
                  <Link to="/">Voltar para o dashboard</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="space-y-1 text-center">
            <h1 className="font-medium">O convite não foi encontrado!</h1>
            <p className="text-muted-foreground text-sm">
              Este convite pode ter sido aceito, recusado ou não está mais
              disponível.
            </p>
          </div>

          <Button className="w-full" variant="link" asChild>
            <Link to="/">Voltar para o inicio</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
