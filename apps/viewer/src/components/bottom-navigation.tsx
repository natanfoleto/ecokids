import { CircleUser, Hand, Trophy, Volleyball } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export function BottomNavigation() {
  return (
    <div className="bg-muted fixed bottom-0 left-0 right-0 z-50 flex h-16 justify-evenly gap-8 border-t px-2 sm:justify-center">
      <NavLink to="/" end>
        {({ isActive }) => (
          <button
            className={`flex h-full cursor-pointer flex-col items-center justify-between gap-1 border border-none py-2 text-xs ${isActive ? 'text-emerald-500' : 'text-muted-foreground'}`}
          >
            <Trophy className="size-6" />
            Ranking
          </button>
        )}
      </NavLink>

      <NavLink to="/shop" end>
        {({ isActive }) => (
          <button
            className={`flex h-full cursor-pointer flex-col items-center justify-between gap-1 border border-none py-2 text-xs ${isActive ? 'text-emerald-500' : 'text-muted-foreground'}`}
          >
            <Volleyball className="size-6" />
            Shop
          </button>
        )}
      </NavLink>

      <NavLink to="/points" end>
        {({ isActive }) => (
          <button
            className={`flex h-full cursor-pointer flex-col items-center justify-between gap-1 border border-none py-2 text-xs ${isActive ? 'text-emerald-500' : 'text-muted-foreground'}`}
          >
            <Hand className="size-6" />
            Meus pontos
          </button>
        )}
      </NavLink>

      <NavLink to="/profile" end>
        {({ isActive }) => (
          <button
            className={`flex h-full cursor-pointer flex-col items-center justify-between gap-1 border border-none py-2 text-xs ${isActive ? 'text-emerald-500' : 'text-muted-foreground'}`}
          >
            <CircleUser className="size-6" />
            Perfil
          </button>
        )}
      </NavLink>
    </div>
  )
}
