import { useEffect } from 'react'

import { useCurrentSchool } from './use-school'

export function useMetadata(title: string, description?: string) {
  useEffect(() => {
    document.title = title

    if (description) {
      let descriptionTag = document.querySelector('meta[name="description"]')

      if (!descriptionTag) {
        descriptionTag = document.createElement('meta')
        descriptionTag.setAttribute('name', 'description')
        document.head.appendChild(descriptionTag)
      }

      descriptionTag.setAttribute('content', description)
    }
  }, [title, description])
}

export function useMetadataSchool(tab: string) {
  const { school } = useCurrentSchool()

  const title = `${school?.name || 'Escola'} - ${tab}`
  const description = `${tab} da escola.`

  useMetadata(title, description)
}
