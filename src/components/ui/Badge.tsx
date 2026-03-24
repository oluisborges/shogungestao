// Badges de status reutilizáveis. Usados em tabelas, cards e listas.
// Variantes mapeadas semanticamente — não usar cores hardcoded no JSX.

interface BadgeProps {
  variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  children: React.ReactNode
  className?: string
}

const VARIANT_CLASSES: Record<BadgeProps['variant'], string> = {
  success: 'bg-success-bg text-success',
  warning: 'bg-warning-bg text-warning',
  danger:  'bg-danger-bg text-danger',
  info:    'bg-info-bg text-info',
  neutral: 'bg-surface-container text-text-secondary',
}

export function Badge({ variant, children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full font-body ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
