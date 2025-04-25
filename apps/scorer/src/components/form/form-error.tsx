import { Info } from 'lucide-react'

interface FormErrorProps {
  error?: string
}

export function FormError({ error }: FormErrorProps) {
  if (!error) return null

  return (
    <div className="flex items-center text-red-500 dark:text-red-400">
      <Info className="mr-1 size-3" />
      <p className="text-xs font-medium">{error}</p>
    </div>
  )
}
