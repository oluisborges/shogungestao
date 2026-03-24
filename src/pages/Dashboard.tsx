import { useState, useEffect } from 'react'
import { TrendingUp, Percent, AlertTriangle, Wallet, Download, ArrowRight, MoreVertical } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { KpiCard } from '@/components/ui/KpiCard'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { SkeletonKpiCard } from '@/components/ui/Skeleton'
import {
  revenueTimeSeriesMock,
  inventoryItemsMock,
  transactionsMock,
} from '@/data/mock'
import { formatCurrency } from '@/utils/currency'
import type { StockStatus } from '@/types/inventory'

// Simulação de 800ms de carregamento inicial para mostrar skeleton
const LOADING_DURATION_MS = 800

// Máximo de alertas exibidos no painel lateral
const MAX_ALERTS_DISPLAYED = 5

// Últimas transações exibidas na tabela
const RECENT_TRANSACTIONS_COUNT = 5

// ── Tooltip customizado do gráfico ─────────────────────────────────────────────

interface ChartTooltipProps {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}

function RevenueTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-brand-dark text-white rounded-xl px-3 py-2 text-sm font-body shadow-lg">
      <p className="text-white/60 text-xs mb-1">{label}</p>
      <p className="font-semibold">{formatCurrency(payload[0].value)}</p>
    </div>
  )
}

// ── Linha de alerta de estoque ────────────────────────────────────────────────

interface StockAlertRowProps {
  name: string
  currentQty: number
  unit: string
  status: StockStatus
}

function StockAlertRow({ name, currentQty, unit, status }: StockAlertRowProps) {
  const borderClass = status === 'critical' ? 'border-l-4 border-danger' : 'border-l-4 border-warning'
  return (
    <div className={`flex items-center justify-between py-2.5 px-3 rounded-r-xl bg-surface ${borderClass}`}>
      <div>
        <p className="font-body text-sm font-semibold text-text-main">{name}</p>
        <p className="font-body text-xs text-text-secondary">
          {currentQty} {unit} restantes
        </p>
      </div>
      <Badge variant={status === 'critical' ? 'danger' : 'warning'}>
        {status === 'critical' ? 'Crítico' : 'Baixo'}
      </Badge>
    </div>
  )
}

// ── Onboarding modal ──────────────────────────────────────────────────────────

const ONBOARDING_STEPS = [
  { icon: TrendingUp, title: 'Dashboard', description: 'Visualize faturamento, CMV e alertas de estoque em tempo real.' },
  { icon: Percent,    title: 'CMV e Preços', description: 'Calcule o custo real dos seus pratos e defina preços competitivos.' },
  { icon: AlertTriangle, title: 'Estoque', description: 'Monitore insumos e receba alertas antes de ficar sem estoque.' },
  { icon: Wallet,     title: 'Notas Fiscais', description: 'Registre compras, acompanhe vencimentos e controle fornecedores.' },
]

const ONBOARDING_FLAG = 'shogun_onboarded'

