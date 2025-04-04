import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import logo from './logo.png'

export function SignIn() {
  const navigate = useNavigate()

  return (
    <form className="flex w-1/3 flex-col items-center gap-6 rounded-xl border p-12">
      <img src={logo} alt="Ecokids" className="size-32" />

      <div className="mt-8 w-full space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs">E-mail ou CPF</Label>
          <Input placeholder="E-mail ou cpf" />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Senha</Label>
          <Input placeholder="Sua senha secreta" />
        </div>
      </div>

      <div className="flex w-full flex-col items-center gap-2">
        <Button className="w-full cursor-pointer">Entrar</Button>

        <Button
          variant="link"
          className="cursor-pointer"
          onClick={() => navigate('/sign-up')}
        >
          Não tenho conta - Cadastrar
        </Button>
      </div>
    </form>
  )
}
