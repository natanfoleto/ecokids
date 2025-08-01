import { useEffect } from 'react'

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
