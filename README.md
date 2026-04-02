# CineDash

Dashboard de curadoria de filmes para o **Desafio React Frontend** (consumo da API pública [TMDB](https://developer.themoviedb.org/docs)).

## Deploy

- **Produção (Vercel):** [react-frontend-challenge-blond.vercel.app](https://react-frontend-challenge-blond.vercel.app/)

## Início rápido

### O que precisa de instalar (uma vez na máquina)

| Ferramenta | Para quê |
| ---------- | --------- |
| **[Git](https://git-scm.com/)** | Clonar o repositório. |
| **[Node.js](https://nodejs.org/)** **>= 22.16.0** | Executar o projeto (`package.json` → `engines.node`; recomenda-se **22.16.x**). O **npm** vem incluído — não precisa de instalar Vite, React ou dependências à mão. |

Conta gratuita em [themoviedb.org](https://www.themoviedb.org/) para obter o **API Read Access Token** usado no `.env` (ver abaixo).

### Passo a passo até o projeto correr

1. **Clonar** o repositório e entrar na pasta:
   ```bash
   git clone <url-do-repositorio>
   cd CineDash
   ```
2. **Instalar dependências** (lê o `package.json` e instala tudo o que falta na pasta `node_modules/`):
   ```bash
   npm install
   ```
3. **Criar o ficheiro `.env`** na **raiz** do projeto a partir do exemplo:
   - Git Bash / macOS / Linux: `cp .env.example .env`
   - Windows PowerShell: `Copy-Item .env.example .env`
4. **Editar `.env`**: substitua **`VITE_TMDB_CREDENTIAL_HEADER`** pelo **API Read Access Token** real da TMDB ([Settings → API](https://www.themoviedb.org/settings/api)). O placeholder `your_jwt_here` em [`.env.example`](./.env.example) não chega para chamadas à API. **Não** commite segredos.
5. **Arrancar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
6. Abrir no browser o URL indicado no terminal (por defeito **`http://localhost:5173`**). Depois de criar conta na app, faça login para aceder às rotas principais.

**Opcional:** `VITE_TMDB_BASE_URL` — se não definir, a app usa `https://api.themoviedb.org/3` (ver [ARCHITECTURE.md](./ARCHITECTURE.md)).

### Comandos npm (resumo)

| Comando | Efeito |
| -------- | ------ |
| `npm run dev` | Servidor de desenvolvimento (Vite) |
| `npm run build` | Typecheck + build de produção |
| `npm run preview` | Preview do build |
| `npm run test` | Vitest |
| `npm run lint` / `npm run lint:fix` | ESLint |
| `npm run format` / `npm run format:check` | Prettier |

Detalhes (portas, troubleshooting, scripts completos): **[INSTRUCTIONS.md](./INSTRUCTIONS.md)**.

## Rotas implementadas

| Path | Propósito |
| ---- | --------- |
| `/` | Home: listas **Trending** e **Popular**, pesquisa contextual e filtros na lista ativa (requer sessão). |
| `/discovery` | Descoberta do catálogo com busca, filtros e paginação (requer sessão). |
| `/movie/$id` | Detalhe do filme: sinopse, elenco, trailer quando existir, ação na watchlist (requer sessão). |
| `/watchlist` | Minha lista: tabela com ordenação e persistência local (requer sessão). |
| `/login` | Login (auth simulada); redireciona para `/` se já autenticado. |
| `/register` | Registo (auth simulada); redireciona para `/` se já autenticado. |

Rotas com dados TMDB e navegação principal exigem **token de sessão simulada**; ver [ARCHITECTURE.md](./ARCHITECTURE.md).

## Stack principal

React (Vite), TypeScript strict, TanStack Router, TanStack Query, Zustand, shadcn/ui, Tailwind CSS, Vitest, React Hook Form + Zod.

## Documentação

| Documento | Conteúdo |
| --------- | --------- |
| [INSTRUCTIONS.md](./INSTRUCTIONS.md) | Como rodar, projeto escolhido, pré-requisitos, variáveis, troubleshooting |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Decisões técnicas, rotas, TMDB, testes |
| [docs/README.md](./docs/README.md) | Enunciado oficial do desafio (opções e requisitos) |

Este repositório implementa a **Opção A — CineDash (filmes)**.
