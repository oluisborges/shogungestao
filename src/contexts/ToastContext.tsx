import { createContext, useContext } from 'react'
import { useToast, type UseToastReturn } from '@/hooks/useToast'
import { ToastContainer } from '@/components/ui/Toast'

// Contexto para disponibilizar addToast em qualquer componente da árvore
const ToastContext = createContext<UseToastReturn | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toast = useToast()

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toast.toasts} onDismiss={toast.removeToast} />
    </ToastContext.Provider>
  )
}

/**
 * Hook para usar o sistema de toast em qualquer componente.
 * Garante que ToastProvider esteja na árvore antes de chamar.
 */
export function useToastContext(): UseToastReturn {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToastContext deve ser usado dentro de <ToastProvider>')
  }
  return ctx
}
