import { useState, useTransition } from 'react'

export interface ActionState<T = unknown> {
  success: boolean
  message: string | null
  data?: T
}

export function useAction<T = unknown>() {
  const [isPending, startTransition] = useTransition()
  const [actionState, setActionState] = useState<ActionState<T>>({
    success: false,
    message: null,
    data: undefined,
  })

  async function handleAction(
    action: (data?: unknown) => Promise<ActionState<T>>,
    onSuccess?: (result: ActionState<T>) => Promise<void> | void,
  ): Promise<ActionState<T>> {
    return new Promise((resolve) => {
      startTransition(async () => {
        try {
          const result = await action()

          setActionState(result)

          if (result.success && onSuccess) await onSuccess(result)

          resolve(result)
        } catch (error) {
          console.error('Erro ao executar a ação: ', error)

          const errorState: ActionState<T> = {
            success: false,
            message: 'Ocorreu um erro inesperado',
          }

          setActionState(errorState)

          resolve(errorState)
        }
      })
    })
  }

  return [actionState, handleAction, isPending] as const
}
