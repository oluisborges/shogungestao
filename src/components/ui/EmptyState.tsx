import type { LucideIcon } from 'lucide-react'
import { Button } from './Button'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  /** Label do botão de ação primária. Omitir para não mostrar botão. */
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-text-disabled" />
      </div>
      <h3 className="font-headline font-semibold text-lg text-text-main mb-2">{title}</h3>
      <p className="font-body text-sm text-text-secondary max-w-xs mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
