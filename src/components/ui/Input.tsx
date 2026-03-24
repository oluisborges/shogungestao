import { Eye, EyeOff } from 'lucide-react'
import { useState, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Label sempre visível acima do campo — nunca usar apenas placeholder como label */
  label: string
  error?: string
  /** Adiciona toggle mostrar/ocultar para campos de senha */
  passwordToggle?: boolean
}

export function Input({
  label,
  error,
  passwordToggle = false,
  type = 'text',
  id,
  className = '',
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')
  const resolvedType = passwordToggle ? (showPassword ? 'text' : 'password') : type

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="font-body text-xs font-semibold uppercase tracking-wider text-text-secondary">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type={resolvedType}
          className={`
            w-full bg-surface-low rounded-xl px-4 py-3 text-sm font-body text-text-main
            focus:outline-none focus:ring-2 focus:ring-brand-green/30
            placeholder:text-text-disabled
            min-h-[44px]
            ${error ? 'ring-2 ring-danger/40' : ''}
            ${passwordToggle ? 'pr-11' : ''}
            ${className}
          `}
          {...props}
        />
        {passwordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-disabled hover:text-text-secondary transition-colors"
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && (
        <p className="font-body text-xs text-danger">{error}</p>
      )}
    </div>
  )
}
