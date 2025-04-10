import { Slash } from 'lucide-react'
import { Link } from 'react-router-dom'

import logoHeader from '@/assets/logo-header.svg'

import { ProfileButton } from './profile-button'
import { SchoolSwitcher } from './school-switcher'
import { Separator } from './ui/separator'

export function Header() {
  return (
    <div className="mx-auto flex items-center justify-between px-6 pt-2">
      <div className="flex items-center gap-3">
        <Link to="/">
          <img className="w-16" src={logoHeader} alt="Logo" />
        </Link>

        <Slash className="text-border size-3 -rotate-[24deg]" />

        <SchoolSwitcher />

        {/* {permissions?.can('obter', 'Estabelecimento') && (
          <>
            <Slash className="text-border size-3 -rotate-[24deg]" />
            <EstabelecimentoSwitcher />
          </>
        )} */}
      </div>

      <div className="flex items-center gap-4">
        {/* <ConvitesPendentes /> */}
        <Separator orientation="vertical" className="h-5" />
        <ProfileButton />
      </div>
    </div>
  )
}
