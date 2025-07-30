import { useQuery } from '@tanstack/react-query'

import { getUserProfile } from '@/http/users/get-user-profile'

export function useUserProfile() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['users', 'profile'],
    queryFn: () => getUserProfile(),
  })

  return {
    user: data?.user,
    isLoading,
    isError,
  }
}
