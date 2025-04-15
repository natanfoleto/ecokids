import { Plus } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { usePermissions } from '@/hooks/use-permissions'

import { Tabs } from '../tabs'
import { ClassList } from './class-list'
import { CreateClass } from './create-class'

export function Classes() {
  const { permissions } = usePermissions()

  const [createClass, setCreateClass] = useState(false)

  function toggleCreateClass() {
    setCreateClass(!createClass)
  }

  const canGetClass = permissions?.can('get', 'Class')
  const canCreateClass = permissions?.can('create', 'Class')

  return (
    <div className="w-full space-y-4">
      <Tabs />

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">Classes</h1>

        {canCreateClass && (
          <Button className="cursor-pointer" onClick={toggleCreateClass}>
            <Plus className="size-4" />
            Criar classe
          </Button>
        )}
      </div>

      {canGetClass ? (
        <ClassList />
      ) : (
        <p className="text-muted-foreground text-sm">
          Você não tem permissão para visualizar as classes.
        </p>
      )}

      <CreateClass open={createClass} onClose={toggleCreateClass} />
    </div>
  )
}
