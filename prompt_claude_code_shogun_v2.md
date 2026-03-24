# Prompt — Claude Code: Frontend Shogun Gestão
# Versão 2 — Com padrões de código colaborativo

---

## LEIA ANTES DE QUALQUER COISA

Este projeto é desenvolvido em colaboração entre devs humanos e IAs. O código será lido, alterado e expandido por outras pessoas e outros modelos de linguagem que não têm contexto do que foi feito antes. Por isso, **clareza e organização não são opcionais — são o produto.**

Antes de escrever qualquer linha de código, internalize:

> "Quem vier depois de mim não me conhece, não conhece esse sistema, e vai precisar entender o que eu fiz só lendo o código."

Isso guia cada decisão de nomenclatura, estrutura, comentário e separação de responsabilidades.

---

## MISSÃO

Construa o frontend completo do **Shogun Gestão**, um sistema SaaS de gestão para donos de delivery de comidas congeladas. O produto é entregue pelo Grupo Shogun (agência de marketing digital) como ferramenta para seus clientes.

O frontend deve ser uma **React SPA** com roteamento client-side, dados mockados (sem backend), totalmente funcional na navegação, interações e cálculos. O visual foi projetado e aprovado — use as referências como base fiel, mas melhore onde houver oportunidade clara de elevar UX ou polish visual.

**Escopo:** apenas frontend. Nenhuma decisão de backend, banco de dados, autenticação real ou infraestrutura deve ser implementada ou sugerida neste momento.

---

## STACK OBRIGATÓRIA

- **React + Vite** (TypeScript)
- **Tailwind CSS** com config customizada (tokens abaixo)
- **React Router DOM** para roteamento
- **Recharts** para todos os gráficos
- **Lucide React** para ícones (não usar Material Symbols)
- **date-fns** para formatação de datas
- **Fontes:** Plus Jakarta Sans (headlines) + Inter (body/UI) via Google Fonts

Não usar bibliotecas de componentes prontos (shadcn, MUI, Ant Design). Tudo custom, baseado no design system abaixo.

---

## PADRÕES DE CÓDIGO — REGRAS NÃO NEGOCIÁVEIS

Estas regras se aplicam a todo arquivo criado ou modificado neste projeto, agora e no futuro. Qualquer dev ou IA que contribuir com este repositório deve seguir e manter estes padrões.

### 1. Responsabilidade única por arquivo

Cada arquivo faz uma coisa só. Um componente não carrega lógica de negócio, dados e apresentação ao mesmo tempo.

```
❌ Errado: componente que busca dados, calcula CMV e renderiza a tabela
✅ Certo:  hook useCMV() para lógica | mock.ts para dados | CMVTable.tsx para apresentação
```

### 2. Nenhum dado hardcoded dentro de componentes

Todos os dados mockados ficam em `src/data/mock.ts`. Componentes importam de lá. Isso facilita a substituição futura por dados reais de uma API.

```ts
// ❌ Errado
const insumos = [{ nome: 'Frango', quantidade: 10 }]

// ✅ Certo
import { insumosMock } from '@/data/mock'
```

### 3. Nomenclatura descritiva e em inglês

Variáveis, funções, tipos e componentes em inglês. Nomes que descrevem intenção, não implementação.

```ts
// ❌ Errado
const d = items.filter(i => i.s === 'low')
const handleClick = () => { ... }

// ✅ Certo
const lowStockItems = inventoryItems.filter(item => item.status === 'low')
const handleAddIngredient = () => { ... }
```

### 4. Tipos TypeScript explícitos em tudo

Nenhum `any`. Interfaces e types em `src/types/` compartilhados entre componentes.

```ts
// src/types/inventory.ts
export interface InventoryItem {
  id: string
  name: string
  category: InventoryCategory
  unit: MeasurementUnit
  currentQuantity: number
  minimumQuantity: number
  status: StockStatus
}

export type StockStatus = 'normal' | 'low' | 'critical'
export type InventoryCategory = 'proteins' | 'grains' | 'packaging' | 'seasonings'
```

### 5. Comentários que explicam o "porquê", não o "o quê"

