import { useMetadataSchool } from '@/hooks/use-metadata'

import { Tabs } from '../tabs'
import { SettingsTabs } from './tabs'

export function Settings() {
  useMetadataSchool('Configurações')

  return (
    <div className="w-full space-y-6">
      <Tabs />

      <div className="space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground text-sm font-light">
            Gerencie as informações gerais e preferências da escola.
          </p>
        </div>

        <SettingsTabs />
      </div>
    </div>
  )
}
