import type { GetAwardResponse } from '@ecokids/types'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCurrentSchoolSlug } from '@/hooks/use-school'
import { getAward } from '@/http/awards/get-award'
import { AwardForm } from '@/pages/app/school/awards/award-form'

interface UpdateAwardProps {
  open: boolean
  onClose: () => void
  awardId: string
}

export function UpdateAward({ open, onClose, awardId }: UpdateAwardProps) {
  const schoolSlug = useCurrentSchoolSlug()

  const { data } = useQuery<GetAwardResponse>({
    queryKey: ['schools', schoolSlug, 'awards', awardId],
    queryFn: async () => {
      const data = await getAward({
        params: {
          schoolSlug: schoolSlug!,
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

        <AwardForm
          isUpdating
          initialData={data.award}
          awardId={data.award.id}
        />
      </DialogContent>
    </Dialog>
  )
}
