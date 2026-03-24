import { Loader2 } from 'lucide-react'
import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  /** Mostra spinner e desabilita o botão durante operações assíncronas */
  loading?: boolean
  /** Ícone Lucide renderizado à esquerda do texto */
  leftIcon?: React.ReactNode
  /** Ícone Lucide renderizado à direita do texto */
  rightIcon?: React.ReactNode
}

const VARIANT_CLASSES: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:   'bg-gradient-to-br from-brand-primary to-brand-primary-dim text-white font-headline font-semibold',
  secondary: 'bg-surface-container text-brand-primary font-body font-semibold',
  ghost:     'text-text-secondary hover:bg-surface-container font-body',
  danger:    'bg-danger-bg text-danger font-body font-semibold hover:bg-danger hover:text-white',
}

export function Button({
  variant = 'primary',
  loading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <button
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-xl px-5 py-2.5 text-sm
        transition-all duration-200
        hover:opacity-90 active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        min-h-[44px]
        ${VARIANT_CLASSES[variant]}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
      )}
      {children}
      {!loading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  )
}
