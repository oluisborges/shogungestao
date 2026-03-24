import { useState, useMemo } from 'react'
import { calcCMVResult, type CMVIngredient, type CMVResult } from '@/utils/cmv'

// Margem alvo padrão para o segmento de delivery de congelados — alinhada com
// benchmarks do setor de alimentação com marketplace (30% cobre custos fixos).
const DEFAULT_TARGET_MARGIN = 30
const DEFAULT_MARKETPLACE_COMMISSION = 12
const DEFAULT_CARD_FEE = 3.5

export interface CMVFormIngredient extends CMVIngredient {
  /** Nome exibido no formulário — pode ser selecionado do inventário ou digitado */
  name: string
}

export interface UseCMVCalculatorReturn {
  productName: string
  setProductName: (name: string) => void
  ingredients: CMVFormIngredient[]
  addIngredient: () => void
  updateIngredient: (id: string, field: keyof CMVFormIngredient, value: string | number) => void
  removeIngredient: (id: string) => void
  packagingCost: number
  setPackagingCost: (cost: number) => void
  marketplaceCommission: number
  setMarketplaceCommission: (value: number) => void
  cardFee: number
  setCardFee: (value: number) => void
  targetMargin: number
  setTargetMargin: (value: number) => void
  result: CMVResult
  hasIngredients: boolean
}

const createEmptyIngredient = (): CMVFormIngredient => ({
  id: `ing-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  name: '',
  cost: 0,
})

export function useCMVCalculator(): UseCMVCalculatorReturn {
  const [productName, setProductName] = useState('')
  const [ingredients, setIngredients] = useState<CMVFormIngredient[]>([createEmptyIngredient()])
  const [packagingCost, setPackagingCost] = useState(0)
  const [marketplaceCommission, setMarketplaceCommission] = useState(DEFAULT_MARKETPLACE_COMMISSION)
  const [cardFee, setCardFee] = useState(DEFAULT_CARD_FEE)
  const [targetMargin, setTargetMargin] = useState(DEFAULT_TARGET_MARGIN)

  const addIngredient = () => {
    setIngredients(prev => [...prev, createEmptyIngredient()])
  }

  const updateIngredient = (id: string, field: keyof CMVFormIngredient, value: string | number) => {
    setIngredients(prev =>
      prev.map(ingredient =>
        ingredient.id === id ? { ...ingredient, [field]: value } : ingredient,
      ),
    )
  }

  const removeIngredient = (id: string) => {
    setIngredients(prev => prev.filter(ingredient => ingredient.id !== id))
  }

  // Resultado calculado inline — sem useEffect — porque depende apenas de estado síncrono.
  // Isso garante que o card de resultado atualiza instantaneamente a cada keystroke.
  const result = useMemo(
    () =>
      calcCMVResult({
        ingredients,
        packagingCost,
        marketplaceCommission,
        cardFee,
        targetMargin,
      }),
    [ingredients, packagingCost, marketplaceCommission, cardFee, targetMargin],
  )

  return {
    productName,
    setProductName,
    ingredients,
    addIngredient,
    updateIngredient,
    removeIngredient,
    packagingCost,
    setPackagingCost,
    marketplaceCommission,
    setMarketplaceCommission,
    cardFee,
    setCardFee,
    targetMargin,
    setTargetMargin,
    result,
    hasIngredients: ingredients.length > 0,
  }
}
