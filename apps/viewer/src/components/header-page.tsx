import logo from '@/assets/logo.svg'

export function HeaderPage() {
  return (
    <div className="bg-gradient-to-r from-emerald-400 to-teal-500 shadow-md">
      <div className="flex justify-center p-4">
        <img src={logo} alt="Logo" className="h-16 drop-shadow-sm" />
      </div>
    </div>
  )
}
