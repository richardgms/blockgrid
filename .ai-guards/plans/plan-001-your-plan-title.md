---
id: plan-001
title: UX / UI Enhancement Plan – Block Grid
createdAt: 2025-07-03
author: Richard
status: draft
---

## 🧩 Scope

Melhorar a experiência visual e de usabilidade do Block Grid, cobrindo layout, tipografia, cores, acessibilidade (WCAG AA) e micro-interações. O foco é refinar a interface existente sem alterar a mecânica de jogo.

## ✅ Functional Requirements

- Layout responsivo mobile-first com grade de 8 × 8 sempre visível
- Feedback visual claro para drag-and-drop (hover, preview, drop)
- Animações suaves ≤ 200 ms (entrada, limpeza, combo)
- Paleta de cores acessível (contraste ≥ 4.5:1 texto/ fundo)
- Modo claro/escuro automático via prefers-color-scheme
- Componentização consistente (Button, Modal, Piece, BoardCell)

## ⚙️ Non-Functional Requirements

- Performance: LCP < 2 s, CLS < 0.1
- Accessibility: WCAG AA, navegação por teclado completa
- Internacionalização pronta (i18n-ready)
- Consistência visual entre navegadores (Chrome, Firefox, Safari)

## 📚 Guidelines & Packages

- Design System: seguir Atomic Design; usar Tailwind CSS tokens
- Pacotes: 
  - tailwindcss-animate (MIT) – utilitários de animação
  - framer-motion (MIT) – micro-interações avançadas
  - headless-ui (MIT) – componentes acessíveis
  - @heroicons/react (MIT) – ícones consistentes

## 🔐 Threat Model (Stub)

- Falta de contraste = barreira de acessibilidade
- Animações excessivas = motion sickness para alguns usuários

## 🔢 Execution Plan

1. Auditoria de UI atual (screenshots, notas de contraste, heurísticas de Nielsen)
2. Definir Design Tokens (cores, espaçamentos, fontes) no tailwind.config
3. Refatorar componentes ➜ `src/components/ui/*`
4. Implementar animações com framer-motion + tailwindcss-animate
5. Adicionar modo escuro (classe `dark` atômica)
6. Testar acessibilidade (axe, lighthouse) e resolver issues
7. Revisão cross-browser & perf (Lighthouse, WebPageTest)
8. Documentar no Storybook (futuro)
