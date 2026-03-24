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
