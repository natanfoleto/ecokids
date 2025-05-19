import { Logout } from './logout'
import { SchoolList } from './school-list'

export function Home() {
  return (
    <div className="bg-muted flex h-screen w-full flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-muted-foreground">
        Selecione a escola para pontuar!
      </h1>

      <SchoolList />
      <Logout />
    </div>
  )
}
