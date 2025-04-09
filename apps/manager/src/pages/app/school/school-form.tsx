import { type SaveSchoolBody, saveSchoolBodySchema } from '@ecokids/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

interface SchoolFormProps {
  isUpdating?: boolean
  initialData: SaveSchoolBody
}

export function SchoolForm({ isUpdating, initialData }: SchoolFormProps) {
  const defaultValues: SaveSchoolBody = initialData || {
    name: '',
    domain: null,
    shouldAttachUsersByDomain: false,
  }

  const { register } = useForm<SaveSchoolBody>({
    resolver: zodResolver(saveSchoolBodySchema),
    defaultValues,
  })
}
