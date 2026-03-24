import { useState, useMemo } from 'react'

// 10 itens por página é o padrão para tabelas de backoffice —
// equilibra densidade de informação com espaço visual disponível.
const DEFAULT_ITEMS_PER_PAGE = 10

export interface UsePaginationReturn<T> {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  paginatedItems: T[]
  goToPage: (page: number) => void
  goToNextPage: () => void
  goToPreviousPage: () => void
  canGoNext: boolean
  canGoPrevious: boolean
}

export function usePagination<T>(
  items: T[],
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage))

  // Recalcula paginatedItems apenas quando items, currentPage ou itemsPerPage mudam
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return items.slice(startIndex, startIndex + itemsPerPage)
  }, [items, currentPage, itemsPerPage])

  const goToPage = (page: number) => {
    const clampedPage = Math.max(1, Math.min(page, totalPages))
    setCurrentPage(clampedPage)
  }

  const goToNextPage = () => goToPage(currentPage + 1)
  const goToPreviousPage = () => goToPage(currentPage - 1)

  return {
    currentPage,
    totalPages,
    totalItems: items.length,
    itemsPerPage,
    paginatedItems,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    canGoNext: currentPage < totalPages,
    canGoPrevious: currentPage > 1,
  }
}
