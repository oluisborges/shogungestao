import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { Login } from '@/pages/Login'
import { Dashboard } from '@/pages/Dashboard'
import { CMV } from '@/pages/CMV'
import { FichaTecnica } from '@/pages/FichaTecnica'
import { Estoque } from '@/pages/Estoque'
import { NotasFiscais } from '@/pages/NotasFiscais'
import { Financeiro } from '@/pages/Financeiro'

/**
 * Definição centralizada de todas as rotas.
 * Rotas públicas (login) ficam fora do Layout.
 * Rotas autenticadas ficam dentro do Layout (sidebar + topbar).
 */
export function AppRouter() {
  return (
    <Routes>
      {/* Rota pública */}
      <Route path="/login" element={<Login />} />

      {/* Rotas autenticadas — todas dentro do Layout */}
      <Route element={<Layout />}>
        <Route path="/dashboard"     element={<Dashboard />} />
        <Route path="/cmv"           element={<CMV />} />
        <Route path="/ficha-tecnica" element={<FichaTecnica />} />
        <Route path="/estoque"       element={<Estoque />} />
        <Route path="/notas-fiscais" element={<NotasFiscais />} />
        <Route path="/financeiro"    element={<Financeiro />} />
      </Route>

      {/* Redireciona raiz para o dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Redireciona qualquer rota desconhecida para o dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
