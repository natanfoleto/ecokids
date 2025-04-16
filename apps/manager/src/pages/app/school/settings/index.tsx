import { Tabs } from '../tabs'
import { SettingsTabs } from './tabs'

export function Settings() {
  return (
    <div className="w-full space-y-4">
      <Tabs />

      <div className="space-y-10">
        <h1 className="text-xl font-medium">Configurações</h1>

        <SettingsTabs />
      </div>
    </div>
  )
}
