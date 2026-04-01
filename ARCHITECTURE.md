# Arquitetura — CineDash

## Visão geral

CineDash é um SPA em **React + TypeScript + Vite** que consome a **API REST da TMDB** pelo browser. Não há backend próprio no escopo do desafio: a **auth simulada** usa validação com Zod nos formulários, **token fictício** (`fake-token`) e persistência da sessão via **Zustand `persist`** com armazenamento em **cookie** (`src/features/auth/store.ts`). Rotas que exigem utilizador autenticado usam `beforeLoad` no TanStack Router e redirecionam para `/login` quando não há sessão.

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
- Base da API: **`VITE_TMDB_BASE_URL`** (opcional; padrão no código `https://api.themoviedb.org/3`). Autenticação v3 com **API Read Access Token**: header `Authorization: Bearer <token>`. O JWT fica em **`VITE_TMDB_CREDENTIAL_HEADER`** (veja [INSTRUCTIONS.md](./INSTRUCTIONS.md)).
- Cliente HTTP em [`src/lib/api.ts`](./src/lib/api.ts); endpoints de filmes em [`src/features/movies/tmdbMovies.ts`](./src/features/movies/tmdbMovies.ts) e cache TanStack Query com chaves estáveis em `movieKeys` ([`src/features/movies/queries.ts`](./src/features/movies/queries.ts)).
- **Rate limit (HTTP 429):** apenas no cliente (sem BFF). Constantes e parsing de `Retry-After` (segundos ou data HTTP) em [`src/lib/tmdb-rate-limit.ts`](./src/lib/tmdb-rate-limit.ts). O `fetch` da TMDB espera até um teto de tentativas por pedido, respeitando `Retry-After` quando existir e usando *backoff* exponencial com *jitter* quando não existir; atrasos e número de tentativas estão limitados para não amplificar carga. Se continuar 429, lança-se `RateLimitError` (com `retryAfterMs` opcional). O TanStack Query **não** volta a fazer *retry* em `RateLimitError` (evita duplicar esperas já feitas no HTTP). Mensagens ao utilizador para 429 estão em [`movie-query-errors.ts`](./src/features/movies/model/movie-query-errors.ts), sem expor tempos internos.
- **Contratos TMDB (Zod):** schemas e tipos inferidos vivem em [`src/features/movies/contracts/`](./src/features/movies/contracts/): o barrel [`tmdb.contracts.ts`](./src/features/movies/contracts/tmdb.contracts.ts) reexporta sub-módulos (`tmdb-requests`, `tmdb-movie-list`, `tmdb-movie-detail`, `tmdb-pagination`, `tmdb-parse`) para uma **única fonte de verdade** sem duplicar tipos. Os adapters (`tmdb-http.ts`, `tmdb-list-api.ts`, `tmdb-detail-api.ts`) chamam `parseTmdbRequest` / `parseTmdbResponse`; falhas de validação lançam `TmdbContractError`. Tipos de domínio reexportados em [`types.ts`](./src/features/movies/types.ts).
- **Extensão de campos:** alterar ou estender o schema Zod correspondente → tipos inferidos atualizam-se automaticamente → UI consome tipos de `types`/contratos. Regras (filtros locais, agregação de busca, debounce) permanecem em [`model/`](./src/features/movies/model/), não nos schemas de resposta.
- **Erros na UX:** `ApiError` / `RateLimitError` (HTTP, incl. 429 esgotado no cliente) vs `TmdbContractError` (JSON inválido face ao contrato) — mensagens para o utilizador centralizadas em [`movie-query-errors.ts`](./src/features/movies/model/movie-query-errors.ts) (sem stack nem pormenores de Zod).

#### Resumo TMDB: endpoint → schema → consumo

