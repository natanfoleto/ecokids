import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { ItemForm } from '../../school/items/item-form'

interface CreateItemProps {
  open: boolean
  onClose: () => void
}

export function CreateItem({ open, onClose }: CreateItemProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-4xl">
        <DialogHeader>
          <DialogTitle>Criar item</DialogTitle>
          <DialogDescription>
            Informe os dados para criar um item.
          </DialogDescription>
        </DialogHeader>

        <ItemForm />
      </DialogContent>
    </Dialog>
  )
}
