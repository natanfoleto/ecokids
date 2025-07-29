import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Outlet } from 'react-router-dom'

dayjs.extend(relativeTime)
dayjs.locale('pt-br')

export function GlobalLayout() {
  return <Outlet />
}