| Rótulo / fluxo | Schema Zod (resposta) | Onde entra na UI |
| ---------------- | ---------------------- | ----------------- |
| `GET /movie/popular` | `paginatedMoviesResponseSchema` | Home curated (Popular), Discovery modo popular |
| `GET /trending/movie/{timeWindow}` | `paginatedMoviesResponseSchema` | Home curated (Trending) |
| `GET /search/movie` | `paginatedMoviesResponseSchema` | Discovery (query); agregação em `queries.ts` + `model/aggregated-discovery-search` |
| `GET /discover/movie` | `paginatedMoviesResponseSchema` | Discovery modo discover |
| `GET /genre/movie/list` | `movieGenresResponseSchema` | Toolbars / mapeamento `genre_ids` → nome |
| `GET /movie/:id` | `movieDetailsResponseSchema` | Rota `/movie/$id` |
| `GET /movie/:id/credits` | `movieCreditsResponseSchema` | Secção elenco em `/movie/$id` |
| `GET /movie/:id/videos` | `movieVideosResponseSchema` | Trailer em `/movie/$id` |
- **Imagens (posters):** a TMDB devolve `poster_path` relativo à CDN. A montagem da URL fica centralizada em [`src/features/movies/lib/tmdb-poster-url.ts`](./src/features/movies/lib/tmdb-poster-url.ts) (`https://image.tmdb.org/t/p/{size}/...`). Na UI: se o helper retornar `null`, usar placeholder sem `<img>`; se existir URL e a imagem falhar ao carregar, tratar com `onError` e o mesmo placeholder (ver comentário no módulo).
- O cliente HTTP pode ficar em uma camada **`services`** ou **`api`**: funções puras + Query nos hooks ou em loaders, mantendo **UI separada de fetch**.

### Endpoints usados no dashboard (Discovery)

- Listas: `/movie/popular`, `/trending/movie/{day|week}`, `/discover/movie`, `/search/movie`
- Gêneros: `/genre/movie/list` (para preencher o select e mapear `genre_ids` → nomes)

### Query keys e camadas

- `movieKeys` em [`src/features/movies/queries.ts`](./src/features/movies/queries.ts) inclui o **modo** e os **parâmetros serializáveis** (page, query debounced e filtros) para garantir cache correto.
- Regra de seleção de endpoint no discovery:
  - se `query` debounced tiver texto: usa `/search/movie` (busca textual)
  - se `query` estiver vazio: usa o fluxo do modo (`popular`, `trending` ou `discover` com filtros)
- **Camada 1 (Imagens)**: helper puro `tmdbPosterUrl`.
- **Camada 2 (Tabela)**: `MoviesDiscoveryTable` renderiza `MovieListItem[]` e exibe gêneros com nomes quando recebe `genres`.
- **Camada 3 (Busca/Filtros)**: `useDiscoveryListParams` controla input + debounce e produz `DiscoveryListParams` estável.
- **Camada 4 (Query/UX)**: `useDiscoveryMovies` e `useMovieGenres` buscam dados e a página trata loading/erro/vazio.

### Rotas e UX de descoberta

- [`src/routes/index.tsx`](./src/routes/index.tsx): dashboard com listas curadas de **Trending** e **Popular**, alternáveis em uma única grade. A home possui modo de **Pesquisa contextual** e modo de **Filtros avançados**, com paginação própria por lista.
- [`src/routes/discovery.tsx`](./src/routes/discovery.tsx): fluxo de **catálogo geral** com busca textual, filtros e paginação para exploração ampla do acervo.
- Na barra de filtros, a UI explicita o contexto atual:
  - `Searching for "..."` quando há texto
  - `Discovering with filters` quando não há query textual

### Escopo funcional por rota

- **Home (`/`)**: visão curada e rápida com recortes de mercado (**Trending** e **Popular**). O objetivo é acompanhamento de listas prontas da TMDB com refinamento local (busca contextual/filtros) dentro da lista ativa.
- **Discovery (`/discovery`)**: visão de descoberta ampla do catálogo. O objetivo é refinamento de consulta com busca contextual + filtros avançados.
- Essa separação evita sobrecarregar uma única tela e deixa explícito que listas curadas e descoberta geral são fluxos complementares, com objetivos diferentes.

### Organização interna da Home curada (FSD)

- **Model (`src/features/movies/model`)**
  - `use-home-curated-state.ts`: estado de UI da home (lista ativa, modo contextual, paginação, filtros, debounce e actions).
  - `use-home-curated-filtered-movies.ts`: regra de filtragem da lista ativa e mensagem de estado vazio.
  - `use-curated-list-error-toasts.ts`: feedback global de erro para Trending/Popular com deduplicação.
- **UI (`src/features/movies/ui`)**
  - `home-curated-toolbar.tsx`: barra reutilizável de modo (pesquisa/filtros), seleção de lista e controles de filtro.
  - `curated-list-section.tsx`: seção da tabela com paginação, loading, erro e empty.
