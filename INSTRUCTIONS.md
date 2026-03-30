# Como rodar o CineDash

## Projeto escolhido

**Opção A — CineDash (Filmes)** do Desafio React Frontend: aplicação que consome a API [TMDB](https://developer.themoviedb.org/docs) para descoberta de filmes, detalhes e lista pessoal (watchlist), conforme o escopo do desafio.

## Pré-requisitos

| Ferramenta  | Versão                                                                                                         |
| ----------- | -------------------------------------------------------------------------------------------------------------- |
| **Node.js** | **22.16.x** (recomendado). Versões `>=22.16.0` costumam funcionar; em caso de divergência, alinhe com `22.16`. |
| **npm**     | Incluído com o Node (ex.: npm 10+).                                                                            |

Confirme no terminal:

```bash
node -v   # deve exibir v22.16.x (ou compatível)
npm -v
```

## Clonar e instalar

```bash
git clone <url-do-seu-repositorio>
cd CineDash
npm install
```

## Variáveis de ambiente

A chave da API TMDB **não** deve ser commitada. Use apenas variáveis com prefixo `VITE_` para expor valores ao client (Vite).

1. Copie o exemplo:

   ```bash
   cp .env.example .env
   ```

   No Windows (PowerShell): `Copy-Item .env.example .env`

2. Edite `.env` e preencha:
   - `VITE_TMDB_API_KEY` — crie uma chave em [TMDB Settings → API](https://www.themoviedb.org/settings/api).

Sem a chave, as chamadas à TMDB não funcionarão em desenvolvimento.

## Scripts

| Comando                | Descrição                                                                |
| ---------------------- | ------------------------------------------------------------------------ |
| `npm run dev`          | Servidor de desenvolvimento (Vite). URL padrão: `http://localhost:5173`. |
| `npm run build`        | Typecheck (`tsc -b`) + build de produção.                                |
| `npm run preview`      | Preview local do build de produção.                                      |
| `npm run test`         | Vitest (testes).                                                         |
| `npm run lint`         | ESLint.                                                                  |
| `npm run lint:fix`     | ESLint com correções automáticas.                                        |
| `npm run format`       | Prettier (escreve nos arquivos).                                         |
| `npm run format:check` | Prettier em modo verificação (CI).                                       |

## Problemas comuns

- **Porta 5173 em uso:** o Vite sugere outra porta no terminal ou use `npm run dev -- --port <porta>`.
- **Erros 401/403 na TMDB:** confira se `VITE_TMDB_API_KEY` está correto no `.env` e se reiniciou o `npm run dev` após alterar o arquivo.
- **Node incompatível:** instale a versão **22.16.x** (por exemplo com [nvm](https://github.com/nvm-sh/nvm) ou [fnm](https://github.com/Schniz/fnm)) e rode `npm install` de novo.

## Mais detalhes

Decisões de arquitetura e pastas: [ARCHITECTURE.md](./ARCHITECTURE.md).