O código descreve o que está acontecendo. O comentário explica por que aquela decisão foi tomada.

```ts
// ❌ Inútil — o código já diz isso
// Filtra itens com status low
const lowStock = items.filter(item => item.status === 'low')

// ✅ Útil — explica a decisão
// Vermelho é reservado para alertas críticos no sistema.
// Despesas usam laranja para não confundir com status de erro.
const EXPENSE_CHART_COLOR = '#f97316'
```

### 6. Componentes pequenos e compostos

Se um componente passa de ~150 linhas, provavelmente pode ser dividido. Prefira composição a componentes monolíticos.

```
❌ Errado: <EstoquePage /> com 400 linhas fazendo tudo
✅ Certo:  <EstoquePage /> compõe <StockSummaryCards />, <StockTable />, <StockAlerts />
```

### 7. Props explícitas com interface documentada

Todo componente tem uma interface de props definida logo acima da função, com comentário nas props não óbvias.

```tsx
interface KpiCardProps {
  label: string
  value: string
  /** Variação percentual. Positivo = verde, negativo = vermelho. */
  variation: number
  /** Quando true, inverte a lógica de cor (ex: CMV — menor é melhor) */
  invertVariationColor?: boolean
  icon: LucideIcon
}
```

### 8. Constantes no topo, fora do componente

Valores fixos que não dependem de props ou estado ficam fora da função do componente, evitando recriação a cada render.

```ts
// ✅ Fora do componente
const ITEMS_PER_PAGE = 10
const CMV_TARGET_PERCENTAGE = 30
const ANIMATION_DURATION_MS = 200

export function StockTable({ ... }) { ... }
```

### 9. Estrutura de pasta consistente — não criar pasta nova sem razão

A estrutura definida abaixo é o contrato do projeto. Não criar pastas novas sem necessidade clara. Se criar, documentar no README.

### 10. Cada PR/commit deixa o código melhor do que encontrou

Se ao implementar uma feature você perceber que um componente existente viola alguma das regras acima, corrija-o. Não acumule dívida técnica.

---

## ARQUIVO CLAUDE.md (criar na raiz do projeto)

Criar um arquivo `CLAUDE.md` na raiz do repositório com o seguinte conteúdo. Este arquivo é lido automaticamente pelo Claude Code a cada sessão e garante que qualquer IA que abrir este projeto entenda o contexto e os padrões antes de tocar em qualquer coisa.

```markdown
# CLAUDE.md — Contexto do Projeto Shogun Gestão

## O que é este projeto

Frontend de um sistema SaaS de gestão para donos de delivery de comidas congeladas.
Desenvolvido pelo Grupo Shogun. Stack: React + Vite + TypeScript + Tailwind CSS.

## Quem trabalha neste projeto

Devs humanos e IAs em colaboração. O código é escrito pensando que a próxima
pessoa que abrir este arquivo não tem contexto algum do que foi feito antes.
Clareza e organização são o produto.

## Escopo atual

APENAS frontend. Não há backend implementado. Dados são mockados em src/data/mock.ts.
Não implementar, sugerir ou assumir qualquer solução de backend, autenticação real
ou banco de dados sem alinhamento explícito.

## Regras inegociáveis

1. Responsabilidade única por arquivo
2. Dados mockados somente em src/data/mock.ts — nunca hardcoded em componentes
3. Nenhum `any` no TypeScript — types e interfaces em src/types/
4. Nomenclatura em inglês, descritiva, sem abreviações
5. Comentários explicam o "porquê", não o "o quê"
6. Componentes com mais de ~150 linhas devem ser divididos
7. Props sempre tipadas com interface documentada acima do componente
8. Constantes fixas fora da função do componente
9. Não criar pastas novas sem documentar no README
10. Ao mexer em código existente, deixá-lo melhor do que estava

## Design system

Tokens de cor, tipografia e espaçamento estão em tailwind.config.ts.
Nunca usar hex hardcoded no JSX — usar apenas as classes do design system.
Referência completa: ver seção DESIGN SYSTEM no prompt original.

## Ícones

Lucide React exclusivamente. Nunca emojis como ícones estruturais.

## Gráficos

Recharts. Cor de despesas = #f97316 (laranja). Vermelho reservado para alertas críticos.

## Como rodar

npm install
npm run dev

## Onde encontrar o quê

src/data/mock.ts        — todos os dados mockados
src/types/              — interfaces e types compartilhados
src/components/ui/      — componentes base reutilizáveis
src/components/layout/  — Sidebar, TopBar, Layout
src/pages/              — uma página por rota
src/hooks/              — hooks customizados
src/router/index.tsx    — definição de rotas
```

