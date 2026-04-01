import type { DiscoveryListParams } from './discovery-list-params'
import type { MovieListItem, PaginatedMoviesResponse } from '../types'

/** Resultados por página na API TMDB search/movie (documentação ~20). */
export const TMDB_SEARCH_PAGE_SIZE = 20

/**
 * Limite de páginas da API a varrer ao agregar resultados filtrados (evita loops longos).
 * `page` na URL da rota Discovery é a **página da UI** após agregação (fatias de `pageSize`).
 */
export const MAX_AGGREGATED_API_PAGES = 20

export function movieMatchesDiscoveryFilters(
  movie: MovieListItem,
  filters: Pick<DiscoveryListParams, 'genreId' | 'year' | 'minVote'>,
): boolean {
  if (filters.genreId != null && !movie.genre_ids.includes(filters.genreId)) {
    return false
  }
  if (
    filters.year != null &&
    Number(movie.release_date?.slice(0, 4) || 0) !== filters.year
  ) {
    return false
  }
  if (
    filters.minVote != null &&
    movie.vote_average < filters.minVote
  ) {
    return false
  }
  return true
}

/**
 * Acumula resultados únicos por `id` (evita duplicatas se a API repetir itens entre páginas).
 */
export function appendUniqueMatch(
  seen: Set<number>,
  matches: MovieListItem[],
  movie: MovieListItem,
): void {
  if (seen.has(movie.id)) return
  seen.add(movie.id)
  matches.push(movie)
}

export type AggregatedSearchListPayload = {
  readonly matches: readonly MovieListItem[]
}

/**
 * Converte a lista agregada em resposta paginada para a UI.
 * `page` na URL = página da tabela após filtro (cada página tem até `pageSize` itens).
 */
export function sliceAggregatedToPaginatedResponse(
  payload: AggregatedSearchListPayload,
  uiPage: number,
  pageSize: number,
): PaginatedMoviesResponse {
  const total_results = payload.matches.length
  const total_pages = Math.max(1, Math.ceil(total_results / pageSize))
  const start = (uiPage - 1) * pageSize
  const results = payload.matches.slice(start, start + pageSize)
  return {
    page: uiPage,
    results,
    total_pages,
    total_results,
  }
}
