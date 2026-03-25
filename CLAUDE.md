# CLAUDE.md — Contrato do Projeto Shogun Gestão

---

## FILOSOFIA — LEIA ANTES DE QUALQUER OUTRA COISA

Este repositório é lido e modificado por humanos e IAs em colaboração contínua.

Isso impõe uma responsabilidade específica: **quem vier depois não tem contexto do que foi feito antes.** O código precisa se explicar sozinho. Clareza, organização e legibilidade não são preferência — são requisito funcional do projeto.

Cada pessoa ou IA que tocar neste repositório é responsável por deixá-lo **melhor** do que encontrou. Nunca pior. Nunca indiferente.

Se você está aqui para fazer uma alteração pequena, faça-a bem. Se você está aqui para construir algo novo, respeite o que já existe. O padrão não é opcional — é o contrato.

---

## O que é este projeto

Frontend de um sistema SaaS de gestão para donos de delivery de comidas congeladas.
Desenvolvido pelo Grupo Shogun. Stack: React + Vite + TypeScript + Tailwind CSS.

## Escopo atual

APENAS frontend. Não há backend implementado. Dados são mockados em `src/data/mock.ts`.
Não implementar, sugerir ou assumir qualquer solução de backend, autenticação real
ou banco de dados sem alinhamento explícito.

## Regras inegociáveis

1. Responsabilidade única por arquivo
2. Dados mockados somente em `src/data/mock.ts` — nunca hardcoded em componentes
3. Nenhum `any` no TypeScript — types e interfaces em `src/types/`
4. Nomenclatura em inglês, descritiva, sem abreviações
5. Comentários explicam o "porquê", não o "o quê"
6. Componentes com mais de ~150 linhas devem ser divididos
7. Props sempre tipadas com interface documentada acima do componente
8. Constantes fixas fora da função do componente
9. Não criar pastas novas sem documentar no README
10. Ao mexer em código existente, deixá-lo melhor do que estava

---

## IDENTIDADE VISUAL — INTOCÁVEL

O design system deste projeto foi aprovado. Não está em discussão.

**Tokens**
- Os tokens de cor, tipografia, border-radius, sombra e espaçamento estão definidos em `tailwind.config.ts` e são definitivos
- Nenhuma cor nova, fonte nova ou token novo deve ser adicionado sem alinhamento explícito com o responsável pelo projeto
- Nenhum valor de cor, fonte, border-radius, sombra ou espaçamento deve ser hardcoded no JSX ou CSS — usar exclusivamente as classes e tokens já definidos

**Superfícies**
- A hierarquia `surface` / `surface-low` / `surface-container` / `surface-white` deve ser respeitada em qualquer componente novo
- Não inverter, misturar ou ignorar essa hierarquia para "resolver" um problema visual

**Componentes**
- Antes de criar qualquer componente novo, observar os existentes em `src/components/ui/`
- Novos componentes devem seguir os padrões visuais já estabelecidos — não inventar
- Não introduzir novas bibliotecas de componentes (shadcn, MUI, Ant Design, Radix isolado, etc.) — o sistema é custom e deve permanecer assim

**Tipografia**
- Não alterar fontes, pesos tipográficos ou hierarquia de texto sem aprovação

**Layout global**
- Não modificar o comportamento visual da Sidebar, TopBar ou qualquer elemento de layout global sem alinhamento explícito

**Em caso de dúvida visual**
Não implemente. Documente a dúvida e pergunte ao responsável. Uma decisão postergada é melhor do que uma decisão errada aplicada em todo o sistema.

---

## Ícones

Lucide React exclusivamente. Nunca emojis como ícones estruturais.

## Gráficos

Recharts. Cor de despesas = `#f97316` (laranja). Vermelho reservado para alertas críticos.

---

## Como rodar

```
npm install
npm run dev
```

## Onde encontrar o quê

```
src/data/mock.ts        — todos os dados mockados
src/types/              — interfaces e types compartilhados
src/components/ui/      — componentes base reutilizáveis
src/components/layout/  — Sidebar, TopBar, Layout
src/pages/              — uma página por rota
src/hooks/              — hooks customizados
src/router/index.tsx    — definição de rotas
```
