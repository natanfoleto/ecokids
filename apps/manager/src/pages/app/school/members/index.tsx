import { useMetadataSchool } from '@/hooks/use-metadata'
import { usePermissions } from '@/hooks/use-permissions'

import { Tabs } from '../tabs'
import { Invites } from './invites'

export function Members() {
  useMetadataSchool('Membros')

  const { permissions } = usePermissions()

  const canGetInvites = permissions?.can('get', 'Invite')

  return (
    <div className="w-full space-y-4">
      <Tabs />

      <div className="space-y-4">
        <h1 className="text-xl font-medium">Membros</h1>

        <div>{canGetInvites && <Invites />}</div>
      </div>
    </div>
  )
}
