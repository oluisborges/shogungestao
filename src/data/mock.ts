// ─── ÚNICA FONTE DE DADOS MOCKADOS ───────────────────────────────────────────
// Todos os dados do app vêm daqui. Substituir as importações por chamadas de API
// quando o backend for implementado, sem precisar tocar nos componentes.
// ─────────────────────────────────────────────────────────────────────────────

import type { InventoryItem, InventoryMovement } from '@/types/inventory'
import type { Transaction, MonthlyData, FinancialSummary } from '@/types/financial'
import type { Recipe, CMVEntry } from '@/types/recipe'
import type { Invoice, Supplier } from '@/types/invoice'

// ─── FORNECEDORES ─────────────────────────────────────────────────────────────

export const suppliersMock: Supplier[] = [
  { id: 'sup-1', name: 'Frigorífico Sul',   avatarColor: '#1B4332' },
  { id: 'sup-2', name: 'Hortifruti Prime',  avatarColor: '#486400' },
  { id: 'sup-3', name: 'Embalagens Flex',   avatarColor: '#b45309' },
]

// ─── INVENTÁRIO ──────────────────────────────────────────────────────────────
// Mix realista: proteínas, grãos, embalagens, temperos, laticínios, verduras.
// Status distribuído: ~8 normal, ~5 low, ~3 critical.

export const inventoryItemsMock: InventoryItem[] = [
  {
    id: 'inv-01', name: 'Frango Inteiro',         category: 'proteins',   unit: 'kg',
    currentQuantity: 45.5, minimumQuantity: 30, status: 'normal',
    unitCost: 12.90, lastUpdated: '2024-03-18T10:00:00',
  },
  {
    id: 'inv-02', name: 'Carne Bovina Moída',     category: 'proteins',   unit: 'kg',
    currentQuantity: 12.0, minimumQuantity: 20, status: 'low',
    unitCost: 28.50, lastUpdated: '2024-03-17T14:30:00',
  },
  {
    id: 'inv-03', name: 'Arroz Agulhinha',        category: 'grains',     unit: 'kg',
    currentQuantity: 80.0, minimumQuantity: 50, status: 'normal',
    unitCost: 4.20, lastUpdated: '2024-03-15T09:00:00',
  },
  {
    id: 'inv-04', name: 'Óleo de Soja',           category: 'grains',     unit: 'L',
    currentQuantity: 8.5, minimumQuantity: 20, status: 'critical',
    unitCost: 7.80, lastUpdated: '2024-03-16T11:00:00',
  },
  {
    id: 'inv-05', name: 'Embalagem 500ml',        category: 'packaging',  unit: 'un',
    currentQuantity: 350, minimumQuantity: 200, status: 'normal',
    unitCost: 0.85, lastUpdated: '2024-03-14T16:00:00',
  },
  {
    id: 'inv-06', name: 'Embalagem 1L',           category: 'packaging',  unit: 'un',
    currentQuantity: 85, minimumQuantity: 150, status: 'low',
    unitCost: 1.20, lastUpdated: '2024-03-13T08:00:00',
  },
  {
    id: 'inv-07', name: 'Alho Triturado',         category: 'seasonings', unit: 'kg',
    currentQuantity: 3.2, minimumQuantity: 5, status: 'low',
    unitCost: 18.00, lastUpdated: '2024-03-17T10:00:00',
  },
  {
    id: 'inv-08', name: 'Sal Refinado',           category: 'seasonings', unit: 'kg',
    currentQuantity: 22.0, minimumQuantity: 10, status: 'normal',
    unitCost: 2.50, lastUpdated: '2024-03-10T12:00:00',
  },
  {
    id: 'inv-09', name: 'Pimentão Vermelho',      category: 'vegetables', unit: 'kg',
    currentQuantity: 2.1, minimumQuantity: 8, status: 'critical',
    unitCost: 9.50, lastUpdated: '2024-03-18T07:00:00',
  },
  {
    id: 'inv-10', name: 'Cebola',                 category: 'vegetables', unit: 'kg',
    currentQuantity: 15.0, minimumQuantity: 12, status: 'normal',
    unitCost: 3.80, lastUpdated: '2024-03-15T15:00:00',
  },
  {
    id: 'inv-11', name: 'Queijo Muçarela',        category: 'dairy',      unit: 'kg',
    currentQuantity: 4.5, minimumQuantity: 10, status: 'low',
    unitCost: 35.00, lastUpdated: '2024-03-16T09:00:00',
  },
  {
    id: 'inv-12', name: 'Leite Integral',         category: 'dairy',      unit: 'L',
    currentQuantity: 30.0, minimumQuantity: 20, status: 'normal',
    unitCost: 4.50, lastUpdated: '2024-03-14T11:00:00',
  },
  {
    id: 'inv-13', name: 'Farinha de Trigo',       category: 'grains',     unit: 'kg',
    currentQuantity: 35.0, minimumQuantity: 25, status: 'normal',
    unitCost: 3.90, lastUpdated: '2024-03-12T10:00:00',
  },
  {
    id: 'inv-14', name: 'Molho de Tomate',        category: 'seasonings', unit: 'un',
    currentQuantity: 1.8, minimumQuantity: 15, status: 'critical',
    unitCost: 5.90, lastUpdated: '2024-03-18T08:00:00',
  },
  {
    id: 'inv-15', name: 'Tampa Seladora',         category: 'packaging',  unit: 'cx',
    currentQuantity: 12.0, minimumQuantity: 10, status: 'normal',
    unitCost: 45.00, lastUpdated: '2024-03-11T14:00:00',
  },
]

