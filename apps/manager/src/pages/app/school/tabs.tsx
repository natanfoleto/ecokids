import { Gauge, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { useCurrentSchool } from '@/hooks/use-current-school'
import { usePermissions } from '@/hooks/use-permissions'

export function Tabs() {
  const currentSchool = useCurrentSchool()

  const { permissions } = usePermissions()

  const canGetMembers = permissions?.can('get', 'Member')

  return (
    <nav className="flex items-center gap-2">
      <NavLink to={`/school/${currentSchool}`} end>
        {({ isActive }) => (
          <Button
            variant="ghost"
            size="sm"
            className={`cursor-pointer border border-transparent ${isActive ? 'border-border' : 'text-muted-foreground'}`}
          >
            <Gauge className="mr-1 size-4" />
            Dashboard
          </Button>
        )}
      </NavLink>

      {canGetMembers && (
        <NavLink to={`/school/${currentSchool}/members`} end>
          {({ isActive }) => (
            <Button
              variant="ghost"
              size="sm"
              className={`cursor-pointer border border-transparent ${isActive ? 'border-border' : 'text-muted-foreground'}`}
            >
              <Users className="mr-1 size-4" />
              Membros
            </Button>
          )}
        </NavLink>
      )}
    </nav>
  )
}
