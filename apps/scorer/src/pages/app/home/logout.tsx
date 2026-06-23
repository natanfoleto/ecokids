import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { signOut } from '@/auth'
import { Button } from '@/components/ui/button'

export function Logout() {
  const navigate = useNavigate()

  return (
    <Button
      size="lg"
      variant="outline"
      className="min-w-min cursor-pointer border-white/40 bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 hover:text-white"
      onClick={() => signOut(navigate)}
    >
      <LogOut className="size-5" />
      Sair
    </Button>
  )
}