// ─── MOVIMENTAÇÕES DE ESTOQUE ─────────────────────────────────────────────────

export const inventoryMovementsMock: InventoryMovement[] = [
  { id: 'mov-1', itemId: 'inv-01', itemName: 'Frango Inteiro',    quantity: 20,   type: 'entry', reason: 'Compra NF #00124', date: '2024-03-18T10:00:00' },
  { id: 'mov-2', itemId: 'inv-02', itemName: 'Carne Bovina Moída', quantity: -5.5, type: 'exit',  reason: 'Produção do dia',   date: '2024-03-18T08:30:00' },
  { id: 'mov-3', itemId: 'inv-09', itemName: 'Pimentão Vermelho', quantity: -3,   type: 'exit',  reason: 'Produção do dia',   date: '2024-03-18T08:30:00' },
  { id: 'mov-4', itemId: 'inv-05', itemName: 'Embalagem 500ml',   quantity: 200,  type: 'entry', reason: 'Compra NF #00125', date: '2024-03-17T16:00:00' },
  { id: 'mov-5', itemId: 'inv-11', itemName: 'Queijo Muçarela',   quantity: -2,   type: 'exit',  reason: 'Produção do dia',   date: '2024-03-17T09:00:00' },
]

// ─── FICHAS TÉCNICAS ─────────────────────────────────────────────────────────

