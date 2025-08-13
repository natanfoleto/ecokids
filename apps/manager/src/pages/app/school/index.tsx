import { useMetadataSchool } from '@/hooks/use-metadata'

import { Tabs } from './tabs'

export function School() {
  useMetadataSchool('Dashboard')

  return (
    <div className="space-y-4">
      <Tabs />

      <div className="space-y-10">
        <h1 className="text-xl font-medium">Página em desenvolvimento</h1>
      </div>
    </div>
  )
}
