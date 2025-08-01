import type { GetStudentResponse } from '@ecokids/types'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCurrentSchoolSlug } from '@/hooks/use-school'
import { getStudent } from '@/http/students/get-student'
import { StudentForm } from '@/pages/app/school/students/student-form'

interface UpdateStudentProps {
  open: boolean
  onClose: () => void
  studentId: string
}

export function UpdateStudent({
  open,
  onClose,
  studentId,
}: UpdateStudentProps) {
  const schoolSlug = useCurrentSchoolSlug()

  const { data } = useQuery<GetStudentResponse>({
    queryKey: ['schools', schoolSlug, 'students', studentId],
    queryFn: async () => {
      const data = await getStudent({
        params: {
          schoolSlug: schoolSlug!,
          studentId,
        },
      })

      return data
    },
    placeholderData: keepPreviousData,
  })

  if (!data) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-4xl">
        <DialogHeader>
          <DialogTitle>Atualizar aluno</DialogTitle>
          <DialogDescription>
            Após editar os campos, clique em salvar
          </DialogDescription>
        </DialogHeader>

        <div className="p-4">
          <StudentForm
            isUpdating
            initialData={data.student}
            studentId={data.student.id}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
