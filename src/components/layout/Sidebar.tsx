import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Percent,
  BookOpen,
  Package,
  FileText,
  Wallet,
  Settings,
  LogOut,
  ChefHat,
  X,
} from 'lucide-react'

// Itens de navegação principal
const NAV_ITEMS = [
  { to: '/dashboard',     label: 'Dashboard',       icon: LayoutDashboard },
  { to: '/cmv',           label: 'CMV e Preços',     icon: Percent         },
  { to: '/ficha-tecnica', label: 'Fichas Técnicas',  icon: BookOpen        },
  { to: '/estoque',       label: 'Estoque',          icon: Package         },
  { to: '/notas-fiscais', label: 'Notas Fiscais',    icon: FileText        },
  { to: '/financeiro',    label: 'Financeiro',       icon: Wallet          },
]

interface SidebarProps {
  /** Controla visibilidade do drawer no mobile */
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/login')
  }

  return (
    <>
      {/* Overlay escuro no mobile quando drawer está aberto */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50
          flex flex-col bg-brand-dark
          transition-transform duration-200
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          w-56 xl:w-56 md:w-16
          xl:!w-56
        `}
        aria-label="Navegação principal"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center flex-shrink-0">
            <ChefHat className="w-5 h-5 text-brand-dark" />
          </div>
          <div className="xl:block md:hidden overflow-hidden">
            <p className="font-headline font-bold text-brand-green leading-tight whitespace-nowrap">
              Shogun Gestão
            </p>
            <p className="text-white/40 text-[10px] uppercase tracking-widest leading-tight">
              delivery manager
            </p>
          </div>
          {/* Botão fechar no mobile */}
          <button
            className="ml-auto text-white/50 hover:text-white md:hidden"
            onClick={onClose}
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navegação */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-150 group
                ${isActive
                  ? 'bg-brand-green text-brand-dark font-bold'
                  : 'text-white/70 hover:text-brand-green hover:bg-white/5'
                }`
              }
              aria-label={label}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-body text-sm xl:block md:hidden whitespace-nowrap">
                {label}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Rodapé: Configurações + perfil */}
        <div className="border-t border-white/10 p-2 space-y-1">
          <NavLink
            to="/configuracoes"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-150
              ${isActive
                ? 'bg-brand-green text-brand-dark font-bold'
                : 'text-white/70 hover:text-brand-green hover:bg-white/5'
              }`
            }
            aria-label="Configurações"
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            <span className="font-body text-sm xl:block md:hidden whitespace-nowrap">
              Configurações
            </span>
          </NavLink>

          {/* Perfil do usuário */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-brand-green/20 flex items-center justify-center flex-shrink-0">
              <span className="font-headline font-bold text-xs text-brand-green">JS</span>
            </div>
            <div className="flex-1 min-w-0 xl:block md:hidden">
              <p className="font-body text-xs font-semibold text-white/90 truncate">João Silva</p>
              <p className="font-body text-[10px] text-white/40 truncate">joao@shogun.com</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-white/40 hover:text-white/80 transition-colors xl:block md:hidden flex-shrink-0"
              aria-label="Sair"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
