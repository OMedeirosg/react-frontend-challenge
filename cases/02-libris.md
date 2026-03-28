# 📚 Libris - Frontend Challenge

Bem-vindo ao desafio técnico para a vaga de **Desenvolvedor React Pleno**.

O objetivo deste desafio é construir o **Libris**, um gerenciador de biblioteca pessoal robusto, elegante e performático, utilizando a [Google Books API](https://developers.google.com/books/docs/v1/using).

Queremos avaliar como você estrutura uma aplicação escalável, lida com dados externos inconsistentes e aplica boas práticas de UX.

## 🧠 O Desafio

Você deve criar uma aplicação onde o usuário possa pesquisar livros na base do Google, ver detalhes e adicioná-los à sua "Estante Virtual" gerenciada localmente.

### 🎯 Funcionalidades Obrigatórias (Core)

1.  **Autenticação (Simulada):**
    Como não temos backend, a autenticação deve ser tratada no front-end:
    - Tela de Login com validação via **Zod** (Email válido e senha > 6 caracteres).
    - Ao "logar", gerar um token fictício e persistir no `localStorage` ou `cookie`.
    - Apenas usuários autenticados podem acessar a busca e a estante.
    - **Diferencial:** Persistir a sessão do usuário ao recarregar a página.
2.  **Módulo de Descoberta (Busca):**
    - Input de busca conectado à API do Google Books (`GET https://www.googleapis.com/books/v1/volumes?q=...`).
    - **Requisito Técnico:** Implementar **Debounce** no input para não floodar a API.
    - **Paginação:** Implementar paginação (botões ou infinite scroll) usando o parâmetro `startIndex` da API.
    - **Filtros (TanStack Form):** Permitir filtrar por:
      - Tipo de impressão (`printType`: all, books, magazines).
      - Ordenação (`orderBy`: relevance, newest).
3.  **A Estante:**
    Esta é a área administrativa do usuário. Os livros salvos devem ser exibidos em uma tabela (Data Grid).
    - Colunas: Capa (thumb), Título, Autor, Data de Publicação e **Ações**.
    - **Feature de Status:** O usuário deve poder alterar o status do livro na tabela: _Quero Ler_, _Lendo_, _Concluído_.
    - **Ordenação:** Permitir ordenar a tabela por Título ou Status.
    - **Persistência:** Os dados da estante devem sobreviver ao _refresh_ da página (uso de `persist` middleware do Zustand).
4.  **Detalhes do Livro:**
    - Rota dinâmica `/book/$bookId`.
    - Exibir sinopse completa, informações de editora e link para preview.
    - Botão para adicionar/remover da estante.

---

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
    - Uso do padrão **Adapter/Mapper** para transformar os dados da API (que vêm aninhados e sujos) em interfaces limpas para o frontend.
    - Estrutura de pastas organizada (sugerimos _Feature-Sliced Design_ ou modular).

2.  **Qualidade de UI/UX:**
    - Tratamento de estados de Loading (Skeletons) e Error (Empty States).
    - Como você lida com livros que não possuem capa (thumbnail)? (Não exiba imagem quebrada!).
    - Design responsivo, fluido e minimalista.
    - Tema Dark/Light (persistido via Zustand).

3.  **Domínio da Stack:**
    - Uso correto de chaves de cache e invalidação no TanStack Query.
    - Componentização eficiente (evitar prop drilling excessivo).
    - Testes unitários cobrindo regras de negócio (ex: validação do form, lógica da estante).

4.  **Git e Processo:**
    - Uso de GitFlow (branches `feature/`, `fix/`).
    - Commits semânticos.

## 🚀 Como entregar

1.  Faça um **fork** deste repositório para a sua própria conta do GitHub.
2.  Desenvolva sua solução em uma branch separada (ex: `feature/libris-impl`).
3.  Quando finalizar, abra um **Pull Request** para a branch `main` do **seu** repositório forkado.
4.  Crie um arquivo `ARCHITECTURE.md` explicando:
    - A estrutura de pastas escolhida.
    - Como gerenciou a autenticação sem backend.
    - Desafios encontrados com a API do Google.
5.  Crie um arquivo `INSTRUCTIONS.md` explicando o projeto escolhido e como rodar seu projeto.
6.  No corpo do PR, inclua uma breve descrição do que foi feito.
7.  Envie o link do seu Pull Request (ou do repositório) para o recrutador responsável.

**Dica:** A Google Books API não exige chave para testes simples, mas pode ter rate limits. Se desejar, crie uma chave de API gratuita no Google Cloud Console, mas garanta que o projeto rode sem ela ou forneça instruções no `.env.example`.

Boa sorte! 🚀
