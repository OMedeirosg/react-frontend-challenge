/**
 * Contratos TMDB (Zod): ponto único de extensão para campos de API.
 * Sub-módulos: `tmdb-requests`, `tmdb-movie-list`, `tmdb-movie-detail`, `tmdb-pagination`, `tmdb-parse`.
 * Regras de negócio (filtros, agregação) ficam em `features/movies/model`, não aqui.
 */

export * from './tmdb-language'
export * from './tmdb-pagination'
export * from './tmdb-requests'
export * from './tmdb-movie-list'
export * from './tmdb-movie-detail'
export * from './tmdb-parse'
