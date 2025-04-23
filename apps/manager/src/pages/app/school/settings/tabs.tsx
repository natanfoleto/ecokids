import type { GetSchoolResponse } from '@ecokids/types'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useCurrentSchool } from '@/hooks/use-current-school'
import { usePermissions } from '@/hooks/use-permissions'
import { getSchool } from '@/http/schools/get-school'
import { cn } from '@/lib/utils'

import { SchoolForm } from '../school-form'
import LogoForm from './logo-form'
import { ShutdownSchool } from './shutdown-school'

const tabs = [
  { id: 'details', title: 'Detalhes' },
  { id: 'logo', title: 'Logo' },
  { id: 'shutdown', title: 'Desligar escola' },
] as const

type TabId = (typeof tabs)[number]['id']

export function SettingsTabs() {
  const currentSchool = useCurrentSchool()
  const { permissions } = usePermissions()

  const [activeTab, setActiveTab] = useState<TabId>('details')

  const { data } = useQuery<GetSchoolResponse>({
    queryKey: ['schools', currentSchool],
    queryFn: async () => {
      const data = await getSchool({
        params: {
          schoolSlug: currentSchool!,
        },
      })

      return data
    },
    placeholderData: keepPreviousData,
  })

  const canShutdownSchool = permissions?.can('delete', 'School')

  if (!data?.school) return null

  return (
    <div className="flex gap-12">
      <aside className="flex w-80 flex-col gap-1">
        {tabs.map((tab) => {
          if (tab.id === 'shutdown' && !canShutdownSchool) return null

          return (
            <Button
              key={tab.id}
              variant="ghost"
              className={cn(
                'hover:bg-muted cursor-pointer justify-start text-sm font-light',
                {
                  'text-primary bg-muted font-normal': activeTab === tab.id,
                  'text-muted-foreground': activeTab !== tab.id,
                },
              )}
              onClick={() => setActiveTab(tab.id)}
              aria-selected={activeTab === tab.id}
            >
              {tab.title}
            </Button>
          )
        })}
      </aside>

      <div className="flex w-full flex-col gap-8 overflow-auto">
        {activeTab === 'details' && (
          <Card>
            <CardHeader>
              <CardTitle>Detalhes da escola</CardTitle>
              <CardDescription>Atualize os detalhes da escola.</CardDescription>
            </CardHeader>

            <CardContent>
              <SchoolForm isUpdating initialData={data.school} />
            </CardContent>
          </Card>
        )}

        {activeTab === 'logo' && (
          <Card>
            <CardHeader>
              <CardTitle>Logo da escola</CardTitle>
              <CardDescription>Atualize a logo da escola.</CardDescription>
            </CardHeader>

            <CardContent>
              <LogoForm initialData={data.school} />
            </CardContent>
          </Card>
        )}

        {activeTab === 'shutdown' && (
          <Card>
            <CardHeader>
              <CardTitle>Desligar escola</CardTitle>
              <CardDescription>
                Isso apagará todos os dados da escola, incluindo todos as
                turmas, alunos, prêmios e pontuações. Você não pode desfazer
                essa ação.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ShutdownSchool />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
