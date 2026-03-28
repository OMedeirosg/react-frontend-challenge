<<<<<<< HEAD
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
=======
# ⚛️ Desafio React Frontend

Bem-vindo ao repositório de avaliação técnica para a vaga de **Desenvolvedor React Pleno**.

Este não é apenas um teste de codificação; é uma oportunidade para você demonstrar como estrutura aplicações escaláveis, toma decisões arquiteturais e prioriza a experiência do usuário.

Estamos buscando profissionais que entendam que "fazer funcionar" é apenas o primeiro passo. O nosso foco está também em: **Manutenibilidade, Performance e Boas Práticas.**

---

## 🎯 O Objetivo

O desafio consiste em desenvolver uma aplicação Front-end que consuma uma API pública, focando na criação de interfaces ricas (Dashboards, Tabelas, Filtros) e na gestão eficiente de estado e dados assíncronos.

### 📂 Escolha sua Missão

Você tem a liberdade de escolher **um** dos dois desafios abaixo para implementar. Ambos possuem o mesmo peso e complexidade técnica. Escolha aquele com o qual você se sentir mais criativo:

- **[Opção A: CineDash (Filmes)](./cases/01-cinedash.md)** – Crie um dashboard analítico para curadoria de cinema.
- **[Opção B: Libris (Livros)](./cases/02-libris.md)** – Desenvolva um gerenciador de biblioteca pessoal e estante virtual.

---

## 🛠 Tech Stack Obrigatória

Para alinhar com a nossa stack atual e garantir uma avaliação justa, exigimos o uso das seguintes tecnologias. **Por favor, não utilize alternativas (ex: Redux ou Context API para estado global complexo) a menos que justificável no seu README.**

- **Core:** React 18+, TypeScript (Strict), Vite.
- **Server State & Cache:** TanStack Query.
- **Client State:** Zustand.
- **Routing:** TanStack Router (Preferencial) ou React Router v6 (com Data Loaders).
- **UI Components:** Shadcn/ui + TailwindCSS.
- **Formulários:** React Hook Form ou TanStack Form + Zod (validação).
- **Testes:** Vitest + React Testing Library.

> **Diferencial:** Implementação de `TanStack Table` para listagens complexas.

---

## 🧠 Critérios de Avaliação (O que olhamos)

Seu código será revisado como se fosse um Pull Request real para a nossa codebase de produção.

### 1. Arquitetura e Organização

- Uso de **Feature-Sliced Design (FSD)**, Clean Architecture ou uma estrutura modular sólida.
- Separação clara entre UI (Componentes), Lógica (Hooks) e Dados (Services/Adapters).
- Código limpo, legível e seguindo princípios SOLID.

### 2. Qualidade Técnica

- Domínio do **TypeScript** (evitar `any`, tipagem correta de generics e props).
- Uso correto do **TanStack Query** (cache keys, invalidation, prefetching).
- Tratamento de erros e estados de loading (Skeletons, Error Boundaries).
- Performance (memorização onde necessário, debouncing em buscas).

### 3. Testes e Confiabilidade

- Não buscamos 100% de cobertura, mas sim **testes significativos**.
- Testes unitários em hooks complexos e utilitários.
- Testes de integração nos fluxos principais (ex: Adicionar item à lista, filtrar tabela).

### 4. Documentação e Git

- Histórico de commits organizado.
- Arquivo `INSTRUCTIONS.md` com instruções claras de como rodar o projeto e qual projeto foi escolhido.
- Arquivo `ARCHITECTURE.md` explicando suas decisões técnicas (Por que usou X? Como resolveu Y?).

---

## 🚀 Como entregar

1.  Faça um **fork** deste repositório para a sua própria conta do GitHub.
2.  Desenvolva sua solução em uma branch separada (ex: `feature/cinedash-impl` ou `feature/libris-impl`).
3.  Quando finalizar, abra um **Pull Request** da sua branch de desenvolvimento para a branch `main` do **seu** repositório forkado. **Atenção: Não abra o PR para o repositório original da empresa.**
4.  No corpo do PR, utilize o template fornecido e inclua uma breve descrição do que foi feito, além do projeto escolhido.
5.  Envie o link do seu Pull Request (ou do repositório) para o recrutador responsável.

---

## ⏳ Prazo e Escopo

Sabemos que este é um desafio complexo.

- **Prazo para entrega:** Você terá o prazo de 7 dias corridos para realização do desafio.
- **Faltou tempo?** Se não conseguir entregar tudo, **priorize a qualidade sobre a quantidade**. É melhor entregar uma funcionalidade perfeitamente arquitetada e testada do que três funcionalidades quebradas. Documente o que faltou no seu README.

**Boa sorte! Estamos ansiosos para ver seu código.** 🚀
>>>>>>> origin/main
