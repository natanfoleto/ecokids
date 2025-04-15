import type { GetClassResponse } from '@ecokids/types'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useCurrentSchool } from '@/hooks/use-current-school'
import { getClass } from '@/http/classes/get-class'

import { ClassForm } from './class-form'

interface UpdateSchoolProps {
  open: boolean
  onClose: () => void
  classId: string
}

export function UpdateClass({ open, onClose, classId }: UpdateSchoolProps) {
  const currentSchool = useCurrentSchool()

  const { data } = useQuery<GetClassResponse>({
    queryKey: ['schools', currentSchool, 'classes', classId],
    queryFn: async () => {
      const data = await getClass({
        params: {
          schoolSlug: currentSchool!,
          classId,
        },
      })

      return data
    },
    placeholderData: keepPreviousData,
  })

  if (!data) return null

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Atualizar classe {data.class.name}</SheetTitle>
          <SheetDescription>
            Após editar os campos, clique em salvar
          </SheetDescription>
        </SheetHeader>

        <div className="p-4">
          <ClassForm
            isUpdating
            initialData={data.class}
            classId={data.class.id}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
