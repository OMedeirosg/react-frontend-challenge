# 🎬 CineDash - Frontend Challenge

Bem-vindo ao desafio técnico para a vaga de **Desenvolvedor React Pleno**.

O objetivo deste desafio é avaliar suas habilidades em arquitetura frontend, consumo de APIs complexas, gerenciamento de estado e boas práticas de UX/UI. Não buscamos apenas "código que funciona", mas sim **código que escala**.

## 🧠 O Desafio

Você deve construir o **CineDash**, um dashboard de curadoria e descoberta de filmes utilizando a [API do TMDB](https://developer.themoviedb.org/docs/getting-started).
Imagine que este é um produto interno usado por curadores de cinema para selecionar quais filmes entrarão no catálogo de um streaming.

### 🎯 Funcionalidades Obrigatórias (Core)

1.  **Autenticação (Simulada):**
    Como não temos backend, a autenticação deve ser tratada no front-end:
    - Tela de Login com validação via **Zod** (Email válido e senha > 6 caracteres).
    - Ao "logar", gerar um token fictício e persistir no `localStorage` ou `cookie`.
    - Apenas usuários autenticados podem acessar a busca e a estante.
    - **Diferencial:** Persistir a sessão do usuário ao recarregar a página.
2.  **Dashboard de Descoberta:**
    - Listagem de filmes (Trending/Popular) com paginação ou infinite scroll.
    - **Requisito Técnico:** Implementar **Debounce** no input para não floodar a API.
    - **Paginação:** Implementar paginação (botões ou infinite scroll).
    - **Filtros Avançados:** Filtrar por Gênero, Ano de Lançamento e Nota Mínima (Rating).
3.  **Minha Lista (Watchlist):**
    - Adicionar/Remover filmes de uma lista de favoritos.
    - Esta lista deve persistir mesmo após o reload da página.
    - Colunas: Título, Gênero, Data de Lançamento, Rating e **Ações**.
    - **Ordenação:** Permitir ordenar a tabela por Título, Gênero ou Rating.
    - **Persistência:** Os dados do dashboard devem sobreviver ao _refresh_ da página (uso de `persist` middleware do Zustand).
4.  **Detalhes do Filme:**
    - Rota dinâmica (`/movie/:id`) exibindo sinopse, elenco, nota e trailer (se houver).
    - Botão para adicionar/remover do dashboard.

## 🛠 Tech Stack Obrigatória

- **Core:** React 18+, TypeScript (Strict), Vite.
- **Server State & Cache:** TanStack Query.
- **Client State:** Zustand.
- **Routing:** TanStack Router (Preferencial) ou React Router v6 (com Data Loaders).
- **UI Components:** Shadcn/ui + TailwindCSS.
- **Formulários:** React Hook Form ou TanStack Form + Zod (validação).
- **Testes:** Vitest + React Testing Library.

> **Diferencial:** Implementação de `TanStack Table` para listagens complexas.

## 🏗 Requisitos de Arquitetura

Esperamos ver uma estrutura de projeto que suporte crescimento.

- **Feature-Sliced Design (FSD)** ou **Clean Architecture** adaptada ao Frontend.
- Isolamento de regras de negócio (hooks customizados vs componentes de UI).
- **Git Flow:** Utilize commits semânticos e organize seu trabalho em branches/PRs.

## 🎨 UI/UX

- Layout responsivo e fluido.
- Feedback visual para o usuário (Loadings, Skeletons, Toasts de erro/sucesso).
- Tema Dark/Light (persistido via Zustand).

## 🏗 Critérios de Avaliação

Avaliaremos seu teste com base nos seguintes pilares:

1.  **Arquitetura e Clean Code:**
    - Separação clara de responsabilidades (API Services, Hooks, Components, Utils).
    - Estrutura de pastas organizada (sugerimos _Feature-Sliced Design_ ou modular).

2.  **Qualidade de UI/UX:**
    - Tratamento de estados de Loading (Skeletons) e Error (Empty States).
    - Design responsivo, fluido e minimalista.
    - Tema Dark/Light (persistido via Zustand).

3.  **Domínio da Stack:**
    - Uso correto de chaves de cache e invalidação no TanStack Query.
    - Componentização eficiente (evitar prop drilling excessivo).
    - Testes unitários cobrindo regras de negócio (ex: validação do form, lógica do dashboard).

4.  **Git e Processo:**
    - Uso de GitFlow (branches `feature/`, `fix/`).
    - Commits semânticos.

## 🚀 Como entregar

1.  Faça um **fork** deste repositório para a sua própria conta do GitHub.
2.  Desenvolva sua solução em uma branch separada (ex: `feature/cinedash-impl`).
3.  Quando finalizar, abra um **Pull Request** para a branch `main` do **seu** repositório forkado.
4.  Crie um arquivo `ARCHITECTURE.md` explicando suas decisões técnicas.
    - A estrutura de pastas escolhida.
    - Como gerenciou a autenticação sem backend.
    - Desafios encontrados com a API do Google.
5.  Crie um arquivo `INSTRUCTIONS.md` explicando o projeto escolhido e como rodar seu projeto.
6.  No corpo do PR, inclua uma breve descrição do que foi feito.
7.  Envie o link do seu Pull Request (ou do repositório) para o recrutador responsável.

## 🔗 Recursos Úteis

- [Documentação TMDB](https://developer.themoviedb.org/docs)
- [TanStack Docs](https://tanstack.com/)
- [Feature-Sliced Design](https://feature-sliced.design/)

Boa sorte! Estamos ansiosos para ver sua solução. 🚀
