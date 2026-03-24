import { useState } from 'react'
import { Plus, Trash2, Grid, List, Edit2, Upload } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { useToastContext } from '@/contexts/ToastContext'
import { recipesMock } from '@/data/mock'
import { formatCurrency } from '@/utils/currency'
import { RECIPE_CATEGORY_LABELS, type Recipe, type RecipeCategory } from '@/types/recipe'

type ViewMode = 'grid' | 'list'

// Cor de fundo dos cards por categoria
const CATEGORY_CARD_BG: Record<RecipeCategory, string> = {
  main_course: 'bg-brand-dark',
  dessert:     'bg-brand-green/20',
  appetizer:   'bg-surface-high',
  beverage:    'bg-info-bg',
}

const CATEGORY_ICON_COLOR: Record<RecipeCategory, string> = {
  main_course: 'text-brand-green',
  dessert:     'text-brand-primary',
  appetizer:   'text-text-main',
  beverage:    'text-info',
}

const CATEGORIES: RecipeCategory[] = ['main_course', 'dessert', 'appetizer', 'beverage']

// Calcula custo por porção de uma receita
function calcCostPerPortion(recipe: Recipe): number {
  const total = recipe.ingredients.reduce(
    (sum, ing) => sum + ing.quantity * ing.unitCost,
    0,
  )
  return recipe.yield > 0 ? total / recipe.yield : 0
}

// ── Recipe card (grid view) ───────────────────────────────────────────────────

interface RecipeCardProps {
  recipe: Recipe
  onView: (recipe: Recipe) => void
  onDelete: (id: string) => void
}

