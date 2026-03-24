import { useState, useMemo } from 'react'
import { FileText, MoreVertical, Plus, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { useToastContext } from '@/contexts/ToastContext'
import { usePagination } from '@/hooks/usePagination'
import { invoicesMock, suppliersMock } from '@/data/mock'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'
import { INVOICE_STATUS_LABELS, type Invoice, type InvoiceStatus } from '@/types/invoice'

const STATUS_BADGE: Record<InvoiceStatus, 'success' | 'warning' | 'danger'> = {
  paid:    'success',
  pending: 'warning',
  overdue: 'danger',
}

// ── Supplier avatar (iniciais com cor) ────────────────────────────────────────

interface SupplierAvatarProps {
  name: string
  color: string
}

function SupplierAvatar({ name, color }: SupplierAvatarProps) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()

  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-headline font-bold flex-shrink-0"
      style={{ backgroundColor: color }}
      aria-label={name}
    >
      {initials}
    </div>
  )
}

// ── Action menu ───────────────────────────────────────────────────────────────

interface ActionMenuProps {
  invoiceId: string
  onMarkPaid: (id: string) => void
  onDelete: (id: string) => void
}

function ActionMenu({ invoiceId, onMarkPaid, onDelete }: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(v => !v)}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-text-disabled hover:text-text-secondary hover:bg-surface-container transition-colors"
        aria-label="Mais opções"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} aria-hidden="true" />
          <div className="absolute right-0 bottom-full mb-1 z-20 w-40 bg-surface-white rounded-xl shadow-card border border-surface-container overflow-hidden">
            {[
              { label: 'Ver detalhes', action: () => setIsOpen(false) },
              { label: 'Marcar como paga', action: () => { onMarkPaid(invoiceId); setIsOpen(false) } },
              { label: 'Editar', action: () => setIsOpen(false) },
            ].map(item => (
              <button key={item.label} onClick={item.action} className="w-full px-4 py-2.5 text-left font-body text-sm text-text-main hover:bg-surface-container transition-colors">
                {item.label}
              </button>
            ))}
            <button onClick={() => { onDelete(invoiceId); setIsOpen(false) }} className="w-full px-4 py-2.5 text-left font-body text-sm text-danger hover:bg-danger-bg transition-colors">
              Excluir
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ── Pagination controls ───────────────────────────────────────────────────────

function PaginationControls({ currentPage, totalItems, itemsPerPage, onPrev, onNext, canPrev, canNext }: {
  currentPage: number; totalItems: number; itemsPerPage: number
  onPrev: () => void; onNext: () => void; canPrev: boolean; canNext: boolean
}) {
  const start = (currentPage - 1) * itemsPerPage + 1
  const end = Math.min(currentPage * itemsPerPage, totalItems)
  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-surface-container">
      <p className="font-body text-sm text-text-secondary">
        Mostrando <strong className="text-text-main">{start}–{end}</strong> de <strong className="text-text-main">{totalItems}</strong>
      </p>
      <div className="flex gap-2">
        <button onClick={onPrev} disabled={!canPrev} className="w-9 h-9 rounded-xl flex items-center justify-center text-text-secondary hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"><ChevronLeft className="w-4 h-4" /></button>
        <button onClick={onNext} disabled={!canNext} className="w-9 h-9 rounded-xl flex items-center justify-center text-text-secondary hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"><ChevronRight className="w-4 h-4" /></button>
      </div>
    </div>
  )
}

// ── Página principal ──────────────────────────────────────────────────────────

