import { createBrowserRouter } from 'react-router-dom'

import { PermissionGuard } from '@/components/permission-guard'

import { AppLayout } from './pages/_layouts/app'
import { AuthLayout } from './pages/_layouts/auth'
import { GlobalLayout } from './pages/_layouts/global'
import { Home } from './pages/app/home'
import { Profile } from './pages/app/profile'
import { School } from './pages/app/school'
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
          {
            path: '/school/:slug/members',
            element: (
              <PermissionGuard action="get" subject="Member">
                <Members />
              </PermissionGuard>
            ),
          },
          {
            path: '/school/:slug/classes',
            element: (
              <PermissionGuard action="get" subject="Class">
                <Classes />
              </PermissionGuard>
            ),
          },
          {
            path: '/school/:slug/students',
            element: (
              <PermissionGuard action="get" subject="Student">
                <Students />
              </PermissionGuard>
            ),
          },
          {
            path: '/school/:slug/items',
            element: (
              <PermissionGuard action="get" subject="Item">
                <Items />
              </PermissionGuard>
            ),
          },
          {
            path: '/school/:slug/awards',
            element: (
              <PermissionGuard action="get" subject="Award">
                <Awards />
              </PermissionGuard>
            ),
          },
          {
            path: '/school/:slug/redemptions',
            element: (
              <PermissionGuard action="get" subject="RewardRedemption">
                <Redemptions />
              </PermissionGuard>
            ),
          },
          {
            path: '/school/:slug/settings',
            element: (
              <PermissionGuard action="update" subject="School">
                <Settings />
              </PermissionGuard>
            ),
          },
          { path: '/profile', element: <Profile /> },
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
