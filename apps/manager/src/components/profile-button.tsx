import { ChevronDown, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { signOut } from '@/auth'
import { useUserProfile } from '@/hooks/use-user-profile'
import { getInitialsName } from '@/utils/get-initials-name'

import { Avatar, AvatarFallback } from './ui/avatar'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export function ProfileButton() {
  const navigate = useNavigate()

  const { user } = useUserProfile()

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex cursor-pointer items-center gap-3 outline-none">
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium">{user.name}</span>
          <span className="text-muted-foreground text-xs">{user.email}</span>
        </div>

        <Avatar>
          {/* {user.logoUrl && <AvatarImage src={user.logoUrl} />} */}
          {user.name && (
            <AvatarFallback>{getInitialsName(user.name)}</AvatarFallback>
          )}
        </Avatar>

        <ChevronDown className="text-muted-foreground size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Button
            onClick={() => signOut(navigate)}
            variant="ghost"
            size="sm"
            className="w-full cursor-pointer justify-start"
          >
            <LogOut className="mr-1 size-4" />
            Sair
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