---

## DESIGN SYSTEM

### Paleta de cores (tailwind.config.ts)

```ts
colors: {
  // Surfaces — hierarquia de profundidade visual
  'surface':               '#f5f7f2',  // canvas base da página
  'surface-low':           '#eff2ec',  // inputs e áreas de formulário
  'surface-container':     '#e6e9e4',  // seções agrupadas
  'surface-high':          '#e0e4de',  // hover states de seções
  'surface-highest':       '#daded8',  // separadores visuais
  'surface-white':         '#ffffff',  // cards e elementos flutuantes
  'surface-dim':           '#d1d6cf',  // backgrounds desativados

  // Brand Shogun
  'brand-green':           '#A2D729',  // item ativo, destaque principal
  'brand-dark':            '#1B4332',  // sidebar, fundos estruturais
  'brand-primary':         '#486400',  // botões primários
  'brand-primary-dim':     '#3e5700',  // gradient end nos botões

  // Texto
  'text-main':             '#2c2f2c',  // texto principal
  'text-secondary':        '#595c59',  // texto de apoio, labels
  'text-disabled':         '#9b9e99',  // placeholders, estados desativados

  // Semântico — status e alertas
  'success':               '#3c6351',
  'success-bg':            '#c1ecd4',
  'warning':               '#b45309',
  'warning-bg':            '#fef3c7',
  'danger':                '#b02500',
  'danger-bg':             '#fee2e2',
  'info':                  '#1d4ed8',
  'info-bg':               '#dbeafe',

  // Bordas
  'outline':               '#757874',
  'outline-subtle':        'rgba(171,174,169,0.3)',
}
```

### Tipografia

```ts
fontFamily: {
  headline: ['Plus Jakarta Sans', 'sans-serif'],
  body:     ['Inter', 'sans-serif'],
}
```

| Uso | Classes |
|---|---|
| Título de página | `font-headline font-bold text-2xl text-text-main` |
| Título de seção | `font-headline font-semibold text-lg text-text-main` |
| Label de campo/tabela | `font-body text-xs font-semibold uppercase tracking-wider text-text-secondary` |
| Texto corrido | `font-body text-sm text-text-main` |
| Valor monetário em destaque | `font-headline font-bold text-2xl` |

Máximo 3 tamanhos de texto por tela. Hierarquia via peso e cor, não só escala.

### Elevação — sem borders duras entre seções

```
Camada 1 — página:    bg-surface
Camada 2 — seções:    bg-surface-container
Camada 3 — cards:     bg-surface-white + shadow-[0_12px_32px_-4px_rgba(27,67,50,0.06)]
Modais:               bg-surface-white/80 + backdrop-blur-xl
```

Nunca usar `border: 1px solid` para separar áreas principais. A diferença de background cria a hierarquia.

### Espaçamento

Grid de 8px. Padding interno de cards: `p-6` ou `p-8`. Gap entre seções: `gap-6`.

### Botões

```
Primário:   bg-gradient-to-br from-brand-primary to-brand-primary-dim text-white rounded-xl px-5 py-2.5 font-headline font-semibold text-sm
Secundário: bg-surface-container text-brand-primary rounded-xl px-5 py-2.5 font-body font-semibold text-sm
Ghost:      text-text-secondary hover:bg-surface-container rounded-xl px-5 py-2.5
```

Todos com `transition-all duration-200 hover:opacity-90 active:scale-[0.98]`.

### Inputs

```
bg-surface-low rounded-xl px-4 py-3 text-sm font-body text-text-main
focus:outline-none focus:ring-2 focus:ring-brand-green/30
placeholder:text-text-disabled
```

