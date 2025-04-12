import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Outlet } from 'react-router-dom'

import { Middleware } from '@/pages/middleware'

dayjs.extend(relativeTime)
dayjs.locale('pt-br')

export function GlobalLayout() {
  return (
    <>
      <Middleware />
      <Outlet />
    </>
  )
}
