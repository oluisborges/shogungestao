import { useState } from 'react'
import { DollarSign, TrendingUp, TrendingDown, Wallet, Plus, AlertCircle, MoreVertical } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { KpiCard } from '@/components/ui/KpiCard'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { useToastContext } from '@/contexts/ToastContext'
import {
  transactionsMock,
  monthlyDataMock,
  financialSummaryMock,
  financialAlertsMock,
} from '@/data/mock'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'
import {
  FINANCIAL_CATEGORY_LABELS,
  PAYMENT_METHOD_LABELS,
  type Transaction,
  type TransactionType,
  type FinancialCategory,
} from '@/types/financial'
import type { PaymentMethod } from '@/types/common'

type TabId = 'overview' | 'revenues' | 'expenses' | 'dre'

const TABS: Array<{ id: TabId; label: string }> = [
  { id: 'overview',  label: 'Visão Geral' },
  { id: 'revenues',  label: 'Receitas'    },
  { id: 'expenses',  label: 'Despesas'    },
  { id: 'dre',       label: 'DRE'         },
]

// Azul escuro para receitas, laranja para despesas.
// Vermelho é PROIBIDO aqui — vermelho = alertas críticos no sistema.
const CHART_COLORS = { revenue: '#1B4332', expenses: '#f97316' }

// ── Custom tooltip do gráfico ─────────────────────────────────────────────────

interface GroupedTooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}

