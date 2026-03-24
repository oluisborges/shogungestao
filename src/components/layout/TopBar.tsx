import { useState } from 'react'
import { Menu, Bell, ChevronDown, User, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getGreeting, formatShortDate } from '@/utils/date'

interface TopBarProps {
  onMenuClick: () => void
}

// Nome do usuário mockado — será substituído por dados reais quando o auth for implementado
const MOCK_USER_NAME = 'João'

// Número de notificações pendentes (mock)
const NOTIFICATION_COUNT = 3

export function TopBar({ onMenuClick }: TopBarProps) {
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false)
  const navigate = useNavigate()

  const greeting = getGreeting()
  const todayFormatted = formatShortDate()

  const handleLogout = () => {
    setIsAvatarMenuOpen(false)
    navigate('/login')
  }

  return (
    <header className="bg-surface-white shadow-topbar px-4 md:px-6 py-3 flex items-center gap-4">
      {/* Botão hamburger — visível apenas no mobile */}
      <button
        className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center text-text-secondary hover:bg-surface-container transition-colors"
        onClick={onMenuClick}
        aria-label="Abrir menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Saudação dinâmica */}
      <div className="flex-1 min-w-0">
        <p className="font-headline font-bold text-text-main text-sm truncate">
          {greeting}, {MOCK_USER_NAME}!
        </p>
        <p className="font-body text-xs text-text-secondary capitalize">
          {todayFormatted}
        </p>
      </div>

      {/* Ações direitas */}
      <div className="flex items-center gap-2">
        {/* Notificações */}
        <button
          className="relative w-10 h-10 rounded-xl flex items-center justify-center text-text-secondary hover:bg-surface-container transition-colors"
          aria-label={`${NOTIFICATION_COUNT} notificações pendentes`}
        >
          <Bell className="w-5 h-5" />
          {NOTIFICATION_COUNT > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center leading-none">
              {NOTIFICATION_COUNT}
            </span>
          )}
        </button>

        {/* Avatar com dropdown */}
        <div className="relative">
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-surface-container transition-colors"
            onClick={() => setIsAvatarMenuOpen(v => !v)}
            aria-label="Menu do usuário"
            aria-expanded={isAvatarMenuOpen}
          >
            <div className="w-7 h-7 rounded-full bg-brand-dark flex items-center justify-center">
              <span className="font-headline font-bold text-[10px] text-brand-green">JS</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform ${isAvatarMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown */}
          {isAvatarMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsAvatarMenuOpen(false)}
                aria-hidden="true"
              />
              <div className="absolute right-0 top-full mt-1 z-20 w-44 bg-surface-white rounded-xl shadow-card border border-surface-container overflow-hidden">
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-body text-text-main hover:bg-surface-container transition-colors"
                  onClick={() => setIsAvatarMenuOpen(false)}
                >
                  <User className="w-4 h-4 text-text-secondary" />
                  Perfil
                </button>
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-body text-danger hover:bg-danger-bg transition-colors"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
