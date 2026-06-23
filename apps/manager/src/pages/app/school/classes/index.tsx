import { Plus } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { useMetadataSchool } from '@/hooks/use-metadata'
import { usePermissions } from '@/hooks/use-permissions'
import { CreateClass } from '@/pages/app/@sheet/classes/create-class'

import { Tabs } from '../tabs'
import { ClassList } from './class-list'

export function Classes() {
  useMetadataSchool('Classes')

  const { permissions } = usePermissions()

  const [createClass, setCreateClass] = useState(false)

  function toggleCreateClass() {
    setCreateClass(!createClass)
  }

  const canGetClass = permissions?.can('get', 'Class')
  const canCreateClass = permissions?.can('create', 'Class')

  return (
    <div className="w-full space-y-6">
      <Tabs />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Turmas</h1>
          <p className="text-muted-foreground text-sm font-light">
            Gerencie as turmas e salas de aula cadastradas na escola.
          </p>
        </div>

        {canCreateClass && (
          <Button
            className="cursor-pointer bg-emerald-500 hover:bg-emerald-600"
            onClick={toggleCreateClass}
          >
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