- **Rota (`src/routes/index.tsx`)**
  - apenas composição das camadas (`model` + `ui`) e wiring das queries.

## Organização de pastas (direção FSD / camadas)

Objetivo: separar **UI**, **lógica (hooks)** e **dados (serviços/adapters)**.

- **`src/routes` + [`routeTree.gen.ts`](./src/routeTree.gen.ts)** — Rotas TanStack Router (file-based; o ficheiro `.gen` é gerado pelo plugin e não deve ser editado à mão).
- **`src/layouts`** — Shell da aplicação (navegação, outlet).
- **`src/providers`** — Providers globais (ex.: React Query).
- **`src/components/ui`** — Componentes shadcn e primitivos reutilizáveis.
- **`src/shared`** — Utilitários (`lib/utils`), tipos e helpers usados em vários módulos (evoluir conforme o projeto cresce).
- **`src/features/*`** — Fatias por caso de uso (discovery, filme, watchlist, auth): pastas com `ui`, `model`, `api` ou `hooks` conforme necessidade.

Essa árvore pode ser estendida com **`entities`** (modelos de domínio / mapeamento TMDB → app) quando fizer sentido, sem misturar regra de negócio em componentes de página.

## Formatação e lint

- **Prettier** (`prettier.config.js`, plugin Tailwind para ordenar classes).
- **ESLint** flat config + **eslint-config-prettier** para não conflitar com o Prettier.

## Rotas: público vs protegido

Definição em `src/routes/*.tsx` e árvore em [`routeTree.gen.ts`](./src/routeTree.gen.ts).

| Path | Acesso |
| ---- | ------ |
| `/login`, `/register` | Públicos para quem **não** tem sessão; com token válido, `beforeLoad` redireciona para `/`. |
| `/`, `/discovery`, `/watchlist`, `/movie/$id` | **Protegidos:** `beforeLoad` chama `useAuthStore.persist.rehydrate()` e, sem `token`, redireciona para `/login`. |

O *root* (`__root.tsx`) apenas monta o layout; não aplica auth globalmente — a proteção é por rota.

## Funcionalidades transversais (estado atual)

- **Watchlist:** Zustand + `persist` em [`src/features/movies/model/watchlist-store.ts`](./src/features/movies/model/watchlist-store.ts); adicionar/remover a partir da home, discovery, detalhe e página dedicada; persistência após reload, **escopada por conta** no cliente (`localStorage` por email normalizado).
- **Tema claro/escuro:** Zustand + `persist` em [`src/shared/model/theme-store.ts`](./src/shared/model/theme-store.ts); [`ThemeProvider`](./src/providers/ThemeProvider.tsx) aplica a classe `dark` no `documentElement`; toggle na top bar ([`theme-toggle.tsx`](./src/components/theme-toggle.tsx)).
- **Tabela de filmes (listagens):** **TanStack Table** em [`src/features/movies/ui/use-movies-discovery-table.tsx`](./src/features/movies/ui/use-movies-discovery-table.tsx) e colunas em `movies-discovery-table-columns.tsx` (ordenação, integração com dados TMDB).
- **Erros na UI:** mensagens centralizadas em [`movie-query-errors.ts`](./src/features/movies/model/movie-query-errors.ts); toasts para falhas de listas curadas; estados de loading com skeletons (ex.: detalhe do filme). **Não** há React Error Boundary dedicado no projeto; falhas de render não são isoladas por boundary — o foco é tratamento de erros de rede/contrato e feedback inline (ex.: [`QueryInlineError`](./src/shared/ui/feedback/query-inline-error.tsx)).

## Testes (Vitest + RTL)

- **Configuração:** `vite.config.ts` (Vitest), ambiente `happy-dom` onde aplicável.
- **Auth / rotas:** formulários de login e registo (`src/__tests__/auth/`), *guard* de rotas (`auth-guard.test.tsx`).
- **Filmes / TMDB:** contratos Zod, `tmdbMovies`, poster URL, `movie-query-errors`, tabela (ordenção).
- **Fluxos de UI:** home curada, discovery (feedback, URL), watchlist, detalhe + watchlist, layout/top bar, debounce partilhado.

## O que rever se o projeto evoluir

Rate limits da TMDB, telemetria, Error Boundaries por rota se passar a haver componentes com maior risco de falha de render, e qualquer novo endpoint ou camada BFF.
