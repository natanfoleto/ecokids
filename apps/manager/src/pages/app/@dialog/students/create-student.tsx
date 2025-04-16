import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { StudentForm } from '@/pages/app/school/students/student-form'

interface CreateStudentProps {
  open: boolean
  onClose: () => void
}

export function CreateStudent({ open, onClose }: CreateStudentProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-4xl">
        <DialogHeader>
          <DialogTitle>Criar aluno</DialogTitle>
          <DialogDescription>
            Informe os dados para criar um aluno.
          </DialogDescription>
        </DialogHeader>

        <div className="p-4">
          <StudentForm />
        </div>
      </DialogContent>
    </Dialog>
  )
}
