import { Loader2 } from 'lucide-react'

interface LoadingPageProps {
  message: string
}

export function LoadingPage({ message }: LoadingPageProps) {
  return (
    <div className="text-muted-foreground flex min-h-[calc(100vh-64px)] flex-col items-center justify-center gap-2">
      <Loader2 className="animate-spin" />
      {message}
    </div>
  )
}
