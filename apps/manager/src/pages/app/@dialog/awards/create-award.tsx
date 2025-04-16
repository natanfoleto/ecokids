import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AwardForm } from '@/pages/app/school/awards/award-form'

interface CreateAwardProps {
  open: boolean
  onClose: () => void
}

export function CreateAward({ open, onClose }: CreateAwardProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-4xl">
        <DialogHeader>
          <DialogTitle>Criar prêmio</DialogTitle>
          <DialogDescription>
            Informe os dados para criar um prêmio.
          </DialogDescription>
        </DialogHeader>

        <div className="p-4">
          <AwardForm />
        </div>
      </DialogContent>
    </Dialog>
  )
}
