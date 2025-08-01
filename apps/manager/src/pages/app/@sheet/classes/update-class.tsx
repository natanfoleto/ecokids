import type { GetClassResponse } from '@ecokids/types'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useCurrentSchoolSlug } from '@/hooks/use-school'
import { getClass } from '@/http/classes/get-class'
import { ClassForm } from '@/pages/app/school/classes/class-form'

interface UpdateClassProps {
  open: boolean
  onClose: () => void
  classId: string
}

export function UpdateClass({ open, onClose, classId }: UpdateClassProps) {
  const schoolSlug = useCurrentSchoolSlug()

  const { data } = useQuery<GetClassResponse>({
    queryKey: ['schools', schoolSlug, 'classes', classId],
    queryFn: async () => {
      const data = await getClass({
        params: {
          schoolSlug: schoolSlug!,
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
