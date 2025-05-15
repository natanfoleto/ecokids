import type { GetItemResponse } from '@ecokids/types'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCurrentSchool } from '@/hooks/use-current-school'
import { getItem } from '@/http/items/get-item'

import { ItemForm } from '../../school/items/item-form'

interface UpdateItemProps {
  open: boolean
  onClose: () => void
  itemId: string
}

export function UpdateItem({ open, onClose, itemId }: UpdateItemProps) {
  const currentSchool = useCurrentSchool()

  const { data } = useQuery<GetItemResponse>({
    queryKey: ['schools', currentSchool, 'items', itemId],
    queryFn: async () => {
      const data = await getItem({
        params: {
          schoolSlug: currentSchool!,
          itemId,
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
          <DialogTitle>Atualizar item</DialogTitle>
          <DialogDescription>
            Após editar os campos, clique em salvar
          </DialogDescription>
        </DialogHeader>

        <div className="p-4">
          <ItemForm isUpdating initialData={data.item} itemId={data.item.id} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
