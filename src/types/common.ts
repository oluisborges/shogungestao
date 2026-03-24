// Tipos genéricos reutilizados em todo o projeto.
// Manter apenas tipos verdadeiramente compartilhados aqui.

export type Status = 'active' | 'inactive'

export type PaymentMethod =
  | 'pix'
  | 'credit_card'
  | 'debit_card'
  | 'cash'
  | 'bank_transfer'

export type MeasurementUnit = 'kg' | 'g' | 'L' | 'ml' | 'un' | 'cx'

export interface DateRange {
  start: string
  end: string
}

export interface PaginationState {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

export type SortDirection = 'asc' | 'desc'

export interface SortState<T extends string> {
  field: T
  direction: SortDirection
}
