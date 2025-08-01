import { useQuery } from '@tanstack/react-query'

import { ability } from '@/auth'
import { useCurrentSchoolSlug } from '@/hooks/use-school'
import { getMembership } from '@/http/schools/get-membership'

export function usePermissions() {
  const schoolSlug = useCurrentSchoolSlug()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['schools', schoolSlug, 'membership'],
    queryFn: () => getMembership({ params: { schoolSlug: schoolSlug! } }),
    enabled: !!schoolSlug,
  })

  const permissions = data ? ability({ membership: data.membership }) : null

  return {
    permissions,
    membership: data?.membership,
    isLoading,
    isError,
  }
}
