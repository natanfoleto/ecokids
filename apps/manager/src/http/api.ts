import ky, { type AfterResponseHook, BeforeRequestHook } from 'ky'

const beforeRequest: BeforeRequestHook = async (_request) => {
  // await new Promise((resolve) => setTimeout(resolve, 2000))

  const cookies: Record<string, string> = document.cookie.split(';').reduce(
    (acc, cookie) => {
      const [key, value] = cookie.trim().split('=')
      acc[key] = value
      return acc
    },
    {} as Record<string, string>,
  )

  const token = cookies.token || null

  if (token) _request.headers.set('Authorization', `Bearer ${token}`)
}

const afterResponse: AfterResponseHook = async (
  _request,
  _options,
  response,
) => {
  if (response.status === 401) {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    window.location.href = '/sign-in'
  }
}

export const api = ky.create({
  prefixUrl: 'http://localhost:3333',
  hooks: {
    beforeRequest: [beforeRequest],
    afterResponse: [afterResponse],
  },
  credentials: 'include',
})
