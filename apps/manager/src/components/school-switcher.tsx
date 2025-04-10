import { useQuery } from '@tanstack/react-query'
import { ChevronsUpDown, PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { getSchools } from '@/http/schools/get-schools'
import { CreateSchool } from '@/pages/app/school/create-school'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export function SchoolSwitcher() {
  const { slug } = useParams()

  const [createSchool, setCreateSchool] = useState(false)

  function toggleCreateSchool() {
    setCreateSchool(!createSchool)
  }

  const { data } = useQuery({
    queryKey: ['schools'],
    queryFn: () => getSchools(),
  })

  const currentSchool = data?.schools.find((school) => school.slug === slug)

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus-visible:ring-primary flex max-w-[226px] items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-1">
          {currentSchool ? (
            <>
              <Avatar className="size-5">
                {currentSchool.logoUrl && (
                  <AvatarImage src={currentSchool.logoUrl} />
                )}
                <AvatarFallback />
              </Avatar>

              <span className="truncate text-left">{currentSchool.name}</span>
            </>
          ) : (
            <span className="text-muted-foreground">Selecionar escola</span>
          )}

          <ChevronsUpDown className="text-muted-foreground ml-auto size-4" />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          alignOffset={-16}
          sideOffset={12}
          className="w-[250px]"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel>Escolas</DropdownMenuLabel>

            {data?.schools.map((school) => {
              return (
                <DropdownMenuItem key={school.id} asChild>
                  <Link to={`/school/${school.slug}`}>
                    <Avatar className="mr-2 size-5">
                      {school.logoUrl && <AvatarImage src={school.logoUrl} />}
                      <AvatarFallback />
                    </Avatar>

                    <span className="line-clamp-1">{school.name}</span>
                  </Link>
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <div onClick={toggleCreateSchool}>
              <PlusCircle className="mr-2 size-4" />
              Criar escola
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateSchool open={createSchool} onClose={toggleCreateSchool} />
    </div>
  )
}
