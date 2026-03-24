import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChefHat, TrendingUp } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simula latência de rede antes de redirecionar — sem validação real
    setTimeout(() => {
      navigate('/dashboard')
    }, 800)
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Lado esquerdo — Brand ─────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-dark flex-col justify-between p-12 relative overflow-hidden">
        {/* Padrão de fundo sutil */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 80%, #A2D729 0%, transparent 50%), radial-gradient(circle at 80% 20%, #486400 0%, transparent 50%)',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-brand-dark" />
            </div>
            <span className="font-headline font-bold text-brand-green text-xl">
              Shogun Gestão
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-headline font-bold text-4xl text-white leading-tight mb-4">
            Domine a gestão<br />do seu delivery.
          </h1>
          <p className="text-white/60 text-lg font-body leading-relaxed max-w-sm">
            Controle CMV, estoque, finanças e fichas técnicas em um só lugar.
          </p>
        </div>

        {/* Card de social proof */}
        <div className="relative z-10">
          <div className="bg-white/10 backdrop-blur rounded-2xl p-5 max-w-xs">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-brand-green/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-brand-green" />
              </div>
              <div>
                <p className="font-headline font-bold text-white text-lg leading-tight">+24%</p>
                <p className="font-body text-white/50 text-xs">de margem média</p>
              </div>
            </div>
            <p className="font-body text-white/70 text-sm leading-relaxed">
              Média de aumento de margem nos clientes Shogun que usam a plataforma.
            </p>
          </div>
        </div>
      </div>

      {/* ── Lado direito — Formulário ──────────────────────────────────────── */}
      <div className="flex-1 bg-surface flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-sm">
          {/* Logo mobile */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-brand-dark rounded-xl flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-brand-green" />
            </div>
            <span className="font-headline font-bold text-brand-dark text-lg">
              Shogun Gestão
            </span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="font-headline font-bold text-2xl text-text-main mb-1">
              Bem-vindo de volta
            </h2>
            <p className="font-body text-sm text-text-secondary">
              Gestão inteligente para o seu delivery
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
            <Input
              label="Senha"
              passwordToggle
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />

            {/* Manter conectado */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded accent-brand-primary"
                />
                <span className="font-body text-sm text-text-secondary">Manter conectado</span>
              </label>
              <button
                type="button"
                className="font-body text-sm text-brand-primary hover:underline"
              >
                Esqueci minha senha
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={isLoading}
              className="w-full mt-2"
            >
              Entrar →
            </Button>
          </form>

          {/* Rodapé */}
          <p className="font-body text-sm text-text-disabled text-center mt-8">
            Não possui acesso?{' '}
            <a href="#" className="text-brand-primary hover:underline">
              Falar com suporte
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
