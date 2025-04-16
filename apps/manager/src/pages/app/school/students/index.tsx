import { Plus } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { usePermissions } from '@/hooks/use-permissions'
import { CreateStudent } from '@/pages/app/@dialog/students/create-student'

import { Tabs } from '../tabs'
import { StudentList } from './student-list'

export function Students() {
  const { permissions } = usePermissions()

  const [createStudent, setCreateStudent] = useState(false)

  function toggleCreateStudent() {
    setCreateStudent(!createStudent)
  }

  const canGetStudent = permissions?.can('get', 'Student')
  const canCreateStudent = permissions?.can('create', 'Student')

  return (
    <div className="w-full space-y-4">
      <Tabs />

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">Alunos</h1>

        {canCreateStudent && (
          <Button className="cursor-pointer" onClick={toggleCreateStudent}>
            <Plus className="size-4" />
            Criar aluno
          </Button>
        )}
      </div>

      {canGetStudent ? (
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
