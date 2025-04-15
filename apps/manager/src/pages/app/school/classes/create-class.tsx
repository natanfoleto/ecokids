import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

import { ClassForm } from './class-form'

interface CreateSchoolProps {
  open: boolean
  onClose: () => void
}

export function CreateClass({ open, onClose }: CreateSchoolProps) {
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
