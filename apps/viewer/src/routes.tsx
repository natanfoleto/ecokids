import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from './pages/_layouts/app'
import { AuthLayout } from './pages/_layouts/auth'
import { GlobalLayout } from './pages/_layouts/global'
import { Awards } from './pages/app/awards'
import { Points } from './pages/app/points'
import { Profile } from './pages/app/profile'
import { Ranking } from './pages/app/ranking'
import { SignIn } from './pages/auth/sign-in'
import { NotFound } from './pages/not-found'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <GlobalLayout />,
    children: [
      {
        path: '/',
        element: <AppLayout />,
        children: [{ path: '/ranking', element: <Ranking /> }],
      },
      {
        path: '/',
        element: <AppLayout />,
        children: [{ path: '/awards', element: <Awards /> }],
      },
      {
        path: '/',
        element: <AppLayout />,
        children: [{ path: '/points', element: <Points /> }],
      },
      {
        path: '/',
        element: <AppLayout />,
        children: [{ path: '/profile', element: <Profile /> }],
      },
      {
        path: '/',
        element: <AuthLayout />,
        children: [{ path: '/sign-in', element: <SignIn /> }],
      },
    ],
  },
  { path: '*', element: <NotFound /> },
])
