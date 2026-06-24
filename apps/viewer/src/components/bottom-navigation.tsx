import { CircleUser, Gift, Hand, Trophy, Volleyball } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export function BottomNavigation() {
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex h-16 max-w-md items-center justify-around rounded-2xl border border-emerald-100 bg-white/95 px-2 shadow-lg shadow-emerald-100/50 backdrop-blur-md sm:mx-auto">
      <NavLink to="/ranking" end>
        {({ isActive }) => (
          <button
            className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl px-3 py-1.5 transition-all duration-200 active:scale-95 ${
              isActive
                ? 'bg-emerald-50 font-bold text-emerald-600'
                : 'font-medium text-gray-500 hover:text-gray-700'
            }`}
          >
            <Trophy
              className={`size-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}
            />
            <span className="text-[10px] tracking-tight">Ranking</span>
          </button>
        )}
      </NavLink>

      <NavLink to="/shop" end>
        {({ isActive }) => (
          <button
            className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl px-3 py-1.5 transition-all duration-200 active:scale-95 ${
              isActive
                ? 'bg-emerald-50 font-bold text-emerald-600'
                : 'font-medium text-gray-500 hover:text-gray-700'
            }`}
          >
            <Volleyball
              className={`size-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}
            />
            <span className="text-[10px] tracking-tight">Loja</span>
          </button>
        )}
      </NavLink>

      <NavLink to="/my-redemptions" end>
        {({ isActive }) => (
          <button
            className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl px-3 py-1.5 transition-all duration-200 active:scale-95 ${
              isActive
                ? 'bg-emerald-50 font-bold text-emerald-600'
                : 'font-medium text-gray-500 hover:text-gray-700'
            }`}
          >
            <Gift
              className={`size-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}
            />
            <span className="text-[10px] tracking-tight">Resgates</span>
          </button>
        )}
      </NavLink>

      <NavLink to="/points" end>
        {({ isActive }) => (
          <button
            className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl px-3 py-1.5 transition-all duration-200 active:scale-95 ${
              isActive
                ? 'bg-emerald-50 font-bold text-emerald-600'
                : 'font-medium text-gray-500 hover:text-gray-700'
            }`}
          >
            <Hand
              className={`size-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}
            />
            <span className="text-[10px] tracking-tight">Pontos</span>
          </button>
        )}
      </NavLink>

      <NavLink to="/profile" end>
        {({ isActive }) => (
          <button
            className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl px-3 py-1.5 transition-all duration-200 active:scale-95 ${
              isActive
                ? 'bg-emerald-50 font-bold text-emerald-600'
                : 'font-medium text-gray-500 hover:text-gray-700'
            }`}
          >
            <CircleUser
              className={`size-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}
            />
            <span className="text-[10px] tracking-tight">Perfil</span>
          </button>
        )}
      </NavLink>
    </div>
  )
}
