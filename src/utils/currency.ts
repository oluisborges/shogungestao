// Formatação de moeda para o padrão brasileiro (pt-BR).
// Centralizado aqui para garantir consistência em todo o app.

const BRL_FORMATTER = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const NUMBER_FORMATTER = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** Formata um valor numérico como moeda brasileira. Ex: 1234.5 → "R$ 1.234,50" */
export function formatCurrency(value: number): string {
  return BRL_FORMATTER.format(value)
}

/** Formata apenas o número sem o símbolo R$. Ex: 1234.5 → "1.234,50" */
export function formatNumber(value: number): string {
  return NUMBER_FORMATTER.format(value)
}

/** Formata um percentual com uma casa decimal. Ex: 32.4 → "32,4%" */
export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals).replace('.', ',')}%`
}

/**
 * Converte uma string de moeda pt-BR de volta para número.
 * Necessário ao parsear inputs onde o usuário digita "1.234,50".
 */
export function parseCurrencyInput(value: string): number {
  const normalized = value
    .replace(/[R$\s]/g, '')   // remove símbolo e espaços
    .replace(/\./g, '')        // remove separadores de milhar
    .replace(',', '.')         // converte vírgula decimal para ponto

  const parsed = parseFloat(normalized)
  return isNaN(parsed) ? 0 : parsed
}