Labels sempre visíveis acima do input. Nunca usar só placeholder como label.

### Status badges

```
Pago / Normal / OK:  bg-success-bg text-success text-xs font-semibold px-2.5 py-1 rounded-full
Pendente / Baixo:    bg-warning-bg text-warning text-xs font-semibold px-2.5 py-1 rounded-full
Vencido / Crítico:   bg-danger-bg text-danger text-xs font-semibold px-2.5 py-1 rounded-full
```

### Border radius

| Elemento | Classe |
|---|---|
| Cards e modais | `rounded-2xl` |
| Botões e inputs | `rounded-xl` |
| Badges | `rounded-full` |
| Avatares | `rounded-full` |

---

## ESTRUTURA DO PROJETO

```
shogun-gestao/
├── CLAUDE.md                          # contexto para IAs e devs novos
├── README.md                          # setup e documentação geral
├── tailwind.config.ts                 # design tokens
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── router/
│   │   └── index.tsx                  # todas as rotas centralizadas aqui
│   ├── types/                         # interfaces e types compartilhados
│   │   ├── inventory.ts
│   │   ├── financial.ts
│   │   ├── recipe.ts
│   │   ├── invoice.ts
│   │   └── common.ts                  # tipos genéricos (Status, etc)
│   ├── data/
│   │   └── mock.ts                    # ÚNICA fonte de dados mockados
│   ├── hooks/
│   │   ├── useToast.ts
│   │   ├── usePagination.ts
│   │   └── useCMVCalculator.ts        # lógica de cálculo isolada
│   ├── utils/
│   │   ├── currency.ts                # formatação de moeda pt-BR
│   │   ├── date.ts                    # helpers de data com date-fns
│   │   └── cmv.ts                     # fórmulas de CMV puras e testáveis
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.tsx             # wrapper com Sidebar + TopBar + <Outlet>
│   │   │   ├── Sidebar.tsx
│   │   │   └── TopBar.tsx
│   │   └── ui/                        # componentes base reutilizáveis
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── EmptyState.tsx
│   │       ├── Input.tsx
│   │       ├── KpiCard.tsx
│   │       ├── Modal.tsx
│   │       ├── Skeleton.tsx
│   │       ├── Table.tsx
│   │       └── Toast.tsx
│   └── pages/
│       ├── Login.tsx
│       ├── Dashboard.tsx
│       ├── CMV.tsx
│       ├── FichaTecnica.tsx
│       ├── Estoque.tsx
│       ├── NotasFiscais.tsx
│       └── Financeiro.tsx
```

---

## LAYOUT GLOBAL

### Sidebar

- Largura fixa desktop: `w-56`
- Fundo: `bg-brand-dark`
- Logo: ícone verde + "Shogun Gestão" em `text-brand-green font-headline font-bold` + `text-white/40 text-[10px] uppercase tracking-widest`
- Nav item padrão: `text-white/70 hover:text-brand-green hover:bg-white/5 rounded-xl px-4 py-3 flex items-center gap-3`
- Nav item ativo: `bg-brand-green text-brand-dark font-bold rounded-xl`
- Configurações separado com `mt-auto`
- Avatar + nome do usuário + botão logout no rodapé

### Comportamento responsivo

| Breakpoint | Comportamento |
|---|---|
| `< 768px` | Sidebar oculta. Botão hamburger na TopBar abre drawer com overlay |
| `768px–1280px` | Sidebar colapsada `w-16`, apenas ícones com tooltip no hover |
| `> 1280px` | Sidebar expandida completa `w-56` |

### TopBar

- Fundo: `bg-surface-white shadow-[0_1px_0_0_rgba(27,67,50,0.06)]`
- Saudação dinâmica por horário: "Bom dia / Boa tarde / Boa noite, [Nome]" + data pt-BR
- Ícone de notificação com badge numérico
- Avatar com dropdown: Perfil, Logout

---

## TELAS

### 1. Login (`/login`)

Split 50/50 desktop. Mobile: apenas formulário.

