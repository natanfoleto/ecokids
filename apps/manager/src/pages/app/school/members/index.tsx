import { useMetadataSchool } from '@/hooks/use-metadata'
import { usePermissions } from '@/hooks/use-permissions'

import { Tabs } from '../tabs'
import { Invites } from './invites'

export function Members() {
  useMetadataSchool('Membros')

  const { permissions } = usePermissions()

  const canGetInvites = permissions?.can('get', 'Invite')

  return (
    <div className="w-full space-y-6">
      <Tabs />

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Membros</h1>
          <p className="text-muted-foreground text-sm font-light">
            Gerencie a equipe escolar e os convites de acesso à plataforma.
          </p>
        </div>

        <div>{canGetInvites && <Invites />}</div>
      </div>
    </div>
  )
}
