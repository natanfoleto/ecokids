import { AlertTriangle } from 'lucide-react'
import { useNavigate, useRouteError } from 'react-router-dom'

/**
 * Exibido pelo React Router quando um erro é lançado dentro de uma rota.
 * Substitui a tela padrão de "desenvolvedor" que o React Router mostraria.
 */
export function RouteError() {
  const error = useRouteError() as Error | null
  const navigate = useNavigate()

  const isDomMutationError =
    error instanceof DOMException ||
    error?.name === 'NotFoundError' ||
    error?.message?.toLowerCase().includes('removechild') ||
    error?.message?.toLowerCase().includes('not a child')

  if (isDomMutationError) {
    window.location.reload()
    return null
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <AlertTriangle className="mb-4 h-12 w-12 text-amber-500" />
      <h1 className="mb-2 text-2xl font-semibold text-gray-900">
        Algo deu errado
      </h1>
      <p className="mb-6 max-w-md text-gray-500">
        Ocorreu um erro inesperado nesta página. Você pode tentar recarregar ou
        voltar para o início.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700"
        >
          Recarregar
        </button>
        <button
          onClick={() => navigate('/')}
          className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Ir para o início
        </button>
      </div>
      {error?.message && (
        <details className="mt-8 max-w-lg text-left">
          <summary className="cursor-pointer text-xs text-gray-400">
            Detalhes do erro
          </summary>
          <pre className="mt-2 overflow-auto whitespace-pre-wrap break-all rounded-lg bg-gray-100 p-4 text-xs text-gray-500">
            {error.toString()}
          </pre>
        </details>
      )}
    </div>
  )
}
