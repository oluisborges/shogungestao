import { CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react'
import type { ToastItem, ToastType } from '@/hooks/useToast'

// Configuração visual por tipo de toast.
// Vermelho reservado para erros (não confundir com danger de alerta crítico de estoque).
const TOAST_CONFIG: Record<
  ToastType,
  { icon: typeof CheckCircle; borderClass: string; iconClass: string }
> = {
  success: { icon: CheckCircle,   borderClass: 'border-l-4 border-success', iconClass: 'text-success' },
  error:   { icon: XCircle,       borderClass: 'border-l-4 border-danger',  iconClass: 'text-danger'  },
  warning: { icon: AlertTriangle, borderClass: 'border-l-4 border-warning', iconClass: 'text-warning' },
}

interface ToastCardProps {
  toast: ToastItem
  onDismiss: (id: string) => void
}

function ToastCard({ toast, onDismiss }: ToastCardProps) {
  const config = TOAST_CONFIG[toast.type]
  const Icon = config.icon

  return (
    <div
      className={`
        relative flex items-start gap-3 bg-surface-white rounded-xl shadow-card px-4 py-3
        min-w-[280px] max-w-sm overflow-hidden
        ${config.borderClass}
        animate-slide-in-right
      `}
      role="alert"
    >
      <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${config.iconClass}`} />
      <p className="font-body text-sm text-text-main flex-1 pr-4">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="absolute top-2 right-2 text-text-disabled hover:text-text-secondary transition-colors"
        aria-label="Fechar notificação"
      >
        <X className="w-4 h-4" />
      </button>
      {/* Barra de progresso que retrai em 4s — alinhada com TOAST_DURATION_MS em useToast */}
      <div className="absolute bottom-0 left-0 h-0.5 bg-surface-container w-full">
        <div className="h-full bg-surface-highest animate-shrink" />
      </div>
    </div>
  )
}

interface ToastContainerProps {
  toasts: ToastItem[]
  onDismiss: (id: string) => void
}

/** Renderiza a fila de toasts no canto inferior direito da tela */
export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div
      className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3"
      aria-live="polite"
      aria-label="Notificações"
    >
      {toasts.map(toast => (
        <ToastCard key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}
