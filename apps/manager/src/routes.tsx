import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from './pages/_layouts/app'
import { AuthLayout } from './pages/_layouts/auth'
import { GlobalLayout } from './pages/_layouts/global'
import { Home } from './pages/app/home'
import { Invite } from './pages/app/invite'
import { School } from './pages/app/school'
import { Members } from './pages/app/school/members'
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
          { path: '/', element: <Home /> },
          { path: '/school/:slug', element: <School /> },
          { path: '/school/:slug/members', element: <Members /> },
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
      { path: '/invite/:id', element: <Invite /> },
    ],
  },
  { path: '*', element: <NotFound /> },
])
