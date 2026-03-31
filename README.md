# CineDash

Dashboard de curadoria de filmes para o **Desafio React Frontend** (consumo da API pública [TMDB](https://developer.themoviedb.org/docs)).

## Início rápido

- **Node.js:** `22.16.x` (recomendado; veja [INSTRUCTIONS.md](./INSTRUCTIONS.md) para detalhes).
- Instalação, variáveis de ambiente e scripts: **[INSTRUCTIONS.md](./INSTRUCTIONS.md)**.
- Decisões técnicas e organização do código: **[ARCHITECTURE.md](./ARCHITECTURE.md)**.

## Stack principal

React (Vite), TypeScript strict, TanStack Router, TanStack Query, Zustand, shadcn/ui, Tailwind CSS, Vitest, React Hook Form + Zod (conforme o desafio).

## Escopo de telas

- `Home (/)`: listas curadas **Trending** e **Popular** com paginação própria, alternância de lista ativa e modo de **Pesquisa contextual** / **Filtros avançados**.
- `Discovery (/discovery)`: descoberta de catálogo geral com busca contextual, filtros e paginação.

## Documentação do desafio

O enunciado geral e as opções do desafio estão em [docs/README.md](./docs/README.md). Este repositório implementa a **opção CineDash (filmes)**.
