import 'dayjs/locale/pt-br'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Check, UserPlus2, X } from 'lucide-react'
import { useState } from 'react'

import { getPendingInvites } from '@/http/invites/get-pending-invites'

import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { acceptInviteAction, rejectInviteAction } from './actions'

export function PendingInvites() {
  const queryClient = useQueryClient()

  const [isOpen, setIsOpen] = useState(false)

  const { data } = useQuery({
    queryKey: ['pending-invites'],
    queryFn: getPendingInvites,
  })

  async function handleAcceptInvite(inviteId: string) {
    await acceptInviteAction({ params: { inviteId } })

    queryClient.invalidateQueries({ queryKey: ['pending-invites'] })
  }

  async function handleRejectInvite(inviteId: string) {
    await rejectInviteAction({ params: { inviteId } })

    queryClient.invalidateQueries({ queryKey: ['pending-invites'] })
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="relative cursor-pointer">
          <Button size="icon" variant="ghost" className="cursor-pointer">
            <UserPlus2 className="size-4" />
            <span className="sr-only">Convites pendentes</span>
          </Button>

          {data?.invites.length ? (
            <div className="text-background absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-red-500 p-1.5 text-[10px] font-medium">
              {data.invites.length}
            </div>
          ) : null}
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-80 space-y-2">
        <span className="block text-sm font-medium">
          Convites pendentes ({data?.invites.length ?? 0})
        </span>

        {data?.invites.length === 0 && (
          <p className="text-muted-foreground text-sm">
            Nenhum convite encontrado
          </p>
        )}

        {data?.invites.map((invite) => {
          return (
            <div key={invite.id} className="space-y-2">
              <p className="text-muted-foreground text-sm leading-relaxed">
                <span className="text-foreground font-medium">
                  {invite.author?.name}
                </span>{' '}
                convidou você para entrar em{' '}
                <span className="text-foreground font-medium">
                  {invite.school.name}
                </span>{' '}
                <span>{dayjs(invite.createdAt).fromNow()}</span>
              </p>

              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => handleAcceptInvite(invite.id)}
                >
                  <Check className="mr-1.5 size-3" />
                  Aceitar
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  className="text-muted-foreground cursor-pointer"
                  onClick={() => handleRejectInvite(invite.id)}
                >
                  <X className="mr-1.5 size-3" />
                  Rejeitar
                </Button>
              </div>
            </div>
          )
        })}
      </PopoverContent>
    </Popover>
  )
}