export function NotasFiscais() {
  const toast = useToastContext()
  const [invoices, setInvoices] = useState<Invoice[]>(invoicesMock)
  const [filterSupplier, setFilterSupplier] = useState('all')
  const [filterStatus, setFilterStatus] = useState<InvoiceStatus | 'all'>('all')
  const [filterStart, setFilterStart] = useState('')
  const [filterEnd, setFilterEnd] = useState('')
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)

  // Form state
  const [formNumber, setFormNumber] = useState('')
  const [formSupplier, setFormSupplier] = useState(suppliersMock[0].id)
  const [formIssueDate, setFormIssueDate] = useState('')
  const [formDueDate, setFormDueDate] = useState('')
  const [formAmount, setFormAmount] = useState('')
  const [formCategory, setFormCategory] = useState('')
  const [formDescription, setFormDescription] = useState('')

  const filtered = useMemo(() => {
    return invoices.filter(inv => {
      const supMatch = filterSupplier === 'all' || inv.supplier.id === filterSupplier
      const statusMatch = filterStatus === 'all' || inv.status === filterStatus
      const startMatch = !filterStart || inv.issueDate >= filterStart
      const endMatch = !filterEnd || inv.issueDate <= filterEnd
      return supMatch && statusMatch && startMatch && endMatch
    })
  }, [invoices, filterSupplier, filterStatus, filterStart, filterEnd])

  const { paginatedItems, currentPage, totalItems, itemsPerPage, goToNextPage, goToPreviousPage, canGoNext, canGoPrevious } = usePagination(filtered)

  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.totalAmount, 0)
  const totalPending = invoices.filter(i => i.status === 'pending').reduce((s, i) => s + i.totalAmount, 0)
  const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.totalAmount, 0)

  const handleMarkPaid = (id: string) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'paid' as const } : inv))
    toast.addToast('success', 'Nota fiscal marcada como paga.')
  }

  const handleDelete = (id: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id))
    toast.addToast('success', 'Nota fiscal excluída.')
  }

  const handleSaveNew = () => {
    if (!formNumber.trim() || !formAmount) {
      toast.addToast('warning', 'Preencha pelo menos o número e o valor da NF.')
      return
    }
    const supplier = suppliersMock.find(s => s.id === formSupplier) ?? suppliersMock[0]
    const newInvoice: Invoice = {
      id: `nf-${Date.now()}`,
      number: formNumber,
      supplier,
      issueDate: formIssueDate || new Date().toISOString().slice(0, 10),
      dueDate: formDueDate || new Date().toISOString().slice(0, 10),
      totalAmount: parseFloat(formAmount) || 0,
      status: 'pending',
      costCategory: formCategory || 'Outros',
      description: formDescription,
    }
    setInvoices(prev => [newInvoice, ...prev])
    setIsNewModalOpen(false)
    setFormNumber('')
    setFormAmount('')
    toast.addToast('success', `NF ${formNumber} lançada com sucesso!`)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Título */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-headline font-bold text-2xl text-text-main">Notas Fiscais</h1>
          <p className="font-body text-sm text-text-secondary">{invoices.length} notas cadastradas</p>
        </div>
        <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsNewModalOpen(true)}>
          Lançar NF
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <div className="flex flex-wrap gap-3 items-end">
          <Input label="De" type="date" value={filterStart} onChange={e => setFilterStart(e.target.value)} className="w-36" />
          <Input label="Até" type="date" value={filterEnd} onChange={e => setFilterEnd(e.target.value)} className="w-36" />
          <div className="flex flex-col gap-1.5">
            <label className="font-body text-xs font-semibold uppercase tracking-wider text-text-secondary">Fornecedor</label>
            <select value={filterSupplier} onChange={e => setFilterSupplier(e.target.value)} className="bg-surface-low rounded-xl px-4 py-3 text-sm font-body text-text-main focus:outline-none focus:ring-2 focus:ring-brand-green/30 min-h-[44px]">
              <option value="all">Todos</option>
              {suppliersMock.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-body text-xs font-semibold uppercase tracking-wider text-text-secondary">Status</label>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as InvoiceStatus | 'all')} className="bg-surface-low rounded-xl px-4 py-3 text-sm font-body text-text-main focus:outline-none focus:ring-2 focus:ring-brand-green/30 min-h-[44px]">
              <option value="all">Todos</option>
              <option value="paid">Paga</option>
              <option value="pending">Pendente</option>
              <option value="overdue">Vencida</option>
            </select>
          </div>
          <Button variant="primary" className="self-end">Filtrar</Button>
        </div>
      </Card>

      {/* Tabela */}
      <Card padded={false}>
        {paginatedItems.length === 0 ? (
          <EmptyState icon={FileText} title="Nenhuma nota encontrada" description="Tente ajustar os filtros ou lance uma nova NF." actionLabel="Lançar NF" onAction={() => setIsNewModalOpen(true)} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-container">
                    {['Nº NF', 'Fornecedor', 'Emissão', 'Vencimento', 'Valor', 'Status', 'Ações'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-body text-xs font-semibold uppercase tracking-wider text-text-secondary">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.map((inv, i) => (
                    <tr key={inv.id} className={`${i % 2 === 0 ? 'bg-surface-white' : 'bg-surface/50'} hover:bg-surface-low transition-colors`}>
                      <td className="px-4 py-3 font-body text-sm font-semibold text-text-main">{inv.number}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <SupplierAvatar name={inv.supplier.name} color={inv.supplier.avatarColor} />
                          <span className="font-body text-sm text-text-main">{inv.supplier.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-body text-sm text-text-secondary">{formatDate(inv.issueDate)}</td>
                      <td className="px-4 py-3 font-body text-sm text-text-secondary">{formatDate(inv.dueDate)}</td>
                      <td className="px-4 py-3 font-body text-sm font-semibold text-text-main">{formatCurrency(inv.totalAmount)}</td>
                      <td className="px-4 py-3">
                        <Badge variant={STATUS_BADGE[inv.status]}>{INVOICE_STATUS_LABELS[inv.status]}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <ActionMenu invoiceId={inv.id} onMarkPaid={handleMarkPaid} onDelete={handleDelete} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <PaginationControls
              currentPage={currentPage} totalItems={totalItems} itemsPerPage={itemsPerPage}
              onPrev={goToPreviousPage} onNext={goToNextPage} canPrev={canGoPrevious} canNext={canGoNext}
            />
          </>
        )}
      </Card>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-brand-dark rounded-2xl p-6">
          <p className="font-body text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">Total Pago (mês)</p>
          <p className="font-headline font-bold text-2xl text-brand-green">{formatCurrency(totalPaid)}</p>
        </div>
        <Card>
          <p className="font-body text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">Pendente</p>
          <p className="font-headline font-bold text-2xl text-text-main">{formatCurrency(totalPending)}</p>
        </Card>
        <div className="bg-danger-bg rounded-2xl p-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-danger mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-wider text-danger mb-2">Total Vencido</p>
            <p className="font-headline font-bold text-2xl text-danger">{formatCurrency(totalOverdue)}</p>
          </div>
        </div>
      </div>

      {/* Modal nova NF */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Lançar Nota Fiscal"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsNewModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleSaveNew}>Lançar NF</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Número NF" placeholder="NF-00126" value={formNumber} onChange={e => setFormNumber(e.target.value)} />
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-xs font-semibold uppercase tracking-wider text-text-secondary">Fornecedor</label>
              <select value={formSupplier} onChange={e => setFormSupplier(e.target.value)} className="bg-surface-low rounded-xl px-4 py-3 text-sm font-body text-text-main focus:outline-none focus:ring-2 focus:ring-brand-green/30 min-h-[44px]">
                {suppliersMock.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Data de Emissão" type="date" value={formIssueDate} onChange={e => setFormIssueDate(e.target.value)} />
            <Input label="Data de Vencimento" type="date" value={formDueDate} onChange={e => setFormDueDate(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Valor Total (R$)" type="number" placeholder="0,00" min={0} step={0.01} value={formAmount} onChange={e => setFormAmount(e.target.value)} />
            <Input label="Categoria de Custo" placeholder="Ex: Proteínas" value={formCategory} onChange={e => setFormCategory(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-body text-xs font-semibold uppercase tracking-wider text-text-secondary">Descrição</label>
            <textarea value={formDescription} onChange={e => setFormDescription(e.target.value)} rows={3} placeholder="Descrição dos itens..." className="bg-surface-low rounded-xl px-4 py-3 text-sm font-body text-text-main focus:outline-none focus:ring-2 focus:ring-brand-green/30 placeholder:text-text-disabled resize-none" />
          </div>
          <div className="border-2 border-dashed border-outline-subtle rounded-2xl p-6 text-center cursor-pointer hover:border-brand-green/40 transition-colors">
            <p className="font-body text-sm text-text-secondary">
              <span className="text-brand-primary font-semibold">Anexar NF</span> — PDF ou imagem (opcional)
            </p>
          </div>
        </div>
      </Modal>
    </div>
  )
}
