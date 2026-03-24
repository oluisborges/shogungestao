import type { MeasurementUnit } from './common'

export type RecipeCategory = 'main_course' | 'dessert' | 'appetizer' | 'beverage'

export interface RecipeIngredient {
  id: string
  name: string
  quantity: number
  unit: MeasurementUnit
  /** Custo por unidade de medida (ex: R$ por kg) */
  unitCost: number
}

export interface Recipe {
  id: string
  name: string
  category: RecipeCategory
  /** Número de porções que a receita produz */
  yield: number
  ingredients: RecipeIngredient[]
  instructions: string
  imageUrl?: string
  createdAt: string
}

/** Entrada no histórico de precificação CMV */
export interface CMVEntry {
  id: string
  productName: string
  date: string
  /** Percentual do CMV sobre o preço de venda */
  cmvPercentage: number
  suggestedPrice: number
  /** Margem líquida em R$ */
  netMarginAmount: number
}

// Labels de exibição para as categorias de receita
export const RECIPE_CATEGORY_LABELS: Record<RecipeCategory, string> = {
  main_course: 'Prato Principal',
  dessert:     'Sobremesa',
  appetizer:   'Entrada',
  beverage:    'Bebida',
}