export const recipesMock: Recipe[] = [
  {
    id: 'rec-1',
    name: 'Burger Shogun Special',
    category: 'main_course',
    yield: 10,
    ingredients: [
      { id: 'ri-1', name: 'Carne Bovina Moída', quantity: 1.2, unit: 'kg',  unitCost: 28.50 },
      { id: 'ri-2', name: 'Queijo Muçarela',    quantity: 0.3, unit: 'kg',  unitCost: 35.00 },
      { id: 'ri-3', name: 'Pão de Hambúrguer',  quantity: 10,  unit: 'un',  unitCost: 1.20  },
      { id: 'ri-4', name: 'Alface',             quantity: 0.2, unit: 'kg',  unitCost: 8.00  },
      { id: 'ri-5', name: 'Tomate',             quantity: 0.3, unit: 'kg',  unitCost: 7.50  },
      { id: 'ri-6', name: 'Embalagem 500ml',    quantity: 10,  unit: 'un',  unitCost: 0.85  },
    ],
    instructions: 'Tempere a carne com sal, pimenta e alho. Forme os hambúrgueres de 120g. Grelhe em frigideira quente por 4 min de cada lado. Monte com queijo, alface e tomate. Embale individualmente e congele.',
    createdAt: '2024-01-10T10:00:00',
  },
  {
    id: 'rec-2',
    name: 'Frango Grelhado Congelado',
    category: 'main_course',
    yield: 8,
    ingredients: [
      { id: 'ri-7', name: 'Frango Inteiro',  quantity: 2.0, unit: 'kg',  unitCost: 12.90 },
      { id: 'ri-8', name: 'Alho Triturado', quantity: 0.1, unit: 'kg',  unitCost: 18.00 },
      { id: 'ri-9', name: 'Limão',          quantity: 0.2, unit: 'kg',  unitCost: 5.00  },
      { id: 'ri-10', name: 'Azeite',        quantity: 0.1, unit: 'L',   unitCost: 28.00 },
      { id: 'ri-11', name: 'Embalagem 1L',  quantity: 8,   unit: 'un',  unitCost: 1.20  },
    ],
    instructions: 'Marinar o frango por 2 horas com limão, alho e azeite. Grelhar em alta temperatura até dourar. Deixar esfriar completamente antes de embalar e congelar.',
    createdAt: '2024-01-15T14:00:00',
  },
  {
    id: 'rec-3',
    name: 'Lasanha Bolonhesa',
    category: 'main_course',
    yield: 6,
    ingredients: [
      { id: 'ri-12', name: 'Carne Bovina Moída', quantity: 0.8,  unit: 'kg',  unitCost: 28.50 },
      { id: 'ri-13', name: 'Molho de Tomate',    quantity: 3,    unit: 'un',  unitCost: 5.90  },
      { id: 'ri-14', name: 'Massa de Lasanha',   quantity: 0.5,  unit: 'kg',  unitCost: 8.50  },
      { id: 'ri-15', name: 'Queijo Muçarela',    quantity: 0.4,  unit: 'kg',  unitCost: 35.00 },
      { id: 'ri-16', name: 'Leite Integral',     quantity: 0.5,  unit: 'L',   unitCost: 4.50  },
      { id: 'ri-17', name: 'Embalagem 1L',       quantity: 6,    unit: 'un',  unitCost: 1.20  },
    ],
    instructions: 'Refogar a carne com cebola e alho. Adicionar molho de tomate e cozinhar por 20 min. Preparar molho branco com leite e farinha. Montar camadas: massa, bolonhesa, bechamel, queijo. Assar a 180°C por 35 min. Esfriar e congelar.',
    createdAt: '2024-02-05T09:00:00',
  },
  {
    id: 'rec-4',
    name: 'Brigadeiro Gourmet',
    category: 'dessert',
    yield: 30,
    ingredients: [
      { id: 'ri-18', name: 'Leite Condensado', quantity: 0.8, unit: 'kg', unitCost: 11.50 },
      { id: 'ri-19', name: 'Cacau em Pó',      quantity: 0.1, unit: 'kg', unitCost: 22.00 },
      { id: 'ri-20', name: 'Manteiga',         quantity: 0.05, unit: 'kg', unitCost: 32.00 },
      { id: 'ri-21', name: 'Forminha P30',     quantity: 30,   unit: 'un', unitCost: 0.15  },
    ],
    instructions: 'Misturar leite condensado, cacau e manteiga em panela de fundo grosso. Mexer em fogo médio até soltar do fundo (~15 min). Deixar esfriar. Enrolar bolinhas e colocar nas forminhas.',
    createdAt: '2024-02-20T11:00:00',
  },
]

// ─── HISTÓRICO CMV ────────────────────────────────────────────────────────────

export const cmvHistoryMock: CMVEntry[] = [
  { id: 'cmv-1', productName: 'Burger Shogun Special',    date: '2024-03-15', cmvPercentage: 31.2, suggestedPrice: 28.90, netMarginAmount: 8.72 },
  { id: 'cmv-2', productName: 'Frango Grelhado Congelado', date: '2024-03-10', cmvPercentage: 28.8, suggestedPrice: 22.50, netMarginAmount: 7.20 },
  { id: 'cmv-3', productName: 'Lasanha Bolonhesa',         date: '2024-03-08', cmvPercentage: 33.5, suggestedPrice: 34.90, netMarginAmount: 9.50 },
  { id: 'cmv-4', productName: 'Brigadeiro Gourmet (cx30)', date: '2024-02-28', cmvPercentage: 25.1, suggestedPrice: 45.00, netMarginAmount: 14.80 },
  { id: 'cmv-5', productName: 'Frango ao Limão',           date: '2024-02-20', cmvPercentage: 29.4, suggestedPrice: 19.90, netMarginAmount: 6.40 },
]

// ─── NOTAS FISCAIS ────────────────────────────────────────────────────────────

