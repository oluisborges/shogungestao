# Shogun Gestão

Sistema SaaS de gestão para donos de delivery de comidas congeladas.

## Stack

- **React 18** + **Vite** + **TypeScript**
- **Tailwind CSS** com design tokens customizados
- **React Router DOM v6** para roteamento client-side
- **Recharts** para gráficos
- **Lucide React** para ícones
- **date-fns** para formatação de datas

## Rodando o projeto

```bash
npm install
npm run dev
```

O projeto abre em `http://localhost:5173`.

## Estrutura de pastas

```
src/
├── data/mock.ts          # ÚNICA fonte de dados mockados
├── types/                # Interfaces e types TypeScript compartilhados
├── utils/                # Funções puras (moeda, data, CMV)
├── hooks/                # Hooks customizados (toast, paginação, CMV)
├── components/
│   ├── layout/           # Sidebar, TopBar, Layout wrapper
│   └── ui/               # Componentes base reutilizáveis
└── pages/                # Uma página por rota
```

## Padrões do projeto

Ver [CLAUDE.md](./CLAUDE.md) para regras completas de contribuição.

## Credenciais de acesso (mock)

Qualquer e-mail e senha são aceitos na tela de login (sem validação real).
