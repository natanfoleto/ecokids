import { Plus } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { useMetadataSchool } from '@/hooks/use-metadata'
import { usePermissions } from '@/hooks/use-permissions'

import { CreateAward } from '../../@dialog/awards/create-award'
import { Tabs } from '../tabs'
import { AwardList } from './award-list'

export function Awards() {
  useMetadataSchool('Prêmios')
  const { permissions } = usePermissions()

  const [createAward, setCreateAward] = useState(false)

  function toggleCreateAward() {
    setCreateAward(!createAward)
  }

  const canCreateAward = permissions?.can('create', 'Award')
  const canGetAward = permissions?.can('get', 'Award')

  return (
    <div className="w-full space-y-6">
      <Tabs />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Prêmios</h1>
          <p className="text-muted-foreground text-sm font-light">
            Cadastre as recompensas disponíveis para resgate na loja dos alunos.
          </p>
        </div>

        {canCreateAward && (
          <Button
            className="cursor-pointer bg-emerald-500 hover:bg-emerald-600"
            onClick={toggleCreateAward}
          >
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
