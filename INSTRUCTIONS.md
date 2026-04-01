# Como rodar o CineDash

## Projeto escolhido

**Opção A — CineDash (Filmes)** do Desafio React Frontend: aplicação que consome a API **[TMDB](https://developer.themoviedb.org/docs)** (The Movie Database) para descoberta de filmes, detalhes e lista pessoal (watchlist). Não utiliza outras APIs do desafio (por exemplo Google Books).

## O que instalar na máquina (antes de clonar)

| O quê          | Detalhe                                                                                                                                                                                                                                                                                                                             |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Git**        | Para clonar o repositório. [Download](https://git-scm.com/downloads); em Linux/macOS costuma estar disponível ou via gestor de pacotes.                                                                                                                                                                                             |
| **Node.js**    | Versão **`>=22.16.0`** (ver **`package.json`** → `engines.node`). Instale a partir de [nodejs.org](https://nodejs.org/) ou use [nvm](https://github.com/nvm-sh/nvm) / [fnm](https://github.com/Schniz/fnm) / [nvm-windows](https://github.com/coreybutler/nvm-windows). Recomenda-se **22.16.x**. Não há ficheiro `.nvmrc` na raiz. |
| **npm**        | Incluído com o Node (ex.: npm 10+). É o comando usado para instalar dependências e correr scripts.                                                                                                                                                                                                                                  |
| **Conta TMDB** | Registo gratuito em [themoviedb.org](https://www.themoviedb.org/) para gerar o **API Read Access Token** usado em `VITE_TMDB_CREDENTIAL_HEADER`.                                                                                                                                                                                    |

### Confirmar versões no terminal

```bash
node -v   # deve satisfazer >=22.16.0 (ex.: v22.16.x)
npm -v
git --version
```

## Passo a passo: do zero ao `npm run dev`

1. **Clonar** o repositório e entrar na pasta do projeto:
   ```bash
   git clone <url-do-seu-repositorio>
   cd CineDash
   ```
2. **Instalar dependências** (obrigatório na primeira vez e após alterações ao `package.json`):
   ```bash
   npm install
   ```
3. **Configurar variáveis de ambiente** — na raiz do projeto, copiar `.env.example` para `.env`:
   - Git Bash / macOS / Linux: `cp .env.example .env`
   - Windows PowerShell: `Copy-Item .env.example .env`
4. **Editar `.env`**: preencher `VITE_TMDB_CREDENTIAL_HEADER` com o token real da TMDB (ver secção seguinte). Sem isso, a API TMDB não responde em desenvolvimento.
5. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
6. Abrir no browser o endereço mostrado no terminal (por defeito **`http://localhost:5173`**).
7. Na aplicação, **registe uma conta** (auth simulada) ou faça **login** para aceder a `/`, `/discovery`, `/watchlist` e `/movie/:id` (rotas protegidas).

Sempre que alterar o ficheiro `.env`, **pare e volte a iniciar** `npm run dev` para o Vite carregar os novos valores.

## Variáveis de ambiente

O **API Read Access Token** da TMDB **não** deve ser commitado. Use apenas variáveis com prefixo `VITE_` para expor valores ao client (Vite).

1. Na **raiz do projeto**, copie o exemplo:

   ```bash
   cp .env.example .env
   ```

   No Windows (PowerShell): `Copy-Item .env.example .env`

2. Edite `.env` e preencha:
   - **`VITE_TMDB_CREDENTIAL_HEADER`** — JWT indicado em [TMDB Settings → API](https://www.themoviedb.org/settings/api) como **API Read Access Token** (use só o token; no código o header é `Authorization: Bearer <token>`).
   - **`VITE_TMDB_BASE_URL`** (opcional) — se omitida, o app usa `https://api.themoviedb.org/3`. Ver comentários em [`.env.example`](./.env.example).

Os placeholders em `.env.example` (ex.: `your_jwt_here`) são fictícios; substitua pelo token real para chamadas TMDB em desenvolvimento.

Sem o token, as chamadas à TMDB não funcionarão em desenvolvimento.

## Scripts

| Comando                | Descrição                                                                |
| ---------------------- | ------------------------------------------------------------------------ |
| `npm run dev`          | Servidor de desenvolvimento (Vite). URL padrão: `http://localhost:5173`. |
| `npm run build`        | Typecheck (`tsc -b`) + build de produção.                                |
| `npm run preview`      | Preview local do build de produção.                                      |
| `npm run test`         | Vitest (testes).                                                         |
| `npm run lint`         | ESLint.                                                                  |
| `npm run lint:fix`     | ESLint com correções automáticas.                                        |
| `npm run format`       | Prettier (escreve nos ficheiros).                                        |
| `npm run format:check` | Prettier em modo verificação (CI).                                       |

## Problemas comuns

- **Porta 5173 em uso:** o Vite sugere outra porta no terminal ou use `npm run dev -- --port <porta>`.
- **Erros 401/403 na TMDB:** confira se `VITE_TMDB_CREDENTIAL_HEADER` está correto no `.env` e se reiniciou o `npm run dev` após alterar o ficheiro.
- **Node incompatível:** instale uma versão **>=22.16.0** (por exemplo **22.16.x** com [nvm](https://github.com/nvm-sh/nvm) ou [fnm](https://github.com/Schniz/fnm)) e rode `npm install` de novo.

## Mais detalhes

Decisões de arquitetura e pastas: [ARCHITECTURE.md](./ARCHITECTURE.md).
