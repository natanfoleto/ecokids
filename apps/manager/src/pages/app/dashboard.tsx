import { useNavigate } from 'react-router-dom'

import { signOut } from '@/auth'

export function Dashboard() {
  const navigate = useNavigate()

  return (
    <div>
      <button onClick={() => signOut(navigate)}>Sair</button>
    </div>
  )
}
