import { useState, useMemo } from 'react'
import { Package, AlertTriangle, AlertOctagon, Plus, PlusCircle, MinusCircle, Edit2, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { useToastContext } from '@/contexts/ToastContext'
import { usePagination } from '@/hooks/usePagination'
import {
  inventoryItemsMock,
  inventoryMovementsMock,
} from '@/data/mock'
import { formatRelativeTime } from '@/utils/date'
import {
  INVENTORY_CATEGORY_LABELS,
  type InventoryItem,
  type InventoryCategory,
  type StockStatus,
} from '@/types/inventory'
import type { MeasurementUnit } from '@/types/common'

const CATEGORIES: InventoryCategory[] = ['proteins', 'grains', 'packaging', 'seasonings', 'vegetables', 'dairy']
const UNITS: MeasurementUnit[] = ['kg', 'g', 'L', 'ml', 'un', 'cx']

const STATUS_BADGE: Record<StockStatus, { label: string; variant: 'success' | 'warning' | 'danger' }> = {
  normal:   { label: 'Normal',   variant: 'success' },
  low:      { label: 'Baixo',    variant: 'warning' },
  critical: { label: 'Crítico',  variant: 'danger'  },
}

const ROW_ACCENT: Record<StockStatus, string | undefined> = {
  normal:   undefined,
  low:      'border-warning',
  critical: 'border-danger',
}

// ── Pagination controls ───────────────────────────────────────────────────────

interface PaginationControlsProps {
  currentPage: number
  totalItems: number
  itemsPerPage: number
  onPrev: () => void
  onNext: () => void
  canPrev: boolean
  canNext: boolean
}

function PaginationControls({
  currentPage, totalItems, itemsPerPage,
  onPrev, onNext, canPrev, canNext,
}: PaginationControlsProps) {
  const start = (currentPage - 1) * itemsPerPage + 1
  const end = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-surface-container">
      <p className="font-body text-sm text-text-secondary">
        Mostrando <strong className="text-text-main">{start}–{end}</strong> de <strong className="text-text-main">{totalItems}</strong>
      </p>
      <div className="flex gap-2">
        <button
          onClick={onPrev}
          disabled={!canPrev}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-text-secondary hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Página anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={onNext}
          disabled={!canNext}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-text-secondary hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Próxima página"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// ── Página principal ──────────────────────────────────────────────────────────

export function Estoque() {
  const toast = useToastContext()
  const [items, setItems] = useState<InventoryItem[]>(inventoryItemsMock)
  const [filterCategory, setFilterCategory] = useState<InventoryCategory | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<StockStatus | 'all'>('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Form state do modal
  const [formName, setFormName] = useState('')
  const [formCategory, setFormCategory] = useState<InventoryCategory>('proteins')
  const [formUnit, setFormUnit] = useState<MeasurementUnit>('kg')
  const [formQty, setFormQty] = useState(0)
  const [formMinQty, setFormMinQty] = useState(0)

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const catMatch = filterCategory === 'all' || item.category === filterCategory
      const statusMatch = filterStatus === 'all' || item.status === filterStatus
      return catMatch && statusMatch
    })
  }, [items, filterCategory, filterStatus])

  const {
    paginatedItems,
    currentPage,
    totalItems,
    itemsPerPage,
    goToNextPage,
    goToPreviousPage,
    canGoNext,
    canGoPrevious,
  } = usePagination(filteredItems)

  const lowCount = items.filter(i => i.status === 'low').length
  const criticalCount = items.filter(i => i.status === 'critical').length

  const handleAddItem = () => {
    if (!formName.trim()) {
      toast.addToast('warning', 'Informe o nome do insumo.')
      return
    }
    const status: StockStatus = formQty < formMinQty * 0.5 ? 'critical' : formQty < formMinQty ? 'low' : 'normal'
    const newItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      name: formName,
      category: formCategory,
      unit: formUnit,
      currentQuantity: formQty,
      minimumQuantity: formMinQty,
      status,
      unitCost: 0,
      lastUpdated: new Date().toISOString(),
    }
    setItems(prev => [newItem, ...prev])
    setIsAddModalOpen(false)
    setFormName('')
    toast.addToast('success', `"${formName}" adicionado ao estoque.`)
  }

  const handleEntry = (id: string) => {
    setItems(prev => prev.map(item =>
      item.id === id
        ? { ...item, currentQuantity: item.currentQuantity + 1, status: recalcStatus(item.currentQuantity + 1, item.minimumQuantity) }
        : item,
    ))
    toast.addToast('success', 'Entrada registrada.')
  }

  const handleExit = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id || item.currentQuantity <= 0) return item
      const newQty = item.currentQuantity - 1
      return { ...item, currentQuantity: newQty, status: recalcStatus(newQty, item.minimumQuantity) }
    }))
    toast.addToast('success', 'Saída registrada.')
  }

  return (
    <div className="p-6 space-y-6">
      {/* Título + botão */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-headline font-bold text-2xl text-text-main">Gestão de Estoque</h1>
          <p className="font-body text-sm text-text-secondary">{items.length} insumos cadastrados</p>
        </div>
        <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsAddModalOpen(true)}>
          Adicionar Insumo
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-brand-green/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-brand-primary" />
            </div>
            <div>
              <p className="font-body text-xs font-semibold uppercase tracking-wider text-text-secondary">Total</p>
              <p className="font-headline font-bold text-2xl text-text-main">{items.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-warning-bg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="font-body text-xs font-semibold uppercase tracking-wider text-text-secondary">Estoque Baixo</p>
              <p className="font-headline font-bold text-2xl text-warning">{lowCount}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-danger-bg flex items-center justify-center">
              <AlertOctagon className="w-5 h-5 text-danger" />
            </div>
            <div>
              <p className="font-body text-xs font-semibold uppercase tracking-wider text-text-secondary">Nível Crítico</p>
              <p className="font-headline font-bold text-2xl text-danger">{criticalCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-1.5">
            <label className="font-body text-xs font-semibold uppercase tracking-wider text-text-secondary">Categoria</label>
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value as InventoryCategory | 'all')}
              className="bg-surface-low rounded-xl px-4 py-3 text-sm font-body text-text-main focus:outline-none focus:ring-2 focus:ring-brand-green/30 min-h-[44px]"
            >
              <option value="all">Todas</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{INVENTORY_CATEGORY_LABELS[c]}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-body text-xs font-semibold uppercase tracking-wider text-text-secondary">Status</label>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as StockStatus | 'all')}
              className="bg-surface-low rounded-xl px-4 py-3 text-sm font-body text-text-main focus:outline-none focus:ring-2 focus:ring-brand-green/30 min-h-[44px]"
            >
              <option value="all">Todos</option>
              <option value="normal">Normal</option>
              <option value="low">Baixo</option>
              <option value="critical">Crítico</option>
            </select>
          </div>
          <Button variant="ghost" className="ml-auto">Exportar PDF</Button>
          <Button variant="secondary">Relatório</Button>
        </div>
      </Card>

      {/* Tabela */}
      <Card padded={false}>
        {paginatedItems.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Nenhum insumo encontrado"
            description="Tente ajustar os filtros ou adicione novos insumos ao estoque."
            actionLabel="Adicionar Insumo"
            onAction={() => setIsAddModalOpen(true)}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-container">
                    {['Insumo', 'Categoria', 'Unid.', 'Qtd Atual', 'Qtd Mínima', 'Status', 'Ações'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-body text-xs font-semibold uppercase tracking-wider text-text-secondary">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.map((item, i) => {
                    const accentClass = ROW_ACCENT[item.status]
                    const qtyColorClass = item.status === 'critical' ? 'text-danger font-bold' : item.status === 'low' ? 'text-warning font-semibold' : 'text-text-main'
                    return (
                      <tr
                        key={item.id}
                        className={`
                          ${i % 2 === 0 ? 'bg-surface-white' : 'bg-surface/50'}
                          hover:bg-surface-low transition-colors
                          ${accentClass ? `border-l-4 ${accentClass}` : ''}
                        `}
                      >
                        <td className="px-4 py-3 font-body text-sm font-semibold text-text-main">{item.name}</td>
                        <td className="px-4 py-3 font-body text-sm text-text-secondary">{INVENTORY_CATEGORY_LABELS[item.category]}</td>
                        <td className="px-4 py-3 font-body text-sm text-text-secondary">{item.unit}</td>
                        <td className={`px-4 py-3 font-body text-sm ${qtyColorClass}`}>{item.currentQuantity}</td>
                        <td className="px-4 py-3 font-body text-sm text-text-secondary">{item.minimumQuantity}</td>
                        <td className="px-4 py-3">
                          <Badge variant={STATUS_BADGE[item.status].variant}>
                            {STATUS_BADGE[item.status].label}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button onClick={() => handleEntry(item.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-success hover:bg-success-bg transition-colors" aria-label="Entrada">
                              <PlusCircle className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleExit(item.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-warning hover:bg-warning-bg transition-colors" aria-label="Saída">
                              <MinusCircle className="w-4 h-4" />
                            </button>
                            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-text-disabled hover:text-brand-primary hover:bg-surface-container transition-colors" aria-label="Editar">
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <PaginationControls
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPrev={goToPreviousPage}
              onNext={goToNextPage}
              canPrev={canGoPrevious}
              canNext={canGoNext}
            />
          </>
        )}
      </Card>

      {/* Cards inferiores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-headline font-semibold text-text-main mb-3">Análise de Consumo</h3>
          <p className="font-body text-sm text-text-secondary mb-4">
            <strong className="text-text-main">Frango Inteiro</strong> é o insumo mais consumido — 28% do volume total de saídas.
          </p>
          <Button variant="secondary" className="w-full">Otimizar Pedidos</Button>
        </Card>
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="w-2.5 h-2.5 rounded-full bg-brand-green" />
              <div className="absolute inset-0 rounded-full bg-brand-green animate-live-pulse" />
            </div>
            <h3 className="font-headline font-semibold text-text-main">Live Pulse</h3>
          </div>
          <div className="space-y-3">
            {inventoryMovementsMock.slice(0, 4).map(mov => (
              <div key={mov.id} className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-body text-sm text-text-main">{mov.itemName}</p>
                  <p className="font-body text-xs text-text-secondary">{mov.reason}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`font-body text-sm font-semibold ${mov.type === 'entry' ? 'text-success' : 'text-danger'}`}>
                    {mov.type === 'entry' ? '+' : ''}{mov.quantity} {mov.type === 'entry' ? '↑' : '↓'}
                  </p>
                  <p className="font-body text-xs text-text-disabled">{formatRelativeTime(mov.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Modal adicionar insumo */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Adicionar Insumo"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleAddItem}>Adicionar</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Nome do Insumo" placeholder="Ex: Frango Inteiro" value={formName} onChange={e => setFormName(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-xs font-semibold uppercase tracking-wider text-text-secondary">Categoria</label>
              <select value={formCategory} onChange={e => setFormCategory(e.target.value as InventoryCategory)} className="bg-surface-low rounded-xl px-4 py-3 text-sm font-body text-text-main focus:outline-none focus:ring-2 focus:ring-brand-green/30 min-h-[44px]">
                {CATEGORIES.map(c => <option key={c} value={c}>{INVENTORY_CATEGORY_LABELS[c]}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-xs font-semibold uppercase tracking-wider text-text-secondary">Unidade</label>
              <select value={formUnit} onChange={e => setFormUnit(e.target.value as MeasurementUnit)} className="bg-surface-low rounded-xl px-4 py-3 text-sm font-body text-text-main focus:outline-none focus:ring-2 focus:ring-brand-green/30 min-h-[44px]">
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Qtd Inicial" type="number" min={0} value={formQty || ''} onChange={e => setFormQty(parseFloat(e.target.value) || 0)} />
            <Input label="Qtd Mínima" type="number" min={0} value={formMinQty || ''} onChange={e => setFormMinQty(parseFloat(e.target.value) || 0)} />
          </div>
          <div className="border-2 border-dashed border-outline-subtle rounded-2xl p-6 text-center cursor-pointer hover:border-brand-green/40 transition-colors">
            <p className="font-body text-sm text-text-secondary">
              <span className="text-brand-primary font-semibold">Foto do insumo</span> (opcional)
            </p>
          </div>
        </div>
      </Modal>
    </div>
  )
}

// Recalcula status baseado nas quantidades — externo ao componente porque é lógica pura
function recalcStatus(current: number, minimum: number): StockStatus {
  if (current < minimum * 0.5) return 'critical'
  if (current < minimum) return 'low'
  return 'normal'
}
