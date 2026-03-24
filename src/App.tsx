import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from '@/router'
import { ToastProvider } from '@/contexts/ToastContext'

/**
 * Componente raiz. Responsável apenas por:
 * 1. Prover o roteador (BrowserRouter)
 * 2. Prover o sistema de toast globalmente (ToastProvider)
 *
 * Qualquer novo provider de contexto deve ser adicionado aqui,
 * não dentro das páginas.
 */
export function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </BrowserRouter>
  )
}