export const invoicesMock: Invoice[] = [
  {
    id: 'nf-1', number: 'NF-00124', supplier: suppliersMock[0],
    issueDate: '2024-03-18', dueDate: '2024-04-17',
    totalAmount: 2890.00, status: 'pending',
    costCategory: 'Proteínas', description: 'Frango inteiro e carne bovina',
  },
  {
    id: 'nf-2', number: 'NF-00123', supplier: suppliersMock[1],
    issueDate: '2024-03-15', dueDate: '2024-03-30',
    totalAmount: 1245.60, status: 'paid',
    costCategory: 'Verduras', description: 'Reposição semanal de hortifruti',
  },
  {
    id: 'nf-3', number: 'NF-00122', supplier: suppliersMock[2],
    issueDate: '2024-03-10', dueDate: '2024-03-25',
    totalAmount: 780.00, status: 'overdue',
    costCategory: 'Embalagens', description: 'Embalagens 500ml e 1L — lote 500un',
  },
  {
    id: 'nf-4', number: 'NF-00121', supplier: suppliersMock[0],
    issueDate: '2024-03-05', dueDate: '2024-04-04',
    totalAmount: 3450.00, status: 'paid',
    costCategory: 'Proteínas', description: 'Compra mensal de proteínas',
  },
  {
    id: 'nf-5', number: 'NF-00120', supplier: suppliersMock[1],
    issueDate: '2024-03-01', dueDate: '2024-03-16',
    totalAmount: 890.30, status: 'paid',
    costCategory: 'Temperos', description: 'Alho, cebola e condimentos',
  },
  {
    id: 'nf-6', number: 'NF-00119', supplier: suppliersMock[2],
    issueDate: '2024-02-25', dueDate: '2024-03-11',
    totalAmount: 1560.00, status: 'overdue',
    costCategory: 'Embalagens', description: 'Tampas seladoras e caixas transport.',
  },
  {
    id: 'nf-7', number: 'NF-00118', supplier: suppliersMock[0],
    issueDate: '2024-02-20', dueDate: '2024-03-21',
    totalAmount: 2100.00, status: 'paid',
    costCategory: 'Proteínas', description: 'Reposição quinzenal',
  },
  {
    id: 'nf-8', number: 'NF-00117', supplier: suppliersMock[1],
    issueDate: '2024-02-15', dueDate: '2024-03-01',
    totalAmount: 432.80, status: 'paid',
    costCategory: 'Verduras', description: 'Verduras e legumes semana 7',
  },
]

// ─── FINANCEIRO — TRANSAÇÕES ──────────────────────────────────────────────────

export const transactionsMock: Transaction[] = [
  // Receitas
  {
    id: 'tx-01', type: 'revenue', description: 'Repasse iFood',         subtitle: 'Pedidos 01–15 Mar',
    category: 'ifood_repasse', amount: 18500.00, date: '2024-03-16',
    paymentMethod: 'bank_transfer', status: 'paid',
  },
  {
    id: 'tx-02', type: 'revenue', description: 'Venda Balcão / WhatsApp', subtitle: 'Semana 10–16 Mar',
    category: 'direct_sale', amount: 6800.00, date: '2024-03-16',
    paymentMethod: 'pix', status: 'paid',
  },
  {
    id: 'tx-03', type: 'revenue', description: 'Repasse iFood',         subtitle: 'Pedidos 16–28 Fev',
    category: 'ifood_repasse', amount: 16200.00, date: '2024-03-01',
    paymentMethod: 'bank_transfer', status: 'paid',
  },
  {
    id: 'tx-04', type: 'revenue', description: 'Venda Balcão / WhatsApp', subtitle: 'Semana 25 Fev–02 Mar',
    category: 'direct_sale', amount: 4200.00, date: '2024-03-02',
    paymentMethod: 'pix', status: 'paid',
  },
  {
    id: 'tx-05', type: 'revenue', description: 'Repasse iFood',         subtitle: 'Pedidos 01–14 Fev',
    category: 'ifood_repasse', amount: 14800.00, date: '2024-02-15',
    paymentMethod: 'bank_transfer', status: 'paid',
  },
  // Despesas
  {
    id: 'tx-06', type: 'expense', description: 'Compra de Insumos',     subtitle: 'Frigorífico Sul NF-00124',
    category: 'ingredients', amount: 2890.00, date: '2024-03-18',
    paymentMethod: 'bank_transfer', status: 'pending',
  },
  {
    id: 'tx-07', type: 'expense', description: 'Aluguel',               subtitle: 'Março 2024',
    category: 'rent', amount: 3500.00, date: '2024-03-05',
    paymentMethod: 'bank_transfer', status: 'paid',
  },
  {
    id: 'tx-08', type: 'expense', description: 'Energia Elétrica',      subtitle: 'Fatura Fevereiro',
    category: 'energy', amount: 1240.00, date: '2024-03-10',
    paymentMethod: 'debit_card', status: 'paid',
  },
  {
    id: 'tx-09', type: 'expense', description: 'Embalagens',            subtitle: 'Embalagens Flex NF-00122',
    category: 'packaging', amount: 780.00, date: '2024-03-10',
    paymentMethod: 'pix', status: 'overdue',
  },
  {
    id: 'tx-10', type: 'expense', description: 'Mão de Obra',           subtitle: 'Pagamento quinzena',
    category: 'labor', amount: 4200.00, date: '2024-03-15',
    paymentMethod: 'bank_transfer', status: 'paid',
  },
  {
    id: 'tx-11', type: 'expense', description: 'Marketing Digital',     subtitle: 'Anúncios Instagram/Meta',
    category: 'marketing', amount: 650.00, date: '2024-03-12',
    paymentMethod: 'credit_card', status: 'paid',
  },
  {
    id: 'tx-12', type: 'expense', description: 'Compra de Insumos',     subtitle: 'Hortifruti Prime NF-00123',
    category: 'ingredients', amount: 1245.60, date: '2024-03-15',
    paymentMethod: 'pix', status: 'paid',
  },
]

