import { Plus } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { useMetadataSchool } from '@/hooks/use-metadata'
import { usePermissions } from '@/hooks/use-permissions'

import { CreateItem } from '../../@dialog/items/create-item'
import { Tabs } from '../tabs'
import { ItemList } from './item-list'

export function Items() {
  useMetadataSchool('Itens')

  const { permissions } = usePermissions()

  const [createItem, setCreateItem] = useState(false)

  function toggleCreateItem() {
    setCreateItem(!createItem)
  }

  const canCreateItem = permissions?.can('create', 'Item')
  const canGetItem = permissions?.can('get', 'Item')

  return (
    <div className="w-full space-y-6">
      <Tabs />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Itens</h1>
          <p className="text-muted-foreground text-sm font-light">
            Configure os materiais recicláveis aceitos e seus respectivos
            valores em pontos.
          </p>
        </div>

        {canCreateItem && (
          <Button
            className="cursor-pointer bg-emerald-500 hover:bg-emerald-600"
            onClick={toggleCreateItem}
          >
            <Plus className="size-4" />
            Criar item
          </Button>
        )}
      </div>

      {canGetItem ? (
        <ItemList />
      ) : (
        <p className="text-muted-foreground text-sm">
          Você não tem permissão para visualizar os itens.
        </p>
      )}

      <CreateItem open={createItem} onClose={toggleCreateItem} />
    </div>
  )
}
