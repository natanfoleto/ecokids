import { Outlet } from 'react-router-dom'

import { Middleware } from '@/pages/middleware'

export function GlobalLayout() {
  return (
    <>
      <Middleware />
      <Outlet />
    </>
  )
}
