// Placeholder de loading. Usar durante os primeiros 800ms de cada tela
// para evitar flash de conteúdo vazio.

interface SkeletonProps {
  /** Classe de largura. Ex: 'w-full', 'w-32', 'w-1/2' */
  width?: string
  /** Classe de altura. Ex: 'h-4', 'h-12' */
  height?: string
  /** Classe de border-radius customizado */
  rounded?: string
  className?: string
}

export function Skeleton({
  width = 'w-full',
  height = 'h-4',
  rounded = 'rounded',
  className = '',
}: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-surface-container ${width} ${height} ${rounded} ${className}`}
      aria-hidden="true"
    />
  )
}

/** Grupo de skeletons para simular uma linha de tabela */
export function SkeletonTableRow({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-surface-container">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton height="h-4" width={i === 0 ? 'w-3/4' : 'w-full'} />
        </td>
      ))}
    </tr>
  )
}

/** Grupo de skeletons para simular cards KPI */
export function SkeletonKpiCard() {
  return (
    <div className="bg-surface-white rounded-2xl shadow-card p-6 flex flex-col gap-3">
      <Skeleton width="w-1/2" height="h-3" />
      <Skeleton width="w-2/3" height="h-8" />
      <Skeleton width="w-1/3" height="h-3" />
    </div>
  )
}
