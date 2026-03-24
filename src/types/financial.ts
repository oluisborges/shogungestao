import type { PaymentMethod } from './common'

export type TransactionType = 'revenue' | 'expense'

export type TransactionStatus = 'paid' | 'pending' | 'overdue'

export type FinancialCategory =
  | 'ifood_repasse'
  | 'direct_sale'
  | 'ingredients'
  | 'packaging'
  | 'rent'
  | 'energy'
  | 'labor'
  | 'marketing'
  | 'equipment'
  | 'other'

export interface Transaction {
  id: string
  type: TransactionType
  description: string
  /** Texto de apoio exibido abaixo da descrição na tabela */
  subtitle?: string
  category: FinancialCategory
  amount: number
  date: string
  paymentMethod: PaymentMethod
  status: TransactionStatus
}

export interface MonthlyData {
  /** Formato: "Jan", "Fev", etc. */
  month: string
  revenue: number
  expenses: number
}

export interface FinancialSummary {
  currentBalance: number
  monthRevenue: number
  monthExpenses: number
  projectedProfit: number
}

// Labels de exibição para categorias financeiras
export const FINANCIAL_CATEGORY_LABELS: Record<FinancialCategory, string> = {
  ifood_repasse: 'Repasse iFood',
  direct_sale:   'Venda Direta',
  ingredients:   'Insumos',
  packaging:     'Embalagens',
  rent:          'Aluguel',
  energy:        'Energia',
  labor:         'Mão de Obra',
  marketing:     'Marketing',
  equipment:     'Equipamentos',
  other:         'Outros',
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  pix:           'Pix',
  credit_card:   'Cartão de Crédito',
  debit_card:    'Cartão de Débito',
  cash:          'Dinheiro',
  bank_transfer: 'Transferência',
}
