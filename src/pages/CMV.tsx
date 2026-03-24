import { Plus, Trash2, TrendingUp, Save } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { useCMVCalculator } from '@/hooks/useCMVCalculator'
import { useToastContext } from '@/contexts/ToastContext'
import { cmvHistoryMock } from '@/data/mock'
import { formatCurrency, formatPercentage } from '@/utils/currency'
import { formatDate } from '@/utils/date'

// Margem acima da qual o card de otimização aparece
const MARGIN_THRESHOLD_FOR_OPTIMIZATION = 25

// ── Ingredient row ────────────────────────────────────────────────────────────

interface IngredientRowProps {
  id: string
  name: string
  cost: number
  onChange: (id: string, field: 'name' | 'cost', value: string | number) => void
  onRemove: (id: string) => void
  isOnly: boolean
}

function IngredientRow({ id, name, cost, onChange, onRemove, isOnly }: IngredientRowProps) {
  return (
    <div className="flex gap-3 items-end">
      <div className="flex-1">
        <Input
          label="Insumo"
          placeholder="Ex: Frango"
          value={name}
          onChange={e => onChange(id, 'name', e.target.value)}
        />
      </div>
      <div className="w-36">
        <Input
          label="Custo (R$)"
          type="number"
          placeholder="0,00"
          min={0}
          step={0.01}
          value={cost || ''}
          onChange={e => onChange(id, 'cost', parseFloat(e.target.value) || 0)}
        />
      </div>
      <button
        type="button"
        onClick={() => onRemove(id)}
        disabled={isOnly}
        className="w-10 h-11 flex items-center justify-center rounded-xl text-text-disabled hover:text-danger hover:bg-danger-bg transition-colors disabled:opacity-30 disabled:cursor-not-allowed mb-0.5"
        aria-label="Remover insumo"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}

// ── Comparison progress bar ───────────────────────────────────────────────────

interface ChannelComparisonProps {
  label: string
  price: number
  margin: number
  maxPrice: number
}

function ChannelBar({ label, price, margin, maxPrice }: ChannelComparisonProps) {
  const widthPercent = maxPrice > 0 ? Math.min((price / maxPrice) * 100, 100) : 0
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="font-body text-xs font-semibold text-brand-dark/70">{label}</span>
        <span className="font-headline font-bold text-brand-dark">{formatCurrency(price)}</span>
      </div>
      <div className="h-2 bg-brand-dark/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-dark rounded-full transition-all duration-300"
          style={{ width: `${widthPercent}%` }}
        />
      </div>
      <p className="font-body text-xs text-brand-dark/60 mt-1">
        Margem: {formatCurrency(margin)} ({formatPercentage(price > 0 ? (margin / price) * 100 : 0)})
      </p>
    </div>
  )
}

// ── Página principal ──────────────────────────────────────────────────────────

