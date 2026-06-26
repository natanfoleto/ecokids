import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * ErrorBoundary global — captura erros de reconciliação do React
 * causados por extensões de browser que modificam o DOM.
 *
 * Quando o erro é o clássico "removeChild"/"NotFoundError",
 * recarrega a página automaticamente para recuperar o estado.
 * Para outros erros, exibe uma tela amigável com botão de reload.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    const isDomMutationError =
      error instanceof DOMException ||
      error.name === 'NotFoundError' ||
      error.message.toLowerCase().includes('removeChild') ||
      error.message.toLowerCase().includes('not a child')

    if (isDomMutationError) {
      // Extensão de browser modificou o DOM — recarrega silenciosamente
      console.warn(
        '[ErrorBoundary] DOM mutation error detected (likely a browser extension). Reloading...',
        error,
        info,
      )
      window.location.reload()
      return
    }

    console.error('[ErrorBoundary] Unhandled error:', error, info)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '2rem',
            textAlign: 'center',
            fontFamily: 'system-ui, sans-serif',
            background: '#f8fafc',
          }}
        >
          <div
            style={{
              fontSize: '3rem',
              marginBottom: '1rem',
            }}
          >
            ⚠️
          </div>
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#0f172a',
              marginBottom: '0.5rem',
            }}
          >
            Algo deu errado
          </h1>
          <p
            style={{
              color: '#64748b',
              marginBottom: '1.5rem',
              maxWidth: '400px',
            }}
          >
            Ocorreu um erro inesperado no aplicativo. Recarregue a página para
            continuar.
          </p>
          <button
            onClick={this.handleReload}
            style={{
              padding: '0.625rem 1.5rem',
              background: '#16a34a',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Recarregar página
          </button>
          {this.state.error && (
            <details
              style={{
                marginTop: '2rem',
                maxWidth: '600px',
                textAlign: 'left',
              }}
            >
              <summary
                style={{
                  cursor: 'pointer',
                  color: '#94a3b8',
                  fontSize: '0.8rem',
                }}
              >
                Detalhes do erro
              </summary>
              <pre
                style={{
                  marginTop: '0.5rem',
                  padding: '1rem',
                  background: '#f1f5f9',
                  borderRadius: '0.5rem',
                  fontSize: '0.75rem',
                  color: '#475569',
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                }}
              >
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
