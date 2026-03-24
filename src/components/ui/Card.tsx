// Wrapper de card com elevação visual via sombra suave baseada no verde da marca.
// Usar para todos os elementos "flutuantes" sobre o bg-surface da página.

interface CardProps {
  children: React.ReactNode
  className?: string
  /** Quando true, adiciona padding padrão interno */
  padded?: boolean
}

export function Card({ children, className = '', padded = true }: CardProps) {
  return (
    <div
      className={`bg-surface-white rounded-2xl shadow-card ${padded ? 'p-6' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
