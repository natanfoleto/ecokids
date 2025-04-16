import { Plus } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { usePermissions } from '@/hooks/use-permissions'

import { CreateAward } from '../../@dialog/awards/create-award'
import { Tabs } from '../tabs'
import { AwardList } from './award-list'

export function Awards() {
  const { permissions } = usePermissions()

  const [createAward, setCreateAward] = useState(false)

  function toggleCreateAward() {
    setCreateAward(!createAward)
  }

  const canCreateAward = permissions?.can('create', 'Award')
  const canGetAward = permissions?.can('get', 'Award')

  return (
    <div className="w-full space-y-4">
      <Tabs />

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">Prêmios</h1>

        {canCreateAward && (
          <Button className="cursor-pointer" onClick={toggleCreateAward}>
            <Plus className="size-4" />
            Criar prêmio
          </Button>
        )}
      </div>

      {canGetAward ? (
        <AwardList />
      ) : (
        <p className="text-muted-foreground text-sm">
          Você não tem permissão para visualizar os prêmios.
        </p>
      )}

      <CreateAward open={createAward} onClose={toggleCreateAward} />
    </div>
  )
}
