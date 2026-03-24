// Fórmulas de CMV (Custo da Mercadoria Vendida) puras e testáveis.
// Sem dependências de estado ou contexto — apenas matemática.
// Centralizado aqui para que a lógica possa ser validada sem montar componentes.

export interface CMVIngredient {
  id: string
  name: string
  cost: number
}

export interface CMVInputs {
  ingredients: CMVIngredient[]
  packagingCost: number
  /** Percentual de comissão do marketplace (ex: iFood). Ex: 12 = 12% */
  marketplaceCommission: number
  /** Percentual de taxa de cartão/administração */
  cardFee: number
  /** Margem alvo em percentual. Padrão: 30 */
  targetMargin: number
}

export interface CMVResult {
  totalProductionCost: number
  suggestedPrice: number
  cmvAmount: number
  cmvPercentage: number
  netMarginAmount: number
  netMarginPercentage: number
  /** Preço calculado para canal direto (sem comissão de marketplace) */
  directChannelPrice: number
  /** Margem no canal direto */
  directChannelMargin: number
}

/** Soma todos os custos de insumos mais embalagem */
export function calcTotalProductionCost(
  ingredients: CMVIngredient[],
  packagingCost: number,
): number {
  const ingredientTotal = ingredients.reduce((sum, ingredient) => sum + ingredient.cost, 0)
  return ingredientTotal + packagingCost
}

/**
 * Calcula o preço sugerido para atingir a margem alvo.
 * Fórmula: totalCost / (1 - (targetMargin + marketplaceCommission + cardFee) / 100)
 * O denominador representa a fatia do preço que sobra depois de todos os custos percentuais.
 */
export function calcSuggestedPrice(
  totalCost: number,
  targetMargin: number,
  marketplaceCommission: number,
  cardFee: number,
): number {
  const percentageCosts = (targetMargin + marketplaceCommission + cardFee) / 100
  // Evita divisão por zero ou preços negativos quando custos > 100%
  if (percentageCosts >= 1) return totalCost * 3
  return totalCost / (1 - percentageCosts)
}

/** Percentual do CMV em relação ao preço de venda */
export function calcCMVPercentage(totalCost: number, sellingPrice: number): number {
  if (sellingPrice <= 0) return 0
  return (totalCost / sellingPrice) * 100
}

/** Margem líquida em R$ após descontar custos variáveis percentuais */
export function calcNetMargin(
  sellingPrice: number,
  totalCost: number,
  marketplaceCommission: number,
  cardFee: number,
): number {
  const variableCosts = sellingPrice * ((marketplaceCommission + cardFee) / 100)
  return sellingPrice - totalCost - variableCosts
}

/** Calcula todos os resultados de uma vez, retornando objeto completo */
export function calcCMVResult(inputs: CMVInputs): CMVResult {
  const totalProductionCost = calcTotalProductionCost(inputs.ingredients, inputs.packagingCost)

  const suggestedPrice = calcSuggestedPrice(
    totalProductionCost,
    inputs.targetMargin,
    inputs.marketplaceCommission,
    inputs.cardFee,
  )

  const cmvPercentage = calcCMVPercentage(totalProductionCost, suggestedPrice)

  const netMarginAmount = calcNetMargin(
    suggestedPrice,
    totalProductionCost,
    inputs.marketplaceCommission,
    inputs.cardFee,
  )

  const netMarginPercentage = suggestedPrice > 0 ? (netMarginAmount / suggestedPrice) * 100 : 0

  // Canal direto: mesma margem alvo, mas sem comissão de marketplace
  const directChannelPrice = calcSuggestedPrice(
    totalProductionCost,
    inputs.targetMargin,
    0,
    inputs.cardFee,
  )

  const directChannelMargin = calcNetMargin(directChannelPrice, totalProductionCost, 0, inputs.cardFee)

  return {
    totalProductionCost,
    suggestedPrice,
    cmvAmount: totalProductionCost,
    cmvPercentage,
    netMarginAmount,
    netMarginPercentage,
    directChannelPrice,
    directChannelMargin,
  }
}
