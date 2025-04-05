import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="overflow-hidden">
      <main className="flex h-screen w-full items-center justify-center">
        <Outlet />
      </main>
    </div>
  )
}
