# Arquitetura — CineDash

## Visão geral

CineDash é um SPA em **React + TypeScript + Vite** que consome a **API REST da TMDB** pelo browser. Não há backend próprio no escopo do desafio: autenticação real fica de fora; o desafio prevê **auth simulada** (validação com Zod + token fictício em `localStorage` ou cookie) e rotas protegidas no front.

## Por que essa stack?

| Tecnologia                | Motivo                                                                                                   |
| ------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Vite**                  | Dev server rápido, build enxuta, alinhada ao desafio.                                                    |
| **TanStack Router**       | Rotas tipadas, layouts e rota dinâmica (`/movie/:id`), file-based routes com plugin.                     |
| **TanStack Query**        | Cache, loading/erro e invalidação para dados da TMDB; evita estado duplicado de servidor.                |
| **Zustand**               | Estado de cliente (tema, sessão simulada, watchlist persistida com `persist`) sem boilerplate excessivo. |
| **shadcn/ui + Tailwind**  | UI acessível e consistente com o desafio; componentes no repositório (não uma lib opaca).                |
| **React Hook Form + Zod** | Formulários e validação (login simulado, filtros onde couber).                                           |
| **Vitest + RTL**          | Testes unitários/integração alinhados ao ecossistema Vite.                                               |

## API TMDB

- Documentação: [The Movie Database API](https://developer.themoviedb.org/docs).
- A chave vai em variável de ambiente **`VITE_TMDB_API_KEY`** (veja [INSTRUCTIONS.md](./INSTRUCTIONS.md)).
- O cliente HTTP pode ficar em uma camada **`services`** ou **`api`**: funções puras + Query nos hooks ou em loaders, mantendo **UI separada de fetch**.

## Organização de pastas (direção FSD / camadas)

Objetivo: separar **UI**, **lógica (hooks)** e **dados (serviços/adapters)**.

- **`src/routes` + `routeTree.gen`** — Rotas TanStack Router (file-based).
- **`src/layouts`** — Shell da aplicação (navegação, outlet).
- **`src/providers`** — Providers globais (ex.: React Query).
- **`src/components/ui`** — Componentes shadcn e primitivos reutilizáveis.
- **`src/shared`** — Utilitários (`lib/utils`), tipos e helpers usados em vários módulos (evoluir conforme o projeto cresce).
- **`src/features/*`** — Fatias por caso de uso (discovery, filme, watchlist, auth): pastas com `ui`, `model`, `api` ou `hooks` conforme necessidade.

Essa árvore pode ser estendida com **`entities`** (modelos de domínio / mapeamento TMDB → app) quando fizer sentido, sem misturar regra de negócio em componentes de página.

## Formatação e lint

- **Prettier** (`prettier.config.js`, plugin Tailwind para ordenar classes).
- **ESLint** flat config + **eslint-config-prettier** para não conflitar com o Prettier.

## O que documentar conforme evoluir

Integração concreta com TMDB (endpoints, tratamento de rate limit, imagens base URL), estratégia de **cache keys** do Query, e fluxo da **watchlist** + tema escuro/claro persistido devem ser refletidos aqui à medida que forem implementados.
