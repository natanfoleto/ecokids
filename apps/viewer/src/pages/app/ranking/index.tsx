import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function Ranking() {
  return (
    <div className="flex min-h-screen flex-col items-center gap-4 p-4">
      <div className="bg-muted flex w-full flex-col justify-between gap-4 rounded-xl border-t-4 border-emerald-400 p-4">
        <h1 className="font-semibold">Ranking de reciclagem dos alunos</h1>

        <div className="space-y-2">
          <Label htmlFor="" className="text-muted-foreground font-normal">
            Filtrar por turma
          </Label>

          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Turmas" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fruits</SelectLabel>
                <SelectItem value="1">1A - 2025</SelectItem>
                <SelectItem value="2">1B - 2025</SelectItem>
                <SelectItem value="3">1C - 2025</SelectItem>
                <SelectItem value="4">2A - 2025</SelectItem>
                <SelectItem value="5">2B - 2025</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-muted flex w-full flex-col justify-between gap-4 rounded-xl border-t-4 border-emerald-400 p-4"></div>
    </div>
  )
}
