import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { ClassForm } from '@/pages/app/school/classes/class-form'

interface CreateClassProps {
  open: boolean
  onClose: () => void
}

export function CreateClass({ open, onClose }: CreateClassProps) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Criar classe</SheetTitle>
          <SheetDescription>
            Informe os dados para criar uma classe.
          </SheetDescription>
        </SheetHeader>

        <div className="p-4">
          <ClassForm />
        </div>
      </SheetContent>
    </Sheet>
  )
}
