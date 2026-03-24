import type { MeasurementUnit } from './common'

export type StockStatus = 'normal' | 'low' | 'critical'

export type InventoryCategory =
  | 'proteins'
  | 'grains'
  | 'packaging'
  | 'seasonings'
  | 'vegetables'
  | 'dairy'

export interface InventoryItem {
  id: string
  name: string
  category: InventoryCategory
  unit: MeasurementUnit
  currentQuantity: number
  minimumQuantity: number
  /** Derivado: critical quando currentQuantity < minimumQuantity * 0.5, low quando < minimumQuantity */
  status: StockStatus
  unitCost: number
  lastUpdated: string
  imageUrl?: string
}

export interface InventoryMovement {
  id: string
  itemId: string
  itemName: string
  /** Positivo = entrada, negativo = saída */
  quantity: number
  type: 'entry' | 'exit'
  reason: string
  date: string
}

// Labels de exibição para as categorias de estoque
export const INVENTORY_CATEGORY_LABELS: Record<InventoryCategory, string> = {
  proteins:   'Proteínas',
  grains:     'Grãos e Cereais',
  packaging:  'Embalagens',
  seasonings: 'Temperos',
  vegetables: 'Verduras e Legumes',
  dairy:      'Laticínios',
}
