import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { signOut } from '@/auth'
import { Button } from '@/components/ui/button'

export function Logout() {
  const navigate = useNavigate()

  return (
    <Button
      size="lg"
      className="min-w-min cursor-pointer bg-emerald-500 hover:bg-emerald-600"
      onClick={() => signOut(navigate)}
    >
      <LogOut className="size-5" />
      Sair
    </Button>
  )
}
