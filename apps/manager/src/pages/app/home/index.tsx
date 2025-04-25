import { Plus } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { CreateSchool } from '@/pages/app/@sheet/schools/create-school'

import { SchoolList } from './school-list'

export function Home() {
  const [createSchool, setCreateSchool] = useState(false)

  function toggleCreateSchool() {
    setCreateSchool(!createSchool)
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">Escolas</h1>

        <Button
          className="cursor-pointer bg-emerald-500 hover:bg-emerald-600"
          onClick={toggleCreateSchool}
        >
          <Plus className="size-4" />
          Criar escola
        </Button>
      </div>

      <SchoolList />

      <CreateSchool open={createSchool} onClose={toggleCreateSchool} />
    </div>
  )
}
