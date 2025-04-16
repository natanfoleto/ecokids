import { Plus } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { usePermissions } from '@/hooks/use-permissions'
import { CreateClass } from '@/pages/app/@sheet/classes/create-class'

import { Tabs } from '../tabs'
import { ClassList } from './class-list'

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
        <h1 className="text-xl font-medium">Turmas</h1>

        {canCreateClass && (
          <Button className="cursor-pointer" onClick={toggleCreateClass}>
            <Plus className="size-4" />
            Criar turma
          </Button>
        )}
      </div>

      {canGetClass ? (
        <ClassList />
      ) : (
        <p className="text-muted-foreground text-sm">
          Você não tem permissão para visualizar as turmas.
        </p>
      )}

      <CreateClass open={createClass} onClose={toggleCreateClass} />
    </div>
  )
}
