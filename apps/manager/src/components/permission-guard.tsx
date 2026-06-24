import { type ReactNode } from 'react'

import { usePermissions } from '@/hooks/use-permissions'

interface PermissionGuardProps {
  action: string
  subject: string
  children: ReactNode
}

export function PermissionGuard({
  action,
  subject,
  children,
}: PermissionGuardProps) {
  const { permissions, isLoading } = usePermissions()

  if (isLoading) {
    return (
      <div className="w-full animate-pulse space-y-6">
        <div className="bg-muted h-8 w-48 rounded" />
        <div className="bg-muted h-[200px] w-full rounded" />
      </div>
    )
  }

  const hasPermission = permissions
    ? (permissions.can as (action: string, subject: string) => boolean)(
        action,
        subject,
      )
    : false

  if (!hasPermission) {
    return (
      <div className="border-border animate-in fade-in flex h-[400px] w-full flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center duration-300">
        <h3 className="text-lg font-semibold text-red-500">Acesso Proibido</h3>
        <p className="text-muted-foreground mt-2 max-w-sm text-sm font-light leading-relaxed">
          Você não possui permissão para acessar esta área.
        </p>
      </div>
    )
  }

  return <>{children}</>
}