**Esquerda — `bg-brand-dark`:**
- Logo + headline: "Domine a gestão do seu delivery." `font-headline font-bold text-4xl text-white`
- Subtítulo em `text-white/60 text-lg`
- Card de social proof: "+24% de margem média nos clientes Shogun"
- Padrão de fundo sutil (gradiente diagonal ou SVG noise)

**Direita — `bg-surface`:**
- Logo + "Shogun Gestão" + tagline "Gestão inteligente para o seu delivery"
- Campos: e-mail, senha (toggle mostrar/ocultar), checkbox "manter conectado"
- Botão primário "Entrar →" full-width
- Link "Esqueci minha senha"
- "Não possui acesso? Falar com suporte" no rodapé
- Submit redireciona para `/dashboard` (sem validação real de auth)

---

### 2. Dashboard (`/dashboard`)

**KPI Cards — 4 em linha (2x2 no mobile):**

| Label | Ícone | Valor | Variação |
|---|---|---|---|
| Faturamento do Mês | TrendingUp | R$ 45.200 | +12% |
| CMV Médio | Percent | 32,4% | -2% (bom — menor CMV é melhor, inverter cor) |
| Estoque Baixo | AlertTriangle | 8 Itens | badge "Alerta" |
| Resultado Financeiro | Wallet | R$ 12.500 | +5% |

**Gráfico de Faturamento (Recharts BarChart):**
- 20 pontos de dados dos últimos 30 dias (do mock)
- Barras em `#A2D729` a 60% opacidade, barra hover/ativa a 100%
- Tooltip customizado: `bg-brand-dark text-white rounded-xl`
- Grid horizontal suave `rgba(27,67,50,0.06)`, sem linhas verticais
- Botões: "Exportar PDF" (ghost) + "Ver Detalhes" (secundário)

**Alertas Críticos (coluna lateral):**
- Insumos em estoque crítico/baixo
- Borda esquerda: `border-l-4 border-danger` para CRÍTICO, `border-l-4 border-warning` para BAIXO
- Botão de ação rápida por item
- Card "Live Pulse" com dot `bg-brand-green` animado (CSS pulse) + resumo operacional

**Tabela Últimos Lançamentos:**
- 5 linhas: insumo, NF, valor, status badge, menu (⋮)
- Sem dividers entre linhas, alternância sutil de fundo

---

### 3. CMV e Precificação (`/cmv`)

**Layout:** formulário esquerda (60%) + card resultado direita sticky (40%).

**Formulário:**
- Nome do Produto
- Lista dinâmica de insumos: [nome | R$ valor] com botão remover. Botão "+ Adicionar Insumo"
- Comissão Marketplace (%) com helper text
- Taxas de Cartão/ADM (%)
- Custo de Embalagem (R$)
- Card "Otimização de Lucro" condicional: aparece quando margem calculada > 25%

**Card Resultado — `bg-brand-green` com texto escuro, sticky:**
- CMV R$ + CMV % lado a lado
- Preço Sugerido: `font-headline font-bold text-4xl`
- Card interno escuro: Margem Líquida
- Botão "Salvar Precificação"
- Seção "Comparativo por Canal": iFood vs Direto/WhatsApp com progress bars

**Cálculo em tempo real** a cada mudança de campo.

**Fórmulas — implementar em `src/utils/cmv.ts`:**
```ts
// Custo total de produção
const totalCost = ingredients.reduce((sum, i) => sum + i.cost, 0) + packagingCost

// Percentual do CMV em relação ao preço de venda
const cmvPercentage = (totalCost / suggestedPrice) * 100

// Preço sugerido para atingir margem alvo (padrão: 30%)
// Considera CMV + comissão do marketplace + taxa de cartão
const suggestedPrice = totalCost / (1 - (targetMargin + marketplaceCommission + cardFee) / 100)

// Margem líquida em R$ após todos os custos variáveis
const netMargin = suggestedPrice - totalCost - (suggestedPrice * (marketplaceCommission + cardFee) / 100)
```

**Histórico:** tabela com 5 linhas mockadas. Produto, data, CMV%, preço final, margem R$, editar.

