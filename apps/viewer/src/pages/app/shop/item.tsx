import type { GetSchoolShopResponse } from '@ecokids/types'
import { Award } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface ItemProps {
  item: GetSchoolShopResponse['itens'][number]
  totalPoints: number
}

export function Item({
  item: { name, description, value, photoUrl },
  totalPoints,
}: ItemProps) {
  return (
    <div className="bg-muted col-span-1 flex flex-col gap-4 rounded-xl border-t-4 border-emerald-400 p-4">
      {photoUrl ? (
        <img
          src={photoUrl || undefined}
          alt={name}
          className="h-48 rounded-md border object-contain"
        />
      ) : (
        <div className="flex h-48 items-center justify-center rounded-md border">
          <Award className="text-muted-foreground size-20 stroke-[0.25]" />
        </div>
      )}

      <div className="flex flex-col items-center gap-3 text-center">
        <div>
          <h2 className="font-semibold">{name}</h2>
          <span className="text-xs text-emerald-500">{value} pontos</span>
        </div>

        <p className="text-muted-foreground w-full truncate text-xs">
          {description}
        </p>
      </div>

      <Button className="bg-emerald-500" disabled={value > totalPoints}>
        Resgatar prêmio
      </Button>
    </div>
  )
}
