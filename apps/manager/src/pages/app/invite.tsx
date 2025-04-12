import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import Cookies from 'js-cookie'
import { CheckCircle, LogIn, LogOut } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { isAuthenticated, signOut } from '@/auth'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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

  const { data } = useQuery({
    queryKey: ['invite', id],
    queryFn: () => getInvite({ params: { inviteId: id! } }),
    enabled: !!id,
  })

  const userIsAuthenticated = isAuthenticated()

  let currentUserEmail = null

  if (userIsAuthenticated) {
    currentUserEmail = user?.email
  }

  const userIsAuthenticatedWithSameEmail =
    currentUserEmail === data?.invite?.email

  async function enterByInvitation() {
    Cookies.set(`inviteId`, id!)

    navigate(`/sign-in?email=${data?.invite?.email}`)
  }

  async function acceptInviteAction() {
    await acceptInvite({
      params: {
        inviteId: id!,
      },
    })

    navigate('/')
  }

  return (
    <div className="flex w-full flex-col items-center justify-center p-16">
      <div className="flex w-full max-w-sm flex-col items-center space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="size-16">
            {data?.invite?.author?.name && (
              <AvatarFallback>
                {getInitialsName(data.invite.author.name)}
              </AvatarFallback>
            )}
            <AvatarFallback />
          </Avatar>

          <p className="text-muted-foreground text-balance text-center leading-relaxed">
            <span className="text-foreground font-medium">
              {data?.invite?.author?.name ?? 'Alguém'}
            </span>{' '}
            convidou você para participar de{' '}
            <span className="text-foreground font-medium">
              {data?.invite?.school.name}
            </span>
            .{' '}
            <span className="text-xs">
              {dayjs(data?.invite?.createdAt).fromNow()}
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
              Entrar em {data?.invite.school.name}
            </Button>
          </form>
        )}

        {userIsAuthenticated && !userIsAuthenticatedWithSameEmail && (
          <div className="space-y-4">
            <p className="text-muted-foreground text-balance text-center leading-relaxed">
              Este convite foi enviado para{' '}
              <span className="text-muted-foreground font-medium">
                {data?.invite?.email}
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
    </div>
  )
}
