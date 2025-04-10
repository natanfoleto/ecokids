import { useCurrentSchool } from '@/hooks/use-current-school'

export function School() {
  const slug = useCurrentSchool()

  return <div>{slug}</div>
}
