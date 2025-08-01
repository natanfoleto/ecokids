import { useQuery } from '@tanstack/react-query'

import { ability } from '@/auth'
import { useCurrentSchoolSlug } from '@/hooks/use-current-school'
import { getMembership } from '@/http/schools/get-membership'

export function usePermissions() {
  const currentSchool = useCurrentSchoolSlug()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['schools', currentSchool, 'membership'],
    queryFn: () => getMembership({ params: { schoolSlug: currentSchool! } }),
    enabled: !!currentSchool,
  })

  const permissions = data ? ability({ membership: data.membership }) : null

  return {
    permissions,
    membership: data?.membership,
    isLoading,
    isError,
  }
}
