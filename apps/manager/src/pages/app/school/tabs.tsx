import {
  Gauge,
  Gift,
  GraduationCap,
  Paperclip,
  Settings,
  SquarePen,
  Users,
  Volleyball,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { usePermissions } from '@/hooks/use-permissions'
import { useCurrentSchoolSlug } from '@/hooks/use-school'

export function Tabs() {
  const schoolSlug = useCurrentSchoolSlug()

  const { permissions, isLoading } = usePermissions()

  const canGetClasses = permissions?.can('get', 'Class')
  const canGetStudents = permissions?.can('get', 'Student')
  const canGetItems = permissions?.can('get', 'Item')
  const canGetAwards = permissions?.can('get', 'Award')
  const canGetRedemptions = permissions?.can('get', 'RewardRedemption')
  const canGetMembers = permissions?.can('get', 'Member')
  const canUpdateSchool = permissions?.can('update', 'School')

  return (
    <nav className="flex items-center gap-2">
      {isLoading ? (
        <Skeleton className="h-8 w-28 rounded-sm" />
      ) : (
        <NavLink to={`/school/${schoolSlug}`} end>
          {({ isActive }) => (
            <Button
              variant="ghost"
              size="sm"
              className={`cursor-pointer border border-transparent ${isActive ? 'border-border bg-muted' : 'text-muted-foreground'}`}
            >
              <Gauge className="size-4" />
              Dashboard
            </Button>
          )}
        </NavLink>
      )}

      {isLoading ? (
        <Skeleton className="h-8 w-28 rounded-sm" />
      ) : (
        canGetClasses && (
          <NavLink to={`/school/${schoolSlug}/classes`} end>
            {({ isActive }) => (
              <Button
                variant="ghost"
                size="sm"
                className={`cursor-pointer border border-transparent ${isActive ? 'border-border bg-muted' : 'text-muted-foreground'}`}
              >
                <SquarePen className="size-4" />
                Classes
              </Button>
            )}
          </NavLink>
        )
      )}

      {isLoading ? (
        <Skeleton className="h-8 w-28 rounded-sm" />
      ) : (
        canGetStudents && (
          <NavLink to={`/school/${schoolSlug}/students`} end>
            {({ isActive }) => (
              <Button
                variant="ghost"
                size="sm"
                className={`cursor-pointer border border-transparent ${isActive ? 'border-border bg-muted' : 'text-muted-foreground'}`}
              >
                <GraduationCap className="size-4" />
                Alunos
              </Button>
            )}
          </NavLink>
        )
      )}

      {isLoading ? (
        <Skeleton className="h-8 w-28 rounded-sm" />
      ) : (
        canGetItems && (
          <NavLink to={`/school/${schoolSlug}/items`} end>
            {({ isActive }) => (
              <Button
                variant="ghost"
                size="sm"
                className={`cursor-pointer border border-transparent ${isActive ? 'border-border bg-muted' : 'text-muted-foreground'}`}
              >
                <Paperclip className="size-4" />
                Itens
              </Button>
            )}
          </NavLink>
        )
      )}

      {isLoading ? (
        <Skeleton className="h-8 w-28 rounded-sm" />
      ) : (
        canGetAwards && (
          <NavLink to={`/school/${schoolSlug}/awards`} end>
            {({ isActive }) => (
              <Button
                variant="ghost"
                size="sm"
                className={`cursor-pointer border border-transparent ${isActive ? 'border-border bg-muted' : 'text-muted-foreground'}`}
              >
                <Volleyball className="size-4" />
                Prêmios
              </Button>
            )}
          </NavLink>
        )
      )}

      {isLoading ? (
        <Skeleton className="h-8 w-28 rounded-sm" />
      ) : (
        canGetRedemptions && (
          <NavLink to={`/school/${schoolSlug}/redemptions`} end>
            {({ isActive }) => (
              <Button
                variant="ghost"
                size="sm"
                className={`cursor-pointer border border-transparent ${isActive ? 'border-border bg-muted' : 'text-muted-foreground'}`}
              >
                <Gift className="size-4" />
                Resgates
              </Button>
            )}
          </NavLink>
        )
      )}

      {isLoading ? (
        <Skeleton className="h-8 w-28 rounded-sm" />
      ) : (
        canGetMembers && (
          <NavLink to={`/school/${schoolSlug}/members`} end>
            {({ isActive }) => (
              <Button
                variant="ghost"
                size="sm"
                className={`cursor-pointer border border-transparent ${isActive ? 'border-border bg-muted' : 'text-muted-foreground'}`}
              >
                <Users className="size-4" />
                Membros
              </Button>
            )}
          </NavLink>
        )
      )}

      {isLoading ? (
        <Skeleton className="h-8 w-28 rounded-sm" />
      ) : (
        canUpdateSchool && (
          <NavLink to={`/school/${schoolSlug}/settings`} end>
            {({ isActive }) => (
              <Button
                variant="ghost"
                size="sm"
                className={`cursor-pointer border border-transparent ${isActive ? 'border-border bg-muted' : 'text-muted-foreground'}`}
              >
                <Settings className="size-4" />
                Configurações
              </Button>
            )}
          </NavLink>
        )
      )}
    </nav>
  )
}