---

### 4. Ficha Técnica (`/ficha-tecnica`)

**Formulário:**
- Upload de foto: área drag & drop `border-2 border-dashed border-outline-subtle rounded-2xl`
- Nome do Prato
- Categoria (dropdown): Pratos Principais, Sobremesas, Entradas, Bebidas
- Rendimento (Porções)
- Lista dinâmica de insumos: [nome | quantidade | unidade (kg/g/un/ml/L)]
- Modo de Preparo (textarea)
- Botão "Salvar Ficha Técnica"

**Grid de Fichas:**
- Toggle grid/lista no canto direito
- **Grid:** 3 col desktop / 2 tablet / 1 mobile
  - Topo do card: fundo sólido + ícone Lucide centralizado (sem fotos)
  - Cor por categoria: Pratos = `bg-brand-dark`, Sobremesas = `bg-brand-green/20`, Entradas = `bg-surface-high`, Bebidas = `bg-info-bg`
  - Badge de categoria sobreposto canto superior esquerdo
  - Nome, label "CUSTO POR PORÇÃO", valor em `text-brand-primary font-bold`
  - Botões: Editar + lixeira ghost vermelho
- **Lista:** tabela com ícone, nome, categoria, porções, custo, ações
- Clique no card: modal com detalhes completos (ingredientes, preparo, custo total)

---

### 5. Gestão de Estoque (`/estoque`)

**Cards de resumo (3 em linha):**
- Total de Insumos: 124
- Estoque Baixo: 18 (ícone AlertTriangle amarelo)
- Nível Crítico: 05 (ícone AlertOctagon vermelho)

**Filtros:** Dropdown categorias + Dropdown status + botões Exportar PDF / Relatório

**Tabela:**

| Coluna | Detalhe |
|---|---|
| Insumo | ícone/thumb + nome |
| Categoria | texto |
| Unidade | texto |
| Qtd Atual | vermelho se CRÍTICO, amarelo se BAIXO |
| Qtd Mínima | texto |
| Status | badge colorido |
| Ações | `+` entrada / `−` saída / lápis editar |

- Linha CRÍTICO: `border-l-4 border-danger`
- Linha BAIXO: `border-l-4 border-warning`
- Paginação: "Mostrando X de Y" + controles

**Cards inferiores:**
- "Análise de Consumo": insight do insumo mais consumido + botão "Otimizar Pedidos"
- "Live Pulse": movimentações recentes com timestamps relativos

**Modal Adicionar Insumo:** nome, categoria, unidade, qtd inicial, qtd mínima, foto (opcional).

---

### 6. Gestão de Notas Fiscais (`/notas-fiscais`)

**Filtros em linha:** date range, fornecedor, status + botão Filtrar

**Tabela:**

| Coluna | Detalhe |
|---|---|
| Número NF | texto |
| Fornecedor | avatar com iniciais coloridas + nome |
| Data de Emissão | formatada pt-BR |
| Valor Total | R$ |
| Status | badge Paga/Pendente/Vencida |
| Ações | menu ⋮: Ver detalhes, Marcar paga, Editar, Excluir |

Paginação no rodapé.

**Cards de resumo (rodapé da página):**
- Total Pago (mês): `bg-brand-dark text-brand-green`
- Pendente: fundo neutro
- Total Vencido: `bg-danger-bg text-danger` + ícone alerta

**Modal Lançar NF:** Número, Fornecedor, Data Emissão, Data Vencimento, Valor, Categoria de Custo, Descrição, upload de anexo (PDF/imagem).

---

### 7. Gestão Financeira (`/financeiro`)

**Abas:** Visão Geral | Receitas | Despesas | DRE

**Visão Geral:**

4 KPI cards: Saldo Atual | Receitas (Mês) `text-success` | Despesas (Mês) `text-danger` | Lucro Projetado

Gráfico Recharts `BarChart` agrupado, 6 meses:
- Receitas: `#1B4332` (verde escuro)
- Despesas: `#f97316` (laranja)
- **Vermelho é proibido aqui.** Vermelho = alertas críticos no sistema. Despesas = laranja.

