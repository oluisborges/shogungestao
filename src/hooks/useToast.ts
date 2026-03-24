import { useState, useCallback } from 'react'

export type ToastType = 'success' | 'error' | 'warning'

export interface ToastItem {
  id: string
  type: ToastType
  message: string
  /** Timestamp de criação — usado para calcular a barra de progresso */
  createdAt: number
}

// Auto-dismiss após 4 segundos, alinhado com a animação CSS de progresso
const TOAST_DURATION_MS = 4000

export interface UseToastReturn {
  toasts: ToastItem[]
  addToast: (type: ToastType, message: string) => void
  removeToast: (id: string) => void
}

export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const addToast = useCallback(
    (type: ToastType, message: string) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`
      const newToast: ToastItem = { id, type, message, createdAt: Date.now() }

      setToasts(prev => [...prev, newToast])

      // Remove automaticamente após a duração definida
      setTimeout(() => removeToast(id), TOAST_DURATION_MS)
    },
    [removeToast],
  )

  return { toasts, addToast, removeToast }
}
