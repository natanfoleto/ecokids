import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from './pages/_layouts/app'
import { AuthLayout } from './pages/_layouts/auth'
import { GlobalLayout } from './pages/_layouts/global'
import { Home } from './pages/app/home'
import { School } from './pages/app/school'
import { SignIn } from './pages/auth/sign-in'
import { NotFound } from './pages/not-found'
import { RouteError } from './pages/route-error'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <GlobalLayout />,
    errorElement: <RouteError />,
    children: [
      {
        path: '/',
        element: <AppLayout />,
        errorElement: <RouteError />,
        children: [
          { path: '/', element: <Home />, errorElement: <RouteError /> },
          {
            path: '/school/:slug',
            element: <School />,
            errorElement: <RouteError />,
          },
        ],
      },
      {
        path: '/',
        element: <AuthLayout />,
        errorElement: <RouteError />,
        children: [
          {
            path: '/sign-in',
            element: <SignIn />,
            errorElement: <RouteError />,
          },
        ],
      },
    ],
  },
  { path: '*', element: <NotFound />, errorElement: <RouteError /> },
])
