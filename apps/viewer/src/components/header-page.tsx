import logo from '@/assets/logo.svg'

export function HeaderPage() {
  return (
    <div className="bg-emerald-400">
      <div className="flex justify-center p-4">
        <img src={logo} alt="Logo" className="h-20" />
      </div>
    </div>
  )
}