// ─── FINANCEIRO — RESUMO MENSAL (últimos 6 meses) ────────────────────────────

export const monthlyDataMock: MonthlyData[] = [
  { month: 'Out', revenue: 38200, expenses: 24100 },
  { month: 'Nov', revenue: 41500, expenses: 25800 },
  { month: 'Dez', revenue: 52300, expenses: 30400 },  // pico natalino
  { month: 'Jan', revenue: 36800, expenses: 23200 },
  { month: 'Fev', revenue: 40100, expenses: 25600 },
  { month: 'Mar', revenue: 45200, expenses: 27800 },
]

export const financialSummaryMock: FinancialSummary = {
  currentBalance: 28400,
  monthRevenue:   45200,
  monthExpenses:  27800,
  projectedProfit: 12500,
}

// ─── SÉRIES TEMPORAIS — FATURAMENTO 30 DIAS ──────────────────────────────────
// Picos realistas nos fins de semana (sábado/domingo).
// Cada objeto representa um dia de faturamento.

export const revenueTimeSeriesMock: Array<{ date: string; label: string; value: number }> = [
  { date: '2024-02-18', label: '18/02', value: 980  },
  { date: '2024-02-19', label: '19/02', value: 1240 },  // seg
  { date: '2024-02-20', label: '20/02', value: 1100 },
  { date: '2024-02-21', label: '21/02', value: 1320 },
  { date: '2024-02-22', label: '22/02', value: 1180 },
  { date: '2024-02-23', label: '23/02', value: 2100 },  // sex
  { date: '2024-02-24', label: '24/02', value: 2680 },  // sáb
  { date: '2024-02-25', label: '25/02', value: 2420 },  // dom
  { date: '2024-02-26', label: '26/02', value: 1050 },
  { date: '2024-02-27', label: '27/02', value: 1290 },
  { date: '2024-02-28', label: '28/02', value: 1380 },
  { date: '2024-02-29', label: '29/02', value: 1420 },
  { date: '2024-03-01', label: '01/03', value: 2350 },  // sex
  { date: '2024-03-02', label: '02/03', value: 2890 },  // sáb
  { date: '2024-03-03', label: '03/03', value: 2540 },  // dom
  { date: '2024-03-04', label: '04/03', value: 1120 },
  { date: '2024-03-05', label: '05/03', value: 1260 },
  { date: '2024-03-06', label: '06/03', value: 1340 },
  { date: '2024-03-07', label: '07/03', value: 1480 },
  { date: '2024-03-08', label: '08/03', value: 2200 },  // sex
  { date: '2024-03-09', label: '09/03', value: 2750 },  // sáb
  { date: '2024-03-10', label: '10/03', value: 2480 },  // dom
  { date: '2024-03-11', label: '11/03', value: 1150 },
  { date: '2024-03-12', label: '12/03', value: 1380 },
  { date: '2024-03-13', label: '13/03', value: 1290 },
  { date: '2024-03-14', label: '14/03', value: 1560 },
  { date: '2024-03-15', label: '15/03', value: 2420 },  // sex
  { date: '2024-03-16', label: '16/03', value: 2980 },  // sáb — pico
  { date: '2024-03-17', label: '17/03', value: 2610 },  // dom
  { date: '2024-03-18', label: '18/03', value: 1340 },
]

// ─── ALERTAS FINANCEIROS ──────────────────────────────────────────────────────

export const financialAlertsMock = [
  {
    id: 'alert-1',
    title: 'Nota Fiscal vencida',
    description: 'NF-00122 da Embalagens Flex venceu há 7 dias. Valor: R$ 780,00.',
    severity: 'danger' as const,
    date: '2024-03-18',
  },
  {
    id: 'alert-2',
    title: 'Meta de CMV ultrapassada',
    description: 'CMV médio do mês está em 32,4% — acima do alvo de 30%.',
    severity: 'warning' as const,
    date: '2024-03-18',
  },
  {
    id: 'alert-3',
    title: 'Boa performance iFood',
    description: 'Repasse de março +12% versus fevereiro. Continue monitorando.',
    severity: 'success' as const,
    date: '2024-03-16',
  },
]
