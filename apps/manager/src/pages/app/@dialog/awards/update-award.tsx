import type { GetAwardResponse } from '@ecokids/types'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCurrentSchool } from '@/hooks/use-current-school'
import { getAward } from '@/http/awards/get-award'
import { AwardForm } from '@/pages/app/school/awards/award-form'

interface UpdateAwardProps {
  open: boolean
  onClose: () => void
  awardId: string
}

export function UpdateAward({ open, onClose, awardId }: UpdateAwardProps) {
  const currentSchool = useCurrentSchool()

  const { data } = useQuery<GetAwardResponse>({
    queryKey: ['schools', currentSchool, 'awards', awardId],
    queryFn: async () => {
      const data = await getAward({
        params: {
          schoolSlug: currentSchool!,
          awardId,
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
          <DialogTitle>Atualizar prêmio</DialogTitle>
          <DialogDescription>
            Após editar os campos, clique em salvar
          </DialogDescription>
        </DialogHeader>

        <div className="p-4">
          <AwardForm
            isUpdating
            initialData={data.award}
            awardId={data.award.id}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
