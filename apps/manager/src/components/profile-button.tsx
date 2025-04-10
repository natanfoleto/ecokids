import { ChevronDown, LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getCurrentAuthentication, signOut } from '@/auth'
import { getInitialsName } from '@/utils/get-initials-name'

import { Avatar, AvatarFallback } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export function ProfileButton() {
  const navigate = useNavigate()

  const [user, setUser] = useState<{
    id: string
    name: string | null
    email: string
    logoUrl?: string | null
  } | null>(null)

  useEffect(() => {
    async function loadUser() {
      const auth = await getCurrentAuthentication(navigate)

      if (auth) {
        setUser(auth.user)
      }
    }

    loadUser()
  }, [navigate])

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 outline-none">
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
          <div onClick={() => signOut(navigate)}>
            <LogOut className="mr-2 size-4" />
            Sair
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
