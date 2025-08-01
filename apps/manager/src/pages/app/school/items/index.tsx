import { Plus } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { useMetadataSchool } from '@/hooks/use-metadata'
import { usePermissions } from '@/hooks/use-permissions'

import { CreateItem } from '../../@dialog/items/create-item'
import { Tabs } from '../tabs'
import { ItemList } from './item-list'

export function Items() {
  useMetadataSchool('Prêmios')

  const { permissions } = usePermissions()

  const [createItem, setCreateItem] = useState(false)

  function toggleCreateItem() {
    setCreateItem(!createItem)
  }

  const canCreateItem = permissions?.can('create', 'Item')
  const canGetItem = permissions?.can('get', 'Item')

  return (
    <div className="w-full space-y-4">
      <Tabs />

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">Itens</h1>

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
