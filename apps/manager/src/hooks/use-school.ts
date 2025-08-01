import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import { getCurrentSchool } from '@/auth'
import { getSchool } from '@/http/schools/get-school'

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

export function useCurrentSchool() {
  const schoolSlug = useCurrentSchoolSlug()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['schools', schoolSlug],
    queryFn: () =>
      getSchool({
        params: {
          schoolSlug: schoolSlug!,
        },
      }),
  })

  return {
    school: data?.school,
    isLoading,
    isError,
  }
}