function OnboardingModal({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = useState(0)
  const isLast = step === ONBOARDING_STEPS.length - 1
  const current = ONBOARDING_STEPS[step]
  const Icon = current.icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-surface-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-green/10 flex items-center justify-center mx-auto mb-5">
          <Icon className="w-8 h-8 text-brand-primary" />
        </div>
        <h3 className="font-headline font-bold text-xl text-text-main mb-2">{current.title}</h3>
        <p className="font-body text-sm text-text-secondary mb-8">{current.description}</p>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {ONBOARDING_STEPS.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${i === step ? 'bg-brand-primary w-5' : 'bg-surface-container'}`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1 text-text-disabled" onClick={onFinish}>
            Pular tour
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={() => isLast ? onFinish() : setStep(s => s + 1)}
          >
            {isLast ? 'Concluir' : 'Próximo'}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ── Página principal ──────────────────────────────────────────────────────────

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      // Mostra onboarding somente na primeira visita
      const hasOnboarded = localStorage.getItem(ONBOARDING_FLAG)
      if (!hasOnboarded) setShowOnboarding(true)
    }, LOADING_DURATION_MS)
    return () => clearTimeout(timer)
  }, [])

  const handleFinishOnboarding = () => {
    localStorage.setItem(ONBOARDING_FLAG, 'true')
    setShowOnboarding(false)
  }

  const lowStockItems = inventoryItemsMock
    .filter(item => item.status === 'low' || item.status === 'critical')
    .slice(0, MAX_ALERTS_DISPLAYED)

  const recentTransactions = transactionsMock.slice(0, RECENT_TRANSACTIONS_COUNT)

  const getTransactionBadge = (status: string) => {
    if (status === 'paid') return <Badge variant="success">Pago</Badge>
    if (status === 'pending') return <Badge variant="warning">Pendente</Badge>
    return <Badge variant="danger">Vencido</Badge>
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonKpiCard key={i} />)}
        </div>
      </div>
    )
  }

  return (
    <>
      {showOnboarding && <OnboardingModal onFinish={handleFinishOnboarding} />}

      <div className="p-6 space-y-6">
        {/* Título */}
        <div>
          <h1 className="font-headline font-bold text-2xl text-text-main">Dashboard</h1>
          <p className="font-body text-sm text-text-secondary">Resumo operacional em tempo real</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <KpiCard
            label="Faturamento do Mês"
            value={formatCurrency(45200)}
            icon={TrendingUp}
            variation={12}
          />
          <KpiCard
            label="CMV Médio"
            value="32,4%"
            icon={Percent}
            variation={-2}
            invertVariationColor
            iconColorClass="text-warning"
          />
          <KpiCard
            label="Estoque Baixo"
            value={`${lowStockItems.length} Itens`}
            icon={AlertTriangle}
            badgeLabel="Alerta"
            badgeVariant="warning"
            iconColorClass="text-warning"
          />
          <KpiCard
            label="Resultado Financeiro"
            value={formatCurrency(12500)}
            icon={Wallet}
            variation={5}
          />
        </div>

        {/* Gráfico + Alertas */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Gráfico de faturamento */}
          <Card className="xl:col-span-2" padded={false}>
            <div className="p-6 pb-0 flex items-center justify-between">
              <div>
                <h2 className="font-headline font-semibold text-lg text-text-main">
                  Faturamento — últimos 30 dias
                </h2>
                <p className="font-body text-xs text-text-secondary">
                  {formatCurrency(45200)} no período
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" leftIcon={<Download className="w-4 h-4" />} className="text-xs px-3 py-2">
                  Exportar
                </Button>
                <Button variant="secondary" className="text-xs px-3 py-2">
                  Ver Detalhes
                </Button>
              </div>
            </div>
            <div className="h-56 px-2 pb-4 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueTimeSeriesMock} barSize={12}>
                  <CartesianGrid vertical={false} stroke="rgba(27,67,50,0.06)" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: '#9b9e99', fontFamily: 'Inter' }}
                    axisLine={false}
                    tickLine={false}
                    interval={4}
                  />
                  <YAxis hide />
                  <Tooltip content={<RevenueTooltip />} cursor={{ fill: 'rgba(162,215,41,0.08)' }} />
                  <Bar dataKey="value" fill="#A2D729" fillOpacity={0.6} radius={[4, 4, 0, 0]}
                    activeBar={{ fillOpacity: 1 }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Alertas de estoque */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-headline font-semibold text-lg text-text-main">
                Alertas Críticos
              </h2>
              <Badge variant="warning">{lowStockItems.length} itens</Badge>
            </div>
            <div className="space-y-2">
              {lowStockItems.map(item => (
                <StockAlertRow
                  key={item.id}
                  name={item.name}
                  currentQty={item.currentQuantity}
                  unit={item.unit}
                  status={item.status}
                />
              ))}
            </div>
            {/* Live Pulse */}
            <div className="mt-4 pt-4 border-t border-surface-container flex items-center gap-3">
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-green" />
                <div className="absolute inset-0 rounded-full bg-brand-green animate-live-pulse" />
              </div>
              <div>
                <p className="font-body text-xs font-semibold text-text-main">Sistema operacional</p>
                <p className="font-body text-xs text-text-secondary">Última sync: agora</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Últimas transações */}
        <Card padded={false}>
          <div className="p-6 pb-4 flex items-center justify-between">
            <h2 className="font-headline font-semibold text-lg text-text-main">
              Últimos Lançamentos
            </h2>
            <Button variant="ghost" className="text-xs px-3 py-2" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Ver todos
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-container">
                  {['Insumo / Descrição', 'Nota Fiscal', 'Valor', 'Status', ''].map(h => (
                    <th key={h} className="px-6 py-3 text-left font-body text-xs font-semibold uppercase tracking-wider text-text-secondary">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx, i) => (
                  <tr key={tx.id} className={`${i % 2 === 0 ? '' : 'bg-surface/50'} hover:bg-surface-low transition-colors`}>
                    <td className="px-6 py-3">
                      <p className="font-body text-sm font-semibold text-text-main">{tx.description}</p>
                      {tx.subtitle && <p className="font-body text-xs text-text-secondary">{tx.subtitle}</p>}
                    </td>
                    <td className="px-6 py-3 font-body text-sm text-text-secondary">—</td>
                    <td className={`px-6 py-3 font-body text-sm font-semibold ${tx.type === 'revenue' ? 'text-success' : 'text-danger'}`}>
                      {tx.type === 'revenue' ? '+' : '−'}{formatCurrency(tx.amount)}
                    </td>
                    <td className="px-6 py-3">{getTransactionBadge(tx.status)}</td>
                    <td className="px-6 py-3">
                      <button className="text-text-disabled hover:text-text-secondary transition-colors" aria-label="Mais opções">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  )
}
