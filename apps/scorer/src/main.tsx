import './index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'

/**
 * Quando um chunk JS não é encontrado (bundle antigo em cache após deploy),
 * o Vite emite este evento. Recarregamos a página para buscar os assets novos.
 */
window.addEventListener('vite:preloadError', () => {
  window.location.reload()
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
