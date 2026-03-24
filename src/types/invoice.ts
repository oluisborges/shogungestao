export type InvoiceStatus = 'paid' | 'pending' | 'overdue'

export interface Supplier {
  id: string
  name: string
  /** Cor de fundo do avatar com as iniciais do fornecedor */
  avatarColor: string
}

export interface Invoice {
  id: string
  number: string
  supplier: Supplier
  issueDate: string
  dueDate: string
  totalAmount: number
  status: InvoiceStatus
  /** Categoria de custo para classificação contábil */
  costCategory: string
  description?: string
  /** URL do arquivo anexado (PDF ou imagem) */
  attachmentUrl?: string
}

// Labels de exibição para os status de nota fiscal
export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  paid:    'Paga',
  pending: 'Pendente',
  overdue: 'Vencida',
}
