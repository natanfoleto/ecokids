import { ChevronDown, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { signOut } from '@/auth'
import { useUserProfile } from '@/hooks/use-user-profile'
import { getInitialsName } from '@/utils/get-initials-name'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Skeleton } from './ui/skeleton'

export function ProfileButton() {
  const navigate = useNavigate()

  const { user, isLoading } = useUserProfile()

  if (isLoading || !user) {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex flex-col items-end space-y-2">
          <Skeleton className="h-2 w-32" />
          <Skeleton className="h-2 w-48" />
        </div>

        <Skeleton className="size-8 rounded-full" />
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex cursor-pointer items-center gap-3 outline-none">
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium">{user.name}</span>
          <span className="text-muted-foreground text-xs">{user.email}</span>
        </div>

        <Avatar>
          {user.avatarUrl && <AvatarImage src={user.avatarUrl} />}
          {user.name && (
            <AvatarFallback>{getInitialsName(user.name)}</AvatarFallback>
          )}
        </Avatar>

        <ChevronDown className="text-muted-foreground size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuItem asChild>
          <Button
            variant="ghost"
            size="sm"
            className="w-full cursor-pointer justify-start"
          >
            Perfil
            <ChevronRight className="ml-auto size-4" />
          </Button>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Button
            onClick={() => signOut(navigate)}
            variant="ghost"
            size="sm"
            className="w-full cursor-pointer justify-start"
          >
            Sair
            <ChevronRight className="ml-auto size-4" />
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