Alertas Financeiros (lateral): ícone + título + descrição. Botão "Ver todos".

Tabela Lançamentos Recentes: Data | Descrição + subtexto | Categoria badge | Forma Pgto | Valor +/− | Ações

**Abas Receitas/Despesas:** mesma tabela com filtros de período e categoria.

**Modal Novo Lançamento:** toggle Receita/Despesa, Valor, Data, Categoria, Descrição, Forma de Pagamento.

---

## COMPONENTES GLOBAIS

### Toast (`src/components/ui/Toast.tsx` + `src/hooks/useToast.ts`)

- Fila no canto inferior direito
- Tipos: sucesso (CheckCircle, `border-l-4 border-success`), erro (XCircle, `border-l-4 border-danger`), alerta (AlertTriangle, `border-l-4 border-warning`)
- Auto-dismiss 4s com barra de progresso animada
- Entrada: slide da direita

### Modal (`src/components/ui/Modal.tsx`)

- Overlay: `bg-black/40 backdrop-blur-sm`
- Card: `bg-surface-white rounded-2xl shadow-2xl max-w-lg w-full`
- Animação: scale `0.95 → 1` + fade in, 150ms ease-out
- Header: título + botão X
- Footer: slot para ações
- Fecha com ESC ou clique no overlay

### EmptyState (`src/components/ui/EmptyState.tsx`)

Props: `icon`, `title`, `description`, `actionLabel`, `onAction`
Usar em todas as tabelas/listas sem dados.

### Skeleton (`src/components/ui/Skeleton.tsx`)

`animate-pulse bg-surface-container rounded` para loading inicial de 800ms em todas as telas.

### Onboarding

Modal na primeira visita (flag em localStorage):
- 4 steps: Dashboard → CMV → Estoque → Notas Fiscais
- Cada step: ícone grande, título, descrição curta
- Progress dots no rodapé
- Botões: "Próximo" / "Concluir" + "Pular tour" ghost

---

## DADOS MOCK (`src/data/mock.ts`)

Única fonte de dados do projeto. Dados realistas para o nicho de delivery de comidas congeladas.

```ts
// Organizar por domínio com comentários de seção:

// ─── INVENTÁRIO ──────────────────────────────────────────
// Insumos: frango, carne bovina, arroz, óleo, embalagens, temperos

// ─── FICHAS TÉCNICAS ─────────────────────────────────────
// Burger Shogun Special, Frango Grelhado Congelado, Lasanha Bolonhesa

// ─── NOTAS FISCAIS ───────────────────────────────────────
// Fornecedores: Frigorífico Sul, Hortifruti Prime, Embalagens Flex

// ─── FINANCEIRO ──────────────────────────────────────────
// Lançamentos: repasse iFood, vendas balcão, compra insumos, aluguel, energia

// ─── SÉRIES TEMPORAIS ────────────────────────────────────
// 30 dias de faturamento com picos realistas nos fins de semana
```

---

## REGRAS DE QUALIDADE

1. Nenhum emoji como ícone — apenas Lucide React
2. Touch targets mínimos de 44px
3. Contraste mínimo 4.5:1 para texto normal
4. Labels sempre visíveis nos formulários
5. Feedback de loading em todos os botões de ação (spinner + disabled)
6. Sem cores hardcoded fora do tailwind.config
7. Responsivo em 375px / 768px / 1440px
8. Animações máximo 300ms. Respeitar `prefers-reduced-motion`
9. Sem borders 1px entre seções — usar diferença de background
10. Formulários com validação básica antes de submeter

---

## ENTREGA ESPERADA

- `npm run dev` rodando sem erros
- `CLAUDE.md` na raiz com contexto completo
- Navegação funcional entre todas as telas
- Todos os modais abrindo, fechando e submetendo
- Calculadora CMV calculando em tempo real
- Gráficos renderizando com dados do mock
- Responsivo nos 3 breakpoints
- Onboarding na primeira visita
- Toast disparando em ações (salvar, excluir, confirmar)
- Zero `any` no TypeScript
- Zero dados hardcoded dentro de componentes
