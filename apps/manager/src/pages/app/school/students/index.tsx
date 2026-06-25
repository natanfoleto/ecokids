import { Plus } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { useMetadataSchool } from '@/hooks/use-metadata'
import { usePermissions } from '@/hooks/use-permissions'
import { CreateStudent } from '@/pages/app/@dialog/students/create-student'

import { Tabs } from '../tabs'
import { StudentList } from './student-list'

export function Students() {
  useMetadataSchool('Alunos')

  const { permissions } = usePermissions()

  const [createStudent, setCreateStudent] = useState(false)

  function toggleCreateStudent() {
    setCreateStudent(!createStudent)
  }

  const canCreateStudent = permissions?.can('create', 'Student')

  return (
    <div className="w-full space-y-6">
      <Tabs />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Alunos</h1>
          <p className="text-muted-foreground text-sm font-light">
            Gerencie os alunos cadastrados e acompanhe seus saldos de pontos.
          </p>
        </div>

        {canCreateStudent && (
          <Button
            className="cursor-pointer bg-emerald-500 hover:bg-emerald-600"
            onClick={toggleCreateStudent}
          >
            <Plus className="size-4" />
            Criar aluno
          </Button>
        )}
      </div>

      {canCreateStudent ? (
        <StudentList />
      ) : (
        <p className="text-muted-foreground text-sm">
          Você não tem permissão para visualizar os alunos.
        </p>
      )}

      <CreateStudent open={createStudent} onClose={toggleCreateStudent} />
    </div>
  )
}
