import Cookies from 'js-cookie'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function Middleware() {
  const location = useLocation()

  useEffect(() => {
    const pathSegments = location.pathname.split('/')

    const isSchoolRoute =
      pathSegments[1] === 'school' && typeof pathSegments[2] === 'string'

    if (isSchoolRoute) {
      const slug = pathSegments[2]

      Cookies.set('school', slug, { path: '/' })
    } else {
      Cookies.remove('school', { path: '/' })
    }
  }, [location])

  return null
}
