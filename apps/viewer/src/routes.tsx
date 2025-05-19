import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from './pages/_layouts/app'
import { AuthLayout } from './pages/_layouts/auth'
import { GlobalLayout } from './pages/_layouts/global'
import { Home } from './pages/app/home'
import { School } from './pages/app/school'
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
        children: [
          { path: '/', element: <Home /> },
          { path: '/school/:slug', element: <School /> },
        ],
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
