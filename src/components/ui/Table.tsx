// Componente de tabela genérico. Define apenas estrutura e estilo —
// não conhece os dados. Cada página passa suas colunas e linhas.

interface TableColumn<T> {
  key: string
  header: string
  /** Renderiza o conteúdo da célula para cada row */
  render: (row: T) => React.ReactNode
  /** Classe CSS adicional para a célula de cabeçalho e corpo */
  className?: string
}

interface TableProps<T> {
  columns: TableColumn<T>[]
  data: T[]
  /** Chave única por linha — deve ser uma propriedade da row que seja string */
  rowKey: (row: T) => string
  /** Slot renderizado quando data está vazio */
  emptyState?: React.ReactNode
  /** Quando definido, aplica borda colorida à esquerda da linha */
  getRowAccentClass?: (row: T) => string | undefined
}

export function Table<T>({ columns, data, rowKey, emptyState, getRowAccentClass }: TableProps<T>) {
  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-surface-container">
            {columns.map(col => (
              <th
                key={col.key}
                className={`px-4 py-3 text-left font-body text-xs font-semibold uppercase tracking-wider text-text-secondary ${col.className ?? ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => {
            const accentClass = getRowAccentClass?.(row)
            return (
              <tr
                key={rowKey(row)}
                className={`
                  border-b border-surface-container
                  ${index % 2 === 0 ? 'bg-surface-white' : 'bg-surface/50'}
                  hover:bg-surface-low transition-colors
                  ${accentClass ? `border-l-4 ${accentClass}` : ''}
                `}
              >
                {columns.map(col => (
                  <td key={col.key} className={`px-4 py-3 font-body text-sm text-text-main ${col.className ?? ''}`}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
