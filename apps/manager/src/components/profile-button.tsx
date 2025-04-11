import { useQuery } from '@tanstack/react-query'
import { ChevronDown, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { signOut } from '@/auth'
import { getUserProfile } from '@/http/users/get-user-profile'
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

  const { data } = useQuery({
    queryKey: ['profile', 'users'],
    queryFn: () => getUserProfile(),
  })

  if (!data) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex cursor-pointer items-center gap-3 outline-none">
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium">{data.user.name}</span>
          <span className="text-muted-foreground text-xs">
            {data.user.email}
          </span>
        </div>

        <Avatar>
          {/* {data.user.logoUrl && <AvatarImage src={data.user.logoUrl} />} */}
          {data.user.name && (
            <AvatarFallback>{getInitialsName(data.user.name)}</AvatarFallback>
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
