import { useNavigate } from 'react-router-dom'

import { signOut } from '@/auth'

export function Dashboard() {
  const navigate = useNavigate()

  return (
    <div>
      <h1>Dashboard</h1>

      <button onClick={() => signOut(navigate)}>Sair</button>
    </div>
  )
}
