import { ApiError, isRateLimitError } from '@/lib/api'

import { TmdbContractError } from '../contracts/tmdb.contracts'

/** Limite de pedidos (429) — sem números de segundos nem pormenores técnicos. */
export const tmdbRateLimitUserMessage =
  'O catálogo está temporariamente indisponível por limite de pedidos. Tente novamente dentro de momentos.' as const

function isTooManyRequests(error: unknown): boolean {
  return (
    isRateLimitError(error) ||
    (error instanceof ApiError && error.status === 429)
  )
}

export function isTmdbContractError(
  error: unknown,
): error is TmdbContractError {
  return error instanceof TmdbContractError
}

/**
 * Chave estável para deduplicar toasts (não inclui stack nem mensagem bruta).
 */
export function movieQueryErrorToastKey(error: unknown): string {
  if (isTooManyRequests(error)) return 'api-429'
  if (error instanceof ApiError) return `api-${error.status}`
  if (isTmdbContractError(error)) return `contract-${error.phase}`
  return 'unknown'
}

export type CuratedListMode = 'trending' | 'popular'

export function curatedListInlineErrorMessage(
  error: unknown,
  activeList: CuratedListMode,
): string {
  const label = activeList === 'trending' ? 'Trending' : 'Popular'
  if (isTooManyRequests(error)) {
    return tmdbRateLimitUserMessage
  }
  if (error instanceof ApiError) {
    return `Erro ${error.status}: falha ao buscar ${label}.`
  }
  if (isTmdbContractError(error)) {
    return `Os dados de ${label} chegaram em formato inesperado. Tente atualizar a página.`
  }
  return `Não foi possível carregar ${label}.`
}

export function discoveryListInlineErrorMessage(error: unknown): string {
  if (isTooManyRequests(error)) {
    return tmdbRateLimitUserMessage
  }
  if (error instanceof ApiError) {
    return `Erro ${error.status}: falha ao buscar filmes.`
  }
  if (isTmdbContractError(error)) {
    return 'Os dados da lista chegaram em formato inesperado. Tente novamente em instantes.'
  }
  return 'Não foi possível carregar a lista.'
}

export function discoveryErrorToastMessage(error: unknown): string {
  if (isTooManyRequests(error)) {
    return tmdbRateLimitUserMessage
  }
  if (error instanceof ApiError) {
    return `Falha ao buscar filmes (erro ${error.status}).`
  }
  if (isTmdbContractError(error)) {
    return 'Não foi possível validar os dados recebidos da API. Tente novamente mais tarde.'
  }
  return 'Falha ao buscar filmes. Verifique a conexão e tente novamente.'
}

export function curatedErrorToastMessage(
  error: unknown,
  list: CuratedListMode,
): string {
  const label = list === 'trending' ? 'Trending' : 'Popular'
  if (isTooManyRequests(error)) {
    return tmdbRateLimitUserMessage
  }
  if (error instanceof ApiError) {
    return `Falha ao carregar ${label} (erro ${error.status}).`
  }
  if (isTmdbContractError(error)) {
    return `Os dados de ${label} não puderam ser validados. Tente atualizar a página.`
  }
  return `Falha ao carregar ${label}.`
}

/** Falha genérica / dados ausentes na rota de detalhe (sem erro de rede). */
export const movieDetailGenericFailureMessage =
  'Não foi possível carregar os detalhes deste filme.' as const

export const invalidMovieIdParamMessage = 'ID de filme inválido.' as const

/** Toast na falha da query principal de detalhes — tom alinhado a discovery/curated. */
export function movieDetailErrorToastMessage(error: unknown): string {
  if (isTooManyRequests(error)) {
    return tmdbRateLimitUserMessage
  }
  if (error instanceof ApiError) {
    return `Falha ao carregar detalhes (erro ${error.status}).`
  }
  if (isTmdbContractError(error)) {
    return 'Não foi possível validar os dados deste filme. Tente novamente mais tarde.'
  }
  return 'Falha ao carregar os detalhes do filme. Verifique a conexão e tente novamente.'
}

export function movieDetailErrorMessage(error: unknown): string {
  if (isTooManyRequests(error)) {
    return tmdbRateLimitUserMessage
  }
  if (error instanceof ApiError) {
    return `Não foi possível carregar os detalhes (erro ${error.status}).`
  }
  if (isTmdbContractError(error)) {
    return 'Os dados deste filme chegaram em formato inesperado. Tente novamente mais tarde.'
  }
  return movieDetailGenericFailureMessage
}

export const movieCreditsEmptyMessage = 'Elenco indisponível.' as const

export const movieTrailerUnavailableMessage = 'Trailer não disponível.' as const

export const watchlistEmptyDescription =
  'Sua Watchlist está vazia. Adicione filmes em Discovery, Trending ou Popular.' as const

export const watchlistFilteredEmptyDescription =
  'Nenhum filme da sua watchlist corresponde aos filtros atuais.' as const

export function movieCreditsInlineErrorMessage(error: unknown): string {
  if (isTooManyRequests(error)) {
    return tmdbRateLimitUserMessage
  }
  if (error instanceof ApiError) {
    return `Não foi possível carregar o elenco (erro ${error.status}).`
  }
  if (isTmdbContractError(error)) {
    return 'Os dados do elenco chegaram em formato inesperado.'
  }
  return 'Não foi possível carregar o elenco.'
}
