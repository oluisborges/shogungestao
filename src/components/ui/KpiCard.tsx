import type { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card } from './Card'
import { Badge } from './Badge'

interface KpiCardProps {
  label: string
  value: string
  icon: LucideIcon
  /** Variação percentual numérica. Positivo = verde, negativo = vermelho por padrão. */
  variation?: number
  /** Quando true, inverte a lógica de cor. Ex: CMV — número menor é melhor. */
  invertVariationColor?: boolean
  /** Substitui a exibição de variação percentual por um badge customizado */
  badgeLabel?: string
  badgeVariant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  /** Cor do ícone do KPI */
  iconColorClass?: string
}

export function KpiCard({
  label,
  value,
  icon: Icon,
  variation,
  invertVariationColor = false,
  badgeLabel,
  badgeVariant,
  iconColorClass = 'text-brand-primary',
}: KpiCardProps) {
  // Determina se a variação é "boa" considerando a inversão de cor
  const isPositiveChange = variation !== undefined
    ? invertVariationColor ? variation < 0 : variation > 0
    : false

  const variationColorClass = isPositiveChange ? 'text-success' : 'text-danger'

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2 flex-1">
          <span className="font-body text-xs font-semibold uppercase tracking-wider text-text-secondary">
            {label}
          </span>
          <span className="font-headline font-bold text-2xl text-text-main">
            {value}
          </span>
          {badgeLabel && badgeVariant ? (
            <Badge variant={badgeVariant}>{badgeLabel}</Badge>
          ) : variation !== undefined ? (
            <div className={`flex items-center gap-1 text-xs font-semibold font-body ${variationColorClass}`}>
              {isPositiveChange
                ? <TrendingUp className="w-3.5 h-3.5" />
                : <TrendingDown className="w-3.5 h-3.5" />
              }
              <span>
                {variation > 0 ? '+' : ''}{variation}% vs. mês anterior
              </span>
            </div>
          ) : null}
        </div>
        <div className="w-11 h-11 rounded-xl bg-surface-container flex items-center justify-center flex-shrink-0">
          <Icon className={`w-5 h-5 ${iconColorClass}`} />
        </div>
      </div>
    </Card>
  )
}
