import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

/**
 * Formata uma string ISO ou objeto Date para exibição no padrão brasileiro.
 * Ex: "2024-03-15" → "15/03/2024"
 */
export function formatDate(dateStr: string, pattern = 'dd/MM/yyyy'): string {
  return format(parseISO(dateStr), pattern, { locale: ptBR })
}

/**
 * Formata data com hora. Ex: "2024-03-15T14:30:00" → "15/03/2024 às 14:30"
 */
export function formatDateTime(dateStr: string): string {
  return format(parseISO(dateStr), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
}

/**
 * Exibe tempo relativo em pt-BR.
 * Ex: "há 2 horas", "há 3 dias"
 */
export function formatRelativeTime(dateStr: string): string {
  return formatDistanceToNow(parseISO(dateStr), { locale: ptBR, addSuffix: true })
}

/**
 * Saudação dinâmica baseada no horário atual.
 * Bom dia: 05h–12h | Boa tarde: 12h–18h | Boa noite: 18h–05h
 */
export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'Bom dia'
  if (hour >= 12 && hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

/**
 * Retorna a data atual formatada por extenso em pt-BR.
 * Ex: "segunda-feira, 15 de março de 2024"
 */
export function formatFullDate(date = new Date()): string {
  return format(date, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })
}

/**
 * Retorna a data atual no formato curto para exibição na TopBar.
 * Ex: "15 de mar. de 2024"
 */
export function formatShortDate(date = new Date()): string {
  return format(date, "dd 'de' MMM. 'de' yyyy", { locale: ptBR })
}
