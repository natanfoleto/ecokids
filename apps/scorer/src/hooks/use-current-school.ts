import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import { getCurrentSchool } from '@/auth'

/* 
  Esse hook funciona de forma reativa e segura para garantir que o slug da escola esteja sempre atualizado 
  com base na URL, e usa o cookie apenas como fallback. 
*/

export function useCurrentSchoolSlug(): string | null {
  const location = useLocation()

  return useMemo(() => {
    const pathSegments = location.pathname.split('/')

    const isSchoolRoute =
      pathSegments[1] === 'school' && typeof pathSegments[2] === 'string'

    if (isSchoolRoute) {
      return pathSegments[2]
    }

    return getCurrentSchool()
  }, [location])
}
