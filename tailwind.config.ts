import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ─── Surfaces ────────────────────────────────────────────────────────
        // Hierarquia de profundidade visual — sem borders duras entre seções.
        // A diferença de background cria a separação.
        'surface':           '#f5f7f2',  // canvas base da página
        'surface-low':       '#eff2ec',  // inputs e áreas de formulário
        'surface-container': '#e6e9e4',  // seções agrupadas
        'surface-high':      '#e0e4de',  // hover states de seções
        'surface-highest':   '#daded8',  // separadores visuais
        'surface-white':     '#ffffff',  // cards e elementos flutuantes
        'surface-dim':       '#d1d6cf',  // backgrounds desativados

        // ─── Brand Shogun ─────────────────────────────────────────────────────
        'brand-green':       '#A2D729',  // item ativo, destaque principal
        'brand-dark':        '#1B4332',  // sidebar, fundos estruturais
        'brand-primary':     '#486400',  // botões primários
        'brand-primary-dim': '#3e5700',  // gradient end nos botões

        // ─── Texto ────────────────────────────────────────────────────────────
        'text-main':      '#2c2f2c',  // texto principal
        'text-secondary': '#595c59',  // texto de apoio, labels
        'text-disabled':  '#9b9e99',  // placeholders, estados desativados

        // ─── Semântico ────────────────────────────────────────────────────────
        // Vermelho reservado EXCLUSIVAMENTE para alertas críticos.
        // Despesas usam laranja para não confundir com erro.
        'success':    '#3c6351',
        'success-bg': '#c1ecd4',
        'warning':    '#b45309',
        'warning-bg': '#fef3c7',
        'danger':     '#b02500',
        'danger-bg':  '#fee2e2',
        'info':       '#1d4ed8',
        'info-bg':    '#dbeafe',

        // ─── Bordas ───────────────────────────────────────────────────────────
        'outline':        '#757874',
        'outline-subtle': 'rgba(171,174,169,0.3)',
      },

      fontFamily: {
        headline: ['"Plus Jakarta Sans"', 'sans-serif'],
        body:     ['Inter', 'sans-serif'],
      },

      boxShadow: {
        // Card elevation — sombra suave baseada no verde escuro da marca
        'card': '0 12px 32px -4px rgba(27,67,50,0.06)',
        // TopBar separator
        'topbar': '0 1px 0 0 rgba(27,67,50,0.06)',
      },

      borderRadius: {
        // Garantia que os tokens de radius estão disponíveis como utilitários
        '2xl': '1rem',
        'xl':  '0.75rem',
      },

      keyframes: {
        // Toast slide-in da direita
        'slide-in-right': {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to:   { transform: 'translateX(0)',    opacity: '1' },
        },
        // Barra de progresso do toast
        'shrink': {
          from: { width: '100%' },
          to:   { width: '0%' },
        },
        // Pulsação do Live Pulse indicator
        'live-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.5', transform: 'scale(1.4)' },
        },
      },

      animation: {
        'slide-in-right': 'slide-in-right 0.25s ease-out',
        'shrink':         'shrink 4s linear forwards',
        'live-pulse':     'live-pulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
