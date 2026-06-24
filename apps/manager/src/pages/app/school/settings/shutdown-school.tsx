import { Button } from '@/components/ui/button'

export function ShutdownSchool() {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm font-normal">
        Para realizar o desligamento definitivo da escola e a exclusão de todos
        os dados, entre em contato com um administrador do sistema.
      </p>
      <Button variant="destructive" disabled className="cursor-not-allowed">
        Desligar
      </Button>
    </div>
  )
}
