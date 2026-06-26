import type { CreatePointBody } from '@ecokids/types'
import { useClickSound } from '@ecokids/ui'
import { useQuery } from '@tanstack/react-query'
import { AlertTriangle, Loader2, Minus, Plus, Recycle } from 'lucide-react'
import { useEffect } from 'react'
import type { UseFormSetValue } from 'react-hook-form'

import { useStepper } from '@/contexts/stepper'
import { useCurrentSchoolSlug } from '@/hooks/use-current-school'
import { useHoldButton } from '@/hooks/use-hold-button'
import { getItems } from '@/http/items/get-items'

interface ItemListProps {
  setValue: UseFormSetValue<CreatePointBody>
}

interface ItemCounterProps {
  itemId: string
  value: number
  amount: number
}

function ItemCounter({ itemId, value, amount }: ItemCounterProps) {
  const { manual, increment, decrement } = useStepper()
  const { onClick: playClick } = useClickSound()
  const isSelected = amount > 0

  const decrementHold = useHoldButton({
    onSingleClick: () => {
      playClick()
      decrement(itemId)
    },
    onHoldTick: () => {
      playClick()
      for (let i = 0; i < 5; i++) decrement(itemId)
    },
  })

  const incrementHold = useHoldButton({
    onSingleClick: () => {
      playClick()
      increment(itemId, value)
    },
    onHoldTick: () => {
      playClick()
      for (let i = 0; i < 5; i++) increment(itemId, value)
    },
  })

  return (
    <div className="flex w-full items-center justify-center gap-2">
      <button
        type="button"
        disabled={amount === 0}
        className="flex size-12 flex-shrink-0 items-center justify-center rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-600 transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        {...decrementHold}
      >
        <Minus className="size-5" />
      </button>

      <input
        type="number"
        value={amount}
        onChange={(e) => manual(itemId, value, Number(e.target.value))}
        className={`h-11 w-16 flex-shrink-0 rounded-xl border-2 text-center text-lg font-bold transition-colors focus:outline-none ${
          isSelected
            ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
            : 'border-gray-200 bg-gray-50 text-gray-700'
        }`}
      />

      <button
        type="button"
        className="flex size-12 flex-shrink-0 items-center justify-center rounded-xl border-2 border-emerald-300 bg-emerald-50 text-emerald-600 transition-all hover:border-emerald-500 hover:bg-emerald-500 hover:text-white active:scale-95"
        {...incrementHold}
      >
        <Plus className="size-5" />
      </button>
    </div>
  )
}

export function ItemList({ setValue }: ItemListProps) {
  const currentSchool = useCurrentSchoolSlug()

  const { items } = useStepper()

  useEffect(() => {
    setValue('items', items)
  }, [items, setValue])

  const { data, isLoading } = useQuery({
    queryKey: ['schools', currentSchool, 'items'],
    queryFn: () => getItems({ params: { schoolSlug: currentSchool! } }),
  })

  if (isLoading)
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-100">
          <Loader2 className="size-7 animate-spin text-emerald-500" />
        </div>
        <p className="text-sm font-medium text-gray-500">Carregando itens...</p>
      </div>
    )

  const itemsList = data?.items ?? []

  if (itemsList.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex max-w-md flex-col items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
          <AlertTriangle className="size-10 text-amber-500" />
          <h3 className="text-lg font-semibold text-amber-700">
            Nenhum item cadastrado
          </h3>
          <p className="text-sm text-amber-600">
            Não existe nenhum item reciclável cadastrado nesta escola ainda.
            Entre em contato com a administração para cadastrá-los.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
        {data?.items.map((item) => {
          const amount = items.find((i) => i.itemId === item.id)?.amount ?? 0
          const isSelected = amount > 0

          return (
            <div
              key={item.id}
              className={`flex flex-col items-center gap-3 rounded-2xl border-2 p-4 shadow-sm transition-all duration-200 ${
                isSelected
                  ? 'border-emerald-400 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-emerald-200'
                  : 'border-gray-100 bg-white'
              }`}
            >
              {/* Item photo or icon */}
              {item.photoUrl ? (
                <img
                  src={item.photoUrl}
                  alt={item.name}
                  className="h-32 w-full rounded-xl object-contain"
                />
              ) : (
                <div
                  className={`flex h-32 w-full items-center justify-center rounded-xl ${
                    isSelected ? 'bg-emerald-100' : 'bg-gray-100'
                  }`}
                >
                  <Recycle
                    className={`size-12 ${isSelected ? 'text-emerald-500' : 'text-gray-400'}`}
                  />
                </div>
              )}

              {/* Name + value badge */}
              <div className="flex w-full flex-col items-center gap-1.5">
                <h3 className="text-center text-sm font-semibold leading-tight text-gray-800">
                  {item.name}
                </h3>

                {item.value > 0 && (
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      isSelected
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {item.value} pts
                  </span>
                )}
              </div>

              {/* Counter with hold support */}
              <ItemCounter
                itemId={item.id}
                value={item.value}
                amount={amount}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
