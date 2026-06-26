import { createBrowserRouter } from 'react-router-dom'

import { PermissionGuard } from '@/components/permission-guard'

import { AppLayout } from './pages/_layouts/app'
import { AuthLayout } from './pages/_layouts/auth'
import { GlobalLayout } from './pages/_layouts/global'
import { Home } from './pages/app/home'
import { Profile } from './pages/app/profile'
import { School } from './pages/app/school'
import { AuditLogs } from './pages/app/school/audit-logs'
import { Awards } from './pages/app/school/awards'
import { Classes } from './pages/app/school/classes'
import { Items } from './pages/app/school/items'
import { Members } from './pages/app/school/members'
import { Redemptions } from './pages/app/school/redemptions'
import { Settings } from './pages/app/school/settings'
import { Students } from './pages/app/school/students'
import { SignIn } from './pages/auth/sign-in'
import { SignUp } from './pages/auth/sign-up'
import { Invite } from './pages/invite'
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
          {
            path: '/school/:slug/members',
            errorElement: <RouteError />,
            element: (
              <PermissionGuard action="get" subject="Member">
                <Members />
              </PermissionGuard>
            ),
          },
          {
            path: '/school/:slug/classes',
            errorElement: <RouteError />,
            element: (
              <PermissionGuard action="get" subject="Class">
                <Classes />
              </PermissionGuard>
            ),
          },
          {
            path: '/school/:slug/students',
            errorElement: <RouteError />,
            element: (
              <PermissionGuard action="get" subject="Student">
                <Students />
              </PermissionGuard>
            ),
          },
          {
            path: '/school/:slug/items',
            errorElement: <RouteError />,
            element: (
              <PermissionGuard action="get" subject="Item">
                <Items />
              </PermissionGuard>
            ),
          },
          {
            path: '/school/:slug/awards',
            errorElement: <RouteError />,
            element: (
              <PermissionGuard action="get" subject="Award">
                <Awards />
              </PermissionGuard>
            ),
          },
          {
            path: '/school/:slug/redemptions',
            errorElement: <RouteError />,
            element: (
              <PermissionGuard action="get" subject="RewardRedemption">
                <Redemptions />
              </PermissionGuard>
            ),
          },
          {
            path: '/school/:slug/settings',
            errorElement: <RouteError />,
            element: (
              <PermissionGuard action="update" subject="School">
                <Settings />
              </PermissionGuard>
            ),
          },
          {
            path: '/school/:slug/audit-logs',
            errorElement: <RouteError />,
            element: (
              <PermissionGuard action="get" subject="AuditLog">
                <AuditLogs />
              </PermissionGuard>
            ),
          },
          {
            path: '/profile',
            element: <Profile />,
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
          {
            path: '/sign-up',
            element: <SignUp />,
            errorElement: <RouteError />,
          },
        ],
      },
      {
        path: '/invite/:id',
        element: <Invite />,
        errorElement: <RouteError />,
      },
    ],
  },
  { path: '*', element: <NotFound />, errorElement: <RouteError /> },
])
