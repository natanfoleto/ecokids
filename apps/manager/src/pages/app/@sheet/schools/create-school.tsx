import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { SchoolForm } from '@/pages/app/school/school-form'

interface CreateSchoolProps {
  open: boolean
  onClose: () => void
}

export function CreateSchool({ open, onClose }: CreateSchoolProps) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Criar escola</SheetTitle>
          <SheetDescription>
            Informe os dados para criar uma escola.
          </SheetDescription>
        </SheetHeader>

        <div className="p-4">
          <SchoolForm />
        </div>
      </SheetContent>
    </Sheet>
  )
}