function GroupedTooltip({ active, payload, label }: GroupedTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-brand-dark text-white rounded-xl px-3 py-2.5 text-sm font-body shadow-lg min-w-[160px]">
      <p className="text-white/60 text-xs mb-2">{label}</p>
      {payload.map(entry => (
        <div key={entry.name} className="flex items-center justify-between gap-4">
          <span style={{ color: entry.name === 'revenue' ? '#A2D729' : '#f97316' }} className="text-xs">
            {entry.name === 'revenue' ? 'Receitas' : 'Despesas'}
          </span>
          <span className="font-semibold">{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  )
}

// ── Transactions table ────────────────────────────────────────────────────────

function TransactionsTable({ transactions }: { transactions: Transaction[] }) {
  if (transactions.length === 0) {
    return <p className="px-6 py-8 text-center font-body text-sm text-text-secondary">Nenhum lançamento no período.</p>
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-surface-container">
            {['Data', 'Descrição', 'Categoria', 'Forma de Pagto', 'Valor', ''].map(h => (
              <th key={h} className="px-4 py-3 text-left font-body text-xs font-semibold uppercase tracking-wider text-text-secondary">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, i) => (
            <tr key={tx.id} className={`${i % 2 === 0 ? 'bg-surface-white' : 'bg-surface/50'} hover:bg-surface-low transition-colors`}>
              <td className="px-4 py-3 font-body text-sm text-text-secondary whitespace-nowrap">{formatDate(tx.date)}</td>
              <td className="px-4 py-3">
                <p className="font-body text-sm font-semibold text-text-main">{tx.description}</p>
                {tx.subtitle && <p className="font-body text-xs text-text-secondary">{tx.subtitle}</p>}
              </td>
              <td className="px-4 py-3">
                <Badge variant="neutral">{FINANCIAL_CATEGORY_LABELS[tx.category]}</Badge>
              </td>
              <td className="px-4 py-3 font-body text-sm text-text-secondary">{PAYMENT_METHOD_LABELS[tx.paymentMethod]}</td>
              <td className={`px-4 py-3 font-body text-sm font-bold ${tx.type === 'revenue' ? 'text-success' : 'text-warning'}`}>
                {tx.type === 'revenue' ? '+' : '−'}{formatCurrency(tx.amount)}
              </td>
              <td className="px-4 py-3">
                <button className="text-text-disabled hover:text-text-secondary transition-colors" aria-label="Mais opções">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── DRE (Demonstrativo de Resultado) ─────────────────────────────────────────

function DRE() {
  const revenues = transactionsMock.filter(t => t.type === 'revenue').reduce((s, t) => s + t.amount, 0)
  const expenses = transactionsMock.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const ingredients = transactionsMock.filter(t => t.category === 'ingredients' || t.category === 'packaging').reduce((s, t) => s + t.amount, 0)
  const grossMargin = revenues - ingredients
  const operationalExpenses = expenses - ingredients
  const netResult = revenues - expenses

  const rows = [
    { label: 'Receita Bruta', value: revenues, indent: false, bold: true, positive: true },
    { label: 'Custo de Insumos e Embalagens', value: -ingredients, indent: true, bold: false, positive: false },
    { label: 'Margem Bruta', value: grossMargin, indent: false, bold: true, positive: grossMargin > 0 },
    { label: 'Despesas Operacionais', value: -operationalExpenses, indent: true, bold: false, positive: false },
    { label: 'Resultado Líquido', value: netResult, indent: false, bold: true, positive: netResult > 0 },
  ]

  return (
    <Card>
      <h3 className="font-headline font-semibold text-lg text-text-main mb-4">
        DRE — Demonstrativo de Resultado
      </h3>
      <div className="space-y-1">
        {rows.map(row => (
          <div
            key={row.label}
            className={`flex items-center justify-between py-3 ${row.bold ? 'border-t border-surface-container' : ''} ${row.indent ? 'pl-6' : ''}`}
          >
            <span className={`font-body text-sm ${row.bold ? 'font-semibold text-text-main' : 'text-text-secondary'}`}>
              {row.label}
            </span>
            <span className={`font-headline text-sm ${row.bold ? 'font-bold text-lg' : 'font-semibold'} ${row.positive ? 'text-success' : 'text-warning'}`}>
              {row.value < 0 ? '−' : '+'}{formatCurrency(Math.abs(row.value))}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ── Página principal ──────────────────────────────────────────────────────────

const PAYMENT_METHODS: PaymentMethod[] = ['pix', 'credit_card', 'debit_card', 'cash', 'bank_transfer']
const CATEGORIES: FinancialCategory[] = ['ifood_repasse', 'direct_sale', 'ingredients', 'packaging', 'rent', 'energy', 'labor', 'marketing', 'equipment', 'other']

export function Financeiro() {
  const toast = useToastContext()
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)

  // Form state
  const [formType, setFormType] = useState<TransactionType>('revenue')
  const [formAmount, setFormAmount] = useState('')
  const [formDate, setFormDate] = useState('')
  const [formCategory, setFormCategory] = useState<FinancialCategory>('direct_sale')
  const [formDescription, setFormDescription] = useState('')
  const [formPayment, setFormPayment] = useState<PaymentMethod>('pix')

  const { currentBalance, monthRevenue, monthExpenses, projectedProfit } = financialSummaryMock

  const handleSaveTransaction = () => {
    if (!formAmount || !formDescription.trim()) {
      toast.addToast('warning', 'Preencha valor e descrição.')
      return
    }
    setIsNewModalOpen(false)
    toast.addToast('success', `${formType === 'revenue' ? 'Receita' : 'Despesa'} registrada com sucesso!`)
    setFormAmount('')
    setFormDescription('')
  }

  const displayedTransactions = activeTab === 'revenues'
    ? transactionsMock.filter(t => t.type === 'revenue')
    : activeTab === 'expenses'
    ? transactionsMock.filter(t => t.type === 'expense')
    : transactionsMock

  return (
    <div className="p-6 space-y-6">
      {/* Título + novo */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-headline font-bold text-2xl text-text-main">Gestão Financeira</h1>
          <p className="font-body text-sm text-text-secondary">Controle de receitas, despesas e resultado</p>
        </div>
        <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsNewModalOpen(true)}>
          Novo Lançamento
        </Button>
      </div>

      {/* Abas */}
      <div className="flex gap-1 bg-surface-container rounded-xl p-1 w-fit">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-body text-sm font-semibold transition-all duration-150 ${
              activeTab === tab.id
                ? 'bg-surface-white text-text-main shadow-sm'
                : 'text-text-secondary hover:text-text-main'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conteúdo por aba */}
      {activeTab === 'dre' ? (
        <DRE />
      ) : (
        <>
          {/* KPI Cards — apenas na visão geral */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <KpiCard label="Saldo Atual" value={formatCurrency(currentBalance)} icon={DollarSign} />
              <KpiCard
                label="Receitas (Mês)"
                value={formatCurrency(monthRevenue)}
                icon={TrendingUp}
                variation={12}
                iconColorClass="text-success"
              />
              <KpiCard
                label="Despesas (Mês)"
                value={formatCurrency(monthExpenses)}
                icon={TrendingDown}
                variation={-5}
                invertVariationColor
                iconColorClass="text-warning"
              />
              <KpiCard label="Lucro Projetado" value={formatCurrency(projectedProfit)} icon={Wallet} variation={8} />
            </div>
          )}

          {/* Gráfico + alertas — apenas na visão geral */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <Card className="xl:col-span-2" padded={false}>
                <div className="p-6 pb-2">
                  <h2 className="font-headline font-semibold text-lg text-text-main">
                    Receitas vs Despesas — últimos 6 meses
                  </h2>
                </div>
                <div className="h-60 px-2 pb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyDataMock} barSize={14} barGap={4}>
                      <CartesianGrid vertical={false} stroke="rgba(27,67,50,0.06)" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9b9e99', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                      <YAxis hide />
                      <Tooltip content={<GroupedTooltip />} cursor={{ fill: 'rgba(162,215,41,0.05)' }} />
                      <Legend
                        formatter={(value) => (
                          <span className="font-body text-xs text-text-secondary">
                            {value === 'revenue' ? 'Receitas' : 'Despesas'}
                          </span>
                        )}
                      />
                      <Bar dataKey="revenue" fill={CHART_COLORS.revenue} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="expenses" fill={CHART_COLORS.expenses} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Alertas financeiros */}
              <Card>
                <h2 className="font-headline font-semibold text-lg text-text-main mb-4">
                  Alertas Financeiros
                </h2>
                <div className="space-y-3">
                  {financialAlertsMock.map(alert => (
                    <div
                      key={alert.id}
                      className={`flex gap-3 p-3 rounded-xl ${
                        alert.severity === 'danger' ? 'bg-danger-bg'
                        : alert.severity === 'warning' ? 'bg-warning-bg'
                        : 'bg-success-bg'
                      }`}
                    >
                      <AlertCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        alert.severity === 'danger' ? 'text-danger'
                        : alert.severity === 'warning' ? 'text-warning'
                        : 'text-success'
                      }`} />
                      <div>
                        <p className="font-body text-xs font-semibold text-text-main">{alert.title}</p>
                        <p className="font-body text-xs text-text-secondary mt-0.5">{alert.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full mt-4 text-xs">Ver todos</Button>
              </Card>
            </div>
          )}

          {/* Tabela de transações */}
          <Card padded={false}>
            <div className="p-6 pb-4">
              <h2 className="font-headline font-semibold text-lg text-text-main">
                {activeTab === 'overview' ? 'Lançamentos Recentes' : activeTab === 'revenues' ? 'Receitas' : 'Despesas'}
              </h2>
            </div>
            <TransactionsTable transactions={displayedTransactions} />
          </Card>
        </>
      )}

      {/* Modal novo lançamento */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Novo Lançamento"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsNewModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleSaveTransaction}>Salvar</Button>
          </>
        }
      >
        <div className="space-y-4">
          {/* Toggle Receita/Despesa */}
          <div className="flex gap-2 bg-surface-container rounded-xl p-1">
            <button
              onClick={() => setFormType('revenue')}
              className={`flex-1 py-2.5 rounded-lg font-body text-sm font-semibold transition-all ${formType === 'revenue' ? 'bg-success text-white' : 'text-text-secondary'}`}
            >
              Receita
            </button>
            <button
              onClick={() => setFormType('expense')}
              className={`flex-1 py-2.5 rounded-lg font-body text-sm font-semibold transition-all ${formType === 'expense' ? 'bg-warning text-white' : 'text-text-secondary'}`}
            >
              Despesa
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input label="Valor (R$)" type="number" placeholder="0,00" min={0} step={0.01} value={formAmount} onChange={e => setFormAmount(e.target.value)} />
            <Input label="Data" type="date" value={formDate} onChange={e => setFormDate(e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-body text-xs font-semibold uppercase tracking-wider text-text-secondary">Categoria</label>
            <select value={formCategory} onChange={e => setFormCategory(e.target.value as FinancialCategory)} className="bg-surface-low rounded-xl px-4 py-3 text-sm font-body text-text-main focus:outline-none focus:ring-2 focus:ring-brand-green/30 min-h-[44px]">
              {CATEGORIES.map(c => <option key={c} value={c}>{FINANCIAL_CATEGORY_LABELS[c]}</option>)}
            </select>
          </div>

          <Input label="Descrição" placeholder="Ex: Repasse iFood semana 12" value={formDescription} onChange={e => setFormDescription(e.target.value)} />

          <div className="flex flex-col gap-1.5">
            <label className="font-body text-xs font-semibold uppercase tracking-wider text-text-secondary">Forma de Pagamento</label>
            <select value={formPayment} onChange={e => setFormPayment(e.target.value as PaymentMethod)} className="bg-surface-low rounded-xl px-4 py-3 text-sm font-body text-text-main focus:outline-none focus:ring-2 focus:ring-brand-green/30 min-h-[44px]">
              {PAYMENT_METHODS.map(m => <option key={m} value={m}>{PAYMENT_METHOD_LABELS[m]}</option>)}
            </select>
          </div>
        </div>
      </Modal>
    </div>
  )
}
