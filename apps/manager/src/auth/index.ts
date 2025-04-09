import { defineAbilityFor } from '@ecokids/auth'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'

import { getMembership } from '@/http/schools/get-membership'
import { getUserProfile } from '@/http/users/get-user-profile'

export function isAuthenticated(): boolean {
  return !!Cookies.get('token')
}

export function getCurrentSchool(): string | null {
  return Cookies.get('school') ?? null
}

export async function getCurrentMembership() {
  const school = getCurrentSchool()

  if (!school) return null

  const { membership } = await getMembership({
    params: { schoolSlug: school },
  })

  return membership
}

export async function ability() {
  const membership = await getCurrentMembership()

  if (!membership) return null

  return defineAbilityFor({
    id: membership.userId,
    role: membership.role,
  })
}

export async function auth(navigate: ReturnType<typeof useNavigate>) {
  const token = Cookies.get('token')

  if (!token) {
    navigate('/sign-in')
    return
  }

  try {
    const { user } = await getUserProfile()

    return { user }
  } catch (error) {
    navigate('/sign-in')
  }
}

export async function signOut(navigate: ReturnType<typeof useNavigate>) {
  Cookies.remove('token')

  return navigate('/sign-in')
}