export function CMV() {
  const toast = useToastContext()
  const calc = useCMVCalculator()

  const showOptimizationCard = calc.result.netMarginPercentage > MARGIN_THRESHOLD_FOR_OPTIMIZATION
  const maxChannelPrice = Math.max(calc.result.suggestedPrice, calc.result.directChannelPrice)

  const handleSave = () => {
    if (!calc.productName.trim()) {
      toast.addToast('warning', 'Informe o nome do produto antes de salvar.')
      return
    }
    toast.addToast('success', `Precificação de "${calc.productName}" salva com sucesso!`)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Título */}
      <div>
        <h1 className="font-headline font-bold text-2xl text-text-main">CMV e Precificação</h1>
        <p className="font-body text-sm text-text-secondary">
          Calcule o custo real dos seus pratos e defina preços competitivos
        </p>
      </div>

      {/* Layout 60/40 */}
      <div className="flex flex-col xl:flex-row gap-6 items-start">
        {/* ── Formulário (60%) ──────────────────────────────────────────────── */}
        <div className="flex-1 xl:w-[60%] space-y-5">
          <Card>
            <h2 className="font-headline font-semibold text-lg text-text-main mb-5">
              Dados do Produto
            </h2>

            <Input
              label="Nome do Produto"
              placeholder="Ex: Burger Shogun Special"
              value={calc.productName}
              onChange={e => calc.setProductName(e.target.value)}
              className="mb-5"
            />

            {/* Lista de insumos */}
            <div className="space-y-3 mb-3">
              <label className="font-body text-xs font-semibold uppercase tracking-wider text-text-secondary block">
                Insumos e Custos
              </label>
              {calc.ingredients.map(ing => (
                <IngredientRow
                  key={ing.id}
                  id={ing.id}
                  name={ing.name}
                  cost={ing.cost}
                  onChange={calc.updateIngredient}
                  onRemove={calc.removeIngredient}
                  isOnly={calc.ingredients.length === 1}
                />
              ))}
            </div>

            <Button
              variant="secondary"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={calc.addIngredient}
              className="w-full mb-5"
            >
              Adicionar Insumo
            </Button>

            {/* Outros custos */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Embalagem (R$)"
                type="number"
                placeholder="0,00"
                min={0}
                step={0.01}
                value={calc.packagingCost || ''}
                onChange={e => calc.setPackagingCost(parseFloat(e.target.value) || 0)}
              />
              <div>
                <Input
                  label="Comissão Marketplace (%)"
                  type="number"
                  placeholder="12"
                  min={0}
                  max={100}
                  step={0.5}
                  value={calc.marketplaceCommission}
                  onChange={e => calc.setMarketplaceCommission(parseFloat(e.target.value) || 0)}
                />
                <p className="font-body text-xs text-text-disabled mt-1">Ex: iFood cobra ~12%</p>
              </div>
              <Input
                label="Taxa Cartão/ADM (%)"
                type="number"
                placeholder="3.5"
                min={0}
                max={100}
                step={0.5}
                value={calc.cardFee}
                onChange={e => calc.setCardFee(parseFloat(e.target.value) || 0)}
              />
            </div>
          </Card>

          {/* Card de otimização — aparece quando margem > 25% */}
          {showOptimizationCard && (
            <Card className="border-2 border-brand-green/30 bg-brand-green/5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-green/20 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <h3 className="font-headline font-semibold text-text-main mb-1">
                    Otimização de Lucro
                  </h3>
                  <p className="font-body text-sm text-text-secondary">
                    Margem de <strong className="text-brand-primary">
                      {formatPercentage(calc.result.netMarginPercentage)}
                    </strong> — acima do threshold. Considere aumentar o preço em canal direto para maximizar retorno.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Histórico */}
          <Card padded={false}>
            <div className="p-6 pb-4">
              <h2 className="font-headline font-semibold text-lg text-text-main">Histórico de Precificações</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-container">
                    {['Produto', 'Data', 'CMV%', 'Preço Final', 'Margem R$', ''].map(h => (
                      <th key={h} className="px-6 py-3 text-left font-body text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cmvHistoryMock.map((entry, i) => (
                    <tr key={entry.id} className={`${i % 2 === 0 ? '' : 'bg-surface/50'} hover:bg-surface-low transition-colors`}>
                      <td className="px-6 py-3 font-body text-sm font-semibold text-text-main">{entry.productName}</td>
                      <td className="px-6 py-3 font-body text-sm text-text-secondary">{formatDate(entry.date)}</td>
                      <td className="px-6 py-3">
                        <Badge variant={entry.cmvPercentage > 35 ? 'danger' : entry.cmvPercentage > 30 ? 'warning' : 'success'}>
                          {formatPercentage(entry.cmvPercentage)}
                        </Badge>
                      </td>
                      <td className="px-6 py-3 font-body text-sm font-semibold text-text-main">{formatCurrency(entry.suggestedPrice)}</td>
                      <td className="px-6 py-3 font-body text-sm text-success font-semibold">{formatCurrency(entry.netMarginAmount)}</td>
                      <td className="px-6 py-3">
                        <button className="font-body text-xs text-brand-primary hover:underline">Editar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* ── Card resultado sticky (40%) ──────────────────────────────────── */}
        <div className="w-full xl:w-[40%] xl:sticky xl:top-6">
          <div className="bg-brand-green rounded-2xl p-6 space-y-5">
            <h2 className="font-headline font-semibold text-lg text-brand-dark">
              Resultado da Precificação
            </h2>

            {/* CMV R$ + CMV% */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-brand-dark/10 rounded-xl p-4">
                <p className="font-body text-xs font-semibold text-brand-dark/60 uppercase tracking-wider mb-1">CMV R$</p>
                <p className="font-headline font-bold text-xl text-brand-dark">
                  {formatCurrency(calc.result.cmvAmount)}
                </p>
              </div>
              <div className="bg-brand-dark/10 rounded-xl p-4">
                <p className="font-body text-xs font-semibold text-brand-dark/60 uppercase tracking-wider mb-1">CMV %</p>
                <p className="font-headline font-bold text-xl text-brand-dark">
                  {formatPercentage(calc.result.cmvPercentage)}
                </p>
              </div>
            </div>

            {/* Preço sugerido */}
            <div className="text-center py-2">
              <p className="font-body text-xs font-semibold text-brand-dark/60 uppercase tracking-wider mb-1">
                Preço Sugerido
              </p>
              <p className="font-headline font-bold text-4xl text-brand-dark">
                {formatCurrency(calc.result.suggestedPrice)}
              </p>
            </div>

            {/* Margem líquida */}
            <div className="bg-brand-dark rounded-xl p-4">
              <p className="font-body text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                Margem Líquida
              </p>
              <div className="flex items-baseline justify-between">
                <p className="font-headline font-bold text-2xl text-brand-green">
                  {formatCurrency(calc.result.netMarginAmount)}
                </p>
                <p className="font-body text-sm text-white/70">
                  {formatPercentage(calc.result.netMarginPercentage)}
                </p>
              </div>
            </div>

            {/* Comparativo por canal */}
            <div className="space-y-3">
              <p className="font-body text-xs font-semibold text-brand-dark/60 uppercase tracking-wider">
                Comparativo por Canal
              </p>
              <ChannelBar
                label="iFood / Marketplace"
                price={calc.result.suggestedPrice}
                margin={calc.result.netMarginAmount}
                maxPrice={maxChannelPrice}
              />
              <ChannelBar
                label="Direto / WhatsApp"
                price={calc.result.directChannelPrice}
                margin={calc.result.directChannelMargin}
                maxPrice={maxChannelPrice}
              />
            </div>

            <Button
              variant="primary"
              leftIcon={<Save className="w-4 h-4" />}
              onClick={handleSave}
              className="w-full bg-brand-dark text-white hover:opacity-90 from-brand-dark to-brand-dark"
            >
              Salvar Precificação
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