function RecipeCard({ recipe, onView, onDelete }: RecipeCardProps) {
  const costPerPortion = calcCostPerPortion(recipe)
  const bgClass = CATEGORY_CARD_BG[recipe.category]
  const iconColorClass = CATEGORY_ICON_COLOR[recipe.category]

  return (
    <div
      className="bg-surface-white rounded-2xl shadow-card overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onView(recipe)}
    >
      {/* Topo colorido por categoria */}
      <div className={`${bgClass} h-28 flex items-center justify-center relative`}>
        <div className={`w-12 h-12 ${iconColorClass}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        {/* Badge de categoria sobreposto */}
        <div className="absolute top-3 left-3">
          <Badge variant="neutral">{RECIPE_CATEGORY_LABELS[recipe.category]}</Badge>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-headline font-semibold text-text-main mb-3 line-clamp-2">{recipe.name}</h3>
        <div className="flex items-end justify-between">
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-wider text-text-secondary mb-0.5">
              Custo por porção
            </p>
            <p className="font-headline font-bold text-lg text-brand-primary">
              {formatCurrency(costPerPortion)}
            </p>
          </div>
          <div className="flex gap-1" onClick={e => e.stopPropagation()}>
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:bg-surface-container transition-colors"
              aria-label="Editar"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(recipe.id)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-text-disabled hover:text-danger hover:bg-danger-bg transition-colors"
              aria-label="Excluir"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Detail modal ──────────────────────────────────────────────────────────────

interface RecipeDetailModalProps {
  recipe: Recipe | null
  onClose: () => void
}

function RecipeDetailModal({ recipe, onClose }: RecipeDetailModalProps) {
  if (!recipe) return null
  const costPerPortion = calcCostPerPortion(recipe)
  const totalCost = costPerPortion * recipe.yield

  return (
    <Modal isOpen={!!recipe} onClose={onClose} title={recipe.name} size="lg">
      <div className="space-y-5">
        <div className="flex gap-3 flex-wrap">
          <Badge variant="neutral">{RECIPE_CATEGORY_LABELS[recipe.category]}</Badge>
          <Badge variant="info">{recipe.yield} porções</Badge>
        </div>

        {/* Ingredientes */}
        <div>
          <h4 className="font-headline font-semibold text-text-main mb-3">Ingredientes</h4>
          <div className="space-y-2">
            {recipe.ingredients.map(ing => (
              <div key={ing.id} className="flex items-center justify-between py-2 border-b border-surface-container">
                <span className="font-body text-sm text-text-main">{ing.name}</span>
                <div className="flex gap-4 items-center">
                  <span className="font-body text-xs text-text-secondary">
                    {ing.quantity} {ing.unit}
                  </span>
                  <span className="font-body text-sm font-semibold text-text-main">
                    {formatCurrency(ing.quantity * ing.unitCost)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custo total */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-surface-container rounded-xl p-4">
            <p className="font-body text-xs text-text-secondary mb-1">Custo Total</p>
            <p className="font-headline font-bold text-xl text-text-main">{formatCurrency(totalCost)}</p>
          </div>
          <div className="bg-brand-green/10 rounded-xl p-4">
            <p className="font-body text-xs text-text-secondary mb-1">Custo por Porção</p>
            <p className="font-headline font-bold text-xl text-brand-primary">{formatCurrency(costPerPortion)}</p>
          </div>
        </div>

        {/* Modo de preparo */}
        <div>
          <h4 className="font-headline font-semibold text-text-main mb-2">Modo de Preparo</h4>
          <p className="font-body text-sm text-text-secondary leading-relaxed">{recipe.instructions}</p>
        </div>
      </div>
    </Modal>
  )
}

// ── Página principal ──────────────────────────────────────────────────────────

export function FichaTecnica() {
  const toast = useToastContext()
  const [recipes, setRecipes] = useState<Recipe[]>(recipesMock)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  // Form state
  const [formName, setFormName] = useState('')
  const [formCategory, setFormCategory] = useState<RecipeCategory>('main_course')
  const [formYield, setFormYield] = useState(1)
  const [formInstructions, setFormInstructions] = useState('')

  const handleDelete = (id: string) => {
    setRecipes(prev => prev.filter(r => r.id !== id))
    toast.addToast('success', 'Ficha técnica excluída.')
  }

  const handleSaveForm = () => {
    if (!formName.trim()) {
      toast.addToast('warning', 'Informe o nome do prato.')
      return
    }
    const newRecipe: Recipe = {
      id: `rec-${Date.now()}`,
      name: formName,
      category: formCategory,
      yield: formYield,
      ingredients: [],
      instructions: formInstructions,
      createdAt: new Date().toISOString(),
    }
    setRecipes(prev => [newRecipe, ...prev])
    setIsFormOpen(false)
    setFormName('')
    toast.addToast('success', `Ficha "${formName}" salva com sucesso!`)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Título + ações */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-headline font-bold text-2xl text-text-main">Fichas Técnicas</h1>
          <p className="font-body text-sm text-text-secondary">
            {recipes.length} receitas cadastradas
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Toggle view */}
          <div className="flex bg-surface-container rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${viewMode === 'grid' ? 'bg-surface-white shadow-sm text-brand-primary' : 'text-text-disabled'}`}
              aria-label="Visualização em grade"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${viewMode === 'list' ? 'bg-surface-white shadow-sm text-brand-primary' : 'text-text-disabled'}`}
              aria-label="Visualização em lista"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsFormOpen(true)}>
            Nova Ficha
          </Button>
        </div>
      </div>

      {/* Grid ou Lista */}
      {viewMode === 'grid' ? (
        recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {recipes.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onView={setSelectedRecipe}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Upload}
            title="Nenhuma ficha técnica"
            description="Cadastre suas primeiras receitas para calcular custo e precificação."
            actionLabel="Nova Ficha"
            onAction={() => setIsFormOpen(true)}
          />
        )
      ) : (
        <Card padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-container">
                  {['Prato', 'Categoria', 'Porções', 'Custo/Porção', 'Ações'].map(h => (
                    <th key={h} className="px-6 py-3 text-left font-body text-xs font-semibold uppercase tracking-wider text-text-secondary">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recipes.map((recipe, i) => (
                  <tr
                    key={recipe.id}
                    className={`${i % 2 === 0 ? '' : 'bg-surface/50'} hover:bg-surface-low transition-colors cursor-pointer`}
                    onClick={() => setSelectedRecipe(recipe)}
                  >
                    <td className="px-6 py-3 font-body text-sm font-semibold text-text-main">{recipe.name}</td>
                    <td className="px-6 py-3"><Badge variant="neutral">{RECIPE_CATEGORY_LABELS[recipe.category]}</Badge></td>
                    <td className="px-6 py-3 font-body text-sm text-text-secondary">{recipe.yield}</td>
                    <td className="px-6 py-3 font-body text-sm font-semibold text-brand-primary">{formatCurrency(calcCostPerPortion(recipe))}</td>
                    <td className="px-6 py-3" onClick={e => e.stopPropagation()}>
                      <button onClick={() => handleDelete(recipe.id)} className="text-text-disabled hover:text-danger transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modal detail */}
      <RecipeDetailModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />

      {/* Modal novo */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Nova Ficha Técnica"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleSaveForm}>Salvar Ficha</Button>
          </>
        }
      >
        <div className="space-y-4">
          {/* Área drag & drop de foto */}
          <div className="border-2 border-dashed border-outline-subtle rounded-2xl p-8 text-center hover:border-brand-green/40 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-text-disabled mx-auto mb-2" />
            <p className="font-body text-sm text-text-secondary">
              Arraste uma foto ou <span className="text-brand-primary font-semibold">clique para selecionar</span>
            </p>
            <p className="font-body text-xs text-text-disabled mt-1">JPG, PNG até 5MB</p>
          </div>
          <Input label="Nome do Prato" placeholder="Ex: Lasanha Bolonhesa" value={formName} onChange={e => setFormName(e.target.value)} />
          <div className="flex flex-col gap-1.5">
            <label className="font-body text-xs font-semibold uppercase tracking-wider text-text-secondary">Categoria</label>
            <select
              value={formCategory}
              onChange={e => setFormCategory(e.target.value as RecipeCategory)}
              className="bg-surface-low rounded-xl px-4 py-3 text-sm font-body text-text-main focus:outline-none focus:ring-2 focus:ring-brand-green/30 min-h-[44px]"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{RECIPE_CATEGORY_LABELS[cat]}</option>
              ))}
            </select>
          </div>
          <Input label="Rendimento (porções)" type="number" min={1} value={formYield} onChange={e => setFormYield(parseInt(e.target.value) || 1)} />
          <div className="flex flex-col gap-1.5">
            <label className="font-body text-xs font-semibold uppercase tracking-wider text-text-secondary">Modo de Preparo</label>
            <textarea
              value={formInstructions}
              onChange={e => setFormInstructions(e.target.value)}
              rows={4}
              placeholder="Descreva o passo a passo do preparo..."
              className="bg-surface-low rounded-xl px-4 py-3 text-sm font-body text-text-main focus:outline-none focus:ring-2 focus:ring-brand-green/30 placeholder:text-text-disabled resize-none"
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
