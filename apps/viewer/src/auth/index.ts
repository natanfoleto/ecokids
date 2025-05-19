import { defineAbilityFor } from '@ecokids/auth'
import type { GetMembershipResponse } from '@ecokids/types'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'

export function isAuthenticated(): boolean {
  return !!Cookies.get('token')
}

export function getCurrentSchool(): string | null {
  return Cookies.get('school') ?? null
}

export function ability({ membership }: GetMembershipResponse) {
  return defineAbilityFor({
    id: membership.userId,
    role: membership.role,
  })
}

export async function signOut(navigate: ReturnType<typeof useNavigate>) {
  Cookies.remove('token')

  return navigate('/sign-in')
}
