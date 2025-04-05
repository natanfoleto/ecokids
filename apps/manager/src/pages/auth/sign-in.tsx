import { Link } from 'react-router-dom'

import logo from '@/assets/logo.svg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function SignIn() {
  return (
    <div className="animate-in slide-in-from-left flex w-1/3 flex-col items-center space-y-8 duration-500">
      <img src={logo} alt="Ecokids" className="w-64" />

      <form className="flex w-full flex-col items-center gap-6 rounded-md border p-12">
        <div className="w-full space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">E-mail</Label>
            <Input placeholder="Seu e-mail" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Senha</Label>
            <Input placeholder="Sua senha secreta" />
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-2">
          <Button className="w-full cursor-pointer bg-emerald-500 hover:bg-emerald-600">
            Entrar
          </Button>

          <Button variant="link" className="cursor-pointer" asChild>
            <Link to="/sign-up">Não tenho conta - Cadastrar</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
