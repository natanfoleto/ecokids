import type { CreatePointBody } from '@ecokids/types'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { UseFormSetValue } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useStepper } from '@/contexts/stepper'
import { useCurrentSchoolSlug } from '@/hooks/use-current-school'
import { getItems } from '@/http/items/get-items'

interface ItemListProps {
  setValue: UseFormSetValue<CreatePointBody>
}

export function ItemList({ setValue }: ItemListProps) {
  const currentSchool = useCurrentSchoolSlug()

  const { items, manual, increment, decrement } = useStepper()

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setValue('items', items)
  }, [items, setValue])

  const { data, isLoading } = useQuery({
    queryKey: ['schools', currentSchool, 'items'],
    queryFn: () => getItems({ params: { schoolSlug: currentSchool! } }),
  })

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -258, behavior: 'smooth' })
  }

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 258, behavior: 'smooth' })
  }

  if (isLoading)
    return (
      <div className="h-76 flex items-center gap-4">
        <Loader2 className="text-muted-foreground size-7 animate-spin" />
      </div>
    )

  return (
    <div className="w-full min-w-96">
      <div className="flex flex-col items-center justify-center gap-2">
        <div ref={scrollRef} className="w-full overflow-x-scroll pb-2">
          <div className="flex gap-4">
            {data?.items.map((item) => {
              const amount =
                items.find((i) => i.itemId === item.id)?.amount || 0

              return (
                <Card
                  key={item.id}
                  className={`bg-muted min-w-60 flex-shrink-0 rounded-md border-transparent shadow-none transition-colors ${amount > 0 ? '' : ''}`}
                >
                  <CardHeader className="space-y-2">
                    <CardTitle className="text-center text-lg">
                      {item.name}
                    </CardTitle>

                    {item.photoUrl && (
                      <img
                        src={item.photoUrl}
                        alt={item.name}
                        className="h-28 w-full rounded-md object-contain"
                      />
                    )}
                  </CardHeader>

                  <CardContent className="w-60 space-y-2">
                    {item.value && (
                      <p className="text-muted-foreground text-center text-sm">
                        {item.value} pontos
                      </p>
                    )}

                    <div className="flex items-center justify-center gap-1.5">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="cursor-pointer disabled:cursor-not-allowed"
                        onClick={() => decrement(item.id)}
                      >
                        -
                      </Button>

                      <Input
                        type="number"
                        value={amount}
                        onChange={(e) =>
                          manual(item.id, item.value, Number(e.target.value))
                        }
                        className="bg-background w-16 flex-1 text-center"
                      />

                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="cursor-pointer disabled:cursor-not-allowed"
                        onClick={() => increment(item.id, item.value)}
                      >
                        +
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        <div className="flex w-full items-start justify-between">
          <Button
            type="button"
            size="icon"
            variant="secondary"
            onClick={scrollLeft}
            className="cursor-pointer"
          >
            <ChevronLeft />
          </Button>

          <Button
            type="button"
            size="icon"
            variant="secondary"
            onClick={scrollRight}
            className="cursor-pointer"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  )
}
