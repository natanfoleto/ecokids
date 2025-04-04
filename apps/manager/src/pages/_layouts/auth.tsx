import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div>
      <main className="flex h-screen w-full items-center justify-center">
        <Outlet />
      </main>
    </div>
  )
}
