import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from './pages/_layouts/app'
import { AuthLayout } from './pages/_layouts/auth'
import { GlobalLayout } from './pages/_layouts/global'
import { Dashboard } from './pages/app/dashboard'
import { School } from './pages/app/school'
import { SignIn } from './pages/auth/sign-in'
import { SignUp } from './pages/auth/sign-up'
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
          { path: '/', element: <Dashboard /> },
          { path: '/school/:slug', element: <School /> },
        ],
      },
      {
        path: '/',
        element: <AuthLayout />,
        children: [
          { path: '/sign-in', element: <SignIn /> },
          { path: '/sign-up', element: <SignUp /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFound /> },
])
